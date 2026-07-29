import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';

interface Props {
  twoFactorEnabled: boolean;
  onBack: () => void;
  onChangePassword: () => void;
  onSetup2FA: () => void;
  onLoginHistory: () => void;
  onSignOutAllDevices: () => void;
  onCloseAccount: () => void;
}

const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8}
    style={{ width: 40, height: 22, borderRadius: 11, backgroundColor: value ? colors.pu : colors.ln2, position: 'relative' as const }}>
    <View style={{ position: 'absolute' as const, top: 3, left: value ? 21 : 3, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' }} />
  </TouchableOpacity>
);

export default function SecurityScreen({
  twoFactorEnabled,
  onBack,
  onChangePassword,
  onSetup2FA,
  onLoginHistory,
  onSignOutAllDevices,
  onCloseAccount,
}: Props) {
  const [biometric, setBiometric] = useState(true);
  const [timeout, setTimeout_] = useState(true);
  // Alert.alert is a no-op on react-native-web, so danger-zone confirmations
  // need an in-app affordance to actually work on web as well as native.
  const [confirming, setConfirming] = useState<'signout' | 'close' | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Home</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Security centre</Text>
        <Text style={styles.sub}>Manage how your account is protected.</Text>

        <Text style={styles.seclab}>Account protection</Text>

        {/* Password */}
        <View style={styles.secRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.suLight }]}><Text>🔐</Text></View>
          <View style={styles.secInfo}>
            <Text style={styles.secLabel}>Password</Text>
            <Text style={styles.secSub}>Last changed 14 days ago</Text>
          </View>
          <TouchableOpacity onPress={onChangePassword} style={styles.secBtn} activeOpacity={0.8}>
            <Text style={styles.secBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* 2FA */}
        <View style={styles.secRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.puXlight }]}><Text>📱</Text></View>
          <View style={styles.secInfo}>
            <Text style={styles.secLabel}>Two-factor auth</Text>
            <Text style={styles.secSub}>Authenticator app</Text>
          </View>
          <TouchableOpacity onPress={onSetup2FA} activeOpacity={0.8}>
            <View style={twoFactorEnabled ? styles.pillSu : styles.pillOff}>
              <Text style={twoFactorEnabled ? styles.pillSuText : styles.pillOffText}>
                {twoFactorEnabled ? 'ENABLED' : 'SET UP'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Biometric */}
        <View style={styles.secRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.suLight }]}><Text>👁</Text></View>
          <View style={styles.secInfo}>
            <Text style={styles.secLabel}>Biometric login</Text>
            <Text style={styles.secSub}>Face ID / Touch ID</Text>
          </View>
          <Toggle value={biometric} onToggle={() => setBiometric(!biometric)} />
        </View>

        {/* Session timeout */}
        <View style={styles.secRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.warnLight }]}><Text>⏱</Text></View>
          <View style={styles.secInfo}>
            <Text style={styles.secLabel}>Session timeout</Text>
            <Text style={styles.secSub}>Auto-lock after 10 minutes</Text>
          </View>
          <Toggle value={timeout} onToggle={() => setTimeout_(!timeout)} />
        </View>

        <View style={styles.div} />
        <Text style={styles.seclab}>Login history</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={onLoginHistory} activeOpacity={0.8}>
          <View>
            <Text style={styles.secLabel}>View login history</Text>
            <Text style={styles.secSub}>Last login: Today, 9:41 AM · iPhone</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.div} />
        <Text style={styles.seclab}>Danger zone</Text>

        <TouchableOpacity
          style={styles.dangerBtn}
          onPress={() => setConfirming(confirming === 'signout' ? null : 'signout')}
          activeOpacity={0.8}
        >
          <Text style={styles.dangerLabel}>Sign out all devices</Text>
          <Text style={styles.dangerSub}>Revokes all active sessions immediately</Text>
        </TouchableOpacity>
        {confirming === 'signout' && (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>This will revoke all active sessions, including this one.</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setConfirming(null)} activeOpacity={0.8}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDangerBtn}
                onPress={() => { setConfirming(null); onSignOutAllDevices(); }}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmDangerText}>Sign out all</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.dangerBtn, { marginBottom: 0 }]}
          onPress={() => setConfirming(confirming === 'close' ? null : 'close')}
          activeOpacity={0.8}
        >
          <Text style={styles.dangerLabel}>Close account</Text>
          <Text style={styles.dangerSub}>Permanently delete your WAAW account and data</Text>
        </TouchableOpacity>
        {confirming === 'close' && (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>This will permanently delete your account and all data. This can't be undone.</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setConfirming(null)} activeOpacity={0.8}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDangerBtn}
                onPress={() => { setConfirming(null); onCloseAccount(); }}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmDangerText}>Delete account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backbar: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1.5, borderBottomColor: colors.ln, backgroundColor: colors.card },
  backBtn: { flexDirection: 'row' as const, alignItems: 'center', gap: 8 },
  backArrow: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.pu },
  backLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.mu },
  content: { padding: spacing.xl, paddingBottom: 40 },
  h1: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.tx, marginBottom: 4 },
  sub: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, marginBottom: 18, fontWeight: '300' as any },
  seclab: { fontFamily: fonts.monoBold, fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: 1, color: colors.pu, marginBottom: 10 },
  secRow: { flexDirection: 'row' as const, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: colors.ln, gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0 },
  secInfo: { flex: 1 },
  secLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.tx },
  secSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.mu, marginTop: 2, fontWeight: '300' as any },
  secBtn: { backgroundColor: colors.puXlight, borderWidth: 1.5, borderColor: colors.pu3, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10 },
  secBtnText: { fontFamily: fonts.monoBold, fontSize: 9, color: colors.pu },
  pillSu: { backgroundColor: colors.suLight, borderWidth: 1, borderColor: colors.suBorder, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 },
  pillSuText: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.su },
  pillOff: { backgroundColor: colors.ln, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 },
  pillOffText: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.mu },
  div: { height: 1.5, backgroundColor: colors.ln, marginVertical: 14 },
  historyBtn: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.ln, borderRadius: 12, padding: 14, flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  arrow: { fontFamily: fonts.mono, fontSize: 14, color: colors.mu },
  dangerBtn: { backgroundColor: colors.daLight, borderWidth: 1.5, borderColor: colors.daBorder, borderRadius: 12, padding: 14, marginBottom: 8 },
  dangerLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.da },
  dangerSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.da, marginTop: 2, opacity: 0.7, fontWeight: '300' as any },
  confirmBox: { backgroundColor: colors.daLight, borderWidth: 1.5, borderColor: colors.da, borderRadius: 12, padding: 14, marginBottom: 8 },
  confirmText: { fontFamily: fonts.sans, fontSize: 11, color: colors.tx, lineHeight: 16, fontWeight: '300' as any, marginBottom: 10 },
  confirmRow: { flexDirection: 'row' as const, gap: 10 },
  confirmCancelBtn: { flex: 1, borderWidth: 1.5, borderColor: colors.ln, borderRadius: 9, paddingVertical: 9, alignItems: 'center' as const },
  confirmCancelText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.tx },
  confirmDangerBtn: { flex: 1, backgroundColor: colors.da, borderRadius: 9, paddingVertical: 9, alignItems: 'center' as const },
  confirmDangerText: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#fff' },
});
