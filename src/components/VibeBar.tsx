import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useStore } from '../store';

interface VibeBarProps {
  score: number;
  small?: boolean;
  showLabel?: boolean;
}

export const VibeBar: React.FC<VibeBarProps> = ({ score, small, showLabel = true }) => {
  const { theme } = useStore();
  const fillAnim = useRef(new Animated.Value(0)).current;
  const level: 0 | 1 | 2 | 3 = score < 25 ? 0 : score < 60 ? 1 : score < 85 ? 2 : 3;
  const label = ['new', 'warming', 'close', 'unbreakable'][level];
  // solid colors, no gradient
  const color = level === 3 ? '#EC4899' : level === 2 ? '#3B82F6' : level === 1 ? '#06B6D4' : '#10B981';

  useEffect(() => {
    Animated.timing(fillAnim, { toValue: score / 100, duration: 600, useNativeDriver: false }).start();
  }, [score]);

  const widthInterpolated = fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={{ width: '100%' }}>
      {showLabel && (
        <Text style={{ fontSize: 10, fontWeight: '800', color: theme.textMuted, marginBottom: 4, letterSpacing: 0.4 }}>
          {label} · {score}
        </Text>
      )}
      <View style={{ height: small ? 4 : 5, borderRadius: small ? 2 : 3, backgroundColor: theme.surfaceMuted, overflow: 'hidden' }}>
        <Animated.View style={{ width: widthInterpolated, height: '100%', backgroundColor: color }} />
      </View>
    </View>
  );
};
