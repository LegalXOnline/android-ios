/**
 * FeaturedVideoCard — Featured / Information Video section on Documentation List.
 *
 * Reuses VideoCard from Phase 2 shared components.
 */
import { StyleSheet, View } from 'react-native';

import { SectionHeader, VideoCard } from '@shared/components';
import { Spacing } from '@theme';

interface FeaturedVideoCardProps {
  videoUrl?: string | null;
  caption?: string;
}

export function FeaturedVideoCard({
  videoUrl,
  caption = '30–60 sec guide: How legal document drafting works on LegalX',
}: FeaturedVideoCardProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Featured Guide" style={styles.header} />
      <VideoCard videoUrl={videoUrl} caption={caption} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  header: {
    paddingVertical: 0,
  },
});
