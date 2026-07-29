import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton, TextField } from '../../components';
import { Cofounder } from '../../data';

interface Props {
  cofounder: Cofounder;
  onBack: () => void;
  onComplete: (socialLink: string) => void;
}

export default function CofounderVerifyScreen({ cofounder, onBack, onComplete }: Props) {
  const [selfieDone, setSelfieDone] = useState(cofounder.selfieDone);
  const [idDone, setIdDone] = useState(cofounder.idDone);
  const [socialLink, setSocialLink] = useState(cofounder.socialLink);

  const canSubmit = selfieDone && idDone && socialLink.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Co-founders</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify {cofounder.name}</Text>
        <Text style={styles.sub}>A selfie, a government ID, and a personal social link are required for every co-founder.</Text>

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

        <Text style={[styles.stepLabel, { marginTop: spacing.lg }]}>3. PERSONAL SOCIAL LINK</Text>
        <TextField
          label="LinkedIn, Twitter/X, or Instagram profile"
          value={socialLink}
          onChangeText={setSocialLink}
          placeholder="https://linkedin.com/in/yourname"
          keyboardType="url"
        />
        <Text style={styles.hint}>Shown publicly on your startup's investor profile.</Text>

        <GoldButton
          label="Submit verification"
          onPress={canSubmit ? () => onComplete(socialLink.trim()) : () => {}}
          style={{ marginTop: spacing.md, opacity: canSubmit ? 1 : 0.4 }}
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
  title: { fontFamily: fonts.serif, fontSize: 24, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20, lineHeight: 19, fontWeight: '300' as any },
  stepLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: spacing.sm },
  hint: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 0.4, marginTop: -spacing.sm, marginBottom: spacing.sm },
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
