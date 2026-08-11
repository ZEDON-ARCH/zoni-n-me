import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, ActivityIndicator } from 'react-native';
import { useStore } from '../store';
import { LogoMark } from '../icons';

interface AvatarProps {
  name: string;
  size?: number;
  online?: boolean;
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 48, online, color = '#3B82F6' }) => {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const dotSize = Math.max(8, size * 0.22);
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ]}
      >
        <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initials}</Text>
      </View>
      {online && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: '#22C55E',
            borderWidth: 2.5,
            borderColor: '#FFFFFF',
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#fff', fontWeight: '800' },
});

interface LoadingScreenProps {
  onReady: () => void;
  theme: any;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onReady, theme }) => {
  useEffect(() => {
    // Fire onReady as soon as we mount - no animation, no delay
    const t = setTimeout(onReady, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }]}>
      <LogoMark size={72} primary={theme.primary} accent={theme.accent} />
      <Text style={{ marginTop: 18, fontSize: 22, fontWeight: '800', color: theme.text, letterSpacing: -0.3 }}>you 'n me</Text>
    </View>
  );
};
