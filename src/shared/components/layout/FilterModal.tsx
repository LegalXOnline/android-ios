import { SymbolView } from 'expo-symbols';
import { Fragment } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radii, Spacing, Typography } from '@theme';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  title?: string;
  type: 'radio' | 'toggle';
  options: FilterOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  // For toggle
  isToggled?: boolean;
  onToggle?: (value: boolean) => void;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  sections: FilterSection[];
}

export function FilterModal({ visible, onClose, sections }: FilterModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                size={20}
                tintColor={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {sections.map((section, idx) => (
              <Fragment key={idx}>
                {section.title && <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>}

                {section.type === 'toggle' && (
                  <View style={styles.toggleContainer}>
                    {section.options.map((opt) => (
                      <Pressable
                        key={opt.value}
                        style={styles.toggleRow}
                        onPress={() => section.onToggle?.(!section.isToggled)}
                      >
                        <View style={[styles.dot, section.isToggled ? styles.dotGreen : styles.dotGray]} />
                        <Text style={styles.toggleText}>{opt.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                {section.type === 'radio' && (
                  <View style={styles.radioContainer}>
                    {section.options.map((opt) => {
                      const isSelected = section.selectedValue === opt.value;
                      return (
                        <Pressable
                          key={opt.value}
                          style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                          onPress={() => section.onSelect?.(opt.value)}
                        >
                          <View style={[styles.dot, isSelected ? styles.dotYellow : styles.dotGray]} />
                          <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>
                            {opt.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </Fragment>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surfaceAlt,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.ink,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  toggleContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.sm,
    marginBottom: Spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  toggleText: {
    ...Typography.body,
    color: Colors.ink,
    marginLeft: Spacing.sm,
  },
  radioContainer: {
    marginBottom: Spacing.md,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radii.sm,
  },
  radioRowSelected: {
    backgroundColor: Colors.surface,
  },
  radioText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
  },
  radioTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGray: {
    backgroundColor: Colors.textSecondary,
  },
  dotGreen: {
    backgroundColor: Colors.success,
  },
  dotYellow: {
    backgroundColor: Colors.primary,
  },
});
