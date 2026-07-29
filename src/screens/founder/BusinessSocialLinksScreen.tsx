import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GhostButton, GoldButton, TextField } from '../../components';
import { SocialLink, SOCIAL_PLATFORMS } from '../../data';

interface Props {
  links: SocialLink[];
  onBack: () => void;
  onAdd: (platform: string, url: string) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
}

export default function BusinessSocialLinksScreen({ links, onBack, onAdd, onRemove, onContinue }: Props) {
  const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0]);
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!url.trim()) return;
    onAdd(platform, url.trim());
    setUrl('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Business social links</Text>
        <Text style={styles.sub}>
          Add your startup's social platforms. These will show on your public investor profile,
          clickable for any visitor to view.
        </Text>

        {links.map((l) => (
          <View key={l.id} style={styles.linkRow}>
            <View style={styles.linkInfo}>
              <Text style={styles.linkPlatform}>{l.platform}</Text>
              <Text style={styles.linkUrl} numberOfLines={1}>{l.url}</Text>
            </View>
            <TouchableOpacity onPress={() => onRemove(l.id)} activeOpacity={0.7}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addForm}>
          <Text style={styles.stepLabel}>PLATFORM</Text>
          <View style={styles.platformRow}>
            {SOCIAL_PLATFORMS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.chip, platform === p && styles.chipActive]}
                onPress={() => setPlatform(p)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, platform === p && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextField label="URL" value={url} onChangeText={setUrl} placeholder="https://instagram.com/yourstartup" keyboardType="url" />
          <GhostButton label="Add platform" onPress={handleAdd} />
        </View>

        <GoldButton
          label="Continue"
          onPress={links.length > 0 ? onContinue : () => {}}
          style={{ marginTop: spacing.xl, opacity: links.length > 0 ? 1 : 0.4 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  backbar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { fontFamily: fonts.serif, fontSize: 20, color: colors.accent },
  backLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 0.6 },
  content: { padding: spacing.xl, paddingBottom: 60 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.text, marginBottom: 6 },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20, lineHeight: 19, fontWeight: '300' as any },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  linkInfo: { flex: 1, marginRight: spacing.sm },
  linkPlatform: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text },
  linkUrl: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, marginTop: 2 },
  removeText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.danger },
  addForm: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
  },
  stepLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.muted, letterSpacing: 1.2, marginBottom: spacing.sm },
  platformRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,76,0.1)' },
  chipText: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted },
  chipTextActive: { color: colors.accent },
});
