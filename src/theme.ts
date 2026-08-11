// Solid bright calm cool colors - no gradients
export const lightTheme = {
  bg: '#F2F4F8',
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#E8ECF1',
  surfaceHover: '#DEE3EB',
  border: '#D5DAE2',
  divider: '#E8ECF1',
  text: '#0F1419',
  textSecondary: '#4A5568',
  textMuted: '#8A94A3',
  textInverse: '#FFFFFF',
  shadow: 'rgba(15, 20, 25, 0.08)',
  shadowStrong: 'rgba(15, 20, 25, 0.16)',
  overlay: 'rgba(15, 20, 25, 0.55)',
  // vibrant solid colors
  primary: '#3B82F6',         // bright blue
  primaryHover: '#2563EB',
  primarySoft: '#DBEAFE',
  accent: '#8B5CF6',          // purple
  success: '#10B981',         // emerald
  successSoft: '#D1FAE5',
  warning: '#F59E0B',         // amber
  danger: '#EF4444',          // red
  dangerSoft: '#FEE2E2',
  info: '#06B6D4',            // cyan
  online: '#22C55E',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6',
  orange: '#FB923C',
  incoming: '#FFFFFF',
  outgoing: '#3B82F6',
  onlineBubble: '#22C55E',
  modalBg: '#FFFFFF',
  inputBg: '#F2F4F8',
  glass: 'rgba(255, 255, 255, 0.85)',
};

export const darkTheme = {
  bg: '#0A0E14',
  bgElevated: '#151B23',
  surface: '#151B23',
  surfaceMuted: '#1F2630',
  surfaceHover: '#2A323D',
  border: '#2A323D',
  divider: '#1F2630',
  text: '#F7F9FC',
  textSecondary: '#A8B3C1',
  textMuted: '#6B7585',
  textInverse: '#0F1419',
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowStrong: 'rgba(0, 0, 0, 0.7)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  primary: '#60A5FA',
  primaryHover: '#3B82F6',
  primarySoft: '#1E3A8A',
  accent: '#A78BFA',
  success: '#34D399',
  successSoft: '#064E3B',
  warning: '#FBBF24',
  danger: '#F87171',
  dangerSoft: '#7F1D1D',
  info: '#22D3EE',
  online: '#4ADE80',
  pink: '#F472B6',
  indigo: '#818CF8',
  teal: '#2DD4BF',
  orange: '#FB923C',
  incoming: '#1F2630',
  outgoing: '#3B82F6',
  onlineBubble: '#4ADE80',
  modalBg: '#151B23',
  inputBg: '#1F2630',
  glass: 'rgba(21, 27, 35, 0.85)',
};

export type Theme = typeof lightTheme;
