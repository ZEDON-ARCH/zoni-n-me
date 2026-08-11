import { Contact, Chat, Message, Moment, Call, ChatRoom, DiscoveryPost, WalletTransaction, FAQ } from './types';
import { agoIso } from './utils';

export const POKIE_ANIMALS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🦄', '🐙', '🦋', '🐺', '🦉', '🐢', '🦜', '🐝', '🦔', '🐰', '🐬'];

export const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Aria Mitchell', nickname: 'aria', pokieName: 'sunset-aria', phone: '+1 555 0142', emoji: '🌸', gradient: ['#FB7185', '#FBBF24'], online: true, verified: true, bio: 'sunset chaser', vibe: 92, streak: 14, pokiesEnabled: true },
  { id: 'c2', name: 'Kai Nakamura', nickname: 'kai', pokieName: 'kai-waves', phone: '+1 555 0188', emoji: '🌊', gradient: ['#22D3EE', '#8B5CF6'], online: true, bio: 'building the future', vibe: 78, streak: 7, pokiesEnabled: true },
  { id: 'c3', name: 'Mom', nickname: 'mama', pokieName: 'mama-bear', phone: '+1 555 0011', emoji: '🌷', gradient: ['#FBBF24', '#FB7185'], online: false, lastSeen: '2h', bio: 'love you forever', vibe: 100, streak: 365, pokiesEnabled: false },
  { id: 'c4', name: 'Jordan Reyes', nickname: 'jordy', pokieName: 'jordy-trail', phone: '+1 555 0177', emoji: '🌿', gradient: ['#84CC16', '#22D3EE'], online: false, lastSeen: '15m', bio: 'wanderer', vibe: 67, streak: 3, pokiesEnabled: true },
  { id: 'c5', name: 'Sienna Park', nickname: 'sienna', pokieName: 'sienna-paint', phone: '+1 555 0203', emoji: '🎨', gradient: ['#EC4899', '#8B5CF6'], online: true, bio: 'painting in pixels', vibe: 81, streak: 21, pokiesEnabled: true },
  { id: 'c6', name: 'Diego Santos', nickname: 'diego', pokieName: 'diego-chef', phone: '+1 555 0299', emoji: '🌮', gradient: ['#FB7185', '#FBBF24'], online: false, lastSeen: '1h', bio: 'chef mode', vibe: 55, streak: 0, pokiesEnabled: true },
  { id: 'c7', name: 'Luna Kim', nickname: 'luna', pokieName: 'luna-owl', phone: '+1 555 0312', emoji: '🌙', gradient: ['#8B5CF6', '#EC4899'], online: true, bio: 'night owl', vibe: 73, streak: 9, pokiesEnabled: true },
  { id: 'c8', name: 'Maya Chen', nickname: 'maya', pokieName: 'maya-mat', phone: '+1 555 0421', emoji: '🍵', gradient: ['#FBBF24', '#EC4899'], online: false, lastSeen: '3h', bio: 'matcha & flow', vibe: 64, streak: 2, pokiesEnabled: false },
  { id: 'c9', name: 'River Stone', nickname: 'river', pokieName: 'river-beats', phone: '+1 555 0567', emoji: '🎧', gradient: ['#84CC16', '#8B5CF6'], online: true, bio: 'sound is therapy', vibe: 71, streak: 5, pokiesEnabled: true },
  { id: 'c10', name: 'Zoe Patel', nickname: 'zo', pokieName: 'zo-sparkle', phone: '+1 555 0689', emoji: '✨', gradient: ['#FB7185', '#8B5CF6'], online: false, lastSeen: '30m', bio: 'sparkle co.', vibe: 58, streak: 1, pokiesEnabled: true },
  { id: 'c11', name: 'Theo Lin', nickname: 'theo', pokieName: 'theo-builds', phone: '+1 555 0788', emoji: '🛠', gradient: ['#22D3EE', '#8B5CF6'], online: true, bio: 'design × code', vibe: 60, streak: 4, pokiesEnabled: true },
  { id: 'c12', name: 'Nina Brooks', nickname: 'nina', pokieName: 'nina-words', phone: '+1 555 0890', emoji: '📖', gradient: ['#EC4899', '#FBBF24'], online: false, lastSeen: '1d', bio: 'writing the next chapter', vibe: 49, streak: 0, pokiesEnabled: true },
];

