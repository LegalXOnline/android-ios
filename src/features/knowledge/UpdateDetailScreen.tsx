import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getShort,
  shortCategoryLabel,
  shortCategoryTone,
  timeAgo,
  type LegalShort,
} from '@services/knowledge.service';
import { LXCard } from '@shared/components/lx';
import { LX, LXShape, LXType } from '@theme';

export function UpdateDetailScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [short, setShort] = useState<LegalShort | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await getShort(slug);
        if (!cancelled) setShort(res.short);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const back = () =>
    router.canGoBack() ? router.back() : router.replace('/(tabs)/knowledge-centre');

  if (loading) {
    return (
      <View style={[styles.screen, styles.centre, { paddingTop: insets.top }]}>
        <ActivityIndicator color={LX.gold} size="large" />
      </View>
    );
  }

  if (!slug || error || !short) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <TopBar onBack={back} />
        <View style={styles.state}>
          <SymbolView
            name={{ ios: 'wifi.exclamationmark', android: 'cloud_off', web: 'cloud_off' }}
            size={30}
            tintColor={LX.inkFaint}
          />
          <Text style={styles.stateTitle}>Could not open this</Text>
          <Text style={styles.stateBody}>
            {!slug ? 'That link is missing an update.' : (error ?? 'This update is no longer published.')}
          </Text>
          {slug && (
            <Pressable
              onPress={() => {
                setLoading(true);
                setError(null);
                setAttempt((n) => n + 1);
              }}
              style={styles.retry}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  const tone = shortCategoryTone(short.category);
  const actionable = short.relevance_tier === 'high';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <TopBar onBack={back} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: tone.bg }]}>
            <Text style={[styles.tagText, { color: tone.fg }]}>
              {shortCategoryLabel(short.category)}
            </Text>
          </View>
          {actionable && (
            <View style={styles.actionTag}>
              <SymbolView
                name={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }}
                size={11}
                tintColor={LX.goldText}
              />
              <Text style={styles.actionText}>ACT ON THIS</Text>
            </View>
          )}
          <View style={styles.spacer} />
          <Text style={styles.age}>{timeAgo(short.published_at ?? short.created_at)}</Text>
        </View>

        <Text style={styles.title}>{short.title}</Text>

        {short.takeaway && (
          <LXCard style={styles.takeaway}>
            <Text style={styles.takeawayLabel}>WHAT IT MEANS FOR YOU</Text>
            <Text style={styles.takeawayText}>{short.takeaway}</Text>
          </LXCard>
        )}

        {(short.affects_whom || short.deadline) && (
          <View style={styles.factRow}>
            {short.affects_whom && (
              <View style={styles.fact}>
                <Text style={styles.factLabel}>WHO IT AFFECTS</Text>
                <Text style={styles.factValue}>{short.affects_whom}</Text>
              </View>
            )}
            {short.deadline && (
              <View style={styles.fact}>
                <Text style={styles.factLabel}>DEADLINE</Text>
                <Text style={[styles.factValue, { color: LX.danger }]}>{short.deadline}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.block}>
          <Text style={styles.blockTitle}>The detail</Text>
          <Text style={styles.body}>{short.summary}</Text>
        </View>

        {short.key_points && short.key_points.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Key points</Text>
            {short.key_points.map((point) => (
              <View key={point} style={styles.bullet}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {short.statute_reference && (
          <View style={styles.refRow}>
            <SymbolView
              name={{ ios: 'text.book.closed', android: 'gavel', web: 'gavel' }}
              size={15}
              tintColor={LX.goldText}
            />
            <Text style={styles.ref}>{short.statute_reference}</Text>
          </View>
        )}

        <Pressable
          onPress={() => router.push('/(tabs)/talk-to-lawyer')}
          style={({ pressed }) => [styles.cta, pressed && { backgroundColor: LX.goldPressed }]}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Talk to a lawyer about this</Text>
          <SymbolView
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={17}
            tintColor={LX.onGold}
          />
        </Pressable>

        {short.source_url && (
          <Pressable
            onPress={() => Linking.openURL(short.source_url as string)}
            style={({ pressed }) => [styles.source, pressed && { backgroundColor: LX.surfaceHover }]}
            accessibilityRole="link"
          >
            <SymbolView
              name={{ ios: 'link', android: 'link', web: 'link' }}
              size={16}
              tintColor={LX.ink}
            />
            <View style={styles.sourceText}>
              <Text style={styles.sourceTitle}>Read the original</Text>
              {short.source_name && (
                <Text style={styles.sourceName} numberOfLines={1}>
                  {short.source_name}
                </Text>
              )}
            </View>
            <SymbolView
              name={{ ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' }}
              size={15}
              tintColor={LX.inkFaint}
            />
          </Pressable>
        )}

        <Text style={styles.disclaimer}>
          A summary of a public source, not advice on your situation. Speak to an advocate before
          acting on it.
        </Text>
      </ScrollView>
    </View>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.backButton}
      >
        <SymbolView
          name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
          size={20}
          tintColor={LX.ink}
        />
      </Pressable>
      <Text style={styles.topTitle}>Legal update</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LX.bg },
  centre: { alignItems: 'center', justifyContent: 'center' },

  topBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 52 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topTitle: { ...LXType.label, fontSize: 14, color: LX.inkMuted },

  content: { paddingHorizontal: 18, paddingTop: 6, gap: 16 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  spacer: { flex: 1 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: LXShape.xs },
  tagText: { ...LXType.overline, fontSize: 10 },
  actionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: LXShape.xs,
    backgroundColor: LX.goldSoft,
  },
  actionText: { ...LXType.overline, fontSize: 9, color: LX.goldText },
  age: { ...LXType.bodySmall, fontSize: 12, color: LX.inkFaint },

  title: { ...LXType.display, fontSize: 27, lineHeight: 34, color: LX.ink },

  takeaway: { padding: 17, gap: 7, borderColor: LX.goldSoft, backgroundColor: LX.goldSofter },
  takeawayLabel: { ...LXType.overline, fontSize: 10, color: LX.goldText },
  takeawayText: { ...LXType.body, fontSize: 16, lineHeight: 24, color: LX.ink },

  factRow: { flexDirection: 'row', gap: 11 },
  fact: {
    flex: 1,
    gap: 4,
    padding: 13,
    borderRadius: LXShape.md,
    backgroundColor: LX.surfaceSunken,
  },
  factLabel: { ...LXType.overline, fontSize: 9.5, color: LX.inkFaint },
  factValue: { ...LXType.bodySmall, color: LX.ink },

  block: { gap: 9 },
  blockTitle: { ...LXType.title, fontSize: 18, color: LX.ink },
  body: { ...LXType.body, lineHeight: 24, color: LX.inkMuted },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: LX.gold, marginTop: 9 },
  bulletText: { flex: 1, ...LXType.body, color: LX.inkMuted },

  refRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  ref: { ...LXType.bodySmall, color: LX.goldText, flex: 1 },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 56,
    borderRadius: LXShape.full,
    backgroundColor: LX.gold,
    marginTop: 4,
  },
  ctaText: { ...LXType.titleSmall, color: LX.onGold },

  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: LXShape.md,
    borderWidth: 1,
    borderColor: LX.border,
    backgroundColor: LX.surface,
  },
  sourceText: { flex: 1, gap: 2 },
  sourceTitle: { ...LXType.label, fontSize: 14, color: LX.ink },
  sourceName: { ...LXType.bodySmall, fontSize: 12, color: LX.inkFaint },

  disclaimer: {
    ...LXType.bodySmall,
    fontSize: 11.5,
    lineHeight: 17,
    color: LX.inkFaint,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: LX.border,
  },

  state: { alignItems: 'center', gap: 8, paddingTop: 70, paddingHorizontal: 30 },
  stateTitle: { ...LXType.titleSmall, color: LX.ink },
  stateBody: { ...LXType.bodySmall, color: LX.inkMuted, textAlign: 'center' },
  retry: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: LXShape.full,
    backgroundColor: LX.gold,
  },
  retryText: { ...LXType.label, fontSize: 14, color: LX.onGold },
});
