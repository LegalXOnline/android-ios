import { api } from './api';

/**
 * Know Your Rights, from the same endpoints the website reads.
 *
 * Public and unauthenticated: the backend filters is_published on every query,
 * so nothing unreviewed can reach a reader here either.
 */

export interface KnowledgeCard {
  id: string;
  slug: string;
  title: string;
  question: string;
  direct_answer: string;
  category: string;
  case_reference: string | null;
  cta_type: string | null;
  source: string | null;
  source_url: string | null;
  published_at: string | null;
  last_reviewed_at: string | null;
}

export interface KnowledgeCardDetail extends KnowledgeCard {
  explanation: string | null;
  card_text: string | null;
  suggested_questions: string[] | null;
  source_tid: string | null;
  reviewed_by: string | null;
  created_at: string | null;
}

export interface RelatedCard {
  slug: string;
  title: string;
  direct_answer: string;
  category: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

interface ListResponse {
  cards: KnowledgeCard[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const PAGE_SIZE = 20;

export function listCards(params: { category?: string; page?: number } = {}) {
  // Built by hand: React Native's URLSearchParams is a partial polyfill and is
  // not worth trusting inside a release build for something this small.
  const query = [`page=${params.page ?? 1}`, `limit=${PAGE_SIZE}`];
  if (params.category && params.category !== 'all') {
    query.push(`category=${encodeURIComponent(params.category)}`);
  }

  return api<ListResponse>(`/api/knowledge?${query.join('&')}`, { auth: false });
}

export async function listCategories(): Promise<CategoryCount[]> {
  const { categories } = await api<{ categories: CategoryCount[] }>('/api/knowledge/categories', {
    auth: false,
  });
  return categories;
}

/** The backend rejects anything shorter than two characters. */
export async function searchCards(q: string): Promise<KnowledgeCard[]> {
  const { cards } = await api<{ cards: KnowledgeCard[] }>(
    `/api/knowledge/search?q=${encodeURIComponent(q)}`,
    { auth: false },
  );
  return cards;
}

export function getCard(slug: string) {
  return api<{ card: KnowledgeCardDetail; related: RelatedCard[] }>(
    `/api/knowledge/${encodeURIComponent(slug)}`,
    { auth: false },
  );
}

// ── Presentation ────────────────────────────────────────────────────────────
// Labels and tones match lib/knowledge.ts on the web, so a category reads the
// same on both.

const CATEGORY_LABELS: Record<string, string> = {
  criminal: 'Criminal Law',
  pocso: 'Child Protection',
  traffic: 'Traffic & Motor',
  cheque_ni_act: 'Cheque Bounce',
  dowry: 'Dowry & Domestic',
  consumer: 'Consumer',
  cyber: 'Cyber & Online',
};

const CATEGORY_TONES: Record<string, { fg: string; bg: string }> = {
  criminal: { fg: '#9B1C31', bg: '#FCE8EC' },
  pocso: { fg: '#8A5100', bg: '#FDEFD9' },
  traffic: { fg: '#1B4D8F', bg: '#E4EDFA' },
  cheque_ni_act: { fg: '#8A6A00', bg: '#FBECC4' },
  dowry: { fg: '#9B2C6F', bg: '#FBE6F2' },
  consumer: { fg: '#146B4F', bg: '#DDF3E9' },
  cyber: { fg: '#5B3A9B', bg: '#EDE7FB' },
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ');
}

export function categoryTone(category: string) {
  return CATEGORY_TONES[category] ?? { fg: '#6F6A61', bg: '#F1EDE5' };
}

/** The card's cta_type decides where the reader goes next. */
export function ctaFor(ctaType: string | null) {
  return ctaType === 'document'
    ? { label: 'Get this document drafted', route: '/(tabs)/documentation' as const }
    : { label: 'Talk to a lawyer about this', route: '/(tabs)/talk-to-lawyer' as const };
}

/**
 * The import left "dev-unauthenticated" and bare account ids in this column.
 * Printing either under a criminal-law explainer is worse than printing
 * nothing, so anything that is not a plausible name is suppressed.
 */
const PLACEHOLDER_REVIEWER = /^(dev-unauthenticated|system|unknown|null|undefined|admin)$/i;

export function displayReviewer(reviewedBy: string | null | undefined): string | null {
  const name = (reviewedBy ?? '').trim();
  if (!name || PLACEHOLDER_REVIEWER.test(name)) return null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(name)) return null;
  return name;
}

/** indiankanoon.org requires visible attribution on anything derived from it. */
export function requiresKanoonAttribution(source: string | null | undefined): boolean {
  return (source ?? '').toLowerCase().includes('kanoon');
}

export function formatReviewed(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Legal Updates ───────────────────────────────────────────────────────────
// The daily shorts feed, the same one the website's Knowledge Center opens on.
// Cursor paginated rather than offset: cards are published mid-session and an
// offset would make the feed repeat or skip rows underneath a reader.

export interface LegalShort {
  id: string;
  title: string;
  slug: string | null;
  summary: string;
  takeaway: string | null;
  category: string;
  court: string | null;
  judgment_date: string | null;
  source_url: string | null;
  source_name: string | null;
  tags: string[] | null;
  likes_count: number;
  published_at: string | null;
  created_at: string;
  /** 'high' = directly actionable, 'moderate' = worth knowing. */
  relevance_tier?: 'high' | 'moderate' | null;
  affects_whom?: string | null;
  action_required?: 'yes' | 'no' | 'conditional' | null;
  deadline?: string | null;
  key_points?: string[] | null;
  statute_reference?: string | null;
}

export interface ShortsPage {
  shorts: LegalShort[];
  hasMore: boolean;
  nextCursor: string | null;
}

export const SHORTS_PAGE_SIZE = 10;

export function listShorts(params: { category?: string; before?: string } = {}) {
  const query = [`limit=${SHORTS_PAGE_SIZE}`];
  if (params.category && params.category !== 'all') {
    query.push(`category=${encodeURIComponent(params.category)}`);
  }
  if (params.before) query.push(`before=${encodeURIComponent(params.before)}`);

  return api<ShortsPage>(`/api/shorts?${query.join('&')}`, { auth: false });
}

export async function listShortCategories(): Promise<CategoryCount[]> {
  const { categories } = await api<{ categories: CategoryCount[] }>('/api/shorts/categories', {
    auth: false,
  });
  return categories;
}

export async function searchShorts(q: string): Promise<LegalShort[]> {
  const { shorts } = await api<{ shorts: LegalShort[] }>(
    `/api/shorts/search?q=${encodeURIComponent(q)}&limit=20`,
    { auth: false },
  );
  return shorts;
}

export function getShort(slug: string) {
  return api<{ short: LegalShort }>(`/api/shorts/${encodeURIComponent(slug)}`, { auth: false });
}

/** The feed's own taxonomy — situations a reader is in, not areas of law. */
const SHORT_CATEGORY_LABELS: Record<string, string> = {
  property_rent: 'Property',
  family_marriage: 'Family',
  money_consumer: 'Consumer',
  crime_safety: 'Crime & Safety',
  business_compliance: 'Business',
  cyber_online: 'Cyber',
};

const SHORT_CATEGORY_TONES: Record<string, { fg: string; bg: string }> = {
  property_rent: { fg: '#146B4F', bg: '#DDF3E9' },
  family_marriage: { fg: '#9B2C6F', bg: '#FBE6F2' },
  money_consumer: { fg: '#1B4D8F', bg: '#E4EDFA' },
  crime_safety: { fg: '#9B1C31', bg: '#FCE8EC' },
  business_compliance: { fg: '#8A6A00', bg: '#FBECC4' },
  cyber_online: { fg: '#5B3A9B', bg: '#EDE7FB' },
};

export function shortCategoryLabel(category: string): string {
  return SHORT_CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ');
}

export function shortCategoryTone(category: string) {
  return SHORT_CATEGORY_TONES[category] ?? { fg: '#6F6A61', bg: '#F1EDE5' };
}

export function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 3600) return `${Math.max(1, Math.floor(secs / 60))}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
