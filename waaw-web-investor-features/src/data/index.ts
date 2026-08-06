// Constants shared with the Expo app's src/data/index.ts — kept in sync by
// hand since this is a separate repo/project, not a shared package.

export const BUSINESS_STAGES = ['Idea', 'Pre-seed', 'Seed', 'Pre-Series A', 'Series A+'];
export const STARTUP_SECTORS = ['AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'Logistics', 'Other'];
export const SOCIAL_PLATFORMS = ['Website', 'Twitter/X', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube'];
export const MIN_COFOUNDERS = 2;
export const EDUCATION_LEVELS = ['Secondary school', "Bachelor's degree", "Master's degree", 'Doctorate', 'Other'];
export const ID_TYPES = ['Passport', 'National ID', "Driver's license", "Voter's card"];
// These carry identity information on both sides; passport and voter's card don't.
export const ID_TYPES_REQUIRING_BACK = ['National ID', "Driver's license"];
export const REFERENCE_TYPES = ['Work', 'Character'] as const;
export const MIN_REFERENCES = 2;

export const REGISTRATION_COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom', 'United States', 'Canada', 'Other'];

// WAAW staff still verify the actual document during review — this only
// changes the label/placeholder so founders know what to look for, it's
// not a claim that the platform enforces each country's legal requirements.
export const INCORPORATION_DOC_LABELS: Record<string, string> = {
  Nigeria: 'CAC Certificate of Incorporation',
  Ghana: 'Certificate of Incorporation (Registrar General’s Department)',
  Kenya: 'Certificate of Incorporation (Business Registration Service)',
  'South Africa': 'CIPC Certificate of Incorporation',
  'United Kingdom': 'Certificate of Incorporation (Companies House)',
  'United States': 'Articles of Incorporation',
  Canada: 'Certificate of Incorporation',
  Other: 'Certificate of incorporation / business registration document',
};

export const BANK_CURRENCIES = ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'GBP', 'CAD'];

export const PROOF_OF_ADDRESS_TYPES = ['Utility bill', 'Bank statement', 'Tenancy agreement', 'Government-issued letter'];

export interface LegalDoc {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    title: 'Terms of service',
    updated: '1 July 2025',
    sections: [
      {
        heading: '1. Who we are',
        body: 'WAAW is operated by Workerholics Solutions Limited. WAAW connects Black diaspora investors with verified Black-founded startups seeking capital. WAAW is not a bank, broker-dealer, or investment adviser.',
      },
      {
        heading: '2. Eligibility',
        body: 'You must be 18 or older and able to form a binding contract in your jurisdiction to use WAAW. Investors must complete identity verification (KYC) before committing capital.',
      },
      {
        heading: '3. Commitments and escrow',
        body: 'Capital you commit is held in a protected escrow account until the receiving startup countersigns the term sheet. WAAW never transfers funds outside the escrow flow.',
      },
      {
        heading: '4. Platform fee',
        body: 'WAAW charges a 5% commission on successfully closed raises, deducted from funds released to the startup. See the Commission disclosure for details.',
      },
      {
        heading: '5. No investment advice',
        body: 'Nothing on WAAW constitutes financial, legal, or tax advice. All startup listings are provided by founders and reviewed, but not guaranteed, by WAAW.',
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    updated: '1 July 2025',
    sections: [
      {
        heading: 'Data we collect',
        body: 'Name, email, country, KYC documents (selfie and government ID), investment activity, and device/session information necessary to operate your account.',
      },
      {
        heading: 'How we use it',
        body: 'To verify your identity, process commitments, comply with financial regulation, and communicate updates about your account and investments.',
      },
      {
        heading: 'Your rights',
        body: 'Under UK GDPR and the Nigeria Data Protection Act 2023, you can request a full export or deletion of your personal data at any time from the app.',
      },
      {
        heading: 'Data sharing',
        body: 'We do not sell personal data. Data is shared only with regulators, escrow providers, and service providers strictly necessary to operate WAAW.',
      },
    ],
  },
  'cookie-policy': {
    title: 'Cookie policy',
    updated: '1 July 2025',
    sections: [
      {
        heading: 'Essential cookies',
        body: 'Required for login, security, and session management. These cannot be disabled.',
      },
      {
        heading: 'Analytics cookies',
        body: 'Help us understand how investors and founders use WAAW so we can improve the platform. You can opt out at any time.',
      },
      {
        heading: 'Marketing cookies',
        body: 'Used to personalise content and offers. Off by default — enable them in notification settings if you\'d like personalised updates.',
      },
    ],
  },
  ndpc: {
    title: 'NDPC compliance',
    updated: '1 July 2025',
    sections: [
      {
        heading: 'Registration',
        body: 'WAAW (operated by Workerholics Solutions Limited) is registered with the Nigeria Data Protection Commission and complies with the Nigeria Data Protection Act 2023.',
      },
      {
        heading: 'Data protection officer',
        body: 'A designated data protection officer oversees compliance with NDPA requirements for all Nigerian user data processed on WAAW.',
      },
      {
        heading: 'Cross-border transfers',
        body: 'Where personal data is transferred outside Nigeria (e.g. to escrow or KYC providers), WAAW ensures adequate safeguards consistent with NDPA requirements.',
      },
    ],
  },
  'escrow-terms': {
    title: 'Escrow terms',
    updated: '1 July 2025',
    sections: [
      {
        heading: 'How escrow works',
        body: 'When an investor commits capital, funds move immediately into a protected, segregated escrow account — never directly to the founder or WAAW.',
      },
      {
        heading: 'Release conditions',
        body: 'Funds release to the startup only after the term sheet is countersigned by both parties and any regulatory conditions are met.',
      },
      {
        heading: 'Refunds',
        body: 'Investors may request a refund of a commitment at any time while it remains "In escrow" and before the startup countersigns.',
      },
    ],
  },
  'commission-terms': {
    title: 'Commission disclosure',
    updated: '1 July 2025',
    sections: [
      {
        heading: 'Platform fee',
        body: 'WAAW charges a 5% commission on capital successfully released to a startup. There is no fee on commitments that are refunded.',
      },
      {
        heading: 'No fee to investors',
        body: 'Investors are never charged a commission. The full committed amount moves into escrow; the 5% fee is deducted only from funds released to the founder.',
      },
      {
        heading: 'Boost pricing',
        body: 'Founder profile boosts are a separate, optional paid feature (from $20/week) and are not a commission on any raise.',
      },
    ],
  },
};

// Illustrative-only conversion rates (not live market rates) so diaspora
// investors get a rough sense of scale in a familiar currency alongside USD.
export const CURRENCY_RATES: { code: string; symbol: string; rate: number }[] = [
  { code: 'NGN', symbol: '₦', rate: 1550 },
  { code: 'GHS', symbol: 'GH₵', rate: 15.5 },
  { code: 'KES', symbol: 'KSh', rate: 129 },
];

export const nextInterviewSlot = (businessDaysOut: number): string => {
  const d = new Date();
  let added = 0;
  while (added < businessDaysOut) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  d.setHours(11, 0, 0, 0);
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) + ' at 11:00 AM';
};

export const ONBOARDING_STEPS = [
  { id: 'stage', path: '/onboarding/stage', label: 'Business stage' },
  { id: 'cofounders', path: '/onboarding/cofounders', label: 'Co-founders' },
  { id: 'social-links', path: '/onboarding/social-links', label: 'Business social links' },
  { id: 'address', path: '/onboarding/address', label: 'Address verification' },
  { id: 'company', path: '/onboarding/company', label: 'Company verification' },
  { id: 'documents', path: '/onboarding/documents', label: 'Documents' },
  { id: 'interview', path: '/onboarding/interview', label: 'Founder interview' },
] as const;
