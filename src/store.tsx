import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { K, storage } from './storage';
import { lightTheme, darkTheme, Theme } from './theme';
import { Profile, Contact, Chat, Message, Moment, Call, Report } from './types';
import { SEED_CONTACTS, SEED_CHATS, SEED_MESSAGES, SEED_MOMENTS, SEED_CALLS } from './data';
import { hashPin, verifyPin, randomKey } from './utils';

interface StoreValue {
  hydrated: boolean;
  themeMode: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  setThemeMode: (m: 'light' | 'dark' | 'system') => void;
  theme: Theme;
  profile: Profile | null;
  signup: (name: string, phone: string, pin: string) => Promise<void>;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (u: Partial<Profile>) => Promise<void>;
  contacts: Contact[];
  getContact: (id: string) => Contact | undefined;
  chats: Chat[];
  messages: Record<string, Message[]>;
  moments: Moment[];
  calls: Call[];
  blocked: string[];
  reports: Report[];
  sendMessage: (chatId: string, partial: Partial<Message>) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  reactMessage: (chatId: string, messageId: string, emoji: string) => void;
  pinChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  clearChat: (chatId: string) => void;
  startDirectChat: (contactId: string) => Chat;
  blockUser: (contactId: string) => void;
  unblockUser: (contactId: string) => void;
  reportUser: (contactId: string, name: string, reason: string, note?: string) => void;
  markRead: (chatId: string) => void;
  seenMoment: (id: string) => void;
  createStory: (contactId: string, text: string, background: string[]) => void;
  computeVibe: (contactId: string) => number;
  computeStreak: (contactId: string) => number;
}

const Ctx = createContext<StoreValue | null>(null);

// computeVibe: simple formula from real activity
//  - each sent message = +1 point (capped at 60)
//  - each day with activity (last 30) = +1 point (capped at 30)
//  - last-message recency = +10 if today, +5 if yesterday
const computeVibe = (messages: Message[], contactId: string): number => {
  if (contactId === 'me') return 0;
  const now = Date.now();
  const dayMs = 86400000;
  let score = 0;
  let sentToThem = 0;
  const days = new Set<string>();
  messages.forEach((m) => {
    if (m.senderId === 'me' || m.senderId === contactId) {
      sentToThem += 1;
      const d = new Date(m.createdAt);
      const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      days.add(dayKey);
    }
  });
  score += Math.min(sentToThem, 60);
  // last 30 days
  const recentDays = Array.from(days).filter((d) => {
    const [y, m, dd] = d.split('-').map(Number);
    return now - new Date(y, m, dd).getTime() < 30 * dayMs;
  });
  score += Math.min(recentDays.length, 30);
  // recency
  const last = messages[messages.length - 1];
  if (last) {
    const ageMs = now - new Date(last.createdAt).getTime();
    if (ageMs < dayMs) score += 10;
    else if (ageMs < 2 * dayMs) score += 5;
  }
  return Math.min(100, score);
};

const computeStreak = (messages: Message[]): number => {
  if (messages.length === 0) return 0;
  const dayMs = 86400000;
  const days = new Set<string>();
  messages.forEach((m) => {
    const d = new Date(m.createdAt);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  });
  const sortedDays = Array.from(days)
    .map((d) => {
      const [y, m, dd] = d.split('-').map(Number);
      return new Date(y, m, dd).getTime();
    })
    .sort((a, b) => b - a);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let cursor = today.getTime();
  for (const d of sortedDays) {
    if (d === cursor) {
      streak += 1;
      cursor -= dayMs;
    } else if (d === cursor + dayMs) {
      // gap allowed
    } else {
      break;
    }
  }
  return streak;
};

