/**
 * Documentation Module Placeholder Data — 8 Predefined Legal Services.
 *
 * Full spec: 07_Module_Documentation.md, 19_Document_Services_Content_Map.md
 *
 * Predefined 8 Services:
 *   1. GST Registration
 *   2. Trademark Registration
 *   3. MSME Registration (Udyam)
 *   4. FSSAI Registration
 *   5. Company Registration
 *   6. ITR Filing
 *   7. Legal Notice
 *   8. Rent Agreement
 */

export interface ChecklistItem {
  name: string;
  formats: string;
  maxSize: string;
}

export interface ServiceSubtype {
  id: string;
  label: string;
}

export interface ServiceDetailPayload {
  id: string;
  title: string;
  tag: string;
  breadcrumb: string;
  description: string;
  priceLine: string;
  priceNumeric: number;
  videoUrl: string | null;
  keyDetails: string[];
  whatIsBody: string;
  whatIsCitation: string;
  benefits: string[];
  subtypes?: ServiceSubtype[];
  checklistRequired: ChecklistItem[] | Record<string, ChecklistItem[]>;
  checklistAdditional: ChecklistItem[];
  whatsIncluded: string[];
  howItWorksSteps: { title: string; description: string }[];
  faq: { id: string; question: string; answer: string }[];
}

export const COMMON_HOW_IT_WORKS = [
  { title: 'Submit Requirements', description: 'Fill out a brief questionnaire and upload the mandatory documents securely.' },
  { title: 'Expert Drafting', description: 'Our certified legal experts prepare your documentation in full statutory compliance.' },
  { title: 'Review & Confirm', description: 'Receive your draft for review and request edits if needed.' },
  { title: 'Final Delivery', description: 'Get your registered / executed document delivered digitally and via post.' },
];

