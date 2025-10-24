# 🚀 HASENE APK Otomatik Build Sistemi

Bu dosya her APK build işlemi öncesi otomatik optimizasyon yapar ve APK boyutunu minimize eder.

## 📋 Kullanım

### ⚡ APK Build Komutları:

```bash
# 📅 Günlük APK (önerilen) - HASENE-Arabic-Learning-Game-FINAL-2025-10-24.apk
npm run build-apk

# 📱 Basit APK - HASENE-Arabic-Learning-Game-LATEST.apk  
npm run build-apk-simple

# 📊 Versiyonlu APK - HASENE-Arabic-Learning-Game-v2.1.19999.apk
npm run build-apk-version

# 🏆 Release APK - HASENE-Arabic-Learning-Game-RELEASE-v2.1.apk
npm run build-apk-release
```

Her komut şunları yapar:
- ✅ Büyük dosyaları otomatik temizler (*.mp4 vs.)
- ✅ JSON dosyaları minify eder  
- ✅ Cache buster günceller
- ✅ Version numarasını otomatik artırır
- ✅ Capacitor sync + Android build
- ✅ APK'yı belirlenen isimle kopyalar
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

## 📱 APK İsimlendirme Sistemı

| Komut | APK Dosya Adı | Açıklama |
|-------|---------------|----------|
| `npm run build-apk` | `HASENE-Arabic-Learning-Game-FINAL-2025-10-24.apk` | 📅 Günlük build (önerilen) |
| `npm run build-apk-simple` | `HASENE-Arabic-Learning-Game-LATEST.apk` | 📱 Sabit isim (üzerine yazar) |
| `npm run build-apk-version` | `HASENE-Arabic-Learning-Game-v2.1.19999.apk` | 📊 Version numaralı |
| `npm run build-apk-release` | `HASENE-Arabic-Learning-Game-RELEASE-v2.1.apk` | 🏆 Release versiyonu |

- **Boyut**: ~26-27 MB (Kuran veritabanı dahil)
- **Format**: Otomatik isimlendirme

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