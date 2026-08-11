import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Avatar } from '../components/Avatar';
import { CloseIcon, SearchIcon, ChatIcon } from '../icons';
import { Chat } from '../types';

interface Props {
  onClose: () => void;
  onOpenChat: (chat: Chat) => void;
}

const COLOR = ['#5B5BD6', '#F23E5C', '#22D3EE', '#34C759', '#FF9500', '#AF52DE', '#FF2D55', '#5856D6'];
const colorFor = (id: string) => COLOR[id.charCodeAt(1) % COLOR.length];

export const NewChatScreen: React.FC<Props> = ({ onClose, onOpenChat }) => {
  const { theme, contacts, startDirectChat, blocked } = useStore();
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    let l = contacts.filter((c) => !blocked.includes(c.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    }
    return l;
  }, [contacts, query, blocked]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface, borderBottomColor: theme.divider, borderBottomWidth: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}><CloseIcon size={22} color={theme.text} /></Pressable>
          <Text style={[styles.title, { color: theme.text }]}>New chat</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.searchWrap}>
          <View style={[styles.search, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <SearchIcon size={18} color={theme.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search contacts"
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
              autoFocus
            />
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={
          list.filter((c) => c.online).length > 0 ? (
            <View>
              <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ONLINE</Text>
              {list.filter((c) => c.online).map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => onOpenChat(startDirectChat(c.id))}
                  style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.surfaceMuted }]}
                >
                  <Avatar name={c.name} size={48} online color={colorFor(c.id)} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.name, { color: theme.text }]}>{c.name}</Text>
                    <Text style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={1}>{c.phone} · online</Text>
                  </View>
                  <View style={[styles.msgBtn, { backgroundColor: theme.primary }]}>
                    <ChatIcon size={14} color="#fff" />
                  </View>
                </Pressable>
              ))}
              <Text style={[styles.sectionLabel, { color: theme.textMuted, marginTop: 16 }]}>ALL CONTACTS</Text>
            </View>
          ) : (
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>CONTACTS</Text>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpenChat(startDirectChat(item.id))}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.surfaceMuted }]}
          >
            <Avatar name={item.name} size={48} online={item.online} color={colorFor(item.id)} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.phone} · {item.online ? 'online' : item.lastSeen ? `last seen ${item.lastSeen}` : 'offline'}
              </Text>
            </View>
            <View style={[styles.msgBtn, { backgroundColor: theme.surfaceMuted }]}>
              <ChatIcon size={14} color={theme.primary} />
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8 },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: '700', marginLeft: 4 },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  search: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 40, borderRadius: 20 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500' },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  name: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  msgBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
