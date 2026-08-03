export type EscrowStatus = 'In escrow' | 'Countersigned' | 'Released' | 'Refunded';

export interface Commitment {
  id: string;
  startupId: string;
  company: string;
  amount: number;
  ref: string;
  status: EscrowStatus;
  date: string;
}

// Parses postMoney-style strings ("$4.375M", "$6M", "$350K") into a raw
// dollar figure for the investment calculator. Returns null for anything
// that isn't a valuation yet (e.g. "TBD").
export const parseMoneyValue = (s: string): number | null => {
  const m = s.trim().match(/^\$?([\d.]+)\s*([MK]?)$/i);
  if (!m) return null;
  const num = parseFloat(m[1]);
  if (isNaN(num)) return null;
  const mult = m[2].toUpperCase() === 'M' ? 1_000_000 : m[2].toUpperCase() === 'K' ? 1_000 : 1;
  return num * mult;
};

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface TeamMember {
  name: string;
  role: string;
  socialLink: string;
}

export interface Startup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  country: string;
  city: string;
  pitch: string;
  raisingAmount: number;
  raisedAmount: number;
  equity: string;
  postMoney: string;
  verified: boolean;
  founderName: string;
  founderBio: string;
  tags: string[];
  boosted?: boolean;
  team?: TeamMember[];
  socialLinks?: SocialLink[];
  createdAt?: string;
}

export interface KYC {
  country: string;
  status: 'Verified' | 'Pending' | 'Not started';
}

// Mirrors the `type` check constraint on waaw_notifications in Supabase —
// keep in sync with supabase/schema.sql if that constraint ever changes.
export type NotificationType = 'commitment' | 'escrow' | 'kyc' | 'general' | 'syndicate';

export interface Notice {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
}

export interface FounderActivityEvent {
  id: string;
  label: string;
  timestamp: string;
}

export interface NotificationPrefs {
  commitments: boolean;
  deals: boolean;
  marketing: boolean;
}

export interface AuthUser {
  name: string;
  email: string;
  role: 'investor' | 'founder';
  referralCode: string;
}

export const genReferralCode = (name: string) => {
  const first = (name.split(' ')[0] || 'WAAW').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'WAAW';
  return `${first}${Math.floor(1000 + Math.random() * 9000)}`;
};

export interface Cofounder {
  id: string;
  name: string;
  role: string;
  selfieDone: boolean;
  idDone: boolean;
  socialLink: string;
}

export interface FounderOnboarding {
  businessStage: string | null;
  cofounders: Cofounder[];
  companyName: string;
  registrationNumber: string;
  sector: string;
  pitch: string;
  raisingAmount: number;
  companyVerified: boolean;
  addressLine: string;
  addressVerified: boolean;
  businessSocialLinks: SocialLink[];
  pitchDeckUploaded: boolean;
  businessPlanUploaded: boolean;
  pitchVideoUploaded: boolean;
  interviewRequested: boolean;
  interviewScheduledFor: string | null;
}

