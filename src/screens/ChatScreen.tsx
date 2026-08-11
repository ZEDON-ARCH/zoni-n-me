import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Avatar } from '../components/Avatar';
import { VibeBar } from '../components/VibeBar';
import { Modal } from '../components/Modal';
import {
  BackIcon, PhoneIcon, VideoIcon, SendIcon, MicIcon, ImageIcon, SmileIcon, MoreIcon,
  CheckIcon, CheckDoubleIcon, LockIcon, PinIcon, TrashIcon, BlockIcon, FlagIcon,
  SearchIcon, CameraIcon,
} from '../icons';
import { Chat, Contact } from '../types';
import { clockTime, durFmt } from '../utils';
import { QUICK_REACTIONS, REPORT_REASONS } from '../data';

interface Props {
  chat: Chat;
  contact: Contact;
  onBack: () => void;
  onOpenProfile: () => void;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#06B6D4', '#EF4444', '#F59E0B'];
const colorFor = (id: string) => COLORS[id.charCodeAt(1) % COLORS.length];

export const ChatScreen: React.FC<Props> = ({ chat, contact, onBack, onOpenProfile }) => {
  const { theme, messages, sendMessage, deleteMessage, reactMessage, pinChat, muteChat, deleteChat, clearChat, blockUser, reportUser, markRead, computeVibe } = useStore();
  const [draft, setDraft] = useState(chat.draft || '');
  const [showActions, setShowActions] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const scrollRef = useRef<FlatList>(null);

  const list = messages[chat.id] || [];
  const vibe = computeVibe(contact.id);

  useEffect(() => {
    markRead(chat.id);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 50);
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [list.length]);

  const onSend = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(chat.id, { senderId: 'me', type: 'text', text });
    setDraft('');
  };

  const onLongPress = (id: string) => {
    setSelectedMsg(id);
    setShowReactions(true);
  };

  const onReact = (emoji: string) => {
    if (selectedMsg) reactMessage(chat.id, selectedMsg, emoji);
    setShowReactions(false);
    setSelectedMsg(null);
  };

  const sendImage = () => {
    const gradients = [['#F23E5C', '#FF9500'], ['#5B5BD6', '#22D3EE'], ['#34C759', '#22D3EE'], ['#FF2D55', '#5B5BD6']];
    const g = gradients[Math.floor(Math.random() * gradients.length)];
    sendMessage(chat.id, { senderId: 'me', type: 'image', imageColor: g, text: 'Photo' });
  };

  const sendVoice = () => {
    sendMessage(chat.id, { senderId: 'me', type: 'voice', duration: Math.floor(Math.random() * 30) + 5 });
  };

