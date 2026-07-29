import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton, GhostButton, TextField, Divider } from '../../components';
import { BoostPlan, BOOST_PLANS } from '../../data';

interface Props {
  activePlan: BoostPlan | null;
  activeUntil: string | null;
  onBack: () => void;
  onPurchase: (plan: BoostPlan) => void;
}

const fmt = (n: number) => '$' + n.toLocaleString();

export default function BoostProfileScreen({ activePlan, activeUntil, onBack, onPurchase }: Props) {
  const [step, setStep] = useState<'plans' | 'checkout' | 'done'>('plans');
  const [selected, setSelected] = useState<BoostPlan | null>(activePlan);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  if (step === 'done' && selected) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrap}>
          <Text style={styles.doneIcon}>✓</Text>
          <Text style={styles.doneTitle}>Profile boosted</Text>
          <Text style={styles.doneSub}>
            Your startup will be featured on the home page for {selected.label.toLowerCase()}.
          </Text>
          <GoldButton label="Back to dashboard" onPress={onBack} style={{ marginTop: 28 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'checkout' && selected) {
    const canPay = cardName.trim().length > 0 && cardNumber.replace(/\D/g, '').length >= 12;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.backbar}>
          <TouchableOpacity onPress={() => setStep('plans')} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Plans</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.sub}>
            {selected.label} boost — {fmt(selected.price)} (${(selected.price / selected.days).toFixed(2)}/day)
          </Text>

          <TextField label="Name on card" value={cardName} onChangeText={setCardName} placeholder="Amara Chukwu" autoCapitalize="words" />
          <TextField label="Card number" value={cardNumber} onChangeText={setCardNumber} placeholder="4242 4242 4242 4242" keyboardType="number-pad" />

          <Divider />
          <Text style={styles.demoNote}>DEMO MODE — no real payment is processed yet (payments provider not connected).</Text>

          <GoldButton
            label={`Pay ${fmt(selected.price)}`}
            onPress={canPay ? () => { onPurchase(selected); setStep('done'); } : () => {}}
            style={{ marginTop: spacing.lg, opacity: canPay ? 1 : 0.4 }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Dashboard</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Boost your profile</Text>
        <Text style={styles.sub}>
          Featured startups appear at the top of the investor home page for the duration of the boost.
        </Text>

        {activePlan && activeUntil && (
          <View style={styles.activeCard}>
            <Text style={styles.activeText}>Currently boosted ({activePlan.label}) until {activeUntil}</Text>
          </View>
        )}

        {BOOST_PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => { setSelected(plan); setStep('checkout'); }}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.planLabel}>{plan.label}</Text>
              <Text style={styles.planSub}>Featured on home page</Text>
              <Text style={styles.planPerDay}>
                ${(plan.price / plan.days).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/day · {plan.days} day{plan.days === 1 ? '' : 's'}
              </Text>
            </View>
            <Text style={styles.planPrice}>{fmt(plan.price)}</Text>
          </TouchableOpacity>
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
  activeCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  activeText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.success },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
  },
  planLabel: { fontFamily: fonts.serifItalic, fontSize: 18, color: colors.text },
  planSub: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, marginTop: 4, letterSpacing: 0.4 },
  planPerDay: { fontFamily: fonts.mono, fontSize: 9, color: colors.accent, marginTop: 4, letterSpacing: 0.4 },
  planPrice: { fontFamily: fonts.serif, fontSize: 22, color: colors.accent },
  demoNote: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, lineHeight: 15, letterSpacing: 0.4 },
  doneWrap: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  doneIcon: { fontFamily: fonts.serif, fontSize: 56, color: colors.accent, marginBottom: 20 },
  doneTitle: { fontFamily: fonts.serif, fontSize: 28, color: colors.text, marginBottom: 14, textAlign: 'center' },
  doneSub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 22, textAlign: 'center', fontWeight: '300' as any },
});