export const SEED_ROOMS: ChatRoom[] = [
  { id: 'r1', name: 'The Squad', emoji: '🦋', gradient: ['#EC4899', '#FBBF24'], memberIds: ['c1', 'c2', 'c4', 'c5', 'c7', 'c9', 'c11'], adminIds: ['me', 'c1'], description: 'best friends forever', type: 'mixed', allowAnonymous: false, showUsernames: true, showPhoneNumbers: false, premiumOnly: false, createdAt: agoIso(100000), memberCount: 7 },
  { id: 'r2', name: 'Work Team', emoji: '💼', gradient: ['#22D3EE', '#8B5CF6'], memberIds: ['c2', 'c8', 'c9', 'c10', 'c11', 'c12'], adminIds: ['me'], description: 'product team sync', type: 'text', allowAnonymous: false, showUsernames: true, showPhoneNumbers: false, premiumOnly: false, createdAt: agoIso(200000), memberCount: 6 },
  { id: 'r3', name: 'Confessions', emoji: '🤫', gradient: ['#8B5CF6', '#EC4899'], memberIds: ['c1', 'c2', 'c4', 'c5', 'c6', 'c7'], adminIds: ['me', 'c5'], description: 'drop secrets anonymously', type: 'text', allowAnonymous: true, showUsernames: false, showPhoneNumbers: false, premiumOnly: true, createdAt: agoIso(50000), memberCount: 6 },
  { id: 'r4', name: 'Book Club', emoji: '📚', gradient: ['#FBBF24', '#EC4899'], memberIds: ['c8', 'c10', 'c12'], adminIds: ['c8'], description: 'monthly reads', type: 'mixed', allowAnonymous: false, showUsernames: true, showPhoneNumbers: false, premiumOnly: false, createdAt: agoIso(80000), memberCount: 3 },
  { id: 'r5', name: 'Voice Hang', emoji: '🎙', gradient: ['#22D3EE', '#84CC16'], memberIds: ['c1', 'c5', 'c7', 'c9', 'c11'], adminIds: ['c7'], description: 'drop in for live audio', type: 'voice', allowAnonymous: false, showUsernames: true, showPhoneNumbers: false, premiumOnly: true, createdAt: agoIso(20000), memberCount: 5 },
  { id: 'r6', name: 'Video Watch', emoji: '🎬', gradient: ['#FB7185', '#8B5CF6'], memberIds: ['c1', 'c2', 'c4'], adminIds: ['c2'], description: 'sync watch party', type: 'video', allowAnonymous: false, showUsernames: true, showPhoneNumbers: false, premiumOnly: true, createdAt: agoIso(15000), memberCount: 3 },
];

