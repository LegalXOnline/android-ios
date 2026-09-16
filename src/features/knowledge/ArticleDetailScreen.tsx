import { useRouter, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
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
  categoryLabel,
  categoryTone,
  ctaFor,
  displayReviewer,
  formatReviewed,
  getCard,
  requiresKanoonAttribution,
  type KnowledgeCardDetail,
  type RelatedCard,
} from '@services/knowledge.service';
import { LXCard } from '@shared/components/lx';
import { LX, LXShape, LXType } from '@theme';

export function ArticleDetailScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [card, setCard] = useState<KnowledgeCardDetail | null>(null);
  const [related, setRelated] = useState<RelatedCard[]>([]);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  /** Retry, from the button. Event handlers may set state directly. */
  const retry = useCallback(() => {
    setAttempt((n) => n + 1);
    setLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await getCard(slug);
        if (cancelled) return;
        setCard(res.card);
        setRelated(res.related);
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

  if (!slug || error || !card) {
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
            {!slug ? 'That link is missing a card.' : (error ?? 'That card is no longer published.')}
          </Text>
          {slug && (
            <Pressable onPress={retry} style={styles.retry}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  const tone = categoryTone(card.category);
  const cta = ctaFor(card.cta_type);
  const reviewer = displayReviewer(card.reviewed_by);
  const reviewed = formatReviewed(card.last_reviewed_at);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <TopBar onBack={back} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.tag, { backgroundColor: tone.bg }]}>
          <Text style={[styles.tagText, { color: tone.fg }]}>{categoryLabel(card.category)}</Text>
        </View>

        <Text style={styles.title}>{card.title}</Text>

        <LXCard style={styles.answerCard}>
          <Text style={styles.answerLabel}>THE SHORT ANSWER</Text>
          <Text style={styles.answer}>{card.direct_answer}</Text>
        </LXCard>

        {card.case_reference && (
          <View style={styles.refRow}>
            <SymbolView
              name={{ ios: 'text.book.closed', android: 'gavel', web: 'gavel' }}
              size={15}
              tintColor={LX.goldText}
            />
            <Text style={styles.ref}>{card.case_reference}</Text>
          </View>
        )}

        {card.explanation && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>What this means</Text>
            <Text style={styles.body}>{card.explanation}</Text>
          </View>
        )}

        {card.suggested_questions && card.suggested_questions.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Worth asking a lawyer</Text>
            {card.suggested_questions.map((q) => (
              <View key={q} style={styles.bullet}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>{q}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => router.push(cta.route as Href)}
          style={({ pressed }) => [styles.cta, pressed && { backgroundColor: LX.goldPressed }]}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>{cta.label}</Text>
          <SymbolView
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={17}
            tintColor={LX.onGold}
          />
        </Pressable>

        {related.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Related</Text>
            {related.map((r) => (
              <LXCard
                key={r.slug}
                style={styles.relatedCard}
                onPress={() => router.push(`/knowledge/${r.slug}` as Href)}
              >
                <Text style={styles.relatedTitle} numberOfLines={2}>
                  {r.title}
                </Text>
                <Text style={styles.relatedBody} numberOfLines={2}>
                  {r.direct_answer}
                </Text>
              </LXCard>
            ))}
          </View>
        )}

        <View style={styles.provenance}>
          {reviewed !== '' && (
            <Text style={styles.meta}>
              Last reviewed {reviewed}
              {reviewer ? ` by ${reviewer}` : ''}
            </Text>
          )}

          {card.source_url && (
            <Pressable onPress={() => Linking.openURL(card.source_url as string)} hitSlop={8}>
              <Text style={styles.sourceLink}>
                {requiresKanoonAttribution(card.source)
                  ? 'Source: indiankanoon.org'
                  : 'View the source document'}
              </Text>
            </Pressable>
          )}

          <Text style={styles.disclaimer}>
            General information on Indian law, not advice on your situation. Speak to an advocate
            before acting on it.
          </Text>
        </View>
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
      <Text style={styles.topTitle}>Know your rights</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LX.bg },
  centre: { alignItems: 'center', justifyContent: 'center' },

  topBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 52 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { ...LXType.label, fontSize: 14, color: LX.inkMuted },

  content: { paddingHorizontal: 18, paddingTop: 6, gap: 16 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: LXShape.xs },
  tagText: { ...LXType.overline, fontSize: 10 },
  title: { ...LXType.display, fontSize: 27, lineHeight: 34, color: LX.ink },

  answerCard: { padding: 17, gap: 7, borderColor: LX.goldSoft, backgroundColor: LX.goldSofter },
  answerLabel: { ...LXType.overline, fontSize: 10, color: LX.goldText },
  answer: { ...LXType.body, fontSize: 17, lineHeight: 25, fontWeight: '600', color: LX.ink },

  refRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  ref: { ...LXType.bodySmall, color: LX.goldText, flex: 1 },

  block: { gap: 9 },
  blockTitle: { ...LXType.title, fontSize: 18, color: LX.ink },
  body: { ...LXType.body, lineHeight: 24, color: LX.inkMuted },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: LX.gold, marginTop: 9 },
  bulletText: { flex: 1, ...LXType.body, color: LX.inkMuted },

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

  relatedCard: { padding: 14, gap: 5 },
  relatedTitle: { ...LXType.titleSmall, fontSize: 15, color: LX.ink },
  relatedBody: { ...LXType.bodySmall, color: LX.inkMuted },

  provenance: { gap: 8, marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: LX.border },
  meta: { ...LXType.bodySmall, fontSize: 12, color: LX.inkFaint },
  sourceLink: { ...LXType.bodySmall, fontSize: 12, color: LX.goldText, textDecorationLine: 'underline' },
  disclaimer: { ...LXType.bodySmall, fontSize: 11.5, lineHeight: 17, color: LX.inkFaint },

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
