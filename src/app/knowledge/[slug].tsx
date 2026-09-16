import { useLocalSearchParams } from 'expo-router';

import { ArticleDetailScreen } from '@features/knowledge/ArticleDetailScreen';

export default function KnowledgeCardRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return <ArticleDetailScreen slug={slug ?? ''} />;
}
