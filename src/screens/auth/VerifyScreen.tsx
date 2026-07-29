import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton, GhostButton, TextField } from '../../components';

interface Props {
  email: string;
  onVerify: (code: string) => Promise<string | null>;
  onResend: () => void;
  onBack: () => void;
}

export default function VerifyScreen({ email, onVerify, onResend, onBack }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const err = await onVerify(code.trim());
    setSubmitting(false);
    setError(err ?? undefined);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>✉</Text>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.sub}>Enter the 6-digit code we sent to {email}.</Text>

        <TextField
          label="Verification code"
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          keyboardType="number-pad"
          error={error}
        />

        <GoldButton label={submitting ? 'Verifying…' : 'Verify'} onPress={submitting ? () => {} : handleSubmit} style={{ marginTop: spacing.sm, opacity: submitting ? 0.6 : 1 }} />
        <GhostButton label="Resend code" onPress={onResend} style={{ marginTop: spacing.sm }} />
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20, lineHeight: 19, fontWeight: '300' as any },
});
