# Android build fix commands
# Run these if you need to build APK

# 1. Install Capacitor dependencies
cd docs
npm install

# 2. Sync Capacitor (this creates missing files)
npx cap sync android

# 3. Build Android
npx cap build android

# 4. Open in Android Studio (optional)
npx cap open android