import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { Modal } from '../components/Modal';
import {
  BackIcon, QuestionIcon, ChatIcon, ShieldIcon, InfoIcon, StarIcon, GlobeIcon,
  LockIcon, BlockIcon, KeyIcon, TrashIcon, CheckIcon, ChevronRight,
} from '../icons';
import { FAQS } from '../data';

interface Props {
  onBack: () => void;
}

type Section = 'main' | 'help' | 'support' | 'about' | 'language' | 'blocked';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const { theme, profile, blocked, unblockUser, getContact, contacts, logout, storage } = useStore();
  const [section, setSection] = useState<Section>('main');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const blockedContacts = blocked.map((id) => getContact(id)).filter(Boolean) as any[];

  if (section === 'main') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface, borderBottomColor: theme.divider, borderBottomWidth: 1 }}>
          <View style={styles.topBar}>
            <Pressable onPress={onBack} style={styles.backBtn}><BackIcon size={22} color={theme.text} /></Pressable>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.groupLabel, { color: theme.textMuted }]}>PRIVACY & SECURITY</Text>
            <SettingRow icon={<LockIcon size={18} color={theme.success} />} iconBg={theme.success + '22'} label="End-to-end encryption" sub="All messages and calls" theme={theme} right="active" />
            <SettingRow icon={<KeyIcon size={18} color={theme.primary} />} iconBg={theme.primarySoft} label="PIN" sub="Manage your PIN" theme={theme} right="›" onPress={() => Alert.alert('PIN', 'PIN management coming soon')} />
            <SettingRow icon={<ShieldIcon size={18} color={theme.primary} />} iconBg={theme.primarySoft} label="Privacy policy" sub="How we handle your data" theme={theme} right="›" onPress={() => setShowPrivacy(true)} />
            <SettingRow icon={<BlockIcon size={18} color={theme.danger} />} iconBg={theme.effectiveTheme === 'dark' ? '#3A1A1A' : '#FEE2E2'} label="Blocked contacts" sub={`${blocked.length} blocked`} theme={theme} right="›" onPress={() => setSection('blocked')} />
          </View>

          <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.groupLabel, { color: theme.textMuted }]}>HELP</Text>
            <SettingRow icon={<QuestionIcon size={18} color={theme.primary} />} iconBg={theme.primarySoft} label="Help center" sub="FAQs and guides" theme={theme} right="›" onPress={() => setSection('help')} />
            <SettingRow icon={<ChatIcon size={18} color={theme.success} />} iconBg={theme.success + '22'} label="Contact support" sub="Reach our team" theme={theme} right="›" onPress={() => setSection('support')} />
            <SettingRow icon={<InfoIcon size={18} color={theme.textSecondary} />} iconBg={theme.surfaceMuted} label="About you 'n me" sub="Version and info" theme={theme} right="›" onPress={() => setSection('about')} />
            <SettingRow icon={<StarIcon size={18} color="#FBBF24" />} iconBg="#FFF5D9" label="Rate us" sub="Leave a review" theme={theme} right="›" onPress={() => Alert.alert('Rate', 'Thanks! Opening store...')} />
            <SettingRow icon={<GlobeIcon size={18} color={theme.primary} />} iconBg={theme.primarySoft} label="Language" sub={profile?.language === 'en' ? 'English' : profile?.language || 'English'} theme={theme} right="›" onPress={() => setSection('language')} />
          </View>

          <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.groupLabel, { color: theme.textMuted }]}>LEGAL</Text>
            <SettingRow icon={<ShieldIcon size={18} color={theme.primary} />} iconBg={theme.primarySoft} label="Terms of service" sub="Read the terms" theme={theme} right="›" onPress={() => setShowTerms(true)} />
            <SettingRow icon={<TrashIcon size={18} color={theme.danger} />} iconBg={theme.effectiveTheme === 'dark' ? '#3A1A1A' : '#FEE2E2'} label="Clear local data" sub="Sign out and remove all data" theme={theme} right="›" onPress={() => Alert.alert('Clear all data?', 'This will sign you out and remove all locally stored data.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: async () => { await storage.clearAll(); await logout(); } },
            ])} />
          </View>

          <View style={{ marginTop: 16 }}>
            <Pressable
              onPress={() => Alert.alert('Log out?', 'You will need your PIN to come back.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log out', style: 'destructive', onPress: () => logout() },
              ])}
              style={({ pressed }) => [styles.logoutBtn, { backgroundColor: theme.danger }, pressed && { opacity: 0.85 }]}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Log out</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Modal visible={showTerms} onClose={() => setShowTerms(false)} title="Terms of service" fullHeight>
          <TermsContent theme={theme} />
          <Pressable onPress={() => setShowTerms(false)} style={({ pressed }) => [{ backgroundColor: theme.primary, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 16 }, pressed && { transform: [{ scale: 0.98 }] }]}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>I agree</Text>
          </Pressable>
        </Modal>

        <Modal visible={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy policy" fullHeight>
          <PrivacyContent theme={theme} />
          <Pressable onPress={() => setShowPrivacy(false)} style={({ pressed }) => [{ backgroundColor: theme.primary, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 16 }, pressed && { transform: [{ scale: 0.98 }] }]}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Got it</Text>
          </Pressable>
        </Modal>
      </View>
    );
  }

  if (section === 'help') {
    return (
      <SubScreen title="Help center" onBack={() => setSection('main')} theme={theme}>
        {FAQS.map((f, i) => (
          <View key={i} style={[styles.faqItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable onPress={() => setOpenFaq(openFaq === i ? null : i)} style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: theme.text }]}>{f.q}</Text>
              <Text style={[styles.faqToggle, { color: theme.textMuted }]}>{openFaq === i ? '−' : '+'}</Text>
            </Pressable>
            {openFaq === i && <Text style={[styles.faqA, { color: theme.textSecondary }]}>{f.a}</Text>}
          </View>
        ))}
      </SubScreen>
    );
  }

  if (section === 'support') {
    return (
      <SubScreen title="Contact support" onBack={() => setSection('main')} theme={theme}>
        <View style={[styles.supportCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.supportTitle, { color: theme.text }]}>How can we help?</Text>
          <Text style={[styles.supportSub, { color: theme.textSecondary }]}>We respond within 24 hours.</Text>
          <Pressable
            onPress={() => Linking.openURL('mailto:support@younme.app').catch(() => Alert.alert('Email us', 'support@younme.app'))}
            style={({ pressed }) => [styles.supportBtn, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Email support@younme.app</Text>
          </Pressable>
        </View>
      </SubScreen>
    );
  }

  if (section === 'about') {
    return (
      <SubScreen title="About" onBack={() => setSection('main')} theme={theme}>
        <View style={[styles.aboutCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.aboutLogo, { backgroundColor: theme.primary }]}>
            <Text style={{ fontSize: 32, color: '#fff', fontWeight: '800' }}>'n</Text>
          </View>
          <Text style={[styles.aboutName, { color: theme.text }]}>you 'n me</Text>
          <Text style={[styles.aboutVersion, { color: theme.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutBody, { color: theme.textSecondary }]}>
            Simple, encrypted chat. Your messages, your calls, your data — locked between you and the people you choose.
          </Text>
        </View>
      </SubScreen>
    );
  }

  if (section === 'language') {
    return (
      <SubScreen title="Language" onBack={() => setSection('main')} theme={theme}>
        {LANGUAGES.map((l) => {
          const active = profile?.language === l.code;
          return (
            <Pressable
              key={l.code}
              onPress={() => Alert.alert('Language', `Switched to ${l.label} (UI is English in this build)`)}
              style={[styles.langRow, { backgroundColor: theme.surface, borderColor: active ? theme.primary : theme.border }, active && { backgroundColor: theme.primarySoft }]}
            >
              <Text style={{ fontSize: 22 }}>{l.flag}</Text>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600', flex: 1, marginLeft: 12 }}>{l.label}</Text>
              {active && <CheckIcon size={18} color={theme.primary} />}
            </Pressable>
          );
        })}
      </SubScreen>
    );
  }

  if (section === 'blocked') {
    return (
      <SubScreen title="Blocked contacts" onBack={() => setSection('main')} theme={theme}>
        {blockedContacts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 30, gap: 12 }}>
            <BlockIcon size={36} color={theme.textMuted} />
            <Text style={{ color: theme.textSecondary, fontWeight: '500' }}>No blocked contacts</Text>
          </View>
        ) : (
          blockedContacts.map((u) => (
            <View key={u.id} style={[styles.blockedRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>{u.name[0]?.toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{u.name}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '500' }}>{u.phone}</Text>
              </View>
              <Pressable onPress={() => unblockUser(u.id)} style={[styles.unblockBtn, { backgroundColor: theme.surfaceMuted }]}>
                <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '700' }}>unblock</Text>
              </Pressable>
            </View>
          ))
        )}
      </SubScreen>
    );
  }

  return null;
};

