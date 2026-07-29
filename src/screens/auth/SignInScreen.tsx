import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton, TextField } from '../../components';

interface Props {
  onBack: () => void;
  onSubmit: (email: string, password: string) => Promise<string | null>;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export default function SignInScreen({ onBack, onSubmit, onForgotPassword, onSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await onSubmit(email.trim(), password);
    setSubmitting(false);
    setError(result);
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
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.sub}>Welcome back to WAAW.</Text>

        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry error={error ?? undefined} />

        <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.7}>
          <Text style={styles.forgotLink}>Forgot password?</Text>
        </TouchableOpacity>

        <GoldButton label={submitting ? 'Signing in…' : 'Sign in'} onPress={submitting ? () => {} : handleSubmit} style={{ marginTop: spacing.lg, opacity: submitting ? 0.6 : 1 }} />

        <TouchableOpacity style={styles.signUpLink} onPress={onSignUp} activeOpacity={0.7}>
          <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpAccent}>Sign up</Text></Text>
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 24, lineHeight: 19, fontWeight: '300' as any },
  forgotLink: { fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: 0.4, marginBottom: 4 },
  signUpLink: { alignItems: 'center', marginTop: spacing.lg },
  signUpText: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted },
  signUpAccent: { color: colors.accent, fontFamily: fonts.sansSemiBold },
});
