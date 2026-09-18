import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

/**
 * The call foreground service.
 *
 * Android only, and optional even there: the module is absent in Expo Go and on
 * web, where a missing native module would otherwise take the bundle down. A
 * call still works without it — right up until the app is backgrounded.
 */
interface CallServiceNative {
  start: (video: boolean) => boolean;
  stop: () => boolean;
}

const native = requireOptionalNativeModule<CallServiceNative>('CallService');

export function startCallService(video: boolean): void {
  if (Platform.OS !== 'android' || !native) return;
  try {
    native.start(video);
  } catch {
    // Losing background capture is worse than a crash here would be useful.
  }
}

export function stopCallService(): void {
  if (Platform.OS !== 'android' || !native) return;
  try {
    native.stop();
  } catch {
    // Already stopped, or the service never started.
  }
}
