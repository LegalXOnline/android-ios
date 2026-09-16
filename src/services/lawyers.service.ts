import { api, apiAssetUrl } from './api';
import type { LawyerCardData } from '@shared/components';

/**
 * The lawyer directory, from the same endpoint the website reads.
 *
 * The API speaks the web's shape; the cards here speak the mobile's. The two
 * are mapped in one place rather than teaching every screen both vocabularies.
 */

export interface ApiLawyerFee {
  chat: number;
  voice: number;
  video: number;
}

export interface ApiLawyerEducation {
  degree: string;
  institution: string;
  year: number;
}

export interface ApiLawyerReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ApiLawyer {
  slug: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string | null;
  barNumber: string;
  verified: boolean;
  online: boolean;
  specializations: string[];
  primarySpec: string;
  experience: number;
  location: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  casesHandled: number;
  bio: string;
  education: ApiLawyerEducation[];
  expertise: string[];
  achievements: string[];
  fees: ApiLawyerFee;
  reviews: ApiLawyerReview[];
}

/** The card shape the listing renders, keyed by slug rather than a row id. */
export function toCardData(lawyer: ApiLawyer): LawyerCardData {
  return {
    id: lawyer.slug,
    name: lawyer.name,
    photo_url: apiAssetUrl(lawyer.avatarUrl),
    experience_years: lawyer.experience,
    rating_avg: lawyer.rating,
    review_count: lawyer.reviewCount,
    languages: lawyer.languages,
    practice_areas: lawyer.specializations,
    fee_chat: lawyer.fees.chat,
    fee_voice: lawyer.fees.voice,
    fee_video: lawyer.fees.video,
    is_available_now: lawyer.online,
  };
}

/**
 * The row shape the listing filters and sorts on.
 *
 * Every field is carried over from the API — nothing is invented. The listing
 * used to read a fixture with `courts` and `expertise_tags`; the API has
 * expertise but no courts, so that filter clause goes rather than being faked.
 */
export interface LawyerListRow {
  id: string;
  name: string;
  photo_url: string | null;
  initials: string;
  avatar_bg: string;
  verified: boolean;
  is_available_now: boolean;
  primary_spec: string;
  practice_areas: string[];
  expertise_tags: string[];
  languages: string[];
  location: string;
  rating_avg: number;
  review_count: number;
  experience_years: number;
  fee_chat: number;
  fee_voice: number;
  fee_video: number;
}

export function toListRow(l: ApiLawyer): LawyerListRow {
  return {
    id: l.slug,
    name: l.name,
    // Relative on the wire; an Image needs the whole address.
    photo_url: apiAssetUrl(l.avatarUrl),
    initials: l.initials,
    avatar_bg: l.avatarBg,
    verified: l.verified,
    is_available_now: l.online,
    primary_spec: l.primarySpec,
    practice_areas: l.specializations,
    expertise_tags: l.expertise,
    languages: l.languages,
    location: l.location,
    rating_avg: l.rating,
    review_count: l.reviewCount,
    experience_years: l.experience,
    fee_chat: l.fees.chat,
    fee_voice: l.fees.voice,
    fee_video: l.fees.video,
  };
}

export async function getLawyers(): Promise<ApiLawyer[]> {
  const data = await api<{ lawyers: ApiLawyer[] }>('/api/lawyers', { auth: false });
  return data.lawyers;
}

/**
 * The detail shape the profile screen renders. Mapped once, here, so the screen
 * keeps its own vocabulary and the API keeps the web's.
 *
 * `courts` has no API equivalent, so it is empty rather than fabricated — the
 * screen already guards on length.
 */
export interface LawyerDetailRow extends LawyerListRow {
  title: string;
  bar_registration: string;
  about: string;
  education: string[];
  courts: string[];
  achievements: string[];
  reviews: ApiLawyerReview[];
  cases_handled: number;
}

export function toDetailRow(l: ApiLawyer): LawyerDetailRow {
  return {
    ...toListRow(l),
    title: l.primarySpec,
    bar_registration: l.barNumber,
    about: l.bio,
    education: l.education.map((e) => `${e.degree} — ${e.institution} (${e.year})`),
    courts: [],
    achievements: l.achievements,
    reviews: l.reviews,
    cases_handled: l.casesHandled,
  };
}

export async function getLawyerBySlug(slug: string): Promise<ApiLawyer | null> {
  try {
    const data = await api<{ lawyer: ApiLawyer }>(
      `/api/lawyers/${encodeURIComponent(slug)}`,
      { auth: false },
    );
    return data.lawyer;
  } catch {
    return null;
  }
}
