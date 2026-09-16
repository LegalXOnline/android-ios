import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { LX, LXShape, LXType } from '@theme';

/** The one place a feed shows loading, failure or emptiness. */
export function FeedState({
  busy,
  error,
  emptyTitle,
  emptyBody,
  onRetry,
}: {
  busy: boolean;
  error: string | null;
  emptyTitle: string;
  emptyBody: string;
  onRetry: () => void;
}) {
  if (busy) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={LX.gold} />
      </View>
    );
  }

  return (
    <View style={styles.state}>
      <SymbolView
        name={
          error
            ? { ios: 'wifi.exclamationmark', android: 'cloud_off', web: 'cloud_off' }
            : { ios: 'doc.text.magnifyingglass', android: 'search_off', web: 'search_off' }
        }
        size={30}
        tintColor={LX.inkFaint}
      />
      <Text style={styles.title}>{error ? 'Could not load' : emptyTitle}</Text>
      <Text style={styles.body}>{error ?? emptyBody}</Text>
      {error && (
        <Pressable onPress={onRetry} style={styles.retry}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', gap: 8, paddingTop: 60, paddingHorizontal: 30 },
  title: { ...LXType.titleSmall, color: LX.ink },
  body: { ...LXType.bodySmall, color: LX.inkMuted, textAlign: 'center' },
  retry: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: LXShape.full,
    backgroundColor: LX.gold,
  },
  retryText: { ...LXType.label, fontSize: 14, color: LX.onGold },
});