export const SEED_CHATS: Chat[] = [
  { id: 'chat1', kind: 'direct', contactId: 'c1', pinned: true, muted: false, unread: 2, typing: true, lastMessage: 'that sunset was unreal 🌅', lastMessageType: 'text', lastMessageAt: agoIso(2), streak: 14 },
  { id: 'chat2', kind: 'direct', contactId: 'c2', pinned: true, muted: false, unread: 0, lastMessage: 'Voice message', lastMessageType: 'voice', lastMessageAt: agoIso(8), streak: 7 },
  { id: 'chat3', kind: 'direct', contactId: 'c3', pinned: true, muted: false, unread: 1, lastMessage: 'did you eat lunch?', lastMessageType: 'text', lastMessageAt: agoIso(22), streak: 365 },
  { id: 'room1', kind: 'room', roomId: 'r1', pinned: false, muted: true, unread: 5, lastMessage: 'Sienna: friday plans are LOCKED 🔒', lastMessageType: 'text', lastMessageAt: agoIso(45), streak: 21 },
  { id: 'chat4', kind: 'direct', contactId: 'c4', pinned: false, muted: false, unread: 0, lastMessage: 'you up for that hike saturday?', lastMessageType: 'text', lastMessageAt: agoIso(95), streak: 3, draft: 'yeah definitely' },
  { id: 'chat5', kind: 'direct', contactId: 'c5', pinned: false, muted: false, unread: 0, lastMessage: 'Photo', lastMessageType: 'image', lastMessageAt: agoIso(180), streak: 21 },
  { id: 'room2', kind: 'room', roomId: 'r3', pinned: false, muted: false, unread: 0, lastMessage: 'Anonymous: I have a crush on...', lastMessageType: 'text', lastMessageAt: agoIso(60), streak: 0 },
  { id: 'chat6', kind: 'direct', contactId: 'c7', pinned: false, muted: true, unread: 0, lastMessage: 'moon photos coming soon', lastMessageType: 'text', lastMessageAt: agoIso(720), streak: 9 },
  { id: 'chat7', kind: 'direct', contactId: 'c9', pinned: false, muted: false, unread: 0, lastMessage: 'new track dropping friday', lastMessageType: 'text', lastMessageAt: agoIso(2880), streak: 5 },
  { id: 'chat8', kind: 'direct', contactId: 'c10', pinned: false, muted: false, unread: 0, lastMessage: 'meeting moved to 3pm', lastMessageType: 'text', lastMessageAt: agoIso(4320), streak: 1 },
];

export const SEED_MESSAGES: Record<string, Message[]> = {
  chat1: [
    { id: 'm1', chatId: 'chat1', senderId: 'c1', type: 'text', text: 'how was your day?', createdAt: agoIso(180), status: 'read' },
    { id: 'm2', chatId: 'chat1', senderId: 'me', type: 'text', text: 'kind of long but that meeting went well', createdAt: agoIso(175), status: 'read' },
    { id: 'm3', chatId: 'chat1', senderId: 'c1', type: 'text', text: 'finally! you earned it', createdAt: agoIso(170), status: 'read' },
    { id: 'm4', chatId: 'chat1', senderId: 'me', type: 'image', imageColor: ['#FB7185', '#FBBF24'], text: 'the sunset today', createdAt: agoIso(8), status: 'read' },
    { id: 'm5', chatId: 'chat1', senderId: 'c1', type: 'text', text: 'whoa', createdAt: agoIso(6), status: 'read' },
    { id: 'm6', chatId: 'chat1', senderId: 'c1', type: 'voice', duration: 14, createdAt: agoIso(3), status: 'delivered' },
    { id: 'm7', chatId: 'chat1', senderId: 'c1', type: 'text', text: 'cafe tomorrow morning?', createdAt: agoIso(2), status: 'delivered' },
  ],
  chat2: [
    { id: 'm1', chatId: 'chat2', senderId: 'c2', type: 'text', text: 'reviewed the PR, mostly nits', createdAt: agoIso(120), status: 'read' },
    { id: 'm2', chatId: 'chat2', senderId: 'c2', type: 'voice', duration: 42, createdAt: agoIso(8), status: 'read' },
  ],
  chat3: [
    { id: 'm1', chatId: 'chat3', senderId: 'c3', type: 'text', text: 'good morning sweetie', createdAt: agoIso(360), status: 'read' },
    { id: 'm2', chatId: 'chat3', senderId: 'c3', type: 'text', text: 'did you eat lunch?', createdAt: agoIso(22), status: 'delivered' },
  ],
  room1: [
    { id: 'm1', chatId: 'room1', senderId: 'c4', type: 'text', text: 'who is in for friday night?', createdAt: agoIso(240), status: 'read' },
    { id: 'm2', chatId: 'room1', senderId: 'c5', type: 'text', text: 'friday plans are LOCKED 🔒', createdAt: agoIso(45), status: 'read' },
    { id: 'm3', chatId: 'room1', senderId: 'me', type: 'text', text: 'i am bringing the aux 🎧', createdAt: agoIso(40), status: 'read' },
  ],
  chat4: [{ id: 'm1', chatId: 'chat4', senderId: 'c4', type: 'text', text: 'you up for that hike saturday?', createdAt: agoIso(95), status: 'read' }],
  chat5: [{ id: 'm1', chatId: 'chat5', senderId: 'c5', type: 'image', imageColor: ['#EC4899', '#8B5CF6'], text: 'studio today', createdAt: agoIso(180), status: 'read' }],
  room2: [{ id: 'm1', chatId: 'room2', senderId: 'c5', type: 'text', text: 'Anonymous: I have a crush on someone in this room 👀', createdAt: agoIso(60), status: 'read' }],
  chat6: [{ id: 'm1', chatId: 'chat6', senderId: 'c7', type: 'text', text: 'moon photos coming soon', createdAt: agoIso(720), status: 'read' }],
  chat7: [{ id: 'm1', chatId: 'chat7', senderId: 'c9', type: 'text', text: 'new track dropping friday', createdAt: agoIso(2880), status: 'read' }],
  chat8: [{ id: 'm1', chatId: 'chat8', senderId: 'c10', type: 'text', text: 'meeting moved to 3pm', createdAt: agoIso(4320), status: 'read' }],
};

