# 🕌 HASENE - İslami Arapça Öğrenme Oyunu

**Duolingo tarzında, İslami temalarla geliştirilmiş interaktif Arapça öğrenme oyunu**

![HASENE Logo](icon-192-v4-RED-MUSHAF.png)

---

## 🚀 APK BUILD KILAVUZU - HIZLI ERİŞİM

### 📱 **TEK KOMUT İLE APK OLUŞTURMA**

| **Durum** | **Komut** | **APK Dosya Adı** | **Ne Zaman Kullan?** |
|-----------|-----------|-------------------|---------------------|
| 📱 **Test/WhatsApp** | `npm run build-apk-simple` | `HASENE-Arabic-Learning-Game-LATEST.apk` | WhatsApp'a gönderirken ✅ |
| 📅 **Günlük Çalışma** | `npm run build-apk` | `HASENE-Arabic-Learning-Game-FINAL-2025-10-24.apk` | Geliştirme sırasında |
| 🏆 **Final Sürüm** | `npm run build-apk-release` | `HASENE-Arabic-Learning-Game-RELEASE-v2.1.apk` | Dağıtım için |
| 📊 **Version Takip** | `npm run build-apk-version` | `HASENE-Arabic-Learning-Game-v2.1.20385.apk` | Build numarası takibi |

### ⚡ **EN ÇOK KULLANILAN**
```bash
# 🎯 Test için (Önerilen) - Aynı isim, karışıklık yok
npm run build-apk-simple

# 📅 Günlük build - Tarih ile versiyon
npm run build-apk
```

### 🔧 **DİĞER KOMUTLAR**
```bash
npm run optimize        # Sadece optimizasyon (build yok)
npm run clean-build     # Build + GitHub push
npm run quick-build     # Manuel build (optimizasyon yok)
```

### 📊 **APK BİLGİLERİ**
- **Boyut**: ~26-27 MB (Kuran 16,240 kelime dahil - Normal!)
- **Build Süresi**: ~30 saniye
- **Otomatik**: Optimizasyon + Cache temizleme + Git commit

### ⚠️ **HATIRLATMALAR**
- PowerShell kullanın (Windows)
- İlk build'de gradle wrapper indirilir (~1 dk)
- APK boyutu normal (Kuran uygulamaları 25-50 MB arası)

---

## ✨ Özellikler

### 🎮 Oyun Mekanikleri
- **Duolingo tarzı** öğrenme deneyimi
- **Hasene sistemi**: Arapça harfler × 10 puan
- **3 farklı oyun modu**: Çeviri, Ters çeviri, Ses tanıma
- **10 soru** ile tamamlanan oyun seansları
- **Progresif zorluk** seviyesi

### 🕌 İslami Temalar
- **Hadis-i Şerifler** loading ekranında
- **Manevi rozetler** ve başarımlar
- **İslami renkler** ve tasarım
- **Dini terimlerle** başarım isimleri

### 🏆 Başarı Sistemi
- **🕌 İlk Namaz**: İlk oyunu tamamlama
- **📿 Sabırlı Mümin**: 3 günlük streak
- **🕌 Haftalık Mücahit**: 7 günlük streak
- **📿 Hasene Toplayıcısı**: 100 hasene toplama
- **🕌 Hasene Sultanı**: 500 hasene toplama
- **📿 Kemâl Sahibi**: Mükemmel oyun (10/10)
- **🕌 Çevik Talebe**: Hızlı cevaplama
- **📿 İlim Hazinesi**: 50 kelime öğrenme

### 📊 Takip Sistemi
- **Günlük streak** takibi
- **Takvim görünümü** ile ilerleme
- **Detaylı istatistikler** paneli
- **Hasene geçmişi** grafiği

### 📱 Teknik Özellikler
- **PWA (Progressive Web App)** desteği
- **Offline** çalışabilir
- **Responsive** tasarım (mobil uyumlu)
- **LocalStorage** ile veri saklama
- **Service Worker** ile cache

## 🚀 Kurulum ve Çalıştırma

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/[kullanıcı-adı]/HASENE-Arabic-Learning-Game.git
cd HASENE-Arabic-Learning-Game
```

### 2. Yerel Sunucu Başlatın
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx http-server

# PHP ile
php -S localhost:8000
```

### 3. Tarayıcıda Açın
```
http://localhost:8000
```

## 🎯 Nasıl Oynanır?

1. **🕌 Loading**: Hadis okuyarak manevi hazırlık yapın
2. **🎮 Oyun Seç**: Ana menüden oyun türünü seçin
3. **📝 Cevapla**: 10 soruyu doğru cevaplayın
4. **📿 Hasene Kazan**: Her Arapça harf 10 hasene getirir
5. **🏆 Rozet Aç**: Başarımları tamamlayarak rozet kazanın
6. **📅 Streak**: Her gün oynayarak streak'inizi koruyun

## 🛠️ Teknolojiler

- **HTML5** - Semantik yapı
- **CSS3** - Glassmorphism ve İslami tema
- **Vanilla JavaScript** - Oyun mantığı
- **PWA** - Offline çalışma
- **LocalStorage** - Veri kalıcılığı
- **Service Worker** - Cache yönetimi

## 📂 Dosya Yapısı

```
📁 HASENE-Arabic-Learning-Game/
├── 📄 index.html          # Ana sayfa
├── 📄 style.css           # Stil dosyası
├── 📄 script.js           # Oyun mantığı
├── 📄 manifest.json       # PWA ayarları
├── 📄 sw.js               # Service Worker
├── 📄 data.json           # Kelime veritabanı
├── 🖼️ icon-TÜRK-KURAN-192.png     # Uygulama ikonu (192x192)
├── 🖼️ icon-TÜRK-KURAN-512.png     # Uygulama ikonu (512x512)
├── 🔊 success.mp3         # Başarı sesi
├── 🔊 failure.mp3         # Hata sesi
└── 🔊 celebration.mp3     # Kutlama sesi
```

## 🎨 Ekran Görüntüleri

### Ana Menü
![Ana Menü](screenshots/main-menu.png)

### Oyun Ekranı
![Oyun Ekranı](screenshots/game-screen.png)

### Başarım Paneli
![Başarımlar](screenshots/achievements.png)

## 🤝 Katkıda Bulunma

1. Bu repository'yi **fork** edin
2. Yeni bir **branch** oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi **commit** edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi **push** edin (`git push origin yeni-ozellik`)
5. **Pull Request** oluşturun

## 📝 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🙏 İlham ve Teşekkür

- **Duolingo** - Oyun mekaniklerinde ilham
- **İslami değerler** - Manevi boyut
- **Arapça dili** - Kutsal dil öğretimi
- **Modern web teknolojileri** - Teknik altyapı

## 📞 İletişim

- **GitHub Issues**: Hata bildirimleri ve öneriler
- **Email**: [email@example.com]
- **Twitter**: [@kullanıcı-adı]

---

**"إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ"**  
*"Şüphesiz Allah, iyilik yapanların mükâfatını zayi etmez."* 

🕌📿 **Hayırlı öğrenmeler dileriz!** 📿🕌