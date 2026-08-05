/**
 * OurServicesRow — 3 equal-width service entry cards.
 *
 * Layout (06_Module_Home.md §2.1 item 3):
 *   [Documentation] [Knowledge Centre] [Talk to a Lawyer]
 *
 * Rules:
 * - 3 equal-width cards in a single row (per wireframe).
 * - Each card taps to the corresponding tab (not a service detail).
 * - These are navigation entry cards, NOT ServiceCard components.
 *   ServiceCard is for the document-type items in Popular Documents.
 * - Min 44px tap target height (04_Design_System §4).
 * - Card radius 12px, card padding 16px (04_Design_System §4).
 */
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

interface ServiceEntryItem {
  id: string;
  label: string;
  subtitle: string;
  symbol: SymbolViewProps['name'];
  onPress: () => void;
}

interface OurServicesRowProps {
  onDocumentationPress: () => void;
  onKnowledgeCentrePress: () => void;
  onTalkToLawyerPress: () => void;
}

export function OurServicesRow({
  onDocumentationPress,
  onKnowledgeCentrePress,
  onTalkToLawyerPress,
}: OurServicesRowProps) {
  const items: ServiceEntryItem[] = [
    {
      id: 'documentation',
      label: 'Docs',
      subtitle: '8 services',
      symbol: { ios: 'doc.text.fill', android: 'description', web: 'description' },
      onPress: onDocumentationPress,
    },
    {
      id: 'knowledge-centre',
      label: 'Learn',
      subtitle: 'Legal tips',
      symbol: { ios: 'book.fill', android: 'menu_book', web: 'menu_book' },
      onPress: onKnowledgeCentrePress,
    },
    {
      id: 'talk-to-lawyer',
      label: 'Lawyers',
      subtitle: 'Consult now',
      symbol: { ios: 'person.fill', android: 'support_agent', web: 'support_agent' },
      onPress: onTalkToLawyerPress,
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <ServiceEntryCard key={item.id} item={item} />
      ))}
    </View>
  );
}

function ServiceEntryCard({ item }: { item: ServiceEntryItem }) {
  return (
    <Pressable
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <SymbolView
          name={item.symbol}
          size={24}
          tintColor={Colors.primary}
        />
      </View>

      {/* Label */}
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingHWide,
    gap: Spacing.sm,
  },
  card: {
    flex: 1, // Equal width for all 3 cards
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 90,
    justifyContent: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  cardPressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radii.button,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
