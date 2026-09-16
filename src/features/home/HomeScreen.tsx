import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@providers/AuthProvider';
import { useIdentity } from '@providers/ProfileProvider';
import { Avatar } from '@shared/components';
import { LXCard, LXIconChip, LXPill, LXSectionHeader } from '@shared/components/lx';
import {
  useTabBarAutoHide,
  useTabBarInset,
} from '@shared/components/navigation/FloatingTabBar';
import { LX, LXShape, LXType } from '@theme';

import { getServices, type ServiceCard as ServiceCardData } from '@services/services.service';
import { getLawyers, toListRow, type LawyerListRow } from '@services/lawyers.service';

const LOGO = require('../../../assets/images/legalx-mark.png');

interface Shortcut {
  key: string;
  symbol: SymbolViewProps['name'];
  title: string;
  caption: string;
  href: Href;
}

const SHORTCUTS: Shortcut[] = [
  {
    key: 'docs',
    symbol: { ios: 'doc.text.fill', android: 'description', web: 'description' },
    title: 'Docs',
    caption: '8 services',
    href: '/(tabs)/documentation',
  },
  {
    key: 'learn',
    symbol: { ios: 'book.fill', android: 'menu_book', web: 'menu_book' },
    title: 'Learn',
    caption: 'Know your rights',
    href: '/(tabs)/knowledge-centre',
  },
  {
    key: 'lawyers',
    symbol: { ios: 'bubble.left.fill', android: 'support_agent', web: 'support_agent' },
    title: 'Lawyers',
    caption: 'Consult now',
    href: '/(tabs)/talk-to-lawyer',
  },
];

