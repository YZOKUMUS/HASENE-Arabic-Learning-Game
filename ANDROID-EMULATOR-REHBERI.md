# 📱 Android Emülatör Test Rehberi

## Android Studio AVD Manager (Önerilen)

### Adım 1: Android Studio'da AVD Manager'ı açın
1. Android Studio açıldığında
2. Tools > AVD Manager tıklayın
3. "Create Virtual Device" butonuna tıklayın

### Adım 2: Cihaz Seçimi
1. **Phone** kategorisini seçin
2. **Pixel 6** veya **Pixel 7** seçin (notch testi için)
3. **Next** butonuna tıklayın

### Adım 3: Sistem İmajı
1. **API Level 33** (Android 13) veya üstü seçin
2. Download edin (ilk kez ise)
3. **Next** butonuna tıklayın

### Adım 4: AVD Ayarları
1. **AVD Name**: HASENE Test
2. **Advanced Settings** açın:
   - **RAM**: 2048 MB
   - **Internal Storage**: 6 GB
   - **SD Card**: 512 MB
3. **Finish** tıklayın

### Adım 5: Emülatörü Başlatın
1. AVD listesinde **Play** (▶️) butonuna tıklayın
2. Emülatör açılmasını bekleyin (2-3 dakika)

### Adım 6: APK Yükleme
```bash
# Terminal/CMD'de:
adb install "C:\Users\ziyao\Desktop\HASENE-ArabicLearning-STAR-FIX.apk"
```

## Alternatif Yöntem: Drag & Drop
1. APK dosyasını masaüstünden
2. Emülatör ekranına sürükleyip bırakın
3. Yükleme işlemini onaylayın

## Hızlı Test Komutu
```bash
# Capacitor ile direkt çalıştırma:
npx cap run android
```

## Diğer Emülatör Seçenekleri

### BlueStacks (Kolay)
1. BlueStacks indir ve yükle
2. APK dosyasını sürükle bırak
3. Uygulamayı çalıştır

### LDPlayer (Oyun Odaklı)
1. LDPlayer indir ve yükle
2. APK import et
3. Test et

### Genymotion (Profesyonel)
1. Genymotion indir
2. Sanal cihaz oluştur
3. APK yükle

## Kamera Notch Testi İçin
- **Pixel 6 Pro**: Punch-hole kamera
- **Pixel 7**: Centered notch
- **OnePlus 9**: Sol köşe notch

## Sorun Giderme

### Emülatör Açılmıyor
```bash
# Hardware acceleration kontrol
# BIOS'ta VT-x/AMD-V açık olmalı
```

### APK Yüklenmiyor
```bash
# ADB yeniden başlat
adb kill-server
adb start-server
adb devices
```

### Emülatör Yavaş
- RAM arttır (4GB+)
- Hardware acceleration aç
- Graphics: Hardware - GLES 2.0

## Test Edilecekler
- ✅ Header düzeni
- ✅ Kamera notch ile çakışma
- ✅ Streak sayısının konumu
- ✅ Tüm oyun modları
- ✅ Ses çalma