export const DOCUMENT_SERVICES: ServiceDetailPayload[] = [
  {
    id: 'gst-registration',
    title: 'GST Registration',
    tag: 'TAX & REGISTRATION',
    breadcrumb: 'Services / Tax & Registration',
    description: 'Get your 15-digit GSTIN with complete government portal filing support within 3–5 working days.',
    priceLine: 'From ₹1,499',
    priceNumeric: 1499,
    videoUrl: null,
    keyDetails: [
      'Mandatory for businesses with turnover exceeding ₹40 Lakhs (₹20 Lakhs for services).',
      '100% online government portal filing without physical visits.',
      'Includes ARN generation, application tracking, and GST Certificate delivery.',
      'Valid for lifetime unless surrendered or cancelled by authorities.',
      'Enables input tax credit (ITC) claim on business purchases.',
    ],
    whatIsBody:
      'Goods and Services Tax (GST) registration is a mandatory tax registration under Indian tax laws for businesses supplying goods or services across India. Possessing a valid GSTIN enables legal compliance, inter-state trade, and input tax credit claims.',
    whatIsCitation: 'Central Goods and Services Tax Act, 2017 — Section 22 & Section 24',
    benefits: [
      'Legal authorization to collect GST and pass on tax credits.',
      'Seamless inter-state business expansion without entry restrictions.',
      'Enhanced credibility with corporate clients and vendors.',
      'Eligibility for registered supplier tenders and e-commerce platform onboarding.',
      'Protection against severe non-registration penalties under tax law.',
    ],
    checklistRequired: [
      { name: 'PAN Card of Applicant / Business', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Aadhaar Card of Primary Promoter', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Proof of Business Address (Electricity Bill / Rent Agreement)', formats: 'PDF', maxSize: '10 MB' },
      { name: 'Bank Account Statement / Cancelled Cheque', formats: 'PDF, JPG', maxSize: '5 MB' },
    ],
    checklistAdditional: [
      { name: 'NOC from Property Owner (if rented)', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Board Resolution / Authorization Letter', formats: 'PDF', maxSize: '5 MB' },
    ],
    whatsIncluded: [
      'Document verification by CA/CS professional.',
      'Application drafting and GST portal filing.',
      'Clarification drafting if query raised by GST Officer.',
      'Official GST Registration Certificate (Form GST REG-06).',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'gst-faq-1', question: 'How long does GST registration take?', answer: 'It typically takes 3 to 7 working days subject to government portal response and officer approval.' },
      { id: 'gst-faq-2', question: 'Is physical verification mandatory?', answer: 'Physical verification is required only if Aadhaar authentication fails or if flagged by tax risk parameters.' },
      { id: 'gst-faq-3', question: 'Can a sole proprietor apply for GST?', answer: 'Yes, sole proprietors can register using their personal PAN and Aadhaar details.' },
      { id: 'gst-faq-4', question: 'What happens if I operate without GST?', answer: 'Operating above threshold without GST attracts a 100% penalty of tax due or ₹10,000, whichever is higher.' },
    ],
  },
  {
    id: 'trademark-registration',
    title: 'Trademark Registration',
    tag: 'INTELLECTUAL PROPERTY',
    breadcrumb: 'Services / Intellectual Property',
    description: 'Protect your brand name, logo, or tagline with nationwide legal ownership under the TM Registry.',
    priceLine: 'From ₹4,999',
    priceNumeric: 4999,
    videoUrl: null,
    keyDetails: [
      'Provides exclusive legal rights to use ™ and ® symbols.',
      '10 years validity with renewal options every 10 years.',
      'Covers brand names, logos, slogans, and distinctive sound marks.',
      'Public TM search conducted prior to application filing.',
      'Protection enforceable in courts across all Indian states.',
    ],
    whatIsBody:
      'Trademark registration grants exclusive ownership over a brand name, logo, or device mark under the Trade Marks Act. It prevents competitors from infringing upon your brand identity or confusing customers in the marketplace.',
    whatIsCitation: 'Trade Marks Act, 1999 — Section 18 & Section 28',
    benefits: [
      'Legal right to use the ® symbol next to your registered mark.',
      'Exclusive commercial ownership across all 45 trademark classes.',
      'Valuable intangible corporate asset for business valuation.',
      'Protection against counterfeiting and copycat competitors.',
      'Basis for international brand registration under Madrid Protocol.',
    ],
    checklistRequired: [
      { name: 'Logo / Brand Name Image', formats: 'PNG, JPG', maxSize: '5 MB' },
      { name: 'Applicant Identity & Address Proof', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Udyam / MSME Certificate (for 50% govt fee rebate)', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Signed TM-48 Power of Attorney Form', formats: 'PDF', maxSize: '5 MB' },
    ],
    checklistAdditional: [
      { name: 'User Affidavit (if brand is already in commercial use)', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Incorporation Certificate (for corporate applicants)', formats: 'PDF', maxSize: '5 MB' },
    ],
    whatsIncluded: [
      'Comprehensive trademark availability search report.',
      'Drafting of trademark application (Form TM-A).',
      'Government filing under appropriate class.',
      'TM application number generation for immediate ™ usage.',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'tm-faq-1', question: 'When can I start using the ™ symbol?', answer: 'You can use the ™ symbol immediately after receiving your TM application acknowledgement number.' },
      { id: 'tm-faq-2', question: 'How long does full registration take?', answer: 'The registration process takes 6 to 12 months if no examination objections or third-party oppositions arise.' },
      { id: 'tm-faq-3', question: 'What is a Trademark Class?', answer: 'Trademarks are categorized into 45 classes (34 for goods, 11 for services) defining your scope of protection.' },
      { id: 'tm-faq-4', question: 'What if someone opposes my trademark application?', answer: 'Our legal team will assist in preparing a formal counter-statement to defend your brand mark.' },
    ],
  },
  {
    id: 'msme-registration',
    title: 'MSME Registration',
    tag: 'GOVERNMENT SCHEMES',
    breadcrumb: 'Services / Government Schemes',
    description: 'Get your Udyam Registration Certificate to unlock priority bank loans, subsidies, and government tenders.',
    priceLine: 'From ₹999',
    priceNumeric: 999,
    videoUrl: null,
    keyDetails: [
      '100% paperless registration linked directly to Aadhaar & PAN.',
      'Free from government fees; verified professional assistance.',
      'Lifetime validity with no recurring renewal requirement.',
      'Categorized into Micro, Small, or Medium enterprise automatically.',
      'Unlocks protection against delayed payments under MSMED Act.',
    ],
    whatIsBody:
      'Udyam Registration (MSME) is a government registration scheme under the Micro, Small and Medium Enterprises Development Act. It certifies enterprises to qualify for central and state incentives, tax rebates, and credit guarantees.',
    whatIsCitation: 'Micro, Small and Medium Enterprises Development Act, 2006 — Section 7',
    benefits: [
      'Collateral-free bank loans under Credit Guarantee Fund Scheme (CGTMSE).',
      '50% discount on government fees for Trademark filing.',
      'Concession on electricity bills and ISO certification charges.',
      'Protection against delayed payments with mandatory statutory interest.',
      'Exemption from Earnest Money Deposit (EMD) in government tenders.',
    ],
    checklistRequired: [
      { name: 'Aadhaar Card of Business Owner / Partner', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'PAN Card of Business / Individual', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'GSTIN (if applicable for business classification)', formats: 'PDF', maxSize: '5 MB' },
    ],
    checklistAdditional: [
      { name: 'Bank Account Number and IFSC Code', formats: 'PDF', maxSize: '5 MB' },
    ],
    whatsIncluded: [
      'Data verification against Income Tax & GST databases.',
      'Online application submission on Udyam Portal.',
      'Official Udyam Registration Certificate with QR Code.',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'msme-faq-1', question: 'Is Udyam Registration mandatory?', answer: 'It is optional but strongly recommended to avail government subsidies, low-interest credit, and tender exemptions.' },
      { id: 'msme-faq-2', question: 'Can existing businesses update Udyam details?', answer: 'Yes, details can be updated online anytime through Aadhaar OTP verification.' },
      { id: 'msme-faq-3', question: 'What are the turnover limits for Micro enterprises?', answer: 'Micro enterprises have investment under ₹1 Crore and annual turnover under ₹5 Crore.' },
      { id: 'msme-faq-4', question: 'Does MSME certificate expire?', answer: 'No, Udyam Registration has lifetime validity.' },
    ],
  },
  {
    id: 'fssai-registration',
    title: 'FSSAI Registration',
    tag: 'LICENSES & PERMITS',
    breadcrumb: 'Services / Licenses & Permits',
    description: 'Mandatory Food Safety License/Registration for food operators, cloud kitchens, and restaurants.',
    priceLine: 'From ₹1,999',
    priceNumeric: 1999,
    videoUrl: null,
    keyDetails: [
      'Mandatory for all Food Business Operators (FBOs) in India.',
      '1 to 5 years validity options available.',
      'Includes 14-digit FSSAI License number generation.',
      'Covers manufacturers, traders, restaurants, and cloud kitchens.',
      'Compliant with Food Safety and Standards Regulations.',
    ],
    whatIsBody:
      'FSSAI Registration is a mandatory food safety license issued by the Food Safety and Standards Authority of India under the FSS Act, 2006. It certifies that food handled by the operator meets statutory hygienic standards.',
    whatIsCitation: 'Food Safety and Standards Act, 2006 — Section 31',
    benefits: [
      'Legal compliance to display 14-digit FSSAI number on packaging.',
      'Mandatory requirement for Swiggy, Zomato, and Amazon Food listing.',
      'Consumer trust in hygiene and food quality compliance.',
      'Protection against heavy penalties up to ₹5 Lakhs for unlicensed operations.',
      'Facilitates food export approvals and corporate catering orders.',
    ],
    checklistRequired: [
      { name: 'Passport Size Photo of Applicant', formats: 'JPG, PNG', maxSize: '2 MB' },
      { name: 'Identity Proof (PAN / Aadhaar / Voter ID)', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Proof of Business Premises (Utility Bill / Rent Agreement)', formats: 'PDF', maxSize: '10 MB' },
      { name: 'List of Food Products to be handled', formats: 'PDF', maxSize: '2 MB' },
    ],
    checklistAdditional: [
      { name: 'NOC from Municipal Corporation / Panchayat', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Water Test Analysis Report (for food manufacturing units)', formats: 'PDF', maxSize: '5 MB' },
    ],
    whatsIncluded: [
      'Eligibility evaluation (Basic, State, or Central License).',
      'Form A / Form B drafting and portal submission.',
      'Query response handling with FoSCoS food authorities.',
      'Digital FSSAI License Certificate delivery.',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'fssai-faq-1', question: 'Which FSSAI license type do I need?', answer: 'Basic Registration is for turnover under ₹12 Lakhs; State License is for ₹12L–20Cr; Central License is for above ₹20Cr or multi-state operations.' },
      { id: 'fssai-faq-2', question: 'Is FSSAI required for home chefs?', answer: 'Yes, home kitchens selling food commercially must obtain basic FSSAI registration.' },
      { id: 'fssai-faq-3', question: 'How do I renew my FSSAI license?', answer: 'Renewal application must be filed at least 30 days prior to license expiry date.' },
      { id: 'fssai-faq-4', question: 'Where must FSSAI number be displayed?', answer: 'It must be displayed at business premises and printed on all product packages/invoices.' },
    ],
  },
  {
    id: 'company-registration',
    title: 'Company Registration',
    tag: 'CORPORATE FORMATION',
    breadcrumb: 'Services / Corporate Formation',
    description: 'Incorporate your Private Limited Company with MCA approval, SPICe+ filing, DIN, PAN, and TAN.',
    priceLine: 'From ₹7,999',
    priceNumeric: 7999,
    videoUrl: null,
    keyDetails: [
      'Includes RUN name approval and SPICe+ MCA filing.',
      'Provides Certificate of Incorporation (CoI), PAN, TAN, & DIN.',
      'Digital Signature Certificates (DSC) for 2 directors included.',
      'Drafting of Memorandum (MoA) & Articles of Association (AoA).',
      'Free Zero-balance Bank Account opening assistance included.',
    ],
    whatIsBody:
      'Private Limited Company Incorporation is the legal process of forming a corporate entity under the Companies Act, 2013. It establishes a separate legal entity with limited liability for shareholders and corporate governance rights.',
    whatIsCitation: 'Companies Act, 2013 — Section 3 & Section 7',
    benefits: [
      'Limited financial liability protecting personal assets of founders.',
      'Separate legal entity capable of holding property and entering contracts.',
      'Preferred structure for venture capital investment and angel funding.',
      'High corporate status and commercial credibility.',
      'Perpetual succession — company continues regardless of member changes.',
    ],
    checklistRequired: [
      { name: 'PAN Card of all Directors / Shareholders', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Aadhaar / Passport / Voter ID of Directors', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Latest Bank Statement / Utility Bill (Identity Proof)', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Registered Office Address Proof (Electricity Bill / Rent Agreement)', formats: 'PDF', maxSize: '10 MB' },
    ],
    checklistAdditional: [
      { name: 'NOC from Property Owner', formats: 'PDF', maxSize: '5 MB' },
      { name: 'Specimen Signature & Photo of Directors', formats: 'JPG', maxSize: '2 MB' },
    ],
    whatsIncluded: [
      'Name Reservation (RUN application).',
      'Class 3 Digital Signature Certificate (DSC) for 2 Directors.',
      'SPICe+ Part A & B Filing with Ministry of Corporate Affairs.',
      'e-MoA and e-AoA drafting.',
      'Company PAN, TAN, and Certificate of Incorporation (CoI).',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'pvt-faq-1', question: 'How many directors are required for a Pvt Ltd company?', answer: 'A minimum of 2 directors and 2 shareholders are required (can be the same persons).' },
      { id: 'pvt-faq-2', question: 'What is the minimum capital requirement?', answer: 'There is no statutory minimum paid-up capital requirement under the Companies Act.' },
      { id: 'pvt-faq-3', question: 'How long does incorporation take?', answer: 'Incorporation generally takes 7 to 14 working days depending on MCA processing speed.' },
      { id: 'pvt-faq-4', question: 'Can foreign nationals become directors?', answer: 'Yes, at least one director must be a resident of India (stayed 182+ days in preceding year).' },
    ],
  },
  {
    id: 'itr-filing',
    title: 'ITR Filing',
    tag: 'TAX COMPLIANCE',
    breadcrumb: 'Services / Tax Compliance',
    description: 'Expert-assisted Income Tax Return filing for salaried individuals, freelancers, and businesses.',
    priceLine: 'From ₹999',
    priceNumeric: 999,
    videoUrl: null,
    keyDetails: [
      'Covers ITR-1, ITR-2, ITR-3, and ITR-4 forms.',
      'Maximized tax deductions under Old and New Tax Regimes.',
      'Capital gains calculation for stocks, mutual funds, and crypto.',
      'Form 26AS, AIS, and TIS reconciliation included.',
      'Instant e-Verification assistance post filing.',
    ],
    whatIsBody:
      'Income Tax Return (ITR) filing is the mandatory submission of annual income and tax payment details to the Income Tax Department under the Income Tax Act, 1961. Timely filing ensures legal compliance and tax refund processing.',
    whatIsCitation: 'Income Tax Act, 1961 — Section 139(1)',
    benefits: [
      'Avoid late filing fees up to ₹5,000 under Section 234F.',
      'Mandatory document proof for home loans, personal loans, and visa approvals.',
      'Carry forward capital losses to offset against future taxable gains.',
      'Claim income tax refunds directly into verified bank account.',
      'Clean tax record for corporate contracts and financial credibility.',
    ],
    checklistRequired: [
      { name: 'Form 16 (for Salaried Individuals)', formats: 'PDF', maxSize: '10 MB' },
      { name: 'PAN and Aadhaar Card', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Bank Account Statements for the Financial Year', formats: 'PDF', maxSize: '10 MB' },
      { name: 'Capital Gains Statement from Broker (if trading stocks/MFs)', formats: 'PDF, Excel', maxSize: '10 MB' },
    ],
    checklistAdditional: [
      { name: 'Investment Proofs (80C, 80D, NPS receipts)', formats: 'PDF', maxSize: '10 MB' },
      { name: 'Home Loan Interest Certificate (if applicable)', formats: 'PDF', maxSize: '5 MB' },
    ],
    whatsIncluded: [
      'Computation of Total Income & Tax Liability.',
      'Reconciliation with Form 26AS, AIS, and TIS.',
      'Selection of optimal tax regime (Old vs New Regime analysis).',
      'Electronic filing of ITR on Income Tax e-Filing portal.',
      'ITR-V Acknowledgement delivery.',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'itr-faq-1', question: 'What is the due date for individual ITR filing?', answer: 'For non-audit individuals, the standard due date is July 31st following the financial year.' },
      { id: 'itr-faq-2', question: 'Can I file ITR if my income is below taxable limit?', answer: 'Yes, filing a Nil ITR builds financial proof for loans and visa applications.' },
      { id: 'itr-faq-3', question: 'What happens if I miss the July 31st deadline?', answer: 'You can file a Belated Return up to December 31st with late fee under Section 234F.' },
      { id: 'itr-faq-4', question: 'How do I e-verify my filed return?', answer: 'You can e-verify instantly using Aadhaar OTP, NetBanking, or Demat account EVCs.' },
    ],
  },
  {
    id: 'legal-notice',
    title: 'Legal Notice',
    tag: 'LEGAL DRAFTING',
    breadcrumb: 'Services / Legal Drafting',
    description: 'Custom legal notice drafted by advocate for cheque bounce, recovery of money, eviction, or breach of contract.',
    priceLine: 'From ₹1,999',
    priceNumeric: 1999,
    videoUrl: null,
    keyDetails: [
      'Drafted by senior advocate with domain specialization.',
      'Includes advocate letterhead, physical dispatch via registered post.',
      'Dispatched with Speed Post tracking and postal receipt.',
      'Includes 1 round of revision prior to dispatch.',
      'Pre-requisite step for initiating civil or criminal litigation.',
    ],
    whatIsBody:
      'A Legal Notice is a formal written communication sent by an advocate on behalf of a client informing the recipient of legal action intended against them if specific grievances are not remedied within a stipulated period.',
    whatIsCitation: 'Code of Civil Procedure, 1908 — Section 80 & Negotiable Instruments Act, 1881 — Section 138',
    benefits: [
      'Formal legal warning signaling serious intent to litigate.',
      'Resolves 70%+ disputes out of court without expensive trials.',
      'Creates mandatory legal record required by courts before filing suits.',
      'Establishes clear timeline (typically 15–30 days) for compliance.',
      'Drafted precisely to prevent adverse admissions in court.',
    ],
    subtypes: [
      { id: 'cheque-bounce', label: 'Cheque Bounce (Sec 138)' },
      { id: 'recovery-money', label: 'Recovery of Money' },
      { id: 'tenant-eviction', label: 'Tenant Eviction' },
      { id: 'consumer-dispute', label: 'Consumer Dispute' },
    ],
    checklistRequired: {
      'cheque-bounce': [
        { name: 'Original Cheque Copy (Front & Back)', formats: 'PDF, JPG', maxSize: '5 MB' },
        { name: 'Bank Cheque Return Memo', formats: 'PDF, JPG', maxSize: '5 MB' },
        { name: 'Proof of Loan / Invoice / Contract', formats: 'PDF', maxSize: '10 MB' },
      ],
      'recovery-money': [
        { name: 'Invoices / Receipts / Ledger Statements', formats: 'PDF', maxSize: '10 MB' },
        { name: 'Bank Transfer Records / UPI Statements', formats: 'PDF', maxSize: '5 MB' },
        { name: 'Written Agreement / WhatsApp Communications', formats: 'PDF', maxSize: '5 MB' },
      ],
      'tenant-eviction': [
        { name: 'Rent / Lease Agreement Copy', formats: 'PDF', maxSize: '10 MB' },
        { name: 'Rent Default Proof / Utility Bills', formats: 'PDF', maxSize: '5 MB' },
        { name: 'Property Ownership Document', formats: 'PDF', maxSize: '10 MB' },
      ],
      'consumer-dispute': [
        { name: 'Purchase Invoice / Service Bill', formats: 'PDF', maxSize: '5 MB' },
        { name: 'Defect / Deficiency Proof (Photos / Emails)', formats: 'PDF, JPG', maxSize: '10 MB' },
        { name: 'Complaint / Email trail with Seller', formats: 'PDF', maxSize: '5 MB' },
      ],
    },
    checklistAdditional: [
      { name: 'ID Proof of Sender', formats: 'PDF, JPG', maxSize: '5 MB' },
      { name: 'Recipient Complete Address & Phone Number', formats: 'PDF, TXT', maxSize: '2 MB' },
    ],
    whatsIncluded: [
      'Telephonic consultation with advocate to discuss facts.',
      'Drafting of legal notice on advocate letterhead.',
      'Dispatch via Registered Post / Speed Post.',
      'Sharing of tracking receipt and digital soft copy.',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'notice-faq-1', question: 'How much time does recipient get to respond?', answer: 'Statutory notices usually grant 15 days (e.g. Sec 138) or 30 days to remedy the grievance.' },
      { id: 'notice-faq-2', question: 'What if the recipient refuses to accept the post?', answer: 'Refusal to accept registered post is deemed valid service under Section 27 of General Clauses Act.' },
      { id: 'notice-faq-3', question: 'Is a legal notice mandatory before filing a court case?', answer: 'It is mandatory in Cheque Bounce (Sec 138) and cases against government bodies; recommended in all civil matters.' },
      { id: 'notice-faq-4', question: 'What if recipient does not reply?', answer: 'If no reply or remedy is provided within the period, you can proceed to file a court suit.' },
    ],
  },
  {
    id: 'rent-agreement',
    title: 'Rent Agreement',
    tag: 'CONTRACT DRAFTING',
    breadcrumb: 'Services / Contract Drafting',
    description: 'Legally binding Rental / Lease Agreement drafted by legal expert with custom clauses and e-stamping option.',
    priceLine: 'From ₹799',
    priceNumeric: 799,
    videoUrl: null,
    keyDetails: [
      'Drafted strictly according to state-specific Rent Control Acts.',
      'Covers lock-in period, security deposit, maintenance, & escalation clauses.',
      'Delivered in editable Word doc and print-ready PDF formats.',
      'Optional e-stamp paper & doorstep physical delivery available.',
      'Protects rights of both landlord and tenant against unfair disputes.',
    ],
    whatIsBody:
      'A Rent Agreement is a legal contract executed between a property owner (landlord) and a tenant defining terms of tenancy, monthly rent, security deposit, maintenance obligations, and termination conditions.',
    whatIsCitation: 'Transfer of Property Act, 1882 — Section 105 & State Rent Control Acts',
    benefits: [
      'Prevents unauthorized property occupation and tenant holding over.',
      'Valid address proof for tenant (Aadhaar update, bank account, passport).',
      'Defines clear rent payment due date, late fees, and lock-in period.',
      'Specifies maintenance responsibility and security deposit refund conditions.',
      'Enforceable evidence in rent tribunal or civil court in case of default.',
    ],
    subtypes: [
      { id: 'residential', label: 'Residential Tenancy' },
      { id: 'commercial', label: 'Commercial Lease' },
    ],
    checklistRequired: {
      residential: [
        { name: 'Landlord Identity Proof (Aadhaar / PAN)', formats: 'PDF, JPG', maxSize: '5 MB' },
        { name: 'Tenant Identity Proof (Aadhaar / PAN)', formats: 'PDF, JPG', maxSize: '5 MB' },
        { name: 'Property Title Proof / Electricity Bill', formats: 'PDF', maxSize: '10 MB' },
      ],
      commercial: [
        { name: 'Landlord Property Ownership Documents', formats: 'PDF', maxSize: '10 MB' },
        { name: 'Tenant Business Certificate / GSTIN / PAN', formats: 'PDF', maxSize: '5 MB' },
        { name: 'Building Approval / Electricity Sanction Plan', formats: 'PDF', maxSize: '10 MB' },
      ],
    },
    checklistAdditional: [
      { name: 'Two Witness Identity Proofs', formats: 'PDF', maxSize: '5 MB' },
    ],
    whatsIncluded: [
      'Tailored drafting of 11-month or multi-year lease agreement.',
      'Insertion of specific custom clauses requested by parties.',
      'Sharing of soft copy (PDF & editable DOCX).',
      'Assistance with e-stamping guidance.',
    ],
    howItWorksSteps: COMMON_HOW_IT_WORKS,
    faq: [
      { id: 'rent-faq-1', question: 'Why is an 11-month rent agreement common?', answer: 'Agreements under 12 months do not require mandatory registration under Registration Act 1908, saving stamp duty and registration fees.' },
      { id: 'rent-faq-2', question: 'Is e-stamp paper required?', answer: 'Yes, to be legally admissible in court, the agreement must be executed on appropriate state stamp paper.' },
      { id: 'rent-faq-3', question: 'Can the landlord increase rent during lock-in period?', answer: 'No, rent escalation clauses apply only upon agreement renewal or as explicitly specified in the contract.' },
      { id: 'rent-faq-4', question: 'What is a lock-in period?', answer: 'A period during which neither party can terminate the tenancy without paying penalty fees.' },
    ],
  },
];

/** Quick lookup function by service ID */
export function getServiceById(id: string): ServiceDetailPayload | undefined {
  return DOCUMENT_SERVICES.find((s) => s.id === id);
}
