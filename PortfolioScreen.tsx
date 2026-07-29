import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import {
  ScreenH1,
  ScreenSub,
  SectionLabel,
  DashedCard,
  Divider,
} from '../components';
import { Commitment, Startup, EscrowStatus } from '../data';
import { copyToClipboard, founderProfileUrl } from '../lib/clipboard';

interface Props {
  commitments: Commitment[];
  savedStartups: Startup[];
  allStartups: Startup[];
  notes: Record<string, string>;
  onGoStartups: () => void;
  onSelectStartup: (startup: Startup) => void;
  onToggleWatchlist: (startupId: string) => void;
  onRequestRefund: (commitmentId: string) => void;
  onChangeNote: (startupId: string, note: string) => void;
}

const fmt = (n: number) => '$' + n.toLocaleString();

const STATUS_COLORS: Record<string, string> = {
  'In escrow': colors.accent,
  Countersigned: '#4ade80',
  Released: colors.muted,
  Refunded: colors.danger,
};

const SECTOR_COLORS = [colors.accent, '#4ade80', '#60a5fa', '#f472b6', '#fb923c', '#a78bfa'];

export default function PortfolioScreen({
  commitments,
  savedStartups,
  allStartups,
  notes,
  onGoStartups,
  onSelectStartup,
  onToggleWatchlist,
  onRequestRefund,
  onChangeNote,
}: Props) {
  const active = commitments.filter((c) => c.status !== 'Refunded');
  const refunded = commitments.filter((c) => c.status === 'Refunded');
  const total = active.reduce((a, c) => a + c.amount, 0);
  const refundedTotal = refunded.reduce((a, c) => a + c.amount, 0);

  // Alert.alert is a no-op on react-native-web (empty function body), so a
  // confirmation for a destructive action has to be an in-app affordance to
  // actually work across web as well as native.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [watchlistCopied, setWatchlistCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<EscrowStatus | 'All'>('All');

  const handleTapHolding = (c: Commitment) => {
    if (c.status !== 'In escrow') return;
    setConfirmingId(confirmingId === c.id ? null : c.id);
  };

  const handleCopyWatchlist = async () => {
    const lines = [
      'MY WAAW WATCHLIST',
      '',
      ...savedStartups.map((s) => `${s.name} (${s.sector}) — ${founderProfileUrl(s.id)}`),
    ];
    const ok = await copyToClipboard(lines.join('\n'));
    if (ok) {
      setWatchlistCopied(true);
      setTimeout(() => setWatchlistCopied(false), 2000);
    }
  };

  const filteredActive = statusFilter === 'All' ? active : active.filter((c) => c.status === statusFilter);
  const STATUS_FILTERS: (EscrowStatus | 'All')[] = ['All', 'In escrow', 'Countersigned', 'Released'];

  const sectorBreakdown = (() => {
    const bySector: Record<string, number> = {};
    for (const c of active) {
      const startup = allStartups.find((s) => s.id === c.startupId);
      const sector = startup?.sector || 'Other';
      bySector[sector] = (bySector[sector] ?? 0) + c.amount;
    }
    return Object.entries(bySector)
      .map(([sector, amount]) => ({ sector, amount, pct: total > 0 ? Math.round((amount / total) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount);
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenH1>Portfolio</ScreenH1>
        <ScreenSub>Your committed capital and escrow status.</ScreenSub>

        {savedStartups.length > 0 && (
          <>
            <View style={styles.savedHeader}>
              <SectionLabel>Saved startups</SectionLabel>
              <TouchableOpacity onPress={handleCopyWatchlist} activeOpacity={0.7}>
                <Text style={styles.copyListLink}>{watchlistCopied ? 'Copied!' : 'Copy list'}</Text>
              </TouchableOpacity>
            </View>
            {savedStartups.map((s) => (
              <View key={s.id} style={styles.savedCard}>
                <TouchableOpacity
                  style={styles.savedRow}
                  onPress={() => onSelectStartup(s)}
                  activeOpacity={0.85}
                >
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName}>{s.name}</Text>
                    <Text style={styles.savedMeta}>{s.sector.toUpperCase()} · {s.stage.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); onToggleWatchlist(s.id); }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.savedRemove}>Remove</Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                {editingNoteId === s.id ? (
                  <View style={styles.noteEditWrap}>
                    <TextInput
                      style={styles.noteInput}
                      value={notes[s.id] ?? ''}
                      onChangeText={(v) => onChangeNote(s.id, v)}
                      placeholder="Why does this deal interest you?"
                      placeholderTextColor={colors.line}
                      multiline
                      autoFocus
                    />
                    <TouchableOpacity onPress={() => setEditingNoteId(null)} activeOpacity={0.7}>
                      <Text style={styles.noteDoneLink}>Done</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setEditingNoteId(s.id)} activeOpacity={0.7} style={styles.noteRow}>
                    {notes[s.id] ? (
                      <Text style={styles.noteText}>📝 {notes[s.id]}</Text>
                    ) : (
                      <Text style={styles.noteAddLink}>+ Add a private note</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <Divider style={{ marginVertical: 20 }} />
          </>
        )}

        {commitments.length > 0 ? (
          <>
            {active.length > 0 && (
              <>
                {/* Total card */}
                <View style={styles.totalCard}>
                  <Text style={styles.totalLabel}>TOTAL COMMITTED</Text>
                  <Text style={styles.totalValue}>{fmt(total)}</Text>
                </View>

                {sectorBreakdown.length > 1 && (
                  <>
                    <SectionLabel>By sector</SectionLabel>
                    <View style={styles.sectorCard}>
                      <View style={styles.sectorBar}>
                        {sectorBreakdown.map((row, i) => (
                          <View
                            key={row.sector}
                            style={{ width: `${row.pct}%`, backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length], height: '100%' }}
                          />
                        ))}
                      </View>
                      {sectorBreakdown.map((row, i) => (
                        <View key={row.sector} style={styles.sectorRow}>
                          <View style={styles.sectorLabelRow}>
                            <View style={[styles.sectorDot, { backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }]} />
                            <Text style={styles.sectorName}>{row.sector}</Text>
                          </View>
                          <Text style={styles.sectorAmt}>{fmt(row.amount)} · {row.pct}%</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                <SectionLabel>Holdings</SectionLabel>
                <View style={styles.statusFilterRow}>
                  {STATUS_FILTERS.map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.statusChip, statusFilter === f && styles.statusChipActive]}
                      onPress={() => setStatusFilter(f)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.statusChipText, statusFilter === f && styles.statusChipTextActive]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {filteredActive.length === 0 && (
                  <Text style={styles.noResults}>No holdings with status "{statusFilter}".</Text>
                )}
              </>
            )}

            {filteredActive.map((c, i) => (
              <React.Fragment key={c.id}>
                <TouchableOpacity
                  style={styles.holdingRow}
                  onPress={() => handleTapHolding(c)}
                  activeOpacity={c.status === 'In escrow' ? 0.7 : 1}
                >
                  <View style={styles.holdingLeft}>
                    <Text style={styles.holdingName}>{c.company}</Text>
                    <Text style={styles.holdingMeta}>
                      {c.status.toUpperCase()} · REF {c.ref}
                      {c.status === 'In escrow' ? ' · Tap to request refund' : ''}
                    </Text>
                  </View>
                  <View style={styles.holdingRight}>
                    <Text style={styles.holdingAmt}>{fmt(c.amount)}</Text>
                    <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[c.status] || colors.muted }]} />
                  </View>
                </TouchableOpacity>
                {confirmingId === c.id && (
                  <View style={styles.confirmBox}>
                    <Text style={styles.confirmText}>
                      Request a refund of {fmt(c.amount)} from {c.company}? Only available while
                      still held in escrow, before the startup countersigns.
                    </Text>
                    <View style={styles.confirmRow}>
                      <TouchableOpacity
                        style={styles.confirmCancelBtn}
                        onPress={() => setConfirmingId(null)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.confirmCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmRefundBtn}
                        onPress={() => {
                          onRequestRefund(c.id);
                          setConfirmingId(null);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.confirmRefundText}>Request refund</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {i < filteredActive.length - 1 && <Divider />}
              </React.Fragment>
            ))}

            {refunded.length > 0 && (
              <>
                <View style={styles.refundedHeader}>
                  <SectionLabel>Refunded</SectionLabel>
                  <Text style={styles.refundedTotal}>{fmt(refundedTotal)} total</Text>
                </View>
                {refunded.map((c, i) => (
                  <React.Fragment key={c.id}>
                    <View style={[styles.holdingRow, styles.holdingRowRefunded]}>
                      <View style={styles.holdingLeft}>
                        <Text style={[styles.holdingName, styles.holdingNameRefunded]}>{c.company}</Text>
                        <Text style={styles.holdingMeta}>REFUNDED · REF {c.ref}</Text>
                      </View>
                      <Text style={[styles.holdingAmt, styles.holdingNameRefunded]}>{fmt(c.amount)}</Text>
                    </View>
                    {i < refunded.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            <DashedCard
              title="Your portfolio is empty"
              body="Commitments you make appear here with their live escrow status and reference codes."
              ctaLabel="Find startups"
              onCta={onGoStartups}
            />

            {/* Escrow explainer */}
            <View style={styles.explainerCard}>
              <Text style={styles.explainerTitle}>HOW ESCROW WORKS</Text>
              {[
                { n: '1', text: 'You commit to a startup. Funds move to a protected escrow account.' },
                { n: '2', text: 'The startup countersigns the term sheet. Status updates to Countersigned.' },
                { n: '3', text: 'Funds release to the startup once all conditions are met.' },
              ].map((step) => (
                <View key={step.n} style={styles.explainerRow}>
                  <View style={styles.stepNumWrap}>
                    <Text style={styles.stepNum}>{step.n}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 100 },
  totalCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 22,
    marginBottom: 22,
    backgroundColor: colors.card,
  },
  totalLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalValue: {
    fontFamily: fonts.serif,
    fontSize: 38,
    color: colors.accent,
    lineHeight: 42,
  },
  savedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refundedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refundedTotal: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, marginBottom: spacing.md },
  copyListLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent, marginBottom: spacing.md },
  statusFilterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  statusChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusChipActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.1)' },
  statusChipText: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },
  statusChipTextActive: { color: colors.accent },
  noResults: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, fontWeight: '300' as any, marginBottom: spacing.md },
  savedCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
  },
  savedInfo: { flex: 1 },
  savedName: { fontFamily: fonts.serifItalic, fontSize: 16, color: colors.text },
  savedMeta: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, marginTop: 3, letterSpacing: 0.4 },
  savedRemove: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.danger },
  noteRow: { paddingHorizontal: spacing.lg, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  noteAddLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent },
  noteText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, fontWeight: '300' as any, lineHeight: 17 },
  noteEditWrap: { paddingHorizontal: spacing.lg, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  noteInput: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 10,
    minHeight: 50,
    textAlignVertical: 'top',
    marginBottom: 6,
  },
  noteDoneLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent, alignSelf: 'flex-end' },
  sectorCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectorBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.md, backgroundColor: colors.deeper },
  sectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  sectorLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectorDot: { width: 8, height: 8, borderRadius: 4 },
  sectorName: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  sectorAmt: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },
  holdingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  holdingLeft: { flex: 1 },
  holdingName: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    color: colors.text,
    lineHeight: 21,
  },
  holdingMeta: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.6,
    marginTop: 4,
  },
  holdingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  holdingAmt: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    color: colors.text,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  confirmBox: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    backgroundColor: '#fef2f2',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  confirmText: { fontFamily: fonts.sans, fontSize: 12, color: colors.text, lineHeight: 18, fontWeight: '300' as any, marginBottom: spacing.sm },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmCancelBtn: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  confirmCancelText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  confirmRefundBtn: { flex: 1, backgroundColor: colors.danger, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  confirmRefundText: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#fff' },
  holdingRowRefunded: { opacity: 0.6 },
  holdingNameRefunded: { color: colors.muted },
  explainerCard: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  explainerTitle: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  explainerRow: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  stepNumWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.deeper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNum: { fontFamily: fonts.mono, fontSize: 9, color: colors.accent },
  stepText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    flex: 1,
    fontWeight: '300' as any,
    paddingTop: 3,
  },
});
