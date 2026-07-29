import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton } from '../../components';

interface Props {
  ready: boolean;
  requested: boolean;
  scheduledFor: string | null;
  onBack: () => void;
  onRequest: () => void;
}

export default function InterviewScreen({ ready, requested, scheduledFor, onBack, onRequest }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.icon}>{requested ? '✓' : '🗓️'}</Text>
        <Text style={styles.title}>
          {requested ? 'Interview requested' : 'Founder interview'}
        </Text>
        <Text style={styles.sub}>
          {requested
            ? 'A member of the WAAW team will meet with you to review your application.'
            : ready
              ? 'You\'ve completed every verification step. The final step is a short interview with a member of the WAAW team before your startup goes live.'
              : 'Complete every step above — co-founder verification, address, company, pitch deck, business plan, and pitch video — to unlock your founder interview.'}
        </Text>

        {requested && scheduledFor && (
          <View style={styles.slotCard}>
            <Text style={styles.slotLabel}>SCHEDULED FOR</Text>
            <Text style={styles.slotValue}>{scheduledFor}</Text>
          </View>
        )}

        {!requested && (
          <GoldButton
            label="Request interview"
            onPress={ready ? onRequest : () => {}}
            style={{ marginTop: 28, opacity: ready ? 1 : 0.4 }}
          />
        )}
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
  content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 44, marginBottom: 20 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 14, textAlign: 'center' },
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 22, textAlign: 'center', fontWeight: '300' as any },
  slotCard: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  slotLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: 6 },
  slotValue: { fontFamily: fonts.serifItalic, fontSize: 18, color: colors.accent },
});
