import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';

// ─── Eyebrow label ───────────────────────────────────────────────────────────
export const Eyebrow = ({ children, style }: { children: string; style?: TextStyle }) => (
  <Text style={[styles.eyebrow, style]}>{children.toUpperCase()}</Text>
);

// ─── Section label (gold) ─────────────────────────────────────────────────────
export const SectionLabel = ({ children }: { children: string }) => (
  <Text style={styles.sectionLabel}>{children.toUpperCase()}</Text>
);

// ─── Screen heading ───────────────────────────────────────────────────────────
export const ScreenH1 = ({ children }: { children: string }) => (
  <Text style={styles.screenH1}>{children}</Text>
);

// ─── Screen subtitle ──────────────────────────────────────────────────────────
export const ScreenSub = ({ children }: { children: string }) => (
  <Text style={styles.screenSub}>{children}</Text>
);

// ─── Gold button ──────────────────────────────────────────────────────────────
export const GoldButton = ({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) => (
  <TouchableOpacity style={[styles.goldBtn, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.goldBtnText}>{label}</Text>
  </TouchableOpacity>
);

// ─── Ghost button ─────────────────────────────────────────────────────────────
export const GhostButton = ({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) => (
  <TouchableOpacity style={[styles.ghostBtn, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.ghostBtnText}>{label}</Text>
  </TouchableOpacity>
);

// ─── Dashed empty state card ─────────────────────────────────────────────────
export const DashedCard = ({
  title,
  body,
  ctaLabel,
  onCta,
  children,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  onCta?: () => void;
  children?: React.ReactNode;
}) => (
  <View style={styles.dashedCard}>
    <Text style={styles.dashedTitle}>{title}</Text>
    <Text style={styles.dashedBody}>{body}</Text>
    {ctaLabel && onCta && <GoldButton label={ctaLabel} onPress={onCta} />}
    {children}
  </View>
);

// ─── Stat tile ────────────────────────────────────────────────────────────────
export const StatTile = ({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) => (
  <View style={styles.statTile}>
    <Text style={[styles.statValue, accent && { color: colors.accent }]}>{value}</Text>
    <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
  </View>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ pct }: { pct: number }) => (
  <View style={styles.progTrack}>
    <View style={[styles.progFill, { width: `${Math.min(pct, 100)}%` as any }]} />
  </View>
);

// ─── Verified badge ───────────────────────────────────────────────────────────
export const VerifiedBadge = ({ verified }: { verified: boolean }) => (
  <View style={[styles.badge, !verified && styles.badgePending]}>
    <Text style={[styles.badgeText, !verified && styles.badgeTextPending]}>
      {verified ? 'VERIFIED' : 'PENDING'}
    </Text>
  </View>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.divider, style]} />
);

// ─── Profile nav row ─────────────────────────────────────────────────────────
export const ProfileRow = ({
  label,
  value,
  onPress,
  accent,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  accent?: boolean;
}) => (
  <TouchableOpacity style={styles.profileRow} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.profileRowLabel}>{label}</Text>
    <Text style={[styles.profileRowValue, accent && { color: colors.accent }]}>
      {value} ›
    </Text>
  </TouchableOpacity>
);

// ─── Form text field ──────────────────────────────────────────────────────────
export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label.toUpperCase()}</Text>
    <TextInput
      style={[styles.fieldInput, error ? styles.fieldInputError : null]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.line}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? 'none'}
    />
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

// ─── Monogram avatar ─────────────────────────────────────────────────────────
export const Monogram = ({
  letter,
  size = 46,
}: {
  letter: string;
  size?: number;
}) => (
  <View
    style={[
      styles.monogram,
      { width: size, height: size, borderRadius: size * 0.26 },
    ]}
  >
    <Text style={[styles.monogramText, { fontSize: size * 0.42 }]}>{letter}</Text>
  </View>
);

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 1.4,
    marginBottom: spacing.md,
  },
  screenH1: {
    fontFamily: fonts.serif,
    fontSize: 34,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 40,
  },
  screenSub: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.xl,
    lineHeight: 19,
    fontWeight: '300' as any,
  },
  goldBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  goldBtnText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.bg,
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  ghostBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  dashedCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  dashedTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  dashedBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '300' as any,
  },
  statTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  statValue: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    lineHeight: 32,
  },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
  progTrack: {
    height: 5,
    backgroundColor: colors.deeper,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progFill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgePending: {
    backgroundColor: colors.line,
  },
  badgeText: {
    fontFamily: fonts.monoBold,
    fontSize: 8,
    color: colors.bg,
    letterSpacing: 0.8,
  },
  badgeTextPending: {
    color: colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  profileRowLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  profileRowValue: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
  },
  monogram: {
    backgroundColor: colors.deeper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: fonts.serifItalic,
    color: colors.accent,
  },
  fieldWrap: { marginBottom: spacing.lg },
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    backgroundColor: colors.card,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  fieldInputError: { borderColor: colors.danger },
  fieldError: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.danger,
    marginTop: spacing.xs,
    fontWeight: '300' as any,
  },
});
