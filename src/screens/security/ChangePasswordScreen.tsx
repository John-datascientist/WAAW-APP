import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton, TextField } from '../../components';

interface Props {
  onBack: () => void;
}

export default function ChangePasswordScreen({ onBack }: Props) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!current) return setError('Enter your current password.');
    if (next.length < 8) return setError('New password must be at least 8 characters.');
    if (next !== confirm) return setError('New password and confirmation do not match.');
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrap}>
          <Text style={styles.doneIcon}>✓</Text>
          <Text style={styles.doneTitle}>Password updated</Text>
          <Text style={styles.doneSub}>Use your new password next time you sign in.</Text>
          <GoldButton label="Back to security" onPress={onBack} style={{ marginTop: 28 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Security</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Change password</Text>
        <Text style={styles.sub}>Choose a strong password you don't use anywhere else.</Text>

        <TextField label="Current password" value={current} onChangeText={setCurrent} secureTextEntry />
        <TextField label="New password" value={next} onChangeText={setNext} secureTextEntry placeholder="At least 8 characters" />
        <TextField label="Confirm new password" value={confirm} onChangeText={setConfirm} secureTextEntry error={error ?? undefined} />

        <GoldButton label="Update password" onPress={handleSubmit} style={{ marginTop: spacing.sm }} />
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
  doneIcon: { fontFamily: fonts.serif, fontSize: 56, color: colors.accent, marginBottom: 20 },
  doneTitle: { fontFamily: fonts.serif, fontSize: 28, color: colors.text, marginBottom: 14, textAlign: 'center' },
  doneSub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 22, textAlign: 'center', fontWeight: '300' as any },
});
