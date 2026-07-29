import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { copyToClipboard } from '../../lib/clipboard';
import { downloadTextFile } from '../../lib/download';
import { Commitment } from '../../data';

interface Props {
  onBack: () => void;
  commitments: Commitment[];
  onRequestDataExport: () => void;
}

interface Statement {
  period: string;
  type: string;
  size: string;
  filter: (c: Commitment) => boolean;
}

const QUARTER_RANGES = ['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Oct–Dec'];

function buildStatements(commitments: Commitment[]): Statement[] {
  const currentYear = new Date().getUTCFullYear();
  const quarterKeys = new Set<string>();
  const pastYears = new Set<number>();

  commitments.forEach((c) => {
    const d = new Date(c.date);
    const year = d.getUTCFullYear();
    if (year === currentYear) {
      const q = Math.floor(d.getUTCMonth() / 3) + 1;
      quarterKeys.add(`${year}-${q}`);
    } else {
      pastYears.add(year);
    }
  });

  const quarterStatements: Statement[] = Array.from(quarterKeys)
    .sort()
    .reverse()
    .map((key) => {
      const [yearStr, qStr] = key.split('-');
      const year = parseInt(yearStr, 10);
      const q = parseInt(qStr, 10);
      return {
        period: `Q${q} ${year} (${QUARTER_RANGES[q - 1]})`,
        type: 'Transaction statement',
        size: 'PDF',
        filter: (c: Commitment) => {
          const d = new Date(c.date);
          return d.getUTCFullYear() === year && Math.floor(d.getUTCMonth() / 3) + 1 === q;
        },
      };
    });

  const yearStatements: Statement[] = Array.from(pastYears)
    .sort()
    .reverse()
    .map((year) => ({
      period: `Full year ${year}`,
      type: 'Annual investment summary',
      size: 'PDF',
      filter: (c: Commitment) => new Date(c.date).getUTCFullYear() === year,
    }));

  return [...quarterStatements, ...yearStatements];
}

const fmt = (n: number) => '$' + n.toLocaleString();

