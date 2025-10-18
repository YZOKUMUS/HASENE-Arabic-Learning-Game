# 🏆 HASENE Oyunu - Rozetler Tablosu

## 📊 Mevcut Rozetler Analizi

| **Rozet** | **Kategori** | **Zorluk** | **Koşul** | **Icon** | **Durum** |
|-----------|--------------|------------|-----------|----------|-----------|
| 🕌 İlk Namaz | Başlangıç | ⭐ | 1 oyun oyna | 🎮 | ✅ Aktif |
| 📿 Sabırlı Mümin | Süreklilik | ⭐⭐ | 3 gün streak | 🔥 | ✅ Aktif |
| 🕌 Haftalık Mücahit | Süreklilik | ⭐⭐⭐ | 7 gün streak | 🏅 | ✅ Aktif |
| 📿 Aylık Mücahit | Süreklilik | ⭐⭐⭐⭐⭐ | 30 gün streak | 📅 | ✅ Aktif |
| 📿 Hasene Toplayıcısı | Puan | ⭐⭐ | 100 hasene | 💎 | ✅ Aktif |
| 🕌 Hasene Sultanı | Puan | ⭐⭐⭐ | 500 hasene | 👑 | ✅ Aktif |
| 🕌 Hasene Emiri | Puan | ⭐⭐⭐⭐ | 1000 hasene | 🔥 | ✅ Aktif |
| 🧠 Akıllı Öğrenci | Özel | ⭐⭐⭐ | Yanlış kelimeyi doğru yap | 💡 | ✅ Aktif |
| 📿 Kemâl Sahibi | Performans | ⭐⭐⭐ | 10/10 mükemmel oyun | ⭐ | ✅ Aktif |
| 🕌 Mükemmel Seri | Performans | ⭐⭐⭐⭐ | 5 mükemmel oyun üst üste | 💎 | ✅ Aktif |
| 🕌 Çevik Talebe | Hız | ⭐⭐⭐ | Ortalama 3 saniye | ⚡ | ✅ Aktif |
| 📿 Hızlı Öğrenci | Hız | ⭐⭐⭐⭐ | Ortalama 2 saniye | 🚀 | ✅ Aktif |
| 📿 İlim Hazinesi | Kelime | ⭐⭐⭐ | 50 kelime öğren | 📚 | ✅ Aktif |
| 🕌 Kelime Üstadı | Kelime | ⭐⭐⭐⭐ | 100 kelime öğren | 🎓 | ✅ Aktif |
| 📿 Oyun Bağımlısı | Aktivite | ⭐⭐⭐⭐ | 100 oyun tamamla | 🎮 | ✅ Aktif |
| 🕌 Kuran Sevdalısı | Çeşitlilik | ⭐⭐⭐⭐ | 10 farklı sure | 📖 | ✅ Aktif |
| 📖 Ayet Dinleyici | Ayet | ⭐⭐ | 10 ayet dinle (100 hasene) | 📖 | ✅ Aktif |
| 📿 Dua Dinleyici | Dua | ⭐⭐ | 10 dua dinle | 🤲 | ✅ Aktif |
| 🧩 Boşluk Doldurma Üstadı | Mini Oyun | ⭐⭐⭐ | 10 fillblank oyunu | 🧩 | ✅ Aktif |
| 📝 Ayet Hafızı | Mini Oyun | ⭐⭐⭐⭐ | Fillblank mükemmel | 📚 | ✅ Aktif |

---

## 🚀 Geliştirme Önerileri

### 💡 Yeni Rozet Kategorileri

#### 📚 **Öğrenme Derinliği**
- 🎯 **Kesin Nişancı**: 20 kelimeyi hiç yanlış yapmadan öğren
- 🧠 **Hafıza Ustası**: Bir kelimenin 5 farklı anlamını bil
- 📖 **Tefsir Bilgini**: Aynı kökten 10 kelime öğren

#### ⚡ **Hız ve Refleks**
- 🏃 **Şimşek Refleks**: 1 saniyede doğru cevap ver
- 🎲 **Anlık Karar**: 0.5 saniyede cevap ver (risk-reward)
- 🏆 **Hız Rekortmeni**: Günlük en hızlı 10 cevap

