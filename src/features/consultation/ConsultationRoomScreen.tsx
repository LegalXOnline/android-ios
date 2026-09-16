import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getAgoraSession,
  type AgoraSession,
  type ConsultationType,
} from '@services/consultations.service';
import { useGoBack } from '@shared/hooks/useGoBack';
import { LX, LXShape, LXType } from '@theme';

import { CallRoom } from './CallRoom';
import { ChatRoomScreen } from './ChatRoomScreen';

/**
 * Routes a consultation to the right room.
 *
 * The type comes from the server rather than the link: a session that was
 * booked as video is a video call whatever the caller navigated with.
 */
export function ConsultationRoomScreen({
  consultationId,
  counterpartName,
  feePerMinute,
  initialType,
}: {
  consultationId: string;
  counterpartName?: string;
  feePerMinute?: number | null;
  initialType: ConsultationType;
}) {
  const insets = useSafeAreaInsets();
  const goBack = useGoBack('/(tabs)/talk-to-lawyer');

  const [session, setSession] = useState<AgoraSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(consultationId));

  useEffect(() => {
    if (!consultationId) return;

    let cancelled = false;
    (async () => {
      try {
        const s = await getAgoraSession(consultationId);
        if (!cancelled) setSession(s);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [consultationId]);

  if (loading) {
    return (
      <View style={[styles.centre, { paddingTop: insets.top }]}>
        <ActivityIndicator color={LX.gold} size="large" />
        <Text style={styles.wait}>Joining…</Text>
      </View>
    );
  }

  if (!consultationId || error || !session) {
    return (
      <View style={[styles.centre, { paddingTop: insets.top }]}>
        <Text style={styles.errorTitle}>Could not join</Text>
        <Text style={styles.errorBody}>
          {!consultationId
            ? 'That link is missing a consultation.'
            : (error ?? 'This consultation is no longer available.')}
        </Text>
        <Text onPress={goBack} style={styles.back}>
          Go back
        </Text>
      </View>
    );
  }

  const type = session.type ?? initialType;

  if (type === 'chat') {
    return (
      <ChatRoomScreen
        consultationId={consultationId}
        counterpartName={session.counterpartName ?? counterpartName}
        feePerMinute={session.feePerMinute ?? feePerMinute}
      />
    );
  }

  return <CallRoom session={session} onLeave={goBack} />;
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 30,
    backgroundColor: LX.bg,
  },
  wait: { ...LXType.bodySmall, color: LX.inkMuted },
  errorTitle: { ...LXType.title, color: LX.ink },
  errorBody: { ...LXType.body, color: LX.inkMuted, textAlign: 'center' },
  back: {
    ...LXType.label,
    color: LX.onGold,
    backgroundColor: LX.gold,
    borderRadius: LXShape.full,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 8,
  },
});
