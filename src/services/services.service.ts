/**
 * Document services — typed interface stubs.
 *
 * The 8 fixed document services. Public read — direct Supabase client call.
 * See 18_API_Integration_Contracts.md §3, table: services.
 */
import type { Service } from '@/types/database.types';

/** Fetch all 8 document services. */
export async function getAllServices(): Promise<Service[]> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: services');
}

/** Fetch a single service by ID (e.g. "gst-registration"). */
export async function getServiceById(_serviceId: string): Promise<Service> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: services');
}
