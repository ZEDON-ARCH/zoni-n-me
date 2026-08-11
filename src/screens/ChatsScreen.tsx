import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Avatar } from '../components/Avatar';
import { SearchIcon, AddCircleIcon, PinFilledIcon, PinIcon, MicIcon, ImageIcon, ChevronRight } from '../icons';
import { timeAgo } from '../utils';
import { Chat } from '../types';

interface Props {
  onOpenChat: (chat: Chat) => void;
  onOpenProfile: () => void;
  onOpenNewChat: () => void;
}

// 8 distinct solid avatar colors - rotated by contact id
const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#06B6D4', '#EF4444', '#F59E0B'];
const colorFor = (id: string) => COLORS[id.charCodeAt(1) % COLORS.length];

export const ChatsScreen: React.FC<Props> = ({ onOpenChat, onOpenProfile, onOpenNewChat }) => {
  const { theme, chats, getContact, profile, markRead, messages, computeVibe } = useStore();
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const list = useMemo(() => {
    return [...chats]
      .filter((c) => c.contactId && !!getContact(c.contactId))
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      });
  }, [chats, getContact]);

  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((c) => {
      if (c.lastMessage.toLowerCase().includes(q)) return true;
      if (c.contactId) {
        const u = getContact(c.contactId);
        if (u && (u.name.toLowerCase().includes(q) || u.phone.includes(q))) return true;
      }
      return false;
    });
  }, [list, query, getContact]);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 600); };
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={onOpenProfile} style={styles.profileBtn}>
            <Avatar name={profile?.name || 'You'} size={40} color={colorFor('me')} />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.brand, { color: theme.text }]}>Chats</Text>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>
              {totalUnread > 0 ? `${totalUnread} unread` : 'all caught up'}
            </Text>
          </View>
          <Pressable
            onPress={onOpenNewChat}
            style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.6 }]}
          >
            <AddCircleIcon size={30} color={theme.primary} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SearchIcon size={18} color={theme.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search chats"
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>Clear</Text>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        renderItem={({ item, index }) => {
          const contact = getContact(item.contactId!);
          if (!contact) return null;
          const showSection = index === 0 || (filtered[index - 1]?.pinned !== item.pinned);
          const sectionTitle = item.pinned && index === 0 ? 'Pinned' : (!item.pinned && (index === 0 || filtered[index - 1]?.pinned)) ? 'All messages' : null;
          const preview = item.draft ? `Draft: ${item.draft}` : item.lastMessage;
          const isDraft = !!item.draft;
          const lastMsg = item.lastMessageType === 'voice' ? 'Voice message' : item.lastMessageType === 'image' ? 'Photo' : preview;
          const chatMsgs = messages[item.id] || [];
          const vibe = computeVibe(item.contactId!);
          const vibeColor = vibe >= 85 ? '#EC4899' : vibe >= 60 ? '#3B82F6' : vibe >= 25 ? '#06B6D4' : '#10B981';

          return (
            <View>
              {showSection && sectionTitle && (
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{sectionTitle.toUpperCase()}</Text>
                </View>
              )}
              <Pressable
                onPress={() => { markRead(item.id); onOpenChat(item); }}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.surfaceMuted }]}
              >
                <View style={{ position: 'relative' }}>
                  <Avatar name={contact.name} size={54} online={contact.online} color={colorFor(contact.id)} />
                  {vibe > 0 && (
                    <View style={[styles.vibeBadge, { backgroundColor: vibeColor, borderColor: theme.bg }]}>
                      <Text style={styles.vibeBadgeText}>{vibe}</Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={styles.topRow}>
                    <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                      {contact.name}
                    </Text>
                    <Text style={[styles.time, { color: item.unread > 0 ? theme.primary : theme.textMuted }]}>
                      {timeAgo(item.lastMessageAt)}
                    </Text>
                  </View>
                  <View style={styles.bottomRow}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      {item.lastMessageType === 'voice' ? <MicIcon size={13} color={theme.textMuted} /> :
                        item.lastMessageType === 'image' ? <ImageIcon size={13} color={theme.textMuted} /> : null}
                      {item.typing ? (
                        <Text style={[styles.preview, { color: theme.primary, fontStyle: 'italic' }]}>typing…</Text>
                      ) : chatMsgs.length === 0 ? (
                        <Text style={[styles.preview, { color: theme.textMuted, fontStyle: 'italic' }]}>Tap to start chatting</Text>
                      ) : (
                        <Text
                          style={[
                            styles.preview,
                            { color: isDraft ? theme.danger : theme.textSecondary },
                            isDraft && { fontStyle: 'italic' },
                          ]}
                          numberOfLines={1}
                        >
                          {lastMsg}
                        </Text>
                      )}
                    </View>
                    {item.unread > 0 ? (
                      <View style={[styles.unreadDot, { backgroundColor: theme.primary }]}>
                        <Text style={styles.unreadText}>{item.unread > 99 ? '99+' : item.unread}</Text>
                      </View>
                    ) : item.pinned ? (
                      <PinFilledIcon size={11} color={theme.textMuted} />
                    ) : null}
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No chats yet</Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>Tap + to start a new conversation.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  profileBtn: { padding: 2 },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  brandSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  newBtn: { padding: 4 },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  search: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 42, borderRadius: 21, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  name: { fontSize: 15, fontWeight: '700', flex: 1, letterSpacing: -0.1 },
  time: { fontSize: 11, fontWeight: '600', marginLeft: 6 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preview: { fontSize: 13, fontWeight: '500', flex: 1 },
  unreadDot: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  vibeBadge: { position: 'absolute', bottom: -2, right: -4, minWidth: 22, height: 16, borderRadius: 8, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  vibeBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 6 },
  emptyText: { fontSize: 15, fontWeight: '700' },
  emptySub: { fontSize: 12, fontWeight: '500' },
});
