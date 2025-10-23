// 🏷️ Version Management System
const APP_VERSION = {
    version: "2.0.0",
    buildDate: "2025-10-20",
    buildTime: "00:26",
    buildNumber: "1020-0026",
    codeStatus: "Ultra Clean",
    copyright: "© 2025 YZOKUMUS",
    features: ["Console.log Cleanup", "RED-MUSHAF Icons", "Calendar Sync", "Production Ready"]
};

// Update version info in UI
function updateVersionInfo() {
    const buildInfoElement = document.getElementById('buildInfo');
    if (buildInfoElement) {
        const buildText = `Build: ${APP_VERSION.buildNumber} | ${APP_VERSION.codeStatus}`;
        buildInfoElement.textContent = buildText;
        buildInfoElement.title = `Version ${APP_VERSION.version} | Built: ${APP_VERSION.buildDate} ${APP_VERSION.buildTime} | Features: ${APP_VERSION.features.join(', ')}`;
    }
}

// Sound Manager Class
class SoundManager {
        constructor() {
            this.audioGenerator = null;
            this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        this.musicLoop = null;
        this.initSound();
    }

    initSound() {
        // AudioGenerator'ı yükle
        if (typeof AudioGenerator !== 'undefined') {
            this.audioGenerator = new AudioGenerator();
        } else {
            console.warn('AudioGenerator yüklenemedi');
        }
    }

    // Ses açma/kapama
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        return this.soundEnabled;
    }

    // Müzik açma/kapama  
    toggleMusic() {
        // Yeni background müzik sistemini çağır
        const backgroundMusic = document.getElementById('backgroundMusic');
        const musicIcon = document.getElementById('musicIcon');
        const musicBtn = document.getElementById('musicToggle');
        
        if (!backgroundMusic) {
            return false;
        }

        if (backgroundMusic.paused) {
            // Müziği başlat
            backgroundMusic.volume = 0.5; // Ses seviyesi %50
            
            backgroundMusic.play().then(() => {
                musicIcon.className = 'fas fa-music';
                musicBtn.classList.remove('disabled');
                musicBtn.style.opacity = '1';
                localStorage.setItem('backgroundMusicEnabled', 'true');
                this.musicEnabled = true;
            }).catch(error => {
                this.musicEnabled = false;
            });
        } else {
            // Müziği durdur
            backgroundMusic.pause();
            musicIcon.className = 'fas fa-music-slash';
            musicBtn.classList.add('disabled');
            musicBtn.style.opacity = '0.5';
            localStorage.setItem('backgroundMusicEnabled', 'false');
            this.musicEnabled = false;
        }
        
        return this.musicEnabled;
    }

    // Doğru cevap sesi
    playCorrect() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playCorrectSound();
        }
    }

    // Yanlış cevap sesi
    playIncorrect() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playIncorrectSound();
        }
    }

    // Buton tıklama sesi
    playClick() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playClickSound();
        }
    }

    // Buton hover sesi
    playHover() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playHoverSound();
        }
    }

    // Level atlama sesi
    playLevelUp() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playLevelUpSound();
        }
    }

    // Rozet kazanma sesi
    playAchievement() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playAchievementSound();
        }
    }

    // Başarı fanfarı
    playSuccess() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playSuccessFanfare();
        }
    }

    // 🎉 Seviye tamamlama fanfarı
    playVictory() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playVictoryFanfare();
        }
    }

    // ⭐ Mükemmel skor fanfarı (tüm cevaplar doğru)
    playPerfect() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playPerfectFanfare();
        }
    }

    // 🏆 Başarım kazanma fanfarı
    playAchievementUnlocked() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playAchievementFanfare();
        }
    }

    // 🔥 Streak milestone fanfarı
    playStreak() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playStreakFanfare();
        }
    }

    // Kalp kaybı sesi
    playHeartLost() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playHeartLostSound();
        }
    }

    // Arka plan müziği başlat
    startBackgroundMusic() {
        // Müzik çalma devre dışı bırakıldı
        return;
    }

    // Arka plan müziği durdur
    stopBackgroundMusic() {
        // Müzik durdurma devre dışı bırakıldı
        return;
    }
}

// Global SoundManager instance
if (typeof window.soundManager === 'undefined') {
    window.soundManager = new SoundManager();
}

// Ayet Dinle ve Oku görevini tetikleyen fonksiyon
async function showAyetTask() {
    
    // Zorluk sistemine entegre et - önce localStorage'dan oku
    let difficulty = localStorage.getItem('difficulty') || 'medium';
    
    // Normalize et (Türkçe değerler varsa İngilizce'ye çevir)
    const migrationMap = {
        'kolay': 'easy',
        'orta': 'medium', 
        'zor': 'hard'
    };
    if (migrationMap[difficulty]) {
        difficulty = migrationMap[difficulty];
    }
    
    // Geçerli değer kontrolü
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        difficulty = 'medium';
    }
    
    const game = window.arabicLearningGame;
    let ayetler = [];
    
    if (game && game.ayetData && game.ayetData.length > 0) {
        ayetler = game.getDifficultyAyets(game.ayetData, difficulty);
    } else {
        console.warn('⚠️ Game instance bulunamadı, manuel filtreleme yapılacak');
    }
    
    // Fallback: Eğer zorluk sistemi çalışmazsa normal yükleme
    if (ayetler.length === 0) {
        let response = await fetch('ayetoku.json');
        let allAyetler = await response.json();
        
        // Manuel filtreleme yap
        ayetler = allAyetler.filter(ayet => {
            if (!ayet || !ayet['ayahs.text_uthmani_tajweed']) return false;
            const arabicText = ayet['ayahs.text_uthmani_tajweed'];
            const wordCount = arabicText.split(/\s+/).filter(word => word.length > 2).length;
            
            switch(difficulty) {
                case 'easy': return wordCount >= 3 && wordCount <= 6;
                case 'medium': return wordCount >= 7 && wordCount <= 12;
                case 'hard': return wordCount >= 13;
                default: return true;
            }
        });
        
        // Eğer hâlâ boşsa tümünü al
        if (ayetler.length === 0) {
            ayetler = allAyetler;
        }
    }
    
    let randomIndex = Math.floor(Math.random() * ayetler.length);
    let ayet = ayetler[randomIndex];
    
    let modal = document.createElement('div');
    modal.id = 'ayetModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:16px;border-radius:16px;max-width:90vw;max-height:85vh;overflow-y:auto;text-align:center;box-shadow:0 2px 16px #0002;position:relative;">
            <!-- X Butonu (Sağ üst köşe) -->
            <button onclick="document.body.removeChild(document.getElementById('ayetModal'))" style="position:absolute;top:8px;right:8px;width:32px;height:32px;border:none;background:rgba(0,0,0,0.1);border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;">×</button>
            
            <h2 style="font-size:1.2em;margin-bottom:8px;margin-top:24px;">Ayet Dinle &amp; Oku</h2>
            <div style="font-size:1.0em;color:#3f51b5;margin-bottom:6px;"><span style='color:#888;font-size:0.85em;'>(${ayet.ayet_kimligi})</span></div>
            
            <!-- Scrollable Ayet Text -->
            <div style="font-family:'Amiri',serif;font-size:0.95em;color:#009688;margin-bottom:12px;line-height:1.6;max-height:30vh;overflow-y:auto;padding:8px;border:1px solid #e0e0e0;border-radius:8px;background:#f9f9f9;">${ayet["ayahs.text_uthmani_tajweed"] || ''}</div>
            
            <!-- Scrollable Meal -->
            <div style="font-size:0.85em;margin-bottom:12px;line-height:1.4;max-height:20vh;overflow-y:auto;padding:8px;text-align:left;border:1px solid #e0e0e0;border-radius:8px;background:#f5f5f5;">${ayet.meal}</div>
            
            <audio id="ayetAudio" src="${ayet.ayet_ses_dosyasi}" controls style="width:100%;margin-bottom:12px;"></audio>
            
            <!-- Alt Kapat Butonu (Her zaman görünür) -->
            <button onclick="document.body.removeChild(document.getElementById('ayetModal'))" style="width:100%;padding:12px;background:#4CAF50;color:white;border:none;border-radius:8px;font-size:1.0em;cursor:pointer;font-weight:bold;">Kapat</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal dışına tıklayınca kapat
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Ayet dinlendiğinde hasene kazandır
    const ayetAudio = document.getElementById('ayetAudio');
    let haseneGiven = false;
    function giveAyetHasene() {
        if (!haseneGiven) {
            let ayetHasene = parseInt(localStorage.getItem('ayetHasene')) || 0;
            ayetHasene += 10;
            localStorage.setItem('ayetHasene', ayetHasene.toString());
            
            // Ayet dinleme sayısını artır (istatistik için)
            let ayetListens = parseInt(localStorage.getItem('ayetListens')) || 0;
            ayetListens += 1;
            localStorage.setItem('ayetListens', ayetListens.toString());
            
            // Toplam ve günlük hasene'ye de ekle
            let totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
            totalHasene += 10;
            localStorage.setItem('totalHasene', totalHasene.toString());
            let dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            dailyHasene += 10;
            localStorage.setItem('dailyHasene', dailyHasene.toString());
            if (document.getElementById('haseneCount')) {
                document.getElementById('haseneCount').textContent = totalHasene;
            }
            if (document.getElementById('haseneCountBottom')) {
                document.getElementById('haseneCountBottom').textContent = totalHasene;
            }
            if (document.getElementById('dailyHasene')) {
                document.getElementById('dailyHasene').textContent = dailyHasene;
            }
            haseneGiven = true;
        }
    }
    if (ayetAudio) {
        ayetAudio.addEventListener('ended', giveAyetHasene);
    }
    // Modal kapatılırken de hasene ver (dinlenmişse)
    modal.querySelector('button[onclick]')?.addEventListener('click', giveAyetHasene);
}

// Dua dinleme görevini tetikleyen fonksiyon
async function showDuaTask() {
    // dualar.json dosyasını oku
    let response = await fetch('dualar.json');
    let dualar = await response.json();
    // Rastgele dua seç
    let randomIndex = Math.floor(Math.random() * dualar.length);
    let dua = dualar[randomIndex];

    // Modal oluştur
    let modal = document.createElement('div');
    modal.id = 'duaModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:32px 24px;border-radius:16px;max-width:400px;text-align:center;box-shadow:0 2px 16px #0002;">
            <h2 style="font-size:1.3em;margin-bottom:10px;">Dua Dinle</h2>
            <div style="font-family:'Amiri',serif;font-size:1.0em;color:#009688;margin-bottom:10px;">${dua.dua}</div>
            <div style="font-size:0.9em;margin-bottom:10px;">${dua.tercume}</div>
            <audio id="duaAudio" src="${dua.ses_url}" controls style="width:100%;margin-bottom:10px;"></audio>
            <br><button onclick="document.body.removeChild(document.getElementById('duaModal'))" style="margin-top:10px;background:#eee;color:#333;padding:6px 18px;border:none;border-radius:8px;font-size:0.9em;cursor:pointer;">Kapat</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Dua dinlendiğinde otomatik hasene ekle
    const duaAudio = document.getElementById('duaAudio');
    let haseneGiven = false;
    function giveDuaHasene() {
        if (!haseneGiven) {
            let listenedDuaCount = parseInt(localStorage.getItem('listenedDuaCount')) || 0;
            listenedDuaCount++;
            localStorage.setItem('listenedDuaCount', listenedDuaHasene);
            
            // Dua dinleme sayısını artır (istatistik için)
            let duaListens = parseInt(localStorage.getItem('duaListens')) || 0;
            duaListens += 1;
            localStorage.setItem('duaListens', duaListens.toString());
            
            let haseneEarned = 10;
            let totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
            totalHasene += haseneEarned;
            localStorage.setItem('totalHasene', totalHasene);
            let dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            dailyHasene += haseneEarned;
            localStorage.setItem('dailyHasene', dailyHasene);
            if (document.getElementById('haseneCount')) {
                document.getElementById('haseneCount').textContent = totalHasene;
            }
            if (document.getElementById('haseneCountBottom')) {
                document.getElementById('haseneCountBottom').textContent = totalHasene;
            }
            if (document.getElementById('dailyHasene')) {
                document.getElementById('dailyHasene').textContent = dailyHasene;
            }
            haseneGiven = true;
        }
    }
    if (duaAudio) {
        duaAudio.addEventListener('ended', giveDuaHasene);
    }
    // Modal kapatılırken de hasene ver (dinlenmişse)
    modal.querySelector('button[onclick]')?.addEventListener('click', giveDuaHasene);
}

// Duolingo-style Game Logic - Updated
class ArabicLearningGame {
    constructor() {
        this.wordData = [];
            this.currentQuestion = 0;
            this.score = 0;
            this.hearts = 5; // Duolingo gibi 5 kalp
            this.gameXP = 0;
        
        // Sınırsız kalp kontrolü - şimdilik devre dışı
        unlimitedHeartsActive = false; // localStorage.getItem('unlimitedHearts') === 'true';
        
        // Production için hasene sistemi
        this.totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
        
        // 9. ✅ BAŞLANGIÇTA LOAD - tutarlı veri yükleme
        this.loadGameData();
        
        this.streak = parseInt(localStorage.getItem('streak')) || 0;
        // Progressive level system - Her seviye daha zor
        this.level = this.calculateLevel(this.totalHasene);
        this.xp = this.totalHasene;
        this.xpToNextLevel = this.getXPRequiredForLevel(this.level + 1) - this.totalHasene;
        // dailyHasene zaten loadGameData() ile yüklendi, tekrar yüklemeye gerek yok
        this.lastPlayDate = localStorage.getItem('lastPlayDate') || '';
        this.wordsLearned = 0; // Dinamik olarak hesaplanacak
        this.totalAnswers = parseInt(localStorage.getItem('totalAnswers')) || 0;
        this.correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
        this.gameMode = 'translation';
        // 🔧 Güvenli difficulty initialization
        const rawDifficulty = localStorage.getItem('difficulty') || 'medium';
        this.difficulty = this.normalizeDifficulty(rawDifficulty);
        // Storage'ı da normalize et
        localStorage.setItem('difficulty', this.difficulty);
        this.questions = [];
        this.currentAudio = null;
        this.dataLoaded = false; // Flag to track data loading completion
        
        // Legacy difficulty migration (artık normalizeDifficulty ile otomatik)
        this.migrateDifficultyValues();
        
        // Calendar variables
        const now = new Date();
        this.currentCalendarMonth = now.getMonth();
        this.currentCalendarYear = now.getFullYear();
        
        this.initializeAchievements();
        this.init();
        
        // 🔄 Initialization sonrası UI'ı güncelle
        this.updateUI();
    }
    
    // Türkçe difficulty değerlerini İngilizce'ye migrate et
    migrateDifficultyValues() {
        const currentDifficulty = localStorage.getItem('difficulty');
        let migratedValue = null;
        
        // Türkçe -> İngilizce mapping
        const migrationMap = {
            'kolay': 'easy',
            'orta': 'medium', 
            'zor': 'hard'
        };
        
        if (currentDifficulty && migrationMap[currentDifficulty]) {
            migratedValue = migrationMap[currentDifficulty];
            localStorage.setItem('difficulty', migratedValue);
            this.difficulty = migratedValue;
        }
    }

    // 🔧 ZORLUK DEĞERİ NORMALİZASYON SİSTEMİ
    normalizeDifficulty(difficulty) {
        // Canonical değerler: 'easy', 'medium', 'hard'
        const canonicalMap = {
            // Türkçe mappings
            'kolay': 'easy',
            'orta': 'medium', 
            'zor': 'hard',
            // İngilizce (zaten canonical)
            'easy': 'easy',
            'medium': 'medium',
            'hard': 'hard',
            // Fallback mappings
            'e': 'easy',
            'm': 'medium', 
            'h': 'hard',
            '1': 'easy',
            '2': 'medium',
            '3': 'hard'
        };
        
        // Normalize et
        const normalized = canonicalMap[difficulty?.toLowerCase()] || 'medium';
        
        // Debug
        if (difficulty !== normalized) {
        }
        
        return normalized;
    }

    // 🔧 DİFFICULTY GÜVENLİ GETTER
    getDifficulty() {
        return this.normalizeDifficulty(this.difficulty);
    }

    // 🔧 DİFFICULTY GÜVENLİ SETTER  
    setDifficulty(newDifficulty) {
        const normalized = this.normalizeDifficulty(newDifficulty);
        this.difficulty = normalized;
        localStorage.setItem('difficulty', normalized);
        
        // 🧹 Cache'i temizle ki değişiklik hemen etkili olsun
        this.cachedDifficultyWords = null;
        this.cachedDifficultyAyets = null;
        
        return normalized;
    }
    
