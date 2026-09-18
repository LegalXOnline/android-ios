import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, View, type ViewProps } from 'react-native';

import { startCallService, stopCallService } from '@modules/call-service';
import type { AgoraSession } from '@services/consultations.service';

/**
 * The Agora RTC engine, wrapped so the rest of the app never imports it.
 *
 * react-native-agora is a native module: it is absent in Expo Go and on web,
 * and a top-level import there takes the whole bundle down. Loading it lazily
 * keeps every other screen working and lets the call screen say so plainly.
 *
 * createAgoraRtcEngine() does not create anything — it returns one process-wide
 * instance, and its event handlers live in a static array shared by every
 * caller. Two rooms therefore share one engine: the second join is refused
 * because the first never left, a stale room's handler still fires, and
 * release() from either tears down both. Everything below exists to keep that
 * single instance owned by exactly one room at a time.
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
 * Who currently owns the shared engine.
 *
 * A room claims this on mount and clears it on teardown. A room that no longer
 * holds it must not touch the engine: its cleanup would otherwise leave the
 * channel the *next* call just joined, which is how a call ends a second after
 * it connects.
 */
let owner: symbol | null = null;
let initialised = false;

/** Tears the shared engine down to a state the next room can claim cleanly. */
function teardown(agora: Agora, rtc: Agora, handler: unknown, video: boolean) {
  stopCallService();
  try {
    if (handler) rtc?.unregisterEventHandler(handler);
  } catch {
    // Never registered, or already gone with the engine.
  }
  try {
    if (video) rtc?.stopPreview();
  } catch {
    // Preview was never started.
  }
  try {
    rtc?.leaveChannel();
  } catch {
    // Not in a channel.
  }
  try {
    // release() is what frees the microphone and camera. Without it Android
    // keeps the in-call audio mode, and the ongoing-call chip keeps counting
    // long after the call screen is gone.
    rtc?.release();
  } catch {
    // Already released.
  }
  initialised = false;
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

/**
 * What Agora returns from initialize() and joinChannel().
 *
 * Both hand back a code rather than throwing, and both were being discarded —
 * so a rejected join looked exactly like one still in progress and the screen
 * sat on "Connecting..." forever with nothing to report. These are the codes
 * that actually come up in a consultation.
 */
function joinFailure(code: number): string | null {
  if (code === 0) return null;
  switch (code) {
    case -2:
      return 'This call is missing its credentials. Please rejoin from the lawyer\'s profile.';
    case -3:
      return 'The call service is still starting up. Please try again in a moment.';
    case -7:
      return 'The call service did not start on this device. Reopen the app and try again.';
    case -17:
      return 'You are already in this call on this device.';
    default:
      return `Could not join the call (error ${code}).`;
  }
}

/** Why a connection dropped or was refused, from onConnectionStateChanged. */
function connectionFailure(reason: number): string | null {
  switch (reason) {
    case 3:
      return 'This call was rejected because the credentials were not accepted.';
    case 8:
      return 'This call\'s access token is not valid. Please rejoin.';
    case 9:
      return 'This call\'s access token has expired. Please rejoin.';
    case 10:
      return 'This account is not allowed to join this call.';
    default:
      return null;
  }
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

  // hangUp() leaves before navigating away, and the unmount that follows must
  // not run the same teardown a second time against an engine another room may
  // by then have claimed.
  const releasedRef = useRef(false);

  useEffect(() => {
    if (!agora) return;

    const ticket = Symbol('call');
    let rtc: Agora = null;
    let handler: unknown = null;
    let cancelled = false;

    releasedRef.current = false;

    // A previous room that unmounted without unwinding still holds the shared
    // engine. Claiming it here is what lets a second call connect at all.
    if (owner && initialised) {
      try {
        agora.createAgoraRtcEngine()?.release();
      } catch {
        // Nothing to reclaim.
      }
      initialised = false;
    }
    owner = ticket;

    (async () => {
      try {
        const allowed = await grantCapture(video);
        if (cancelled || owner !== ticket) return;

        if (!allowed) {
          setError(
            video
              ? 'Camera and microphone access is needed for a video call. Enable them in Settings and rejoin.'
              : 'Microphone access is needed for a voice call. Enable it in Settings and rejoin.',
          );
          return;
        }

        rtc = agora.createAgoraRtcEngine();
        const initCode = rtc.initialize({
          appId: session.agoraAppId,
          // Every participant publishes and subscribes. The role in a
          // communication profile is ignored, which is why the server issues
          // publisher tokens for both sides.
          channelProfile: agora.ChannelProfileType.ChannelProfileCommunication,
        });
        initialised = true;

        if (typeof initCode === 'number' && initCode < 0) {
          setError(`The call service could not start on this device (error ${initCode}).`);
          teardown(agora, rtc, null, video);
          return;
        }

        handler = {
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
          // The state machine is where a refused join actually reports itself:
          // a bad token fails here, not on the joinChannel call.
          onConnectionStateChanged: (_conn: unknown, state: number, reason: number) => {
            if (cancelled) return;
            const failure = connectionFailure(reason);
            if (failure) setError(failure);
            // 5 = Failed. Anything else is still negotiating.
            else if (state === 5) setError('Could not connect to the call. Please rejoin.');
          },
        };
        rtc.registerEventHandler(handler);

        rtc.enableAudio();
        rtc.enableLocalAudio(true);

        if (video) {
          rtc.enableVideo();
          rtc.enableLocalVideo(true);
          rtc.startPreview();
        } else {
          rtc.disableVideo();
        }

        // Ownership can change during the awaits above. Joining after that
        // point puts a dead room into a live channel that nothing will leave.
        if (cancelled || owner !== ticket) {
          teardown(agora, rtc, handler, video);
          return;
        }

        // Started before the join, not after: the grant has to be held by the
        // time capture begins, or a client who backgrounds the app during the
        // connect goes silent without either side being told.
        startCallService(video);

        const joinCode = rtc.joinChannel(session.token, session.channelName, session.uid, {
          clientRoleType: agora.ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          publishCameraTrack: video,
          autoSubscribeAudio: true,
          autoSubscribeVideo: video,
        });

        const rejected = typeof joinCode === 'number' ? joinFailure(joinCode) : null;
        if (rejected) {
          setError(rejected);
          teardown(agora, rtc, handler, video);
          return;
        }

        setEngine(rtc);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      if (owner !== ticket) return;
      owner = null;
      if (!releasedRef.current) teardown(agora, rtc, handler, video);
    };
  }, [agora, session.agoraAppId, session.token, session.channelName, session.uid, video]);

  /**
   * A join that neither succeeds nor reports anything.
   *
   * Agora can leave the connection negotiating indefinitely — no success, no
   * error, no state change — and the screen then shows "Connecting..." until
   * the caller gives up. Saying so is worth more than spinning forever.
   */
  useEffect(() => {
    if (!agora || joined || error) return;
    const t = setTimeout(() => {
      setError('Could not reach the call service. Check your connection and rejoin.');
    }, 20_000);
    return () => clearTimeout(t);
  }, [agora, joined, error]);

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
    if (releasedRef.current) return;
    releasedRef.current = true;
    owner = null;
    if (agora && engine) teardown(agora, engine, null, video);
  }, [agora, engine, video]);

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
