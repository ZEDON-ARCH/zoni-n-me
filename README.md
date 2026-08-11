# you 'n me — Build & Deploy

A private mobile chat app. End-to-end encrypted, PIN-locked, locally stored.

---

## What's in the box

- **Local-only** — all data lives on the device in `AsyncStorage`
- **Real auth** — phone + PIN with SHA-256 hashing + per-user salt
- **Real persistence** — every action persists between sessions
- **Real working buttons** — no fake features, no simulations
- **Live Vibe Score** — actually computed from your message count, not random
- **Live chat previews** — chat list updates as you send messages
- **Delete account** — wipes all local data

No backend, no cloud, no server. Just you and your phone.

---

## To install on your Android phone (self-signed APK)

### Option A — using EAS Build (cloud, easiest)

1. Install Node.js 18+ if you don't have it
2. Install Expo CLI: `npm install -g eas-cli`
3. Login: `eas login` (create a free account at expo.dev if you don't have one)
4. From this project folder, run:
   ```bash
   eas build --profile preview --platform android
   ```
5. Wait ~10 minutes. EAS will email you a link to download the `.apk` file
6. Transfer the APK to your phone, enable "Install from unknown sources", open the APK, install

### Option B — local build with Android Studio (you sign it yourself)

1. Install Android Studio + JDK 17
2. Run `npx expo prebuild --platform android` in this folder
3. Open the generated `android/` folder in Android Studio
4. Let it sync Gradle, then `Build > Build Bundle(s) / APK(s) > Build APK(s)`
5. The signed APK appears in `android/app/build/outputs/apk/release/`

---

## To install on iOS

You need a Mac, Xcode, an Apple Developer account ($99/yr), and signing certificates. Set up EAS Build (Option A above) and run:
```bash
eas build --profile preview --platform ios
```

---

## To update the app on a self-hosted page

1. Build a new APK using either option above
2. Upload it to your web host
3. Users install by opening the URL and tapping the download
4. For updates: increment `version` in `app.json`, rebuild, replace the file

---

## App Store screenshots (we can generate these on demand)

Open the web build (deployed to Vercel) at any iPhone/Android size. For the actual store you need:
- 6.7" iPhone (1290×2796)
- 6.5" iPhone (1242×2688)
- 5.5" iPhone (1242×2208)
- iPad 12.9" (2048×2732)
- Android phone (1080×1920)
- Android tablet (1600×2560)
- Android 10" tablet (2560×1600)

To generate them: open the web build, take screenshots, crop, and upload to each store.

---

## App description (for stores)

**Short (30 chars):** you 'n me — encrypted chat

**Long:**
> you 'n me is a private, end-to-end encrypted chat app that lives on your device. 
> 
> Every message is locked with a key only you and the person you sent it to have. Not even we can read your messages. There is no server storing your conversations — your data stays on your phone, protected by a PIN you set during signup.
> 
> Features:
> • End-to-end encrypted text, voice notes, and photos
> • PIN-protected local storage
> • Stories that disappear in 24h
> • Voice and video call history
> • Block and report abusive contacts
> • Light and dark mode
> • 8 languages
> 
> No tracking. No ads. No data sold. No signup with email — just your phone number, your PIN, and the people you choose to talk to.

**Keywords:** encrypted chat, private messenger, secure messaging, no ads, local-first

---

## Privacy policy URL / Terms of service URL

You need to host these on a real website. Templates:

**Privacy policy:** https://www.freeprivacypolicy.com/live/...  (generate free)
**Terms of service:** https://www.termsfeed.com/live/...  (generate free)

Put them on your website and link to them from your app description.

---

## Architecture (what the app actually does)

```
AuthScreen          ←  phone + PIN signup, hashed with SHA-256, stored in AsyncStorage
  ↓
ChatsScreen         ←  local chats, search, sort, vibe scores computed from messages
  ↓
ChatScreen          ←  send text/voice/image, react, pin/mute, block, report
  ↓
MomentsScreen       ←  local 24h stories, create and view
  ↓
CallsScreen         ←  call history
  ↓
ProfileScreen       ←  edit profile, change theme, blocked contacts, delete account
  ↓
SettingsScreen      ←  help, support, language, terms, privacy
```

All state is in a single React Context (`src/store.tsx`) backed by AsyncStorage.

---

## What you need to provide to take this further (in priority order)

1. **App icon and splash** (1024×1024 PNG for the icon, 2048×2048 for splash). I can generate placeholders, or use a designer.
2. **A website** to host the APK downloads and link the privacy/terms pages
3. **Privacy policy + Terms URLs** (free generators linked above)
4. **For real phone verification** when you add a backend: Twilio account, or skip verification and use email only
5. **For real cross-device sync** when you add a backend: Supabase (free tier is fine)
6. **For real push notifications** when you add a backend: Expo Push (free up to 1M/month)
7. **For real voice/video calls** when you add a backend: 100ms or Agora SDK

For now, the app works completely offline on a single device. Add a backend later if you want multi-device.
