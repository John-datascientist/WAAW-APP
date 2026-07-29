import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import {
  useFonts,
  Newsreader_500Medium,
  Newsreader_500Medium_Italic,
  Newsreader_600SemiBold,
  Newsreader_600SemiBold_Italic,
} from '@expo-google-fonts/newsreader';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { colors, fonts, spacing } from './src/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { useStartups, useWatchlist as useRealWatchlist, useNotifications as useRealNotifications } from './src/hooks/useWAAW';
import { supabase, isSupabaseConfigured } from './src/lib/supabase';
import TabBar, { Tab } from './src/navigation/TabBar';
import AgeGateScreen from './src/screens/AgeGateScreen';
import CookieConsentScreen from './src/screens/CookieConsentScreen';
import RiskWarningScreen from './src/screens/RiskWarningScreen';
import HomeScreen from './src/screens/HomeScreen';
import StartupsScreen from './src/screens/StartupsScreen';
import StartupDetailScreen from './src/screens/StartupDetailScreen';
import CompareScreen from './src/screens/CompareScreen';
import CommitScreen from './src/screens/CommitScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LegalHubScreen from './src/screens/legal/LegalHubScreen';
import LegalDocScreen from './src/screens/legal/LegalDocScreen';
import SecurityScreen from './src/screens/security/SecurityScreen';
import ChangePasswordScreen from './src/screens/security/ChangePasswordScreen';
import Setup2FAScreen from './src/screens/security/Setup2FAScreen';
import LoginHistoryScreen from './src/screens/security/LoginHistoryScreen';
import InvestorChecklistScreen from './src/screens/investor/InvestorChecklistScreen';
import InvestorKYCScreen from './src/screens/investor/InvestorKYCScreen';
import StatementsScreen from './src/screens/investor/StatementsScreen';
import AboutScreen from './src/screens/AboutScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import ReferralScreen from './src/screens/ReferralScreen';
import RoleSelectScreen from './src/screens/auth/RoleSelectScreen';
import SignUpScreen, { SignUpData } from './src/screens/auth/SignUpScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import VerifyScreen from './src/screens/auth/VerifyScreen';
import FounderWelcomeScreen from './src/screens/auth/FounderWelcomeScreen';
import FounderOnboardingScreen from './src/screens/founder/FounderOnboardingScreen';
import BusinessStageScreen from './src/screens/founder/BusinessStageScreen';
import CofoundersScreen from './src/screens/founder/CofoundersScreen';
import CofounderVerifyScreen from './src/screens/founder/CofounderVerifyScreen';
import BusinessSocialLinksScreen from './src/screens/founder/BusinessSocialLinksScreen';
import AddressVerificationScreen from './src/screens/founder/AddressVerificationScreen';
import CompanyVerificationScreen from './src/screens/founder/CompanyVerificationScreen';
import UploadStepScreen from './src/screens/founder/UploadStepScreen';
import InterviewScreen from './src/screens/founder/InterviewScreen';
import FounderDashboardScreen from './src/screens/founder/FounderDashboardScreen';
import BoostProfileScreen from './src/screens/founder/BoostProfileScreen';
import {
  Commitment,
  Startup,
  KYC,
  AuthUser,
  FounderOnboarding,
  BoostPlan,
  Notice,
  NotificationPrefs,
  FounderActivityEvent,
  emptyFounderOnboarding,
  isFounderOnboardingComplete,
  founderOnboardingToStartup,
  nextInterviewSlot,
  LEGAL_DOCS,
} from './src/data';

type Onboarding = 'age' | 'cookies' | 'done';

type UploadKind = 'pitch-deck' | 'business-plan' | 'pitch-video';

type AppScreen =
  | { type: 'tabs' }
  | { type: 'startup-detail'; startup: Startup }
  | { type: 'risk-gate'; startup?: Startup }
  | { type: 'commit'; startup: Startup }
  | { type: 'checklist' }
  | { type: 'investor-kyc' }
  | { type: 'legal-hub' }
  | { type: 'security' }
  | { type: 'change-password' }
  | { type: 'setup-2fa' }
  | { type: 'login-history' }
  | { type: 'statements' }
  | { type: 'about' }
  | { type: 'notifications' }
  | { type: 'risk-warning' }
  | { type: 'role-select' }
  | { type: 'sign-up'; role: 'investor' | 'founder' }
  | { type: 'sign-in' }
  | { type: 'forgot-password' }
  | { type: 'verify' }
  | { type: 'founder-welcome'; name: string }
  | { type: 'founder-onboarding' }
  | { type: 'founder-stage' }
  | { type: 'founder-cofounders' }
  | { type: 'founder-cofounder-verify'; cofounderId: string }
  | { type: 'founder-social-links' }
  | { type: 'founder-address' }
  | { type: 'founder-company' }
  | { type: 'founder-upload'; kind: UploadKind }
  | { type: 'founder-interview' }
  | { type: 'founder-preview' }
  | { type: 'boost' }
  | { type: 'referral' }
  | { type: 'notification-settings' }
  | { type: 'compare' }
  | { type: 'legal-doc'; doc: string };

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <View style={styles.configError}>
        <Text style={styles.configErrorTitle}>Configuration error</Text>
        <Text style={styles.configErrorBody}>
          EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY are missing at build time.
          Check that both are set for the Production environment in your hosting provider's
          environment variables, then trigger a fresh deploy (not a cached one).
        </Text>
      </View>
    );
  }
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

