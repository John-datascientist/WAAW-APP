import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Linking,
  Share,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import {
  Eyebrow,
  VerifiedBadge,
  ProgressBar,
  GoldButton,
  Divider,
} from '../components';
import { Startup, parseMoneyValue, CURRENCY_RATES } from '../data';
import { copyToClipboard, founderProfileUrl } from '../lib/clipboard';

interface Props {
  startup: Startup;
  onBack: () => void;
  onCommit: (startup: Startup) => void;
  backLabel?: string;
  previewMode?: boolean;
}

const fmt = (n: number) =>
  n >= 1000000
    ? '$' + (n / 1000000).toFixed(1) + 'M'
    : '$' + (n / 1000).toFixed(0) + 'K';

export default function StartupDetailScreen({ startup, onBack, onCommit, backLabel = 'Startups', previewMode = false }: Props) {
  const pct = startup.raisingAmount > 0 ? Math.round((startup.raisedAmount / startup.raisingAmount) * 100) : 0;
  const team = startup.team ?? [];
  const socialLinks = startup.socialLinks ?? [];
  const [shareCopied, setShareCopied] = useState(false);
  const [calcAmount, setCalcAmount] = useState('');
  const [currency, setCurrency] = useState<string | null>(null);
  const selectedRate = CURRENCY_RATES.find((c) => c.code === currency);
  const postMoneyValue = parseMoneyValue(startup.postMoney);
  const calcNum = parseInt(calcAmount.replace(/\D/g, ''), 10) || 0;
  const estStake = postMoneyValue && calcNum > 0 ? (calcNum / postMoneyValue) * 100 : null;

  const dealUrl = founderProfileUrl(startup.id);
  const shareMessage = `${startup.name} is raising ${fmt(startup.raisingAmount)} on WAAW. Check out the deal: ${dealUrl}`;

  const handleShare = async () => {
    try {
      await Share.share({ message: shareMessage, url: dealUrl });
    } catch {
      // no native share sheet available (e.g. most desktop browsers) — copy instead
      const ok = await copyToClipboard(shareMessage);
      if (ok) {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back bar */}
      <View style={styles.backBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>{backLabel}</Text>
        </TouchableOpacity>
        {previewMode && (
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>PREVIEW</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <VerifiedBadge verified={startup.verified} />
          <Text style={styles.sectorLabel}>
            {startup.sector.toUpperCase()} · {startup.stage.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.companyName}>{startup.name}</Text>
        <Text style={styles.locationLine}>
          {[startup.city, startup.country].filter(Boolean).join(', ')}
        </Text>

        {/* Pitch */}
        <Text style={styles.pitch}>{startup.pitch}</Text>

        <Divider style={{ marginVertical: 20 }} />

        {/* Stat grid */}
        <View style={styles.statGrid}>
          {[
            { label: 'Equity', value: startup.equity },
            { label: 'Post-money', value: startup.postMoney },
            { label: 'Stage', value: startup.stage },
            { label: 'Sector', value: startup.sector },
          ].map((item) => (
            <View key={item.label} style={styles.statCell}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <Divider style={{ marginVertical: 20 }} />

        {/* Raise progress */}
        <Eyebrow>Raise progress</Eyebrow>
        <View style={styles.raiseRow}>
          <Text style={styles.raisedAmt}>{fmt(startup.raisedAmount)}</Text>
          <Text style={styles.raiseTarget}>of {fmt(startup.raisingAmount)}</Text>
        </View>
        <ProgressBar pct={pct} />
        <Text style={styles.pctLabel}>{pct}% of target raised</Text>

        <View style={styles.currencyRow}>
          {CURRENCY_RATES.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.currencyChip, currency === c.code && styles.currencyChipActive]}
              onPress={() => setCurrency(currency === c.code ? null : c.code)}
              activeOpacity={0.8}
            >
              <Text style={[styles.currencyChipText, currency === c.code && styles.currencyChipTextActive]}>{c.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedRate && (
          <Text style={styles.currencyEstimate}>
            ≈ {selectedRate.symbol}{Math.round(startup.raisingAmount * selectedRate.rate).toLocaleString()} target · {selectedRate.symbol}
            {Math.round(startup.raisedAmount * selectedRate.rate).toLocaleString()} raised (illustrative, not a live rate)
          </Text>
        )}

        {!previewMode && postMoneyValue && (
          <View style={styles.calcBox}>
            <Text style={styles.calcLabel}>ESTIMATE YOUR STAKE</Text>
            <View style={styles.calcInputWrap}>
              <Text style={styles.calcCurrency}>$</Text>
              <TextInput
                style={styles.calcInput}
                value={calcAmount}
                onChangeText={(v) => setCalcAmount(v.replace(/\D/g, ''))}
                keyboardType="numeric"
                placeholder="Amount you'd invest"
                placeholderTextColor={colors.line}
              />
            </View>
            {estStake !== null && (
              <Text style={styles.calcResult}>
                ≈ {estStake < 0.01 ? '<0.01' : estStake.toFixed(2)}% equity stake at {startup.postMoney} post-money
              </Text>
            )}
            <Text style={styles.calcDisclaimer}>Estimate only — final terms are set in your term sheet.</Text>
          </View>
        )}

        <Divider style={{ marginVertical: 20 }} />

        {/* Team */}
        {team.length > 0 ? (
          <>
            <Eyebrow>Meet the team</Eyebrow>
            {team.map((m, i) => (
              <View key={`${m.name}-${i}`} style={styles.teamRow}>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{m.name}</Text>
                  <Text style={styles.teamRole}>{m.role}</Text>
                </View>
                {!!m.socialLink && (
                  <TouchableOpacity onPress={() => Linking.openURL(m.socialLink)} activeOpacity={0.7}>
                    <Text style={styles.teamLink}>View profile ›</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        ) : (
          <>
            <Eyebrow>About the founder</Eyebrow>
            <Text style={styles.founderName}>{startup.founderName}</Text>
            <Text style={styles.founderBio}>{startup.founderBio}</Text>
          </>
        )}

        <Divider style={{ marginVertical: 20 }} />

        {/* Business social links */}
        {socialLinks.length > 0 && (
          <>
            <Eyebrow>Connect</Eyebrow>
            <View style={styles.socialRow}>
              {socialLinks.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  style={styles.socialChip}
                  onPress={() => Linking.openURL(l.url)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialChipText}>{l.platform} ↗</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Divider style={{ marginVertical: 20 }} />
          </>
        )}

        {/* Tags */}
        <Eyebrow>Tags</Eyebrow>
        <View style={styles.tagRow}>
          {startup.tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        {!previewMode && (
          <TouchableOpacity style={styles.shareRow} onPress={handleShare} activeOpacity={0.7}>
            <Text style={styles.shareText}>{shareCopied ? 'Link copied to clipboard!' : 'Share this deal ↗'}</Text>
          </TouchableOpacity>
        )}

        {/* Safety notice */}
        <View style={styles.safetyBox}>
          <Text style={styles.safetyText}>
            WAAW NEVER ASKS YOU TO TRANSFER FUNDS OUTSIDE THE ESCROW FLOW.
            ALL COMMITMENTS ARE PROTECTED.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky commit button */}
      <View style={styles.stickyFooter}>
        <GoldButton
          label={previewMode ? 'Investors will see a "Commit to invest" button here' : `Commit to invest in ${startup.name}`}
          onPress={() => onCommit(startup)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  previewBadge: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  previewBadgeText: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.bg, letterSpacing: 0.6 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontFamily: fonts.serif, fontSize: 20, color: colors.accent },
  backLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.6 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectorLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.6,
  },
  companyName: {
    fontFamily: fonts.serifItalic,
    fontSize: 34,
    color: colors.text,
    lineHeight: 40,
    marginBottom: 4,
  },
  locationLine: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 0.6,
    marginBottom: 16,
  },
  pitch: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '300' as any,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statValue: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
    color: colors.accent,
    lineHeight: 24,
  },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  raiseRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  raisedAmt: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.accent,
    lineHeight: 32,
  },
  raiseTarget: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
  },
  pctLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    marginTop: 8,
    letterSpacing: 0.6,
  },
  currencyRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  currencyChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  currencyChipActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.1)' },
  currencyChipText: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },
  currencyChipTextActive: { color: colors.accent },
  currencyEstimate: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, marginTop: 8, lineHeight: 14 },
  calcBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
  },
  calcLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: 10 },
  calcInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    backgroundColor: colors.bg,
  },
  calcCurrency: { fontFamily: fonts.serif, fontSize: 18, color: colors.muted, marginRight: 4 },
  calcInput: { flex: 1, fontFamily: fonts.serif, fontSize: 18, color: colors.text, paddingVertical: 12 },
  calcResult: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.accent, marginTop: 10 },
  calcDisclaimer: { fontFamily: fonts.mono, fontSize: 8, color: colors.muted, marginTop: 6, letterSpacing: 0.3 },
  founderName: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  founderBio: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    fontWeight: '300' as any,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  teamInfo: { flex: 1 },
  teamName: { fontFamily: fonts.serifItalic, fontSize: 16, color: colors.text },
  teamRole: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, marginTop: 2, letterSpacing: 0.4 },
  teamLink: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accent },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  socialChip: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  socialChipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accent },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  shareRow: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.accent },
  safetyBox: {
    marginTop: 20,
    borderLeftWidth: 2,
    borderLeftColor: colors.line,
    paddingLeft: 14,
    paddingVertical: 10,
  },
  safetyText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    lineHeight: 15,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: 36,
    backgroundColor: 'rgba(26,24,21,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
