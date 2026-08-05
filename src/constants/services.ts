/**
 * Document service IDs — the 8 fixed services (01_Product_Vision.md §4).
 *
 * These IDs are stable references used as route params, analytics event props,
 * and database service.id values. Do NOT add/remove without a scope change.
 * See 19_Document_Services_Content_Map.md for content per service.
 */

export const SERVICE_IDS = {
  GST_REGISTRATION: 'gst-registration',
  GST_RETURN_FILING: 'gst-return-filing',
  TRADEMARK_REGISTRATION: 'trademark-registration',
  UDYAM_REGISTRATION: 'udyam-registration',
  DPIIT_STARTUP_INDIA: 'dpiit-startup-india',
  LEGAL_NOTICE: 'legal-notice',
  RENT_AGREEMENT: 'rent-agreement',
  AFFIDAVIT: 'affidavit-drafting',
} as const;

export type ServiceId = (typeof SERVICE_IDS)[keyof typeof SERVICE_IDS];

/** Ordered list matching the product spec — do not reorder. */
export const SERVICE_ID_LIST: ServiceId[] = [
  SERVICE_IDS.GST_REGISTRATION,
  SERVICE_IDS.GST_RETURN_FILING,
  SERVICE_IDS.TRADEMARK_REGISTRATION,
  SERVICE_IDS.UDYAM_REGISTRATION,
  SERVICE_IDS.DPIIT_STARTUP_INDIA,
  SERVICE_IDS.LEGAL_NOTICE,
  SERVICE_IDS.RENT_AGREEMENT,
  SERVICE_IDS.AFFIDAVIT,
];

/** Services with subtypes (07_Module_Documentation.md §3.3) */
export const SERVICES_WITH_SUBTYPES: ServiceId[] = [
  SERVICE_IDS.LEGAL_NOTICE,
  SERVICE_IDS.RENT_AGREEMENT,
  SERVICE_IDS.AFFIDAVIT,
];