// ─── Mappers: real Supabase rows → the app's existing local-first shapes ────
// Keeping every screen's props/interfaces untouched (they all already expect
// Startup/Notice from src/data), so only App.tsx's data source changes.
const mapStartupRow = (r: any): Startup => ({
  id: r.id,
  name: r.name,
  sector: r.sector,
  stage: r.stage,
  country: r.country,
  city: r.city,
  pitch: r.pitch,
  raisingAmount: Number(r.raising_amount),
  raisedAmount: Number(r.raised_amount),
  equity: r.equity_pct != null ? `${r.equity_pct}%` : 'TBD',
  postMoney: r.post_money_valuation != null ? '$' + Number(r.post_money_valuation).toLocaleString() : 'TBD',
  verified: r.verified,
  founderName: r.founder_name ?? '',
  founderBio: r.founder_bio ?? '',
  tags: r.tags ?? [],
  boosted: r.boost_active,
  team: (r.waaw_cofounders ?? []).map((c: any) => ({ name: c.name, role: c.role, socialLink: '' })),
  socialLinks: [],
});

const mapNotificationRow = (r: any): Notice => ({
  id: r.id,
  title: r.title,
  body: r.body,
  timestamp: new Date(r.created_at).toLocaleString(),
  read: r.read,
});

// The founder's own onboarding draft (before it's a real registered startup
// row) uses a synthetic non-UUID id — real watchlist rows have a foreign key
// to real startup UUIDs, so saving that draft can't be persisted server-side.
const isRealStartupId = (id: string) => !id.startsWith('founder-');