export default function StatementsScreen({ onBack, commitments, onRequestDataExport }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloadingPeriod, setDownloadingPeriod] = useState<string | null>(null);
  const [exportRequested, setExportRequested] = useState(false);
  const statements = buildStatements(commitments);

  const handleCopySummary = async () => {
    const active = commitments.filter((c) => c.status !== 'Refunded');
    const total = active.reduce((a, c) => a + c.amount, 0);
    const lines = [
      'WAAW INVESTOR — PORTFOLIO SUMMARY',
      `Total committed: ${fmt(total)}`,
      '',
      ...active.map((c) => `${c.company} — ${fmt(c.amount)} — ${c.status} — REF ${c.ref}`),
    ];
    const ok = await copyToClipboard(lines.join('\n'));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async (s: Statement) => {
    const active = commitments.filter((c) => c.status !== 'Refunded' && s.filter(c));
    const total = active.reduce((a, c) => a + c.amount, 0);
    const lines = [
      'WAAW INVESTOR',
      `${s.type.toUpperCase()} — ${s.period}`,
      '',
      `Total committed: ${fmt(total)}`,
      '',
      ...(active.length
        ? active.map((c) => `${c.company} — ${fmt(c.amount)} — ${c.status} — REF ${c.ref} — ${c.date}`)
        : ['No commitments on this account yet.']),
    ];
    const filename = `waaw-statement-${s.period.replace(/[^\w]+/g, '-').toLowerCase()}.txt`;
    const result = await downloadTextFile(filename, lines.join('\n'));
    if (result !== 'failed') {
      setDownloadingPeriod(s.period);
      setTimeout(() => setDownloadingPeriod(null), 2000);
    }
  };

  const handleRequestExport = () => {
    setExportRequested(true);
    onRequestDataExport();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Home</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Statements</Text>
        <Text style={styles.sub}>Download your investment statements for tax and record-keeping purposes.</Text>

        <View style={styles.taxCard}>
          <Text style={styles.taxTitle}>Tax note</Text>
          <Text style={styles.taxBody}>
            WAAW does not provide tax advice. You are responsible for declaring investment income
            and gains to your relevant tax authority. Seek independent tax advice for your jurisdiction.
          </Text>
        </View>

        {statements.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No statements yet — periods appear here automatically once you have committed investments.
            </Text>
          </View>
        ) : (
          statements.map((s) => (
            <View key={s.period} style={styles.statRow}>
              <View style={styles.statInfo}>
                <Text style={styles.statPeriod}>{s.period}</Text>
                <Text style={styles.statType}>{s.type} · {s.size}</Text>
              </View>
              <TouchableOpacity
                style={styles.dlBtn}
                onPress={() => handleDownload(s)}
                activeOpacity={0.8}
              >
                <Text style={styles.dlBtnText}>{downloadingPeriod === s.period ? 'Downloaded!' : 'Download'}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopySummary} activeOpacity={0.8}>
          <Text style={styles.copyBtnText}>{copied ? 'Summary copied!' : 'Copy portfolio summary'}</Text>
        </TouchableOpacity>

        <View style={styles.div} />
        <Text style={styles.seclab}>Export all data</Text>
        <View style={styles.exportCard}>
          <Text style={styles.exportTitle}>GDPR / NDPA data export</Text>
          <Text style={styles.exportBody}>
            Request a full export of all personal data WAAW holds about you. Processed within 30 days.
          </Text>
          {exportRequested ? (
            <View style={styles.exportDoneBadge}>
              <Text style={styles.exportDoneText}>✓ Requested — you'll receive an email within 30 days</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={handleRequestExport}
              activeOpacity={0.8}
            >
              <Text style={styles.exportBtnText}>Request data export</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backbar: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1.5, borderBottomColor: colors.ln, backgroundColor: colors.card },
  backBtn: { flexDirection: 'row' as const, alignItems: 'center', gap: 8 },
  backArrow: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.pu },
  backLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.mu },
  content: { padding: spacing.xl, paddingBottom: 40 },
  h1: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.tx, marginBottom: 4 },
  sub: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, marginBottom: 16, fontWeight: '300' as any, lineHeight: 16 },
  taxCard: { backgroundColor: colors.chLight, borderWidth: 1.5, borderColor: colors.ch2, borderRadius: 14, padding: spacing.md, marginBottom: 16 },
  taxTitle: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.warn, textTransform: 'uppercase' as const, letterSpacing: 0.6, marginBottom: 5 },
  taxBody: { fontFamily: fonts.sans, fontSize: 12, color: colors.tx, lineHeight: 18, fontWeight: '300' as any },
  emptyCard: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.ln, borderRadius: 12, padding: 14, marginBottom: 8 },
  emptyText: { fontFamily: fonts.sans, fontSize: 12, color: colors.mu, fontWeight: '300' as any, lineHeight: 18 },
  statRow: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.ln, borderRadius: 12, padding: 14, flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  statInfo: { flex: 1 },
  statPeriod: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.tx },
  statType: { fontFamily: fonts.sans, fontSize: 10, color: colors.mu, marginTop: 2, fontWeight: '300' as any },
  dlBtn: { backgroundColor: colors.pu, borderRadius: 9, paddingVertical: 7, paddingHorizontal: 12 },
  dlBtnText: { fontFamily: fonts.monoBold, fontSize: 10, color: '#fff' },
  copyBtn: { borderWidth: 1.5, borderColor: colors.pu, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  copyBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.pu },
  div: { height: 1.5, backgroundColor: colors.ln, marginVertical: 14 },
  seclab: { fontFamily: fonts.monoBold, fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: 1, color: colors.pu, marginBottom: 10 },
  exportCard: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.ln, borderRadius: 14, padding: spacing.md },
  exportTitle: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.tx, marginBottom: 6 },
  exportBody: { fontFamily: fonts.sans, fontSize: 11, color: colors.mu, fontWeight: '300' as any, lineHeight: 16, marginBottom: 12 },
  exportBtn: { backgroundColor: colors.pu, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 14, alignSelf: 'flex-start' as const },
  exportBtnText: { fontFamily: fonts.monoBold, fontSize: 10, color: '#fff' },
  exportDoneBadge: { backgroundColor: colors.suLight, borderWidth: 1.5, borderColor: colors.suBorder, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 14, alignSelf: 'flex-start' as const },
  exportDoneText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.su },
});
