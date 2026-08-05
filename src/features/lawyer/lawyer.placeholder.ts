/**
 * Lawyer Module Placeholder Data — Enrolled Advocates Roster.
 *
 * Compliance: Surfacing ONLY enrolled Advocates (Bar Council registered).
 * Spec: 09_Module_Talk_to_Lawyer.md
 */
import type { LawyerCardData } from '@shared/components';

export interface LawyerDetailPayload extends LawyerCardData {
  title: string;
  bar_registration: string;
  consultations_count: number;
  cases_count: number;
  expertise_tags: string[];
  about: string;
  education: string[];
  courts: string[];
  location: string;
}

export const LAWYER_CATEGORIES = [
  'All',
  'Civil',
  'Criminal',
  'Corporate',
  'Family',
  'Property',
  'Tax',
] as const;

export type LawyerCategory = (typeof LAWYER_CATEGORIES)[number];

export const PLACEHOLDER_LAWYERS_FULL: LawyerDetailPayload[] = [
  {
    id: 'lawyer-1',
    name: 'Adv. Priya Sharma',
    title: 'Senior Advocate • Corporate & Tax Specialist',
    bar_registration: 'D/1428/2014',
    photo_url: null,
    experience_years: 12,
    rating_avg: 4.9,
    review_count: 156,
    consultations_count: 420,
    cases_count: 280,
    languages: ['English', 'Hindi'],
    practice_areas: ['Corporate', 'Tax', 'Civil'],
    expertise_tags: ['GST Compliance', 'Contract Review', 'Corporate Governance', 'M&A', 'Tax Disputes'],
    about:
      'Advocate Priya Sharma has over 12 years of experience practicing before the High Court of Delhi and NCLT. She specializes in corporate tax litigation, GST compliance, shareholder agreements, and contract risk audits for startups and MSMEs.',
    education: [
      'LL.M. in Corporate & Commercial Law — National Law University, Delhi (2014)',
      'LL.B. — Campus Law Centre, Faculty of Law, University of Delhi (2012)',
      'Enrolled with Bar Council of Delhi (Reg: D/1428/2014)',
    ],
    courts: [
      'High Court of Delhi',
      'National Company Law Tribunal (NCLT), Principal Bench',
      'Income Tax Appellate Tribunal (ITAT), Delhi Bench',
    ],
    fee_chat: 10,
    fee_voice: 15,
    fee_video: 20,
    is_available_now: true,
    location: 'New Delhi',
  },
  {
    id: 'lawyer-2',
    name: 'Adv. Rajesh Mehta',
    title: 'Advocate • Property & Real Estate Dispute Specialist',
    bar_registration: 'G/892/2010',
    photo_url: null,
    experience_years: 15,
    rating_avg: 4.8,
    review_count: 198,
    consultations_count: 510,
    cases_count: 340,
    languages: ['English', 'Hindi', 'Gujarati'],
    practice_areas: ['Property', 'Civil'],
    expertise_tags: ['Property Disputes', 'Title Verification', 'RERA Litigation', 'Tenant Eviction', 'Land Acquisition'],
    about:
      'Advocate Rajesh Mehta is a seasoned real estate litigation expert with 15 years of active practice. He provides legal opinions on land titles, RERA complaints, partition suits, and commercial lease drafting.',
    education: [
      'LL.B. — Gujarat University (2009)',
      'Diploma in Cyber & Property Law — ILS Law College (2010)',
      'Enrolled with Bar Council of Gujarat (Reg: G/892/2010)',
    ],
    courts: [
      'High Court of Gujarat',
      'Real Estate Regulatory Authority (RERA) Tribunal',
      'City Civil Court, Ahmedabad',
    ],
    fee_chat: 12,
    fee_voice: 18,
    fee_video: 25,
    is_available_now: true,
    location: 'Ahmedabad',
  },
  {
    id: 'lawyer-3',
    name: 'Adv. Sunita Reddy',
    title: 'Advocate • Family & Matrimonial Law Specialist',
    bar_registration: 'TS/314/2017',
    photo_url: null,
    experience_years: 8,
    rating_avg: 4.9,
    review_count: 112,
    consultations_count: 290,
    cases_count: 180,
    languages: ['English', 'Telugu', 'Hindi'],
    practice_areas: ['Family', 'Civil'],
    expertise_tags: ['Mutual Divorce', 'Child Custody', 'Alimony Claims', 'Domestic Violence', 'Property Division'],
    about:
      'Advocate Sunita Reddy practices primarily in matrimonial disputes, family mediation, and custody matters. She is known for empathetic client advocacy and pragmatic dispute resolution aimed at minimizing litigation delays.',
    education: [
      'LL.B. — Osmania University College of Law, Hyderabad (2016)',
      'Enrolled with Bar Council of Telangana (Reg: TS/314/2017)',
    ],
    courts: [
      'High Court for the State of Telangana',
      'Family Courts, Hyderabad & Secunderabad',
    ],
    fee_chat: 8,
    fee_voice: 12,
    fee_video: 18,
    is_available_now: true,
    location: 'Hyderabad',
  },
  {
    id: 'lawyer-4',
    name: 'Adv. Vikramaditya Singh',
    title: 'Senior Counsel • Criminal Defense & White-Collar Crime',
    bar_registration: 'MAH/2041/2008',
    photo_url: null,
    experience_years: 17,
    rating_avg: 4.7,
    review_count: 230,
    consultations_count: 680,
    cases_count: 450,
    languages: ['English', 'Hindi', 'Marathi'],
    practice_areas: ['Criminal', 'Civil'],
    expertise_tags: ['Bail Applications', 'Cheque Bounce (Sec 138)', 'White-Collar Crime', 'Economic Offences', 'Cyber Crime'],
    about:
      'Advocate Vikramaditya Singh has 17 years of experience in criminal jurisprudence, bail hearings, Section 138 Negotiable Instruments Act litigation, and corporate fraud defense across trial and appellate courts.',
    education: [
      'LL.M. in Criminal Law — Government Law College, Mumbai (2008)',
      'LL.B. — Government Law College, Mumbai (2006)',
      'Enrolled with Bar Council of Maharashtra & Goa (Reg: MAH/2041/2008)',
    ],
    courts: [
      'Bombay High Court',
      'Sessions Court, Greater Mumbai',
      'Special PMLA & ED Courts',
    ],
    fee_chat: 15,
    fee_voice: 22,
    fee_video: 30,
    is_available_now: false,
    location: 'Mumbai',
  },
  {
    id: 'lawyer-5',
    name: 'Adv. Ananya Iyer',
    title: 'Advocate • Tax & Corporate Compliance Expert',
    bar_registration: 'KAR/1520/2015',
    photo_url: null,
    experience_years: 10,
    rating_avg: 4.85,
    review_count: 142,
    consultations_count: 360,
    cases_count: 210,
    languages: ['English', 'Kannada', 'Hindi', 'Tamil'],
    practice_areas: ['Tax', 'Corporate'],
    expertise_tags: ['ITR Assessment Appeals', 'GST Audits', 'Startup Fundraising Legal', 'ESOP Structuring'],
    about:
      'Advocate Ananya Iyer advises technology startups, founders, and corporations on tax planning, GST audit responses, Income Tax appeals under Section 246A, and regulatory filings with the Registrar of Companies.',
    education: [
      'LL.B. (Hons.) — National Law School of India University (NLSIU), Bengaluru (2014)',
      'Enrolled with Bar Council of Karnataka (Reg: KAR/1520/2015)',
    ],
    courts: [
      'High Court of Karnataka',
      'Income Tax Appellate Tribunal (ITAT), Bengaluru',
    ],
    fee_chat: 11,
    fee_voice: 16,
    fee_video: 22,
    is_available_now: true,
    location: 'Bengaluru',
  },
];

export function getLawyerById(id: string): LawyerDetailPayload | undefined {
  return PLACEHOLDER_LAWYERS_FULL.find((l) => l.id === id);
}
