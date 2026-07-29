import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton } from '../../components';

interface Props {
  onBack: () => void;
  onComplete: (country: string) => void;
}

const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom', 'United States', 'Canada', 'Other'];

export default function InvestorKYCScreen({ onBack, onComplete }: Props) {
  const [selfieDone, setSelfieDone] = useState(false);
  const [idDone, setIdDone] = useState(false);
  const [country, setCountry] = useState<string | null>(null);

  const canSubmit = selfieDone && idDone && !!country;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.sub}>
          Required by financial regulation before you can commit capital. Takes about two minutes.
        </Text>

        <Text style={styles.stepLabel}>1. SELFIE CHECK</Text>
        <TouchableOpacity
          style={[styles.dropzone, selfieDone && styles.dropzoneDone]}
          onPress={() => setSelfieDone(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropzoneIcon}>{selfieDone ? '✓' : '📷'}</Text>
          <Text style={styles.dropzoneLabel}>{selfieDone ? 'Selfie captured' : 'Take a selfie'}</Text>
          <Text style={styles.dropzoneHint}>Used to match against the ID document below</Text>
        </TouchableOpacity>

        <Text style={[styles.stepLabel, { marginTop: spacing.lg }]}>2. GOVERNMENT ID</Text>
        <TouchableOpacity
          style={[styles.dropzone, idDone && styles.dropzoneDone]}
          onPress={() => setIdDone(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropzoneIcon}>{idDone ? '✓' : '🪪'}</Text>
          <Text style={styles.dropzoneLabel}>{idDone ? 'ID uploaded' : 'Upload passport or national ID'}</Text>
          <Text style={styles.dropzoneHint}>PDF, JPG or PNG</Text>
        </TouchableOpacity>

        <Text style={[styles.stepLabel, { marginTop: spacing.lg }]}>3. COUNTRY OF RESIDENCE</Text>
        <View style={styles.countryRow}>
          {COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, country === c && styles.chipActive]}
              onPress={() => setCountry(c)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, country === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GoldButton
          label="Submit for verification"
          onPress={canSubmit ? () => onComplete(country!) : () => {}}
          style={{ marginTop: spacing.xl, opacity: canSubmit ? 1 : 0.4 }}
        />
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20, lineHeight: 19, fontWeight: '300' as any },
  stepLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: spacing.sm },
  dropzone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  dropzoneDone: { borderColor: colors.success, borderStyle: 'solid', backgroundColor: '#f0fdf4' },
  dropzoneIcon: { fontSize: 26, marginBottom: 8 },
  dropzoneLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text, marginBottom: 4 },
  dropzoneHint: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 0.4 },
  countryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.1)' },
  chipText: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted },
  chipTextActive: { color: colors.accent },
});
