import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';

interface Props {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

const DOCS = [
  { label: 'Terms of service', sub: 'Last updated 1 July 2025', screen: 'Terms' },
  { label: 'Privacy policy', sub: 'UK GDPR and Nigeria NDPA 2023 compliant', screen: 'Privacy' },
  { label: 'Risk warning', sub: 'Capital at risk disclosure', screen: 'RiskWarning' },
  { label: 'Cookie policy', sub: 'How we use cookies', screen: 'CookiePolicy' },
  { label: 'NDPC compliance', sub: 'Nigeria Data Protection Commission', screen: 'Ndpc' },
  { label: 'Escrow terms', sub: 'How your funds are protected', screen: 'EscrowTerms' },
  { label: 'Commission disclosure', sub: 'WAAW 5% platform fee', screen: 'CommissionTerms' },
];

export default function LegalHubScreen({ onBack, onNavigate }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Home</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Legal centre</Text>
        <Text style={styles.sub}>All legal documents, policies, and compliance information.</Text>

        {DOCS.map((d) => (
          <TouchableOpacity key={d.screen} style={styles.row} onPress={() => onNavigate(d.screen)} activeOpacity={0.7}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>{d.label}</Text>
              <Text style={styles.rowSub}>{d.sub}</Text>
            </View>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.div} />
        <Text style={styles.seclab}>Compliance registrations</Text>

        <View style={styles.cardSu}>
          <Text style={styles.tick}>✅ ICO registration — UK</Text>
          <Text style={styles.cardBody}>
            Workerholics Solutions Limited is registered with the UK Information Commissioner's
            Office under UK GDPR.
          </Text>
        </View>
        <View style={styles.cardSu}>
          <Text style={styles.tick}>✅ NDPC registration — Nigeria</Text>
          <Text style={styles.cardBody}>
            WAAW complies with the Nigeria Data Protection Act 2023 and is registered with the
            Nigeria Data Protection Commission.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backbar: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderBottomWidth: 1.5, borderBottomColor: colors.ln, backgroundColor: colors.card },
  backBtn: { flexDirection: 'row' as const, alignItems: 'center', gap: 8 },
  backArrow: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.pu },
  backLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.mu },
  content: { padding: spacing.xl, paddingBottom: 40 },
  h1: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.tx, marginBottom: 4 },
  sub: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, marginBottom: 20, fontWeight: '300' as any, lineHeight: 16 },
  row: { flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: colors.ln },
  rowInfo: { flex: 1 },
  rowLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.tx },
  rowSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.mu, marginTop: 2, fontWeight: '300' as any },
  rowArrow: { fontFamily: fonts.mono, fontSize: 14, color: colors.mu },
  div: { height: 1.5, backgroundColor: colors.ln, marginVertical: 14 },
  seclab: { fontFamily: fonts.monoBold, fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: 1, color: colors.pu, marginBottom: 10 },
  cardSu: { backgroundColor: colors.suLight, borderWidth: 1.5, borderColor: colors.suBorder, borderRadius: radius.lg, padding: spacing.md, marginBottom: 10 },
  tick: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.su, marginBottom: 5 },
  cardBody: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, fontWeight: '300' as any, lineHeight: 16 },
});
