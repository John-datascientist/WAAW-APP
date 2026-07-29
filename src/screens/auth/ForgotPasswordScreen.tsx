import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton, TextField } from '../../components';

interface Props {
  onBack: () => void;
  onSubmit: (email: string) => void;
}

export default function ForgotPasswordScreen({ onBack, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    onSubmit(email.trim());
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrap}>
          <Text style={styles.doneIcon}>✉</Text>
          <Text style={styles.doneTitle}>Check your email</Text>
          <Text style={styles.doneSub}>
            If an account exists for {email || 'that address'}, we've sent a link to reset your password.
          </Text>
          <GoldButton label="Back to sign in" onPress={onBack} style={{ marginTop: 28 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.sub}>Enter the email address on your account and we'll send you a reset link.</Text>

        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />

        <GoldButton label="Send reset link" onPress={handleSubmit} style={{ marginTop: spacing.sm }} />
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
  doneWrap: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  doneIcon: { fontSize: 44, marginBottom: 20 },
  doneTitle: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 14, textAlign: 'center' },
  doneSub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 22, textAlign: 'center', fontWeight: '300' as any },
});
