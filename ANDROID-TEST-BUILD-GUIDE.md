# 📱 HASENE Android Test & Build Rehberi

## 🎯 Hızlı Test Yöntemi

### Fiziksel Telefonda Test (Önerilen)
1. Masaüstündeki APK dosyasını telefonunuza gönderin
2. Telefon ayarlarında "Bilinmeyen kaynaklardan yükleme"yi açın  
3. APK'yı yükleyip test edin

## 🔧 APK Build İşlemi

### Gereksinimler
- Node.js (18+)
- Android Studio
- JDK 17
- Capacitor CLI

### Build Adımları
```bash
# 1. Dependencies yükle
npm install

# 2. Capacitor sync
npx cap sync android

# 3. Android Studio'da aç
npx cap open android

# 4. Build > Build Bundle(s) / APK(s) > Build APK(s)
# Veya terminal: ./gradlew assembleDebug
```

## 📱 Android Emülatör Kurulumu

### AVD Manager (Android Studio)
1. Tools > AVD Manager
2. Create Virtual Device
3. **Pixel 6/7** seç (notch testi için)
4. **API Level 33+** (Android 13)
5. RAM: 2GB, Storage: 6GB

### Test Senaryoları
- ✅ Samsung M33 camera notch uyumluluğu  
- ✅ Fill-blank oyun modu
- ✅ Hasene star görünürlüğü
- ✅ Ses efektleri
- ✅ PWA özellikleri

## 🐛 Sorun Giderme

### Cache Sorunu
1. Eski uygulamayı tamamen sil
2. Telefonu yeniden başlat
3. Yeni APK'yı yükle

### Build Hataları
- JDK version kontrolü: `java -version`
- Gradle sync: Android Studio > File > Sync Project
- Clean build: `./gradlew clean`

## 📋 APK Bilgileri
- **Package:** com.hasene.arabiclearning.v2
- **Version:** 1.0
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 34 (Android 14)