const buildPreviewFromMessages = (list: Message[]): { text: string; type: Chat['lastMessageType'] } => {
  if (list.length === 0) return { text: '', type: 'text' };
  const last = list[list.length - 1];
  if (last.type === 'text') return { text: last.text || '', type: 'text' };
  if (last.type === 'image') return { text: 'Photo', type: 'image' };
  if (last.type === 'voice') return { text: 'Voice message', type: 'voice' };
  return { text: 'Message', type: 'text' };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sys = useColorScheme();
  const [hydrated, setHydrated] = useState(false);
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('system');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chats, setChats] = useState<Chat[]>(SEED_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(SEED_MESSAGES);
  const [moments, setMoments] = useState<Moment[]>(SEED_MOMENTS);
  const [calls] = useState<Call[]>(SEED_CALLS);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    (async () => {
      const [p, c, m, mo, b, r, t] = await Promise.all([
        storage.get<Profile>(K.PROFILE),
        storage.get<Chat[]>(K.CHATS),
        storage.get<Record<string, Message[]>>(K.MESSAGES),
        storage.get<Moment[]>(K.MOMENTS),
        storage.get<string[]>(K.BLOCKED),
        storage.get<Report[]>(K.REPORTS),
        storage.get<'light' | 'dark' | 'system'>(K.THEME),
      ]);
      if (p) setProfile(p);
      if (c) setChats(c);
      if (m) setMessages(m);
      if (mo) setMoments(mo);
      if (b) setBlocked(b);
      if (r) setReports(r);
      if (t) setThemeModeState(t);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => { if (hydrated) storage.set(K.PROFILE, profile); }, [profile, hydrated]);
  useEffect(() => { if (hydrated) storage.set(K.CHATS, chats); }, [chats, hydrated]);
  useEffect(() => { if (hydrated) storage.set(K.MESSAGES, messages); }, [messages, hydrated]);
  useEffect(() => { if (hydrated) storage.set(K.MOMENTS, moments); }, [moments, hydrated]);
  useEffect(() => { if (hydrated) storage.set(K.BLOCKED, blocked); }, [blocked, hydrated]);
  useEffect(() => { if (hydrated) storage.set(K.REPORTS, reports); }, [reports, hydrated]);
  useEffect(() => { if (hydrated) storage.set(K.THEME, themeMode); }, [themeMode, hydrated]);

  const effectiveTheme: 'light' | 'dark' = themeMode === 'system' ? (sys === 'dark' ? 'dark' : 'light') : themeMode;
  const theme = effectiveTheme === 'dark' ? darkTheme : lightTheme;
  const setThemeMode = useCallback((m: 'light' | 'dark' | 'system') => setThemeModeState(m), []);

  const signup = useCallback(async (name: string, phone: string, pin: string) => {
    const salt = randomKey(8);
    const pinHash = await hashPin(pin, salt);
    const newProfile: Profile = {
      id: 'me', name, phone, bio: '', createdAt: new Date().toISOString(),
      pinSalt: salt, pinHash, language: 'en',
    };
    setProfile(newProfile);
  }, []);

  const login = useCallback(async (phone: string, pin: string): Promise<boolean> => {
    if (!profile) return false;
    if (profile.phone !== phone) return false;
    return verifyPin(pin, profile.pinSalt, profile.pinHash);
  }, [profile]);

  const logout = useCallback(async () => {
    setProfile(null);
    await storage.remove(K.PROFILE);
  }, []);

  const deleteAccount = useCallback(async () => {
    await storage.clearAll();
    setProfile(null);
    setChats(SEED_CHATS);
    setMessages(SEED_MESSAGES);
    setMoments(SEED_MOMENTS);
    setBlocked([]);
    setReports([]);
  }, []);

  const updateProfile = useCallback(async (u: Partial<Profile>) => {
    setProfile((p) => (p ? { ...p, ...u } : p));
  }, []);

  const getContact = useCallback((id: string) => SEED_CONTACTS.find((c) => c.id === id), []);

  const sendMessage = useCallback((chatId: string, partial: Partial<Message>) => {
    const msg: Message = {
      id: 'm' + Date.now() + Math.random().toString(36).slice(2, 6),
      chatId,
      senderId: partial.senderId || 'me',
      type: partial.type || 'text',
      text: partial.text,
      duration: partial.duration,
      imageColor: partial.imageColor,
      status: 'sending',
      createdAt: new Date().toISOString(),
      ...partial,
    };
    setMessages((prev) => {
      const list = [...(prev[chatId] || []), msg];
      // also update chat preview
      const preview = buildPreviewFromMessages(list);
      setChats((p) => p.map((c) => c.id === chatId ? {
        ...c,
        lastMessage: preview.text,
        lastMessageType: preview.type,
        lastMessageAt: msg.createdAt,
        draft: undefined,
      } : c));
      return { ...prev, [chatId]: list };
    });
    // status progression
    setTimeout(() => setMessages((prev) => ({ ...prev, [chatId]: (prev[chatId] || []).map((m) => m.id === msg.id ? { ...m, status: 'sent' } : m) })), 500);
    setTimeout(() => setMessages((prev) => ({ ...prev, [chatId]: (prev[chatId] || []).map((m) => m.id === msg.id ? { ...m, status: 'delivered' } : m) })), 1300);
    setTimeout(() => setMessages((prev) => ({ ...prev, [chatId]: (prev[chatId] || []).map((m) => m.id === msg.id ? { ...m, status: 'read' } : m) })), 2400);
  }, []);

  const deleteMessage = useCallback((chatId: string, messageId: string) => {
    setMessages((prev) => {
      const list = (prev[chatId] || []).filter((m) => m.id !== messageId);
      const preview = buildPreviewFromMessages(list);
      setChats((p) => p.map((c) => c.id === chatId ? {
        ...c, lastMessage: preview.text, lastMessageType: preview.type, lastMessageAt: list.length > 0 ? list[list.length - 1].createdAt : new Date().toISOString()
      } : c));
      return { ...prev, [chatId]: list };
    });
  }, []);

  const reactMessage = useCallback((chatId: string, messageId: string, emoji: string) => {
    setMessages((prev) => {
      const list = prev[chatId] || [];
      return { ...prev, [chatId]: list.map((m) => {
        if (m.id !== messageId) return m;
        const reactions = m.reactions || [];
        return { ...m, reactions: reactions.includes(emoji) ? reactions.filter((e) => e !== emoji) : [...reactions, emoji] };
      }) };
    });
  }, []);

  const pinChat = useCallback((chatId: string) => setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, pinned: !c.pinned } : c)), []);
  const muteChat = useCallback((chatId: string) => setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, muted: !c.muted } : c)), []);
  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setMessages((prev) => { const n = { ...prev }; delete n[chatId]; return n; });
  }, []);
  const clearChat = useCallback((chatId: string) => {
    setMessages((prev) => ({ ...prev, [chatId]: [] }));
    setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, lastMessage: '', lastMessageAt: new Date().toISOString() } : c));
  }, []);

  const startDirectChat = useCallback((contactId: string): Chat => {
    const existing = chats.find((c) => c.contactId === contactId);
    if (existing) return existing;
    const contact = SEED_CONTACTS.find((c) => c.id === contactId);
    if (!contact) throw new Error('contact not found');
    const newChat: Chat = { id: 'c' + Date.now(), contactId, pinned: false, muted: false, unread: 0, lastMessage: '', lastMessageType: 'text', lastMessageAt: new Date().toISOString() };
    setChats((prev) => [newChat, ...prev]);
    return newChat;
  }, [chats]);

  const blockUser = useCallback((contactId: string) => {
    setBlocked((prev) => prev.includes(contactId) ? prev : [...prev, contactId]);
    setChats((prev) => prev.filter((c) => c.contactId !== contactId));
    setMessages((prev) => {
      const n = { ...prev };
      Object.keys(n).forEach((k) => {
        const c = chats.find((x) => x.id === k);
        if (c?.contactId === contactId) delete n[k];
      });
      return n;
    });
  }, [chats]);
  const unblockUser = useCallback((contactId: string) => setBlocked((prev) => prev.filter((id) => id !== contactId)), []);
  const reportUser = useCallback((contactId: string, name: string, reason: string, note?: string) => {
    setReports((prev) => [{ id: 'r' + Date.now(), targetId: contactId, targetName: name, reason, note, createdAt: new Date().toISOString() }, ...prev]);
  }, []);
  const markRead = useCallback((chatId: string) => {
    setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, unread: 0 } : c));
    setMessages((prev) => ({ ...prev, [chatId]: (prev[chatId] || []).map((m) => m.senderId !== 'me' && m.status !== 'read' ? { ...m, status: 'read' } : m) }));
  }, []);

  const seenMoment = useCallback((id: string) => setMoments((prev) => prev.map((m) => m.id === id ? { ...m, seen: true } : m)), []);
  const createStory = useCallback((contactId: string, text: string, background: string[]) => {
    setMoments((prev) => [{ id: 'mo' + Date.now(), contactId, text, background, createdAt: new Date().toISOString(), seen: true, reactions: 0 }, ...prev]);
  }, []);

  // memoize vibe and streak for current messages
  const computeVibeExternal = useCallback((contactId: string) => {
    // find the chat for this contact, get messages
    const chat = chats.find((c) => c.contactId === contactId);
    if (!chat) return 50;
    return computeVibe(messages[chat.id] || [], contactId);
  }, [chats, messages]);

  const computeStreakExternal = useCallback((contactId: string) => {
    const chat = chats.find((c) => c.contactId === contactId);
    if (!chat) return 0;
    return computeStreak(messages[chat.id] || []);
  }, [chats, messages]);

  const value: StoreValue = useMemo(() => ({
    hydrated, themeMode, effectiveTheme, setThemeMode, theme,
    profile, signup, login, logout, deleteAccount, updateProfile,
    contacts: SEED_CONTACTS, getContact,
    chats, messages, moments, calls, blocked, reports,
    sendMessage, deleteMessage, reactMessage, pinChat, muteChat, deleteChat, clearChat,
    startDirectChat, blockUser, unblockUser, reportUser, markRead, seenMoment, createStory,
    computeVibe: computeVibeExternal, computeStreak: computeStreakExternal,
  }), [hydrated, themeMode, effectiveTheme, setThemeMode, theme, profile, signup, login, logout, deleteAccount, updateProfile, getContact, chats, messages, moments, calls, blocked, reports, sendMessage, deleteMessage, reactMessage, pinChat, muteChat, deleteChat, clearChat, startDirectChat, blockUser, unblockUser, reportUser, markRead, seenMoment, createStory, computeVibeExternal, computeStreakExternal]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used within StoreProvider');
  return v;
};
