import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton, GhostButton, TextField } from '../../components';

interface Props {
  enabled: boolean;
  onBack: () => void;
  onToggle: (enabled: boolean) => void;
}

const DEMO_SECRET = 'JBSW Y3DP EHPK 3PXP';

export default function Setup2FAScreen({ enabled, onBack, onToggle }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  // Alert.alert is a no-op on react-native-web, so this confirmation needs
  // an in-app affordance to actually work on web as well as native.
  const [confirmingDisable, setConfirmingDisable] = useState(false);

  const handleVerify = () => {
    if (code.trim().length !== 6) {
      setError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    onToggle(true);
  };

  if (enabled) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.backbar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Security</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.icon}>✓</Text>
          <Text style={styles.title}>Two-factor authentication is on</Text>
          <Text style={styles.sub}>Your account is protected with an authenticator app.</Text>
          {!confirmingDisable ? (
            <GhostButton
              label="Disable two-factor authentication"
              onPress={() => setConfirmingDisable(true)}
              style={{ marginTop: 28 }}
            />
          ) : (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>Disable two-factor authentication? Your account will be less secure without it.</Text>
              <View style={styles.confirmRow}>
                <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setConfirmingDisable(false)} activeOpacity={0.8}>
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDangerBtn}
                  onPress={() => { setConfirmingDisable(false); onToggle(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmDangerText}>Disable</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
        <Text style={styles.title}>Set up two-factor authentication</Text>
        <Text style={styles.sub}>Scan this key into Google Authenticator, Authy, or a similar app.</Text>

        <View style={styles.secretBox}>
          <Text style={styles.secretLabel}>SETUP KEY</Text>
          <Text style={styles.secretValue}>{DEMO_SECRET}</Text>
        </View>

        <TextField
          label="6-digit code"
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          keyboardType="number-pad"
          error={error}
        />

        <GoldButton label="Verify and enable" onPress={handleVerify} style={{ marginTop: spacing.sm }} />
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
  content: { padding: spacing.xl, paddingBottom: 60, flexGrow: 1 },
  icon: { fontFamily: fonts.serif, fontSize: 44, color: colors.accent, marginBottom: 16, textAlign: 'center' },
  title: { fontFamily: fonts.serif, fontSize: 24, color: colors.text, marginBottom: 6, textAlign: 'center' },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20, lineHeight: 19, fontWeight: '300' as any, textAlign: 'center' },
  secretBox: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  secretLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: 8 },
  secretValue: { fontFamily: fonts.monoBold, fontSize: 16, color: colors.text, letterSpacing: 2 },
  confirmBox: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    backgroundColor: '#fef2f2',
    padding: spacing.md,
    marginTop: 28,
    width: '100%',
  },
  confirmText: { fontFamily: fonts.sans, fontSize: 12, color: colors.text, lineHeight: 18, fontWeight: '300' as any, marginBottom: spacing.sm },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmCancelBtn: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  confirmCancelText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  confirmDangerBtn: { flex: 1, backgroundColor: colors.danger, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  confirmDangerText: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#fff' },
});
