# 🚀 HASENE APK Otomatik Build Sistemi

Bu dosya her APK build işlemi öncesi otomatik optimizasyon yapar ve APK boyutunu minimize eder.

## 📋 Kullanım

### ⚡ Hızlı Build (Önerilen)
```bash
npm run build-apk
```
Bu komut şunları yapar:
- ✅ Büyük dosyaları otomatik temizler (*.mp4 vs.)
- ✅ JSON dosyaları minify eder  
- ✅ Cache buster günceller
- ✅ Version numarasını otomatik artırır
- ✅ Capacitor sync + Android build
- ✅ APK'yı otomatik kopyalar
- ✅ Git commit yapar

### 🔧 Diğer Komutlar
```bash
# Sadece optimizasyon (build yok)
npm run optimize

# Build + GitHub push
npm run clean-build

# Manuel hızlı build (optimizasyon yok) 
npm run quick-build
```

## 📱 Çıktı
- **APK Dosyası**: `HASENE-Arabic-Learning-Game-v{version}-OPTIMIZED.apk`
- **Boyut**: ~6-8 MB (optimize edilmiş)
- **Otomatik versiyonlama**: Timestamp bazlı

## 🎯 Optimizasyon Detayları

### Kaldırılan Dosyalar:
- `game-music.mp4` (20+ MB) 
- Diğer büyük medya dosyaları

### Minify Edilen:
- `data.json` (~4 MB → ~3 MB)
- `ayetoku.json` (~3 MB → ~2.5 MB)  
- `dualar.json`

### Cache Management:
- CSS/JS dosya versiyonları otomatik güncellenir
- Mobile cache sorunları çözülür
- APP_VERSION otomatik artırılır

## 🔄 Her Build'de Otomatik:
1. 🧹 Büyük dosya temizliği
2. 📄 JSON minification
3. 🔄 Cache invalidation  
4. 📝 Version bump
5. 📱 APK build
6. 💾 Git commit
7. 📊 Boyut raporu

## ⚠️ Önemli Notlar:
- APK boyutu ~26 MB normal (16,240 Kuran kelimesi içeriği)
- Build süresi ~30 saniye
- İlk çalıştırmada gradle wrapper indirilir
- Windows PowerShell gerekli

## 🐛 Sorun Giderme:
```bash
# Gradle temizliği
cd android && .\gradlew.bat clean

# Capacitor yeniden sync
npx cap sync android --force

# Node modules temizliği  
rm -rf node_modules && npm install
```