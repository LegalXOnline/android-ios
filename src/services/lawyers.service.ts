/**
 * Lawyers service — typed interface stubs.
 *
 * Public read, filtered to is_enrolled_advocate = true at query level.
 * Compliance-critical: non-enrolled advocates must not appear.
 * See 18_API_Integration_Contracts.md §3, 13_Data_Model §3, 09_Module_Talk_to_Lawyer §1.
 */
import type { Lawyer, LawyerAvailability } from '@/types/database.types';
import type { LawyerListingParams } from '@/types/api.types';

/**
 * Fetch paginated lawyer listing with optional filters.
 * Always filtered to is_enrolled_advocate = true at the query level.
 */
export async function getLawyers(_params?: LawyerListingParams): Promise<{ lawyers: Lawyer[]; total: number }> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: lawyers');
}

/** Fetch a single lawyer profile by ID. */
export async function getLawyerById(_lawyerId: string): Promise<Lawyer> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: lawyers');
}

/**
 * Fetch available time slots for a lawyer.
 * App enforces a 5-day window on read — see 13_Data_Model §2.5.
 */
export async function getLawyerAvailability(
  _lawyerId: string,
  _dateRange: string[],
): Promise<LawyerAvailability[]> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §2 (sync-lawyer-availability)');
}

/** Add a lawyer to the current user's favourites. */
export async function addFavouriteLawyer(_profileId: string, _lawyerId: string): Promise<void> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: favourite_lawyers');
}

/** Remove a lawyer from the current user's favourites. */
export async function removeFavouriteLawyer(_profileId: string, _lawyerId: string): Promise<void> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: favourite_lawyers');
}

/** Fetch all of the current user's favourite lawyers. */
export async function getFavouriteLawyers(_profileId: string): Promise<Lawyer[]> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: favourite_lawyers');
}
