import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { LogoIcon, ChatIcon, ShieldIcon, KeyIcon, LockIcon, ChevronRight } from '../icons';
import { formatPhone, COUNTRY_CODES } from '../utils';

type Mode = 'welcome' | 'signup-name' | 'signup-phone' | 'signup-pin' | 'login-phone' | 'login-pin';

export const AuthScreen: React.FC = () => {
  const { signup, login, theme } = useStore();
  const [mode, setMode] = useState<Mode>('welcome');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(COUNTRY_CODES[0]);
  const [showCountry, setShowCountry] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setError(''); }, [mode]);

  const handleSignup = async () => {
    if (mode === 'signup-name') {
      if (!name.trim()) { setError('Enter your name'); return; }
      setMode('signup-phone');
    } else if (mode === 'signup-phone') {
      const check = formatPhone(phone);
      if (!check.valid) { setError('Enter a valid phone number for ' + country.label); return; }
      setMode('signup-pin');
    } else if (mode === 'signup-pin') {
      if (pin.length < 4) { setError('PIN must be at least 4 digits'); return; }
      if (pin !== confirmPin) { setError('PINs do not match'); return; }
      setLoading(true);
      try {
        const full = country.code + phone.replace(/[^\d]/g, '');
        await signup(name.trim(), full, pin);
      } catch (e: any) {
        setError(e?.message || 'Could not create account');
      } finally { setLoading(false); }
    }
  };

  const handleLogin = async () => {
    if (mode === 'login-phone') {
      if (!phone.trim()) { setError('Enter your phone'); return; }
      setMode('login-pin');
    } else if (mode === 'login-pin') {
      setLoading(true);
      try {
        const full = country.code + phone.replace(/[^\d]/g, '');
        const ok = await login(full, pin);
        if (!ok) setError('Wrong phone or PIN');
      } catch (e: any) { setError(e?.message || 'Could not sign in'); }
      finally { setLoading(false); }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {mode === 'welcome' ? (
              <View style={styles.welcome}>
                <View style={styles.hero}>
                  <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
                    <ChatIcon size={48} color="#fff" />
                  </View>
                  <Text style={[styles.brand, { color: theme.text }]}>you 'n me</Text>
                  <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                    simple, encrypted chat
                  </Text>
                </View>

                <View style={[styles.featuresCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  {[
                    { Icon: ShieldIcon, title: 'End-to-end encrypted', sub: 'Only you and your recipient can read', tint: '#34C759' },
                    { Icon: KeyIcon, title: 'PIN protected', sub: 'Your account is locked behind your PIN', tint: theme.primary },
                    { Icon: LockIcon, title: 'Private by default', sub: 'No tracking, no ads, no data sold', tint: theme.textSecondary },
                  ].map((f, i) => (
                    <View key={i} style={[styles.featureRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.divider }]}>
                      <View style={[styles.featureIcon, { backgroundColor: f.tint + '22' }]}>
                        <f.Icon size={20} color={f.tint} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.featureTitle, { color: theme.text }]}>{f.title}</Text>
                        <Text style={[styles.featureSub, { color: theme.textSecondary }]}>{f.sub}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={{ marginTop: 24, gap: 10 }}>
                  <Pressable
                    onPress={() => setMode('signup-name')}
                    style={({ pressed }) => [styles.primaryBtn, { backgroundColor: theme.primary }, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={styles.primaryBtnText}>Create new account</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setMode('login-phone')}
                    style={({ pressed }) => [styles.secondaryBtn, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && { opacity: 0.85 }]}
                  >
                    <Text style={[styles.secondaryBtnText, { color: theme.text }]}>I already have an account</Text>
                  </Pressable>
                </View>
                <Text style={[styles.legal, { color: theme.textMuted }]}>
                  by continuing you agree to our terms and privacy policy
                </Text>
              </View>
            ) : (
              <View>
                <Pressable
                  onPress={() => {
                    if (mode === 'signup-name' || mode === 'login-phone') setMode('welcome');
                    else if (mode === 'signup-phone') setMode('signup-name');
                    else if (mode === 'signup-pin') setMode('signup-phone');
                    else if (mode === 'login-pin') setMode('login-phone');
                  }}
                  style={styles.backBtn}
                >
                  <Text style={[styles.backText, { color: theme.text }]}>← back</Text>
                </Pressable>

                <Text style={[styles.title, { color: theme.text }]}>
                  {mode === 'signup-name' ? 'What\'s your name?' :
                    mode === 'signup-phone' ? 'Your phone number' :
                    mode === 'signup-pin' ? 'Set a PIN' :
                    mode === 'login-phone' ? 'Welcome back' :
                    'Enter your PIN'}
                </Text>
                <Text style={[styles.sub, { color: theme.textSecondary }]}>
                  {mode === 'signup-name' ? 'So your friends can find you' :
                    mode === 'signup-phone' ? 'We use this only to sign you in on this device' :
                    mode === 'signup-pin' ? '4-6 digits. We hash it before storing.' :
                    mode === 'login-phone' ? 'Enter the phone you signed up with' :
                    'Unlock your account'}
                </Text>

                <View style={{ marginTop: 28 }}>
                  {mode === 'signup-name' && (
                    <Field label="Your name" theme={theme}>
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Alex Rivera"
                        placeholderTextColor={theme.textMuted}
                        style={[styles.input, { color: theme.text }]}
                        autoCapitalize="words"
                      />
                    </Field>
                  )}

                  {(mode === 'signup-phone' || mode === 'login-phone') && (
                    <>
                      <Field label="Country" theme={theme}>
                        <Pressable
                          onPress={() => setShowCountry(true)}
                          style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        >
                          <Text style={{ fontSize: 22 }}>{country.flag}</Text>
                          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600', flex: 1, marginLeft: 12 }}>{country.label}</Text>
                          <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>{country.code}</Text>
                          <ChevronRight size={16} color={theme.textMuted} />
                        </Pressable>
                      </Field>
                      <Field label="Phone number" theme={theme} hint={(() => { const f = formatPhone(country.code + phone.replace(/[^\d]/g, '')); return f.valid ? '✓ ' + f.formatted : `enter ${country.len} digits for ${country.label}`; })()}>
                        <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                          <Text style={{ color: theme.textMuted, fontSize: 15, fontWeight: '600' }}>{country.code}</Text>
                          <TextInput
                            value={phone}
                            onChangeText={(t) => setPhone(t.replace(/[^\d]/g, ''))}
                            placeholder="5551234567"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="phone-pad"
                            style={[styles.input, { color: theme.text, marginLeft: 8 }]}
                            maxLength={country.len}
                          />
                        </View>
                      </Field>
                    </>
                  )}

                  {(mode === 'signup-pin' || mode === 'login-pin') && (
                    <>
                      <Field label="PIN" theme={theme}>
                        <TextInput
                          value={pin}
                          onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
                          placeholder="••••"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="number-pad"
                          secureTextEntry
                          style={[styles.input, { color: theme.text, textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
                          maxLength={6}
                        />
                      </Field>
                      {mode === 'signup-pin' && (
                        <Field label="Confirm PIN" theme={theme}>
                          <TextInput
                            value={confirmPin}
                            onChangeText={(t) => setConfirmPin(t.replace(/\D/g, '').slice(0, 6))}
                            placeholder="••••"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            secureTextEntry
                            style={[styles.input, { color: theme.text, textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
                            maxLength={6}
                          />
                        </Field>
                      )}
                    </>
                  )}

                  {error ? (
                    <View style={[styles.errorBanner, { backgroundColor: theme.effectiveTheme === 'dark' ? '#3A1A1A' : '#FEE2E2' }]}>
                      <Text style={{ color: theme.danger, fontSize: 13, fontWeight: '600' }}>{error}</Text>
                    </View>
                  ) : null}

                  <Pressable
                    onPress={mode.startsWith('signup') ? handleSignup : handleLogin}
                    disabled={loading}
                    style={({ pressed }) => [styles.primaryBtn, { backgroundColor: theme.primary, marginTop: 20 }, loading && { opacity: 0.6 }, pressed && { opacity: 0.9 }]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryBtnText}>
                        {mode === 'signup-pin' ? 'Create account' : mode === 'login-pin' ? 'Sign in' : 'Continue'}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {showCountry && (
        <CountryPicker
          current={country.code}
          onSelect={(c) => { setCountry(c); setShowCountry(false); }}
          onClose={() => setShowCountry(false)}
          theme={theme}
        />
      )}
    </View>
  );
};

const Field: React.FC<{ label: string; theme: any; hint?: string; children: React.ReactNode }> = ({ label, theme, hint, children }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 12, fontWeight: '700', color: theme.text, marginBottom: 6, letterSpacing: 0.3 }}>{label}</Text>
    {children}
    {hint ? <Text style={{ fontSize: 11, fontWeight: '500', color: theme.textMuted, marginTop: 6 }}>{hint}</Text> : null}
  </View>
);

const CountryPicker: React.FC<{ current: string; onSelect: (c: any) => void; onClose: () => void; theme: any }> = ({ current, onSelect, onClose, theme }) => (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
    <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%', paddingBottom: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
        <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>Choose country</Text>
        <Pressable onPress={onClose}><Text style={{ color: theme.primary, fontSize: 14, fontWeight: '700' }}>done</Text></Pressable>
      </View>
      <ScrollView style={{ maxHeight: 480 }}>
        {COUNTRY_CODES.map((c) => (
          <Pressable
            key={c.code}
            onPress={() => onSelect(c)}
            style={({ pressed }) => [styles.countryRow, { borderBottomColor: theme.divider }, pressed && { backgroundColor: theme.surfaceMuted }]}
          >
            <Text style={{ fontSize: 22 }}>{c.flag}</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', flex: 1, marginLeft: 12 }}>{c.label}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600' }}>{c.code}</Text>
            {current === c.code && <Text style={{ color: theme.primary, fontWeight: '700', marginLeft: 8 }}>✓</Text>}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 30 },
  welcome: { flex: 1, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: 40 },
  logoCircle: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginTop: 20 },
  tagline: { fontSize: 13, fontWeight: '500', letterSpacing: 0.3, marginTop: 6 },
  featuresCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  featureRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  featureIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '700' },
  featureSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  primaryBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  secondaryBtnText: { fontSize: 14, fontWeight: '700' },
  legal: { textAlign: 'center', fontSize: 11, fontWeight: '500', marginTop: 18 },
  backBtn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  backText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginTop: 16 },
  sub: { fontSize: 13, fontWeight: '500', marginTop: 6, lineHeight: 19 },
  input: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: 0 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 48 },
  errorBanner: { padding: 12, borderRadius: 12, marginTop: 8 },
  countryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
});
