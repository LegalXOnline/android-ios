/**
 * Home module placeholder data.
 *
 * Phase 3 only — no API calls, no Supabase.
 * Consumed by PopularDocumentsRow and PopularLawyersRow.
 *
 * Data shapes match the types used by Phase 2 shared components:
 * - ServiceCardProps (without onPress — provided at render)
 * - LawyerCardData (from LawyerCard.tsx)
 *
 * Sources:
 *   Services  → 01_Product_Vision.md §4, 19_Document_Services_Content_Map.md
 *   Lawyers   → 04_Design_System.md §5.2, 13_Data_Model_Supabase_Schema.md §2.4
 */
import type { LawyerCardData } from '@shared/components';

// ─── Service placeholder ───────────────────────────────────────────────────────
// Matches the props ServiceCard expects (minus onPress, added at render).

export interface HomePlaceholderService {
  id: string; // matches ServiceId from @constants/services
  title: string;
  description: string;
  priceLine: string;
}

/**
 * First 4 of the 8 fixed services — shown in Popular Documents row.
 * Order matches editorial priority (not algorithmic — 06_Module_Home §2.2).
 * Max 6 shown per spec; 4 is sufficient for Phase 3 placeholder.
 */
export const PLACEHOLDER_POPULAR_SERVICES: HomePlaceholderService[] = [
  {
    id: 'gst-registration',
    title: 'GST Registration',
    description: 'Complete GST registration with government filing support.',
    priceLine: 'From ₹499',
  },
  {
    id: 'trademark-registration',
    title: 'Trademark Registration',
    description: 'Protect your brand identity with official trademark filing.',
    priceLine: 'From ₹1,499',
  },
  {
    id: 'legal-notice',
    title: 'Legal Notice',
    description: 'Professionally drafted legal notices for any dispute.',
    priceLine: 'From ₹799',
  },
  {
    id: 'rent-agreement',
    title: 'Rent Agreement',
    description: 'Legally binding rental agreements drafted by experts.',
    priceLine: 'From ₹399',
  },
];

// ─── Lawyer placeholder ────────────────────────────────────────────────────────
// photo_url: null — Avatar falls back to initials monogram.
// Fees reflect realistic per-minute pricing from 15_Realtime_Communication_Agora.md.

export const PLACEHOLDER_LAWYERS: LawyerCardData[] = [
  {
    id: 'lawyer-placeholder-1',
    name: 'Adv. Priya Sharma',
    photo_url: null,
    experience_years: 8,
    rating_avg: 4.8,
    review_count: 124,
    languages: ['English', 'Hindi'],
    practice_areas: ['Corporate Law', 'GST'],
    fee_chat: 10,
    fee_voice: 15,
    fee_video: 20,
    is_available_now: true,
  },
  {
    id: 'lawyer-placeholder-2',
    name: 'Adv. Rahul Mehta',
    photo_url: null,
    experience_years: 12,
    rating_avg: 4.6,
    review_count: 89,
    languages: ['English', 'Hindi', 'Gujarati'],
    practice_areas: ['Property Law', 'Civil'],
    fee_chat: 12,
    fee_voice: 18,
    fee_video: 25,
    is_available_now: true,
  },
  {
    id: 'lawyer-placeholder-3',
    name: 'Adv. Sunita Reddy',
    photo_url: null,
    experience_years: 5,
    rating_avg: 4.9,
    review_count: 56,
    languages: ['English', 'Telugu', 'Hindi'],
    practice_areas: ['Family Law', 'Consumer'],
    fee_chat: 8,
    fee_voice: 12,
    fee_video: 18,
    is_available_now: false,
  },
];