#### 🎮 **Oyun Mastery**
- 🎯 **Çoklu Mod Uzmanı**: Her oyun modundan 10'ar oyun
- 🏅 **Mükemmeliyetçi**: 10 oyun hiç yanlış yapmadan
- 🎪 **Çeşitlilik Ustası**: Aynı gün 5 farklı oyun modu

#### 📅 **Zamansal Başarımlar**
- 🌅 **Erken Kuş**: Sabah 6-8 arası oyna (5 gün)
- 🌙 **Gece Çalışkanı**: Akşam 22-24 arası oyna (5 gün)
- 📆 **Hafta Sonu Savaşçısı**: Hafta sonu 20+ oyun

#### 💫 **Sosyal ve İlerici**
- 📈 **Sürekli Gelişim**: 7 gün üst üste skorunu artır
- 🎊 **Comeback Kid**: 5 yanlıştan sonra 5 doğru
- 🌟 **Motivasyon Ustası**: Streak koruma kullanmadan 15 gün

#### 🎨 **Tema ve İçerik**
- 🕌 **Mekke Yolcusu**: Hac kelimelerini tamamla
- 🌙 **Ramazan Ruhu**: İftar kelimelerini öğren
- 📿 **99 İsim**: Esma-ül Hüsna kelimelerini öğren

### 🔧 Teknik Geliştirmeler

#### 🏆 **Rozet Sistemi v2.0**
```javascript
// Yeni rozet özellikleri
achievements: {
    // Seviyeli rozetler
    haseneCollector: {
        levels: [100, 500, 1000, 5000, 10000],
        titles: ['Toplayıcı', 'Sultan', 'Emir', 'Paşa', 'Hükümdar']
    },
    
    // Zaman bazlı rozetler
    timeBasedAchievements: {
        earlyBird: { timeRange: [6, 8], requirement: 5 },
        nightOwl: { timeRange: [22, 24], requirement: 5 }
    },
    
    // Kombine koşullar
    ultimateScholar: {
        conditions: ['streak30', 'hasene1000', 'wordMaster'],
        type: 'combo'
    }
}
```

#### 📊 **İstatistik Geliştirmeleri**
- 📈 **Günlük/Haftalık/Aylık** performans grafikleri
- 🎯 **Kişisel rekorlar** takibi
- 📋 **Rozet ilerlemesi** progress bar'ları
- 🏅 **Nadir rozet** yüzdeleri

#### 🎨 **Görsel Geliştirmeler**
- ✨ **Animasyonlu rozet** kazanma efektleri
- 🌟 **Parçacık efektleri** (particle effects)
- 🎭 **3D rozet** modelleri
- 🏆 **Rozet vitrin** sayfası

#### 🔔 **Bildirim Sistemi**
- 📱 **Push notification** rozet kazanımları için
- 🎉 **Modal popup** detaylı rozet açıklamaları
- 📊 **İlerleme bildirimleri** (85% tamamlandı vs.)

---

## 🎯 Öncelikli Geliştirme Planı

### ⚡ **Faz 1: Hızlı Eklemeler (1-2 saat)**
1. **Seviyeli Rozetler**: Hasene, Kelime, Oyun sayısı için seviyelendir
2. **Kombine Rozetler**: 2-3 koşulu birleştiren süper rozetler
3. **Zaman Bazlı**: Sabah/Akşam oyun rozetleri

### 🚀 **Faz 2: Orta Vadeli (3-5 saat)**
1. **Görsel Efektler**: Rozet kazanma animasyonları
2. **İlerleme Takibi**: Progress bar'lar ve yüzdelik gösterimler
3. **Rozet Galerisi**: Tüm rozetleri gösteren özel sayfa

### 🏆 **Faz 3: Uzun Vadeli (1 hafta)**
1. **3D Rozet Sistemi**: Three.js ile 3D rozetler
2. **Sosyal Özellikler**: Rozet paylaşımı
3. **Leaderboard**: En çok rozeti olan kullanıcılar

---

## 💭 Hangi Geliştirmeyi Yapalım?

Hangi kategoriyi/özelliği geliştirmek istiyorsun?

1. 🚀 **Hızlı**: Yeni basit rozetler ekle
2. 🎨 **Görsel**: Animasyon ve efektler
3. 📊 **Analitik**: İstatistik ve ilerleme takibi
4. 🏆 **Mega**: Kombine ve çok koşullu rozetler
5. 💡 **Özel**: Kendi fikrin?