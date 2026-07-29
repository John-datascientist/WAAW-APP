import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { ScreenH1, ScreenSub, VerifiedBadge, ProgressBar } from '../components';
import { Startup, STARTUP_SECTORS } from '../data';

interface Props {
  startups: Startup[];
  watchlist: string[];
  recentlyViewed: Startup[];
  compareIds: string[];
  onSelectStartup: (startup: Startup) => void;
  onToggleWatchlist: (startupId: string) => void;
  onToggleCompare: (startupId: string) => void;
  onOpenCompare: () => void;
}

const fmt = (n: number) =>
  n >= 1000000
    ? '$' + (n / 1000000).toFixed(1) + 'M'
    : '$' + (n / 1000).toFixed(0) + 'K';

type SortOption = 'recommended' | 'most-raised' | 'closest' | 'alphabetical';
const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'most-raised', label: 'Most raised' },
  { id: 'closest', label: 'Closest to target' },
  { id: 'alphabetical', label: 'A–Z' },
];

export default function StartupsScreen({
  startups,
  watchlist,
  recentlyViewed,
  compareIds,
  onSelectStartup,
  onToggleWatchlist,
  onToggleCompare,
  onOpenCompare,
}: Props) {
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [savedOnly, setSavedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [closingSoonOnly, setClosingSoonOnly] = useState(false);

  const pct = (s: Startup) => (s.raisingAmount > 0 ? Math.round((s.raisedAmount / s.raisingAmount) * 100) : 0);

  const q = query.trim().toLowerCase();
  const filtered = startups.filter((s) => {
    if (savedOnly && !watchlist.includes(s.id)) return false;
    if (verifiedOnly && !s.verified) return false;
    if (closingSoonOnly && pct(s) < 80) return false;
    if (sectorFilter && s.sector !== sectorFilter) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.pitch.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'most-raised':
        return b.raisedAmount - a.raisedAmount;
      case 'closest':
        return pct(b) - pct(a);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0);
    }
  });
  const sectorsPresent = STARTUP_SECTORS.filter((sec) => startups.some((s) => s.sector === sec));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenH1>Startups</ScreenH1>
        <ScreenSub>Verified deals, synced to your account.</ScreenSub>

        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, pitch, or tag"
          placeholderTextColor={colors.line}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, sectorFilter === null && styles.filterChipActive]}
            onPress={() => setSectorFilter(null)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, sectorFilter === null && styles.filterChipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, savedOnly && styles.filterChipActive]}
            onPress={() => setSavedOnly((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, savedOnly && styles.filterChipTextActive]}>★ Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, verifiedOnly && styles.filterChipActive]}
            onPress={() => setVerifiedOnly((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, verifiedOnly && styles.filterChipTextActive]}>✓ Verified</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, closingSoonOnly && styles.filterChipActive]}
            onPress={() => setClosingSoonOnly((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, closingSoonOnly && styles.filterChipTextActive]}>Closing soon</Text>
          </TouchableOpacity>
          {sectorsPresent.map((sec) => (
            <TouchableOpacity
              key={sec}
              style={[styles.filterChip, sectorFilter === sec && styles.filterChipActive]}
              onPress={() => setSectorFilter(sec)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, sectorFilter === sec && styles.filterChipTextActive]}>{sec}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.sortChip, sortBy === opt.id && styles.filterChipActive]}
              onPress={() => setSortBy(opt.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, sortBy === opt.id && styles.filterChipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {recentlyViewed.length > 0 && !q && !sectorFilter && !savedOnly && !verifiedOnly && !closingSoonOnly && (
          <>
            <Text style={styles.recentLabel}>RECENTLY VIEWED</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
              {recentlyViewed.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.recentCard}
                  onPress={() => onSelectStartup(s)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.recentName} numberOfLines={1}>{s.name}</Text>
                  <Text style={styles.recentMeta}>{s.sector.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {sorted.length === 0 && (
          <Text style={styles.noResults}>No startups match "{query}".</Text>
        )}

        {sorted.map((s) => {
          const saved = watchlist.includes(s.id);
          const comparing = compareIds.includes(s.id);
          return (
          <TouchableOpacity
            key={s.id}
            style={[styles.card, comparing && styles.cardComparing]}
            onPress={() => onSelectStartup(s)}
            activeOpacity={0.85}
          >
            {/* Card header */}
            <View style={styles.cardHeader}>
              <View>
                {s.boosted && <Text style={styles.boostedBadge}>★ FEATURED</Text>}
                <VerifiedBadge verified={s.verified} />
                <Text style={styles.sectorStage}>
                  {s.sector.toUpperCase()} · {s.stage.toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); onToggleCompare(s.id); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.compareIcon, comparing && styles.compareIconActive]}>⇄</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); onToggleWatchlist(s.id); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.saveIcon}>{saved ? '★' : '☆'}</Text>
                </TouchableOpacity>
                <View style={styles.locationBlock}>
                  <Text style={styles.locationText}>{s.city}</Text>
                  <Text style={styles.locationText}>{s.country}</Text>
                </View>
              </View>
            </View>

            {/* Company name */}
            <Text style={styles.companyName}>{s.name}</Text>

            {/* Pitch */}
            <Text style={styles.pitch} numberOfLines={3}>{s.pitch}</Text>

            {/* Tags */}
            <View style={styles.tagRow}>
              {s.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>

            {/* Raise progress */}
            <View style={styles.raiseRow}>
              <Text style={styles.raiseLabel}>
                Raising {fmt(s.raisingAmount)}
              </Text>
              <Text style={styles.raisePct}>{pct(s)}% filled</Text>
            </View>
            <ProgressBar pct={pct(s)} />

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerLabel}>
                {fmt(s.raisedAmount)} raised
              </Text>
              <Text style={styles.viewDetail}>View deal ›</Text>
            </View>
          </TouchableOpacity>
          );
        })}
      </ScrollView>

      {compareIds.length > 0 && (
        <View style={styles.compareBar}>
          <Text style={styles.compareBarText}>{compareIds.length} of 2 selected to compare</Text>
          <TouchableOpacity
            style={[styles.compareBarBtn, compareIds.length < 2 && styles.compareBarBtnDisabled]}
            onPress={compareIds.length === 2 ? onOpenCompare : undefined}
            activeOpacity={0.8}
          >
            <Text style={styles.compareBarBtnText}>Compare</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 100 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 12,
  },
  cardComparing: { borderColor: colors.accent, borderWidth: 2 },
  compareIcon: { fontSize: 18, color: colors.muted },
  compareIconActive: { color: colors.accent },
  compareBar: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: 'rgba(26,24,21,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  compareBarText: { fontFamily: fonts.mono, fontSize: 11, color: '#fff', letterSpacing: 0.4 },
  compareBarBtn: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 20 },
  compareBarBtnDisabled: { opacity: 0.4 },
  compareBarBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.bg },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectorStage: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.6,
    marginTop: 6,
  },
  boostedBadge: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: colors.card,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.text,
    marginBottom: 12,
  },
  noResults: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '300' as any,
  },
  filterScroll: { marginBottom: 12 },
  recentLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  recentScroll: { marginBottom: 16 },
  recentCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    maxWidth: 160,
  },
  recentName: { fontFamily: fonts.serifItalic, fontSize: 14, color: colors.text },
  recentMeta: { fontFamily: fonts.mono, fontSize: 8, color: colors.muted, letterSpacing: 0.4, marginTop: 3 },
  sortChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterChipActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.1)' },
  filterChipText: { fontFamily: fonts.mono, fontSize: 11, color: colors.muted },
  filterChipTextActive: { color: colors.accent },
  headerRight: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  saveIcon: { fontSize: 20, color: colors.accent },
  locationBlock: { alignItems: 'flex-end' },
  locationText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  companyName: {
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  pitch: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '300' as any,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  raiseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  raiseLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  raisePct: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    color: colors.accent,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footerLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  viewDetail: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 0.4,
  },
});
