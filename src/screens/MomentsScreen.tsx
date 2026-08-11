import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Dimensions, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Avatar } from '../components/Avatar';
import { HeartIcon, CameraIcon, AddCircleIcon, CloseIcon, EyeIcon } from '../icons';
import { Moment } from '../types';
import { timeAgo } from '../utils';
import { Modal } from '../components/Modal';

const { width } = Dimensions.get('window');

export const MomentsScreen: React.FC = () => {
  const { theme, moments, getContact, createStory, seenMoment, profile } = useStore();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [text, setText] = useState('');
  const [bg, setBg] = useState(0);

  const gradients = [
    ['#F23E5C', '#FF9500'], ['#22D3EE', '#5B5BD6'], ['#FBBF24', '#F23E5C'],
    ['#34C759', '#22D3EE'], ['#AF52DE', '#F23E5C'], ['#FF9500', '#F23E5C'],
  ];

  const onPost = () => {
    if (!text.trim()) return;
    createStory('me', text.trim(), gradients[bg]);
    setText('');
    setBg(0);
    setShowCreate(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.brand, { color: theme.text }]}>Moments</Text>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>Share what you're up to</Text>
          </View>
          <Pressable
            onPress={() => setShowCreate(true)}
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.6 }]}
          >
            <AddCircleIcon size={28} color={theme.primary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
          <Pressable onPress={() => setShowCreate(true)} style={styles.storyItem}>
            <View style={[styles.addStory, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <CameraIcon size={26} color={theme.primary} />
            </View>
            <Text style={[styles.storyName, { color: theme.text }]}>Your story</Text>
          </Pressable>
          {moments.map((m, i) => {
            const contact = getContact(m.contactId);
            if (!contact) return null;
            return (
              <Pressable key={m.id} onPress={() => { seenMoment(m.id); setViewerIndex(i); }} style={styles.storyItem}>
                <View style={[styles.storyOuter, m.seen ? { borderColor: theme.border } : { borderColor: theme.primary }]}>
                  <Avatar name={contact.name} size={58} color={COLOR[contact.id.charCodeAt(1) % COLOR.length]} />
                </View>
                <Text style={[styles.storyName, { color: m.seen ? theme.textMuted : theme.text }]} numberOfLines={1}>
                  {contact.name.split(' ')[0]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {moments.map((m) => {
          const contact = getContact(m.contactId);
          if (!contact) return null;
          return (
            <Pressable
              key={m.id}
              onPress={() => { seenMoment(m.id); setViewerIndex(moments.indexOf(m)); }}
              style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && { opacity: 0.9 }]}
            >
              <View style={[styles.cardImage, { backgroundColor: m.background[0] }]}>
                <Text style={styles.cardText}>{m.text}</Text>
                <View style={styles.cardMeta}>
                  <Avatar name={contact.name} size={22} color={COLOR[contact.id.charCodeAt(1) % COLOR.length]} />
                  <Text style={styles.cardName}>{contact.name.split(' ')[0]}</Text>
                  <Text style={styles.cardTime}>· {timeAgo(m.createdAt)}</Text>
                </View>
              </View>
              <View style={[styles.cardFooter, { borderTopColor: theme.divider }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <HeartIcon size={14} color={theme.unread} />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>{m.reactions}</Text>
                </View>
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '500' }}>Tap to view</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {viewerIndex !== null && (
        <StoryViewer
          moments={moments}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          getContact={getContact}
          profileName={profile?.name || 'You'}
        />
      )}

      <Modal visible={showCreate} onClose={() => setShowCreate(false)} title="New moment">
        <View style={[styles.preview, { backgroundColor: gradients[bg][0] }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What's happening?"
            placeholderTextColor="rgba(255,255,255,0.6)"
            multiline
            style={styles.previewInput}
          />
        </View>
        <View style={styles.bgRow}>
          {gradients.map((g, i) => (
            <Pressable key={i} onPress={() => setBg(i)} style={[styles.bgDot, { backgroundColor: g[0] }, bg === i && { borderColor: '#fff', borderWidth: 3 }]} />
          ))}
        </View>
        <Pressable onPress={onPost} disabled={!text.trim()} style={({ pressed }) => [styles.postBtn, { backgroundColor: theme.primary, opacity: text.trim() ? 1 : 0.5 }, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Post moment</Text>
        </Pressable>
      </Modal>
    </View>
  );
};

const COLOR = ['#5B5BD6', '#F23E5C', '#22D3EE', '#34C759', '#FF9500', '#AF52DE'];

const StoryViewer: React.FC<{ moments: Moment[]; initialIndex: number; onClose: () => void; getContact: (id: string) => any; profileName: string }> = ({ moments, initialIndex, onClose, getContact, profileName }) => {
  const { theme, seenMoment } = useStore();
  const [index, setIndex] = useState(initialIndex);
  const progress = useRef(new Animated.Value(0)).current;
  const startX = useRef(0);

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false }).start(({ finished }) => {
      if (finished) {
        if (index < moments.length - 1) setIndex(index + 1);
        else onClose();
      }
    });
    seenMoment(moments[index].id);
  }, [index]);

  const next = () => { if (index < moments.length - 1) setIndex(index + 1); else onClose(); };
  const prev = () => { if (index > 0) setIndex(index - 1); };

  const m = moments[index];
  const contact = getContact(m.contactId) || { name: profileName, id: 'me' };
  const widthInterpolated = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.viewer}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: m.background[0] }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.progressRow}>
          {moments.map((_, i) => (
            <View key={i} style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              {i < index ? <View style={[styles.progressFill, { width: '100%', backgroundColor: '#fff' }]} /> :
                i === index ? <Animated.View style={[styles.progressFill, { backgroundColor: '#fff', width: widthInterpolated }]} /> : null}
            </View>
          ))}
        </View>
        <View style={styles.viewerHeader}>
          <Avatar name={contact.name} size={32} color={COLOR[contact.id?.charCodeAt(1) % COLOR.length || 0]} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.viewerName}>{contact.name}</Text>
            <Text style={styles.viewerTime}>{timeAgo(m.createdAt)}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.viewerClose}><CloseIcon size={22} color="#fff" /></Pressable>
        </View>
        <View
          style={styles.viewerContent}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(e) => { startX.current = e.nativeEvent.locationX; }}
          onResponderRelease={(e) => {
            const dx = e.nativeEvent.locationX - startX.current;
            if (dx < -50) next();
            else if (dx > 50) prev();
          }}
        >
          <Text style={styles.viewerBigText}>{m.text}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

import { Animated } from 'react-native';

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8 },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  brandSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  addBtn: { padding: 4 },
  storiesRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 12 },
  storyItem: { alignItems: 'center', width: 70 },
  storyOuter: { padding: 2, borderRadius: 32, borderWidth: 2 },
  addStory: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  storyName: { fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  cardImage: { width: '100%', height: 220, padding: 18, justifyContent: 'space-between' },
  cardText: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  cardName: { color: '#fff', fontSize: 13, fontWeight: '700', marginLeft: 8 },
  cardTime: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  preview: { width: '100%', aspectRatio: 9 / 16, maxHeight: 400, borderRadius: 18, padding: 24, justifyContent: 'center', marginBottom: 16 },
  previewInput: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', minHeight: 100 },
  bgRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 18 },
  bgDot: { width: 32, height: 32, borderRadius: 16 },
  postBtn: { height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  viewer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },
  progressRow: { flexDirection: 'row', gap: 3, paddingHorizontal: 12, paddingTop: 8 },
  progressTrack: { flex: 1, height: 3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%' },
  viewerHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 },
  viewerName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  viewerTime: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '500' },
  viewerClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  viewerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  viewerBigText: { color: '#fff', fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
});
