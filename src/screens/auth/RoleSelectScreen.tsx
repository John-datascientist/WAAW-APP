import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';

interface Props {
  onBack: () => void;
  onSelectInvestor: () => void;
  onSelectFounder: () => void;
  onSignIn: () => void;
  intro?: string;
}

export default function RoleSelectScreen({ onBack, onSelectInvestor, onSelectFounder, onSignIn, intro }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.wordmark}>WAAW</Text>
        <Text style={styles.title}>Join WAAW</Text>
        <Text style={styles.sub}>
          {intro ?? 'Tell us which side of the table you sit on.'}
        </Text>

        <TouchableOpacity style={styles.card} onPress={onSelectInvestor} activeOpacity={0.85}>
          <Text style={styles.cardIcon}>💰</Text>
          <Text style={styles.cardTitle}>Sign up as an investor</Text>
          <Text style={styles.cardBody}>Browse verified African startups and commit capital via protected escrow.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={onSelectFounder} activeOpacity={0.85}>
          <Text style={styles.cardIcon}>🚀</Text>
          <Text style={styles.cardTitle}>Sign up as a founder</Text>
          <Text style={styles.cardBody}>Apply to raise capital from diaspora investors for your startup.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInLink} onPress={onSignIn} activeOpacity={0.7}>
          <Text style={styles.signInText}>Already have an account? <Text style={styles.signInAccent}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
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
  content: { flex: 1, padding: spacing.xl, paddingTop: 32 },
  wordmark: {
    fontFamily: fonts.serifBoldItalic,
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
  },
  title: { fontFamily: fonts.serif, fontSize: 30, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 28, lineHeight: 19, fontWeight: '300' as any },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
  },
  cardIcon: { fontSize: 28, marginBottom: spacing.sm },
  cardTitle: { fontFamily: fonts.serifItalic, fontSize: 18, color: colors.text, marginBottom: 6 },
  cardBody: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, lineHeight: 18, fontWeight: '300' as any },
  signInLink: { alignItems: 'center', marginTop: spacing.lg },
  signInText: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted },
  signInAccent: { color: colors.accent, fontFamily: fonts.sansSemiBold },
});
