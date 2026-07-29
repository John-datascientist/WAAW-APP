import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import {
  Eyebrow,
  SectionLabel,
  StatTile,
  GoldButton,
  Monogram,
  DashedCard,
} from '../components';
import { Commitment, Startup } from '../data';

interface Props {
  commitments: Commitment[];
  featuredStartups: Startup[];
  savedStartups: Startup[];
  unreadCount: number;
  onGoStartups: () => void;
  onGoProfile: () => void;
  onOpenNotifications: () => void;
  onSelectStartup: (startup: Startup) => void;
}

const fmt = (n: number) => '$' + n.toLocaleString();

export default function HomeScreen({
  commitments,
  featuredStartups,
  savedStartups,
  unreadCount,
  onGoStartups,
  onGoProfile,
  onOpenNotifications,
  onSelectStartup,
}: Props) {
  const active = commitments.filter((c) => c.status !== 'Refunded');
  const total = active.reduce((a, c) => a + c.amount, 0);
  const inEscrow = active.filter((c) => c.status === 'In escrow' || c.status === 'Countersigned').length;
  const released = commitments.filter((c) => c.status === 'Released').length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>WAAW</Text>
            <Text style={styles.tagline}>WE ARE ALL WE'VE GOT</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.avatarBtn} onPress={onOpenNotifications} activeOpacity={0.8}>
              <Text style={styles.avatarIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={onGoProfile} activeOpacity={0.8}>
              <Text style={styles.avatarIcon}>◉</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured startups */}
        {featuredStartups.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <SectionLabel>Featured</SectionLabel>
              <TouchableOpacity onPress={onGoStartups} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>See all →</Text>
              </TouchableOpacity>
            </View>
            {featuredStartups.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.featuredCard}
                onPress={() => onSelectStartup(s)}
                activeOpacity={0.85}
              >
                <Text style={styles.featuredBadge}>★ FEATURED</Text>
                <Text style={styles.featuredName}>{s.name}</Text>
                <Text style={styles.featuredPitch} numberOfLines={2}>{s.pitch}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Saved startups */}
        {savedStartups.length > 0 && (
          <>
            <SectionLabel>Saved for you</SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savedScroll}>
              {savedStartups.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.savedCard}
                  onPress={() => onSelectStartup(s)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.savedName} numberOfLines={1}>{s.name}</Text>
                  <Text style={styles.savedMeta}>{s.sector.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Hero total */}
        <Eyebrow>In escrow</Eyebrow>
        <Text style={styles.heroNum}>{fmt(total)}</Text>
        <Text style={styles.heroSub}>
          {active.length > 0
            ? `across ${active.length} commitment${active.length !== 1 ? 's' : ''}`
            : 'no commitments yet'}
        </Text>

        {/* Stat grid */}
        <View style={styles.statGrid}>
          <View style={styles.statRow}>
            <StatTile value={String(active.length)} label="Commitments" />
            <View style={{ width: spacing.md }} />
            <StatTile value={fmt(total)} label="Total committed" accent />
          </View>
          <View style={[styles.statRow, { marginTop: spacing.md }]}>
            <StatTile value={String(inEscrow)} label="Held in escrow" />
            <View style={{ width: spacing.md }} />
            <StatTile value={String(released)} label="Released" accent />
          </View>
        </View>

        {/* Commitments list or empty state */}
        {active.length > 0 ? (
          <>
            <SectionLabel>Your commitments</SectionLabel>
            {active.map((c) => (
              <View key={c.id} style={styles.holdingCard}>
                <Monogram letter={c.company.replace(/[^A-Za-z]/g, '').charAt(0) || 'C'} size={46} />
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingName}>{c.company}</Text>
                  <Text style={styles.holdingStatus}>{c.status.toUpperCase()}</Text>
                </View>
                <Text style={styles.holdingAmt}>{fmt(c.amount)}</Text>
              </View>
            ))}
          </>
        ) : (
          <DashedCard
            title="Nothing committed yet"
            body="Browse verified startups and make your first commitment to build your portfolio."
            ctaLabel="Browse startups"
            onCta={onGoStartups}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: 100 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  wordmark: {
    fontFamily: fonts.serifBoldItalic,
    fontSize: 28,
    color: colors.text,
    lineHeight: 32,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.muted,
    letterSpacing: 1.8,
    marginTop: 5,
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 18, color: colors.muted },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontFamily: fonts.monoBold, fontSize: 8, color: colors.bg },
  heroNum: {
    fontFamily: fonts.serif,
    fontSize: 52,
    color: colors.text,
    lineHeight: 56,
    marginBottom: 6,
  },
  heroSub: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.accent,
    marginBottom: 28,
  },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent, marginBottom: spacing.md },
  featuredCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  featuredBadge: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  featuredName: {
    fontFamily: fonts.serifItalic,
    fontSize: 19,
    color: colors.text,
    marginBottom: 6,
  },
  featuredPitch: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    fontWeight: '300' as any,
  },
  savedScroll: { marginBottom: 24 },
  savedCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    maxWidth: 160,
  },
  savedName: { fontFamily: fonts.serifItalic, fontSize: 14, color: colors.text },
  savedMeta: { fontFamily: fonts.mono, fontSize: 8, color: colors.muted, letterSpacing: 0.4, marginTop: 3 },
  statGrid: { marginBottom: 28 },
  statRow: { flexDirection: 'row' },
  holdingCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  holdingInfo: { flex: 1, minWidth: 0 },
  holdingName: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    color: colors.text,
    lineHeight: 22,
  },
  holdingStatus: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  holdingAmt: {
    fontFamily: fonts.serifItalic,
    fontSize: 17,
    color: colors.text,
  },
});
