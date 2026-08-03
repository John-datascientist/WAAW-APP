import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { ScreenH1, ScreenSub, Divider } from '../components';

interface Props {
  onBack: () => void;
}

const SECTIONS = [
  {
    title: 'What is WAAW?',
    body: 'WAAW (We Are All We’ve Got) connects Black diaspora investors with verified, early-stage Black-founded startups raising capital. Every deal is reviewed before it appears on the platform.',
  },
  {
    title: 'How investing works',
    body: 'Browse verified startups, review their pitch and terms, and commit an amount from $500 upward. Your commitment moves into a protected escrow account until the startup countersigns.',
  },
  {
    title: 'Escrow protection',
    body: 'WAAW never transfers funds outside the escrow flow. Your money is only released to a founder once the terms are countersigned by both sides.',
  },
  {
    title: 'Who can invest',
    body: 'You must be 18 or older. Before your first commitment, you’ll be asked to confirm you understand the risks — early-stage investing can result in the loss of your capital.',
  },
];

export default function AboutScreen({ onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenH1>How WAAW works</ScreenH1>
        <ScreenSub>For anyone deciding whether to become an investor.</ScreenSub>

        {SECTIONS.map((s, i) => (
          <View key={s.title}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
            {i < SECTIONS.length - 1 && <Divider />}
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
  sectionTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    fontWeight: '300' as any,
  },
});
