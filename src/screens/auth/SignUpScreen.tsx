import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton, TextField } from '../../components';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  country: string;
  role: 'investor' | 'founder';
  referralCode?: string;
}

interface Props {
  role: 'investor' | 'founder';
  onBack: () => void;
  onSignIn: () => void;
  onSubmit: (data: SignUpData) => Promise<string | null>;
}

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Strength = 'weak' | 'fair' | 'good' | 'strong';

const passwordStrength = (pw: string): Strength | null => {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score <= 4) return 'good';
  return 'strong';
};

const STRENGTH_META: Record<Strength, { label: string; color: string; pct: number }> = {
  weak: { label: 'Weak', color: '#dc2626', pct: 25 },
  fair: { label: 'Fair', color: '#d97706', pct: 50 },
  good: { label: 'Good', color: '#65a30d', pct: 75 },
  strong: { label: 'Strong', color: '#16a34a', pct: 100 },
};

export default function SignUpScreen({ role, onBack, onSignIn, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const strength = passwordStrength(password);

  const handleSubmit = async () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter your full name.';
    if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (!country.trim()) next.country = 'Enter your country.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      const err = await onSubmit({
        name: name.trim(),
        email: email.trim(),
        password,
        country: country.trim(),
        role,
        referralCode: referralCode.trim() || undefined,
      });
      setSubmitting(false);
      if (err) setErrors({ email: err });
    }
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
        <Text style={styles.title}>
          Sign up as {role === 'investor' ? 'an investor' : 'a founder'}
        </Text>
        <Text style={styles.sub}>
          {role === 'investor'
            ? 'Create your account to browse deals and commit capital.'
            : 'Create your account to apply for funding on WAAW.'}
        </Text>

        <TextField label="Full name" value={name} onChangeText={setName} placeholder="Ada Lovelace" autoCapitalize="words" error={errors.name} />
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" error={errors.email} />
        <TextField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry error={errors.password} />
        {strength && (
          <View style={styles.strengthWrap}>
            <View style={styles.strengthTrack}>
              <View style={[styles.strengthFill, { width: `${STRENGTH_META[strength].pct}%` as any, backgroundColor: STRENGTH_META[strength].color }]} />
            </View>
            <Text style={[styles.strengthLabel, { color: STRENGTH_META[strength].color }]}>{STRENGTH_META[strength].label}</Text>
          </View>
        )}
        <TextField label="Country" value={country} onChangeText={setCountry} placeholder="Nigeria" autoCapitalize="words" error={errors.country} />
        <TextField
          label="Referral code (optional)"
          value={referralCode}
          onChangeText={(v) => setReferralCode(v.toUpperCase())}
          placeholder="e.g. ADA1234"
          autoCapitalize="characters"
        />

        <GoldButton label={submitting ? 'Creating account…' : 'Create account'} onPress={submitting ? () => {} : handleSubmit} style={{ marginTop: spacing.sm, opacity: submitting ? 0.6 : 1 }} />

        <TouchableOpacity style={styles.signInLink} onPress={onSignIn} activeOpacity={0.7}>
          <Text style={styles.signInText}>Already have an account? <Text style={styles.signInAccent}>Sign in</Text></Text>
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
  strengthWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -12, marginBottom: spacing.lg },
  strengthTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthLabel: { fontFamily: fonts.monoBold, fontSize: 9, letterSpacing: 0.4 },
  signInLink: { alignItems: 'center', marginTop: spacing.lg },
  signInText: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted },
  signInAccent: { color: colors.accent, fontFamily: fonts.sansSemiBold },
});
