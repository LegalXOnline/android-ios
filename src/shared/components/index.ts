/**
 * Shared Components — Master barrel export.
 *
 * Import any component from '@shared/components':
 *   import { PrimaryButton, ServiceCard, FaqAccordion } from '@shared/components';
 *
 * Also importable by sub-folder:
 *   import { PrimaryButton } from '@shared/components/primitives';
 */

// ─── Primitives ───────────────────────────────────────────────────────────────
export {
  PrimaryButton,
  SecondaryButton,
  IconButton,
  Avatar,
  Badge,
  Chip,
  Divider,
} from './primitives';
export type { BadgeVariant } from './primitives';

// ─── Form ─────────────────────────────────────────────────────────────────────
export { AppTextInput, SearchBar } from './form';

// ─── Cards ────────────────────────────────────────────────────────────────────
export { ServiceCard, LawyerCard, VideoCard, PriceCard } from './cards';
export type { ServiceCardProps, LawyerCardData, LawyerCardProps } from './cards';

// ─── Content ──────────────────────────────────────────────────────────────────
export { FaqAccordion } from './content';
export type { FaqItem } from './content';

// ─── Layout ───────────────────────────────────────────────────────────────────
export { SectionHeader, AppHeader, SafeScreenWrapper } from './layout';

// ─── Feedback ─────────────────────────────────────────────────────────────────
export { LoadingIndicator, EmptyState, ErrorState } from './feedback';
