import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';

interface Props {
  onBack: () => void;
}

interface Session {
  id: string;
  device: string;
  location: string;
  time: string;
  current: boolean;
}

const INITIAL_SESSIONS: Session[] = [
  { id: '1', device: 'iPhone · Safari', location: 'Lagos, Nigeria', time: 'Today, 9:41 AM', current: true },
  { id: '2', device: 'MacBook Pro · Chrome', location: 'Lagos, Nigeria', time: 'Yesterday, 6:12 PM', current: false },
  { id: '3', device: 'Android · Chrome', location: 'Accra, Ghana', time: '3 days ago', current: false },
];

export default function LoginHistoryScreen({ onBack }: Props) {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  // Alert.alert is a no-op on react-native-web, so this confirmation needs
  // an in-app affordance to actually work on web as well as native.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleTapSignOut = (session: Session) => {
    setConfirmingId(confirmingId === session.id ? null : session.id);
  };

  const handleConfirmSignOut = (session: Session) => {
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    setConfirmingId(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Security</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Login history</Text>
        <Text style={styles.sub}>Devices and sessions signed into your account.</Text>

        {sessions.map((s) => (
          <React.Fragment key={s.id}>
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowDevice}>{s.device}</Text>
                  {s.current && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>THIS DEVICE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.rowMeta}>{s.location} · {s.time}</Text>
              </View>
              {!s.current && (
                <TouchableOpacity onPress={() => handleTapSignOut(s)} activeOpacity={0.7}>
                  <Text style={styles.signOutText}>Sign out</Text>
                </TouchableOpacity>
              )}
            </View>
            {confirmingId === s.id && (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>Sign out {s.device}? This device will be signed out immediately.</Text>
                <View style={styles.confirmRow}>
                  <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setConfirmingId(null)} activeOpacity={0.8}>
                    <Text style={styles.confirmCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmDangerBtn} onPress={() => handleConfirmSignOut(s)} activeOpacity={0.8}>
                    <Text style={styles.confirmDangerText}>Sign out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </React.Fragment>
        ))}
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20, lineHeight: 19, fontWeight: '300' as any },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  rowInfo: { flex: 1 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowDevice: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  currentBadge: { backgroundColor: colors.accent, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6 },
  currentBadgeText: { fontFamily: fonts.monoBold, fontSize: 7, color: colors.bg, letterSpacing: 0.4 },
  rowMeta: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, marginTop: 4, letterSpacing: 0.4 },
  signOutText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.danger },
  confirmBox: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    backgroundColor: '#fef2f2',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  confirmText: { fontFamily: fonts.sans, fontSize: 12, color: colors.text, lineHeight: 18, fontWeight: '300' as any, marginBottom: spacing.sm },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmCancelBtn: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  confirmCancelText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  confirmDangerBtn: { flex: 1, backgroundColor: colors.danger, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  confirmDangerText: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#fff' },
});
