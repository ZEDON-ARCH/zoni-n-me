import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { ChatIcon, ChatFilledIcon, PlanetIcon, PlanetFilledIcon, PhoneIcon, PhoneFilledIcon, UserIcon, UserFilledIcon } from '../icons';

interface Tab {
  key: string;
  label: string;
  Icon: React.FC<any>;
  IconActive: React.FC<any>;
}

const TABS: Tab[] = [
  { key: 'chats', label: 'Chats', Icon: ChatIcon, IconActive: ChatFilledIcon },
  { key: 'moments', label: 'Moments', Icon: PlanetIcon, IconActive: PlanetFilledIcon },
  { key: 'calls', label: 'Calls', Icon: PhoneIcon, IconActive: PhoneFilledIcon },
  { key: 'me', label: 'Me', Icon: UserIcon, IconActive: UserFilledIcon },
];

interface Props {
  active: string;
  onChange: (key: string) => void;
  badges?: Record<string, number>;
  theme: any;
}

export const PillTabBar: React.FC<Props> = ({ active, onChange, badges, theme }) => {
  return (
    <View style={styles.outer} pointerEvents="box-none">
      <View
        style={[
          styles.dock,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.shadowStrong,
          },
        ]}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          const Icon = isActive ? tab.IconActive : tab.Icon;
          const badge = badges?.[tab.key];
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}
            >
              <View style={styles.iconWrap}>
                <Icon size={22} color={isActive ? theme.primary : theme.textMuted} />
                {badge !== undefined && badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.danger, borderColor: theme.surface }]}>
                    <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                  </View>
                )}
              </View>
              {isActive && (
                <Text style={[styles.label, { color: theme.primary }]}>{tab.label}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: { position: 'absolute', bottom: Platform.select({ ios: 20, android: 12, default: 12 }), left: 0, right: 0, alignItems: 'center' },
  dock: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 28, borderWidth: 1, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  tab: { alignItems: 'center', paddingVertical: 4, paddingHorizontal: 14, minWidth: 64 },
  iconWrap: { position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  label: { fontSize: 10, fontWeight: '800', marginTop: 2, letterSpacing: 0.3 },
});
