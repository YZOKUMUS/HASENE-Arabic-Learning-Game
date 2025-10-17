# 🚀 HASENE - Play Store Yayın Rehberi

## ✅ Tamamlanan Adımlar:
1. ✅ Capacitor kurulumu yapıldı
2. ✅ Android projesi oluşturuldu
3. ✅ Web dosyaları kopyalandı

## 📱 Sonraki Adımlar:

### 1. Android Studio Kurulumu
- Android Studio'yu indirin: https://developer.android.com/studio
- Kurulum sırasında tüm bileşenleri seçin

### 2. Projeyi Android Studio'da Açma
```bash
cd "c:\Users\ziyao\Desktop\yeni"
npx cap open android
```

### 3. APK Build Etme
Android Studio'da:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Ya da Gradle ile: `./gradlew assembleDebug`

### 4. Release APK İçin İmzalama
```bash
# Keystore oluştur
keytool -genkey -v -keystore hasene-key.keystore -alias hasene -keyalg RSA -keysize 2048 -validity 10000

# Release build
./gradlew assembleRelease
```

## 🏪 Play Store Hazırlık

### Gerekli Materyaller:
- [ ] App ikonu (512x512 PNG)
- [ ] Feature Graphic (1024x500 PNG) 
- [ ] Screenshots (en az 2 adet)
- [ ] Kısa açıklama (80 karakter)
- [ ] Uzun açıklama (4000 karakter)
- [ ] Kategori: Eğitim/Oyunlar
- [ ] İçerik derecelendirmesi

### İçerik Hazırlığı:

**Kısa Açıklama:**
"Eğlenceli Arapça kelime öğrenme oyunu! Hasene topla, seviye atla, streak koru!"

**Anahtar Kelimeler:**
- Arapça öğrenme
- İslami eğitim
- Kelime oyunu
- Dil öğrenme
- Hasene
- Gamification

## 💰 Play Store Ücreti:
- Geliştirici kaydı: $25 (bir kerelik)
- İnceleme süresi: 3-5 gün

## 📞 Destek:
Bu rehber ile ilgili sorularınız için GitHub Issues kullanın.