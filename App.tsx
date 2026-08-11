import React, { useState, useMemo, useCallback } from 'react';
import { View, StatusBar, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StoreProvider, useStore } from './src/store';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LoadingScreen } from './src/components/Avatar';
import { PillTabBar } from './src/components/PillTabBar';
import { AuthScreen } from './src/screens/AuthScreen';
import { ChatsScreen } from './src/screens/ChatsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { MomentsScreen } from './src/screens/MomentsScreen';
import { CallsScreen } from './src/screens/CallsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { NewChatScreen } from './src/screens/NewChatScreen';
import { Chat, Contact } from './src/types';

type Route =
  | { kind: 'tabs' }
  | { kind: 'chat'; chat: Chat; contact: Contact }
  | { kind: 'newchat' }
  | { kind: 'contact-profile'; chat: Chat; contact: Contact };

function Shell() {
  const { hydrated, theme, profile, chats, moments, blocked, getContact } = useStore();
  const [activeTab, setActiveTab] = useState<string>('chats');
  const [route, setRoute] = useState<Route>({ kind: 'tabs' });
  const [splashDone, setSplashDone] = useState(false);

  const badges = useMemo(() => ({
    chats: chats.reduce((s, c) => s + c.unread, 0),
    moments: moments.filter((m) => !m.seen).length,
    calls: 0,
    me: blocked.length,
  }), [chats, moments, blocked]);

  const openChat = useCallback((chat: Chat) => {
    if (!chat.contactId) return;
    const contact = getContact(chat.contactId);
    if (contact) setRoute({ kind: 'chat', chat, contact });
  }, [getContact]);

  const goToTabs = useCallback(() => setRoute({ kind: 'tabs' }), []);

  if (!splashDone || !hydrated) {
    return <LoadingScreen theme={theme} onReady={() => setSplashDone(true)} />;
  }

  if (!profile) {
    return <AuthScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={theme.effectiveTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {route.kind === 'tabs' && activeTab === 'chats' && (
        <ChatsScreen
          onOpenChat={openChat}
          onOpenProfile={() => setActiveTab('me')}
          onOpenNewChat={() => setRoute({ kind: 'newchat' })}
        />
      )}
      {route.kind === 'tabs' && activeTab === 'moments' && <MomentsScreen />}
      {route.kind === 'tabs' && activeTab === 'calls' && <CallsScreen />}
      {route.kind === 'tabs' && activeTab === 'me' && <ProfileScreen />}

      {route.kind === 'newchat' && (
        <NewChatScreen
          onClose={goToTabs}
          onOpenChat={openChat}
        />
      )}

      {route.kind === 'chat' && (
        <ChatScreen
          chat={route.chat}
          contact={route.contact}
          onBack={goToTabs}
          onOpenProfile={() => setRoute({ kind: 'contact-profile', chat: route.chat, contact: route.contact })}
        />
      )}

      {route.kind === 'contact-profile' && (
        <ProfileScreen
          viewingContactId={route.contact.id}
          onClose={() => setRoute({ kind: 'chat', chat: route.chat, contact: route.contact })}
        />
      )}

      {route.kind === 'tabs' && (
        <PillTabBar
          active={activeTab}
          onChange={(t) => { setActiveTab(t); setRoute({ kind: 'tabs' }); }}
          badges={badges}
          theme={theme}
        />
      )}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ErrorBoundary>
          <Shell />
        </ErrorBoundary>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
