import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Share, Platform } from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { GoldButton, StatTile } from '../components';

interface Props {
  referralCode: string;
  referralCount: number;
  onBack: () => void;
}

export default function ReferralScreen({ referralCode, referralCount, onBack }: Props) {
  const shareMessage = `Join me on WAAW and invest in verified African startups. Use my code ${referralCode} when you sign up: https://waaw.co/join?ref=${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share(
        Platform.OS === 'web' ? { message: shareMessage } : { message: shareMessage, title: 'Join me on WAAW' }
      );
    } catch {
      // user dismissed the share sheet — nothing to do
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>🎁</Text>
        <Text style={styles.title}>Invite & earn</Text>
        <Text style={styles.sub}>
          Share WAAW with friends. When they sign up and make their first commitment, you'll both
          get credit toward platform fees.
        </Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.codeValue}>{referralCode}</Text>
        </View>

        <GoldButton label="Share invite link" onPress={handleShare} style={{ marginBottom: spacing.xl }} />

        <View style={styles.statRow}>
          <StatTile value={String(referralCount)} label="Friends joined" accent />
        </View>

        <Text style={styles.footnote}>
          Referral rewards are credited once your friend completes their first commitment.
          You'll see updates here as friends join.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backbar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontFamily: fonts.serif, fontSize: 20, color: colors.accent },
  backLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.6 },
  content: { padding: spacing.xl, paddingBottom: 60 },
  icon: { fontSize: 36, marginBottom: 14, textAlign: 'center' },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 6, textAlign: 'center' },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 24, lineHeight: 19, fontWeight: '300' as any, textAlign: 'center' },
  codeCard: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  codeLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: 8 },
  codeValue: { fontFamily: fonts.monoBold, fontSize: 20, color: colors.accent, letterSpacing: 2 },
  statRow: { flexDirection: 'row', marginBottom: spacing.lg },
  footnote: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, lineHeight: 16, letterSpacing: 0.3, textAlign: 'center' },
});