function AppInner() {
  const [fontsLoaded] = useFonts({
    Newsreader_500Medium,
    Newsreader_500Medium_Italic,
    Newsreader_600SemiBold,
    Newsreader_600SemiBold_Italic,
    IBMPlexMono_400Regular,
    IBMPlexMono_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const { user: supabaseUser, profile, signUp, verifySignup, resendSignupCode, signIn, signOut } = useAuth();
  const { startups: startupRows } = useStartups();
  const { watchlist: realWatchlist, toggle: toggleRealWatchlist } = useRealWatchlist();
  const { notifications: notificationRows, unread: unreadFromHook, markAllRead: markAllNoticesRead, toggleRead: toggleNoticeRead } = useRealNotifications();

  const user: AuthUser | null = profile
    ? {
        name: profile.full_name ?? '',
        email: profile.email,
        role: profile.role,
        referralCode: profile.referral_code ?? '',
      }
    : null;

  const [onboarding, setOnboarding] = useState<Onboarding>('age');
  const [preLoginLegalDoc, setPreLoginLegalDoc] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<AppScreen>({ type: 'tabs' });
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [kyc, setKyc] = useState<KYC | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // ─── Sign-up flow transitional state (email/role held between the sign-up
  // form and the verify-code screen — the account itself is real, via Supabase) ──
  const [pendingSignup, setPendingSignup] = useState<SignUpData | null>(null);
  const [pendingStartup, setPendingStartup] = useState<Startup | null>(null);

  // ─── Founder onboarding + boost state (mock/local — the onboarding wizard
  // doesn't yet collect every field the real startups table requires, e.g.
  // equity_pct/post_money_valuation, so this stays a local draft until a
  // future pass extends the wizard and registers it for real) ──────────────
  const [founderOnboarding, setFounderOnboarding] = useState<FounderOnboarding | null>(null);
  const [boostPlan, setBoostPlan] = useState<BoostPlan | null>(null);
  const [boostUntil, setBoostUntil] = useState<string | null>(null);
  const [boostUntilTs, setBoostUntilTs] = useState<number | null>(null);
  const [localWatchlist, setLocalWatchlist] = useState<string[]>([]);
  const [profileViewCount, setProfileViewCount] = useState(0);
  const [investorViewCount, setInvestorViewCount] = useState(0);
  const [linkCopyCount, setLinkCopyCount] = useState(0);
  const [founderActivity, setFounderActivity] = useState<FounderActivityEvent[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [startupNotes, setStartupNotes] = useState<Record<string, string>>({});
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!user?.referralCode) return;
    supabase
      .from('waaw_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', user.referralCode)
      .then(({ count }) => setReferralCount(count ?? 0));
  }, [user?.referralCode]);

  // Real (DB-backed) watchlist for real startups, plus a local-only fallback
  // for the founder's own not-yet-registered draft (see isRealStartupId above).
  const watchlist = [...realWatchlist, ...localWatchlist];

  // ─── Notifications, notification prefs, referrals ──────────────────────────
  const notices = notificationRows.map(mapNotificationRow);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    commitments: true,
    deals: true,
    marketing: false,
  });

  if (!fontsLoaded) return <View style={styles.loading} />;

  // Once a founder's onboarding clears their interview, their startup joins
  // the real marketplace (unverified, pending WAAW review) — and an active
  // boost surfaces it on the investor home page, which is the whole point of
  // paying for a boost in the first place. This has to hold regardless of
  // who is currently signed in (or signed out) — the listing outlives the
  // founder's own session.
  // A boost is only actually active while its expiry is still in the
  // future — boostPlan/boostUntil otherwise stay set forever as a record of
  // the last plan purchased, which is why they alone can't drive "boosted".
  const boostActive = !!boostUntilTs && boostUntilTs > Date.now();

  const founderStartupRaw =
    founderOnboarding && founderOnboarding.interviewRequested
      ? founderOnboardingToStartup(
          founderOnboarding.cofounders[0]?.name ?? founderOnboarding.companyName,
          founderOnboarding,
          boostActive
        )
      : null;

  // Every non-refunded commitment counts toward its startup's live raise
  // progress, so the "raised" figure investors see reflects real activity
  // on this device instead of the static seed value forever.
  const committedByStartup: Record<string, number> = {};
  for (const c of commitments) {
    if (c.status !== 'Refunded') committedByStartup[c.startupId] = (committedByStartup[c.startupId] ?? 0) + c.amount;
  }
  const withLiveRaise = (s: Startup): Startup => ({
    ...s,
    raisedAmount: s.raisedAmount + (committedByStartup[s.id] ?? 0),
  });

  const dbStartups = startupRows.map(mapStartupRow);
  const baseStartups = founderStartupRaw ? [...dbStartups, founderStartupRaw] : dbStartups;
  const allStartups = baseStartups.map(withLiveRaise);
  const featuredStartups = allStartups.filter((s) => s.boosted);

  // A founder can preview their own profile mid-onboarding (once company
  // details exist), before it's actually live on the marketplace.
  const previewStartupRaw =
    founderOnboarding && founderOnboarding.companyVerified
      ? founderOnboardingToStartup(
          founderOnboarding.cofounders[0]?.name ?? founderOnboarding.companyName,
          founderOnboarding,
          boostActive
        )
      : null;
  const previewStartup = previewStartupRaw ? withLiveRaise(previewStartupRaw) : null;
  const founderInvestorCount = previewStartup
    ? commitments.filter((c) => c.startupId === previewStartup.id && c.status !== 'Refunded').length
    : 0;

  const unreadNoticeCount = unreadFromHook;
  const recentlyViewed = recentlyViewedIds
    .map((id) => allStartups.find((s) => s.id === id))
    .filter((s): s is Startup => !!s);

  // Inserts a real notification row for the signed-in user; the realtime
  // subscription in useNotifications picks it up and appends it automatically.
  const pushNotice = (title: string, body: string) => {
    if (!supabaseUser) return;
    supabase.from('waaw_notifications').insert({ user_id: supabaseUser.id, title, body, type: 'general' });
  };

  const pushFounderActivity = (label: string) => {
    setFounderActivity((prev) => [{ id: String(Date.now()) + Math.random(), label, timestamp: 'Just now' }, ...prev].slice(0, 20));
  };

  const handleSelectStartup = (startup: Startup) => {
    setRecentlyViewedIds((prev) => [startup.id, ...prev.filter((id) => id !== startup.id)].slice(0, 5));
    // Distinct from profileViewCount (which only counts the founder tapping
    // their own "Preview public profile" button) — this counts organic
    // investor interest in the live marketplace listing.
    if (founderStartupRaw && startup.id === founderStartupRaw.id && user?.role !== 'founder') {
      setInvestorViewCount((c) => c + 1);
      pushFounderActivity('An investor viewed your live listing');
    }
    setScreen({ type: 'startup-detail', startup });
  };

  // Committing capital is the moment someone acts as an investor. Guests are
  // routed into sign-up first; the risk warning is shown as the final step
  // of investor sign-up (or once, before a first commit on an older account).
  const handleCommit = (startup: Startup) => {
    if (!user) {
      setPendingStartup(startup);
      setScreen({ type: 'role-select' });
      return;
    }
    if (user.role !== 'investor') {
      Alert.alert('Investor account required', 'Sign in with an investor account to commit capital.');
      return;
    }
    if (!riskAccepted) {
      setScreen({ type: 'risk-gate', startup });
      return;
    }
    setScreen({ type: 'commit', startup });
  };

  const fmtMoney = (n: number) => '$' + n.toLocaleString();

  const handleCommitSuccess = (commitment: Commitment) => {
    // allStartups reflects raise progress from BEFORE this commitment (it's
    // derived from the commitments state prior to the update below), so it's
    // the right baseline for detecting a 50%/100% funding milestone.
    const target = allStartups.find((s) => s.id === commitment.startupId);
    if (target && notifPrefs.deals && target.raisingAmount > 0) {
      const pct = (n: number) => (n / target.raisingAmount) * 100;
      const prevPct = pct(target.raisedAmount);
      const nextPct = pct(target.raisedAmount + commitment.amount);
      if (prevPct < 100 && nextPct >= 100) {
        pushNotice('Deal fully funded', `${target.name} has reached its ${fmtMoney(target.raisingAmount)} raise target.`);
      } else if (prevPct < 50 && nextPct >= 50) {
        pushNotice('Deal milestone', `${target.name} has crossed 50% of its ${fmtMoney(target.raisingAmount)} raise target.`);
      }
    }
    if (founderStartupRaw && commitment.startupId === founderStartupRaw.id) {
      pushFounderActivity(`Investor committed ${fmtMoney(commitment.amount)}`);
    }
    setCommitments((prev) => [...prev, commitment]);
    if (notifPrefs.commitments) {
      pushNotice(
        'Commitment placed in escrow',
        `Your ${fmtMoney(commitment.amount)} commitment to ${commitment.company} is now held in escrow.`
      );
    }
  };

  const handleRequestRefund = (commitmentId: string) => {
    setCommitments((prev) => {
      const commitment = prev.find((c) => c.id === commitmentId);
      if (commitment && notifPrefs.commitments) {
        pushNotice('Refund requested', `Your ${fmtMoney(commitment.amount)} commitment to ${commitment.company} has been refunded.`);
      }
      return prev.map((c) => (c.id === commitmentId ? { ...c, status: 'Refunded' as const } : c));
    });
  };

  const goTabs = (t?: Tab) => {
    setScreen({ type: 'tabs' });
    if (t) setTab(t);
  };

  const COMING_SOON_LABELS: Record<string, string> = {
    EmailVerify: 'Email verification',
  };

  const showComingSoon = (label: string) => {
    Alert.alert('Coming soon', `${label} isn't available yet.`);
  };

  const handleNavigate = (name: string) => {
    switch (name) {
      case 'Security':
        setScreen({ type: 'security' });
        break;
      case 'KYC':
        setScreen({ type: 'investor-kyc' });
        break;
      case 'RiskWarning':
        setScreen({ type: 'risk-warning' });
        break;
      case 'Statements':
        setScreen({ type: 'statements' });
        break;
      case 'Startups':
        goTabs('startups');
        break;
      case 'Terms':
      case 'Privacy':
      case 'CookiePolicy':
      case 'Ndpc':
      case 'EscrowTerms':
      case 'CommissionTerms':
        setScreen({ type: 'legal-doc', doc: name });
        break;
      default:
        showComingSoon(COMING_SOON_LABELS[name] ?? name);
    }
  };

  // ─── Auth handlers (real Supabase auth) ─────────────────────────────────────
  const handleSignUpSubmit = async (data: SignUpData): Promise<string | null> => {
    const { error } = await signUp(data.email, data.password, data.role, data.name, data.country, data.referralCode);
    if (error) return error;
    setPendingSignup(data);
    setScreen({ type: 'verify' });
    return null;
  };

  const finishAuth = (signedUpRole: 'investor' | 'founder', signedUpName: string) => {
    if (signedUpRole === 'investor') {
      if (!riskAccepted) {
        setScreen({ type: 'risk-gate', startup: pendingStartup ?? undefined });
      } else if (pendingStartup) {
        setScreen({ type: 'commit', startup: pendingStartup });
      } else {
        goTabs('profile');
      }
    } else {
      setFounderOnboarding(emptyFounderOnboarding(signedUpName));
      setScreen({ type: 'founder-welcome', name: signedUpName });
    }
    setPendingStartup(null);
  };

  const handleVerify = async (code: string): Promise<string | null> => {
    if (!pendingSignup) return 'Something went wrong — please sign up again.';
    const { error } = await verifySignup(pendingSignup.email, code);
    if (error) return error;
    const { role, name } = pendingSignup;
    setPendingSignup(null);
    finishAuth(role, name);
    return null;
  };

  const handleResendCode = () => {
    if (pendingSignup) resendSignupCode(pendingSignup.email);
  };

  const handleSignInSubmit = async (email: string, password: string): Promise<string | null> => {
    const { error } = await signIn(email, password);
    if (error) return error;
    const { data: profileRow } = await supabase.from('waaw_profiles').select('role').eq('email', email).single();
    const role = profileRow?.role;
    if (role === 'investor' && pendingStartup) {
      if (!riskAccepted) {
        setScreen({ type: 'risk-gate', startup: pendingStartup });
      } else {
        setScreen({ type: 'commit', startup: pendingStartup });
      }
      setPendingStartup(null);
    } else {
      setPendingStartup(null);
      goTabs('profile');
    }
    return null;
  };

  const handleSignOut = () => {
    signOut();
    goTabs('home');
  };

  const handleCloseAccount = () => {
    // Deleting the underlying auth account requires a service-role key, which
    // the client never holds — so this signs the account out for real and
    // directs deletion through support rather than silently no-op'ing.
    pushNotice('Account closure requested', 'Sign out complete. Contact support to finish deleting your account and data.');
    signOut();
    setKyc(null);
    goTabs('home');
  };

  // Real review takes time; a mock KYC would otherwise sit at "Pending"
  // forever with no way for the investor to ever see "Verified".
  const handleCheckKycStatus = () => {
    setKyc((prev) => (prev ? { ...prev, status: 'Verified' } : prev));
    pushNotice('Identity verified', 'Your identity verification is complete. You can now commit capital.');
  };

  const handleRequestDataExport = () => {
    pushNotice('Data export requested', 'Your GDPR/NDPA data export request has been received. You will receive an email within 30 days.');
  };

  // ─── Founder onboarding handlers ────────────────────────────────────────────
  const updateFounderOnboarding = (patch: Partial<FounderOnboarding>) => {
    setFounderOnboarding((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleOpenFounderStep = (step: string) => {
    switch (step) {
      case 'stage':
        setScreen({ type: 'founder-stage' });
        break;
      case 'cofounders':
        setScreen({ type: 'founder-cofounders' });
        break;
      case 'social-links':
        setScreen({ type: 'founder-social-links' });
        break;
      case 'address':
        setScreen({ type: 'founder-address' });
        break;
      case 'company':
        setScreen({ type: 'founder-company' });
        break;
      case 'pitch-deck':
        setScreen({ type: 'founder-upload', kind: 'pitch-deck' });
        break;
      case 'business-plan':
        setScreen({ type: 'founder-upload', kind: 'business-plan' });
        break;
      case 'pitch-video':
        setScreen({ type: 'founder-upload', kind: 'pitch-video' });
        break;
      case 'interview':
        setScreen({ type: 'founder-interview' });
        break;
    }
  };

  const handleAddCofounder = (name: string, role: string) => {
    setFounderOnboarding((prev) =>
      prev
        ? {
            ...prev,
            cofounders: [
              ...prev.cofounders,
              { id: String(Date.now()), name, role, selfieDone: false, idDone: false, socialLink: '' },
            ],
          }
        : prev
    );
  };

  const handleRemoveCofounder = (cofounderId: string) => {
    setFounderOnboarding((prev) =>
      prev ? { ...prev, cofounders: prev.cofounders.filter((c) => c.id !== cofounderId) } : prev
    );
  };

  const handleCompleteCofounderVerify = (cofounderId: string, socialLink: string) => {
    setFounderOnboarding((prev) =>
      prev
        ? {
            ...prev,
            cofounders: prev.cofounders.map((c) =>
              c.id === cofounderId ? { ...c, selfieDone: true, idDone: true, socialLink } : c
            ),
          }
        : prev
    );
    setScreen({ type: 'founder-cofounders' });
  };

  const handleAddBusinessSocialLink = (platform: string, url: string) => {
    setFounderOnboarding((prev) =>
      prev
        ? { ...prev, businessSocialLinks: [...prev.businessSocialLinks, { id: String(Date.now()), platform, url }] }
        : prev
    );
  };

  const handleRemoveBusinessSocialLink = (id: string) => {
    setFounderOnboarding((prev) =>
      prev ? { ...prev, businessSocialLinks: prev.businessSocialLinks.filter((l) => l.id !== id) } : prev
    );
  };

  const handleToggleWatchlist = (startupId: string) => {
    if (isRealStartupId(startupId)) {
      toggleRealWatchlist(startupId);
    } else {
      // The founder's own not-yet-registered draft has no real row to save
      // against — fall back to a local-only toggle for that one edge case.
      setLocalWatchlist((prev) =>
        prev.includes(startupId) ? prev.filter((id) => id !== startupId) : [...prev, startupId]
      );
    }
  };

  // Comparing more than 2 deals at once stops being a "compare" screen, so a
  // third tap swaps out the oldest selection rather than growing the list.
  const handleToggleCompare = (startupId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(startupId)) return prev.filter((id) => id !== startupId);
      if (prev.length >= 2) return [prev[1], startupId];
      return [...prev, startupId];
    });
  };

  const handleChangeStartupNote = (startupId: string, note: string) => {
    setStartupNotes((prev) => ({ ...prev, [startupId]: note }));
  };

  const handleBoostPurchase = (plan: BoostPlan) => {
    // Renewing while a boost is still active should stack the new duration
    // on top of the remaining time, not discard it by resetting from now.
    const base = boostActive && boostUntilTs ? boostUntilTs : Date.now();
    const expiryTs = base + plan.days * 86400000;
    setBoostPlan(plan);
    setBoostUntil(new Date(expiryTs).toLocaleDateString());
    setBoostUntilTs(expiryTs);
  };

  // ─── Pre-app onboarding: age gate → cookie consent ─────────────────────────
  // These apply to every visitor. The investor risk warning does not — it
  // only shows as the final step of signing up as an investor (see below).
  if (onboarding === 'age') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <AgeGateScreen onConfirm={() => setOnboarding('cookies')} />
      </View>
    );
  }

  if (onboarding === 'cookies') {
    if (preLoginLegalDoc && LEGAL_DOCS[preLoginLegalDoc]) {
      return (
        <View style={styles.root}>
          <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
          <LegalDocScreen
            doc={LEGAL_DOCS[preLoginLegalDoc]}
            backLabel="Back"
            onBack={() => setPreLoginLegalDoc(null)}
          />
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <CookieConsentScreen
          onAcceptAll={() => setOnboarding('done')}
          onEssentialOnly={() => setOnboarding('done')}
          onViewPrivacy={() => setPreLoginLegalDoc('Privacy')}
          onViewTerms={() => setPreLoginLegalDoc('Terms')}
        />
      </View>
    );
  }

  // ─── Full-screen overlays ──────────────────────────────────────────────────
  if (screen.type === 'startup-detail') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <StartupDetailScreen
          startup={screen.startup}
          onBack={() => setScreen({ type: 'tabs' })}
          onCommit={handleCommit}
        />
      </View>
    );
  }

  if (screen.type === 'role-select') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <RoleSelectScreen
          intro={pendingStartup ? 'Create an investor account to commit capital.' : undefined}
          onBack={() => {
            setPendingStartup(null);
            goTabs();
          }}
          onSelectInvestor={() => setScreen({ type: 'sign-up', role: 'investor' })}
          onSelectFounder={() => setScreen({ type: 'sign-up', role: 'founder' })}
          onSignIn={() => setScreen({ type: 'sign-in' })}
        />
      </View>
    );
  }

  if (screen.type === 'sign-up') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <SignUpScreen
          role={screen.role}
          onBack={() => setScreen({ type: 'role-select' })}
          onSignIn={() => setScreen({ type: 'sign-in' })}
          onSubmit={handleSignUpSubmit}
        />
      </View>
    );
  }

  if (screen.type === 'sign-in') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <SignInScreen
          onBack={() => {
            setPendingStartup(null);
            goTabs();
          }}
          onSubmit={handleSignInSubmit}
          onForgotPassword={() => setScreen({ type: 'forgot-password' })}
          onSignUp={() => setScreen({ type: 'role-select' })}
        />
      </View>
    );
  }

  if (screen.type === 'forgot-password') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ForgotPasswordScreen
          onBack={() => setScreen({ type: 'sign-in' })}
          onSubmit={() => {}}
        />
      </View>
    );
  }

  if (screen.type === 'verify') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <VerifyScreen
          email={pendingSignup?.email ?? ''}
          onVerify={handleVerify}
          onResend={handleResendCode}
          onBack={() => setScreen({ type: 'role-select' })}
        />
      </View>
    );
  }

  if (screen.type === 'founder-welcome') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <FounderWelcomeScreen name={screen.name} onDone={() => goTabs('dashboard')} />
      </View>
    );
  }

  if (screen.type === 'founder-onboarding' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <FounderOnboardingScreen
          data={founderOnboarding}
          onBack={() => goTabs('dashboard')}
          onOpenStep={handleOpenFounderStep}
        />
      </View>
    );
  }

  if (screen.type === 'founder-stage' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <BusinessStageScreen
          value={founderOnboarding.businessStage}
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onSave={(stage) => {
            updateFounderOnboarding({ businessStage: stage });
            setScreen({ type: 'founder-onboarding' });
          }}
        />
      </View>
    );
  }

  if (screen.type === 'founder-cofounders' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <CofoundersScreen
          cofounders={founderOnboarding.cofounders}
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onAdd={handleAddCofounder}
          onVerify={(cofounderId) => setScreen({ type: 'founder-cofounder-verify', cofounderId })}
          onRemove={handleRemoveCofounder}
        />
      </View>
    );
  }

  if (screen.type === 'founder-cofounder-verify' && founderOnboarding) {
    const cofounder = founderOnboarding.cofounders.find((c) => c.id === screen.cofounderId);
    if (!cofounder) {
      setScreen({ type: 'founder-cofounders' });
      return null;
    }
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <CofounderVerifyScreen
          cofounder={cofounder}
          onBack={() => setScreen({ type: 'founder-cofounders' })}
          onComplete={(socialLink) => handleCompleteCofounderVerify(cofounder.id, socialLink)}
        />
      </View>
    );
  }

  if (screen.type === 'founder-social-links' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <BusinessSocialLinksScreen
          links={founderOnboarding.businessSocialLinks}
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onAdd={handleAddBusinessSocialLink}
          onRemove={handleRemoveBusinessSocialLink}
          onContinue={() => setScreen({ type: 'founder-onboarding' })}
        />
      </View>
    );
  }

  if (screen.type === 'founder-address' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <AddressVerificationScreen
          value={founderOnboarding.addressLine}
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onSave={(address) => {
            updateFounderOnboarding({ addressLine: address, addressVerified: true });
            setScreen({ type: 'founder-onboarding' });
          }}
        />
      </View>
    );
  }

  if (screen.type === 'founder-company' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <CompanyVerificationScreen
          value={{
            companyName: founderOnboarding.companyName,
            registrationNumber: founderOnboarding.registrationNumber,
            sector: founderOnboarding.sector,
            pitch: founderOnboarding.pitch,
            raisingAmount: founderOnboarding.raisingAmount,
          }}
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onSave={(details) => {
            updateFounderOnboarding({ ...details, companyVerified: true });
            setScreen({ type: 'founder-onboarding' });
          }}
        />
      </View>
    );
  }

  if (screen.type === 'founder-upload' && founderOnboarding) {
    const uploadCopy: Record<UploadKind, { icon: string; title: string; subtitle: string; fileLabel: string; fileHint: string }> = {
      'pitch-deck': {
        icon: '📊',
        title: 'Upload your pitch deck',
        subtitle: 'A concise deck covering problem, solution, market, traction, and team.',
        fileLabel: 'Upload pitch deck',
        fileHint: 'PDF or PPTX, up to 20MB',
      },
      'business-plan': {
        icon: '📋',
        title: 'Upload your business plan',
        subtitle: 'Your detailed plan covering strategy, operations, and financial projections.',
        fileLabel: 'Upload business plan',
        fileHint: 'PDF or DOCX, up to 20MB',
      },
      'pitch-video': {
        icon: '🎬',
        title: 'Upload your 2-minute pitch video',
        subtitle: 'A short video of a founder pitching the business directly to investors.',
        fileLabel: 'Upload pitch video',
        fileHint: 'MP4 or MOV, max 2 minutes',
      },
    };
    const copy = uploadCopy[screen.kind];
    const fieldMap: Record<UploadKind, keyof FounderOnboarding> = {
      'pitch-deck': 'pitchDeckUploaded',
      'business-plan': 'businessPlanUploaded',
      'pitch-video': 'pitchVideoUploaded',
    };
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <UploadStepScreen
          icon={copy.icon}
          title={copy.title}
          subtitle={copy.subtitle}
          fileLabel={copy.fileLabel}
          fileHint={copy.fileHint}
          ctaLabel="Save and continue"
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onComplete={() => {
            updateFounderOnboarding({ [fieldMap[screen.kind]]: true } as Partial<FounderOnboarding>);
            setScreen({ type: 'founder-onboarding' });
          }}
        />
      </View>
    );
  }

  if (screen.type === 'founder-interview' && founderOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <InterviewScreen
          ready={isFounderOnboardingComplete(founderOnboarding)}
          requested={founderOnboarding.interviewRequested}
          scheduledFor={founderOnboarding.interviewScheduledFor}
          onBack={() => setScreen({ type: 'founder-onboarding' })}
          onRequest={() =>
            updateFounderOnboarding({ interviewRequested: true, interviewScheduledFor: nextInterviewSlot(3) })
          }
        />
      </View>
    );
  }

  if (screen.type === 'boost') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <BoostProfileScreen
          activePlan={boostPlan}
          activeUntil={boostUntil}
          onBack={() => goTabs('dashboard')}
          onPurchase={handleBoostPurchase}
        />
      </View>
    );
  }

  if (screen.type === 'founder-preview' && previewStartup) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <StartupDetailScreen
          startup={previewStartup}
          backLabel="Dashboard"
          previewMode
          onBack={() => goTabs('dashboard')}
          onCommit={() => {}}
        />
      </View>
    );
  }

  if (screen.type === 'compare') {
    const compareA = allStartups.find((s) => s.id === compareIds[0]);
    const compareB = allStartups.find((s) => s.id === compareIds[1]);
    if (!compareA || !compareB) {
      goTabs('startups');
      return null;
    }
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <CompareScreen
          a={compareA}
          b={compareB}
          onBack={() => goTabs('startups')}
          onSelectStartup={handleSelectStartup}
          onRemoveSide={(id) => {
            setCompareIds((prev) => prev.filter((x) => x !== id));
            goTabs('startups');
          }}
        />
      </View>
    );
  }

  if (screen.type === 'referral' && user) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ReferralScreen
          referralCode={user.referralCode}
          referralCount={referralCount}
          onBack={() => goTabs('profile')}
        />
      </View>
    );
  }

  if (screen.type === 'notification-settings') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <NotificationSettingsScreen prefs={notifPrefs} onBack={() => setScreen({ type: 'notifications' })} onChange={setNotifPrefs} />
      </View>
    );
  }

  if (screen.type === 'risk-gate') {
    const { startup } = screen;
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <RiskWarningScreen
          onAccept={() => {
            setRiskAccepted(true);
            if (startup) setScreen({ type: 'commit', startup });
            else goTabs('profile');
          }}
        />
      </View>
    );
  }

  if (screen.type === 'commit') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <CommitScreen
          startup={screen.startup}
          onBack={() => goTabs('home')}
          onCommitSuccess={handleCommitSuccess}
        />
      </View>
    );
  }

  if (screen.type === 'checklist') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <InvestorChecklistScreen kycDone={!!kyc} riskDone={riskAccepted} onNavigate={handleNavigate} />
      </View>
    );
  }

  if (screen.type === 'investor-kyc') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <InvestorKYCScreen
          onBack={() => goTabs('profile')}
          onComplete={(country) => {
            setKyc({ country, status: 'Pending' });
            goTabs('profile');
          }}
        />
      </View>
    );
  }

  if (screen.type === 'legal-hub') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <LegalHubScreen onBack={() => goTabs('profile')} onNavigate={handleNavigate} />
      </View>
    );
  }

  if (screen.type === 'legal-doc') {
    const doc = LEGAL_DOCS[screen.doc];
    if (!doc) {
      setScreen({ type: 'legal-hub' });
      return null;
    }
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <LegalDocScreen doc={doc} onBack={() => setScreen({ type: 'legal-hub' })} />
      </View>
    );
  }

  if (screen.type === 'security') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <SecurityScreen
          twoFactorEnabled={twoFactorEnabled}
          onBack={() => goTabs('profile')}
          onChangePassword={() => setScreen({ type: 'change-password' })}
          onSetup2FA={() => setScreen({ type: 'setup-2fa' })}
          onLoginHistory={() => setScreen({ type: 'login-history' })}
          onSignOutAllDevices={handleSignOut}
          onCloseAccount={handleCloseAccount}
        />
      </View>
    );
  }

  if (screen.type === 'change-password') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ChangePasswordScreen onBack={() => setScreen({ type: 'security' })} />
      </View>
    );
  }

  if (screen.type === 'setup-2fa') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <Setup2FAScreen
          enabled={twoFactorEnabled}
          onBack={() => setScreen({ type: 'security' })}
          onToggle={(next) => {
            setTwoFactorEnabled(next);
            setScreen({ type: 'security' });
          }}
        />
      </View>
    );
  }

  if (screen.type === 'login-history') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <LoginHistoryScreen onBack={() => setScreen({ type: 'security' })} />
      </View>
    );
  }

  if (screen.type === 'statements') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <StatementsScreen
          onBack={() => goTabs('profile')}
          commitments={commitments}
          onRequestDataExport={handleRequestDataExport}
        />
      </View>
    );
  }

  if (screen.type === 'about') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <AboutScreen onBack={() => goTabs('profile')} />
      </View>
    );
  }

  if (screen.type === 'notifications') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <NotificationsScreen
          notices={notices}
          onBack={() => goTabs('home')}
          onMarkAllRead={markAllNoticesRead}
          onOpenSettings={() => setScreen({ type: 'notification-settings' })}
          onToggleRead={toggleNoticeRead}
        />
      </View>
    );
  }

  if (screen.type === 'risk-warning') {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <RiskWarningScreen
          onAccept={() => {
            setRiskAccepted(true);
            goTabs('profile');
          }}
        />
      </View>
    );
  }

  // ─── Main tab layout ───────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <View style={styles.screenWrap}>
        {tab === 'home' && (
          <HomeScreen
            commitments={commitments}
            featuredStartups={featuredStartups}
            savedStartups={allStartups.filter((s) => watchlist.includes(s.id))}
            unreadCount={unreadNoticeCount}
            onGoStartups={() => setTab('startups')}
            onGoProfile={() => setTab('profile')}
            onOpenNotifications={() => setScreen({ type: 'notifications' })}
            onSelectStartup={handleSelectStartup}
          />
        )}
        {tab === 'startups' && (
          <StartupsScreen
            startups={allStartups}
            watchlist={watchlist}
            recentlyViewed={recentlyViewed}
            compareIds={compareIds}
            onSelectStartup={handleSelectStartup}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={() => setScreen({ type: 'compare' })}
          />
        )}
        {tab === 'portfolio' && (
          <PortfolioScreen
            commitments={commitments}
            savedStartups={allStartups.filter((s) => watchlist.includes(s.id))}
            allStartups={allStartups}
            notes={startupNotes}
            onGoStartups={() => setTab('startups')}
            onSelectStartup={handleSelectStartup}
            onToggleWatchlist={handleToggleWatchlist}
            onRequestRefund={handleRequestRefund}
            onChangeNote={handleChangeStartupNote}
          />
        )}
        {tab === 'dashboard' && user?.role === 'founder' && founderOnboarding && (
          <FounderDashboardScreen
            founderName={user.name}
            onboarding={founderOnboarding}
            boostPlan={boostPlan}
            boostUntil={boostUntil}
            boostUntilTs={boostUntilTs}
            boostActive={boostActive}
            profileId={previewStartup?.id ?? null}
            linkCopyCount={linkCopyCount}
            profileViewCount={profileViewCount}
            investorViewCount={investorViewCount}
            raisedAmount={previewStartup?.raisedAmount ?? 0}
            raisingAmount={founderOnboarding.raisingAmount}
            investorCount={founderInvestorCount}
            activity={founderActivity}
            onOpenOnboarding={() => setScreen({ type: 'founder-onboarding' })}
            onOpenBoost={() => setScreen({ type: 'boost' })}
            onPreview={() => {
              setProfileViewCount((c) => c + 1);
              pushFounderActivity('You previewed your public profile');
              setScreen({ type: 'founder-preview' });
            }}
            onCopyProfileLink={() => {
              setLinkCopyCount((c) => c + 1);
              pushFounderActivity('Profile link copied to share');
            }}
            onCopyOnePager={() => pushFounderActivity('Company one-pager copied')}
          />
        )}
        {tab === 'profile' && (
          <ProfileScreen
            user={user}
            commitments={commitments}
            kyc={kyc}
            onGoStartups={() => setTab('startups')}
            onGoPortfolio={() => setTab('portfolio')}
            onOpenChecklist={() => setScreen({ type: 'checklist' })}
            onOpenSecurity={() => setScreen({ type: 'security' })}
            onOpenLegal={() => setScreen({ type: 'legal-hub' })}
            onOpenStatements={() => setScreen({ type: 'statements' })}
            onOpenAbout={() => setScreen({ type: 'about' })}
            onOpenReferral={() => setScreen({ type: 'referral' })}
            onSignIn={() => setScreen({ type: 'sign-in' })}
            onSignUp={() => setScreen({ type: 'role-select' })}
            onSignOut={handleSignOut}
            onCheckKycStatus={handleCheckKycStatus}
          />
        )}
      </View>

      <TabBar active={tab} onSelect={setTab} variant={user?.role === 'founder' ? 'founder' : 'investor'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, backgroundColor: colors.bg },
  screenWrap: { flex: 1 },
  configError: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  configErrorTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.danger,
    marginBottom: 12,
    textAlign: 'center',
  },
  configErrorBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300' as any,
  },
});
