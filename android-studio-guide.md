# 📱 Android Studio Açıldıktan Sonra Yapılacaklar

## ✅ İlk Adımlar (Android Studio açıldığında):

### 1. Gradle Sync Bekleyin
- Alt kısımda "Gradle Sync" göreceksiniz
- 2-5 dakika sürebilir
- İnternet bağlantısı gerekli

### 2. Device/Emulator Seçin
**Fiziksel Telefon:**
- Telefonu USB ile bağlayın
- Developer Options açın
- USB Debugging aktif edin

**Emulator:**
- Tools → Device Manager
- Create Virtual Device
- Pixel 7 Pro + API 33/34 seçin

### 3. APK Build Etme
**Debug APK (Test için):**
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- 3-5 dakika build süresi
- `app/build/outputs/apk/debug/app-debug.apk` çıkacak

**Release APK (Play Store için):**
- Build → Generate Signed Bundle / APK
- APK seçin → Next
- Key store oluşturun (şifre belirleyin)
- Release build seçin

### 4. Test Etme
- Green Play Button → Run on Device
- Uygulamanız telefon/emulator'da açılacak
- Tüm özellikleri test edin

## 🚨 Olası Sorunlar ve Çözümler:

### "Gradle Sync Failed"
```bash
# Terminal'de şunu deneyin:
cd android
./gradlew clean
./gradlew build
```

### "SDK Not Found"
- File → Settings → Android SDK
- Android 13-14 (API 33-34) indirin

### "Java Version Error"
- File → Settings → Build → Gradle
- Gradle JDK: Android Studio default JDK seçin

## 📊 Build Sonuçları:
- **Debug APK:** ~25-30 MB
- **Release APK:** ~15-20 MB (optimized)
- **Build Süresi:** 3-5 dakika (ilk build)

## 🎯 Başarılı Build Sonrası:
1. ✅ APK dosyası hazır
2. ✅ Play Store'a yüklenebilir
3. ✅ Telefonda test edilebilir
4. ✅ Kullanıcılara dağıtılabilir

Herhangi bir hata alırsanız, hata mesajını paylaşın!