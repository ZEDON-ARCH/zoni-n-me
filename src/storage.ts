import AsyncStorage from '@react-native-async-storage/async-storage';

export const K = {
  PROFILE: '@ynm:profile',
  CHATS: '@ynm:chats',
  MESSAGES: '@ynm:messages',
  MOMENTS: '@ynm:moments',
  CALLS: '@ynm:calls',
  BLOCKED: '@ynm:blocked',
  REPORTS: '@ynm:reports',
  THEME: '@ynm:theme',
  SEEN: '@ynm:seen-moments',
};

export const storage = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch { return null; }
  },
  set: async <T>(key: string, value: T): Promise<void> => {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove: async (key: string): Promise<void> => {
    try { await AsyncStorage.removeItem(key); } catch {}
  },
  clearAll: async (): Promise<void> => {
    try { await AsyncStorage.multiRemove(Object.values(K)); } catch {}
  },
};
