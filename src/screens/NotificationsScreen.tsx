import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../theme';
import { ScreenH1, ScreenSub, DashedCard } from '../components';
import { Notice } from '../data';

interface Props {
  notices: Notice[];
  onBack: () => void;
  onMarkAllRead: () => void;
  onOpenSettings: () => void;
  onToggleRead: (id: string) => void;
}

export default function NotificationsScreen({ notices, onBack, onMarkAllRead, onOpenSettings, onToggleRead }: Props) {
  const unread = notices.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Home</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {unread > 0 && (
            <TouchableOpacity onPress={onMarkAllRead} activeOpacity={0.7}>
              <Text style={styles.markRead}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onOpenSettings} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenH1>Notifications</ScreenH1>
        <ScreenSub>Updates on your commitments and account.</ScreenSub>

        {notices.length === 0 ? (
          <DashedCard
            title="Nothing yet"
            body="You'll see updates here once you make your first commitment."
          />
        ) : (
          notices.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.read && styles.cardUnread]}
              onPress={() => onToggleRead(n.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                {!n.read && <View style={styles.dot} />}
              </View>
              <Text style={styles.cardBody}>{n.body}</Text>
              <Text style={styles.cardTime}>{n.timestamp}{!n.read ? ' · Tap to mark read' : ''}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontFamily: fonts.serif, fontSize: 20, color: colors.accent },
  backLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.6 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  markRead: { fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: 0.4 },
  settingsIcon: { fontSize: 16, color: colors.muted },
  content: { padding: spacing.xl, paddingBottom: 60 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardUnread: { borderColor: colors.accent },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.text, flex: 1 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  cardBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginTop: 6,
    fontWeight: '300' as any,
  },
  cardTime: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    marginTop: 8,
    letterSpacing: 0.6,
  },
});