export const SEED_MOMENTS: Moment[] = [
  { id: 'mo1', contactId: 'c1', type: 'photo', background: ['#FB7185', '#FBBF24'], text: 'golden hour 🌅', createdAt: agoIso(45), seen: false, reactions: 23 },
  { id: 'mo2', contactId: 'c2', type: 'mood', background: ['#22D3EE', '#8B5CF6'], text: 'shipping it 🚀', createdAt: agoIso(120), seen: false, reactions: 47 },
  { id: 'mo3', contactId: 'c5', type: 'photo', background: ['#EC4899', '#8B5CF6'], text: 'studio session', createdAt: agoIso(240), seen: true, reactions: 31 },
  { id: 'mo4', contactId: 'c4', type: 'text', background: ['#84CC16', '#22D3EE'], text: 'mountains > everything', createdAt: agoIso(480), seen: true, reactions: 12 },
  { id: 'mo5', contactId: 'c7', type: 'mood', background: ['#8B5CF6', '#EC4899'], text: '🌙 night vibes', createdAt: agoIso(720), seen: true, reactions: 19 },
  { id: 'mo6', contactId: 'c9', type: 'photo', background: ['#84CC16', '#8B5CF6'], text: 'new track dropping', createdAt: agoIso(1100), seen: true, reactions: 56 },
];

export const SEED_CALLS: Call[] = [
  { id: 'cl1', contactId: 'c1', type: 'incoming', mode: 'video', time: agoIso(17 * 60), duration: 763 },
  { id: 'cl2', contactId: 'c2', type: 'outgoing', mode: 'voice', time: agoIso(28 * 60), duration: 261 },
  { id: 'cl3', contactId: 'c3', type: 'incoming', mode: 'video', time: agoIso(4 * 60), duration: 497 },
  { id: 'cl4', contactId: 'c5', type: 'missed', mode: 'voice', time: agoIso(1440) },
  { id: 'cl5', contactId: 'c4', type: 'outgoing', mode: 'video', time: agoIso(1500), duration: 1389 },
  { id: 'cl6', contactId: 'c1', type: 'outgoing', mode: 'voice', time: agoIso(2880), duration: 128 },
  { id: 'cl7', contactId: 'c7', type: 'missed', mode: 'video', time: agoIso(3000) },
  { id: 'cl8', contactId: 'c9', type: 'incoming', mode: 'voice', time: agoIso(4320), duration: 895 },
];

