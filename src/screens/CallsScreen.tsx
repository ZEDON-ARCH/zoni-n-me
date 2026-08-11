import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Avatar } from '../components/Avatar';
import { PhoneIcon, VideoIcon, ArrowDownLeft, ArrowUpRight, AddCircleIcon } from '../icons';
import { callTime, durFmt } from '../utils';

const COLOR = ['#5B5BD6', '#F23E5C', '#22D3EE', '#34C759', '#FF9500', '#AF52DE', '#FF2D55', '#5856D6'];

const colorFor = (id: string) => COLOR[id.charCodeAt(1) % COLOR.length];

export const CallsScreen: React.FC = () => {
  const { theme, calls, getContact } = useStore();
  const [filter, setFilter] = useState<'all' | 'missed' | 'incoming' | 'outgoing'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return calls;
    return calls.filter((c) => c.type === filter);
  }, [calls, filter]);

  const totalTalk = calls.filter((c) => c.duration).reduce((s, c) => s + (c.duration || 0), 0);
  const missed = calls.filter((c) => c.type === 'missed').length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.brand, { color: theme.text }]}>Calls</Text>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>Recent voice and video calls</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert('New call', 'Pick a contact to call')}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <AddCircleIcon size={28} color={theme.primary} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {[
            { id: 'all', label: 'all' },
            { id: 'missed', label: 'missed' },
            { id: 'incoming', label: 'incoming' },
            { id: 'outgoing', label: 'outgoing' },
          ].map((f) => {
            const active = filter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id as any)}
                style={[styles.filterChip, { backgroundColor: active ? theme.primary : theme.surface, borderColor: active ? theme.primary : theme.border }]}
              >
                <Text style={[styles.filterText, { color: active ? '#fff' : theme.text }]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={
          <View>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Frequent</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesRow}>
              {calls.slice(0, 4).map((c) => {
                const u = getContact(c.contactId);
                if (!u) return null;
                return (
                  <View key={c.id} style={styles.favItem}>
                    <View style={{ position: 'relative' }}>
                      <Avatar name={u.name} size={56} color={colorFor(u.id)} online={u.online} />
                      <View style={[styles.favBadge, { backgroundColor: c.mode === 'video' ? theme.primary : theme.success }]}>
                        {c.mode === 'video' ? <VideoIcon size={10} color="#fff" /> : <PhoneIcon size={10} color="#fff" />}
                      </View>
                    </View>
                    <Text style={[styles.favName, { color: theme.text }]} numberOfLines={1}>{u.name.split(' ')[0]}</Text>
                    <Text style={[styles.favSub, { color: theme.textSecondary }]}>{c.duration ? durFmt(c.duration) : 'missed'}</Text>
                  </View>
                );
              })}
            </ScrollView>

            <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.statsTitle, { color: theme.text }]}>This week</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNum, { color: theme.primary }]}>{calls.length}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>calls</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNum, { color: theme.success }]}>{Math.floor(totalTalk / 60)}m</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>talk</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNum, { color: theme.danger }]}>{missed}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>missed</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Recent</Text>
          </View>
        }
        renderItem={({ item }) => {
          const u = getContact(item.contactId);
          if (!u) return null;
          const isMissed = item.type === 'missed';
          return (
            <View style={[styles.callRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Avatar name={u.name} size={48} online={u.online} color={colorFor(u.id)} />
              <View style={styles.callBody}>
                <Text style={[styles.callName, { color: isMissed ? theme.danger : theme.text }]} numberOfLines={1}>{u.name}</Text>
                <View style={styles.callMetaRow}>
                  {isMissed ? <ArrowDownLeft size={12} color={theme.danger} /> :
                    item.type === 'incoming' ? <ArrowDownLeft size={12} color={theme.success} /> :
                    <ArrowUpRight size={12} color={theme.primary} />}
                  <Text style={[styles.callMeta, { color: theme.textSecondary }]}>
                    {item.type === 'incoming' ? 'incoming' : item.type === 'outgoing' ? 'outgoing' : 'missed'} · {item.mode}
                    {item.duration ? ` · ${durFmt(item.duration)}` : ''}
                  </Text>
                </View>
                <Text style={[styles.callTime, { color: theme.textMuted }]}>{callTime(item.time)}</Text>
              </View>
              <Pressable
                onPress={() => Alert.alert(`Call ${u.name}`, `${item.mode} call`)}
                style={[styles.callBtn, { backgroundColor: theme.surfaceMuted }]}
              >
                {item.mode === 'video' ? <VideoIcon size={18} color={theme.primary} /> : <PhoneIcon size={18} color={theme.primary} />}
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4 },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  brandSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  filtersRow: { paddingHorizontal: 18, paddingTop: 14, gap: 6 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 18, marginBottom: 10, paddingHorizontal: 4 },
  favoritesRow: { paddingVertical: 4, gap: 14 },
  favItem: { alignItems: 'center', width: 70 },
  favBadge: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F5F4F8' },
  favName: { fontSize: 12, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  favSub: { fontSize: 10, fontWeight: '500', marginTop: 1 },
  statsCard: { padding: 14, borderRadius: 16, borderWidth: 1, marginTop: 18, marginBottom: 4 },
  statsTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '700', marginTop: 2, letterSpacing: 0.3, textTransform: 'uppercase' },
  statDivider: { width: 1, height: 28 },
  callRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  callBody: { flex: 1, marginLeft: 12 },
  callName: { fontSize: 15, fontWeight: '700', letterSpacing: -0.1 },
  callMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  callMeta: { fontSize: 12, fontWeight: '500' },
  callTime: { fontSize: 10, fontWeight: '500', marginTop: 2 },
  callBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
