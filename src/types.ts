export interface Profile {
  id: string;
  name: string;
  phone: string;
  bio: string;
  createdAt: string;
  pinHash: string;
  pinSalt: string;
  language: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  online: boolean;
  lastSeen?: string;
  bio?: string;
  vibe: number; // 0-100, computed from message frequency
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'voice' | 'image';
  text?: string;
  duration?: number;
  imageColor?: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: string;
  reactions?: string[];
}

export interface Chat {
  id: string;
  contactId: string;
  pinned: boolean;
  muted: boolean;
  unread: number;
  typing: boolean;
  lastMessage: string;
  lastMessageType: 'text' | 'voice' | 'image' | 'system';
  lastMessageAt: string;
  draft?: string;
}

export interface Moment {
  id: string;
  contactId: string;
  background: string[];
  text: string;
  createdAt: string;
  seen: boolean;
  reactions: number;
}

export interface Call {
  id: string;
  contactId: string;
  type: 'incoming' | 'outgoing' | 'missed';
  mode: 'voice' | 'video';
  time: string;
  duration?: number;
}

export interface Report {
  id: string;
  targetId: string;
  targetName: string;
  reason: string;
  note?: string;
  createdAt: string;
}
