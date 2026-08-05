/**
 * Knowledge Centre service — typed interface stub.
 *
 * V1: placeholder UI only. No GitHub fetch implemented.
 * V2: replace stub body with real GitHub content fetch.
 *
 * The KnowledgeArticle shape is fixed now so placeholder components
 * don't need rework when the real fetch ships.
 * See 08_Module_Knowledge_Centre.md, 18_API_Integration_Contracts §4.
 */
import type { KnowledgeArticle } from '@/types/database.types';

/**
 * Fetch Knowledge Centre articles.
 * V1: not implemented — placeholder UI uses static shape only.
 * V2: fetches from GitHub content repository.
 * See 18_API_Integration_Contracts §4.
 */
export async function getArticles(_category?: string): Promise<KnowledgeArticle[]> {
  throw new Error('Not implemented — V2 feature. See 18_API_Integration_Contracts §4 and 08_Module_Knowledge_Centre §4');
}

/**
 * Fetch a single article by headline/id.
 * V1: not implemented — placeholder only.
 */
export async function getArticleByHeadline(_headline: string): Promise<KnowledgeArticle> {
  throw new Error('Not implemented — V2 feature. See 18_API_Integration_Contracts §4');
}