const SubScreen: React.FC<any> = ({ title, onBack, theme, children }) => (
  <View style={{ flex: 1, backgroundColor: theme.bg }}>
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface, borderBottomColor: theme.divider, borderBottomWidth: 1 }}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.backBtn}><BackIcon size={22} color={theme.text} /></Pressable>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>{children}</ScrollView>
  </View>
);

const SettingRow: React.FC<any> = ({ icon, iconBg, label, sub, onPress, right, theme }) => (
  <Pressable onPress={onPress} style={[styles.row, { borderTopColor: theme.divider }]}>
    <View style={[styles.icon, { backgroundColor: iconBg }]}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.rowSub, { color: theme.textSecondary }]}>{sub}</Text>
    </View>
    {right === 'active' ? (
      <View style={[styles.activePill, { backgroundColor: theme.success + '22' }]}>
        <Text style={{ color: theme.success, fontSize: 10, fontWeight: '700' }}>ACTIVE</Text>
      </View>
    ) : right ? <ChevronRight size={16} color={theme.textMuted} /> : null}
  </Pressable>
);

const TermsContent: React.FC<{ theme: any }> = ({ theme }) => (
  <View>
    <Section title="Acceptance" body="By using you 'n me you agree to these terms. If you don't agree, please don't use the service." theme={theme} />
    <Section title="Your account" body="You're responsible for your account and PIN. Don't share your PIN. We can't recover lost PINs." theme={theme} />
    <Section title="Acceptable use" body="Don't harass, scam, or impersonate others. Don't share illegal content. We may suspend accounts that violate these rules." theme={theme} />
    <Section title="Privacy" body="Your messages are end-to-end encrypted. We can't read them." theme={theme} />
    <Section title="Termination" body="You can delete your account anytime. We may terminate accounts that violate terms." theme={theme} />
  </View>
);

