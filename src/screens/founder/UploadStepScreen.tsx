import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton } from '../../components';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  fileLabel: string;
  fileHint: string;
  ctaLabel: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function UploadStepScreen({
  icon,
  title,
  subtitle,
  fileLabel,
  fileHint,
  ctaLabel,
  onBack,
  onComplete,
}: Props) {
  const [uploaded, setUploaded] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>

        <TouchableOpacity
          style={[styles.dropzone, uploaded && styles.dropzoneDone]}
          onPress={() => setUploaded(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropzoneIcon}>{uploaded ? '✓' : '↑'}</Text>
          <Text style={styles.dropzoneLabel}>{uploaded ? `${fileLabel} added` : fileLabel}</Text>
          <Text style={styles.dropzoneHint}>{fileHint}</Text>
        </TouchableOpacity>

        <GoldButton
          label={ctaLabel}
          onPress={uploaded ? onComplete : () => {}}
          style={[{ marginTop: spacing.xl }, !uploaded && styles.btnDisabled] as any}
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
  icon: { fontSize: 36, marginBottom: 14 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 24, lineHeight: 19, fontWeight: '300' as any },
  dropzone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  dropzoneDone: { borderColor: colors.success, borderStyle: 'solid', backgroundColor: '#f0fdf4' },
  dropzoneIcon: { fontSize: 28, color: colors.accent, marginBottom: 10 },
  dropzoneLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text, marginBottom: 4 },
  dropzoneHint: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, letterSpacing: 0.4 },
  btnDisabled: { opacity: 0.4 },
});
