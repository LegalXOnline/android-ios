const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Trims the native payload.
 *
 * Two separate problems, both measured from the built APK rather than guessed:
 *
 * 1. ABIs. expo-build-properties' buildArchs only narrows what React Native
 *    compiles for itself; prebuilt libraries from Maven ignore it. abiFilters
 *    is the part that covers them.
 *
 * 2. Extensions. io.agora.rtc:full-sdk ships every optional module — lip sync,
 *    spatial audio, virtual background, face capture, beautification, AV1.
 *    A legal consultation needs none of them, and together they are 29 MB of a
 *    106 MB build. The core RTC library, the encoder and echo cancellation
 *    stay; everything below is opt-in at runtime and never opted into.
 */
const ABIS = ['arm64-v8a'];

const UNUSED_AGORA_EXTENSIONS = [
  'libagora_lip_sync_extension.so',
  'libagora_clear_vision_extension.so',
  'libagora_spatial_audio_extension.so',
  'libagora_face_capture_extension.so',
  'libagora_face_detection_extension.so',
  'libagora_segmentation_extension.so',
  'libagora_audio_beauty_extension.so',
  'libagora_content_inspect_extension.so',
  'libagora_video_quality_analyzer_extension.so',
  'libagora_video_av1_encoder_extension.so',
  'libagora_screen_capture_extension.so',
];

/**
 * NOT excludable, however unused the feature sounds: libagora-ffmpeg.so.
 *
 * It reads like a MediaPlayer dependency and was dropped on that assumption.
 * It is a DT_NEEDED entry of libagora-rtc-sdk.so itself, so removing it makes
 * the core RTC library fail to load — dlopen returns null, every engine call
 * then no-ops, and voice and video both sit on "Connecting..." forever with no
 * error raised anywhere, because nothing native is running to raise one.
 *
 * Verified by reading the ELF dynamic section of the built APK:
 *   libagora-rtc-sdk.so -> libagora-ffmpeg, libagora-fdkaac, libagora-soundtouch,
 *                          libaosl, libvideo_dec
 * Anything on that list has to ship. The extensions above are dlopen'd by name
 * at runtime and are genuinely optional.
 */

module.exports = function withNativeTrim(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') return cfg;

    if (!cfg.modResults.contents.includes('abiFilters')) {
      cfg.modResults.contents = cfg.modResults.contents.replace(
        /(defaultConfig\s*\{)/,
        `$1
        ndk {
            abiFilters ${ABIS.map((a) => `'${a}'`).join(', ')}
        }`,
      );
    }

    // The template already writes a packagingOptions.jniLibs block for legacy
    // packaging, so the excludes go inside it rather than in a second one.
    if (!cfg.modResults.contents.includes('libagora_lip_sync_extension')) {
      const excludes = UNUSED_AGORA_EXTENSIONS.map(
        (lib) => `            excludes += ['**/${lib}']`,
      ).join('\n');

      cfg.modResults.contents = cfg.modResults.contents.replace(
        /(packagingOptions\s*\{\s*jniLibs\s*\{)/,
        `$1\n${excludes}`,
      );
    }

    return cfg;
  });
};
