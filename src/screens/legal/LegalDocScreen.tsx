import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { LegalDoc } from '../../data';

interface Props {
  doc: LegalDoc;
  backLabel?: string;
  onBack: () => void;
}

export default function LegalDocScreen({ doc, backLabel = 'Legal centre', onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>{backLabel}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.updated}>Last updated {doc.updated}</Text>

        {doc.sections.map((s) => (
          <View key={s.heading} style={styles.section}>
            <Text style={styles.heading}>{s.heading}</Text>
            <Text style={styles.body}>{s.body}</Text>
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
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.text, marginBottom: 4 },
  updated: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, letterSpacing: 0.4, marginBottom: 24 },
  section: { marginBottom: 20 },
  heading: { fontFamily: fonts.serifItalic, fontSize: 16, color: colors.text, marginBottom: 6 },
  body: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, lineHeight: 20, fontWeight: '300' as any },
});