  const onBlock = () => {
    setShowActions(false);
    Alert.alert(`Block ${contact.name}?`, 'They won\'t be able to message or call you. You can unblock from settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', style: 'destructive', onPress: () => { blockUser(contact.id); onBack(); } },
    ]);
  };

  const onReport = () => { setShowActions(false); setShowReport(true); };
  const onClear = () => { setShowActions(false); Alert.alert('Clear chat?', 'All messages will be removed.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear', style: 'destructive', onPress: () => clearChat(chat.id) },
  ]); };
  const onDelete = () => { setShowActions(false); Alert.alert('Delete chat?', 'This conversation will be permanently removed.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => { deleteChat(chat.id); onBack(); } },
  ]); };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface, borderBottomColor: theme.divider, borderBottomWidth: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn}><BackIcon size={24} color={theme.text} /></Pressable>
          <Pressable onPress={onOpenProfile} style={styles.headerProfile}>
            <Avatar name={contact.name} size={40} online={contact.online} color={colorFor(contact.id)} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{contact.name}</Text>
              <Text style={[styles.status, { color: contact.online ? theme.online : theme.textSecondary }]}>
                {contact.online ? 'online' : contact.lastSeen ? `last seen ${contact.lastSeen}` : 'offline'}
              </Text>
            </View>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn}><PhoneIcon size={20} color={theme.text} /></Pressable>
            <Pressable style={styles.iconBtn}><VideoIcon size={20} color={theme.text} /></Pressable>
            <Pressable style={styles.iconBtn} onPress={() => setShowActions(true)}><MoreIcon size={20} color={theme.text} /></Pressable>
          </View>
        </View>

        <View style={[styles.vibeRow, { backgroundColor: theme.surfaceMuted }]}>
          <View style={{ flex: 1 }}>
            <VibeBar score={vibe} small showLabel />
          </View>
          <View style={[styles.encryptionBadge, { backgroundColor: theme.success }]}>
            <LockIcon size={11} color="#fff" />
            <Text style={[styles.encryptionText, { color: '#fff' }]}>ENCRYPTED</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={scrollRef}
          data={list}
          keyExtractor={(m) => m.id}
          renderItem={({ item, index }) => {
            const prev = list[index - 1];
            const showDate = !prev || new Date(item.createdAt).toDateString() !== new Date(prev.createdAt).toDateString();
            return (
              <View>
                {showDate && (
                  <View style={styles.dateRow}>
                    <View style={[styles.datePill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                        {new Date(item.createdAt).toDateString() === new Date().toDateString() ? 'Today' : new Date(item.createdAt).toDateString()}
                      </Text>
                    </View>
                  </View>
                )}
                <MessageBubble msg={item} theme={theme} onLongPress={() => onLongPress(item.id)} contactName={contact.name} contactColor={colorFor(contact.id)} />
              </View>
            );
          }}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        />

        {showReactions && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 6 }}>
            <View style={[styles.reactionBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {QUICK_REACTIONS.map((e, i) => (
                <Pressable key={i} onPress={() => onReact(e)} style={({ pressed }) => [styles.reactionBtn, pressed && { transform: [{ scale: 1.4 }] }]}>
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </Pressable>
              ))}
            </View>
            {selectedMsg && (
              <Pressable
                onPress={() => {
                  Alert.alert('Delete message?', '', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => { deleteMessage(chat.id, selectedMsg); setShowReactions(false); setSelectedMsg(null); } },
                  ]);
                }}
                style={[styles.deletePill, { backgroundColor: theme.danger }]}
              >
                <TrashIcon size={14} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>Delete message</Text>
              </Pressable>
            )}
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {['on my way', 'sounds good', 'lol', 'thanks!', 'talk later'].map((r, i) => (
            <Pressable key={i} onPress={() => setDraft((d) => (d ? d + ' ' + r : r))} style={[styles.quickChip, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}>
              <Text style={[styles.quickText, { color: theme.primary }]}>{r}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.surface }}>
          <View style={[styles.composer, { borderTopColor: theme.divider }]}>
            <View style={[styles.composerInput, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <Pressable onPress={sendImage} style={styles.attachBtn}><ImageIcon size={20} color={theme.primary} /></Pressable>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Message"
                placeholderTextColor={theme.textMuted}
                style={[styles.composerText, { color: theme.text }]}
                multiline
              />
              <Pressable style={styles.attachBtn}><SmileIcon size={18} color={theme.textMuted} /></Pressable>
              <Pressable onPress={sendVoice} style={styles.attachBtn}><MicIcon size={18} color={theme.textMuted} /></Pressable>
            </View>
            <Pressable
              onPress={draft.trim() ? onSend : sendVoice}
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.92 }] }]}
            >
              <View style={[styles.sendBtn, { backgroundColor: draft.trim() ? theme.primary : theme.success }]}>
                {draft.trim() ? <SendIcon size={20} color="#fff" /> : <MicIcon size={20} color="#fff" />}
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Modal visible={showActions} onClose={() => setShowActions(false)}>
        <View style={{ paddingTop: 4 }}>
          <ActionRow icon={<PinIcon size={18} color={theme.primary} />} label={chat.pinned ? 'Unpin from top' : 'Pin to top'} onPress={() => { pinChat(chat.id); setShowActions(false); }} theme={theme} />
          <ActionRow icon={<MicIcon size={18} color={theme.primary} />} label={chat.muted ? 'Unmute' : 'Mute'} onPress={() => { muteChat(chat.id); setShowActions(false); }} theme={theme} />
          <ActionRow icon={<SearchIcon size={18} color={theme.primary} />} label="Search in chat" onPress={() => { setShowActions(false); Alert.alert('Search', 'Coming soon'); }} theme={theme} />
          <ActionRow icon={<TrashIcon size={18} color={theme.primary} />} label="Clear chat" onPress={onClear} theme={theme} />
          <ActionRow icon={<TrashIcon size={18} color={theme.danger} />} label="Delete chat" destructive onPress={onDelete} theme={theme} />
          <View style={{ height: 1, backgroundColor: theme.divider, marginVertical: 6 }} />
          <ActionRow icon={<BlockIcon size={18} color={theme.danger} />} label={`Block ${contact.name}`} destructive onPress={onBlock} theme={theme} />
          <ActionRow icon={<FlagIcon size={18} color={theme.danger} />} label="Report" destructive onPress={onReport} theme={theme} />
        </View>
      </Modal>

      <Modal visible={showReport} onClose={() => setShowReport(false)} title={`Report ${contact.name}`}>
        <ReportForm theme={theme} onSubmit={(reason, note) => { reportUser(contact.id, contact.name, reason, note); setShowReport(false); Alert.alert('Report submitted', 'Thanks. We will review it.'); }} />
      </Modal>
    </View>
  );
};

