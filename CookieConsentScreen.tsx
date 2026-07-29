import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';

interface Props {
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
}

export default function CookieConsentScreen({ onAcceptAll, onEssentialOnly, onViewPrivacy, onViewTerms }: Props) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[styles.toggle, value && styles.toggleOn]}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>🍪</Text>
        <Text style={styles.title}>We use cookies</Text>
        <Text style={styles.body}>
          We use essential cookies to keep you logged in and optional analytics cookies to
          improve the platform. We never sell your data.
        </Text>

        <View style={styles.card}>
          <View style={styles.cookieRow}>
            <View style={styles.cookieInfo}>
              <Text style={styles.cookieLabel}>Essential cookies</Text>
              <Text style={styles.cookieSub}>Required for login and security</Text>
            </View>
            <Text style={styles.required}>REQUIRED</Text>
          </View>
          <View style={[styles.cookieRow, { borderBottomWidth: 0 }]}>
            <View style={styles.cookieInfo}>
              <Text style={styles.cookieLabel}>Analytics cookies</Text>
              <Text style={styles.cookieSub}>Help us improve the platform</Text>
            </View>
            <Toggle value={analytics} onToggle={() => setAnalytics(!analytics)} />
          </View>
          <View style={[styles.cookieRow, { borderBottomWidth: 0, marginTop: 8 }]}>
            <View style={styles.cookieInfo}>
              <Text style={styles.cookieLabel}>Marketing cookies</Text>
              <Text style={styles.cookieSub}>Personalised content and offers</Text>
            </View>
            <Toggle value={marketing} onToggle={() => setMarketing(!marketing)} />
          </View>
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={onAcceptAll} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>Accept and continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={onEssentialOnly} activeOpacity={0.85}>
          <Text style={styles.btnOutlineText}>Essential only</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>
          By continuing you agree to our{' '}
          <Text style={styles.link} onPress={onViewPrivacy}>Privacy Policy</Text>
          {' '}and{' '}
          <Text style={styles.link} onPress={onViewTerms}>Terms of Service</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 60 },
  icon: { fontSize: 44, textAlign: 'center' as const, marginBottom: 14 },
  title: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.tx, textAlign: 'center' as const, marginBottom: 8 },
  body: { fontFamily: fonts.sans, fontSize: 13, color: colors.mu, lineHeight: 20, textAlign: 'center' as const, marginBottom: 24, fontWeight: '300' as any },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.ln, padding: spacing.md, marginBottom: 16 },
  cookieRow: { flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1.5, borderBottomColor: colors.ln },
  cookieInfo: { flex: 1 },
  cookieLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.tx },
  cookieSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.mu, marginTop: 2, fontWeight: '300' as any },
  required: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.su, letterSpacing: 0.5 },
  toggle: { width: 40, height: 22, borderRadius: 11, backgroundColor: colors.ln2, position: 'relative' as const },
  toggleOn: { backgroundColor: colors.pu },
  knob: { position: 'absolute' as const, top: 3, left: 3, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' },
  knobOn: { left: 21 },
  btnPrimary: { backgroundColor: colors.pu, borderRadius: 12, padding: 13, alignItems: 'center' as const, marginBottom: 8 },
  btnPrimaryText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: '#fff' },
  btnOutline: { borderWidth: 2, borderColor: colors.pu, borderRadius: 12, padding: 12, alignItems: 'center' as const, marginBottom: 16 },
  btnOutlineText: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.pu },
  footnote: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, textAlign: 'center' as const, lineHeight: 17 },
  link: { color: colors.pu, fontFamily: fonts.sansMedium },
});
