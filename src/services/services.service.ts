import { api } from './api';
import { uploadMultipart } from './upload';

/**
 * The document service catalogue.
 *
 * Served from the backend's mirror of the same registry the website renders,
 * so a price or a required document changes in one place. Public: the
 * catalogue has to render before anyone signs in.
 */
export interface ServiceCard {
  id: string;
  slug: string;
  title: string;
  tag: string;
  tagline: string;
  description: string;
  shortDesc: string;
  priceLine: string;
  priceNumeric: number;
  duration: string;
  estimatedTime: string;
  legalAct: string;
}
export interface ServiceRequiredDoc {
  id: string;
  name: string;
  desc: string;
  required: boolean;
  acceptedFormats: string;
}
export interface ServiceFaq {
  q: string;
  a: string;
}
export interface ServiceStep {
  title: string;
  description: string;
}
export interface ServiceDetail extends ServiceCard {
  breadcrumb: string;
  definition: string;
  definitionQuote: string;
  definitionSource: string;
  keyPoints: string[];
  benefits: string[];
  features: string[];
  faqs: ServiceFaq[];
  requiredDocs: ServiceRequiredDoc[];
  howItWorks: ServiceStep[];
  pricing: { drafting: number; govtDuty: string; platformFee: number; total: string };
}
export async function getServices(): Promise<ServiceCard[]> {
  const data = await api<{ services: ServiceCard[] }>('/api/services', { auth: false });
  return data.services;
}
export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  try {
    const data = await api<{ service: ServiceDetail }>(
      `/api/services/${encodeURIComponent(slug)}`,
      { auth: false },
    );
    return data.service;
  } catch {
    return null;
  }
}
/**
 * Uploads one document against a service application.
 *
 * Not routed through api(): that helper sets a JSON content type, and
 * multipart needs the runtime to write its own boundary. Web and native
 * disagree on what FormData accepts for a file, so both are handled.
 */
export interface UploadedDoc {
  path: string;
  url: string | null;
  name: string;
  size: number;
}
export async function uploadServiceDoc(
  file: { uri: string; name: string; type: string },
  opts: { docType: string; serviceTitle?: string },
): Promise<UploadedDoc> {
  const params = new URLSearchParams({ docType: opts.docType });
  if (opts.serviceTitle) params.set('serviceTitle', opts.serviceTitle);
  return uploadMultipart<UploadedDoc>(
    `/api/upload/client-doc?${params}`,
    file,
    'Could not upload that document.',
  );
}