export function HomeScreen() {
  const { onScroll } = useTabBarAutoHide();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const { user, refresh } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [lawyers, setLawyers] = useState<LawyerListRow[]>([]);
  const [attempt, setAttempt] = useState(0);

  // Both rails are read from the same endpoints the rest of the app uses. A
  // failure leaves the rail empty rather than showing invented advocates.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [svc, law] = await Promise.allSettled([getServices(), getLawyers()]);
      if (cancelled) return;
      if (svc.status === 'fulfilled') setServices(svc.value.slice(0, 5));
      if (law.status === 'fulfilled') setLawyers(law.value.slice(0, 3).map(toListRow));
      setRefreshing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAttempt((n) => n + 1);
    void refresh();
  }, [refresh]);

  const identity = useIdentity();
  const firstName = identity.firstName;
  const credit = user?.freeCreditPaise ? Math.floor(user.freeCreditPaise / 100) : 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={LX.goldText} />
        }
      >
        <View style={styles.header}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" transition={0} />

          <View style={styles.greeting}>
            <Text style={styles.overline}>LEGALX</Text>
            <Text style={styles.welcome} numberOfLines={2}>
              {firstName ? `Hello, ${firstName}` : 'Welcome back'}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/profile/lx-coins' as Href)}
            accessibilityRole="button"
            accessibilityLabel={`Credit balance ${credit} rupees`}
            style={({ pressed }) => [styles.credit, pressed && { backgroundColor: LX.goldSoft }]}
          >
            <SymbolView
              name={{ ios: 'indianrupeesign.circle.fill', android: 'paid', web: 'paid' }}
              size={16}
              tintColor={LX.goldText}
            />
            <Text style={styles.creditText}>{credit}</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/profile' as Href)}
            accessibilityRole="button"
            accessibilityLabel="Your profile"
          >
            <Avatar uri={identity.avatarUrl} initials={identity.initials} size="md" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/knowledge-centre')}
          accessibilityRole="search"
          accessibilityLabel="Search legal services, lawyers and guides"
          style={styles.search}
        >
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={19}
            tintColor={LX.inkFaint}
          />
          <TextInput
            editable={false}
            pointerEvents="none"
            value=""
            placeholder="Search legal services, lawyers, guides"
            placeholderTextColor={LX.inkFaint}
            style={styles.searchInput}
          />
        </Pressable>

        <View style={styles.shortcuts}>
          {SHORTCUTS.map((s) => (
            <LXCard key={s.key} style={styles.shortcut} onPress={() => router.push(s.href)}>
              <LXIconChip symbol={s.symbol} />
              <Text style={styles.shortcutTitle}>{s.title}</Text>
              <Text style={styles.shortcutCaption}>{s.caption}</Text>
            </LXCard>
          ))}
        </View>

        <View style={styles.section}>
          <LXSectionHeader
            title="Popular documents"
            actionLabel="See all"
            onAction={() => router.push('/(tabs)/documentation')}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
            snapToInterval={274}
            decelerationRate="fast"
          >
            {services.map((s) => (
              <LXCard
                key={s.id}
                style={styles.docCard}
                onPress={() => router.push(`/(tabs)/documentation/${s.slug}` as Href)}
              >
                <View style={styles.docTop}>
                  <LXPill label="Documentation" />
                  <SymbolView
                    name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                    size={17}
                    tintColor={LX.gold}
                  />
                </View>

                <Text style={styles.docTitle} numberOfLines={2}>
                  {s.title}
                </Text>
                <Text style={styles.docBody} numberOfLines={2}>
                  {s.description}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.docStarts}>STARTS</Text>
                <Text style={styles.docPrice}>{s.priceLine}</Text>
              </LXCard>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <LXSectionHeader
            title="Popular lawyers"
            actionLabel="See all"
            onAction={() => router.push('/(tabs)/talk-to-lawyer')}
          />

          <View style={styles.lawyerList}>
            {lawyers.map((l) => (
              <LXCard
                key={l.id}
                style={styles.lawyerCard}
                onPress={() => router.push(`/lawyer/${l.id}` as Href)}
              >
                <View style={styles.lawyerAvatar}>
                  <Text style={styles.lawyerInitials}>
                    {l.name
                      .replace(/^Adv\.?\s*/i, '')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </Text>
                  {l.is_available_now && <View style={styles.online} />}
                </View>

                <View style={styles.lawyerBody}>
                  <View style={styles.lawyerNameRow}>
                    <Text style={styles.lawyerName} numberOfLines={1}>
                      {l.name}
                    </Text>
                    <SymbolView
                      name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                      size={14}
                      tintColor={LX.gold}
                    />
                  </View>

                  <Text style={styles.lawyerMeta} numberOfLines={1}>
                    {l.practice_areas.slice(0, 2).join(' & ')} Law • {l.experience_years}+ yrs
                  </Text>

                  <View style={styles.lawyerStats}>
                    <SymbolView
                      name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                      size={13}
                      tintColor={LX.gold}
                    />
                    <Text style={styles.rating}>{l.rating_avg.toFixed(1)}</Text>
                    <Text style={styles.lawyerMeta}>({l.review_count} reviews)</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.rate}>₹{l.fee_video}/min</Text>
                  </View>
                </View>
              </LXCard>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LX.bg },
  content: { paddingHorizontal: 18, paddingTop: 10, gap: 22 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 42, height: 42, borderRadius: 12 },
  greeting: { flex: 1, gap: 1 },
  overline: { ...LXType.overline, color: LX.goldText },
  welcome: { ...LXType.headline, color: LX.ink },
  credit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: LXShape.full,
    backgroundColor: LX.goldSofter,
    borderWidth: 1,
    borderColor: LX.goldSoft,
  },
  creditText: { ...LXType.label, fontSize: 14, color: LX.goldText },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: LX.surfaceSunken,
    borderWidth: 1,
    borderColor: LX.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...LXType.label, fontSize: 13, color: LX.ink },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    height: 52,
    paddingHorizontal: 18,
    borderRadius: LXShape.full,
    backgroundColor: LX.surfaceSunken,
    borderWidth: 1,
    borderColor: LX.border,
  },
  searchInput: { flex: 1, ...LXType.body, color: LX.ink, padding: 0 },

  shortcuts: { flexDirection: 'row', gap: 11 },
  shortcut: { flex: 1, alignItems: 'center', paddingVertical: 18, paddingHorizontal: 8, gap: 9 },
  shortcutTitle: { ...LXType.titleSmall, color: LX.ink },
  shortcutCaption: { ...LXType.bodySmall, fontSize: 12, color: LX.inkMuted, textAlign: 'center' },

  section: { gap: 13 },
  rail: { gap: 12, paddingRight: 4, paddingVertical: 3 },
  docCard: { width: 262, padding: 16, gap: 9 },
  docTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docTitle: { ...LXType.titleSmall, fontSize: 17, color: LX.ink },
  docBody: { ...LXType.bodySmall, color: LX.inkMuted },
  divider: { height: 1, backgroundColor: LX.border, marginVertical: 4 },
  docStarts: { ...LXType.overline, fontSize: 10, color: LX.inkFaint },
  docPrice: { ...LXType.title, fontSize: 19, color: LX.goldText },

  lawyerList: { gap: 11 },
  lawyerCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
  lawyerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: LX.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lawyerInitials: { ...LXType.titleSmall, color: LX.goldText },
  online: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: LX.success,
    borderWidth: 2,
    borderColor: LX.surface,
  },
  lawyerBody: { flex: 1, gap: 3 },
  lawyerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lawyerName: { ...LXType.titleSmall, color: LX.ink, flexShrink: 1 },
  lawyerMeta: { ...LXType.bodySmall, fontSize: 12.5, color: LX.inkMuted },
  lawyerStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  rating: { ...LXType.label, fontSize: 12.5, color: LX.ink },
  dot: { color: LX.inkFaint, fontSize: 12 },
  rate: { ...LXType.label, fontSize: 12.5, color: LX.ink },
});
