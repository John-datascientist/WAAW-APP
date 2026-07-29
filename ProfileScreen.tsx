import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { ProfileRow, Divider, GoldButton, GhostButton, Monogram } from '../components';
import { KYC, Commitment, AuthUser } from '../data';

interface Props {
  user: AuthUser | null;
  commitments: Commitment[];
  kyc: KYC | null;
  onGoStartups: () => void;
  onGoPortfolio: () => void;
  onOpenChecklist: () => void;
  onOpenSecurity: () => void;
  onOpenLegal: () => void;
  onOpenStatements: () => void;
  onOpenAbout: () => void;
  onOpenReferral: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
  onCheckKycStatus: () => void;
}

const fmt = (n: number) => '$' + n.toLocaleString();

export default function ProfileScreen({
  user,
  commitments,
  kyc,
  onGoStartups,
  onGoPortfolio,
  onOpenChecklist,
  onOpenSecurity,
  onOpenLegal,
  onOpenStatements,
  onOpenAbout,
  onOpenReferral,
  onSignIn,
  onSignUp,
  onSignOut,
  onCheckKycStatus,
}: Props) {
  const active = commitments.filter((c) => c.status !== 'Refunded');
  const total = active.reduce((a, c) => a + c.amount, 0);
  const isInvestor = user?.role === 'investor';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {user ? (
            <Monogram letter={user.name.charAt(0).toUpperCase()} size={80} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>◉</Text>
            </View>
          )}
          <Text style={styles.profileName}>{user ? user.name : 'Your profile'}</Text>
          <Text style={[styles.kycStatus, kyc ? { color: colors.accent } : {}]}>
            {user
              ? `${user.role.toUpperCase()}${isInvestor ? ` · ${kyc ? kyc.status.toUpperCase() : 'NOT VERIFIED YET'}` : ''}`
              : 'NOT SIGNED IN'}
          </Text>
        </View>

        <Divider style={{ marginBottom: 0 }} />

        {!user && (
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Sign in or create an account</Text>
            <Text style={styles.authBody}>
              Sign up as an investor to commit capital, or as a founder to apply for funding.
            </Text>
            <GoldButton label="Sign up" onPress={onSignUp} style={{ marginTop: spacing.md }} />
            <GhostButton label="Sign in" onPress={onSignIn} style={{ marginTop: spacing.sm }} />
          </View>
        )}

        {isInvestor && (
          <>
            <ProfileRow label="Escrow" value={fmt(total)} onPress={onGoPortfolio} />
            <ProfileRow
              label="Verify identity"
              value={kyc ? kyc.status : 'Start'}
              accent={!kyc}
              onPress={onOpenChecklist}
            />
            {kyc && kyc.status === 'Pending' && (
              <TouchableOpacity onPress={onCheckKycStatus} activeOpacity={0.7} style={styles.kycCheckLink}>
                <Text style={styles.kycCheckText}>Check verification status →</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {user?.role !== 'founder' && (
          <ProfileRow label="Deal flow" value="Browse" onPress={onGoStartups} />
        )}

        {isInvestor && (
          <ProfileRow label="Statements" value="View" onPress={onOpenStatements} />
        )}

        <ProfileRow label="Legal & compliance" value="Open" onPress={onOpenLegal} />

        {user && (
          <ProfileRow label="Account settings" value="Open" onPress={onOpenSecurity} />
        )}

        {user && (
          <ProfileRow label="Invite & earn" value="Share" onPress={onOpenReferral} />
        )}

        <ProfileRow label="How WAAW works" value="Learn" onPress={onOpenAbout} />

        {user && (
          <ProfileRow label="Sign out" value="" onPress={onSignOut} />
        )}

        <TouchableOpacity style={styles.siteLink} onPress={() => Linking.openURL('https://waaw.co')} activeOpacity={0.7}>
          <Text style={styles.siteLinkText}>OPEN FULL WEBSITE →</Text>
        </TouchableOpacity>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>WAAW INVESTOR · VERSION 1.0.0</Text>
          <Text style={styles.appInfoText}>WORKERHOLICS SOLUTIONS LIMITED</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 100 },
  avatarWrap: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarIcon: { fontSize: 32, color: colors.muted },
  profileName: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.text,
    marginTop: 14,
    marginBottom: 6,
  },
  kycStatus: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.8,
  },
  authCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  authTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    color: colors.text,
    marginBottom: 6,
  },
  authBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    fontWeight: '300' as any,
  },
  kycCheckLink: { paddingVertical: 10, paddingBottom: 16 },
  kycCheckText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accent },
  siteLink: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 10,
  },
  siteLinkText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1,
  },
  appInfo: { alignItems: 'center', marginTop: 32, gap: 4 },
  appInfoText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.line,
    letterSpacing: 0.8,
  },
});
