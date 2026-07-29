import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';

interface ChecklistItem {
  id: string;
  label: string;
  sub: string;
  screen: string;
}

interface Props {
  kycDone: boolean;
  riskDone: boolean;
  onNavigate: (screen: string) => void;
}

const CHECKLIST: ChecklistItem[] = [
  { id: 'email', label: 'Verify email address', sub: 'Confirm your email to secure your account', screen: 'EmailVerify' },
  { id: 'kyc', label: 'Complete identity verification', sub: 'Upload government ID and selfie for KYC', screen: 'KYC' },
  { id: 'risk', label: 'Acknowledge investment risks', sub: 'Read and confirm the capital risk warning', screen: 'RiskWarning' },
  { id: 'gdpr', label: 'Review privacy policy', sub: 'Understand how we protect your data', screen: 'Privacy' },
  { id: 'explore', label: 'Explore your first deal', sub: 'Browse verified startups on the platform', screen: 'Startups' },
];

export default function InvestorChecklistScreen({ kycDone, riskDone, onNavigate }: Props) {
  // Email is always satisfied by having an account (verified at sign-up).
  // KYC and risk reflect real app state so progress survives navigating away.
  // The other two are low-stakes nudges tracked only for this screen's session.
  const [localDone, setLocalDone] = useState<Set<string>>(new Set());

  const isDone = (id: string) => {
    if (id === 'email') return true;
    if (id === 'kyc') return kycDone;
    if (id === 'risk') return riskDone;
    return localDone.has(id);
  };

  const done = CHECKLIST.filter((i) => isDone(i.id)).length;
  const pct = Math.round((done / CHECKLIST.length) * 100);

  const handleTap = (item: ChecklistItem) => {
    if (item.id === 'gdpr' || item.id === 'explore') {
      setLocalDone((prev) => new Set(prev).add(item.id));
    }
    onNavigate(item.screen);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Get started</Text>
        <Text style={styles.sub}>Complete these steps to unlock full platform access.</Text>

        {/* Progress bar */}
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${pct}%` as any }]} />
        </View>
        <Text style={styles.progLabel}>{done} of {CHECKLIST.length} steps complete</Text>

        {CHECKLIST.map((item, index) => {
          const done = isDone(item.id);
          const active = !done && CHECKLIST.slice(0, index).every((x) => isDone(x.id));
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, done && styles.itemDone, active && styles.itemActive]}
              onPress={() => handleTap(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.num, done ? styles.numDone : active ? styles.numActive : styles.numTodo]}>
                <Text style={[styles.numText, (done || active) && { color: '#fff' }]}>
                  {done ? '✓' : index + 1}
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemLabel, done && styles.itemLabelDone]}>{item.label}</Text>
                <Text style={styles.itemSub}>{done ? 'Completed ✓' : item.sub}</Text>
              </View>
              {!done && (
                <Text style={[styles.itemArrow, active && { color: colors.pu }]}>
                  {active ? 'Start ›' : '›'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>Why complete all steps?</Text>
          <Text style={styles.whyBody}>
            Completing KYC and risk acknowledgement is required by financial best practice before
            you can commit capital. It also protects you and the platform from fraud.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 56, paddingBottom: 40 },
  h1: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.tx, marginBottom: 4 },
  sub: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, marginBottom: 16, fontWeight: '300' as any, lineHeight: 16 },
  progTrack: { height: 5, backgroundColor: colors.ln, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progFill: { height: 5, backgroundColor: colors.pu, borderRadius: 3 },
  progLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.mu, marginBottom: 18, letterSpacing: 0.5 },
  item: { flexDirection: 'row' as const, alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1.5, borderColor: colors.ln, backgroundColor: colors.card },
  itemDone: { backgroundColor: colors.suLight, borderColor: colors.suBorder },
  itemActive: { borderColor: colors.pu, backgroundColor: colors.puXlight },
  num: { width: 28, height: 28, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0 },
  numDone: { backgroundColor: colors.su },
  numActive: { backgroundColor: colors.pu },
  numTodo: { backgroundColor: colors.ln },
  numText: { fontFamily: fonts.monoBold, fontSize: 11, color: colors.mu },
  itemInfo: { flex: 1 },
  itemLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.tx },
  itemLabelDone: { color: colors.su },
  itemSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.mu, marginTop: 2, fontWeight: '300' as any },
  itemArrow: { fontFamily: fonts.mono, fontSize: 10, color: colors.mu },
  whyCard: { backgroundColor: colors.chLight, borderWidth: 1.5, borderColor: colors.ch2, borderRadius: 14, padding: spacing.md, marginTop: 6 },
  whyTitle: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.warn, textTransform: 'uppercase' as const, letterSpacing: 0.6, marginBottom: 6 },
  whyBody: { fontFamily: fonts.sans, fontSize: 12, color: colors.tx, lineHeight: 18, fontWeight: '300' as any },
});
