import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme';
import { GhostButton, TextField } from '../../components';
import { Cofounder, MIN_COFOUNDERS } from '../../data';
import { copyToClipboard } from '../../lib/clipboard';

interface Props {
  cofounders: Cofounder[];
  onBack: () => void;
  onAdd: (name: string, role: string) => void;
  onVerify: (cofounderId: string) => void;
  onRemove: (cofounderId: string) => void;
}

export default function CofoundersScreen({ cofounders, onBack, onAdd, onVerify, onRemove }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyInvite = async (cofounderId: string) => {
    const ok = await copyToClipboard(`https://waaw.co/invite/${cofounderId}`);
    if (ok) {
      setCopiedId(cofounderId);
      setTimeout(() => setCopiedId((prev) => (prev === cofounderId ? null : prev)), 2000);
    }
  };

  const handleAdd = () => {
    if (!name.trim() || !role.trim()) return;
    onAdd(name.trim(), role.trim());
    setName('');
    setRole('');
    setAdding(false);
  };

  const meetsMinimum = cofounders.length >= MIN_COFOUNDERS;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Onboarding</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify co-founders</Text>
        <Text style={styles.sub}>
          WAAW requires at least {MIN_COFOUNDERS} co-founders per startup. Every co-founder must
          complete a selfie, ID check, and personal social link.
        </Text>

        {!meetsMinimum && (
          <View style={styles.warnCard}>
            <Text style={styles.warnText}>
              {cofounders.length} of {MIN_COFOUNDERS} minimum co-founders added. Add at least{' '}
              {MIN_COFOUNDERS - cofounders.length} more to continue.
            </Text>
          </View>
        )}

        {cofounders.map((c, i) => {
          const done = c.selfieDone && c.idDone && c.socialLink.trim().length > 0;
          const removable = i > 0 && !done;
          return (
            <View key={c.id} style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{c.name}</Text>
                <Text style={styles.rowRole}>{c.role}</Text>
                {done && (
                  <TouchableOpacity onPress={() => handleCopyInvite(c.id)} activeOpacity={0.7}>
                    <Text style={styles.inviteLink}>
                      {copiedId === c.id ? 'Invite link copied!' : 'Copy invite link'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {done ? (
                <View style={styles.doneCol}>
                  <View style={styles.doneBadge}>
                    <Text style={styles.doneBadgeText}>VERIFIED</Text>
                  </View>
                  <TouchableOpacity onPress={() => onVerify(c.id)} activeOpacity={0.7}>
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.doneCol}>
                  <TouchableOpacity style={styles.verifyBtn} onPress={() => onVerify(c.id)} activeOpacity={0.8}>
                    <Text style={styles.verifyBtnText}>Verify</Text>
                  </TouchableOpacity>
                  {removable && (
                    <TouchableOpacity onPress={() => onRemove(c.id)} activeOpacity={0.7}>
                      <Text style={styles.removeLink}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {adding ? (
          <View style={styles.addForm}>
            <TextField label="Full name" value={name} onChangeText={setName} placeholder="Chidi Obi" autoCapitalize="words" />
            <TextField label="Role" value={role} onChangeText={setRole} placeholder="Co-founder / CTO" autoCapitalize="words" />
            <GhostButton label="Add co-founder" onPress={handleAdd} />
          </View>
        ) : (
          <TouchableOpacity style={styles.addLink} onPress={() => setAdding(true)} activeOpacity={0.7}>
            <Text style={styles.addLinkText}>+ Add another co-founder</Text>
          </TouchableOpacity>
        )}
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
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 24, lineHeight: 19, fontWeight: '300' as any },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  rowInfo: { flex: 1 },
  rowName: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  rowRole: { fontFamily: fonts.mono, fontSize: 10, color: colors.muted, marginTop: 3 },
  verifyBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  verifyBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.accent },
  doneCol: { alignItems: 'flex-end', gap: 6 },
  doneBadge: {
    backgroundColor: colors.success,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  doneBadgeText: { fontFamily: fonts.monoBold, fontSize: 8, color: '#fff', letterSpacing: 0.6 },
  editLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent },
  removeLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.danger },
  inviteLink: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.accent, marginTop: 4 },
  warnCard: {
    borderWidth: 1,
    borderColor: colors.warnBorder,
    backgroundColor: colors.warnLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  warnText: { fontFamily: fonts.sans, fontSize: 12, color: colors.warn, lineHeight: 18, fontWeight: '300' as any },
  addLink: { marginTop: spacing.sm, alignItems: 'center', paddingVertical: 10 },
  addLinkText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.accent },
  addForm: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
  },
});