export const BUSINESS_STAGES = ['Idea', 'Pre-seed', 'Seed', 'Pre-Series A', 'Series A+'];
export const STARTUP_SECTORS = ['AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'Logistics', 'Other'];
export const SOCIAL_PLATFORMS = ['Website', 'Twitter/X', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube'];
export const MIN_COFOUNDERS = 2;

export const emptyFounderOnboarding = (founderName: string): FounderOnboarding => ({
  businessStage: null,
  cofounders: [
    { id: '1', name: founderName, role: 'Founder', selfieDone: false, idDone: false, socialLink: '' },
  ],
  companyName: '',
  registrationNumber: '',
  sector: '',
  pitch: '',
  raisingAmount: 0,
  companyVerified: false,
  addressLine: '',
  addressVerified: false,
  businessSocialLinks: [],
  pitchDeckUploaded: false,
  businessPlanUploaded: false,
  pitchVideoUploaded: false,
  interviewRequested: false,
  interviewScheduledFor: null,
});

// Picks a demo interview slot a few business days out, skipping weekends,
// so requesting an interview produces a real-looking scheduled date instead
// of just flipping a boolean forever.
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

const cofounderDone = (c: Cofounder) => c.selfieDone && c.idDone && c.socialLink.trim().length > 0;

export const isFounderOnboardingComplete = (f: FounderOnboarding) =>
  !!f.businessStage &&
  f.cofounders.length >= MIN_COFOUNDERS &&
  f.cofounders.every(cofounderDone) &&
  f.businessSocialLinks.length > 0 &&
  f.addressVerified &&
  f.companyVerified &&
  f.pitchDeckUploaded &&
  f.businessPlanUploaded &&
  f.pitchVideoUploaded;

export const founderOnboardingToStartup = (
  founderName: string,
  f: FounderOnboarding,
  boosted: boolean
): Startup => ({
  id: 'founder-' + founderName.toLowerCase().replace(/\s+/g, '-'),
  name: f.companyName,
  sector: f.sector,
  stage: f.businessStage ?? 'Idea',
  country: '',
  city: f.addressLine,
  pitch: f.pitch,
  raisingAmount: f.raisingAmount,
  raisedAmount: 0,
  equity: 'TBD',
  postMoney: 'TBD',
  verified: false,
  founderName,
  founderBio: '',
  tags: [],
  boosted,
  team: f.cofounders.map((c) => ({ name: c.name, role: c.role, socialLink: c.socialLink })),
  socialLinks: f.businessSocialLinks,
});

export interface LegalDoc {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  Terms: {
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
  Privacy: {
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
        body: 'Under UK GDPR and the Nigeria Data Protection Act 2023, you can request a full export or deletion of your personal data at any time from the Statements screen.',
      },
      {
        heading: 'Data sharing',
        body: 'We do not sell personal data. Data is shared only with regulators, escrow providers, and service providers strictly necessary to operate WAAW.',
      },
    ],
  },
  CookiePolicy: {
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
  Ndpc: {
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
  EscrowTerms: {
    title: 'Escrow terms',
    updated: '1 July 2025',
    sections: [
      {
        heading: 'How escrow works',
        body: 'When you commit capital, funds move immediately into a protected, segregated escrow account — never directly to the founder or WAAW.',
      },
      {
        heading: 'Release conditions',
        body: 'Funds release to the startup only after the term sheet is countersigned by both parties and any regulatory conditions are met.',
      },
      {
        heading: 'Refunds',
        body: 'You may request a refund of a commitment at any time while it remains "In escrow" and before the startup countersigns, directly from your Portfolio.',
      },
    ],
  },
  CommissionTerms: {
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

export interface BoostPlan {
  id: 'week' | 'month' | 'quarter';
  label: string;
  price: number;
  days: number;
}

export const BOOST_PLANS: BoostPlan[] = [
  { id: 'week', label: '1 week', price: 20, days: 7 },
  { id: 'month', label: '1 month', price: 70, days: 30 },
  { id: 'quarter', label: '3 months', price: 180, days: 90 },
];

export interface BoostPurchase {
  id: string;
  plan: BoostPlan;
  purchasedAt: string;
}

export const MOCK_STARTUPS: Startup[] = [
  {
    id: '1',
    name: 'FarmLink Africa',
    sector: 'AgriTech',
    stage: 'Seed',
    country: 'Nigeria',
    city: 'Lagos',
    pitch: 'Cold-chain logistics connecting 1,200 smallholder farmers to urban markets, reducing post-harvest loss by 40%.',
    raisingAmount: 350000,
    raisedAmount: 147000,
    equity: '8%',
    postMoney: '$4.375M',
    verified: true,
    founderName: 'Adaeze Okonkwo',
    founderBio: 'Former Unilever supply chain lead with 10 years in West African logistics. Built and exited a B2B e-commerce platform in 2019.',
    tags: ['B2B', 'Revenue generating', 'Female founder'],
    team: [
      { name: 'Adaeze Okonkwo', role: 'Co-founder / CEO', socialLink: 'https://linkedin.com/in/adaeze-okonkwo' },
      { name: 'Bayo Adeyemi', role: 'Co-founder / COO', socialLink: 'https://linkedin.com/in/bayo-adeyemi' },
    ],
    socialLinks: [
      { id: 's1', platform: 'Website', url: 'https://farmlinkafrica.com' },
      { id: 's2', platform: 'Instagram', url: 'https://instagram.com/farmlinkafrica' },
    ],
  },
  {
    id: '2',
    name: 'PayBridge West Africa',
    sector: 'FinTech',
    stage: 'Pre-Series A',
    country: 'Ghana',
    city: 'Accra',
    pitch: 'B2B payments infrastructure enabling West African SMEs to accept cross-border payments without a bank account.',
    raisingAmount: 600000,
    raisedAmount: 108000,
    equity: '10%',
    postMoney: '$6M',
    verified: true,
    founderName: 'Kwame Mensah',
    founderBio: 'Ex-Flutterwave product manager. MSc Computer Science from UCL. 340% YoY GMV growth in 18 months.',
    tags: ['B2B', 'Revenue generating', 'Infrastructure'],
    team: [
      { name: 'Kwame Mensah', role: 'Co-founder / CEO', socialLink: 'https://linkedin.com/in/kwame-mensah' },
      { name: 'Efua Asante', role: 'Co-founder / CTO', socialLink: 'https://twitter.com/efua_asante' },
    ],
    socialLinks: [
      { id: 's3', platform: 'Website', url: 'https://paybridge.africa' },
      { id: 's4', platform: 'Twitter/X', url: 'https://twitter.com/paybridgeafrica' },
      { id: 's5', platform: 'LinkedIn', url: 'https://linkedin.com/company/paybridge' },
    ],
  },
  {
    id: '3',
    name: 'CareLink East Africa',
    sector: 'HealthTech',
    stage: 'Seed',
    country: 'Kenya',
    city: 'Nairobi',
    pitch: 'Telemedicine platform serving underserved East African communities. Integrated with NHIF for insurance billing.',
    raisingAmount: 450000,
    raisedAmount: 27000,
    equity: '12%',
    postMoney: '$3.75M',
    verified: false,
    founderName: 'Ngozi Eze',
    founderBio: 'Qualified physician with 8 years in public health. 8,000 patient consultations delivered to date.',
    tags: ['B2C', 'Pre-revenue', 'Impact'],
    team: [
      { name: 'Ngozi Eze', role: 'Co-founder / CEO', socialLink: 'https://linkedin.com/in/ngozi-eze' },
      { name: 'Otieno Odhiambo', role: 'Co-founder / Medical Director', socialLink: 'https://linkedin.com/in/otieno-odhiambo' },
    ],
    socialLinks: [
      { id: 's6', platform: 'Website', url: 'https://carelinkea.com' },
    ],
  },
];
