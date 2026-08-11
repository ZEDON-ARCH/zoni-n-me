import * as Crypto from 'expo-crypto';

export const randomKey = (bytes = 32): string => {
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) arr[i] = Math.floor(Math.random() * 256);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const hashPin = async (pin: string, salt: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${pin}:${salt}`
  );
};

export const verifyPin = async (pin: string, salt: string, hash: string): Promise<boolean> => {
  return (await hashPin(pin, salt)) === hash;
};

export const timeAgo = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const clockTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const callTime = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (days === 0) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const durFmt = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

// Lightweight country code registry - just for display/validation formatting
export const COUNTRY_CODES = [
  { code: '+1', label: 'US/Canada', flag: '🇺🇸', len: 10 },
  { code: '+44', label: 'UK', flag: '🇬🇧', len: 10 },
  { code: '+91', label: 'India', flag: '🇮🇳', len: 10 },
  { code: '+86', label: 'China', flag: '🇨🇳', len: 11 },
  { code: '+81', label: 'Japan', flag: '🇯🇵', len: 10 },
  { code: '+82', label: 'South Korea', flag: '🇰🇷', len: 10 },
  { code: '+49', label: 'Germany', flag: '🇩🇪', len: 10 },
  { code: '+33', label: 'France', flag: '🇫🇷', len: 9 },
  { code: '+34', label: 'Spain', flag: '🇪🇸', len: 9 },
  { code: '+39', label: 'Italy', flag: '🇮🇹', len: 10 },
  { code: '+55', label: 'Brazil', flag: '🇧🇷', len: 11 },
  { code: '+52', label: 'Mexico', flag: '🇲🇽', len: 10 },
  { code: '+61', label: 'Australia', flag: '🇦🇺', len: 9 },
  { code: '+64', label: 'New Zealand', flag: '🇳🇿', len: 9 },
  { code: '+27', label: 'South Africa', flag: '🇿🇦', len: 9 },
  { code: '+20', label: 'Egypt', flag: '🇪🇬', len: 10 },
  { code: '+234', label: 'Nigeria', flag: '🇳🇬', len: 10 },
  { code: '+254', label: 'Kenya', flag: '🇰🇪', len: 9 },
  { code: '+971', label: 'UAE', flag: '🇦🇪', len: 9 },
  { code: '+966', label: 'Saudi Arabia', flag: '🇸🇦', len: 9 },
];

export const formatPhone = (raw: string): { formatted: string; valid: boolean; country?: typeof COUNTRY_CODES[number] } => {
  const digits = raw.replace(/[^\d+]/g, '');
  if (!digits.startsWith('+')) {
    // try to match bare digits
    const found = COUNTRY_CODES.find((c) => digits.length >= c.len + 1 && digits.startsWith('1') && c.code === '+1');
    if (found) {
      const rest = digits.slice(1);
      if (rest.length === found.len) {
        return { formatted: `${found.code} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`, valid: true, country: found };
      }
    }
    return { formatted: digits, valid: digits.replace(/\D/g, '').length >= 7 };
  }
  for (const c of COUNTRY_CODES) {
    if (digits.startsWith(c.code)) {
      const rest = digits.slice(c.code.length);
      if (rest.length === c.len) {
        const a = rest.slice(0, 3), b = rest.slice(3, 6), d = rest.slice(6);
        return { formatted: `${c.code} (${a}) ${b}-${d}`, valid: true, country: c };
      }
      if (rest.length >= 7) {
        return { formatted: digits, valid: false, country: c };
      }
    }
  }
  return { formatted: digits, valid: digits.replace(/\D/g, '').length >= 8 };
};
