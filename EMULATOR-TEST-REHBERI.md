# 📱 Android Emülatör APK Test Rehberi

## 🎯 HASENE-ArabicLearning-FINAL-v4.apk Emülatörde Test

### Yöntem 1: Drag & Drop (En Kolay)
1. **Android Studio**'yu açın
2. **AVD Manager**'dan bir emülatör başlatın
3. **HASENE-ArabicLearning-FINAL-v4.apk** dosyasını masaüstünden alın
4. **Emülatör ekranına sürükleyip bırakın**
5. APK otomatik olarak yüklenecek

### Yöntem 2: ADB Command Line
```bash
# Emülatör çalışırken terminal/cmd'de:
adb install "C:\Users\ziyao\Desktop\HASENE-ArabicLearning-FINAL-v4.apk"

# Eğer zaten yüklüyse güncelleme için:
adb install -r "C:\Users\ziyao\Desktop\HASENE-ArabicLearning-FINAL-v4.apk"
```

### Yöntem 3: Emülatör Browser
1. Emülatörde **Chrome** açın
2. APK dosyasını **Google Drive** veya **cloud**'a yükleyin
3. Emülatörde linki açıp indirin
4. **Downloads** klasöründen APK'yı çalıştırın

### Yöntem 4: Android Studio Terminal
```bash
cd C:\Users\ziyao\Desktop\yeni\android
.\gradlew installDebug
```

## 🔧 Emülatör Ayarları

### Önerilen Emülatör Specs:
- **Device**: Pixel 7 veya Samsung Galaxy S22
- **API Level**: 30+ (Android 11+)
- **RAM**: 4GB+
- **Storage**: 8GB+

### Samsung M33 Benzeri Test:
- **Resolution**: 1080 x 2408
- **Density**: 400 dpi
- **Notch**: Enable camera cutout

## 🐛 Sorun Giderme

### APK Yüklenmiyor:
```bash
# Emülatörün çalıştığını kontrol et
adb devices

# APK'yı zorla yükle
adb install -t -r "C:\Users\ziyao\Desktop\HASENE-ArabicLearning-FINAL-v4.apk"
```

### Emülatör Yavaş:
- **Intel HAXM** aktif olmalı
- **Hyper-V** kapalı olmalı (Windows)
- **Hardware Acceleration** açık olmalı

## ✅ Test Checklist

### UI Kontrolü:
- [ ] Header düzgün görünüyor
- [ ] ⭐ Yıldız sayısı alt tarafta
- [ ] Camera notch sorunu yok
- [ ] Butonlar erişilebilir

### Fonksiyon Testi:
- [ ] Oyun modları çalışıyor
- [ ] Ses dosyaları çalıyor
- [ ] Hasene sistemi aktif
- [ ] İstatistikler güncelleniyor

## 📝 Notlar
- Emülatör her zaman gerçek cihazla %100 aynı sonucu vermez
- Samsung M33 gerçek test için fiziksel cihaz şart
- Cache sorunu emülatörde genelde olmaz