const PrivacyContent: React.FC<{ theme: any }> = ({ theme }) => (
  <View>
    <Section title="End-to-end encryption" body="Every message, call, and file is encrypted on your device. Only you and your recipient have the keys. Not even we can read your messages." theme={theme} />
    <Section title="What we store" body="Your phone number (hashed), profile name, and your encrypted messages. We never sell your data. We never read your messages." theme={theme} />
    <Section title="Your rights" body="Export your data, delete your account, or request a copy of everything we have." theme={theme} />
    <Section title="Last updated" body="December 2024" theme={theme} />
  </View>
);

const Section: React.FC<{ title: string; body: string; theme: any }> = ({ title, body, theme }) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text, marginBottom: 4 }}>{title}</Text>
    <Text style={{ fontSize: 13, fontWeight: '500', color: theme.textSecondary, lineHeight: 19 }}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: '700', marginLeft: 4 },
  group: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
  groupLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderTopWidth: 1 },
  icon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { fontSize: 14, fontWeight: '600' },
  rowSub: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  activePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  logoutBtn: { paddingVertical: 16, borderRadius: 28, alignItems: 'center' },
  faqItem: { borderRadius: 12, borderWidth: 1, marginBottom: 8, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  faqQ: { fontSize: 14, fontWeight: '600', flex: 1, paddingRight: 10 },
  faqToggle: { fontSize: 20, fontWeight: '300' },
  faqA: { fontSize: 13, fontWeight: '500', paddingHorizontal: 14, paddingBottom: 14, lineHeight: 19 },
  supportCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 14 },
  supportTitle: { fontSize: 16, fontWeight: '700' },
  supportSub: { fontSize: 12, fontWeight: '500', marginTop: 6, marginBottom: 14 },
  supportBtn: { backgroundColor: theme.primary, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  aboutCard: { padding: 24, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  aboutLogo: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  aboutName: { fontSize: 20, fontWeight: '800' },
  aboutVersion: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  aboutBody: { fontSize: 13, fontWeight: '500', marginTop: 12, textAlign: 'center', lineHeight: 19 },
  blockedRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  unblockBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  langRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, marginBottom: 8 },
});
