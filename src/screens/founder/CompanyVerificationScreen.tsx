import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton, TextField } from '../../components';
import { STARTUP_SECTORS } from '../../data';

export interface CompanyDetails {
  companyName: string;
  registrationNumber: string;
  sector: string;
  pitch: string;
  raisingAmount: number;
}

interface Props {
  value: CompanyDetails;
  onBack: () => void;
  onSave: (details: CompanyDetails) => void;
}

export default function CompanyVerificationScreen({ value, onBack, onSave }: Props) {
  const [name, setName] = useState(value.companyName);
  const [regNumber, setRegNumber] = useState(value.registrationNumber);
  const [sector, setSector] = useState(value.sector);
  const [pitch, setPitch] = useState(value.pitch);
  const [raisingAmount, setRaisingAmount] = useState(value.raisingAmount ? String(value.raisingAmount) : '');
  const [certUploaded, setCertUploaded] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    regNumber.trim().length > 0 &&
    !!sector &&
    pitch.trim().length > 0 &&
    Number(raisingAmount) > 0 &&
    certUploaded;

  const handleSave = () => {
    onSave({
      companyName: name.trim(),
      registrationNumber: regNumber.trim(),
      sector,
      pitch: pitch.trim(),
      raisingAmount: Number(raisingAmount),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify your company</Text>
        <Text style={styles.sub}>Confirm your registered business details and how investors will see you.</Text>

        <TextField label="Registered company name" value={name} onChangeText={setName} placeholder="FarmLink Africa Ltd" autoCapitalize="words" />
        <TextField label="Registration number" value={regNumber} onChangeText={setRegNumber} placeholder="RC1234567" autoCapitalize="characters" />

        <Text style={styles.stepLabel}>SECTOR</Text>
        <View style={styles.sectorRow}>
          {STARTUP_SECTORS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.sectorChip, sector === s && styles.sectorChipActive]}
              onPress={() => setSector(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.sectorChipText, sector === s && styles.sectorChipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextField label="One-line pitch" value={pitch} onChangeText={setPitch} placeholder="Cold-chain logistics for smallholder farmers" autoCapitalize="sentences" />
        <TextField label="Amount raising (USD)" value={raisingAmount} onChangeText={setRaisingAmount} placeholder="350000" keyboardType="number-pad" />

        <Text style={styles.stepLabel}>CERTIFICATE OF INCORPORATION</Text>
        <TouchableOpacity
          style={[styles.dropzone, certUploaded && styles.dropzoneDone]}
          onPress={() => setCertUploaded(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropzoneIcon}>{certUploaded ? '✓' : '🏢'}</Text>
          <Text style={styles.dropzoneLabel}>{certUploaded ? 'Certificate added' : 'Upload certificate of incorporation'}</Text>
          <Text style={styles.dropzoneHint}>PDF, JPG or PNG</Text>
        </TouchableOpacity>

        <GoldButton
          label="Save and continue"
          onPress={canSubmit ? handleSave : () => {}}
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 24, lineHeight: 19, fontWeight: '300' as any },
  stepLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: spacing.sm, marginTop: spacing.sm },
  sectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  sectorChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sectorChipActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.1)' },
  sectorChipText: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted },
  sectorChipTextActive: { color: colors.accent },
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
});
