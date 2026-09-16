import { useCallback, useEffect, useMemo, useState } from 'react';
import { PermissionsAndroid, Platform, View, type ViewProps } from 'react-native';

import type { AgoraSession } from '@services/consultations.service';

/**
 * The Agora RTC engine, wrapped so the rest of the app never imports it.
 *
 * react-native-agora is a native module: it is absent in Expo Go and on web,
 * and a top-level import there takes the whole bundle down. Loading it lazily
 * keeps every other screen working and lets the call screen say so plainly.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agora = any;

function loadAgora(): Agora | null {
  if (Platform.OS === 'web') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-agora');
  } catch {
    return null;
  }
}

/**
 * Camera and microphone, asked for at runtime.
 *
 * Declaring them in the manifest only makes them requestable. Without the
 * grant Agora's capture fails silently — the call still receives the other
 * side, so it looks like it is working while publishing nothing. That is
 * exactly how a video call ends up one-way.
 */
async function grantCapture(video: boolean): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const wanted = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
  if (video) wanted.push(PermissionsAndroid.PERMISSIONS.CAMERA);

  const result = await PermissionsAndroid.requestMultiple(wanted);
  return wanted.every((p) => result[p] === PermissionsAndroid.RESULTS.GRANTED);
}

interface EngineState {
  ready: boolean;
  /** True where the native module is not present at all. */
  unavailable: boolean;
  joined: boolean;
  remoteUid: number | null;
  remoteLeft: boolean;
  error: string | null;
  muted: boolean;
  cameraOff: boolean;
  RemoteView: (props: ViewProps & { uid: number }) => React.ReactElement;
  LocalView: (props: ViewProps) => React.ReactElement;
  toggleMute: () => void;
  toggleCamera: () => void;
  switchCamera: () => void;
  leave: () => Promise<void>;
}

export function useAgoraEngine(session: AgoraSession): EngineState {
  const agora = useMemo(() => loadAgora(), []);
  const video = session.type === 'video';

  const [engine, setEngine] = useState<Agora>(null);
  const [ready, setReady] = useState(false);
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [remoteLeft, setRemoteLeft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    if (!agora) return;

    let cancelled = false;
    let rtc: Agora = null;

    (async () => {
      try {
        const allowed = await grantCapture(video);
        if (cancelled) return;
        if (!allowed) {
          setError(
            video
              ? 'Camera and microphone access is needed for a video call. Enable them in Settings and rejoin.'
              : 'Microphone access is needed for a voice call. Enable it in Settings and rejoin.',
          );
          return;
        }

        rtc = agora.createAgoraRtcEngine();
        rtc.initialize({
          appId: session.agoraAppId,
          // Every participant publishes and subscribes. The role in a
          // communication profile is ignored, which is why the server issues
          // publisher tokens for both sides.
          channelProfile: agora.ChannelProfileType.ChannelProfileCommunication,
        });

        rtc.registerEventHandler({
          onJoinChannelSuccess: () => {
            if (!cancelled) {
              setJoined(true);
              setReady(true);
            }
          },
          onUserJoined: (_conn: unknown, uid: number) => {
            if (!cancelled) {
              setRemoteUid(uid);
              setRemoteLeft(false);
            }
          },
          onUserOffline: (_conn: unknown, uid: number) => {
            if (cancelled) return;
            setRemoteUid((current) => (current === uid ? null : current));
            setRemoteLeft(true);
          },
          onError: (code: number, msg: string) => {
            if (!cancelled) setError(msg || `Call error ${code}`);
          },
        });

        rtc.enableAudio();
        rtc.enableLocalAudio(true);

        if (video) {
          rtc.enableVideo();
          rtc.enableLocalVideo(true);
          rtc.startPreview();
        } else {
          rtc.disableVideo();
        }

        rtc.joinChannel(session.token, session.channelName, session.uid, {
          clientRoleType: agora.ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          publishCameraTrack: video,
          autoSubscribeAudio: true,
          autoSubscribeVideo: video,
        });

        if (!cancelled) setEngine(rtc);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      try {
        rtc?.leaveChannel();
        rtc?.release();
      } catch {
        // Already gone. Nothing to unwind.
      }
    };
  }, [agora, session.agoraAppId, session.token, session.channelName, session.uid, video]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      engine?.muteLocalAudioStream(!m);
      return !m;
    });
  }, [engine]);

  const toggleCamera = useCallback(() => {
    setCameraOff((off) => {
      engine?.muteLocalVideoStream(!off);
      return !off;
    });
  }, [engine]);

  const switchCamera = useCallback(() => {
    engine?.switchCamera();
  }, [engine]);

  const leave = useCallback(async () => {
    try {
      engine?.leaveChannel();
      engine?.release();
    } catch {
      // Already released.
    }
  }, [engine]);

  const RemoteView = useCallback(
    (props: ViewProps & { uid: number }) => {
      if (!agora) return <View {...props} />;
      const { RtcSurfaceView } = agora;
      return <RtcSurfaceView {...props} canvas={{ uid: props.uid }} />;
    },
    [agora],
  );

  const LocalView = useCallback(
    (props: ViewProps) => {
      if (!agora) return <View {...props} />;
      const { RtcSurfaceView } = agora;
      return <RtcSurfaceView {...props} canvas={{ uid: 0 }} />;
    },
    [agora],
  );

  return {
    ready,
    unavailable: !agora,
    joined,
    remoteUid,
    remoteLeft,
    error,
    muted,
    cameraOff,
    RemoteView,
    LocalView,
    toggleMute,
    toggleCamera,
    switchCamera,
    leave,
  };
}
