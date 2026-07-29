import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton, GhostButton, ProgressBar } from '../../components';
import { FounderOnboarding, BoostPlan, FounderActivityEvent, isFounderOnboardingComplete } from '../../data';
import { copyToClipboard, founderProfileUrl } from '../../lib/clipboard';

interface Props {
  founderName: string;
  onboarding: FounderOnboarding;
  boostPlan: BoostPlan | null;
  boostUntil: string | null;
  boostUntilTs: number | null;
  boostActive: boolean;
  profileId: string | null;
  linkCopyCount: number;
  profileViewCount: number;
  investorViewCount: number;
  raisedAmount: number;
  raisingAmount: number;
  investorCount: number;
  activity: FounderActivityEvent[];
  onOpenOnboarding: () => void;
  onOpenBoost: () => void;
  onPreview: () => void;
  onCopyProfileLink: () => void;
  onCopyOnePager: () => void;
}

const fmt = (n: number) => '$' + n.toLocaleString();

export default function FounderDashboardScreen({
  founderName,
  onboarding,
  boostPlan,
  boostUntil,
  boostUntilTs,
  boostActive,
  profileId,
  linkCopyCount,
  profileViewCount,
  investorViewCount,
  raisedAmount,
  raisingAmount,
  investorCount,
  activity,
  onOpenOnboarding,
  onOpenBoost,
  onPreview,
  onCopyProfileLink,
  onCopyOnePager,
}: Props) {
  const complete = isFounderOnboardingComplete(onboarding);
  const interviewDone = onboarding.interviewRequested;
  const fullyLive = complete && interviewDone;
  const [copied, setCopied] = useState(false);
  const [onePagerCopied, setOnePagerCopied] = useState(false);

  const daysRemaining = boostUntilTs ? Math.max(0, Math.ceil((boostUntilTs - Date.now()) / 86400000)) : null;

  const handleCopyLink = async () => {
    if (!profileId) return;
    const ok = await copyToClipboard(founderProfileUrl(profileId));
    if (ok) {
      onCopyProfileLink();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyOnePager = async () => {
    const lines = [
      onboarding.companyName || 'Untitled startup',
      `${onboarding.sector || 'Sector TBD'} · ${onboarding.businessStage ?? 'Stage TBD'}`,
      '',
      onboarding.pitch || 'No pitch summary yet.',
      '',
      `Raising: $${onboarding.raisingAmount.toLocaleString()}`,
      `Team: ${onboarding.cofounders.map((c) => `${c.name} (${c.role})`).join(', ')}`,
      ...(onboarding.businessSocialLinks.length
        ? [`Links: ${onboarding.businessSocialLinks.map((l) => `${l.platform}: ${l.url}`).join(' · ')}`]
        : []),
      ...(profileId ? ['', founderProfileUrl(profileId)] : []),
    ];
    const ok = await copyToClipboard(lines.join('\n'));
    if (ok) {
      onCopyOnePager();
      setOnePagerCopied(true);
      setTimeout(() => setOnePagerCopied(false), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.wordmark}>WAAW</Text>
        <Text style={styles.title}>Welcome, {founderName}</Text>

        {!fullyLive ? (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              {complete ? 'Interview pending' : 'Finish your onboarding'}
            </Text>
            <Text style={styles.progressBody}>
              {complete
                ? 'All verification steps are complete. Request your founder interview to go live on WAAW.'
                : 'Complete co-founder verification, address and company checks, and upload your pitch materials before you can go live.'}
            </Text>
            <GoldButton label="Continue onboarding" onPress={onOpenOnboarding} style={{ marginTop: spacing.md }} />
            {onboarding.companyVerified && (
              <>
                <GhostButton label="Preview public profile" onPress={onPreview} style={{ marginTop: spacing.sm }} />
                <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7} style={styles.copyLinkBtn}>
                  <Text style={styles.copyLinkText}>
                    {copied ? 'Profile link copied!' : 'Copy profile link to share'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <>
            <View style={styles.statusCard}>
              <Text style={styles.statusBadge}>✓ VERIFIED FOUNDER</Text>
              <Text style={styles.statusBody}>
                {onboarding.companyName || 'Your startup'} has completed onboarding and is under WAAW review.
              </Text>
              <TouchableOpacity onPress={onOpenOnboarding} activeOpacity={0.7}>
                <Text style={styles.reviewLink}>Review onboarding details →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPreview} activeOpacity={0.7}>
                <Text style={styles.reviewLink}>Preview public profile →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7}>
                <Text style={styles.reviewLink}>{copied ? 'Profile link copied!' : 'Copy profile link →'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopyOnePager} activeOpacity={0.7}>
                <Text style={styles.reviewLink}>{onePagerCopied ? 'One-pager copied!' : 'Copy company one-pager →'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>YOUR RAISE</Text>
            <View style={styles.raiseCard}>
              <View style={styles.raiseRow}>
                <Text style={styles.raiseAmt}>{fmt(raisedAmount)}</Text>
                <Text style={styles.raiseTarget}>of {fmt(raisingAmount)}</Text>
              </View>
              <ProgressBar pct={raisingAmount > 0 ? Math.round((raisedAmount / raisingAmount) * 100) : 0} />
              <Text style={styles.raiseSub}>
                {investorCount === 0
                  ? 'No commitments yet — share your profile link to reach investors.'
                  : `${investorCount} commitment${investorCount === 1 ? '' : 's'} in escrow`}
              </Text>
            </View>

            <Text style={styles.sectionLabel}>SHARE PERFORMANCE</Text>
            <View style={styles.statRow}>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{investorViewCount}</Text>
                <Text style={styles.statLabel}>INVESTOR VIEWS</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{profileViewCount}</Text>
                <Text style={styles.statLabel}>YOUR PREVIEWS</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{linkCopyCount}</Text>
                <Text style={styles.statLabel}>LINK COPIES</Text>
              </View>
            </View>

            {activity.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
                <View style={styles.activityCard}>
                  {activity.slice(0, 6).map((a, i) => (
                    <View key={a.id} style={[styles.activityRow, i < Math.min(activity.length, 6) - 1 && styles.activityRowBorder]}>
                      <Text style={styles.activityLabel}>{a.label}</Text>
                      <Text style={styles.activityTime}>{a.timestamp}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.sectionLabel}>BOOST YOUR PROFILE</Text>
            <TouchableOpacity style={styles.boostCard} onPress={onOpenBoost} activeOpacity={0.85}>
              <Text style={styles.boostIcon}>🚀</Text>
              <Text style={styles.boostTitle}>
                {boostActive
                  ? `Boosted until ${boostUntil}`
                  : boostPlan
                    ? 'Your boost has expired'
                    : 'Get featured on the home page'}
              </Text>
              <Text style={styles.boostSub}>
                {boostActive
                  ? `Current plan: ${boostPlan!.label}${daysRemaining !== null ? ` · ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left` : ''}`
                  : boostPlan
                    ? 'Tap to re-boost and get featured again'
                    : 'Plans from $20/week — see options'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingBottom: 100 },
  wordmark: { fontFamily: fonts.serifBoldItalic, fontSize: 24, color: colors.text, marginBottom: 20 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.text, marginBottom: 24 },
  progressCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
  },
  progressTitle: { fontFamily: fonts.serifItalic, fontSize: 19, color: colors.text, marginBottom: 8 },
  progressBody: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, lineHeight: 19, fontWeight: '300' as any },
  copyLinkBtn: { marginTop: spacing.md, alignItems: 'center' },
  copyLinkText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accent },
  statusCard: {
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: '#f0fdf4',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statusBadge: { fontFamily: fonts.monoBold, fontSize: 10, color: colors.success, letterSpacing: 0.8, marginBottom: 8 },
  statusBody: { fontFamily: fonts.sans, fontSize: 13, color: colors.text, lineHeight: 19, fontWeight: '300' as any, marginBottom: 10 },
  reviewLink: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accent, marginTop: 8 },
  sectionLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.accent, letterSpacing: 1.4, marginBottom: spacing.md },
  raiseCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  raiseRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  raiseAmt: { fontFamily: fonts.serif, fontSize: 24, color: colors.accent },
  raiseTarget: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted },
  raiseSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, marginTop: 8, letterSpacing: 0.4 },
  activityCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  activityLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.text,
    fontWeight: '300' as any,
    flex: 1,
    marginRight: 8,
  },
  activityTime: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.xl },
  statTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statValue: { fontFamily: fonts.serif, fontSize: 22, color: colors.accent, marginBottom: 4 },
  statLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.muted, letterSpacing: 0.6, textAlign: 'center' },
  boostCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
  },
  boostIcon: { fontSize: 26, marginBottom: 8 },
  boostTitle: { fontFamily: fonts.serifItalic, fontSize: 17, color: colors.text, marginBottom: 4 },
  boostSub: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, letterSpacing: 0.4 },
});