export const SEED_DISCOVERY: DiscoveryPost[] = [
  { id: 'd1', authorId: 'c5', type: 'photo', background: ['#EC4899', '#8B5CF6'], text: 'new painting drop ✨', caption: 'took me 3 weeks but worth it', createdAt: agoIso(30), likes: 234, comments: 18 },
  { id: 'd2', authorId: 'c9', type: 'text', background: ['#84CC16', '#22D3EE'], text: 'new track out now 🎧', caption: 'link in bio', createdAt: agoIso(120), likes: 891, comments: 47 },
  { id: 'd3', authorId: 'c7', type: 'photo', background: ['#8B5CF6', '#EC4899'], text: 'midnight city', caption: 'brooklyn after dark', createdAt: agoIso(300), likes: 412, comments: 29 },
  { id: 'd4', authorId: 'c4', type: 'text', background: ['#FBBF24', '#FB7185'], text: 'summit reached!', caption: '12 miles, totally worth it 🏔', createdAt: agoIso(600), likes: 156, comments: 12 },
  { id: 'd5', authorId: 'c1', type: 'photo', background: ['#FB7185', '#FBBF24'], text: 'golden hour magic', caption: 'no filter needed', createdAt: agoIso(900), likes: 678, comments: 41 },
  { id: 'd6', authorId: 'c11', type: 'text', background: ['#22D3EE', '#8B5CF6'], text: 'shipped it 🚀', caption: 'three months of work, finally live', createdAt: agoIso(1500), likes: 312, comments: 24 },
];

export const SEED_WALLET: WalletTransaction[] = [
  { id: 'w1', type: 'topup', amount: 50, currency: 'USD', note: 'card top-up', createdAt: agoIso(4320), status: 'completed' },
  { id: 'w2', type: 'send', amount: 12, currency: 'USD', contactId: 'c5', note: 'art print', createdAt: agoIso(2880), status: 'completed' },
  { id: 'w3', type: 'receive', amount: 25, currency: 'USD', contactId: 'c1', note: 'movie ticket', createdAt: agoIso(1440), status: 'completed' },
  { id: 'w4', type: 'send', amount: 8, currency: 'USD', contactId: 'c9', note: 'coffee', createdAt: agoIso(720), status: 'completed' },
];

export const FAQS: FAQ[] = [
  { q: 'How does end-to-end encryption work?', a: 'Every message is locked on your device with a key only you and your recipient have. Not even we can read your messages.', category: 'privacy' },
  { q: 'Can I undo sending a message?', a: 'Long-press any message you sent to delete it for everyone. This only works within 1 hour of sending.', category: 'messaging' },
  { q: 'What is a Pokie?', a: 'A Pokie is your anonymous identity in rooms. When rooms enable anonymous mode, members see you as "Pokie-🦊" instead of your real name.', category: 'pokies' },
  { q: 'How do ChatRooms work?', a: 'ChatRooms are admin-controlled spaces. Admins choose the room type (text, voice, video, mixed, or anonymous) and privacy settings.', category: 'rooms' },
  { q: 'What is the Vibe Score?', a: 'Your Vibe Score shows how close your relationship is. It grows when you chat, react, share moments, and keep streaks alive.', category: 'vibe' },
  { q: 'How do I enable dark mode?', a: 'Open your profile, tap Appearance, and pick Light, Dark, or Auto. Your choice saves automatically.', category: 'settings' },
  { q: 'Can I recover deleted chats?', a: 'Cleared chats are gone forever. Deleted accounts are gone after 30 days. We recommend exporting important chats regularly.', category: 'privacy' },
  { q: 'How do I block someone?', a: 'Open the chat, tap the menu, then Block. You can manage blocked contacts from your profile.', category: 'safety' },
];

export const REPORT_REASONS = [
  'Spam or scam',
  'Harassment',
  'Hate speech',
  'Inappropriate content',
  'Impersonation',
  'Impersonating a pokie',
  'Other',
];

export const QUICK_REACTIONS = ['❤️', '🔥', '😂', '😮', '😢', '👍'];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
];
