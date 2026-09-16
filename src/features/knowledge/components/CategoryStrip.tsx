import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CategoryCount } from '@services/knowledge.service';
import { LX, LXShape, LXType } from '@theme';

/**
 * Horizontal filter chips.
 *
 * The strip carries an explicit height: a horizontal FlatList inside a flex
 * column has no intrinsic one, collapses, and lets the list below draw over it.
 */
export const CHIP_HEIGHT = 38;

interface CategoryStripProps {
  categories: CategoryCount[];
  selected: string;
  onSelect: (name: string) => void;
  label: (name: string) => string;
  tone: (name: string) => { fg: string; bg: string };
}

export function CategoryStrip({ categories, selected, onSelect, label, tone }: CategoryStripProps) {
  const chips = [{ name: 'all', count: 0 }, ...categories];

  return (
    <View style={styles.strip}>
      <FlatList
        horizontal
        data={chips}
        keyExtractor={(c) => c.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => {
          const on = selected === item.name;
          const colours = tone(item.name);
          return (
            <Pressable
              onPress={() => onSelect(item.name)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.chip, { backgroundColor: on ? LX.dark : colours.bg }]}
            >
              <Text style={[styles.text, { color: on ? LX.onDark : colours.fg }]}>
                {item.name === 'all' ? 'All' : label(item.name)}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { height: CHIP_HEIGHT, marginTop: 14 },
  row: { paddingHorizontal: 18, gap: 8 },
  chip: {
    height: CHIP_HEIGHT,
    paddingHorizontal: 14,
    borderRadius: LXShape.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { ...LXType.label, fontSize: 13 },
});
