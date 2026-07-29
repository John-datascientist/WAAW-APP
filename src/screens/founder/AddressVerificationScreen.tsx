import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton, TextField } from '../../components';

interface Props {
  value: string;
  onBack: () => void;
  onSave: (address: string) => void;
}

export default function AddressVerificationScreen({ value, onBack, onSave }: Props) {
  const [address, setAddress] = useState(value);
  const [proofUploaded, setProofUploaded] = useState(false);

  const canSubmit = address.trim().length > 0 && proofUploaded;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify your address</Text>
        <Text style={styles.sub}>Enter your business address and upload a proof of address document.</Text>

        <TextField
          label="Business address"
          value={address}
          onChangeText={setAddress}
          placeholder="12 Adeola Odeku Street, Victoria Island, Lagos"
          autoCapitalize="words"
        />

        <Text style={styles.stepLabel}>PROOF OF ADDRESS</Text>
        <TouchableOpacity
          style={[styles.dropzone, proofUploaded && styles.dropzoneDone]}
          onPress={() => setProofUploaded(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropzoneIcon}>{proofUploaded ? '✓' : '📄'}</Text>
          <Text style={styles.dropzoneLabel}>{proofUploaded ? 'Document added' : 'Upload utility bill or bank statement'}</Text>
          <Text style={styles.dropzoneHint}>Dated within the last 3 months</Text>
        </TouchableOpacity>

        <GoldButton
          label="Save and continue"
          onPress={canSubmit ? () => onSave(address.trim()) : () => {}}
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