    initializeAchievements() {
        // Başarımları tanımla - İslami Temalar 🕌📿
    this.achievements = {
            ayetListener: {
                id: 'ayetListener',
                title: '📖 Ayet Dinleyici',
                description: '10 ayet dinledin!',
                icon: 'fas fa-book-open',
                condition: () => {
                    let ayetHasene = parseInt(localStorage.getItem('ayetHasene')) || 0;
                    return ayetHasene >= 100; // 10 ayet x 10 hasene
                }
            },
            duaListener: {
                id: 'duaListener',
                title: '📿 Dua Dinleyici',
                description: '10 farklı dua dinledin! Dualarla kalbin huzur buldu.',
                icon: 'fas fa-pray',
                condition: () => (parseInt(localStorage.getItem('listenedDuaCount')) || 0) >= 10
            },
            firstGame: {
                id: 'firstGame',
                title: '🕌 İlk Namaz',
                description: 'İlk öğrenme yolculuğunuzu başlattınız!',
                icon: 'fas fa-play',
                condition: () => this.stats.gamesPlayed >= 1
            },
            streak3: {
                id: 'streak3',
                title: '📿 Sabırlı Mümin',
                description: '3 gün üst üste sebat gösterdiniz!',
                icon: 'fas fa-fire',
                condition: () => this.stats.currentStreak >= 3
            },
            streak7: {
                id: 'streak7',
                title: '🕌 Haftalık Mücahit',
                description: '7 gün üst üste ilimle mücadele ettiniz!',
                icon: 'fas fa-medal',
                condition: () => this.stats.currentStreak >= 7
            },
            hasene100: {
                id: 'hasene100',
                title: '📿 Hasene Toplayıcısı',
                description: '100 hasene ile sevap defterin güzelleşti!',
                icon: 'fas fa-gem',
                condition: () => this.stats.totalHasene >= 100
            },
            hasene500: {
                id: 'hasene500',
                title: '🕌 Hasene Sultanı',
                description: '500 hasene! Allah razı olsun!',
                icon: 'fas fa-crown',
                condition: () => this.stats.totalHasene >= 500
            },
            smartLearner: {
                id: 'smartLearner',
                title: '🧠 Akıllı Öğrenci',
                description: 'Yanlış yaptığın bir kelimeyi doğru yaptın! Bu öğrenmenin gücüdür.',
                icon: 'fas fa-lightbulb',
                condition: () => {
                    // Bu achievement özel olarak checkSmartLearner() fonksiyonunda kontrol edilecek
                    return false;
                }
            },
            perfect10: {
                id: 'perfect10',
                title: '📿 Kemâl Sahibi',
                description: 'Mükemmel performans! 10/10 doğru!',
                icon: 'fas fa-star',
                condition: () => this.stats.perfectGames >= 1
            },
            speedster: {
                id: 'speedster',
                title: '🕌 Çevik Talebe',
                description: 'Hızlı öğrenme! Ortalama 3 saniye!',
                icon: 'fas fa-bolt',
                condition: () => this.stats.averageTime <= 3000
            },
            wordMaster: {
                id: 'wordMaster',
                title: '📿 İlim Hazinesi',
                description: '50 kelime! İlim tahsil etmeye devam!',
                icon: 'fas fa-book',
                condition: () => this.stats.wordsLearned >= 50
            },
            hasene1000: {
                id: 'hasene1000',
                title: '🕌 Hasene Emiri',
                description: '1000 hasene! Masha Allah!',
                icon: 'fas fa-fire',
                condition: () => this.stats.totalHasene >= 1000
            },
            streak30: {
                id: 'streak30',
                title: '📿 Aylık Mücahit',
                description: '30 gün streak! İnanılmaz kararlılık!',
                icon: 'fas fa-calendar-check',
                condition: () => this.stats.currentStreak >= 30
            },
            wordGuru: {
                id: 'wordGuru',
                title: '🕌 Kelime Üstadı',
                description: '100 kelime öğrendin! Ustasın!',
                icon: 'fas fa-graduation-cap',
                condition: () => this.stats.wordsLearned >= 100
            },
            fastLearner: {
                id: 'fastLearner',
                title: '📿 Hızlı Öğrenci',
                description: 'Ortalama 2 saniye! Çok hızlısın!',
                icon: 'fas fa-rocket',
                condition: () => this.stats.averageTime <= 2000
            },
            perfectStreak: {
                id: 'perfectStreak',
                title: '🕌 Mükemmel Seri',
                description: '5 mükemmel oyun üst üste!',
                icon: 'fas fa-diamond',
                condition: () => this.stats.perfectStreak >= 5
            },
            gameAddict: {
                id: 'gameAddict',
                title: '📿 Oyun Bağımlısı',
                description: '100 oyun tamamladın!',
                icon: 'fas fa-gamepad',
                condition: () => this.stats.gamesPlayed >= 100
            },
            quranLover: {
                id: 'quranLover',
                title: '🕌 Kuran Sevdalısı',
                description: 'Her sure türünden kelime öğrendin!',
                icon: 'fas fa-quran',
                condition: () => this.getUniqueSuras() >= 10
            },
            fillBlankMaster: {
                id: 'fillBlankMaster',
                title: '🧩 Boşluk Doldurma Üstadı',
                description: '10 boşluk doldurma oyunu tamamladın! Ayetleri iyi biliyorsun!',
                icon: 'fas fa-puzzle-piece',
                condition: () => (parseInt(localStorage.getItem('fillblankGames')) || 0) >= 10
            },
            fillBlankPerfect: {
                id: 'fillBlankPerfect',
                title: '📝 Ayet Hafızı',
                description: 'Boşluk doldurma oyununda mükemmel skor! Ayetleri ezberlemişsin!',
                icon: 'fas fa-book-reader',
                condition: () => {
                    // Son fillblank oyununda %100 başarı gösterdi mi?
                    const lastFillBlankScore = localStorage.getItem('lastFillBlankPerfect');
                    return lastFillBlankScore === 'true';
                }
            },
            ayahExplorer: {
                id: 'ayahExplorer',
                title: '🔍 Ayet Araştırmacısı',
                description: '50 farklı ayetten kelime öğrendin! Kur\'an keşfin devam ediyor!',
                icon: 'fas fa-search',
                condition: () => (parseInt(localStorage.getItem('fillblankGames')) || 0) >= 50
            }
        };

        // İstatistikler
        this.stats = {
            gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
            totalHasene: this.totalHasene,
            currentStreak: this.streak,
            perfectGames: parseInt(localStorage.getItem('perfectGames')) || 0,
            averageTime: parseInt(localStorage.getItem('averageTime')) || 0,
            wordsLearned: this.wordsLearned,
            totalAnswers: this.totalAnswers,
            correctAnswers: this.correctAnswers
        };

        // Başarım verilerini yükle
        this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
    }
    
