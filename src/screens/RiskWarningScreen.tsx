import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';

interface Props {
  onAccept: () => void;
}

const RISKS = [
  { icon: '💸', title: 'Capital at risk.', body: 'The value of your investment can go down as well as up. You may lose some or all of the money you invest.' },
  { icon: '🔒', title: 'Investments are illiquid.', body: 'You may not be able to sell your investment or get your money back quickly. These are long-term commitments.' },
  { icon: '📉', title: 'Early-stage risk.', body: 'Investing in early-stage startups is high risk. Most startups fail. Only invest what you can afford to lose.' },
  { icon: '🌍', title: 'Cross-border risk.', body: 'Investments in Black-founded startups operating in Africa carry additional regulatory, currency, and political risks. Returns may be affected by exchange rate movements.' },
];

export default function RiskWarningScreen({ onAccept }: Props) {
  const [consented, setConsented] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Important risk warning</Text>
        <Text style={styles.sub}>Please read before investing</Text>

        <View style={styles.warnCard}>
          {RISKS.map((r, i) => (
            <View key={i} style={[styles.riskRow, i === RISKS.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.riskIcon}>{r.icon}</Text>
              <Text style={styles.riskText}>
                <Text style={styles.riskBold}>{r.title} </Text>
                {r.body}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setConsented(!consented)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, consented && styles.checkboxOn]}>
            {consented && <Text style={styles.tick}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            I have read and understood these risk warnings. I confirm I am investing with money I can afford to lose.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, !consented && styles.btnDisabled]}
          onPress={consented ? onAccept : undefined}
          activeOpacity={consented ? 0.85 : 1}
        >
          <Text style={styles.btnText}>I understand — continue</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          This warning is required by financial regulatory best practice. WAAW is not FCA-regulated.
          Seek independent financial advice if unsure.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 56 },
  icon: { fontSize: 36, textAlign: 'center' as const, marginBottom: 10 },
  title: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.tx, textAlign: 'center' as const, marginBottom: 4 },
  sub: { fontFamily: fonts.sans, fontSize: 12, color: colors.mu, textAlign: 'center' as const, marginBottom: 20, fontWeight: '300' as any },
  warnCard: { backgroundColor: colors.warnLight, borderWidth: 1.5, borderColor: colors.warnBorder, borderRadius: radius.lg, padding: spacing.md, marginBottom: 18 },
  riskRow: { flexDirection: 'row' as const, gap: 12, paddingVertical: 10, borderBottomWidth: 1.5, borderBottomColor: colors.warnBorder, alignItems: 'flex-start' },
  riskIcon: { fontSize: 16, flexShrink: 0, marginTop: 2 },
  riskText: { fontFamily: fonts.sans, fontSize: 12, color: colors.warn, lineHeight: 18, flex: 1, fontWeight: '400' as any },
  riskBold: { fontFamily: fonts.sansSemiBold, color: colors.warn },
  consentRow: { flexDirection: 'row' as const, gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.ln2, backgroundColor: colors.card, alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0, marginTop: 1 },
  checkboxOn: { backgroundColor: colors.pu, borderColor: colors.pu },
  tick: { color: '#fff', fontSize: 12, fontWeight: '700' as any },
  consentText: { fontFamily: fonts.sans, fontSize: 12, color: colors.tx, lineHeight: 18, flex: 1, fontWeight: '300' as any },
  btn: { backgroundColor: colors.pu, borderRadius: 12, padding: 13, alignItems: 'center' as const, marginBottom: 12 },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: '#fff' },
  footnote: { fontFamily: fonts.sans, fontSize: 10, color: colors.mu, textAlign: 'center' as const, lineHeight: 16, fontWeight: '300' as any },
});
