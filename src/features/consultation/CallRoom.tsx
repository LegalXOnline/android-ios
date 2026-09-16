import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { endConsultation, type AgoraSession } from '@services/consultations.service';
import { LX, LXShape, LXType } from '@theme';

import { useAgoraEngine } from './useAgoraEngine';

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Voice and video.
 *
 * The lawyer is on the website in the same Agora channel; neither side knows
 * or cares which client the other is using. The channel name, the token and
 * the uid all come from the server — the App Certificate never reaches a
 * device, so a token cannot be minted here.
 */
export function CallRoom({ session, onLeave }: { session: AgoraSession; onLeave: () => void }) {
  const insets = useSafeAreaInsets();
  const video = session.type === 'video';

  const {
    ready,
    unavailable,
    joined,
    remoteUid,
    remoteLeft,
    error,
    RemoteView,
    LocalView,
    toggleMute,
    toggleCamera,
    switchCamera,
    muted,
    cameraOff,
    leave,
  } = useAgoraEngine(session);

  const [seconds, setSeconds] = useState(0);
  const [ending, setEnding] = useState(false);
  const startedRef = useRef<number | null>(null);

  // The clock starts when the other side actually arrives, not when this
  // screen mounts — nobody should be billed for waiting.
  useEffect(() => {
    if (remoteUid === null) return;
    if (startedRef.current === null) startedRef.current = Date.now();

    const tick = setInterval(() => {
      if (startedRef.current !== null) {
        setSeconds(Math.floor((Date.now() - startedRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [remoteUid]);

  const hangUp = useCallback(async () => {
    setEnding(true);
    try {
      await leave();
      await endConsultation(session.consultationId);
    } catch {
      // Leaving locally already happened; a failed settle is the server's
      // problem to reconcile, not a reason to trap the user in the call.
    } finally {
      onLeave();
    }
  }, [leave, session.consultationId, onLeave]);

  // The moment the other side hangs up, this side follows. A call with one
  // participant is over, and leaving it running keeps billing a dead line.
  useEffect(() => {
    if (!remoteLeft) return;
    const t = setTimeout(() => void hangUp(), 1200);
    return () => clearTimeout(t);
  }, [remoteLeft, hangUp]);

  const cost =
    session.feePerMinute && seconds > 0
      ? Math.max(1, Math.ceil(seconds / 60)) * session.feePerMinute
      : null;

  if (unavailable) {
    return (
      <View style={[styles.stage, styles.centre, { paddingTop: insets.top }]}>
        <SymbolView
          name={{ ios: 'video.slash', android: 'videocam_off', web: 'videocam_off' }}
          size={34}
          tintColor={LX.inkFaint}
        />
        <Text style={styles.title}>Calls need the installed app</Text>
        <Text style={styles.body}>
          Voice and video run on a native module that this preview cannot load.
          {Platform.OS === 'web'
            ? ' Open the build on a device to take the call.'
            : ' Rebuild the app to include it.'}
        </Text>
        <Pressable onPress={onLeave} style={styles.secondary}>
          <Text style={styles.secondaryLabel}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.stage, { paddingTop: insets.top }]}>
      <View style={styles.remote}>
        {video && remoteUid !== null ? (
          <RemoteView style={StyleSheet.absoluteFill} uid={remoteUid} />
        ) : (
          <View style={styles.waiting}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(session.counterpartName ?? 'LX').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>{session.counterpartName ?? 'Advocate'}</Text>
            <Text style={styles.status}>
              {error
                ? error
                : remoteLeft
                  ? 'The advocate has left. Ending…'
                  : remoteUid !== null
                    ? session.type === 'voice'
                      ? 'Connected'
                      : 'Camera off'
                    : joined
                      ? 'Waiting for the advocate to join…'
                      : 'Connecting…'}
            </Text>
            {!ready && !error && <ActivityIndicator color={LX.gold} style={styles.spinner} />}
          </View>
        )}

        {video && joined && !cameraOff && (
          <View style={styles.pip}>
            <LocalView style={StyleSheet.absoluteFill} />
          </View>
        )}

        <View style={styles.clock}>
          <Text style={styles.clockText}>{mmss(seconds)}</Text>
          {cost !== null && <Text style={styles.clockCost}>₹{cost}</Text>}
        </View>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom + 18 }]}>
        <ControlButton
          label={muted ? 'Unmute' : 'Mute'}
          icon={
            muted
              ? { ios: 'mic.slash.fill', android: 'mic_off', web: 'mic_off' }
              : { ios: 'mic.fill', android: 'mic', web: 'mic' }
          }
          active={muted}
          onPress={toggleMute}
        />

        {video && (
          <ControlButton
            label={cameraOff ? 'Camera on' : 'Camera off'}
            icon={
              cameraOff
                ? { ios: 'video.slash.fill', android: 'videocam_off', web: 'videocam_off' }
                : { ios: 'video.fill', android: 'videocam', web: 'videocam' }
            }
            active={cameraOff}
            onPress={toggleCamera}
          />
        )}

        {video && (
          <ControlButton
            label="Flip camera"
            icon={{ ios: 'arrow.triangle.2.circlepath.camera', android: 'flip_camera_ios', web: 'flip_camera_ios' }}
            onPress={switchCamera}
          />
        )}

        <Pressable
          onPress={hangUp}
          disabled={ending}
          accessibilityRole="button"
          accessibilityLabel="End call"
          style={[styles.hangUp, ending && { opacity: 0.6 }]}
        >
          <SymbolView
            name={{ ios: 'phone.down.fill', android: 'call_end', web: 'call_end' }}
            size={26}
            tintColor="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

function ControlButton({
  label,
  icon,
  active = false,
  onPress,
}: {
  label: string;
  icon: Parameters<typeof SymbolView>[0]['name'];
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.control, active && styles.controlActive]}
    >
      <SymbolView name={icon} size={22} tintColor={active ? LX.ink : '#FFFFFF'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: '#121212' },
  centre: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32 },
  title: { ...LXType.title, color: '#FFFFFF', textAlign: 'center' },
  body: { ...LXType.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  secondary: {
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: LXShape.full,
    backgroundColor: LX.gold,
  },
  secondaryLabel: { ...LXType.label, color: LX.onGold },

  remote: { flex: 1 },
  waiting: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: LX.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...LXType.headline, color: LX.goldText },
  name: { ...LXType.title, color: '#FFFFFF' },
  status: { ...LXType.bodySmall, color: 'rgba(255,255,255,0.65)', textAlign: 'center', paddingHorizontal: 30 },
  spinner: { marginTop: 6 },

  pip: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 104,
    height: 150,
    borderRadius: LXShape.md,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  clock: {
    position: 'absolute',
    left: 14,
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: LXShape.full,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  clockText: { ...LXType.label, color: '#FFFFFF', fontVariant: ['tabular-nums'] },
  clockCost: { ...LXType.label, color: LX.gold },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingTop: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  control: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  controlActive: { backgroundColor: '#FFFFFF' },
  hangUp: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LX.danger,
  },
});