    setupAchievementListeners() {
        // Achievements button
        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                this.showAchievements();
            });
        }
        
        // Stats button  
        const statsBtn = document.getElementById('statsBtn');
        if (statsBtn) {
            statsBtn.addEventListener('click', () => {
                this.showStats();
            });
        }
        
        // Close modal on overlay click (for .modal class)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    getUniqueSuras() {
        if (!this.words || this.words.length === 0) {
            return 0;
        }
        
        // Benzersiz sure sayısını hesapla
        const uniqueSuras = new Set();
        this.words.forEach(word => {
            if (word.sure) {
                uniqueSuras.add(word.sure);
            }
        });
        
        return uniqueSuras.size;
    }
    
    async init() {
        // Show loading screen
        this.showScreen('loadingScreen');
        
        try {
            // Start loading animation (this will manage the loading process)
            this.startLoadingAnimation();
            
            // Load word data in background
            await this.loadWordData();
            
            // Update UI (streak will be checked when game is completed)
            this.updateUI();
            
            // Initialize difficulty UI
            this.initializeDifficultyUI();
            
            // Set flag that data is loaded - loading animation will check this
            this.dataLoaded = true;
        } catch (error) {
            console.error('Game initialization failed:', error);
            alert('Oyun yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        }
    }
    
    async loadWordData() {
        try {
            
            // Kelime verileri yükle
            const wordResponse = await fetch('./data.json');
            if (!wordResponse.ok) {
                throw new Error(`HTTP Error: ${wordResponse.status}`);
            }
            this.wordData = await wordResponse.json();
            
            // Ayet verileri yükle (boşluk doldurma modu için)
            const ayetResponse = await fetch('./ayetoku.json');
            if (!ayetResponse.ok) {
                throw new Error(`HTTP Error: ${ayetResponse.status}`);
            }
            this.ayetData = await ayetResponse.json();
            
        } catch (error) {
            console.warn('❌ Data loading failed, using fallback data');
            
            // Fallback data - minimal test data
            this.wordData = [
                {
                    "id": 1,
                    "kelime": "السَّلَامُ عَلَيْكُمْ",
                    "okunusu": "es-selâmu aleykum",
                    "anlami": "Size selam olsun",
                    "sure": "Genel",
                    "kategori": "Selamlaşma"
                },
                {
                    "id": 2,
                    "kelime": "بِسْمِ اللَّهِ",
                    "okunusu": "bismillah",
                    "anlami": "Allah'ın adıyla",
                    "sure": "Fatiha",
                    "kategori": "Başlangıç"
                },
                {
                    "id": 3,
                    "kelime": "الْحَمْدُ لِلَّهِ",
                    "okunusu": "elhamdulillah",
                    "anlami": "Hamd Allah'a mahsustur",
                    "sure": "Fatiha",
                    "kategori": "Şükür"
                },
                {
                    "id": 4,
                    "kelime": "رَبِّ الْعَالَمِينَ",
                    "okunusu": "rabbil âlemîn",
                    "anlami": "Alemlerin Rabbi",
                    "sure": "Fatiha",
                    "kategori": "Allah'ın Sıfatları"
                },
                {
                    "id": 5,
                    "kelime": "الرَّحْمَٰنِ الرَّحِيمِ",
                    "okunusu": "er-rahmânir rahîm",
                    "anlami": "Rahman ve Rahim olan",
                    "sure": "Fatiha",
                    "kategori": "Allah'ın Sıfatları"
                }
            ];
            
            this.ayetData = [
                {
                    "id": 1,
                    "arapca": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                    "turkce": "Rahman ve Rahim olan Allah'ın adıyla",
                    "sure": "Fatiha",
                    "ayet": 1
                }
            ];
            
        }
    }
    
    showScreen(screenId) {
        // Get current and target screens
        const currentScreen = document.querySelector('.screen[style*="flex"]');
        const targetScreen = document.getElementById(screenId);
        
        if (!targetScreen) {
            console.error(`❌ Screen bulunamadı: ${screenId}`);
            return;
        }
        
        // If there's a current screen, fade it out
        if (currentScreen && currentScreen !== targetScreen) {
            currentScreen.classList.add('fade-out');
            
            setTimeout(() => {
                // Hide all screens
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.style.display = 'none';
                    screen.classList.remove('fade-out', 'active');
                });
                
                // Show and animate in the target screen
                targetScreen.style.display = 'flex';
                targetScreen.scrollTop = 0;
                
                // Force reflow then add active class for smooth animation
                targetScreen.offsetHeight;
                targetScreen.classList.add('active');
                
            }, 600); // Match fade-out duration
        } else {
            // No current screen, show immediately
            document.querySelectorAll('.screen').forEach(screen => {
                screen.style.display = 'none';
                screen.classList.remove('fade-out', 'active');
            });
            
            targetScreen.style.display = 'flex';
            targetScreen.scrollTop = 0;
            targetScreen.offsetHeight;
            targetScreen.classList.add('active');
        }

        // 🏷️ GLOBAL FOOTER INJECTION - Her ekranda footer göster
        this.injectGlobalFooter(screenId);
        
        // Music control based on screen
        if (window.soundManager) {
            // Müzik başlatma/durdurma devre dışı bırakıldı
        }
        
        // Store current screen for reference
        this.currentScreen = screenId;
    }
    
    countArabicLetters(arabicText) {
        // Remove Arabic diacritics (harakat) and count only letters
        const arabicLettersOnly = arabicText.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
        // Count Arabic letters (U+0627 to U+06FF range)
        const arabicLetterCount = (arabicLettersOnly.match(/[\u0627-\u06FF]/g) || []).length;
        return arabicLetterCount;
    }
    
    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem('lastPlayDate') || '';
        
        // Eğer bugün zaten oynandı ise hiçbir şey yapma
        if (lastPlayDate === today) {
            return;
        }
        
        if (!lastPlayDate || lastPlayDate === '') {
            // İlk kez oynanıyor - streak henüz 0, oyun bitince 1 olacak
            this.streak = 0;
        } else {
            const daysMissed = this.calculateDaysMissed(lastPlayDate, today);
            
            if (daysMissed === 1) {
                // Ardışık gün - streak artır
                const oldStreak = this.streak;
                this.streak++;
                
                // 🔥 Streak milestone fanfarı çal
                this.checkStreakMilestone(oldStreak, this.streak);
                
            } else if (daysMissed > 1) {
                // Gün kaçırıldı - streak protection kontrol et
                const streakProtectionUsed = this.useStreakProtection(daysMissed);
                
                if (!streakProtectionUsed) {
                    // Streak kırıldı - yeniden başla
                    this.streak = 1;
                } else {
                    // Protection kullanıldı, streak korundu
                }
            }
        }
        
        // Reset daily Hasene for new day
        this.dailyHasene = 0;
        localStorage.setItem('dailyHasene', '0');
        
        // Save updated values
        localStorage.setItem('lastPlayDate', today);
        localStorage.setItem('streak', this.streak.toString());
    }



    // 🛡️ Streak Koruma Sistemi
    calculateDaysMissed(lastPlayDate, today) {
        const lastDate = new Date(lastPlayDate);
        const currentDate = new Date(today);
        const timeDiff = currentDate.getTime() - lastDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff; // Doğru gün farkı
    }

    useStreakProtection(daysMissed) {
        // Streak koruma malzemelerini kontrol et
        let streakFreezes = parseInt(localStorage.getItem('streakFreezes')) || 0;
        let weekendPasses = parseInt(localStorage.getItem('weekendPasses')) || 0;
        
        if (daysMissed === 1 && streakFreezes > 0) {
            // 1 gün kaçırdı, Streak Freeze kullan
            streakFreezes--;
            localStorage.setItem('streakFreezes', streakFreezes);
            
            // Kullanım kaydı
            this.logStreakProtectionUsage('Streak Freeze', 1);
            return true;
            
        } else if (daysMissed === 2 && weekendPasses > 0) {
            // 2 gün kaçırdı, Weekend Pass kullan
            weekendPasses--;
            localStorage.setItem('weekendPasses', weekendPasses);
            
            // Kullanım kaydı
            this.logStreakProtectionUsage('Weekend Pass', 2);
            return true;
            
        } else if (daysMissed <= 2 && streakFreezes >= daysMissed) {
            // Birden fazla Streak Freeze kullan
            streakFreezes -= daysMissed;
            localStorage.setItem('streakFreezes', streakFreezes);
            
            // Kullanım kaydı
            this.logStreakProtectionUsage(`${daysMissed}x Streak Freeze`, daysMissed);
            return true;
        }
        
        return false; // Koruma kullanılamadı
    }

    logStreakProtectionUsage(protectionType, daysSaved) {
        const usageLog = JSON.parse(localStorage.getItem('streakProtectionLog')) || [];
        usageLog.push({
            date: new Date().toISOString(),
            type: protectionType,
            daysSaved: daysSaved,
            streakAtTime: this.streak
        });
        
        // Son 10 kullanımı sakla
        if (usageLog.length > 10) {
            usageLog.splice(0, usageLog.length - 10);
        }
        
        localStorage.setItem('streakProtectionLog', JSON.stringify(usageLog));
    }

    // 🛒 Streak Koruma Satın Alma Sistemi
    buyStreakProtection(type) {
        const prices = {
            'streakFreeze': 100,    // 100 hasene
            'weekendPass': 180      // 180 hasene (daha pahalı ama 2 gün)
        };
        
        const price = prices[type];
        if (!price) {
            console.error('❌ Geçersiz koruma tipi!');
            return false;
        }
        
        // 💰 4. ✅ TEK KAYNAK - 'totalHasene' anahtarı
        const currentHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
        
        if (currentHasene < price) {
            return false;
        }
        
        // 💸 5. ✅ HASENE HARCAMA - eş zamanlı güncelleme
        const newHasene = currentHasene - price;
        this.totalHasene = newHasene;
        
        // 6. ✅ ANLIK KAYDETME - localStorage ve UI
        this.saveGameData();
        this.updateUI();
        
        // �🛡️ Koruma ekle
        const currentCount = parseInt(localStorage.getItem(type === 'weekendPass' ? 'weekendPasses' : type + 's')) || 0;
        localStorage.setItem(type === 'weekendPass' ? 'weekendPasses' : type + 's', currentCount + 1);
        
        // 🔄 UI güncelle
        this.updateUI();
        return true;
    }
    
    updateUI() {
        // Safety checks for DOM elements
        const safeUpdateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`⚠️ Element not found: ${id}`);
            }
        };
        
        const safeUpdateStyle = (id, property, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.style[property] = value;
            }
        };
        
        // Update main menu stats
        safeUpdateElement('streakCount', this.streak);
        safeUpdateElement('haseneCount', this.totalHasene);
        safeUpdateElement('levelCount', this.level);
        safeUpdateElement('dailyHasene', this.dailyHasene);
        
        // Gerçek öğrenilen kelimeleri hesapla ve güncelle
        this.wordsLearned = this.calculateMasteredWords();
        
        // Update daily progress (günlük hedef 1000 hasene)
        const dailyProgress = Math.min((this.dailyHasene / 1000) * 100, 100);
        safeUpdateStyle('dailyProgress', 'width', `${dailyProgress}%`);
        // Update dailyHasene span in progress section
        safeUpdateElement('dailyHasene', this.dailyHasene);
        
        // Update XP Progress - Progressive System
        const currentLevelXP = this.getXPRequiredForLevel(this.level);
        const nextLevelXP = this.getXPRequiredForLevel(this.level + 1);
        const xpInCurrentLevel = this.totalHasene - currentLevelXP;
        const xpNeededForNext = nextLevelXP - currentLevelXP;
        const xpProgress = (xpInCurrentLevel / xpNeededForNext) * 100;
        
        safeUpdateStyle('xpProgress', 'width', `${Math.max(0, xpProgress)}%`);
        safeUpdateElement('currentXP', xpInCurrentLevel);
        safeUpdateElement('nextLevelXP', xpNeededForNext);
        safeUpdateElement('currentLevel', this.level);
        safeUpdateElement('nextLevel', this.level + 1);
        
        // Update streak shop UI if available
        if (typeof updateShopUI === 'function') {
            updateShopUI();
        }
    }
    
    startGame(mode = 'translation') {
        // Veri yüklenip yüklenmediğini kontrol et
        if (!this.wordData || this.wordData.length === 0) {
            console.error('Kelime verisi yüklenmemiş!');
            alert('Kelime verisi henüz yüklenmedi. Lütfen bekleyiniz...');
            return;
        }
        
        // 🔧 Güvenli difficulty kullanımı
        const safeDifficulty = this.getDifficulty();
        
        this.gameMode = mode;
        this.currentQuestion = 0;
        this.score = 0;
        this.hearts = 5;
        this.gameHasene = 0;
        
        // Hız modu için timer ayarları
        this.isSpeedMode = (mode === 'speed');
        this.questionTimer = null;
        this.timeLeft = 0;
        
        // Sonsuz modu için ayarlar
        this.isEndlessMode = (mode === 'endless');
        this.endlessQuestionCount = 0;
        
        // Generate questions
        this.generateQuestions();
        
        // Setup game UI
        this.setupGameUI();
        
        // Show first question
        this.showQuestion();
        
        // Show game screen
        this.showScreen('gameScreen');
    }
    
    generateQuestions() {
        // Sonsuz modda başlangıçta sadece 5 soru, sonra dinamik ekleme
        const questionCount = this.isEndlessMode ? 5 : 10;
        this.questions = [];
        
        if (this.gameMode === 'fillblank') {
            // Boşluk doldurma modu için ayet soruları oluştur
            if (!this.ayetData || this.ayetData.length === 0) {
                console.error('Ayet verileri yok!');
                return;
            }
            
            // 🔧 Güvenli difficulty kullanımı
            const safeDifficulty = this.getDifficulty();
            // Zorluk seviyesine göre ayetleri filtrele
            const difficultyAyets = this.getDifficultyAyets(this.ayetData, safeDifficulty);
            
            // Rastgele ayetler seç
            for (let i = 0; i < questionCount; i++) {
                const randomAyet = difficultyAyets[Math.floor(Math.random() * difficultyAyets.length)];
                const fillBlankQuestion = this.createFillBlankQuestion(randomAyet);
                if (fillBlankQuestion) {
                    this.questions.push(fillBlankQuestion);
                }
            }
        } else {
            // Normal kelime modları için
            // Load learning statistics
            const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
            
            // Smart word selection algorithm
            const selectedWords = this.selectSmartWords(questionCount, this.getDifficulty());
            
            selectedWords.forEach(word => {
                let question = {
                    word: word,
                    correctAnswer: word.anlam,
                    type: this.gameMode
                };
                
                // Generate wrong options for multiple choice
                if (this.gameMode === 'translation' || this.gameMode === 'listening' || this.gameMode === 'speed') {
                    const wrongAnswers = this.getWrongAnswers(word.anlam, 3);
                    const allOptions = [word.anlam, ...wrongAnswers];
                    question.options = allOptions.sort(() => Math.random() - 0.5);
                    question.correctIndex = question.options.indexOf(word.anlam);
                }
                
                this.questions.push(question);
            });
        }
        
    }
    
    selectSmartWords(count, difficulty) {
        // 🔧 Güvenli difficulty kullanımı
        const safeDifficulty = difficulty || this.getDifficulty();
        
        // � Debug: Geçilen parametreleri kontrol et
        
        // �📊 localStorage'dan word statistics'i oku
        const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
        
        // Zorluk seviyesine göre kelime havuzunu filtrele
        const difficultyWords = this.getDifficultyWords(this.wordData, safeDifficulty);
        
        
        // İlk 5 kelimeyi göster test için
        if (difficultyWords.length > 0) {
        };
        
        const weightedWords = [];
        
        difficultyWords.forEach(word => {
            const stats = wordStats[word.kelime] || { 
                correct: 0, 
                wrong: 0, 
                lastSeen: 0,
                difficulty: 1
            };
            
            // Calculate priority weight
            let weight = 1;
            
            // Recently wrong words get higher priority (25x for guaranteed visibility)
            if (stats.wrong > stats.correct) {
                weight *= 25;
            }
            
            // Words never seen get medium priority (2x)
            if (stats.correct === 0 && stats.wrong === 0) {
                weight *= 2;
            }
            
            // Time-based repetition (Spaced Repetition)
            const daysSinceLastSeen = (Date.now() - stats.lastSeen) / (1000 * 60 * 60 * 24);
            if (daysSinceLastSeen > 7) {
                weight *= 1.5; // Review old words
            }
            
            // Difficulty multiplier (harder words appear more)
            weight *= stats.difficulty;
            
            // Add to weighted pool multiple times based on weight
            for (let i = 0; i < Math.ceil(weight); i++) {
                weightedWords.push(word);
            }
        });
        
        // Shuffle and select unique words
        const shuffled = weightedWords.sort(() => Math.random() - 0.5);
        const selected = [];
        const usedWords = new Set();
        
        // 🎯 İLK ÖNCE YANLIŞ KELİMELERİ GARANTİ ET!
        const wrongWords = difficultyWords.filter(word => {
            const stats = wordStats[word.kelime];
            return stats && stats.wrong > 0;
        });
        
        // 🎯 TÜM YANLIŞ KELİMELERİ GARANTİLE! (maksimum count-2 adet)
        const maxWrongWords = Math.min(wrongWords.length, count - 2); // En az 2 slot random için bırak
        for (let i = 0; i < maxWrongWords; i++) {
            const randomIndex = Math.floor(Math.random() * wrongWords.length);
            const word = wrongWords[randomIndex];
            
            if (!usedWords.has(word.kelime)) {
                selected.push(word);
                usedWords.add(word.kelime);
                wrongWords.splice(randomIndex, 1); // Kullanılan kelimeyi çıkar
            }
        }
        
        // Kalan slotları ağırlıklı sistemle doldur
        for (let word of shuffled) {
            if (!usedWords.has(word.kelime) && selected.length < count) {
                selected.push(word);
                usedWords.add(word.kelime);
            }
        }
        
        // Son çare: rastgele kelimelerle doldur
        while (selected.length < count && difficultyWords.length > 0) {
            const randomWord = difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
            if (!usedWords.has(randomWord.kelime)) {
                selected.push(randomWord);
                usedWords.add(randomWord.kelime);
            }
        }
        
        return selected;
    }
    
    updateWordStats(word, isCorrect) {
        // Load existing stats
        const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
        
        // Initialize word stats if not exists
        if (!wordStats[word.kelime]) {
            wordStats[word.kelime] = {
                correct: 0,
                wrong: 0,
                lastSeen: Date.now(),
                difficulty: 1,
                firstSeen: Date.now()
            };
        }
        
        const stats = wordStats[word.kelime];
        
        // Update statistics
        if (isCorrect) {
            stats.correct++;
            // Reduce difficulty if answered correctly multiple times
            if (stats.correct > stats.wrong + 2) {
                stats.difficulty = Math.max(0.5, stats.difficulty * 0.8);
            }
        } else {
            stats.wrong++;
            // Increase difficulty for wrong answers
            stats.difficulty = Math.min(3.0, stats.difficulty * 1.3);
        }
        
        stats.lastSeen = Date.now();
        
        // Save updated stats
        localStorage.setItem('wordStats', JSON.stringify(wordStats));
    }
    
    getWrongAnswers(correctAnswer, count) {
        const wrongAnswers = [];
        
        // Cache için static değişken kullan - sadece bir kez hesapla
        if (!this.cachedDifficultyWords || this.cachedDifficulty !== this.difficulty) {
            this.cachedDifficultyWords = this.getDifficultyWords(this.wordData, this.difficulty);
            this.cachedDifficulty = this.difficulty;
        }
        
        const allAnswers = this.cachedDifficultyWords.map(word => word.anlam).filter(answer => answer !== correctAnswer);
        
        // If difficulty-filtered answers are too few, fallback to all words
        const answersPool = allAnswers.length >= count ? allAnswers : 
                           this.wordData.map(word => word.anlam).filter(answer => answer !== correctAnswer);
        
        for (let i = 0; i < count && i < answersPool.length; i++) {
            const randomIndex = Math.floor(Math.random() * answersPool.length);
            const wrongAnswer = answersPool[randomIndex];
            
            if (!wrongAnswers.includes(wrongAnswer)) {
                wrongAnswers.push(wrongAnswer);
            } else {
                i--; // Try again if duplicate
            }
        }
        
        return wrongAnswers;
    }
    
    calculateMasteredWords() {
        // Kelime istatistiklerini yükle
        const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
        let masteredCount = 0;
        
        // Her kelime için kontrol et
        Object.keys(wordStats).forEach(word => {
            const stats = wordStats[word];
            
            // En az 10 kez doğru cevaplamış ve hata oranı %20'nin altında
            if (stats.correct >= 10) {
                const accuracy = stats.correct / (stats.correct + stats.wrong);
                if (accuracy >= 0.8) { // %80 doğruluk oranı
                    masteredCount++;
                }
            }
        });
        
        return masteredCount;
    }
    
    setupGameUI() {
        // Update progress
        document.getElementById('totalQuestions').textContent = this.questions.length;
        document.getElementById('currentQuestion').textContent = '1';
        document.getElementById('gameProgress').style.width = '0%';
        
        // Reset hearts
        for (let i = 1; i <= 5; i++) {
            const heart = document.getElementById(`heart${i}`);
            if (heart) {
                heart.classList.remove('lost');
            }
        }
        
        // Reset Hasene display
        document.getElementById('gameHasene').textContent = '0';
        
        // Setup question type display
        const questionTypeTexts = {
            'translation': 'Arapça kelimeyi çevir',
            'listening': 'Sesi dinle ve anlamını bul',
            'speed': 'Arapça kelimeyi çevir',
            'fillblank': 'Boş yerleri doldur'
        };
        document.getElementById('questionType').textContent = questionTypeTexts[this.gameMode];
    }

    startQuestionTimer() {
        if (!this.isSpeedMode) return;
        
        // Clear any existing timer
        this.clearQuestionTimer();
        
        // Initialize timer (10 seconds for speed mode)
        this.timeLeft = 10;
        
        // Show timer display
        const speedTimer = document.getElementById('speedTimer');
        const timerCount = document.getElementById('timerCount');
        
        if (speedTimer && timerCount) {
            speedTimer.style.display = 'flex';
            timerCount.textContent = this.timeLeft;
            speedTimer.classList.remove('warning');
        }
        
        // Start countdown
        this.questionTimer = setInterval(() => {
            this.timeLeft--;
            
            if (timerCount) {
                timerCount.textContent = this.timeLeft;
            }
            
            // Add warning animation when time is low
            if (this.timeLeft <= 3 && speedTimer) {
                speedTimer.classList.add('warning');
            }
            
            // Time's up - automatically select wrong answer or move to next
            if (this.timeLeft <= 0) {
                this.clearQuestionTimer();
                
                // Auto-submit as incorrect answer
                this.processAnswer(false);
            }
        }, 1000);
        
        console.log('⏱️ Hız modu için soru zamanlayıcısı başlatıldı - 10 saniye');
    }

    clearQuestionTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
        
        // Hide timer display
        const speedTimer = document.getElementById('speedTimer');
        if (speedTimer) {
            speedTimer.style.display = 'none';
            speedTimer.classList.remove('warning');
        }
        
        this.timeLeft = 0;
    }

    
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.completeGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        // Update progress
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.getElementById('gameProgress').style.width = `${progress}%`;
        
        // Show question based on mode
        if (this.gameMode === 'translation' || this.gameMode === 'listening' || this.gameMode === 'speed') {
            this.showMultipleChoiceQuestion(question);
        } else if (this.gameMode === 'fillblank') {
            this.showFillBlankQuestion(question);
        }
        
        // Hide feedback and continue button
        this.hideFeedback();
        document.getElementById('continueBtn').style.display = 'none';
        
        // Hız modu için timer başlat
        if (this.isSpeedMode) {
            this.startQuestionTimer();
        }
    }
    
    showMultipleChoiceQuestion(question) {
        // Show question text with Arabic styling
        const questionTextElement = document.getElementById('questionText');
        
        if (this.gameMode === 'translation' || this.gameMode === 'speed') {
            // Arabic text with Amiri font and game mode colors
            questionTextElement.innerHTML = `<span class="arabic-word ${this.gameMode}-mode">${question.word.kelime}</span>`;
            document.getElementById('audioBtn').style.display = 'inline-block';
        } else if (this.gameMode === 'listening') {
            questionTextElement.textContent = '🎧 Sesi dinleyin';
            document.getElementById('audioBtn').style.display = 'inline-block';
            // Auto-play audio for listening mode
            setTimeout(() => this.playAudio(), 500);
        }
        
        // Show word ID and difficulty for debugging
        document.getElementById('wordId').textContent = `ID: ${question.word.id} | Difficulty: ${question.word.difficulty} | Mod: ${this.gameMode}`;
        
        // Show options, hide input and Arabic keyboard
        document.getElementById('optionsContainer').style.display = 'grid';
        document.getElementById('inputContainer').style.display = 'none';
        document.getElementById('arabicKeyboard').style.display = 'none';
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.selectOption(button, index);
            optionsContainer.appendChild(button);
        });
        
        // Store current audio URL
        this.currentAudio = question.word.ses_dosyasi;
    }
    
    showWritingQuestion(question) {
        // Show Turkish meaning, ask for Arabic word
        document.getElementById('questionText').textContent = question.word.anlam;
        document.getElementById('audioBtn').style.display = 'inline-block';
        
        // Show word ID and difficulty for debugging
        document.getElementById('wordId').textContent = `ID: ${question.word.id} | Difficulty: ${question.word.difficulty} | Mod: ${this.gameMode}`;
        
        // Show input and Arabic keyboard
        document.getElementById('optionsContainer').style.display = 'none';
        document.getElementById('inputContainer').style.display = 'flex';
        document.getElementById('arabicKeyboard').style.display = 'block';
        
        const input = document.getElementById('answerInput');
        input.value = '';
        input.placeholder = 'Arapça klavyeyi kullanın...';
        input.setAttribute('readonly', 'true');
        input.focus();
        
        // Store current audio URL
        this.currentAudio = question.word.ses_dosyasi;
    }

    createFillBlankQuestion(ayet) {
        if (!ayet || !ayet['ayahs.text_uthmani_tajweed'] || !ayet.meal) {
            return null;
        }
        
        const arabicText = ayet['ayahs.text_uthmani_tajweed'];
        const turkishText = ayet.meal;
        
        // Arapça metindeki kelimeleri ayır
        const words = arabicText.split(/\s+/).filter(word => word.length > 2); // En az 3 harfli kelimeler
        
        if (words.length < 3) return null; // Çok kısa ayetleri atla
        
        // Rastgele bir kelimeyi boşluk yap
        const randomIndex = Math.floor(Math.random() * words.length);
        const hiddenWord = words[randomIndex];
        
        // Boşluklu metni oluştur
        const wordsWithBlank = [...words];
        wordsWithBlank[randomIndex] = '_____';
        const textWithBlank = wordsWithBlank.join(' ');
        
        // Yanlış seçenekler oluştur (diğer ayetlerden rastgele kelimeler)
        const wrongOptions = this.getRandomArabicWords(hiddenWord, 3);
        const allOptions = [hiddenWord, ...wrongOptions];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        return {
            type: 'fillblank',
            ayet: ayet,
            arabicTextWithBlank: textWithBlank,
            turkishText: turkishText,
            correctWord: hiddenWord,
            options: shuffledOptions,
            correctIndex: shuffledOptions.indexOf(hiddenWord),
            audioUrl: ayet.ayet_ses_dosyasi
        };
    }

    getRandomArabicWords(excludeWord, count) {
        const wrongWords = [];
        let attempts = 0; // let olarak değiştirdik
        const maxAttempts = 100;
        
        // 🔧 KRİTİK FİX: Zorluk seviyesine uygun ayetler kullan!
        const safeDifficulty = this.getDifficulty();
        const difficultyAyets = this.getDifficultyAyets(this.ayetData, safeDifficulty);
        
        // Eğer filtrelenmiş ayet yoksa, tüm ayetleri kullan
        const sourceAyets = difficultyAyets.length > 0 ? difficultyAyets : this.ayetData;
        
        while (wrongWords.length < count && attempts < maxAttempts) {
            attempts++; // Her döngüde artır - KRİTİK FİX!
            
            // 🔧 Zorluk seviyesine uygun ayetlerden seç
            const randomAyet = sourceAyets[Math.floor(Math.random() * sourceAyets.length)];
            if (!randomAyet || !randomAyet['ayahs.text_uthmani_tajweed']) continue;
            
            // Bu ayetteki kelimelerden rastgele birini seç
            const words = randomAyet['ayahs.text_uthmani_tajweed'].split(/\s+/).filter(word => 
                word.length > 2 && word !== excludeWord && !wrongWords.includes(word)
            );
            
            if (words.length > 0) {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                if (!wrongWords.includes(randomWord)) {
                    wrongWords.push(randomWord);
                }
            }
        }
        
        // Güvenlik kontrolü - yeteri kadar kelime bulunamadıysa uyar
        if (wrongWords.length < count) {
            console.warn(`⚠️ Sadece ${wrongWords.length}/${count} yanlış seçenek bulunabildi. ${attempts} deneme yapıldı.`);
        }
        
        return wrongWords;
    }

    showFillBlankQuestion(question) {
        // Boşluklu Arapça metni göster
        const questionTextElement = document.getElementById('questionText');
        questionTextElement.innerHTML = `<div class="fillblank-arabic">${question.arabicTextWithBlank}</div>
                                       <div class="fillblank-turkish">${question.turkishText}</div>`;
        
        // Ses butonunu göster
        document.getElementById('audioBtn').style.display = 'inline-block';
        
        // Word ID yerine ayet kimliği göster
        document.getElementById('wordId').textContent = `Ayet: ${question.ayet.ayet_kimligi}`;
        
        // Seçenekleri göster, klavyeyi gizle
        document.getElementById('optionsContainer').style.display = 'grid';
        document.getElementById('inputContainer').style.display = 'none';
        document.getElementById('arabicKeyboard').style.display = 'none';
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn fillblank-option';
            button.textContent = option;
            button.onclick = () => this.selectOption(button, index);
            optionsContainer.appendChild(button);
        });
        
        // Ses dosyasını ayarla
        this.currentAudio = question.audioUrl;
    }
    
    selectOption(button, index) {
        const question = this.questions[this.currentQuestion];
        
        // Disable all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.add('disabled');
        });
        
        // Mark selected option
        button.classList.add('selected');
        
        // Check answer
        const isCorrect = index === question.correctIndex;
        this.processAnswer(isCorrect, button);
    }
    
    checkAnswer() {
        const input = document.getElementById('answerInput');
        const userAnswer = input.value.trim();
        const question = this.questions[this.currentQuestion];
        
        if (!userAnswer) {
            input.focus();
            return;
        }
        
        // For writing mode, check if the Arabic word is correct
        const isCorrect = userAnswer === question.word.kelime;
        
        input.disabled = true;
        this.processAnswer(isCorrect);
    }
    
    checkEnter(event) {
        if (event.key === 'Enter') {
            this.checkAnswer();
        }
    }
    
    processAnswer(isCorrect, selectedButton = null) {
        // Hız modunda timer'ı temizle
        if (this.isSpeedMode) {
            this.clearQuestionTimer();
        }
        
        // 🧠 Smart Learner için son cevabı kaydet
        this.lastAnswerCorrect = isCorrect;
        
        const question = this.questions[this.currentQuestion];
        
        // Update word statistics for smart repetition (sadece kelime modları için)
        if (question.word) {
            this.updateWordStats(question.word, isCorrect);
        }
        
        // Update statistics
        this.totalAnswers++;
        localStorage.setItem('totalAnswers', this.totalAnswers.toString());
        
        if (isCorrect) {
            this.score++;
            this.correctAnswers++;
            
            // Calculate hasene based on game mode
            let earnedHasene = 0;
            if (this.gameMode === 'fillblank') {
                // Boşluk doldurma modunda doğru kelimenin harf sayısına göre
                const correctWord = question.correctWord;
                const letterCount = this.countArabicLetters(correctWord);
                earnedHasene = letterCount * 15; // Boşluk doldurma daha zor, daha fazla hasene
            } else {
                // Normal kelime modlarında
                const arabicWord = question.word.kelime;
                const letterCount = this.countArabicLetters(arabicWord);
                earnedHasene = letterCount * 10;
            }
            
            this.gameHasene += earnedHasene;
            
            // 4. ✅ DOĞRU CEVAP - HASENE KAZANIMI
            this.totalHasene += earnedHasene;
            this.dailyHasene += earnedHasene;
            
            // 5. ✅ ANLIK KAYDETME - her doğru cevaptan sonra
            this.saveGameData();
            this.updateUI(); // UI'yi hemen güncelle
            
            // 6. ✅ İSTATİSTİK GÜNCELLEME - totalHasene değiştiğinde
            this.updateGameStats();
            
            // 7. ✅ CALENDAR GÜNCELLEME - her doğru cevaptan sonra
            const today = new Date().toDateString();
            this.storeDailyHasene(today, this.dailyHasene);
            
            // Play correct sound
            if (window.soundManager) {
                window.soundManager.playCorrect();
            }
            
            // Show correct feedback
            this.showFeedback(true, question);
            
            if (selectedButton) {
                selectedButton.classList.add('correct');
            }
        } else {
            // 💔 Yanlış cevap - sadece kalp yoksa hasene azalt
            
            // Başlangıçta kalp var mı kontrol et
            const hasHeartProtection = this.hearts > 0 && !unlimitedHeartsActive;
            
            if (hasHeartProtection) {
                // Kalp varsa sadece kalp azalt, hasene azaltma
                this.hearts--;
            } else {
                // 🔧 Kalp yoksa hasene azalt - GÜVENLİ ZORLUK SİSTEMİ
                const safeDifficulty = this.getDifficulty();
                
                let haseneKaybi = 0;
                // 🎯 SADECE NORMALİZE EDİLMİŞ DEĞERLER (easy/medium/hard)
                switch (safeDifficulty) {
                    case 'easy': haseneKaybi = 5; break;
                    case 'medium': haseneKaybi = 10; break;
                    case 'hard': haseneKaybi = 25; break;
                    default:
                        // Bu durum olmamalı çünkü getDifficulty() her zaman valid değer döndürür
                        haseneKaybi = 10;
                        console.error(`🚨 BEKLENMEYEN ZORLUK DEĞERI: "${safeDifficulty}"! Bu bir hata!`);
                }
                
                const eskiHasene = this.gameHasene;
                this.gameHasene = Math.max(0, this.gameHasene - haseneKaybi);
                const yeniHasene = this.gameHasene;
                
                // totalHasene ve dailyHasene'yi de güncelle
                this.totalHasene = Math.max(0, this.totalHasene - haseneKaybi);
                this.dailyHasene = Math.max(0, this.dailyHasene - haseneKaybi);
                
                // localStorage'ı hemen güncelle
                try {
                    this.saveGameData();
                } catch (error) {
                    console.error('❌ saveGameData hatası:', error);
                }
                
                // UI'yi güncelle
                try {
                    this.updateUI();
                } catch (error) {
                    console.error('❌ updateUI hatası:', error);
                }
                
                // Calendar'ı da güncelle (hasene azaldığında)
                const today = new Date().toDateString();
                this.storeDailyHasene(today, this.dailyHasene);
                
                // Hasene azalma uyarısı göster
                try {
                    this.showHaseneDecrease(haseneKaybi);
                } catch (error) {
                    console.error('showHaseneDecrease hatası:', error);
                }
            }
            
            // Play incorrect sound
            if (window.soundManager) {
                window.soundManager.playIncorrect();
            }
            
            // Show incorrect feedback
            this.showFeedback(false, question);
            
            // Update hearts display
            if (!unlimitedHeartsActive && this.hearts >= 0) {
                const heartIndex = 5 - this.hearts;
                const heart = document.getElementById(`heart${heartIndex}`);
                if (heart) {
                    heart.classList.add('lost');
                    // Play heart lost sound
                    if (window.soundManager) {
                        window.soundManager.playHeartLost();
                    }
                }
            }
            
            if (selectedButton && selectedButton.classList) {
                selectedButton.classList.add('incorrect');
            }
            // Highlight correct answer
            const correctIndex = question.correctIndex;
            const options = document.querySelectorAll('.option-btn');
            if (options[correctIndex]) {
                options[correctIndex].classList.add('correct');
            }
            
            // Check if game over (disable heart system for now)
            // if (this.hearts <= 0) {
            //     setTimeout(() => {
            //         this.gameOver();
            //     }, 2000);
            //     return;
            // }
        }
        
        localStorage.setItem('correctAnswers', this.correctAnswers.toString());
        
        // Update game Hasene display
        document.getElementById('gameHasene').textContent = this.gameHasene;
        
        // Show continue button
        setTimeout(() => {
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
                continueBtn.style.display = 'inline-block';
                
                // Hız modunda otomatik devam et (2 saniye sonra)
                if (this.isSpeedMode) {
                    setTimeout(() => {
                        if (continueBtn.style.display !== 'none') {
                            
                            // Son soru kontrolü
                            if (this.currentQuestion + 1 >= this.questions.length) {
                                if (this.isEndlessMode && this.hearts > 0) {
                                    this.nextQuestion();
                                } else {
                                    this.nextQuestion(); // completeGame'i çağıracak
                                }
                            } else {
                                this.nextQuestion();
                            }
                        }
                    }, 2000);
                }
            } else {
                console.error('Continue button not found!');
            }
        }, 800);
        
        // ❌ Kalp kontrolü kaldırıldı - artık kalp bitince oyun devam eder, sadece hasene azalır
    }
    
    showFeedback(isCorrect, question) {
        const feedback = document.getElementById('resultFeedback');
        const icon = document.getElementById('feedbackIcon');
        const text = document.getElementById('feedbackText');
        const meaning = document.getElementById('feedbackMeaning');
        
        // Set content based on result
        if (isCorrect) {
            icon.className = 'feedback-icon correct';
            icon.innerHTML = '<i class="fas fa-check"></i>';
            text.textContent = 'Doğru!';
            text.className = 'feedback-text correct';
        } else {
            icon.className = 'feedback-icon incorrect';
            icon.innerHTML = '<i class="fas fa-times"></i>';
            text.textContent = 'Yanlış!';
            text.className = 'feedback-text incorrect';
        }
        
        // Soru formatına göre meaning ayarla - Arapça renkli
        if (this.gameMode === 'fillblank') {
            // Boşluk doldurma modu için özel gösterim
            const fullText = question.ayet['ayahs.text_uthmani_tajweed'];
            meaning.innerHTML = `<div class="feedback-fillblank">
                                  <div class="feedback-arabic">${fullText}</div>
                                  <div class="feedback-turkish">${question.turkishText}</div>
                                  <div class="feedback-word">Doğru kelime: <span class="arabic-word fillblank-mode">${question.correctWord}</span></div>
                                </div>`;
            this.currentAudio = question.audioUrl;
        } else if (question.word) {
            // Normal format with Arabic styling
            meaning.innerHTML = `<span class="arabic-word ${this.gameMode}-mode">${question.word.kelime}</span> = ${question.word.anlam}`;
            this.currentAudio = question.word.ses_dosyasi;
        } else if (question.arabic && question.correct) {
            // Sonsuz mod format with Arabic styling
            meaning.innerHTML = `<span class="arabic-word ${this.gameMode}-mode">${question.arabic}</span> = ${question.correct}`;
            this.currentAudio = null; // Sonsuz modda ses yok şimdilik
        } else {
            // Fallback
            meaning.textContent = 'Kelime bilgisi mevcut değil';
            this.currentAudio = null;
        }
        
        // Hide continue button initially
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.style.display = 'none';
        }
        
        // Show feedback
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.classList.add('show');
        }, 100);
    }
    
   
    
    hideFeedback() {
        const feedback = document.getElementById('resultFeedback');
               feedback.classList.remove('show');
        setTimeout(() => {
           
            feedback.style.display = 'none';
        }, 300);
    }

    // 🚨 Hasene azalma uyarısı göster
    showHaseneDecrease(haseneKaybi) {
        // Hasene display elementini bul ve kırmızı animasyon uygula
        const haseneDisplay = document.getElementById('gameHasene');
        if (haseneDisplay) {
            haseneDisplay.style.color = '#ff4b4b';
            haseneDisplay.style.transform = 'scale(1.2)';
            haseneDisplay.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                haseneDisplay.style.color = '';
                haseneDisplay.style.transform = '';
            }, 2000);
        }
        // Artık popup yok, sadece animasyon var
    }
    
    nextQuestion() {
        
        // Hide continue button
        document.getElementById('continueBtn').style.display = 'none';
        
        this.hideFeedback();
        this.currentQuestion++;
        
        // Check if game is complete
        if (this.currentQuestion >= this.questions.length) {
            if (this.isEndlessMode && this.hearts > 0) {
                this.addMoreEndlessQuestions();
                // Continue with the new questions
            } else {
                this.completeGame();
                return;
            }
        }
        
        // Reset input if in writing mode
        const input = document.getElementById('answerInput');
        input.disabled = false;
        
        setTimeout(() => {
            this.showQuestion();
        }, 300);
    }
    
    skipQuestion() {
        // 🔍 Soru kontrolü - sadece aktif sorular için skip işlemi
        if (this.currentQuestion >= this.questions.length) {
            console.warn('⚠️ Skip tetiklendi ama soru kalmadı. Oyun zaten tamamlanmış olmalı.');
            // Oyun zaten bitmiş, skip'i ignore et
            return;
        }
        
        // Sonsuz modda soru tükendiyse yeni sorular ekle
        if (this.currentQuestion === this.questions.length - 1 && this.isEndlessMode && this.hearts > 0) {
            this.addMoreEndlessQuestions();
        }
        
        // Mark as incorrect but don't lose heart
        const question = this.questions[this.currentQuestion];
        
        if (!question) {
            console.error('Skip: Soru bulunamadı!', this.currentQuestion, this.questions.length);
            return;
        }
        
        this.totalAnswers++;
        
        // Show correct answer
        this.showFeedback(false, question);
        
        // Show continue button
        setTimeout(() => {
            document.getElementById('continueBtn').style.display = 'inline-block';
        }, 800);
        
        localStorage.setItem('totalAnswers', this.totalAnswers.toString());
    }
    
    addMoreEndlessQuestions() {
        // Sonsuz modda yeni sorular ekle
        const moreQuestions = [];
        const usedWords = this.questions.map(q => q.word ? q.word.id : q.word?.kelime);
        
        // 🔧 Güvenli difficulty kullanımı
        const safeDifficulty = this.getDifficulty();
        // Zorluk seviyesine uygun kelimeler al
        let difficultyWords = this.getDifficultyWords(this.wordData, safeDifficulty);
        
        if (!difficultyWords || difficultyWords.length === 0) {
            console.warn('Zorluk seviyesi için kelime bulunamadı, tüm kelimeleri kullanıyoruz');
            difficultyWords = this.wordData;
        }
        
        // 5 yeni soru ekle (daha manageable)
        for (let i = 0; i < 5; i++) {
            let randomWord;
            let attempts = 0;
            
            // Daha önce kullanılmayan kelime bul
            do {
                randomWord = difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
                attempts++;
                if (attempts > 100) break; // Sonsuz döngüyü önle
            } while (usedWords.includes(randomWord.id || randomWord.kelime) && attempts < 100);
            
            if (randomWord) {
                // Game mode'a göre soru tipini belirle
                if (this.gameMode === 'writing') {
                    moreQuestions.push({
                        word: randomWord,
                        type: 'writing'
                    });
                } else {
                    // Multiple choice için yanlış seçenekler oluştur
                    const wrongAnswers = this.getWrongAnswers(randomWord.anlam, 3);
                    const allOptions = [randomWord.anlam, ...wrongAnswers];
                    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
                    
                    moreQuestions.push({
                        word: randomWord,
                        correctAnswer: randomWord.anlam,
                        options: shuffledOptions,
                        correctIndex: shuffledOptions.indexOf(randomWord.anlam),
                        type: this.gameMode
                    });
                }
                
                usedWords.push(randomWord.id || randomWord.kelime);
            }
        }
        
        // Yeni soruları ekle
        this.questions.push(...moreQuestions);
        this.endlessQuestionCount += moreQuestions.length;
        
    }

    playAudio() {
        if (this.currentAudio) {
            const audio = document.getElementById('audioPlayer');
            audio.src = this.currentAudio;
            audio.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
        }
    }
    
    playAyDogdu() {
        const audio = document.getElementById('ayDogduAudio');
        if (audio) {
            audio.play();
        } else {
            console.error('Audio element not found!');
        }
    }
    
    updateHeartsDisplay() {
        // Kalp görünümünü güncelle
        for (let i = 1; i <= 5; i++) {
            const heart = document.getElementById(`heart${i}`);
            if (heart) {
                if (i <= this.hearts) {
                    heart.classList.remove('lost');
                    heart.style.color = '#ff6b6b'; // Kırmızı kalp
                } else {
                    heart.classList.add('lost');
                    heart.style.color = '#ccc'; // Gri kalp
                }
            }
        }
        
    }
    
    playFeedbackAudio() {
        this.playAudio();
    }
    
    playSound(type) {
        const audio = document.getElementById(type + 'Sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.error('Sound playback failed:', error);
            });
        }
    }
    
    completeGame() {
        try {
            // Clear any running timers
            this.clearQuestionTimer();
            
            // ❌ Kalp kontrolü kaldırıldı - artık kalp bitince de oyun tamamlanabilir
            // Calculate results
            const totalQuestions = this.questions.length;
            const accuracy = Math.round((this.score / totalQuestions) * 100);
            
            // Award Hasene and update stats
            this.totalHasene += this.gameHasene;
            this.dailyHasene += this.gameHasene;
            
            // Update words learned (mastery-based calculation)
            // Gerçekten öğrenilen kelimeleri hesapla (en az 10 kez doğru)
            this.wordsLearned = this.calculateMasteredWords();
            
            // Oyun modu sayacını güncelle
            const modeKey = this.gameMode + 'Games'; // translationGames, listeningGames, speedGames, fillblankGames
            const currentCount = parseInt(localStorage.getItem(modeKey)) || 0;
            localStorage.setItem(modeKey, (currentCount + 1).toString());
            
            // Boşluk doldurma modunda mükemmel performansı kaydet
            if (this.gameMode === 'fillblank' && accuracy === 100) {
                localStorage.setItem('lastFillBlankPerfect', 'true');
            } else if (this.gameMode === 'fillblank') {
                localStorage.setItem('lastFillBlankPerfect', 'false');
            }
            
            // Check for level up - Progressive system
            const oldLevel = this.level;
            this.level = this.calculateLevel(this.totalHasene);
            
            // Daily goal bonus removed - streak only updates when game is completed
            // Save to localStorage
            localStorage.setItem('totalHasene', this.totalHasene.toString());
            localStorage.setItem('dailyHasene', this.dailyHasene.toString());
            localStorage.setItem('streak', this.streak.toString());
            
            // Store daily hasene in calendar data
            const today = new Date().toDateString();
            this.storeDailyHasene(today, this.dailyHasene); // dailyHasene kullan, gameHasene değil!
            
            // 🔥 STREAK UPDATE: Oyun tamamlanması = streak güncellemesi
            const hasPlayedToday = this.hasPlayedToday(today);
            if (!hasPlayedToday) {
                // İlk kez bugün oynadı - streak güncelle
                const lastPlayDate = localStorage.getItem('lastPlayDate');
                if (!lastPlayDate || lastPlayDate === '') {
                    // İlk kez hiç oynuyor - streak 1 yap
                    this.streak = 1;
                } else {
                    // Normal günlük streak kontrolü
                    this.checkDailyStreak();
                }
                this.updateStreakData(today, true);
            }
            
            // Update streak data if daily goal met (bonus)
            if (this.dailyHasene >= 1000) {
            }
            
            // Update game statistics and check achievements
            this.updateGameStats();
            
            // Show results screen
            this.showGameComplete(totalQuestions, accuracy, oldLevel);
            
            
        } catch (error) {
            console.error('❌ completeGame() ERROR:', error);
            console.error('Stack trace:', error.stack);
            // Fallback: En azından results screen'i göstermeye çalış
            try {
                this.showGameComplete(10, 0, 1);
            } catch (fallbackError) {
                console.error('❌ Fallback de başarısız:', fallbackError);
            }
        }
    }
    
    showGameComplete(totalQuestions, accuracy, oldLevel) {
        
        // Play success fanfare
        if (window.soundManager) {
            window.soundManager.playSuccess();
        }
        
        
        // 7. ✅ SONUÇ GÖSTERİMLERİ - doğru değerler
        document.getElementById('earnedHasene').textContent = this.gameHasene;
        document.getElementById('correctAnswers').textContent = `${this.score}/${totalQuestions}`;
        document.getElementById('gameAccuracy').textContent = `${accuracy}%`;
        document.getElementById('finalStreak').textContent = `${this.streak} gün`;
        
        // 8. ✅ OYUN BİTİMİ - save ve UI güncelleme
        this.saveGameData();
        this.updateUI();
        
        
        // Animate stars based on performance
        const stars = document.querySelectorAll('.stars i');
        stars.forEach((star, index) => {
            star.style.opacity = '0.3';
        });
        
        if (accuracy >= 90) {
            stars.forEach(star => star.style.opacity = '1');
        } else if (accuracy >= 70) {
            stars[0].style.opacity = '1';
            stars[1].style.opacity = '1';
        } else if (accuracy >= 50) {
            stars[0].style.opacity = '1';
        }
        
        // Show complete screen
        this.showScreen('gameComplete');
        
        // 🎮 Game tamamlandı - UI temizle
        const skipBtn = document.querySelector('.skip-btn');
        if (skipBtn) {
            skipBtn.style.display = 'none'; // Skip butonunu gizle
        }
        
        
        // Check for level up
        if (this.level > oldLevel) {
            setTimeout(() => {
                this.showLevelUp();
            }, 2000);
        } else if (this.dailyHasene >= 1000 && this.streak > 0) {
            setTimeout(() => {
                this.showStreakModal();
            }, 2000);
        }
    }
    
    showLevelUp() {
        // 🎉 Play level up victory fanfare
        if (window.soundManager) {
            window.soundManager.playVictory();
        }
        
        document.getElementById('newLevel').textContent = this.level;
        document.getElementById('newLevelText').textContent = this.level;
        document.getElementById('levelUpModal').style.display = 'flex';
    }
    
    closeLevelUpModal() {
        document.getElementById('levelUpModal').style.display = 'none';
    }
    
    showStreakModal() {
        document.getElementById('streakDays').textContent = this.streak;
        document.getElementById('streakModal').style.display = 'flex';
    }
    
    closeStreakModal() {
        document.getElementById('streakModal').style.display = 'none';
    }
    
    gameOver() {
        // Update statistics
        this.updateGameStats();
        
        // 🎵 Başarı seviyesine göre fanfar çal
        this.playEndGameFanfare();
        
        alert('Oyun bitti! Tekrar deneyin.');
        this.returnToMenu();
    }

    // 🎉 Oyun sonu fanfar sistemi
    playEndGameFanfare() {
        const accuracy = this.totalAnswers > 0 ? (this.correctAnswers / this.totalAnswers) * 100 : 0;
        const isHighScore = this.score >= 15;
        const isPerfectScore = accuracy === 100 && this.totalAnswers >= 10;
        
        if (isPerfectScore) {
            // ⭐ Mükemmel performans - tüm cevaplar doğru
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playPerfect();
            }, 300);
            
        } else if (isHighScore) {
            // 🎉 Yüksek skor - seviye başarısı
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playVictory();
            }, 300);
            
        } else if (accuracy >= 70) {
            // 🎵 İyi performans - normal başarı sesi
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playSuccess();
            }, 300);
            
        } else {
            // 📈 Teşvik edici - gelişim için
        }
    }

    // 🔥 Streak milestone kontrolü
    checkStreakMilestone(oldStreak, newStreak) {
        const milestones = [3, 7, 10, 15, 20, 30, 50, 100];
        
        // Yeni milestone geçildiyse fanfar çal
        const passedMilestone = milestones.find(milestone => 
            oldStreak < milestone && newStreak >= milestone
        );
        
        if (passedMilestone) {
            setTimeout(() => {
                if (window.soundManager) {
                    window.soundManager.playStreak();
                }
            }, 500);
        }
    }

    // 📈 Progressive Level System - Her seviye exponentially daha zor
    calculateLevel(totalXP) {
        if (totalXP < 1000) return 1;     // Seviye 1: 0-999 XP
        if (totalXP < 2500) return 2;     // Seviye 2: 1000-2499 XP (1500 XP gerek)
        if (totalXP < 5000) return 3;     // Seviye 3: 2500-4999 XP (2500 XP gerek)
        if (totalXP < 8000) return 4;     // Seviye 4: 5000-7999 XP (3000 XP gerek)
        if (totalXP < 12000) return 5;    // Seviye 5: 8000-11999 XP (4000 XP gerek)
        if (totalXP < 17000) return 6;    // Seviye 6: 12000-16999 XP (5000 XP gerek)
        if (totalXP < 23000) return 7;    // Seviye 7: 17000-22999 XP (6000 XP gerek)
        if (totalXP < 30000) return 8;    // Seviye 8: 23000-29999 XP (7000 XP gerek)
        if (totalXP < 38000) return 9;    // Seviye 9: 30000-37999 XP (8000 XP gerek)
        if (totalXP < 47000) return 10;   // Seviye 10: 38000-46999 XP (9000 XP gerek)
        
        // Seviye 10'dan sonra her seviye 10000 XP daha gerektirir
        const extraLevels = Math.floor((totalXP - 47000) / 10000);
        return 10 + extraLevels;
    }

    // 🎯 Belirli seviye için gerekli XP
    getXPRequiredForLevel(level) {
        if (level <= 1) return 0;
        if (level <= 2) return 1000;
        if (level <= 3) return 2500;
        if (level <= 4) return 5000;
        if (level <= 5) return 8000;
        if (level <= 6) return 12000;
        if (level <= 7) return 17000;
        if (level <= 8) return 23000;
        if (level <= 9) return 30000;
        if (level <= 10) return 38000;
        if (level <= 11) return 47000;
        
        // Seviye 11'dan sonra her seviye 10000 XP daha
        return 47000 + ((level - 11) * 10000);
    }
    
    updateGameStats() {
        
        // Update basic stats
        this.stats.gamesPlayed++;
        localStorage.setItem('gamesPlayed', this.stats.gamesPlayed);
        
        // Check for perfect game
        if (this.score >= 10) {
            this.stats.perfectGames++;
            localStorage.setItem('perfectGames', this.stats.perfectGames);
        }
        
        // Update weekly data
        const today = new Date().getDay();
        let weeklyGames = JSON.parse(localStorage.getItem('weeklyGames')) || [0,0,0,0,0,0,0];
        weeklyGames[today]++;
        localStorage.setItem('weeklyGames', JSON.stringify(weeklyGames));
        
        // 6. ✅ İSTATİSTİK ENTEGRASYONU - totalHasene değiştiğinde doğru güncelleme
        this.stats.totalHasene = this.totalHasene;
        this.stats.currentStreak = this.streak;
        this.stats.wordsLearned = this.calculateMasteredWords(); // Dinamik hesaplama
        this.stats.totalAnswers = this.totalAnswers;
        this.stats.correctAnswers = this.correctAnswers;
        
        
        // 6. ✅ ACHIEVEMENTS KONTROLÜ - yeniden etkinleştirildi (badge modunda)
        this.checkNewAchievements();
        
        // 🧠 Smart Learner Achievement kontrolü
        this.checkSmartLearnerAchievement();
        
        // Update notification badges
        this.updateNotificationBadges();
    }
    
    returnToMenu() {
        // Clear any running timers
        this.clearQuestionTimer();
        
        // Update UI with latest stats
        this.updateUI();
        
        // Update calendar
        this.generateCalendar();
        
        // Show main menu
        this.showScreen('mainMenu');
    }
    
    // Calendar Management
    generateCalendar() {
        const now = new Date();
        this.currentCalendarMonth = this.currentCalendarMonth || now.getMonth();
        this.currentCalendarYear = this.currentCalendarYear || now.getFullYear();
        
        this.renderCalendar();
    }
    
    renderCalendar() {
        // Safety check for DOM elements
        const currentMonthEl = document.getElementById('currentMonth');
        const grid = document.getElementById('calendarGrid');
        
        if (!currentMonthEl || !grid) {
            return;
        }
        
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        
        // Update month header
        currentMonthEl.textContent = 
            `${monthNames[this.currentCalendarMonth]} ${this.currentCalendarYear}`;
        
        grid.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day header';
            dayEl.textContent = day;
            grid.appendChild(dayEl);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1);
        const lastDay = new Date(this.currentCalendarYear, this.currentCalendarMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Adjust for Monday start (getDay() returns 0 for Sunday)
        let startDayOfWeek = firstDay.getDay() - 1;
        if (startDayOfWeek < 0) startDayOfWeek = 6;
        
        // Add empty cells for previous month
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            grid.appendChild(emptyDay);
        }
        
        // Add days of current month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            const currentDate = new Date(this.currentCalendarYear, this.currentCalendarMonth, day);
            const dateString = currentDate.toDateString();
            
            // Check if it's today
            if (currentDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Check if it's in the future
            if (currentDate > today) {
                dayEl.classList.add('future');
            } else {
                // Get hasene data for this date
                const haseneData = this.getDailyHasene(dateString);
                
                if (haseneData >= 1000) {
                    dayEl.classList.add('complete');
                    if (this.isStreakDay(dateString)) {
                        dayEl.classList.add('streak');
                    }
                } else if (haseneData > 0) {
                    dayEl.classList.add('partial');
                } else {
                    dayEl.classList.add('empty');
                }
                
                // Add tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'calendar-tooltip';
                if (haseneData > 0) {
                    tooltip.textContent = `${haseneData} hasene kazanıldı`;
                } else {
                    tooltip.textContent = 'Henüz oynanmadı';
                }
                dayEl.appendChild(tooltip);
            }
            
            grid.appendChild(dayEl);
        }
    }
    
    getDailyHasene(dateString) {
        // Get stored daily hasene data from localStorage
        const haseneData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
        return haseneData[dateString] || 0;
    }
    
    storeDailyHasene(dateString, hasene) {
        // Store daily hasene data (set total, don't add)
        const haseneData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
        haseneData[dateString] = hasene; // Set total daily hasene, don't add
        localStorage.setItem('dailyHaseneData', JSON.stringify(haseneData));
    }
    
    isStreakDay(dateString) {
        // Check if this day is part of current streak
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        return streakData[dateString] === true;
    }
    
    hasPlayedToday(dateString) {
        // Check if any game was played today (based on streak data)
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        return streakData[dateString] === true;
    }
    
    updateStreakData(dateString, isStreak) {
        // Update streak data
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        streakData[dateString] = isStreak;
        localStorage.setItem('streakData', JSON.stringify(streakData));
    }
    
    // Loading Animation Functions
    startLoadingAnimation() {
        // Store elements in instance variables for scope access
        this.loadingText = document.getElementById('loadingText');
        this.spinner = document.querySelector('.loading-spinner');
        
        // DOM safety check
        if (!this.loadingText) {
            console.warn('Loading animation elements not found, skipping animation');
            return;
        }

        // 🏷️ FOOTER INJECTION - Directly add footer to loading screen
        this.injectLoadingFooter();
        
        // Start smooth loading sequence
        this.simulateLoading();
    }

    simulateLoading() {
        const messages = [
            { text: 'Hadis-i Şeriften istifade ediniz...', duration: 2500, spinnerState: 'normal', progress: 5 },
            { text: 'Kuran verileri yükleniyor...', duration: 3000, spinnerState: 'loading', progress: 25 },
            { text: 'Kelime hazinesi hazırlanıyor...', duration: 2200, spinnerState: 'pause', progress: 50 },
            { text: 'Ayet koleksiyonu işleniyor...', duration: 2200, spinnerState: 'loading', progress: 75 },
            { text: 'Ses dosyaları kontrol ediliyor...', duration: 2200, spinnerState: 'slow', progress: 90 },
            { text: 'Bismillah! Hazır...', duration: 2000, spinnerState: 'complete', progress: 100 }
        ];
        
        let currentMessage = 0;
        
        // Get progress elements
        this.progressFill = document.getElementById('loadingProgress');
        this.progressPercentage = document.getElementById('loadingPercentage');
        
        const changeMessage = () => {
            if (this.loadingText && currentMessage < messages.length) {
                const currentStep = messages[currentMessage];
                
                // Update text
                this.loadingText.textContent = currentStep.text;
                
                // Update spinner animation based on state
                this.updateSpinnerState(currentStep.spinnerState);
                
                // Update progress bar with realistic loading behavior
                this.updateProgress(currentStep.progress, currentStep.duration);
                
                currentMessage++;
                
                if (currentMessage < messages.length) {
                    setTimeout(changeMessage, currentStep.duration);
                } else {
                    // Final completion
                    setTimeout(() => {
                        this.completeLoadingAnimation();
                    }, currentStep.duration);
                }
            }
        };
        
        // Start message sequence after initial delay
        setTimeout(changeMessage, 100);
    }

    updateProgress(targetProgress, duration) {
        if (!this.progressFill || !this.progressPercentage) return;
        
        const startProgress = parseInt(this.progressFill.style.width) || 0;
        const progressDiff = targetProgress - startProgress;
        const stepTime = 50; // Update every 50ms
        const steps = Math.floor(duration / stepTime);
        const progressStep = progressDiff / steps;
        
        let currentProgress = startProgress;
        let step = 0;
        
        const progressInterval = setInterval(() => {
            step++;
            
            if (step < steps) {
                // Realistic loading with occasional pauses and bursts
                let increment = progressStep;
                
                // Add some randomness to make it feel more realistic
                if (Math.random() < 0.3) {
                    increment *= 0.5; // Slow down sometimes
                } else if (Math.random() < 0.1) {
                    increment *= 2; // Speed up sometimes
                }
                
                currentProgress += increment;
            } else {
                currentProgress = targetProgress; // Ensure we hit the target
                clearInterval(progressInterval);
            }
            
            this.progressFill.style.width = `${Math.min(currentProgress, 100)}%`;
            this.progressPercentage.textContent = `${Math.round(Math.min(currentProgress, 100))}%`;
        }, stepTime);
    }

    updateSpinnerState(state) {
        if (!this.spinner) return;
        
        // Remove all previous state classes
        this.spinner.classList.remove('loading-pause', 'loading-slow', 'loading-complete');
        
        switch (state) {
            case 'pause':
                // Pause the spinner for a moment
                this.spinner.classList.add('loading-pause');
                break;
            case 'slow':
                // Slow down the spinner
                this.spinner.classList.add('loading-slow');
                break;
            case 'complete':
                // Show completion state
                this.spinner.classList.add('loading-complete');
                break;
            case 'loading':
            default:
                // Normal spinning state - no additional classes needed
                break;
        }
    }

    injectLoadingFooter() {
        // Remove existing footer if any
        const existingFooter = document.getElementById('js-loading-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Create footer element
        const footer = document.createElement('div');
        footer.id = 'js-loading-footer';
        footer.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 12px 20px;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 20px;
            box-shadow: 0 6px 30px rgba(0, 0, 0, 0.7);
            font-family: 'Nunito', sans-serif;
        `;

        // Create version text
        const versionText = document.createElement('div');
        versionText.textContent = `HASENE v${APP_VERSION.version}`;
        versionText.style.cssText = `
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
            letter-spacing: 0.8px;
            margin: 0;
        `;

        // Create copyright text  
        const copyrightText = document.createElement('div');
        copyrightText.textContent = APP_VERSION.copyright;
        copyrightText.style.cssText = `
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
            font-weight: 600;
            letter-spacing: 0.6px;
            margin: 0;
        `;

        // Append elements
        footer.appendChild(versionText);
        footer.appendChild(copyrightText);

        // Add to loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.appendChild(footer);
        } else {
            document.body.appendChild(footer);
        }
    }

    injectGlobalFooter(screenId) {
        // Skip certain screens - INCLUDING LOADING SCREEN
        if (screenId === 'gameScreen' || screenId === 'loadingScreen') return;

        // Remove existing global footer if any
        const existingFooter = document.getElementById('js-global-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Create global footer element
        const footer = document.createElement('div');
        footer.id = 'js-global-footer';
        footer.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 50000 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2px !important;
            padding: 8px 12px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6) !important;
            font-family: 'Nunito', sans-serif !important;
            pointer-events: none !important;
        `;

        // Create version text
        const versionText = document.createElement('div');
        versionText.textContent = `v${APP_VERSION.version}`;
        versionText.style.cssText = `
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #ffffff !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 1) !important;
            letter-spacing: 0.5px !important;
            margin: 0 !important;
        `;

        // Loading screen için özel konumlandırma
        if (screenId === 'loadingScreen') {
            footer.style.bottom = '40px';
            footer.style.right = '50%';
            footer.style.transform = 'translateX(50%)';
            footer.style.left = 'auto';
        }
        
        const loadingSteps = [
            { text: "Arapça kelimeler yükleniyor...", duration: 2500 },
            { text: "Ses dosyaları hazırlanıyor...", duration: 2200 },
            { text: "Hasene sistemi aktifleştiriliyor...", duration: 2300 },
            { text: "Streak takvimi oluşturuluyor...", duration: 2000 },
            { text: "Başarım rozetleri kontrol ediliyor...", duration: 1800 },
            { text: "Oyun hazırlanıyor...", duration: 2000 }
        ];
        
        let currentStep = 0;
        let progress = 0;
        
        const animateStep = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                if (loadingText) {
                    loadingText.textContent = step.text;
                }
                
                const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100;
                
                const progressInterval = setInterval(() => {
                    progress += 0.8;
                    if (progress >= targetProgress) {
                        progress = targetProgress;
                        clearInterval(progressInterval);
                        
                        setTimeout(() => {
                            currentStep++;
                            animateStep();
                        }, 300);
                    }
                    
                    // Progress is now handled by the spinner animation
                }, 30);
            }
        };
        
        setTimeout(() => {
            animateStep();
        }, 12000);
    }
    
    completeLoadingAnimation() {
        // Wait for data to be loaded before transitioning
        if (!this.dataLoaded) {
            // If data not loaded yet, wait a bit and try again
            setTimeout(() => this.completeLoadingAnimation(), 500);
            return;
        }

        // Add fade-out class to loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
        
        // Wait for fade-out animation then show main menu
        setTimeout(() => {
            this.showScreen('mainMenu');
            // Setup event listeners after DOM is ready
            setTimeout(() => this.setupAchievementListeners(), 200);
        }, 800);
    }

    initializeDifficultyUI() {
        // 🔧 Güvenli zorluk yüklemesi
        const rawDifficulty = localStorage.getItem('difficulty') || 'medium';
        this.difficulty = this.normalizeDifficulty(rawDifficulty);
        // Storage'ı da normalize et
        localStorage.setItem('difficulty', this.difficulty);
        
        // UI'da doğru butonu aktif yap
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(this.difficulty + 'Btn');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Achievement functions
    showAchievements() {
        const modal = document.getElementById('achievementsModal');
        const grid = document.querySelector('.achievements-grid');
        
        grid.innerHTML = '';
        
        Object.values(this.achievements).forEach(achievement => {
            const isUnlocked = this.unlockedAchievements.includes(achievement.id);
            const progress = this.getAchievementProgress(achievement);
            const conditionMet = this.checkAchievementCondition(achievement);
            
            const item = document.createElement('div');
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : (conditionMet ? 'ready' : 'locked')}`;
            
            // Special styling for completed but not yet unlocked
            if (conditionMet && !isUnlocked) {
                item.style.background = 'linear-gradient(135deg, #fff3cd, #ffeaa7)';
                item.style.borderColor = '#ffc107';
                item.style.animation = 'achievementReady 2s ease-in-out infinite';
            }
            
            item.innerHTML = `
                <i class="${achievement.icon} achievement-icon"></i>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
                ${!isUnlocked && progress ? `<div class="achievement-progress">${progress}</div>` : ''}
                ${conditionMet && !isUnlocked ? `<div class="achievement-ready">🎉 Hazır!</div>` : ''}
            `;
            
            // Add click handler for ready achievements
            if (conditionMet && !isUnlocked) {
                item.style.cursor = 'pointer';
                item.onclick = () => {
                    this.unlockAchievementWithEffects(achievement.id);
                    this.showAchievements(); // Refresh the modal
                };
            }
            
            grid.appendChild(item);
        });
        
        modal.style.display = 'flex';
    }

    getAchievementProgress(achievement) {
        const id = achievement.id;
        
        if (id === 'firstGame') {
            return `${this.stats.gamesPlayed}/1`;
        } else if (id === 'streak3') {
            return `${this.stats.currentStreak}/3`;
        } else if (id === 'streak7') {
            return `${this.stats.currentStreak}/7`;
        } else if (id === 'hasene100') {
            return `${this.stats.totalHasene}/100`;
        } else if (id === 'hasene500') {
            return `${this.stats.totalHasene}/500`;
        } else if (id === 'perfect10') {
            return `${this.stats.perfectGames}/1`;
        } else if (id === 'wordMaster') {
            return `${this.stats.wordsLearned}/50`;
        } else if (id === 'speedster') {
            const avg = Math.round(this.stats.averageTime / 1000);
            return avg > 3 ? `${avg}s/3s` : 'Tamamlandı!';
        } else if (id === 'fillBlankMaster') {
            const fillBlankGames = parseInt(localStorage.getItem('fillblankGames')) || 0;
            return `${fillBlankGames}/10`;
        } else if (id === 'fillBlankPerfect') {
            const isPerfect = localStorage.getItem('lastFillBlankPerfect') === 'true';
            return isPerfect ? 'Tamamlandı!' : 'Mükemmel skor gerekli';
        } else if (id === 'ayahExplorer') {
            const fillBlankGames = parseInt(localStorage.getItem('fillblankGames')) || 0;
            return `${fillBlankGames}/50`;
        } else if (id === 'hasene1000') {
            return `${this.stats.totalHasene}/1000`;
        } else if (id === 'streak30') {
            return `${this.stats.currentStreak}/30`;
        } else if (id === 'wordGuru') {
            return `${this.stats.wordsLearned}/100`;
        } else if (id === 'gameAddict') {
            return `${this.stats.gamesPlayed}/100`;
        } else if (id === 'perfectStreak') {
            return `${this.stats.perfectStreak || 0}/5`;
        } else if (id === 'fastLearner') {
            const avg = Math.round(this.stats.averageTime / 1000);
            return avg > 2 ? `${avg}s/2s` : 'Tamamlandı!';
        } else if (id === 'smartLearner') {
            return 'Yanlış kelimeyi doğru yap';
        } else if (id === 'ayetListener') {
            const ayetHasene = parseInt(localStorage.getItem('ayetHasene')) || 0;
            return `${ayetHasene}/100 hasene`;
        } else if (id === 'duaListener') {
            const duaCount = parseInt(localStorage.getItem('listenedDuaCount')) || 0;
            return `${duaCount}/10 dua`;
        } else if (id === 'quranLover') {
            const uniqueSuras = this.getUniqueSuras();
            return `${uniqueSuras}/10 sure`;
        }
        
        return null;
    }

    // 🎯 Check if achievement condition is met (without unlocking)
    checkAchievementCondition(achievement) {
        try {
            return achievement.condition();
        } catch (error) {
            console.warn(`Achievement ${achievement.id} condition check failed:`, error);
            return false;
        }
    }

    checkNewAchievements() {
        
        let newAchievements = 0;
        
        Object.values(this.achievements).forEach(achievement => {
            const condition = achievement.condition();
            
            if (!this.unlockedAchievements.includes(achievement.id) && condition) {
                
                // 6. ✅ BADGE + KISA UNLOCK ANİMASYONU (modal yerine)
                this.unlockAchievementWithBadge(achievement);
                newAchievements++;
            }
        });
        
    }

    unlockAchievementWithBadge(achievement) {
        // Achievement'ı kaydet
        this.unlockedAchievements.push(achievement.id);
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
        
        
        // 6. ✅ KISA BADGE ANİMASYONU (modal yerine)
        this.showBadgeNotification(achievement);
        
        // Update notification badge
        this.updateNotificationBadges();
    }

    showBadgeNotification(achievement) {
        // 🎵 Achievement ses efekti
        if (window.soundManager) {
            window.soundManager.playAchievementUnlocked();
        }
        
        // 🎖️ Kısa badge gösterimi (3 saniye)
        const badge = document.createElement('div');
        badge.className = 'achievement-badge-notification';
        badge.innerHTML = `
            <div class="badge-content">
                <i class="${achievement.icon}"></i>
                <div class="badge-text">
                    <strong>${achievement.title}</strong>
                    <small>Rozet açıldı!</small>
                </div>
            </div>
        `;
        
        // Stil ekle
        badge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: 600;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(badge);
        
        // 3 saniye sonra kaldır
        setTimeout(() => {
            badge.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                if (badge.parentNode) {
                    badge.parentNode.removeChild(badge);
                }
            }, 500);
        }, 3000);
    }

    showAchievementUnlock(achievement) {
        // 🏆 Play achievement fanfare
        if (window.soundManager) {
            window.soundManager.playAchievementUnlocked();
        }
        
        const modal = document.getElementById('achievementUnlockModal');
        
        document.getElementById('unlockedAchievementIcon').className = achievement.icon;
        document.getElementById('unlockedAchievementTitle').textContent = achievement.title;
        document.getElementById('unlockedAchievementDesc').textContent = achievement.description;
        
        modal.style.display = 'flex';
        
        // Auto close after 3 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }

    showStats() {
        const modal = document.getElementById('statsModal');
        const streakModal = document.getElementById('streakModal');
        
        // Eğer streak modal'ı açıksa, önce onu kapat
        if (streakModal && streakModal.style.display === 'flex') {
            streakModal.style.display = 'none';
        }
        
        // ✅ Öğrenilen kelimeleri gerçek zamanlı hesapla
        this.stats.wordsLearned = this.calculateMasteredWords();
        
        // Update all stat numbers
        document.getElementById('statTotalGames').textContent = this.stats.gamesPlayed;
        document.getElementById('statTotalHasene').textContent = this.stats.totalHasene;
        document.getElementById('statMaxStreak').textContent = this.stats.currentStreak;
        document.getElementById('statCurrentStreak').textContent = this.stats.currentStreak + ' gün';
        document.getElementById('statWordsLearned').textContent = this.stats.wordsLearned;
        
        // Doğruluk oranı hesaplama
        const accuracyRate = this.stats.totalAnswers > 0 ? 
            Math.round((this.stats.correctAnswers / this.stats.totalAnswers) * 100) : 0;
        document.getElementById('statAccuracyRate').textContent = accuracyRate + '%';
        
        // Update charts
        this.updateWeeklyChart();
        this.updateGameModeStats();
        
        modal.style.display = 'flex';
    }

    updateWeeklyChart() {
        const { weeklyData, dayLabels } = this.getWeeklyData();
        const chartContainer = document.getElementById('weeklyChart');
        
        // Haftalık chart barları oluştur
        chartContainer.innerHTML = '';
        
        const maxValue = Math.max(...weeklyData, 1);
        
        weeklyData.forEach((value, index) => {
            // Bar yüksekliğini maksimum 60px ile sınırla (yazıyı kapatmasın)
            const height = Math.max((value / maxValue) * 60, 8);
            
            const chartBar = document.createElement('div');
            chartBar.className = 'chart-bar';
            chartBar.style.height = `${height}px`;
            
            chartBar.innerHTML = `
                <div class="chart-value">${value}</div>
                <div class="chart-label">${dayLabels[index]}</div>
            `;
            
            chartContainer.appendChild(chartBar);
        });
    }

    getWeeklyData() {
        // Son 7 gün için gerçek hasene verileri ve doğru gün etiketleri
        const weeklyData = [];
        const dayLabels = [];
        const today = new Date();
        const dayNames = ['Pz', 'Pt', 'Sl', 'Çr', 'Pr', 'Cu', 'Ct']; // Pazar=0, Pazartesi=1, ...
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            // Günün adını al (JavaScript'te Pazar=0, Pazartesi=1)
            const dayOfWeek = date.getDay();
            dayLabels.push(dayNames[dayOfWeek]);
            
            const dailyHasene = this.getDailyHasene(dateString) || 0;
            weeklyData.push(dailyHasene);
        }
        
        return { weeklyData, dayLabels };
    }

    updateGameModeStats() {
        // Gerçek oyun modları istatistikleri
        const translationGames = parseInt(localStorage.getItem('translationGames')) || 0;
        const listeningGames = parseInt(localStorage.getItem('listeningGames')) || 0;
        const speedGames = parseInt(localStorage.getItem('speedGames')) || 0;
        const fillblankGames = parseInt(localStorage.getItem('fillblankGames')) || 0;
        const ayetListens = parseInt(localStorage.getItem('listenedDuaCount')) || 0;
        const duaListens = parseInt(localStorage.getItem('duaListens')) || 0;
        
        const totalGames = translationGames + listeningGames + speedGames + fillblankGames + ayetListens + duaListens || 1; // 0'a bölme hatası önleme
        
        const modes = [
            { 
                name: 'Çeviri', 
                class: 'translation', 
                percentage: Math.round((translationGames / totalGames) * 100),
                count: translationGames
            },
            { 
                name: 'Dinleme', 
                class: 'listening', 
                percentage: Math.round((listeningGames / totalGames) * 100),
                count: listeningGames
            },
            { 
                name: 'Hız', 
                class: 'speed', 
                percentage: Math.round((speedGames / totalGames) * 100),
                count: speedGames
            },
            { 
                name: 'Boşluk Doldur', 
                class: 'fillblank', 
                percentage: Math.round((fillblankGames / totalGames) * 100),
                count: fillblankGames
            },
            { 
                name: 'Ayet Dinleme', 
                class: 'ayet', 
                percentage: Math.round((ayetListens / totalGames) * 100),
                count: ayetListens
            },
            { 
                name: 'Dua Dinleme', 
                class: 'dua', 
                percentage: Math.round((duaListens / totalGames) * 100),
                count: duaListens
            }
        ];
        
        modes.forEach((mode, index) => {
            const progressBar = document.querySelectorAll('.mode-bar')[index];
            const percentageSpan = document.querySelectorAll('.mode-percentage')[index];
            
            if (progressBar && percentageSpan) {
                progressBar.style.width = `${mode.percentage}%`;
                percentageSpan.textContent = `${mode.percentage}% (${mode.count})`;
            }
        });
    }

    updateNotificationBadges() {
        // Sadece bildirim sayısını güncelle, otomatik açılış yapma
        const newAchievements = Object.values(this.achievements).filter(achievement => 
            achievement.condition() && !this.unlockedAchievements.includes(achievement.id)
        ).length;
        
        const badge = document.querySelector('.notification-badge');
        if (newAchievements > 0) {
            badge.style.display = 'flex';
            badge.textContent = newAchievements;
        } else {
            badge.style.display = 'none';
        }
    }

    showCalendar() {
        const modal = document.getElementById('calendarModal');
        
        // Generate calendar
        this.renderCalendar();
        
        modal.style.display = 'flex';
    }
    
    // 🔧 LEGACY setDifficulty - şimdi normalize ediyor
    setDifficulty(level) {
        const normalized = this.normalizeDifficulty(level);
        this.difficulty = normalized;
        localStorage.setItem('difficulty', normalized);
        
        // UI güncelle
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Btn').classList.add('active');
        
    }

    getDifficultyWords(wordData, difficulty) {
        let selectedWords = [];

        // 🔧 Güvenlik kontrolleri
        if (!wordData || wordData.length === 0) {
            console.warn(`⚠️ getDifficultyWords: wordData boş veya yok!`);
            return [];
        }

        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty)) {
            console.warn(`⚠️ getDifficultyWords: Beklenmeyen difficulty değeri: "${difficulty}", tüm kelimeler döndürülecek`);
        }

        switch(difficulty) {
            case 'easy':
                // Zorluk seviyesi 3-7: Kolay kelimeler
                selectedWords = wordData.filter(word => 
                    word.difficulty >= 3 && word.difficulty <= 7
                );
                break;
                
            case 'medium':
                // Zorluk seviyesi 8-12: Orta kelimeler  
                selectedWords = wordData.filter(word => 
                    word.difficulty >= 8 && word.difficulty <= 12
                );
                break;
                
            case 'hard':
                // Zorluk seviyesi 13-21: Zor kelimeler
                selectedWords = wordData.filter(word => 
                    word.difficulty >= 13 && word.difficulty <= 21
                );
                break;
                
            default:
                selectedWords = wordData;
        }

        // Seçilen kelimelerin difficulty dağılımını göster (sadece ilk seferde)
        if (selectedWords.length > 0 && !this.difficultyStatsShown) {
            const difficultyStats = selectedWords.reduce((acc, word) => {
                acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
                return acc;
            }, {});
            this.difficultyStatsShown = true;
        }
        return selectedWords;
    }

    getDifficultyAyets(ayetData, difficulty) {
        let selectedAyets = [];

        if (!ayetData || ayetData.length === 0) {
            console.warn(`⚠️ getDifficultyAyets: ayetData boş veya yok!`);
            return [];
        }

        // 🔧 Güvenlik: Beklenmeyen difficulty değerlerini logla
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty)) {
            console.warn(`⚠️ getDifficultyAyets: Beklenmeyen difficulty değeri: "${difficulty}", tüm ayetler döndürülecek`);
        }

        ayetData.forEach(ayet => {
            if (!ayet || !ayet['ayahs.text_uthmani_tajweed']) return;
            
            const arabicText = ayet['ayahs.text_uthmani_tajweed'];
            const wordCount = arabicText.split(/\s+/).filter(word => word.length > 2).length;
            
            // Kelime sayısına göre zorluk belirleme
            switch(difficulty) {
                case 'easy':
                    // 3-6 kelime: Kolay ayetler (kısa)
                    if (wordCount >= 3 && wordCount <= 6) {
                        selectedAyets.push(ayet);
                    }
                    break;
                    
                case 'medium':
                    // 7-12 kelime: Orta ayetler  
                    if (wordCount >= 7 && wordCount <= 12) {
                        selectedAyets.push(ayet);
                    }
                    break;
                    
                case 'hard':
                    // 13+ kelime: Zor ayetler (uzun ve karmaşık)
                    if (wordCount >= 13) {
                        selectedAyets.push(ayet);
                    }
                    break;
                    
                default:
                    selectedAyets.push(ayet);
            }
        });

        return selectedAyets.length > 0 ? selectedAyets : ayetData; // Eğer hiç ayet bulunamazsa tümünü döndür
    }
}

// ⚡ CRITICAL FIX: Manually add missing methods to prototype
ArabicLearningGame.prototype.normalizeDifficulty = function(difficulty) {
    // Canonical değerler: 'easy', 'medium', 'hard'
    const canonicalMap = {
        // Türkçe mappings
        'kolay': 'easy',
        'orta': 'medium', 
        'zor': 'hard',
        // İngilizce (zaten canonical)
        'easy': 'easy',
        'medium': 'medium',
        'hard': 'hard',
        // Fallback mappings
        'e': 'easy',
        'm': 'medium', 
        'h': 'hard',
        '1': 'easy',
        '2': 'medium',
        '3': 'hard'
    };
    
    // Normalize et
    const normalized = canonicalMap[difficulty?.toLowerCase()] || 'medium';
    
    // Debug
    if (difficulty !== normalized) {
    }
    
    return normalized;
};

ArabicLearningGame.prototype.getDifficulty = function() {
    return this.normalizeDifficulty(this.difficulty);
};

ArabicLearningGame.prototype.generateFillBlankQuestion = function() {
    const words = this.getRandomArabic(); // Eksik parantez eklendi
    return {
        blanks: blanks,
        difficulty: this.getDifficulty()
    };
};

ArabicLearningGame.prototype.saveGameData = function() {
    // 1. ✅ TEK KAYNAK KULLANIMLARI - HEP 'totalHasene' anahtarı
    localStorage.setItem('totalHasene', this.totalHasene.toString());
    localStorage.setItem('dailyHasene', this.dailyHasene.toString());
    localStorage.setItem('streak', this.streak.toString());
    localStorage.setItem('difficulty', this.difficulty);
    localStorage.setItem('correctAnswers', this.correctAnswers.toString());
    localStorage.setItem('totalAnswers', this.totalAnswers.toString());
    
    // 7. ✅ UNLOCK ACHIEVEMENTS SENKRONİZASYONU
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements || []));
    localStorage.setItem('lastPlayDate', this.lastPlayDate || '');
    
    // 2. ✅ GAMEDATA NESNESİ - aynı veriler
    const gameData = {
        totalHasene: this.totalHasene,
        dailyHasene: this.dailyHasene,
        streak: this.streak,
        level: this.level,
        difficulty: this.difficulty,
        correctAnswers: this.correctAnswers,
        totalAnswers: this.totalAnswers,
        lastPlayDate: this.lastPlayDate,
        unlockedAchievements: this.unlockedAchievements || []
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
    
    return gameData;
};

ArabicLearningGame.prototype.loadGameData = function() {
    // 3. ✅ TUTARLI YÜKLEME - önce localStorage, sonra gameData
    this.totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
    this.dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
    this.streak = parseInt(localStorage.getItem('streak')) || 0;
    this.correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
    this.totalAnswers = parseInt(localStorage.getItem('totalAnswers')) || 0;
    this.lastPlayDate = localStorage.getItem('lastPlayDate') || '';
    
    // 7. ✅ UNLOCK ACHIEVEMENTS YÜKLEME
    this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
    
    // GameData varsa üzerine yaz (backup olarak)
    const saved = localStorage.getItem('gameData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            this.totalHasene = data.totalHasene || this.totalHasene;
            this.dailyHasene = data.dailyHasene || this.dailyHasene;
            this.streak = data.streak || this.streak;
            this.level = data.level || 1;
            this.difficulty = data.difficulty || 'medium';
            this.correctAnswers = data.correctAnswers || this.correctAnswers;
            this.totalAnswers = data.totalAnswers || this.totalAnswers;
            this.lastPlayDate = data.lastPlayDate || this.lastPlayDate;
            this.unlockedAchievements = data.unlockedAchievements || this.unlockedAchievements;
            return data;
        } catch (e) {
            console.error('❌ GameData parse hatası:', e);
        }
    }
    
    
    // ✅ CALENDAR DATA RESTORE - oyun başlarken bugünkü hasene'yi restore et
    const today = new Date().toDateString();
    const calendarData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
    const todaysCalendarHasene = calendarData[today] || 0;
    
    // Eğer calendar'da bugün için veri varsa ve dailyHasene ile uyuşmuyorsa
    if (todaysCalendarHasene > 0 && todaysCalendarHasene !== this.dailyHasene) {
        this.dailyHasene = todaysCalendarHasene;
        // localStorage'ı da güncelle
        localStorage.setItem('dailyHasene', this.dailyHasene.toString());
    }
    
    // UI'yi güncelle
    this.updateUI();
    
    return null;
};

// 8. ✅ BASİT OTOMATIK TEST SENARYOLARı
window.haseneTests = {
    // Test: Hasene kazanımı
    testHaseneGain() {
        const oldTotal = game.totalHasene;
        const oldDaily = game.dailyHasene;
        
        // Simulate correct answer with 5-letter word
        game.gameHasene += 50; // 5 letters * 10
        game.totalHasene += 50;
        game.dailyHasene += 50;
        game.saveGameData();
        
        const success = (game.totalHasene === oldTotal + 50) && (game.dailyHasene === oldDaily + 50);
        return success;
    },
    
    // Test: Hasene azaltma
    testHaseneDecrease() {
        const oldTotal = game.totalHasene;
        const oldDaily = game.dailyHasene;
        
        if (oldTotal < 10) {
            game.totalHasene += 50;
            game.dailyHasene += 50;
        }
        
        // Simulate wrong answer
        const decrease = 10;
        game.totalHasene = Math.max(0, game.totalHasene - decrease);
        game.dailyHasene = Math.max(0, game.dailyHasene - decrease);
        game.saveGameData();
        
        const success = game.totalHasene < oldTotal;
        return success;
    },
    
    // Test: LocalStorage senkronizasyonu
    testStorageSync() {
        game.saveGameData();
        
        const storageTotal = parseInt(localStorage.getItem('totalHasene'));
        const storageDaily = parseInt(localStorage.getItem('dailyHasene'));
        
        const success = (storageTotal === game.totalHasene) && (storageDaily === game.dailyHasene);
        return success;
    },
    
    // Tüm testleri çalıştır
    runAllTests() {
        const results = {
            gain: this.testHaseneGain(),
            decrease: this.testHaseneDecrease(), 
            storage: this.testStorageSync()
        };
        
        const allPassed = Object.values(results).every(r => r);
        return results;
    }
};

// Global game instance
if (typeof game === 'undefined') {
    var game;
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // 🏷️ Update version info in UI
    updateVersionInfo();
    
    if (typeof game === 'undefined' || game === null) {
        game = new ArabicLearningGame();
        // 🌍 Global erişim için window'a da ekle
        window.game = game;
        window.arabicLearningGame = game;
    }
    
    // 🛍️ Shop UI'ını başlangıçta güncelle
    updateShopUI();
    
    // Background müzik ayarlarını yükle
    initializeBackgroundMusic();
});

// Background müzik başlatma fonksiyonu
function initializeBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicBtn = document.getElementById('musicButton');
    
    if (!backgroundMusic) {
        console.warn('Background music element bulunamadı');
        return;
    }

    if (!musicBtn) {
        console.warn('Music button element bulunamadı');
        return;
    }

    // Kullanıcının müzik tercihini kontrol et
    const musicEnabled = localStorage.getItem('backgroundMusicEnabled');
    
    if (musicEnabled === 'true') {
        // Müzik açık olarak ayarlanmış
        const musicIcon = musicBtn.querySelector('i');
        if (musicIcon) {
            musicIcon.className = 'fas fa-music';
        }
        musicBtn.style.opacity = '1';
    } else {
        // Müziği kapalı (varsayılan)
        const musicIcon = musicBtn.querySelector('i');
        if (musicIcon) {
            musicIcon.className = 'fas fa-music-slash';
        }
        musicBtn.style.opacity = '0.5';
    }
}

// Test function for validating difficulty levels
function testAllGameModes() {
    
    const modes = ['translation', 'listening', 'speed', 'fillblank'];
    const difficulties = ['easy', 'medium', 'hard'];
    
    modes.forEach(mode => {
        
        difficulties.forEach(difficulty => {
            
            // Zorluk seviyesini ayarla
            game.setDifficulty(difficulty);
            
            // Oyunu başlat (gerçekte başlatmadan sadece soru üretimi test)
            if (mode === 'fillblank') {
                if (game.ayetData && game.ayetData.length > 0) {
                    const difficultyAyets = game.getDifficultyAyets(game.ayetData, difficulty);
                } else {
                }
            } else {
                if (game.wordData && game.wordData.length > 0) {
                    const difficultyWords = game.getDifficultyWords(game.wordData, difficulty);
                } else {
                }
            }
        });
    });
    
}

// Global functions for HTML onclick events
function startGame(mode = 'translation') {
    if (game && game.wordData && game.wordData.length > 0) {
        game.startGame(mode);
    } else {
        alert('Oyun henüz yükleniyor, lütfen bekleyiniz...');
    }
}

function returnToMenu() {
    if (game) {
        game.returnToMenu();
    }
}

function selectOption(button, index) {
    if (game) {
        game.selectOption(button, index);
    }
}

function checkAnswer() {
    if (game) {
        game.checkAnswer();
    }
}

function setDifficulty(level) {
    // 🎮 Game objesi kontrolü - tüm referansları dene
    const gameObj = window.game || window.arabicLearningGame || game;
    
    if (gameObj && typeof gameObj.setDifficulty === 'function') {
        gameObj.setDifficulty(level);
        
        // 🔄 Cache'i temizle ki yeni difficulty hemen etkili olsun
        if (gameObj.cachedDifficultyWords) {
            gameObj.cachedDifficultyWords = null;
        }
        
        // 🎨 UI güncellemesi
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Btn').classList.add('active');
        
    } else {
        console.error('❌ Game objesi bulunamadı - setDifficulty çalışmadı!');
    }
}

// Modal close functions
function closeAchievementsModal() {
    document.getElementById('achievementsModal').style.display = 'none';
}

function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

function closeAchievementUnlockModal() {
    document.getElementById('achievementUnlockModal').style.display = 'none';
}


// Global functions for HTML onclick events
function toggleCalendar() {
    if (game) {
        game.showCalendar();
    }
}

function showAchievements() {
    if (game) {
        game.showAchievements();
    }
}

function showStats() {
    if (game) {
        game.showStats();
    }
}

function checkEnter(event) {
    if (game) {
        game.checkEnter(event);
    }
}

function nextQuestion() {
    if (game) {
        game.nextQuestion();
    } else {
        console.error('Game instance not found');
    }
}

function skipQuestion() {
    if (game) {
        game.skipQuestion();
    }
}

function playAudio() {
    if (game) {
        game.playAudio();
    }
}

function playFeedbackAudio() {
    if (game) {
        game.playFeedbackAudio();
    }
}

function closeLevelUpModal() {
    if (game) {
        game.closeLevelUpModal();
    }
}

function closeStreakModal() {
    if (game) {
        game.closeStreakModal();
    }
}

function changeMonth(direction) {
    if (game) {
        game.currentCalendarMonth += direction;
        if (game.currentCalendarMonth < 0) {
            game.currentCalendarMonth = 11;
            game.currentCalendarYear--;
        } else if (game.currentCalendarMonth > 11) {
            game.currentCalendarMonth = 0;
            game.currentCalendarYear++;
        }
        game.renderCalendar();
    }
}

// Calendar modal function
function closeCalendarModal() {
    document.getElementById('calendarModal').style.display = 'none';
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
            })
            .catch(registrationError => {
            });
    });
}

// Arabic Virtual Keyboard Functions
function addChar(char) {
    const input = document.getElementById('answerInput');
    input.value += char;
    input.focus();
}

function deleteLastChar() {
    const input = document.getElementById('answerInput');
    input.value = input.value.slice(0, -1);
    input.focus();
}

function clearInput() {
    const input = document.getElementById('answerInput');
    input.value = '';
    input.focus();
}

// Initialize Arabic keyboard event listeners
function initArabicKeyboard() {
    const keyButtons = document.querySelectorAll('.key-btn[data-char]');
    keyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const char = this.getAttribute('data-char');
            addChar(char);
        });
    });
}

// Heart Refill System (Duolingo-style)
if (typeof heartRefillTimer === 'undefined') {
    var heartRefillTimer = null;
}
if (typeof unlimitedHeartsActive === 'undefined') {
    var unlimitedHeartsActive = false;
}

function showHeartsDepleted() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('heartsDepleted').style.display = 'flex';
    
    // Heart timer'ını başlat
    startHeartRefillTimer();
}

function watchAdForHearts() {
    
    // Fake ad loading
    const button = event.target.closest('.refill-option');
    const originalContent = button.innerHTML;
    
    button.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <div class="option-content">
            <h3>Reklam Yükleniyor...</h3>
            <p>Lütfen bekleyin</p>
        </div>
    `;
    button.style.pointerEvents = 'none';
    
    // 3 saniye fake reklam
    setTimeout(() => {
        // 1 kalp ver
        game.hearts = Math.min(game.hearts + 1, 5);
        game.updateHeartsDisplay();
        
        // Başarı mesajı
        button.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--primary-green);"></i>
            <div class="option-content">
                <h3>Tebrikler!</h3>
                <p>1 kalp kazandın! ❤️</p>
            </div>
        `;
        
        // 2 saniye sonra oyuna dön
        setTimeout(() => {
            document.getElementById('heartsDepleted').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'flex';
        }, 2000);
    }, 3000);
}

function startHeartRefillTimer() {
    let timeLeft = 30 * 60; // 30 dakika (saniye cinsinden)
    
    heartRefillTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('heartTimer');
        if (timerElement) {
            timerElement.textContent = timerDisplay;
        }
        
        if (timeLeft <= 0) {
            clearInterval(heartRefillTimer);
            
            // 1 kalp ver
            if (game && game.hearts < 5) {
                game.hearts++;
                game.updateHeartsDisplay();
                
                // Bildirim göster
                showNotification('❤️ Yeni kalp kazandın!', 'success');
            }
            
            // Timer'ı yeniden başlat
            startHeartRefillTimer();
        }
    }, 1000);
}

function showWaitTimer() {
    showNotification('⏰ Kalp yenilenmesi için beklemen gerekiyor!', 'info');
}

function buyUnlimitedHearts() {
    const currentHasene = parseInt(localStorage.getItem('totalHasene') || '0');
    
    if (currentHasene >= 100) {
        // Hasene düş
        const newHasene = currentHasene - 100;
        localStorage.setItem('totalHasene', newHasene.toString());
        
        // Sınırsız kalp aktifleştir
        unlimitedHeartsActive = true;
        localStorage.setItem('unlimitedHearts', 'true');
        
        // UI güncelle
        if (game) {
            game.hearts = 5;
            game.updateHeartsDisplay();
        }
        
        showNotification('♾️ Sınırsız kalp aktifleştirildi!', 'success');
        
        // Oyuna dön
        setTimeout(() => {
            document.getElementById('heartsDepleted').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'flex';
        }, 2000);
    } else {
        showNotification('❌ Yeterli Hasene yok! (100 Hasene gerekli)', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Basit notification sistemi
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animasyon CSS'ini ekle
if (!document.getElementById('musicMenuStyles')) {
    const style = document.createElement('style');
    style.id = 'musicMenuStyles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification {
            font-family: var(--font-family);
        }
    `;
    document.head.appendChild(style);
}

// 🛡️ Streak Shop Fonksiyonları
function showStreakShop() {
    updateShopUI();
    document.getElementById('streakShopModal').style.display = 'block';
}

function closeStreakShop() {
    document.getElementById('streakShopModal').style.display = 'none';
}

function updateShopUI() {
    // Sahip olunan koruma sayılarını güncelle
    const streakFreezes = parseInt(localStorage.getItem('streakFreezes')) || 0;
    const weekendPasses = parseInt(localStorage.getItem('weekendPasses')) || 0;
    const currentHasene = parseInt(localStorage.getItem('totalHasene')) || 0;  // totalHasene key kullan
    
    // Shop modal'daki sayıları güncelle
    document.getElementById('ownedStreakFreezes').textContent = streakFreezes;
    document.getElementById('ownedWeekendPasses').textContent = weekendPasses;
    
    // Header'daki mini counter'ları güncelle
    document.getElementById('streakFreezeCount').textContent = streakFreezes;
    document.getElementById('weekendPassCount').textContent = weekendPasses;
    
    // 💰 Hasene görünümünü güncelle (varsa)
    const haseneDisplay = document.getElementById('hasene');
    if (haseneDisplay) {
        haseneDisplay.textContent = currentHasene;
    }
}

function buyItem(itemType, buttonElement) {
    // 🎮 Game objesi kontrolü - Global game'i kullan
    const gameObj = window.game || window.arabicLearningGame || game;
    
    if (gameObj && typeof gameObj.buyStreakProtection === 'function') {
        
        const success = gameObj.buyStreakProtection(itemType);
        
        if (success) {
            updateShopUI();
            
            // 🔊 Purchase success sound
            if (window.audioGenerator) {
                window.audioGenerator.playPurchaseSound();
            }
            
            // Başarı animasyonu (sadece button varsa)
            const buyBtn = buttonElement || event?.target;
            if (buyBtn) {
                buyBtn.style.background = '#4CAF50';
                buyBtn.textContent = '✅ Satın Alındı!';
                
                setTimeout(() => {
                    buyBtn.style.background = '#667eea';
                    buyBtn.textContent = 'Satın Al';
                }, 2000);
            }
        } else {
            // Başarısız animasyonu (sadece button varsa)
            const buyBtn = buttonElement || event?.target;
            if (buyBtn) {
                buyBtn.style.background = '#f44336';
                buyBtn.textContent = '❌ Yetersiz Hasene';
                
                setTimeout(() => {
                    buyBtn.style.background = '#667eea';
                    buyBtn.textContent = 'Satın Al';
                }, 2000);
            }
        }
    } else {
        console.error('❌ Game objesi bulunamadı!');
        
        // Kullanıcıya hata göster
        alert('❌ Oyun başlatılmadı! Sayfayı yenileyin.');
    }
}

// 📊 Statistics Modal Functions
function showStatsModal() {
    updateStatsDisplay();
    document.getElementById('statsModal').style.display = 'block';
    
    // 🔊 Stats open sound effect
    if (window.audioGenerator) {
        window.audioGenerator.playStatsOpenSound();
    }
}

function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

function updateStatsDisplay() {
    // localStorage'dan istatistikleri al
    const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
    const totalGames = parseInt(localStorage.getItem('totalGamesPlayed')) || 0;
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
    
    // Doğru/yanlış hesapla
    let totalCorrect = 0;
    let totalWrong = 0;
    const wrongWords = [];
    
    Object.entries(wordStats).forEach(([word, stats]) => {
        totalCorrect += stats.correct || 0;
        totalWrong += stats.wrong || 0;
        
        if (stats.wrong > 0) {
            wrongWords.push({ word, count: stats.wrong });
        }
    });
    
    // Başarı oranı hesapla
    const totalAnswers = totalCorrect + totalWrong;
    const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
    
    // UI'ı güncelle
    document.getElementById('totalGamesPlayed').textContent = totalGames;
    document.getElementById('totalCorrectAnswers').textContent = totalCorrect;
    document.getElementById('totalWrongAnswers').textContent = totalWrong;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('bestStreak').textContent = bestStreak;
    
    // En çok yanlış yapılan kelimeleri göster
    updateMostWrongWords(wrongWords);
    
}

function updateMostWrongWords(wrongWords) {
    const container = document.getElementById('mostWrongWords');
    
    // En çok yanlış yapılanları sırala (en fazla 5 tane)
    const sortedWords = wrongWords
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    if (sortedWords.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #777;">Henüz yanlış cevap yok! 🎉</p>';
        return;
    }
    
    container.innerHTML = sortedWords
        .map(item => `
            <div class="wrong-word-item">
                <span class="wrong-word-text">${item.word}</span>
                <span class="wrong-word-count">${item.count}x</span>
            </div>
        `).join('');
}

// 🧠 Smart Learner Achievement Functions
ArabicLearningGame.prototype.checkSmartLearnerAchievement = function() {
    // Sadece doğru cevap verildiyse kontrol et
    if (this.lastAnswerCorrect && this.currentQuestion && this.currentQuestion.word) {
        const currentWord = this.currentQuestion.word.kelime;
        const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
        
        
        // Bu kelime daha önce yanlış yapılmış mı?
        if (wordStats[currentWord] && wordStats[currentWord].wrong > 0) {
            
            // Smart Learner achievement'ı zaten kazanılmış mı?
            if (!this.unlockedAchievements.includes('smartLearner')) {
                this.unlockAchievement('smartLearner');
            } else {
            }
        } else {
        }
    } else {
    }
};

ArabicLearningGame.prototype.unlockAchievement = function(achievementId) {
    // Use the new effects-enabled function
    return this.unlockAchievementWithEffects(achievementId);
};

ArabicLearningGame.prototype.showAchievementNotification = function(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return;
    
    // 🎨 Show visual achievement notification
    this.showVisualAchievement(achievement);
};

// 🎨 NEW: Visual Achievement System
ArabicLearningGame.prototype.showVisualAchievement = function(achievement) {
    // Create achievement overlay
    const overlay = document.createElement('div');
    overlay.className = 'achievement-overlay';
    
    // Determine if this is a special achievement
    const isSpecial = ['smartLearner', 'hasene1000', 'streak30', 'perfectStreak', 'wordGuru'];
    
    if (isSpecial) {
        overlay.classList.add('special-achievement');
    }
    
    overlay.innerHTML = `
        <div class="achievement-card">
            <div class="particles">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
            </div>
            <div class="achievement-icon">${this.getAchievementEmoji(achievement.id)}</div>
            <h2 class="achievement-title">${achievement.title}</h2>
            <p class="achievement-description">${achievement.description}</p>
            <div class="progress-ring">
                <svg>
                    <circle class="bg-circle" cx="30" cy="30" r="30"></circle>
                    <circle class="progress-circle" cx="30" cy="30" r="30"></circle>
                </svg>
                <div class="percentage">100%</div>
            </div>
            <button class="achievement-close-btn" onclick="this.parentElement.parentElement.remove()">
                ✨ Harika! ✨
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 300);
    }, 5000);
    
    // 🔊 Play achievement sound
    if (this.soundManager) {
        this.soundManager.playAchievementUnlocked();
    }
    
    // 🔊 Enhanced achievement sound
    if (window.audioGenerator) {
        window.audioGenerator.playAchievementSound();
        
        // Special sound for Smart Learner
        if (achievement.id === 'smartLearner') {
            setTimeout(() => {
                window.audioGenerator.playSmartLearnerSound();
            }, 500);
        }
    }
};

// 🎨 Get Achievement Emoji
ArabicLearningGame.prototype.getAchievementEmoji = function(achievementId) {
    const emojiMap = {
        ayetListener: '📖',
        duaListener: '📿',
        firstGame: '🕌',
        streak3: '📿',
        streak7: '🕌',
        streak30: '📅',
        hasene100: '💎',
        hasene500: '👑',
        hasene1000: '🔥',
        smartLearner: '💡',
        perfect10: '⭐',
        perfectStreak: '💎',
        speedster: '⚡',
        fastLearner: '🚀',
        wordMaster: '📚',
        wordGuru: '🎓',
        gameAddict: '🎮',
        quranLover: '📖',
        fillBlankMaster: '🧩',
        fillBlankPerfect: '📚'
    };
    
    return emojiMap[achievementId] || '🏆';
};

// 🎨 Mini Achievement Notification (for less important achievements)
ArabicLearningGame.prototype.showMiniAchievement = function(achievement) {
    const mini = document.createElement('div');
    mini.className = 'mini-achievement';
    
    mini.innerHTML = `
        <div class="mini-achievement-icon">${this.getAchievementEmoji(achievement.id)}</div>
        <div class="mini-achievement-text">
            <div class="mini-achievement-title">${achievement.title}</div>
            <div class="mini-achievement-desc">${achievement.description.substring(0, 50)}...</div>
        </div>
    `;
    
    document.body.appendChild(mini);
    
    // Show animation
    setTimeout(() => {
        mini.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        mini.classList.remove('show');
        setTimeout(() => {
            if (mini.parentElement) {
                mini.remove();
            }
        }, 500);
    }, 3000);
};

// 🎨 Enhanced Achievement Unlock Function
ArabicLearningGame.prototype.unlockAchievementWithEffects = function(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement || this.unlockedAchievements.includes(achievementId)) {
        return false;
    }
    
    // Unlock the achievement
    this.unlockedAchievements.push(achievementId);
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
    
    // Determine notification type
    const majorAchievements = ['smartLearner', 'hasene1000', 'streak30', 'perfectStreak', 'wordGuru'];
    
    if (majorAchievements.includes(achievementId)) {
        // Full screen achievement
        this.showVisualAchievement(achievement);
    } else {
        // Mini notification
        this.showMiniAchievement(achievement);
    }
    
    return true;
};




