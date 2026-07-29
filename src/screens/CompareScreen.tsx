import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { VerifiedBadge } from '../components';
import { Startup } from '../data';

interface Props {
  a: Startup;
  b: Startup;
  onBack: () => void;
  onSelectStartup: (startup: Startup) => void;
  onRemoveSide: (startupId: string) => void;
}

const fmt = (n: number) =>
  n >= 1000000
    ? '$' + (n / 1000000).toFixed(1) + 'M'
    : '$' + (n / 1000).toFixed(0) + 'K';

const ROWS: { label: string; get: (s: Startup) => string }[] = [
  { label: 'Sector', get: (s) => s.sector },
  { label: 'Stage', get: (s) => s.stage },
  { label: 'Location', get: (s) => [s.city, s.country].filter(Boolean).join(', ') || '—' },
  { label: 'Raising', get: (s) => fmt(s.raisingAmount) },
  { label: 'Raised so far', get: (s) => fmt(s.raisedAmount) },
  { label: '% funded', get: (s) => (s.raisingAmount > 0 ? `${Math.round((s.raisedAmount / s.raisingAmount) * 100)}%` : '—') },
  { label: 'Equity offered', get: (s) => s.equity },
  { label: 'Post-money', get: (s) => s.postMoney },
];

export default function CompareScreen({ a, b, onBack, onSelectStartup, onRemoveSide }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Startups</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Compare deals</Text>

        <View style={styles.headerRow}>
          {[a, b].map((s) => (
            <View key={s.id} style={styles.headerCell}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onRemoveSide(s.id)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onSelectStartup(s)} activeOpacity={0.8}>
                <VerifiedBadge verified={s.verified} />
                <Text style={styles.headerName} numberOfLines={2}>{s.name}</Text>
                <Text style={styles.headerLink}>View deal ›</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.swapHint}>Tap ✕ to swap out a side and pick another deal to compare.</Text>

        {ROWS.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label.toUpperCase()}</Text>
            <View style={styles.rowValues}>
              <Text style={styles.rowValue}>{row.get(a)}</Text>
              <Text style={styles.rowValue}>{row.get(b)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontFamily: fonts.serif, fontSize: 20, color: colors.accent },
  backLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.6 },
  content: { paddingHorizontal: spacing.xl, paddingTop: 20, paddingBottom: 60 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 20 },
  headerRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  headerCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.md,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  removeBtnText: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },
  headerName: { fontFamily: fonts.serifItalic, fontSize: 16, color: colors.text, marginTop: 8, marginBottom: 6, lineHeight: 20 },
  headerLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent },
  swapHint: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.4,
    marginBottom: 20,
    marginTop: -10,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 12,
  },
  rowLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 0.8, marginBottom: 8 },
  rowValues: { flexDirection: 'row', gap: 10 },
  rowValue: { flex: 1, fontFamily: fonts.serifItalic, fontSize: 15, color: colors.text },
});