const ActionRow: React.FC<any> = ({ icon, label, onPress, destructive, theme }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.actionRow, pressed && { backgroundColor: theme.surfaceMuted }]}>
    <View style={[styles.actionIcon, { backgroundColor: destructive ? (theme.effectiveTheme === 'dark' ? '#3A1A1A' : '#FEE2E2') : theme.surfaceMuted }]}>{icon}</View>
    <Text style={[styles.actionLabel, { color: destructive ? theme.danger : theme.text }]}>{label}</Text>
  </Pressable>
);

const ReportForm: React.FC<any> = ({ onSubmit, theme }) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  return (
    <View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>Why are you reporting?</Text>
      <View style={{ gap: 8, marginTop: 10, marginBottom: 14 }}>
        {REPORT_REASONS.map((r) => {
          const active = reason === r;
          return (
            <Pressable key={r} onPress={() => setReason(r)} style={[styles.reasonChip, { backgroundColor: theme.surface, borderColor: active ? theme.primary : theme.border }, active && { backgroundColor: theme.primarySoft }]}>
              <Text style={{ color: active ? theme.primary : theme.text, fontSize: 14, fontWeight: '600', flex: 1 }}>{r}</Text>
              {active && <CheckIcon size={16} color={theme.primary} />}
            </Pressable>
          );
        })}
      </View>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: theme.text, marginBottom: 6 }}>Notes (optional)</Text>
        <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 12, minHeight: 80 }}>
          <TextInput value={note} onChangeText={setNote} placeholder="Tell us what happened" placeholderTextColor={theme.textMuted} multiline style={{ color: theme.text, fontSize: 14, fontWeight: '500', minHeight: 60 }} />
        </View>
      </View>
      <Pressable
        onPress={() => reason && onSubmit(reason, note)}
        disabled={!reason}
        style={({ pressed }) => [{ opacity: !reason ? 0.5 : 1, backgroundColor: theme.primary, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.98 }] }]}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Submit report</Text>
      </Pressable>
    </View>
  );
};

