import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Avatar } from '../components/Avatar';
import { SettingsScreen } from './SettingsScreen';
import { Modal } from '../components/Modal';
import {
  SettingsIcon, SunIcon, MoonIcon, PencilIcon, ShareIcon, LogoutIcon, ShieldIcon, KeyIcon, LockIcon, BlockIcon, ChevronRight, TrashIcon, SettingsIcon as CogIcon, CheckIcon, CloseIcon,
} from '../icons';

interface Props {
  onClose?: () => void;
  viewingContactId?: string;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#06B6D4', '#EF4444', '#F59E0B'];
const colorFor = (id: string) => COLORS[id.charCodeAt(1) % COLORS.length];

export const ProfileScreen: React.FC<Props> = ({ onClose, viewingContactId }) => {
  const { theme, profile, updateProfile, contacts, getContact, blocked, unblockUser, logout, themeMode, setThemeMode, chats, messages, computeVibe, computeStreak, deleteAccount } = useStore();
  const [edit, setEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');

  const isMe = !viewingContactId;
  const viewedContact = viewingContactId ? getContact(viewingContactId) : null;

  if (showSettings) return <SettingsScreen onBack={() => setShowSettings(false)} />;
  if (!profile && isMe) return null;

  const blockedContacts = blocked.map((id) => contacts.find((c) => c.id === id)).filter(Boolean) as any[];
  const totalMessages = Object.values(messages).reduce((s, m) => s + m.length, 0);
  const totalChats = chats.length;

  // average vibe from all contacts
  const vibeAvg = Math.round(contacts.reduce((s, c) => s + computeVibe(c.id), 0) / Math.max(1, contacts.length));
  const vibeColor = vibeAvg >= 85 ? '#EC4899' : vibeAvg >= 60 ? '#3B82F6' : vibeAvg >= 25 ? '#06B6D4' : '#10B981';

  const saveProfile = async () => {
    await updateProfile({ name: editName.trim() || profile!.name, bio: editBio });
    setEdit(false);
  };

  const onShare = async () => {
    try { await Share.share({ message: "Join me on you 'n me — simple, encrypted chat" }); } catch {}
  };

  if (!isMe && viewedContact) {
    const vibe = computeVibe(viewedContact.id);
    const streak = computeStreak(viewedContact.id);
    const vc = vibe >= 85 ? '#EC4899' : vibe >= 60 ? '#3B82F6' : vibe >= 25 ? '#06B6D4' : '#10B981';
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.cover, { backgroundColor: colorFor(viewedContact.id) }]}>
            <SafeAreaView edges={['top']}>
              <View style={styles.coverTop}>
                <Pressable onPress={onClose} style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                  <CloseIcon size={20} color="#fff" />
                </Pressable>
              </View>
              <View style={styles.coverBody}>
                <View style={styles.coverAvatar}>
                  <Avatar name={viewedContact.name} size={92} color="#fff" />
                </View>
                <Text style={styles.coverName}>{viewedContact.name}</Text>
                <Text style={styles.coverPhone}>{viewedContact.phone}</Text>
                {viewedContact.bio ? <Text style={styles.coverBio}>{viewedContact.bio}</Text> : null}
              </View>
            </SafeAreaView>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBlock, { backgroundColor: vc }]}>
              <Text style={styles.statNum}>{vibe}</Text>
              <Text style={styles.statLabel}>VIBE</Text>
            </View>
            <View style={[styles.statBlock, { backgroundColor: theme.warning }]}>
              <Text style={styles.statNum}>{streak}</Text>
              <Text style={styles.statLabel}>STREAK</Text>
            </View>
            <View style={[styles.statBlock, { backgroundColor: theme.info }]}>
              <Text style={styles.statNum}>{contactMessageCount(viewedContact.id, messages, chats)}</Text>
              <Text style={styles.statLabel}>MSGS</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Bold colored cover */}
        <View style={[styles.cover, { backgroundColor: theme.primary }]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.coverTop}>
              <View style={{ width: 36 }} />
              <Text style={styles.youLabel}>YOU</Text>
              <Pressable onPress={() => setShowSettings(true)} style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                <CogIcon size={20} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.coverBody}>
              <View style={styles.coverAvatar}>
                <Avatar name={profile.name} size={92} color="#fff" />
                <Pressable onPress={() => setEdit(true)} style={styles.editBubble}>
                  <PencilIcon size={12} color={theme.primary} />
                </Pressable>
              </View>
              <Text style={styles.coverName}>{profile.name}</Text>
              <Text style={styles.coverPhone}>{profile.phone}</Text>
              {profile.bio ? <Text style={styles.coverBio}>{profile.bio}</Text> : null}
            </View>
          </SafeAreaView>
        </View>

        {/* Stat blocks - colored */}
        <View style={styles.statsRow}>
          <View style={[styles.statBlock, { backgroundColor: theme.primary }]}>
            <Text style={styles.statNum}>{totalChats}</Text>
            <Text style={styles.statLabel}>CHATS</Text>
          </View>
          <View style={[styles.statBlock, { backgroundColor: theme.accent }]}>
            <Text style={styles.statNum}>{totalMessages}</Text>
            <Text style={styles.statLabel}>MESSAGES</Text>
          </View>
          <View style={[styles.statBlock, { backgroundColor: vibeColor }]}>
            <Text style={styles.statNum}>{vibeAvg}</Text>
            <Text style={styles.statLabel}>VIBE AVG</Text>
          </View>
        </View>

        {/* Account card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textMuted }]}>ACCOUNT</Text>
          <SettingRow iconBg={theme.primary} icon={<PencilIcon size={18} color="#fff" />} label="Edit profile" sub="Name, bio, photo" onPress={() => setEdit(true)} theme={theme} />
          <SettingRow iconBg={theme.success} icon={<ShareIcon size={18} color="#fff" />} label="Invite friends" sub="Share you 'n me" onPress={onShare} theme={theme} />
          <SettingRow iconBg={theme.danger} icon={<BlockIcon size={18} color="#fff" />} label="Blocked contacts" sub={`${blocked.length} blocked`} onPress={() => setShowBlocked(true)} theme={theme} />
        </View>

        {/* Security card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textMuted }]}>SECURITY</Text>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: theme.success }]}><LockIcon size={18} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>End-to-end encrypted</Text>
              <Text style={[styles.settingSub, { color: theme.textSecondary }]}>All messages and calls</Text>
            </View>
            <View style={[styles.activePill, { backgroundColor: theme.success }]}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>ON</Text>
            </View>
          </View>
          <SettingRow iconBg={theme.primary} icon={<KeyIcon size={18} color="#fff" />} label="PIN protected" sub="Required to open the app" onPress={() => Alert.alert('PIN', 'PIN management coming soon')} theme={theme} />
        </View>

        {/* Appearance card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textMuted }]}>APPEARANCE</Text>
          <View style={styles.themeRow}>
            {[
              { id: 'light', label: 'Light', Icon: SunIcon, color: theme.warning },
              { id: 'dark', label: 'Dark', Icon: MoonIcon, color: theme.indigo },
              { id: 'system', label: 'Auto', Icon: SettingsIcon, color: theme.info },
            ].map((t) => {
              const active = themeMode === t.id;
              const Icon = t.Icon;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setThemeMode(t.id as any)}
                  style={[
                    styles.themePill,
                    { backgroundColor: active ? t.color : theme.surfaceMuted, borderColor: active ? t.color : theme.border },
                  ]}
                >
                  <Icon size={14} color={active ? '#fff' : theme.text} />
                  <Text style={[styles.themeText, { color: active ? '#fff' : theme.text }]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.dangerCard}>
          <Pressable
            onPress={() => Alert.alert('Log out?', 'You will need to enter your PIN to sign back in.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log out', style: 'destructive', onPress: () => logout() },
            ])}
            style={[styles.actionBtn, { backgroundColor: theme.warning }]}
          >
            <LogoutIcon size={18} color="#fff" />
            <Text style={styles.actionText}>Log out</Text>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Delete account?', 'This permanently removes your account and all locally stored data. This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteAccount() },
            ])}
            style={[styles.actionBtn, { backgroundColor: theme.danger, marginTop: 8 }]}
          >
            <TrashIcon size={18} color="#fff" />
            <Text style={styles.actionText}>Delete account</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', paddingTop: 16 }}>
          <Text style={[styles.version, { color: theme.textMuted }]}>you 'n me v1.0 · made with care</Text>
        </View>
      </ScrollView>

      <Modal visible={edit} onClose={() => setEdit(false)} title="Edit profile">
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Name</Text>
        <View style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput value={editName} onChangeText={setEditName} style={{ color: theme.text, fontSize: 15, fontWeight: '600' }} />
        </View>
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Bio</Text>
        <View style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, height: 90, paddingTop: 12 }]}>
          <TextInput value={editBio} onChangeText={setEditBio} multiline style={{ color: theme.text, fontSize: 15, fontWeight: '500', minHeight: 60 }} />
        </View>
        <Pressable onPress={saveProfile} style={({ pressed }) => [{ backgroundColor: theme.primary, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 8 }, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Save changes</Text>
        </Pressable>
      </Modal>

      <Modal visible={showBlocked} onClose={() => setShowBlocked(false)} title="Blocked contacts">
        {blockedContacts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 30, gap: 12 }}>
            <BlockIcon size={36} color={theme.textMuted} />
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '500' }}>No blocked contacts</Text>
          </View>
        ) : (
          blockedContacts.map((u) => (
            <View key={u.id} style={styles.blockedRow}>
              <Avatar name={u.name} size={40} color={colorFor(u.id)} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>{u.name}</Text>
                <Text style={[styles.settingSub, { color: theme.textSecondary }]}>{u.phone}</Text>
              </View>
              <Pressable onPress={() => unblockUser(u.id)} style={[styles.unblockBtn, { backgroundColor: theme.surfaceMuted }]}>
                <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '700' }}>unblock</Text>
              </Pressable>
            </View>
          ))
        )}
      </Modal>
    </View>
  );
};

const contactMessageCount = (contactId: string, messages: Record<string, any[]>, chats: any[]) => {
  const chat = chats.find((c) => c.contactId === contactId);
  if (!chat) return 0;
  return (messages[chat.id] || []).length;
};

const SettingRow: React.FC<any> = ({ icon, iconBg, label, sub, onPress, theme }) => (
  <Pressable onPress={onPress} style={[styles.settingRow, { borderTopColor: theme.divider }]}>
    <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.settingSub, { color: theme.textSecondary }]}>{sub}</Text>
    </View>
    <ChevronRight size={16} color={theme.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  cover: { paddingBottom: 24 },
  coverTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  coverBody: { alignItems: 'center', paddingTop: 18 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  youLabel: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9 },
  coverAvatar: { position: 'relative' },
  editBubble: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  coverName: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginTop: 14 },
  coverPhone: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500', marginTop: 2 },
  coverBio: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },

  // 3 colored stat blocks
  statsRow: { flexDirection: 'row', paddingHorizontal: 14, marginTop: -16, gap: 8 },
  statBlock: { flex: 1, padding: 14, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  statNum: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginTop: 2 },

  card: { marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 18, borderWidth: 1 },
  cardLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  settingSub: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  activePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  themeRow: { flexDirection: 'row', gap: 8 },
  themePill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 6 },
  themeText: { fontSize: 13, fontWeight: '800' },
  dangerCard: { marginHorizontal: 16, marginTop: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 28, gap: 8 },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  blockedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  unblockBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.3 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 14, justifyContent: 'center' },
  version: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
});
