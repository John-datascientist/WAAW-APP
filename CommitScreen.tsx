import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { GoldButton, GhostButton, Divider, Eyebrow } from '../components';
import { Startup, Commitment } from '../data';

interface Props {
  startup: Startup;
  onBack: () => void;
  onCommitSuccess: (commitment: Commitment) => void;
}

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 25000];
const MINIMUM_COMMITMENT = 500;

const fmt = (n: number) => '$' + n.toLocaleString();

export default function CommitScreen({ startup, onBack, onCommitSuccess }: Props) {
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [step, setStep] = useState<'amount' | 'confirm' | 'done'>('amount');
  // Alert.alert is a no-op on react-native-web, so validation feedback has
  // to be an inline message to actually be visible there.
  const [amountError, setAmountError] = useState<string | undefined>(undefined);

  const numAmount = selectedPreset ?? (parseInt(amount.replace(/\D/g, ''), 10) || 0);

  const handlePreset = (n: number) => {
    setSelectedPreset(n);
    setAmount(String(n));
    setAmountError(undefined);
  };

  const handleAmountChange = (val: string) => {
    setSelectedPreset(null);
    setAmount(val.replace(/\D/g, ''));
    setAmountError(undefined);
  };

  const handleContinue = () => {
    if (numAmount < MINIMUM_COMMITMENT) {
      setAmountError(`The minimum commitment is ${fmt(MINIMUM_COMMITMENT)}.`);
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    const ref = 'WW' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const commitment: Commitment = {
      id: ref,
      startupId: startup.id,
      company: startup.name,
      amount: numAmount,
      ref,
      status: 'In escrow',
      date: new Date().toISOString().slice(0, 10),
    };
    onCommitSuccess(commitment);
    setStep('done');
  };

  if (step === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrap}>
          <Text style={styles.doneIcon}>✓</Text>
          <Text style={styles.doneTitle}>Commitment confirmed</Text>
          <Text style={styles.doneSub}>
            {fmt(numAmount)} is now held in escrow for {startup.name}.
            You'll be notified when the startup countersigns.
          </Text>
          <GoldButton label="Back to home" onPress={onBack} style={{ marginTop: 28 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.backBar}>
          <TouchableOpacity onPress={() => setStep('amount')} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Edit amount</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Eyebrow>Review your commitment</Eyebrow>
          <Text style={styles.confirmAmount}>{fmt(numAmount)}</Text>
          <Text style={styles.confirmCompany}>into {startup.name}</Text>

          <Divider style={{ marginVertical: 20 }} />

          <View style={styles.summaryBlock}>
            {[
              { label: 'Company', value: startup.name },
              { label: 'Amount', value: fmt(numAmount) },
              { label: 'Equity', value: startup.equity },
              { label: 'Post-money valuation', value: startup.postMoney },
              { label: 'Escrow status', value: 'In escrow on confirmation' },
            ].map((r) => (
              <View key={r.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{r.label.toUpperCase()}</Text>
                <Text style={styles.summaryValue}>{r.value}</Text>
              </View>
            ))}
          </View>

          <Divider style={{ marginVertical: 20 }} />

          <View style={styles.safetyBox}>
            <Text style={styles.safetyText}>
              YOUR FUNDS MOVE TO A PROTECTED ESCROW ACCOUNT. WAAW NEVER
              TRANSFERS MONEY OUTSIDE THIS FLOW. COMMITMENTS ARE BINDING
              SUBJECT TO THE TERM SHEET YOU WILL RECEIVE BY EMAIL.
            </Text>
          </View>

          <GoldButton label="Confirm and place in escrow" onPress={handleConfirm} style={{ marginTop: 24 }} />
          <GhostButton label="Cancel" onPress={onBack} style={{ marginTop: 10 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>{startup.name}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Eyebrow>Commit to invest</Eyebrow>
        <Text style={styles.pageTitle}>{startup.name}</Text>
        <Text style={styles.pageSub}>Minimum commitment: $500</Text>

        {/* Preset amounts */}
        <Text style={styles.inputLabel}>CHOOSE AN AMOUNT</Text>
        <View style={styles.presetRow}>
          {PRESET_AMOUNTS.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.presetBtn, numAmount === n && styles.presetBtnActive]}
              onPress={() => handlePreset(n)}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetText, numAmount === n && styles.presetTextActive]}>
                {fmt(n)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom amount */}
        <Text style={[styles.inputLabel, { marginTop: 20 }]}>OR ENTER A CUSTOM AMOUNT</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.line}
          />
        </View>
        {amountError && <Text style={styles.amountError}>{amountError}</Text>}

        {numAmount > 0 && (
          <View style={styles.summaryPreview}>
            <Text style={styles.previewLabel}>YOUR COMMITMENT</Text>
            <Text style={styles.previewAmount}>{fmt(numAmount)}</Text>
            <Text style={styles.previewEquity}>
              {startup.equity} equity · {startup.postMoney} post-money
            </Text>
          </View>
        )}

        <GoldButton
          label="Continue to review"
          onPress={handleContinue}
          style={{ marginTop: 28 }}
        />
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
  content: { paddingHorizontal: spacing.xl, paddingTop: 24, paddingBottom: 60 },
  pageTitle: { fontFamily: fonts.serifItalic, fontSize: 28, color: colors.text, lineHeight: 34, marginBottom: 4 },
  pageSub: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, letterSpacing: 0.6, marginBottom: 28 },
  inputLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  presetBtnActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(224,168,61,0.1)',
  },
  presetText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.muted,
  },
  presetTextActive: { color: colors.accent },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
  },
  currencySymbol: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.muted,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.text,
    paddingVertical: 16,
  },
  amountError: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.danger,
    marginTop: 8,
    fontWeight: '300' as any,
  },
  summaryPreview: {
    marginTop: 24,
    padding: 18,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  previewLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  previewAmount: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.accent,
    lineHeight: 40,
  },
  previewEquity: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    marginTop: 6,
    letterSpacing: 0.6,
  },
  summaryBlock: { gap: 14 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    flex: 1,
  },
  summaryValue: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
  },
  safetyBox: {
    borderLeftWidth: 2,
    borderLeftColor: colors.line,
    paddingLeft: 14,
    paddingVertical: 8,
  },
  safetyText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    lineHeight: 15,
  },
  confirmAmount: {
    fontFamily: fonts.serif,
    fontSize: 52,
    color: colors.accent,
    lineHeight: 56,
    marginBottom: 4,
  },
  confirmCompany: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
    color: colors.muted,
  },
  doneWrap: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneIcon: {
    fontFamily: fonts.serif,
    fontSize: 56,
    color: colors.accent,
    marginBottom: 20,
  },
  doneTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    marginBottom: 14,
    textAlign: 'center',
  },
  doneSub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '300' as any,
  },
});
