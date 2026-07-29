import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, fonts } from '../theme';

export type Tab = 'home' | 'startups' | 'portfolio' | 'profile' | 'dashboard';

const INVESTOR_TABS: { id: Tab; label: string; icon: string; activeIcon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂', activeIcon: '⌂' },
  { id: 'startups', label: 'Startups', icon: '◈', activeIcon: '◈' },
  { id: 'portfolio', label: 'Portfolio', icon: '◧', activeIcon: '◧' },
  { id: 'profile', label: 'Profile', icon: '◉', activeIcon: '◉' },
];

const FOUNDER_TABS: { id: Tab; label: string; icon: string; activeIcon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫', activeIcon: '◫' },
  { id: 'profile', label: 'Profile', icon: '◉', activeIcon: '◉' },
];

interface Props {
  active: Tab;
  onSelect: (tab: Tab) => void;
  variant?: 'investor' | 'founder';
}

export default function TabBar({ active, onSelect, variant = 'investor' }: Props) {
  const tabs = variant === 'founder' ? FOUNDER_TABS : INVESTOR_TABS;
  return (
    <View style={styles.bar}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.btn}
            onPress={() => onSelect(t.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, on && styles.iconActive]}>
                {on ? t.activeIcon : t.icon}
              </Text>
            </View>
            <Text style={[styles.label, on && styles.labelActive]}>
              {t.label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(20,18,15,0.94)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: { position: 'relative' },
  icon: {
    fontSize: 20,
    color: colors.muted,
    opacity: 0.55,
    lineHeight: 24,
  },
  iconActive: {
    color: colors.accent,
    opacity: 1,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 7,
    color: colors.muted,
    letterSpacing: 0.6,
    opacity: 0.55,
  },
  labelActive: {
    color: colors.accent,
    opacity: 1,
  },
});
