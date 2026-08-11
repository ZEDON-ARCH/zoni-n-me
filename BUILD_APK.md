# Build the APK (self-signed)

You need a Mac/Linux with **Node.js 18+**, **Java JDK 17**, and **Android Studio** (or just the Android SDK + build tools).

## One-time setup

```bash
# 1. Install dependencies
npm install

# 2. Install EAS CLI (used for cloud build, optional)
npm install -g eas-cli

# 3. Install Expo CLI
npm install -g expo-cli
```

## Build a self-signed APK locally (recommended for your case)

```bash
# 1. Generate the Android project files
npx expo prebuild --platform android --clean

# 2. Generate a self-signing keystore (only once, keep this safe!)
cd android
keytool -genkey -v -keystore app-release.keystore -alias younme -keyalg RSA -keysize 2048 -validity 10000 -storepass younme123 -keypass younme123 -dname "CN=you n me,O=Local,C=US"

# 3. Build the release APK
cd android
./gradlew assembleRelease

# The APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

The APK is now ready. You can:
- Install it on your phone with `adb install app-release.apk`
- Or copy it to your website for users to download

## Build via EAS cloud (easier, no Android SDK needed)

```bash
# 1. Login to Expo
eas login

# 2. Build (cloud, ~10 minutes)
eas build --profile preview --platform android

# EAS will email you a link to download the APK
```

The `preview` profile in `eas.json` is configured to produce an APK (not an AAB).

## Build a release-signed APK for distribution (proper signing)

Generate your own keystore and use it:

```bash
# Generate a proper release keystore
keytool -genkeypair -v -storetype PKCS12 -keystore younme-release.keystore -alias younme -keyalg RSA -keysize 4096 -validity 10000 -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD -dname "CN=Your Name,O=Your Company,C=US"

# Update android/gradle.properties to add:
# YOUNME_UPLOAD_STORE_FILE=younme-release.keystore
# YOUNME_UPLOAD_KEY_ALIAS=younme
# YOUNME_UPLOAD_STORE_PASSWORD=YOUR_PASSWORD
# YOUNME_UPLOAD_KEY_PASSWORD=YOUR_PASSWORD

# Then build
cd android
./gradlew assembleRelease
```

The keystore is what proves the app is genuinely from you. **Don't lose it** — without it you can never push updates that users will accept as legitimate.

## Updating the app

1. Bump `version` in `app.json` (e.g. from `1.0.0` to `1.0.1`)
2. Bump `versionCode` in `app.json` under `android` (e.g. from `1` to `2`)
3. Rebuild using any of the above methods
4. Upload the new APK to your website, replacing the old one
