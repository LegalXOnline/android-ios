/**
 * DocumentChecklist — Two-group checklist component with optional Subtype selector.
 *
 * Spec: 07_Module_Documentation.md §3.1 (Section 6) & §3.3
 * Reuses Chip, Badge, Divider, and design system tokens.
 */
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@shared/components';
import { Colors, FontSize, FontWeight, Radii, Spacing, Typography } from '@theme';

import type { ChecklistItem, ServiceSubtype } from '../documentation.placeholder';

interface DocumentChecklistProps {
  subtypes?: ServiceSubtype[];
  checklistRequired: ChecklistItem[] | Record<string, ChecklistItem[]>;
  checklistAdditional: ChecklistItem[];
}

export function DocumentChecklist({
  subtypes,
  checklistRequired,
  checklistAdditional,
}: DocumentChecklistProps) {
  // Active subtype state if subtypes are provided
  const [selectedSubtype, setSelectedSubtype] = useState<string>(
    subtypes && subtypes.length > 0 ? subtypes[0].id : ''
  );

  // Resolve active required checklist items
  const activeRequiredItems: ChecklistItem[] = Array.isArray(checklistRequired)
    ? checklistRequired
    : checklistRequired[selectedSubtype] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Required Documents</Text>

      {/* Inline Subtype Selector if service supports subtypes */}
      {subtypes && subtypes.length > 0 && (
        <View style={styles.subtypeBlock}>
          <Text style={styles.subtypeLabel}>Select Notice / Notice Type:</Text>
          <View style={styles.chipRow}>
            {subtypes.map((st) => (
              <Chip
                key={st.id}
                label={st.label}
                selected={selectedSubtype === st.id}
                onPress={() => setSelectedSubtype(st.id)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Required Items Group */}
      <View style={styles.groupCard}>
        <Text style={styles.groupHeader}>Mandatory Documents</Text>
        {activeRequiredItems.map((item, idx) => (
          <ChecklistItemRow key={`${item.name}-${idx}`} item={item} isRequired />
        ))}
      </View>

      {/* Additional Items Group (if any) */}
      {checklistAdditional.length > 0 && (
        <View style={styles.groupCard}>
          <Text style={styles.groupHeader}>Additional Documents (If Applicable)</Text>
          {checklistAdditional.map((item, idx) => (
            <ChecklistItemRow key={`${item.name}-${idx}`} item={item} isRequired={false} />
          ))}
        </View>
      )}
    </View>
  );
}

function ChecklistItemRow({
  item,
  isRequired,
}: {
  item: ChecklistItem;
  isRequired: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, isRequired ? styles.iconBoxRequired : styles.iconBoxOptional]}>
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          size={14}
          tintColor={isRequired ? Colors.success : Colors.textSecondary}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          Accepted: {item.formats} • Max: {item.maxSize}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.ink,
  },
  subtypeBlock: {
    gap: Spacing.xs,
  },
  subtypeLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  groupCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  groupHeader: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconBoxRequired: {
    backgroundColor: '#E8F8F3', // success light tint
  },
  iconBoxOptional: {
    backgroundColor: Colors.border,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    ...Typography.body,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  itemMeta: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
