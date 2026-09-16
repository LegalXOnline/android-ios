import { api } from './api';

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
