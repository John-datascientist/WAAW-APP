import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GoldButton } from '../../components';
import { BUSINESS_STAGES } from '../../data';

interface Props {
  value: string | null;
  onBack: () => void;
  onSave: (stage: string) => void;
}

export default function BusinessStageScreen({ value, onBack, onSave }: Props) {
  const [selected, setSelected] = useState<string | null>(value);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What stage is your business at?</Text>
        <Text style={styles.sub}>This helps investors understand where you are today.</Text>

        {BUSINESS_STAGES.map((stage) => (
          <TouchableOpacity
            key={stage}
            style={[styles.option, selected === stage && styles.optionActive]}
            onPress={() => setSelected(stage)}
            activeOpacity={0.8}
          >
            <Text style={[styles.optionText, selected === stage && styles.optionTextActive]}>{stage}</Text>
            {selected === stage && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}

        <GoldButton
          label="Save and continue"
          onPress={() => selected && onSave(selected)}
          style={{ marginTop: spacing.xl, opacity: selected ? 1 : 0.4 }}
        />
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  optionActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.08)' },
  optionText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  optionTextActive: { color: colors.accent },
  check: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.accent },
});
