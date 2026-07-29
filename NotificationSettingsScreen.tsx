import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { NotificationPrefs } from '../data';

interface Props {
  prefs: NotificationPrefs;
  onBack: () => void;
  onChange: (prefs: NotificationPrefs) => void;
}

const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={[styles.toggle, value && styles.toggleOn]}>
    <View style={[styles.knob, value && styles.knobOn]} />
  </TouchableOpacity>
);

const ROWS: { key: keyof NotificationPrefs; label: string; sub: string }[] = [
  { key: 'commitments', label: 'Commitment & escrow updates', sub: 'Status changes on your active commitments' },
  { key: 'deals', label: 'New deals matching your interests', sub: 'When a new verified startup joins your sector filters' },
  { key: 'marketing', label: 'Marketing & product updates', sub: 'News about WAAW features and events' },
];

export default function NotificationSettingsScreen({ prefs, onBack, onChange }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Notifications</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notification settings</Text>
        <Text style={styles.sub}>Choose what you want to hear from WAAW about.</Text>

        {ROWS.map((row) => (
          <View key={row.key} style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowSub}>{row.sub}</Text>
            </View>
            <Toggle
              value={prefs[row.key]}
              onToggle={() => onChange({ ...prefs, [row.key]: !prefs[row.key] })}
            />
          </View>
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 24, lineHeight: 19, fontWeight: '300' as any },
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
  rowInfo: { flex: 1, marginRight: spacing.md },
  rowLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text },
  rowSub: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, marginTop: 3, fontWeight: '300' as any },
  toggle: { width: 40, height: 22, borderRadius: 11, backgroundColor: colors.line, position: 'relative' },
  toggleOn: { backgroundColor: colors.accent },
  knob: { position: 'absolute', top: 3, left: 3, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' },
  knobOn: { left: 21 },
});
