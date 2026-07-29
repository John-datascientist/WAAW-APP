import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { FounderOnboarding, MIN_COFOUNDERS } from '../../data';

interface Props {
  data: FounderOnboarding;
  onBack: () => void;
  onOpenStep: (step: string) => void;
}

export default function FounderOnboardingScreen({ data, onBack, onOpenStep }: Props) {
  const cofounderDone = (c: FounderOnboarding['cofounders'][number]) =>
    c.selfieDone && c.idDone && c.socialLink.trim().length > 0;
  const cofoundersDone = data.cofounders.length >= MIN_COFOUNDERS && data.cofounders.every(cofounderDone);

  const steps = [
    { id: 'stage', label: 'Business stage', sub: data.businessStage ?? 'Not set', done: !!data.businessStage },
    {
      id: 'cofounders',
      label: 'Co-founder verification',
      sub: `${data.cofounders.filter(cofounderDone).length} of ${data.cofounders.length} verified (min. ${MIN_COFOUNDERS})`,
      done: cofoundersDone,
    },
    {
      id: 'social-links',
      label: 'Business social links',
      sub: data.businessSocialLinks.length > 0 ? `${data.businessSocialLinks.length} platform(s) added` : 'Not added',
      done: data.businessSocialLinks.length > 0,
    },
    { id: 'address', label: 'Address verification', sub: data.addressVerified ? data.addressLine : 'Not verified', done: data.addressVerified },
    { id: 'company', label: 'Company verification', sub: data.companyVerified ? data.companyName : 'Not verified', done: data.companyVerified },
    { id: 'pitch-deck', label: 'Pitch deck', sub: data.pitchDeckUploaded ? 'Uploaded' : 'Not uploaded', done: data.pitchDeckUploaded },
    { id: 'business-plan', label: 'Business plan', sub: data.businessPlanUploaded ? 'Uploaded' : 'Not uploaded', done: data.businessPlanUploaded },
    { id: 'pitch-video', label: '2-minute pitch video', sub: data.pitchVideoUploaded ? 'Uploaded' : 'Not uploaded', done: data.pitchVideoUploaded },
  ];

  const allDone = steps.every((s) => s.done);
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Dashboard</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Founder onboarding</Text>
        <Text style={styles.sub}>Complete every step to unlock your founder interview.</Text>

        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${pct}%` as any }]} />
        </View>
        <Text style={styles.progLabel}>{doneCount} of {steps.length} steps complete</Text>

        {steps.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.row, s.done && styles.rowDone]}
            onPress={() => onOpenStep(s.id)}
            activeOpacity={0.8}
          >
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>{s.label}</Text>
              <Text style={styles.rowSub}>{s.sub}</Text>
            </View>
            <Text style={styles.rowArrow}>{s.done ? '✓' : '›'}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.row, styles.interviewRow, data.interviewRequested && styles.rowDone]}
          onPress={() => onOpenStep('interview')}
          activeOpacity={0.8}
        >
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>Founder interview</Text>
            <Text style={styles.rowSub}>
              {data.interviewRequested
                ? data.interviewScheduledFor
                  ? `Scheduled for ${data.interviewScheduledFor}`
                  : 'Requested'
                : allDone
                  ? 'Ready to request'
                  : 'Unlocks after all steps above'}
            </Text>
          </View>
          <Text style={styles.rowArrow}>{data.interviewRequested ? '✓' : '›'}</Text>
        </TouchableOpacity>
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
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 16, lineHeight: 19, fontWeight: '300' as any },
  progTrack: { height: 5, backgroundColor: colors.deeper, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progFill: { height: 5, backgroundColor: colors.accent, borderRadius: 3 },
  progLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, marginBottom: 20, letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  rowDone: { borderColor: colors.success, backgroundColor: '#f0fdf4' },
  interviewRow: { marginTop: spacing.md, borderStyle: 'dashed' },
  rowInfo: { flex: 1 },
  rowLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  rowSub: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, marginTop: 3 },
  rowArrow: { fontFamily: fonts.mono, fontSize: 13, color: colors.accent },
});
