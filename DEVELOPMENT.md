# 🛡️ HASENE - Kod Tutarlılık Kılavuzu

## 🔧 Geliştirme Workflow'u

### ⚡ Hızlı Kullanım
```powershell
# Her değişiklik sonrası çalıştır
.\workflow.ps1

# Sadece senkronizasyon (git/build olmadan)
.\workflow.ps1 -skipGit -skipBuild

# Özel commit mesajı ile
.\workflow.ps1 -commitMessage "Streak sistemi düzeltildi"
```

### 📋 Mevcut Scriptler

| Script | Açıklama | Kullanım |
|--------|----------|----------|
| `workflow.ps1` | Tam geliştirme döngüsü | `.\workflow.ps1` |
| `sync-files.ps1` | Dosya senkronizasyonu | `.\sync-files.ps1` |
| `check-consistency.ps1` | Kod tutarlılık kontrolü | `.\check-consistency.ps1` |

### 🔄 Dosya Senkronizasyon Hedefleri

1. **Ana Dizin** (`/`)
   - `script.js`, `style.css`, `index.html`
   - Geliştirme ve test için kullanılır

2. **WWW Dizini** (`/www/`)
   - Capacitor web assets
   - APK build'de kullanılır

3. **Android Assets** (`/android/app/src/main/assets/www/`)
   - APK içine gömülen dosyalar
   - Final APK'da kullanılır

### 🎯 Kritik Fonksiyonlar (Senkronizasyon Zorunlu)

- `calculateTotalHaseneFromDaily()` - Toplam hasene hesaplama
- `storeDailyHasene()` - Günlük hasene kaydetme
- `updateGameStats()` - İstatistik güncelleme
- `showStats()` - İstatistik gösterme
- `earnedHasene` - Hasene kazanma mantığı

### ⚠️ Önemli Kurallar

1. **Asla sadece bir dosyada değişiklik yapma**
2. **Her değişiklikten sonra senkronizasyon yap**
3. **Kritik fonksiyonlarda test yap**
4. **Git commit'inden önce tutarlılık kontrolü yap**

### 🚨 Sorun Giderme

```powershell
# Dosyalar senkronize değilse
.\check-consistency.ps1
.\sync-files.ps1

# APK'da güncellemeler gözükmüyorsa
.\workflow.ps1 -commitMessage "APK sync fix"

# Sadece local test için
.\workflow.ps1 -skipGit -skipBuild
```

### 💡 VSCode Entegrasyonu

Komut paleti açın (`Ctrl+Shift+P`) ve şunları yazın:
- `Tasks: Run Task` → `🔄 Sync Files`
- `Tasks: Run Task` → `🔍 Check Consistency`  
- `Tasks: Run Task` → `🚀 Full Workflow`
- `Tasks: Run Task` → `🚀 Quick Sync (No Git/Build)`

### 📱 Test Ortamları

- **Local Dev:** http://localhost:8080
- **GitHub Pages:** https://yzokumus.github.io/HASENE-Arabic-Learning-Game/
- **Android APK:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

**🔥 Altın Kural:** Her kod değişikliğinden sonra `.\workflow.ps1` çalıştır!