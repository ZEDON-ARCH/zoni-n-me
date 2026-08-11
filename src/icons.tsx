import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface P { size?: number; color?: string; strokeWidth?: number; filled?: boolean; }

const I = (size: number, color: string, sw: number) => ({
  width: size, height: size, viewBox: '0 0 24 24',
  fill: 'none' as const, stroke: color, strokeWidth: sw,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

export const ChatIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <Path d="M8 12h.01M12 12h.01M16 12h.01" />
  </Svg>
);

export const ChatFilledIcon: React.FC<P> = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

export const PlanetIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M3 12c4 2 14 2 18 0" />
    <Path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Svg>
);

export const PlanetFilledIcon: React.FC<P> = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" fill={color} />
    <Path d="M3 12c4 2 14 2 18 0" stroke="#fff" strokeWidth="1.5" />
    <Path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="#fff" strokeWidth="1.5" />
  </Svg>
);

export const PhoneIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    <Path d="M14.5 6.5l1 1M17 4l1 1M19 9l-1-1" />
  </Svg>
);

export const PhoneFilledIcon: React.FC<P> = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const UserIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const UserFilledIcon: React.FC<P> = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="7" r="4" fill={color} />
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const PlusIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2.5 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

export const CloseIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export const BackIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2.5 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);

export const SearchIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="11" cy="11" r="7" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
    <Path d="M11 8v6M8 11h6" />
  </Svg>
);

export const CheckIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2.5 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export const CheckDoubleIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="18 6 9 17 4 12" />
    <Polyline points="20 12 14 18 11 15" />
  </Svg>
);

export const SendIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2, filled }) => (
  <Svg {...I(size, color, strokeWidth)} fill={filled ? color : 'none'}>
    <Path d="M22 2L11 13" />
    <Polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Svg>
);

export const MicIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Line x1="12" y1="19" x2="12" y2="23" />
    <Line x1="8" y1="23" x2="16" y2="23" />
    <Path d="M9 9l-1-1M15 9l1-1" />
  </Svg>
);

export const ImageIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" />
    <Polyline points="21 15 16 10 5 21" />
    <Path d="M14 14l-3 3" />
  </Svg>
);

export const SmileIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <Line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
    <Line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
  </Svg>
);

export const LockIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2, filled }) => (
  <Svg {...I(size, color, strokeWidth)} fill={filled ? color : 'none'}>
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <Circle cx="12" cy="16" r="1.5" fill={filled ? '#fff' : color} />
  </Svg>
);

export const LockFilledIcon: React.FC<P> = ({ size = 24, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill={color} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="12" cy="16" r="1.5" fill="#fff" />
  </Svg>
);

export const MoreIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="5" r="1" fill={color} />
    <Circle cx="12" cy="12" r="1" fill={color} />
    <Circle cx="12" cy="19" r="1" fill={color} />
  </Svg>
);

export const PinIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2, filled }) => (
  <Svg {...I(size, color, strokeWidth)} fill={filled ? color : 'none'}>
    <Line x1="12" y1="17" x2="12" y2="22" />
    <Path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z" />
  </Svg>
);

export const VideoIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    <Path d="M5 9h2M5 13h2M5 17h2" />
  </Svg>
);

export const SettingsIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
  </Svg>
);

export const BlockIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="2.5" />
  </Svg>
);

export const FlagIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <Line x1="4" y1="22" x2="4" y2="15" />
  </Svg>
);

export const TrashIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

export const ShareIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Svg>
);

export const SunIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="5" />
    <Line x1="12" y1="1" x2="12" y2="3" />
    <Line x1="12" y1="21" x2="12" y2="23" />
    <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <Line x1="1" y1="12" x2="3" y2="12" />
    <Line x1="21" y1="12" x2="23" y2="12" />
    <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Svg>
);

export const MoonIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

export const LogoutIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

export const HeartIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2, filled }) => (
  <Svg {...I(size, color, strokeWidth)} fill={filled ? color : 'none'}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <Path d="M3.5 12.5l3 3M17 5l-3 3" stroke={filled ? '#fff' : color} />
  </Svg>
);

export const KeyIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </Svg>
);

export const ShieldIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Polyline points="9 12 11 14 15 10" />
  </Svg>
);

export const StarIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2, filled }) => (
  <Svg {...I(size, color, strokeWidth)} fill={filled ? color : 'none'}>
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

export const InfoIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="16" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5" />
  </Svg>
);

export const LocationIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

export const CameraIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

export const QuestionIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
  </Svg>
);

export const BellIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const EyeIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

export const PencilIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </Svg>
);

export const ArrowDownLeft: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2.5 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Line x1="17" y1="7" x2="7" y2="17" />
    <Polyline points="17 17 7 17 7 7" />
  </Svg>
);

export const ArrowUpRight: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2.5 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Line x1="7" y1="17" x2="17" y2="7" />
    <Polyline points="7 7 17 7 17 17" />
  </Svg>
);

export const ChevronRight: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

export const ChevronDown: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

export const ChevronUp: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polyline points="18 15 12 9 6 15" />
  </Svg>
);

export const AddCircleIcon: React.FC<P> = ({ size = 24, color = '#0F1419' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </Svg>
);

export const SparklesIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <Path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    <Path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
  </Svg>
);

export const FilterIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </Svg>
);

export const GlobeIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

export const PeopleIcon: React.FC<P> = ({ size = 24, color = '#0F1419', strokeWidth = 2 }) => (
  <Svg {...I(size, color, strokeWidth)}>
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const LogoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12c0 1.96.57 3.78 1.55 5.31L2 22l4.69-1.55A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </Svg>
);

export const LogoMark: React.FC<{ size?: number; primary?: string; accent?: string }> = ({ size = 96, primary = '#3B82F6', accent = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={primary} />
        <Stop offset="1" stopColor={accent} />
      </LinearGradient>
    </Defs>
    <Path
      d="M 30 38 Q 30 30 38 30 L 62 30 Q 70 30 70 38 L 70 52 Q 70 60 62 60 L 44 60 L 32 70 L 36 60 Q 30 60 30 52 Z"
      fill="url(#grad1)"
    />
    <Circle cx="42" cy="44" r="3.5" fill="#fff" />
    <Circle cx="58" cy="44" r="3.5" fill="#fff" />
    <Path d="M 38 50 Q 42 54 46 50" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M 54 50 Q 58 54 62 50" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
  </Svg>
);
