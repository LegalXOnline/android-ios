export interface ArticlePayload {
  id: string;
  title: string;
  category: string;
  author: string;
  readingTime: string;
  publishedDate: string;
  heroImageUrl: string | null;
  teaser: string;
  body: string;
  sources: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isBookmarked?: boolean;
}

export const KNOWLEDGE_CATEGORIES = [
  'All',
  'My Feed',
  'Cyber',
  'Traffic',
  'POCSO',
  'Property',
  'Corporate',
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

export const PLACEHOLDER_ARTICLES: ArticlePayload[] = [
  {
    id: 'art-1',
    title: 'Understanding Digital Personal Data Protection Act 2023',
    category: 'Cyber',
    author: 'Adv. Priya Sharma',
    readingTime: '5 min read',
    publishedDate: 'Aug 02, 2026',
    heroImageUrl: null,
    teaser: 'Key compliance steps for startups and digital businesses under India’s new data privacy framework.',
    body: `The Digital Personal Data Protection (DPDP) Act 2023 establishes a comprehensive legal framework for processing digital personal data in India. It balances individual privacy rights with lawful data processing requirements for organizations.

Key Highlights:
1. Data Fiduciary Obligations: Organizations must obtain clear, informed consent before processing personal data.
2. Rights of Data Principals: Citizens have the right to access, correct, erase, and withdraw consent.
3. Penalty Framework: Penalties for non-compliance can reach up to ₹250 Crores per instance for severe security safeguards breaches.
4. Children’s Data: Verifiable parental consent is mandatory before processing data of minors.

Businesses operating in India should immediately audit their data ingestion points, privacy policies, and consent management workflows to ensure statutory compliance.`,
    sources: ['DPDP Act 2023 — Ministry of Electronics & IT', 'Section 6 & 8 Gazette Notification'],
    isFeatured: true,
    isTrending: true,
    isBookmarked: false,
  },
  {
    id: 'art-2',
    title: 'Motor Vehicles Act: New Traffic Fines & Challan Contestation Guide',
    category: 'Traffic',
    author: 'Adv. Rajesh Mehta',
    readingTime: '4 min read',
    publishedDate: 'Jul 28, 2026',
    heroImageUrl: null,
    teaser: 'How to contest invalid e-challans legally and know your rights during traffic stops.',
    body: `Under the amended Motor Vehicles Act, electronic enforcement and automated traffic monitoring have significantly increased e-challan issuance across Indian metro cities.

Knowing Your Rights:
- Demand Official ID: Traffic officers below the rank of Sub-Inspector cannot collect spot cash fines for major offenses.
- Virtual Court Option: Invalid or erroneous e-challans can be contested through the online Virtual Court portal without physical court visits.
- Document Presentation: Presenting digital documents via DigiLocker or mParivahan is legally valid under Rule 139 of the Central Motor Vehicles Rules.

Always verify your pending challan status periodically to avoid summons or vehicle transfer restrictions.`,
    sources: ['Motor Vehicles (Amendment) Act 2019', 'Rule 139 Central Motor Vehicles Rules'],
    isFeatured: false,
    isTrending: true,
    isBookmarked: true,
  },
  {
    id: 'art-3',
    title: 'Property Title Verification: 5 Red Flags Every Buyer Must Check',
    category: 'Property',
    author: 'Adv. Rajesh Mehta',
    readingTime: '6 min read',
    publishedDate: 'Jul 20, 2026',
    heroImageUrl: null,
    teaser: 'Essential due diligence steps to prevent property fraud and encumbrance disputes.',
    body: `Buying real estate requires meticulous title scrutiny spanning at least 30 years of mother deed history.

Crucial Checklist:
1. Encumbrance Certificate (EC): Verify Form 15 for any registered mortgages, bank charges, or court attachments.
2. Khata & Tax Receipts: Ensure current Khata registration and up-to-date property tax payments.
3. RERA Registration: Verify builder project registration on the state RERA portal.
4. Land Use & Master Plan: Ensure the property is designated for residential/commercial use without agricultural conversion issues.
5. Possession & Boundary Physical Audit: Match actual physical survey boundaries against approved layout plans.`,
    sources: ['Transfer of Property Act 1882 — Section 54', 'RERA Act 2016'],
    isFeatured: false,
    isTrending: true,
    isBookmarked: false,
  },
  {
    id: 'art-4',
    title: 'POCSO Act Overview: Legal Safeguards & Mandatory Reporting Protocols',
    category: 'POCSO',
    author: 'Adv. Sunita Reddy',
    readingTime: '7 min read',
    publishedDate: 'Jul 15, 2026',
    heroImageUrl: null,
    teaser: 'Understanding protective provisions, statutory duties, and child-friendly trial procedures.',
    body: `The Protection of Children from Sexual Offences (POCSO) Act 2012 provides a robust legal framework to safeguard children below 18 years from sexual abuse, harassment, and pornography.

Key Aspects:
- Mandatory Reporting: Section 19 makes it legally obligatory for any person aware of an offense to report it to Special Juvenile Police Units.
- Child-Friendly Testimony: Recording of statements is conducted at the child’s residence without police uniforms or intimidation.
- Special Courts: Fast-track trials aimed at concluding proceedings within one year from date of offense.`,
    sources: ['POCSO Act 2012 — Section 19 & Section 24', 'Child Rights Guidelines 2020'],
    isFeatured: false,
    isTrending: false,
    isBookmarked: false,
  },
  {
    id: 'art-5',
    title: 'Startup Founder Agreements: Protecting Equity & IP Rights',
    category: 'Corporate',
    author: 'Adv. Ananya Iyer',
    readingTime: '5 min read',
    publishedDate: 'Jul 10, 2026',
    heroImageUrl: null,
    teaser: 'How to structure vesting schedules, IP assignment, and exit clauses among co-founders.',
    body: `A well-drafted Founders' Agreement prevents catastrophic co-founder disputes as startups scale and secure venture capital funding.

Essential Clauses:
- Equity Vesting: 4-year vesting schedule with a 1-year cliff ensures commitment before equity is fully earned.
- IP Assignment: Absolute assignment of all proprietary code, patents, and trademarks to the corporate entity.
- Drag-Along & Tag-Along: Protects majority and minority shareholders during strategic acquisition offers.
- Dispute Resolution: Mandatory mediation prior to arbitration under the Arbitration & Conciliation Act.`,
    sources: ['Companies Act 2013', 'Indian Contract Act 1872'],
    isFeatured: false,
    isTrending: false,
    isBookmarked: true,
  },
];

export function getArticleById(id: string): ArticlePayload | undefined {
  return PLACEHOLDER_ARTICLES.find((a) => a.id === id);
}