const MessageBubble: React.FC<{ msg: any; theme: any; onLongPress: () => void; contactName: string; contactColor: string }> = ({ msg, theme, onLongPress, contactName, contactColor }) => {
  const outgoing = msg.senderId === 'me';
  return (
    <View style={[styles.row, outgoing ? styles.rowOut : styles.rowIn]}>
      {!outgoing && (
        <View style={{ marginRight: 8, marginBottom: 4 }}>
          <Avatar name={contactName} size={28} color={contactColor} />
        </View>
      )}
      <Pressable onLongPress={onLongPress} delayLongPress={300} style={{ maxWidth: '75%' }}>
        {outgoing ? (
          <View style={[styles.bubble, { backgroundColor: theme.outgoing }]}>
            {msg.type === 'voice' ? (
              <View style={styles.voiceRow}>
                <View style={styles.playBtn}><MicIcon size={14} color="#fff" /></View>
                <View style={styles.waveform}>
                  {[6, 10, 14, 8, 18, 12, 16, 10, 14, 8, 12, 18, 10, 6, 14, 10, 16, 8, 12, 10].map((h, i) => (
                    <View key={i} style={{ width: 2.5, height: h, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', opacity: 0.5 + (i % 4) * 0.12 }} />
                  ))}
                </View>
                <Text style={styles.voiceDur}>{durFmt(msg.duration || 0)}</Text>
              </View>
            ) : msg.type === 'image' ? (
              <View>
                <View style={[styles.imagePlaceholder, { backgroundColor: msg.imageColor ? msg.imageColor[0] : '#F23E5C' }]}>
                  <CameraIcon size={32} color="rgba(255,255,255,0.85)" />
                </View>
                {msg.text && msg.text !== 'Photo' ? <Text style={[styles.bubbleText, { color: '#fff' }]}>{msg.text}</Text> : null}
              </View>
            ) : (
              <Text style={[styles.bubbleText, { color: '#fff' }]}>{msg.text}</Text>
            )}
            <View style={styles.meta}>
              <Text style={[styles.time, { color: 'rgba(255,255,255,0.78)' }]}>{clockTime(msg.createdAt)}</Text>
              {msg.status === 'sending' ? <CheckIcon size={12} color="rgba(255,255,255,0.5)" /> :
                msg.status === 'read' ? <CheckDoubleIcon size={14} color={theme.success} /> :
                <CheckDoubleIcon size={14} color="rgba(255,255,255,0.85)" />}
            </View>
            {msg.reactions && msg.reactions.length > 0 && (
              <View style={styles.reactionRow}>
                {msg.reactions.map((e: string, i: number) => (
                  <View key={i} style={styles.reactionChip}><Text style={{ fontSize: 11 }}>{e}</Text></View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.bubble, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
            {msg.type === 'voice' ? (
              <View style={styles.voiceRow}>
                <View style={[styles.playBtn, { backgroundColor: theme.primary }]}><MicIcon size={14} color="#fff" /></View>
                <View style={styles.waveform}>
                  {[6, 10, 14, 8, 18, 12, 16, 10, 14, 8, 12, 18, 10, 6, 14, 10, 16, 8, 12, 10].map((h, i) => (
                    <View key={i} style={{ width: 2.5, height: h, borderRadius: 2, backgroundColor: theme.primary, opacity: 0.5 + (i % 4) * 0.12 }} />
                  ))}
                </View>
                <Text style={[styles.voiceDur, { color: theme.textSecondary }]}>{durFmt(msg.duration || 0)}</Text>
              </View>
            ) : msg.type === 'image' ? (
              <View>
                <View style={[styles.imagePlaceholder, { backgroundColor: msg.imageColor ? msg.imageColor[0] : '#F23E5C' }]}>
                  <CameraIcon size={32} color="rgba(255,255,255,0.85)" />
                </View>
              </View>
            ) : (
              <Text style={[styles.bubbleText, { color: theme.text }]}>{msg.text}</Text>
            )}
            <View style={styles.meta}>
              <Text style={[styles.time, { color: theme.textMuted }]}>{clockTime(msg.createdAt)}</Text>
            </View>
            {msg.reactions && msg.reactions.length > 0 && (
              <View style={styles.reactionRow}>
                {msg.reactions.map((e: string, i: number) => (
                  <View key={i} style={[styles.reactionChip, { backgroundColor: theme.surfaceMuted }]}><Text style={{ fontSize: 11 }}>{e}</Text></View>
                ))}
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingTop: 4, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
  name: { fontSize: 16, fontWeight: '700', letterSpacing: -0.1 },
  status: { fontSize: 11, fontWeight: '500', marginTop: 1 },
  headerActions: { flexDirection: 'row' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  vibeRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 12 },
  encryptionBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 4 },
  encryptionText: { fontSize: 10, fontWeight: '800' },
  dateRow: { alignItems: 'center', marginBottom: 12 },
  datePill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  dateText: { fontSize: 11, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, marginVertical: 3, maxWidth: '90%' },
  rowOut: { alignSelf: 'flex-end' },
  rowIn: { alignSelf: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  bubbleText: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4, gap: 4 },
  time: { fontSize: 10, fontWeight: '600' },
  voiceRow: { flexDirection: 'row', alignItems: 'center', minWidth: 180 },
  playBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  waveform: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 22, gap: 2 },
  voiceDur: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginLeft: 8 },
  imagePlaceholder: { width: 220, height: 160, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reactionRow: { position: 'absolute', bottom: -10, right: 8, flexDirection: 'row' },
  reactionChip: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2, marginLeft: -4, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 2 },
  reactionBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  reactionBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  deletePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, gap: 6, marginTop: 6 },
  quickRow: { paddingHorizontal: 12, paddingTop: 4, paddingBottom: 4, gap: 6 },
  quickChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  quickText: { fontSize: 12, fontWeight: '700' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, gap: 8 },
  composerInput: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 22, borderWidth: 1, minHeight: 44 },
  composerText: { flex: 1, fontSize: 15, fontWeight: '500', paddingHorizontal: 6, paddingVertical: 4, maxHeight: 100 },
  attachBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, gap: 14 },
  actionIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 15, fontWeight: '600' },
  reasonChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
});
