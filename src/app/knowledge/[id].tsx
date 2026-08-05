import { useLocalSearchParams } from 'expo-router';

import { ArticleDetailScreen } from '@features/knowledge/ArticleDetailScreen';

export default function ArticleDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ArticleDetailScreen articleId={id || 'art-1'} />;
}
