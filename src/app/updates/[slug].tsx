import { useLocalSearchParams } from 'expo-router';

import { UpdateDetailScreen } from '@features/knowledge/UpdateDetailScreen';

export default function UpdateRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return <UpdateDetailScreen slug={slug ?? ''} />;
}
