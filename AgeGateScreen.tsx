import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts } from '../theme';

interface Props {
  onConfirm: () => void;
}

export default function AgeGateScreen({ onConfirm }: Props) {
  const [under18, setUnder18] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.inner}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>W</Text>
        </View>
        <Text style={styles.wordmark}>WAAW</Text>
        <Text style={styles.tagline}>WE ARE ALL WE'VE GOT</Text>

        <View style={styles.box}>
          <Text style={styles.boxIcon}>🔒</Text>
          <Text style={styles.boxTitle}>Age verification required</Text>
          <Text style={styles.boxBody}>
            WAAW is a financial investment platform. You must be 18 years or older to access
            this service. Investment involves risk and you may lose capital.
          </Text>
        </View>

        <TouchableOpacity style={styles.btnGold} onPress={onConfirm} activeOpacity={0.85}>
          <Text style={styles.btnGoldText}>I confirm I am 18 or older</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGhost} onPress={() => setUnder18(true)} activeOpacity={0.85}>
          <Text style={styles.btnGhostText}>I am under 18</Text>
        </TouchableOpacity>

        {under18 && (
          <Text style={styles.under18}>
            Sorry, WAAW is only available to users aged 18 and over. Financial investment
            services cannot be provided to minors.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.pu },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logo: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoText: { fontFamily: fonts.serifItalic, fontSize: 28, color: '#fff', fontWeight: '600' as any },
  wordmark: { fontFamily: fonts.serifBold, fontSize: 28, color: '#fff', marginBottom: 4 },
  tagline: { fontFamily: fonts.mono, fontSize: 7, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 28 },
  box: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 22, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', width: '100%' },
  boxIcon: { fontSize: 32, textAlign: 'center' as const, marginBottom: 12 },
  boxTitle: { fontFamily: fonts.serifBold, fontSize: 20, color: '#fff', textAlign: 'center' as const, marginBottom: 8 },
  boxBody: { fontFamily: fonts.sans, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20, textAlign: 'center' as const, fontWeight: '300' as any },
  btnGold: { backgroundColor: colors.ch, borderRadius: 12, padding: 14, width: '100%', alignItems: 'center', marginBottom: 10 },
  btnGoldText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.tx },
  btnGhost: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12, width: '100%', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  btnGhostText: { fontFamily: fonts.sansMedium, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  under18: { marginTop: 14, fontFamily: fonts.sans, fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center' as const, lineHeight: 18, fontWeight: '300' as any },
});
