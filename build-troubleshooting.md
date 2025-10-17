# Android Studio Build Sorun Giderme

## 🚨 Yaygın Hatalar ve Çözümler:

### 1. "Gradle Sync Failed"
```bash
cd C:\Users\ziyao\Desktop\yeni\android
gradlew clean
gradlew build
```

### 2. "SDK Manager" Hatası:
- File → Settings → Android SDK
- Android 13.0 (API 33) ve Android 14.0 (API 34) indirin
- Apply → OK

### 3. "Java Version" Hatası:
- File → Settings → Build, Execution, Deployment → Gradle
- Gradle JDK: "Android Studio default JDK" seçin

### 4. "Missing Dependencies":
- Tools → SDK Manager
- SDK Tools sekmesi → "Android SDK Build-Tools" güncelleyin

## ✅ Başarılı Build Sonrası:
APK dosyası burada olacak:
`C:\Users\ziyao\Desktop\yeni\android\app\build\outputs\apk\debug\app-debug.apk`

## 📱 APK Test Etme:
1. Telefonu USB ile bağlayın
2. APK'yi telefona kopyalayın  
3. Telefonda APK'ye dokunarak yükleyin
4. "Bilinmeyen kaynaklardan yükleme" izni verin

## 🏪 Play Store İçin Release Build:
1. Build → Generate Signed Bundle / APK
2. APK seçin
3. Yeni keystore oluşturun
4. Release build seçin