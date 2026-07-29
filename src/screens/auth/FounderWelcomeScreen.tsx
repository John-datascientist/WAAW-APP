import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GoldButton } from '../../components';

interface Props {
  name: string;
  onDone: () => void;
}

export default function FounderWelcomeScreen({ name, onDone }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.icon}>🚀</Text>
        <Text style={styles.title}>Welcome, {name}</Text>
        <Text style={styles.sub}>
          Your founder account is set up. Our team reviews every startup before it goes live on
          WAAW — we'll be in touch by email about next steps for your raise.
        </Text>
        <GoldButton label="Go to profile" onPress={onDone} style={{ marginTop: 28 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 44, marginBottom: 20 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 14, textAlign: 'center' },
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 22, textAlign: 'center', fontWeight: '300' as any },
});
