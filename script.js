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
        this.musicEnabled = !this.musicEnabled;
        console.log('SoundManager toggleMusic, yeni durum:', this.musicEnabled);
        localStorage.setItem('musicEnabled', this.musicEnabled);
        
        if (!this.musicEnabled && this.musicLoop) {
            console.log('Müzik kapatıldı, loop temizleniyor');
            clearInterval(this.musicLoop);
            this.musicLoop = null;
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
        if (this.musicEnabled && this.audioGenerator) {
            // Önce var olan müziği durdur
            this.stopBackgroundMusic();
            
            // Her 15 saniyede müzik tekrarla (daha uzun interval)
            this.musicLoop = setInterval(() => {
                if (this.musicEnabled) {
                    this.audioGenerator.playBackgroundMusic();
                }
            }, 15000);
            
            // İlk çalma
            this.audioGenerator.playBackgroundMusic();
        }
    }

    // Arka plan müziği durdur
    stopBackgroundMusic() {
        console.log('stopBackgroundMusic çağrıldı, musicLoop:', this.musicLoop);
        if (this.musicLoop) {
            clearInterval(this.musicLoop);
            this.musicLoop = null;
            console.log('Müzik loop temizlendi');
        } else {
            console.log('Müzik loop zaten null');
        }
        
        // Aktif çalan müziği de durdur
        if (this.audioGenerator) {
            this.audioGenerator.stopAllMusic();
        }
    }
}

// Global SoundManager instance
window.soundManager = new SoundManager();

// Duolingo-style Game Logic - Updated
class ArabicLearningGame {
    constructor() {
        this.wordData = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.hearts = 5; // Duolingo gibi 5 kalp
        this.gameXP = 0;
        
        // Sınırsız kalp kontrolü
        unlimitedHeartsActive = localStorage.getItem('unlimitedHearts') === 'true';
        this.totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
        this.streak = parseInt(localStorage.getItem('streak')) || 0;
        this.level = Math.floor(this.totalHasene / 500) + 1; // Daha hızlı seviye atlaması
        this.xp = this.totalHasene;
        this.xpToNextLevel = (this.level * 500) - this.totalHasene;
        this.dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
        this.lastPlayDate = localStorage.getItem('lastPlayDate') || '';
        this.wordsLearned = 0; // Dinamik olarak hesaplanacak
        this.totalAnswers = parseInt(localStorage.getItem('totalAnswers')) || 0;
        this.correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
        this.gameMode = 'translation';
        this.difficulty = localStorage.getItem('difficulty') || 'medium';
        this.questions = [];
        this.currentAudio = null;
        
        // Calendar variables
        const now = new Date();
        this.currentCalendarMonth = now.getMonth();
        this.currentCalendarYear = now.getFullYear();
        
        this.initializeAchievements();
        this.init();
    }
    
    initializeAchievements() {
        // Başarımları tanımla - İslami Temalar 🕌📿
        this.achievements = {
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
            // Start loading animation
            this.startLoadingAnimation();
            
            // Load word data
            await this.loadWordData();
            
            // Check daily streak
            this.checkDailyStreak();
            
            // Update UI
            this.updateUI();
            
            // Initialize difficulty UI
            this.initializeDifficultyUI();
            
            // Complete loading animation
            this.completeLoadingAnimation();
        } catch (error) {
            console.error('Game initialization failed:', error);
            alert('Oyun yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        }
    }
    
    async loadWordData() {
        try {
            console.log('Data yükleniyor...');
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            this.wordData = await response.json();
            console.log(`✅ ${this.wordData.length} kelime başarıyla yüklendi!`);
            
            // Test: İlk 5 kelimeyi göster
            console.log('İlk 5 kelime:', this.wordData.slice(0, 5));
            
        } catch (error) {
            console.error('❌ Kelime verisi yükleme hatası:', error);
            
            // Show user-friendly error message
            alert(`Oyun verileri yüklenemedi!\n\nLütfen:\n• İnternet bağlantınızı kontrol edin\n• Sayfayı yenileyin (F5)\n• Tarayıcı cache'ini temizleyin\n\nHata: ${error.message}`);
            
            // Set empty data to prevent further errors
            this.wordData = [];
            return;
        }
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show requested screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = 'flex';
            targetScreen.scrollTop = 0;
        }
        
        // Music control based on screen
        if (window.soundManager) {
            if (screenId === 'mainMenu' && window.soundManager.musicEnabled) {
                window.soundManager.startBackgroundMusic();
            } else if (screenId !== 'mainMenu') {
                window.soundManager.stopBackgroundMusic();
            }
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
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (this.lastPlayDate !== today) {
            if (this.lastPlayDate === yesterday.toDateString()) {
                // Played yesterday, continue streak
                const oldStreak = this.streak;
                this.streak++;
                
                // 🔥 Streak milestone fanfarı çal
                this.checkStreakMilestone(oldStreak, this.streak);
                
            } else if (this.lastPlayDate !== '') {
                // Missed a day, reset streak
                this.streak = 1;
            } else {
                // First time playing
                this.streak = 0;
            }
            
            // Reset daily Hasene
            this.dailyHasene = 0;
            localStorage.setItem('dailyHasene', '0');
        }
        
        localStorage.setItem('lastPlayDate', today);
        localStorage.setItem('streak', this.streak.toString());
    }
    
    updateUI() {
        // Update main menu stats
        document.getElementById('streakCount').textContent = this.streak;
        document.getElementById('haseneCount').textContent = this.totalHasene;
        document.getElementById('levelCount').textContent = this.level;
        document.getElementById('dailyHasene').textContent = this.dailyHasene;
        
        // Gerçek öğrenilen kelimeleri hesapla ve güncelle
        this.wordsLearned = this.calculateMasteredWords();
        
        // Update daily progress (günlük hedef 1000 hasene)
        const dailyProgress = Math.min((this.dailyHasene / 1000) * 100, 100);
        document.getElementById('dailyProgress').style.width = `${dailyProgress}%`;
        
        // Update XP Progress
        const xpInCurrentLevel = this.totalHasene % 500;
        const xpProgress = (xpInCurrentLevel / 500) * 100;
        document.getElementById('xpProgress').style.width = `${xpProgress}%`;
        document.getElementById('currentXP').textContent = xpInCurrentLevel;
        document.getElementById('nextLevelXP').textContent = 500;
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('nextLevel').textContent = this.level + 1;
        

    }
    
    startGame(mode = 'translation') {
        // Veri yüklenip yüklenmediğini kontrol et
        if (!this.wordData || this.wordData.length === 0) {
            console.error('Kelime verisi yüklenmemiş!');
            alert('Kelime verisi henüz yüklenmedi. Lütfen bekleyiniz...');
            return;
        }
        
        console.log(`${mode} oyunu başlatılıyor... Toplam kelime: ${this.wordData.length}`);
        
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
        
        console.log(`Sorular üretiliyor... Toplam kelime sayısı: ${this.wordData.length}`);
        
        // Load learning statistics
        const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
        
        // Smart word selection algorithm
        const selectedWords = this.selectSmartWords(questionCount, wordStats);
        
        console.log(`Seçilen kelime sayısı: ${selectedWords.length}`);
        
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
        
        console.log(`Generated ${this.questions.length} questions for ${this.gameMode} mode`);
    }
    
    selectSmartWords(count, wordStats) {
        // Zorluk seviyesine göre kelime havuzunu filtrele
        const difficultyWords = this.getDifficultyWords(this.wordData, this.difficulty);
        
        console.log(`Zorluk seviyesi: ${this.difficulty}`);
        console.log(`Toplam kelime: ${this.wordData.length}, Filtrelenmiş: ${difficultyWords.length}`);
        
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
            
            // Recently wrong words get higher priority (3x)
            if (stats.wrong > stats.correct) {
                weight *= 3;
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
        
        for (let word of shuffled) {
            if (!usedWords.has(word.kelime) && selected.length < count) {
                selected.push(word);
                usedWords.add(word.kelime);
            }
        }
        
        // Fill remaining slots with random words if needed
        while (selected.length < count && difficultyWords.length > 0) {
            const randomWord = difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
            if (!usedWords.has(randomWord.kelime)) {
                selected.push(randomWord);
                usedWords.add(randomWord.kelime);
            }
        }
        
        console.log(`Seçilen kelimeler: ${selected.length}/${count}`);
        
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
        
        console.log(`Word stats updated for ${word.kelime}: ${stats.correct}✓ ${stats.wrong}✗ (difficulty: ${stats.difficulty.toFixed(1)})`);
    }
    
    getWrongAnswers(correctAnswer, count) {
        const wrongAnswers = [];
        // Use difficulty-filtered words for wrong answers too
        const difficultyWords = this.getDifficultyWords(this.wordData, this.difficulty);
        const allAnswers = difficultyWords.map(word => word.anlam).filter(answer => answer !== correctAnswer);
        
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
        
        console.log(`📚 Öğrenilen kelimeler: ${masteredCount} (en az 10 kez doğru + %80 başarı)`);
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
            'writing': 'Türkçe anlamı verilen kelimeyi yaz',
            'speed': 'Arapça kelimeyi çevir'
        };
        document.getElementById('questionType').textContent = questionTypeTexts[this.gameMode];
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            // Sonsuz modda yeni sorular ekle
            if (this.isEndlessMode && this.hearts > 0) {
                this.addMoreEndlessQuestions();
                // Yeni sorular eklendikten sonra devam et
            } else {
                this.completeGame();
                return;
            }
        }
        
        const question = this.questions[this.currentQuestion];
        
        // Update progress
        if (this.isEndlessMode) {
            // Sonsuz modda soru sayısı ve kalp göster
            document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
            document.getElementById('totalQuestions').textContent = '∞';
            // Progress bar kalp bazlı olsun
            const heartProgress = (this.hearts / 5) * 100;
            document.getElementById('gameProgress').style.width = `${heartProgress}%`;
        } else {
            document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
            const progress = ((this.currentQuestion) / this.questions.length) * 100;
            document.getElementById('gameProgress').style.width = `${progress}%`;
        }
        
        // Show question based on mode
        if (this.gameMode === 'translation' || this.gameMode === 'listening' || this.gameMode === 'speed') {
            this.showMultipleChoiceQuestion(question);
        } else if (this.gameMode === 'writing') {
            this.showWritingQuestion(question);
        }
        
        // Hide feedback and continue button
        this.hideFeedback();
        document.getElementById('continueBtn').style.display = 'none';
        
        // Hız modu için timer başlat
        if (this.isSpeedMode) {
            startQuestionTimer();
        }
    }
    
    showMultipleChoiceQuestion(question) {
        // Show question text
        if (this.gameMode === 'translation' || this.gameMode === 'speed') {
            document.getElementById('questionText').textContent = question.word.kelime;
            document.getElementById('audioBtn').style.display = 'inline-block';
        } else if (this.gameMode === 'listening') {
            document.getElementById('questionText').textContent = '🎧 Sesi dinleyin';
            document.getElementById('audioBtn').style.display = 'inline-block';
            // Auto-play audio for listening mode
            setTimeout(() => this.playAudio(), 500);
        }
        
        // Show word ID for debugging
        document.getElementById('wordId').textContent = `ID: ${question.word.id}`;
        
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
        
        // Show word ID for debugging
        document.getElementById('wordId').textContent = `ID: ${question.word.id}`;
        
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
            clearQuestionTimer();
        }
        
        const question = this.questions[this.currentQuestion];
        
        // Update word statistics for smart repetition
        this.updateWordStats(question.word, isCorrect);
        
        // Update statistics
        this.totalAnswers++;
        localStorage.setItem('totalAnswers', this.totalAnswers.toString());
        
        if (isCorrect) {
            this.score++;
            this.correctAnswers++;
            // Calculate hasene based on Arabic word length
            const arabicWord = question.word.kelime;
            const letterCount = this.countArabicLetters(arabicWord);
            const earnedHasene = letterCount * 10;
            this.gameHasene += earnedHasene;
            console.log(`Word: ${arabicWord}, Letters: ${letterCount}, Hasene: ${earnedHasene}`);
            
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
            // Sınırsız kalp aktifse kalp kaybetme
            if (!unlimitedHeartsActive) {
                this.hearts--;
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
            console.log('Showing continue button...');
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
                continueBtn.style.display = 'inline-block';
                console.log('Continue button displayed');
                
                // Hız modunda otomatik devam et (2 saniye sonra)
                if (this.isSpeedMode) {
                    setTimeout(() => {
                        if (continueBtn.style.display !== 'none') {
                            console.log('🏃‍♂️ Hız modu: Otomatik devam...');
                            
                            // Son soru kontrolü
                            if (this.currentQuestion + 1 >= this.questions.length) {
                                if (this.isEndlessMode && this.hearts > 0) {
                                    console.log('🔄 Sonsuz mod son soru: Yeni sorular eklenecek...');
                                    this.nextQuestion();
                                } else {
                                    console.log('🏁 Hız modu son soru: Oyun bitiyor...');
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
        
        // Kalp kontrolü - feedback gösterildikten sonra kontrol et
        if (!unlimitedHeartsActive && this.hearts <= 0) {
            setTimeout(() => {
                console.log('💔 Kalplar bitti, kalp yenileme ekranına yönlendiriliyor...');
                showHeartsDepleted();
            }, 3000); // Feedback ve otomatik devam için yeterli süre
        }
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
        
        // Soru formatına göre meaning ayarla
        if (question.word) {
            // Normal format
            meaning.textContent = `${question.word.kelime} = ${question.word.anlam}`;
            this.currentAudio = question.word.ses_dosyasi;
        } else if (question.arabic && question.correct) {
            // Sonsuz mod format
            meaning.textContent = `${question.arabic} = ${question.correct}`;
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
    
    nextQuestion() {
        console.log('nextQuestion called, current question:', this.currentQuestion);
        
        // Hide continue button
        document.getElementById('continueBtn').style.display = 'none';
        
        this.hideFeedback();
        this.currentQuestion++;
        
        // Check if game is complete
        if (this.currentQuestion >= this.questions.length) {
            if (this.isEndlessMode && this.hearts > 0) {
                console.log('🔄 Sonsuz mod: Yeni sorular ekleniyor...');
                this.addMoreEndlessQuestions();
                // Continue with the new questions
            } else {
                console.log('Game completed! Total questions:', this.questions.length);
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
        const usedWords = this.questions.map(q => q.word ? q.word.id : q.arabic);
        
        // 5 yeni soru ekle (daha manageable)
        for (let i = 0; i < 5; i++) {
            let randomWord;
            let attempts = 0;
            
            // Daha önce kullanılmayan kelime bul
            do {
                randomWord = this.words[Math.floor(Math.random() * this.words.length)];
                attempts++;
                if (attempts > 100) break; // Sonsuz döngüyü önle
            } while (usedWords.includes(randomWord.id || randomWord.arabic) && attempts < 100);
            
            if (randomWord) {
                // Game mode'a göre soru tipini belirle
                if (this.gameMode === 'writing') {
                    moreQuestions.push({
                        word: randomWord,
                        type: 'writing'
                    });
                } else {
                    // Multiple choice için yanlış seçenekler oluştur
                    const wrongOptions = [];
                    while (wrongOptions.length < 3) {
                        const randomOption = this.words[Math.floor(Math.random() * this.words.length)];
                        if (randomOption.id !== randomWord.id && 
                            !wrongOptions.includes(randomOption.kelime)) {
                            wrongOptions.push(randomOption.kelime);
                        }
                    }
                    
                    // Seçenekleri karıştır
                    const options = [randomWord.kelime, ...wrongOptions];
                    for (let j = options.length - 1; j > 0; j--) {
                        const k = Math.floor(Math.random() * (j + 1));
                        [options[j], options[k]] = [options[k], options[j]];
                    }
                    
                    moreQuestions.push({
                        word: randomWord,
                        options: options,
                        type: 'multiple-choice'
                    });
                }
                
                usedWords.push(randomWord.id || randomWord.arabic);
            }
        }
        
        // Yeni soruları ekle
        this.questions.push(...moreQuestions);
        this.endlessQuestionCount += moreQuestions.length;
        
        console.log(`🔄 Sonsuz mod: ${moreQuestions.length} yeni soru eklendi. Toplam: ${this.questions.length}`);
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
        
        console.log(`💖 Kalpler güncellendi: ${this.hearts}/5`);
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
        // Kalp kontrolü - eğer kalp bitmişse kalp yenileme ekranına git
        if (this.hearts <= 0 && !unlimitedHeartsActive) {
            showHeartsDepleted();
            return;
        }
        
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
        const modeKey = this.gameMode + 'Games'; // translationGames, listeningGames, writingGames
        const currentCount = parseInt(localStorage.getItem(modeKey)) || 0;
        localStorage.setItem(modeKey, (currentCount + 1).toString());
        
        // Check for level up
        const oldLevel = this.level;
        this.level = Math.floor(this.totalHasene / 1000) + 1;
        
        // Update streak if daily goal is met (1000 hasene)
        if (this.dailyHasene >= 1000 && this.streak === 0) {
            this.streak = 1;
        }
        
        // Save to localStorage
        localStorage.setItem('totalHasene', this.totalHasene.toString());
        localStorage.setItem('dailyHasene', this.dailyHasene.toString());
        localStorage.setItem('streak', this.streak.toString());
        
        // Store daily hasene in calendar data
        const today = new Date().toDateString();
        this.storeDailyHasene(today, this.gameHasene);
        
        // Update streak data if daily goal met
        if (this.dailyHasene >= 1000) {
            this.updateStreakData(today, true);
        }
        
        // Update game statistics and check achievements
        this.updateGameStats();
        
        // Show results screen
        this.showGameComplete(totalQuestions, accuracy, oldLevel);
    }
    
    showGameComplete(totalQuestions, accuracy, oldLevel) {
        // Play success fanfare
        if (window.soundManager) {
            window.soundManager.playSuccess();
        }
        
        // Update results display
        document.getElementById('earnedHasene').textContent = this.gameHasene;
        document.getElementById('correctAnswers').textContent = `${this.score}/${totalQuestions}`;
        document.getElementById('gameAccuracy').textContent = `${accuracy}%`;
        document.getElementById('finalStreak').textContent = `${this.streak} gün`;
        
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
            console.log('🎵 Perfect Score Fanfare played!');
            
        } else if (isHighScore) {
            // 🎉 Yüksek skor - seviye başarısı
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playVictory();
            }, 300);
            console.log('🎵 Victory Fanfare played!');
            
        } else if (accuracy >= 70) {
            // 🎵 İyi performans - normal başarı sesi
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playSuccess();
            }, 300);
            console.log('🎵 Success Fanfare played!');
            
        } else {
            // 📈 Teşvik edici - gelişim için
            console.log('🎵 No fanfare - keep practicing!');
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
                console.log(`🔥 Streak Milestone! ${passedMilestone} gün streak fanfarı çaldı!`);
            }, 500);
        }
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
        
        // Update stats object
        this.stats.totalHasene = this.totalHasene;
        this.stats.currentStreak = this.streak;
        this.stats.wordsLearned = this.calculateMasteredWords(); // Dinamik hesaplama
        this.stats.totalAnswers = this.totalAnswers;
        this.stats.correctAnswers = this.correctAnswers;
        
        // Check for new achievements
        this.checkNewAchievements();
        
        // Update notification badges
        this.updateNotificationBadges();
    }
    
    returnToMenu() {
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
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        
        // Update month header
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentCalendarMonth]} ${this.currentCalendarYear}`;
        
        const grid = document.getElementById('calendarGrid');
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
        // Store daily hasene data
        const haseneData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
        haseneData[dateString] = (haseneData[dateString] || 0) + hasene;
        localStorage.setItem('dailyHaseneData', JSON.stringify(haseneData));
    }
    
    isStreakDay(dateString) {
        // Check if this day is part of current streak
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
        const progressBar = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');
        const loadingPercentage = document.getElementById('loadingPercentage');
        
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
                loadingText.textContent = step.text;
                
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
                    
                    progressBar.style.width = progress + '%';
                    loadingPercentage.textContent = Math.round(progress) + '%';
                }, 30);
            }
        };
        
        setTimeout(() => {
            animateStep();
        }, 12000);
    }
    
    completeLoadingAnimation() {
        const loadingText = document.getElementById('loadingText');
        const loadingPercentage = document.getElementById('loadingPercentage');
        const progressBar = document.getElementById('loadingProgress');
        
        // Complete the progress
        progressBar.style.width = '100%';
        loadingPercentage.textContent = '100%';
        loadingText.textContent = 'Hazır! Bismillah...';
        
        // Wait a bit then show main menu
        setTimeout(() => {
            this.showScreen('mainMenu');
            // Setup event listeners after DOM is ready
            setTimeout(() => this.setupAchievementListeners(), 200);
        }, 1500);
    }

    initializeDifficultyUI() {
        // Kayıtlı zorluk seviyesini yükle
        const savedDifficulty = localStorage.getItem('difficulty') || 'medium';
        this.difficulty = savedDifficulty;
        
        // UI'da doğru butonu aktif yap
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(savedDifficulty + 'Btn');
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
            
            const item = document.createElement('div');
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            item.innerHTML = `
                <i class="${achievement.icon} achievement-icon"></i>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
                ${!isUnlocked && progress ? `<div class="achievement-progress">${progress}</div>` : ''}
            `;
            
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
        }
        
        return null;
    }

    checkNewAchievements() {
        console.log('🏆 Rozetler kontrol ediliyor...');
        console.log('Stats:', this.stats);
        console.log('Açılmış rozetler:', this.unlockedAchievements);
        
        Object.values(this.achievements).forEach(achievement => {
            const condition = achievement.condition();
            console.log(`Rozet ${achievement.id}: Koşul ${condition ? '✅' : '❌'}`);
            
            if (!this.unlockedAchievements.includes(achievement.id) && condition) {
                console.log(`🎉 Yeni rozet açıldı: ${achievement.title}`);
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.unlockedAchievements.push(achievement.id);
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
        
        // Show unlock animation
        this.showAchievementUnlock(achievement);
        
        // Update notification badge
        this.updateNotificationBadges();
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
        const weeklyData = this.getWeeklyData();
        const chartContainer = document.getElementById('weeklyChart');
        
        // Haftalık chart barları oluştur
        chartContainer.innerHTML = '';
        
        const maxValue = Math.max(...weeklyData, 1);
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        
        weeklyData.forEach((value, index) => {
            const height = Math.max((value / maxValue) * 100, 10);
            
            const chartBar = document.createElement('div');
            chartBar.className = 'chart-bar';
            chartBar.style.height = `${height}px`;
            
            chartBar.innerHTML = `
                <div class="chart-value">${value}</div>
                <div class="chart-label">${days[index]}</div>
            `;
            
            chartContainer.appendChild(chartBar);
        });
    }

    getWeeklyData() {
        // Son 7 gün için gerçek hasene verileri
        const weeklyData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            const dailyHasene = this.getDailyHasene(dateString) || 0;
            weeklyData.push(dailyHasene);
        }
        
        return weeklyData;
    }

    updateGameModeStats() {
        // Gerçek oyun modları istatistikleri
        const translationGames = parseInt(localStorage.getItem('translationGames')) || 0;
        const listeningGames = parseInt(localStorage.getItem('listeningGames')) || 0;
        const writingGames = parseInt(localStorage.getItem('writingGames')) || 0;
        
        const totalGames = translationGames + listeningGames + writingGames || 1; // 0'a bölme hatası önleme
        
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
                name: 'Yazma', 
                class: 'writing', 
                percentage: Math.round((writingGames / totalGames) * 100),
                count: writingGames
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

    // Zorluk seviyesi yönetimi
    setDifficulty(level) {
        this.difficulty = level;
        localStorage.setItem('difficulty', level);
        
        // UI güncelle
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Btn').classList.add('active');
        
        console.log(`Zorluk seviyesi ${level} olarak ayarlandı`);
    }

    getDifficultyWords(wordData, difficulty) {
        let selectedWords = [];

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

        console.log(`${difficulty} seviyesi için ${selectedWords.length} kelime bulundu`);
        return selectedWords;
    }
}

// Global game instance
let game;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game = new ArabicLearningGame();
});

// Global functions for HTML onclick events
function startGame(mode = 'translation') {
    if (game && game.wordData && game.wordData.length > 0) {
        console.log(`🎮 ${mode} oyunu başlatılıyor...`);
        game.startGame(mode);
    } else {
        console.log('⏳ Oyun henüz hazır değil, lütfen bekleyin...');
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
    if (game) {
        game.setDifficulty(level);
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
    console.log('nextQuestion function called');
    if (game) {
        console.log('Calling game.nextQuestion()');
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
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
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
let heartRefillTimer = null;
let unlimitedHeartsActive = false;

function showHeartsDepleted() {
    console.log('❤️‍🩹 Kalplar bitti, kalp yenileme ekranı gösteriliyor...');
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('heartsDepleted').style.display = 'flex';
    
    // Heart timer'ını başlat
    startHeartRefillTimer();
}

function watchAdForHearts() {
    console.log('📺 Reklam izleniyor...');
    
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
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Game class'ına kalp kontrolü ekle
function checkHeartsDepleted() {
    if (!unlimitedHeartsActive && game && game.hearts <= 0) {
        showHeartsDepleted();
        return true;
    }
    return false;
}

// Initialize keyboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initArabicKeyboard();
});

// Hız Modu Timer Fonksiyonları (Game Class'ın dışında)
function startQuestionTimer() {
    if (game && game.isSpeedMode) {
        game.timeLeft = 15; // 15 saniye
        updateTimerDisplay();
        
        game.questionTimer = setInterval(() => {
            game.timeLeft--;
            updateTimerDisplay();
            
            if (game.timeLeft <= 0) {
                timeUp();
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    if (game && game.isSpeedMode) {
        const questionType = document.getElementById('questionType');
        const baseText = 'Arapça kelimeyi çevir';
        questionType.innerHTML = `${baseText} <span style="color: #ff6b6b; font-weight: bold;">⏱️ ${game.timeLeft}s</span>`;
        
        // Son 5 saniyede kırmızı yap
        if (game.timeLeft <= 5) {
            questionType.style.color = '#ff6b6b';
        } else {
            questionType.style.color = '#333';
        }
    }
}

function timeUp() {
    if (game && game.questionTimer) {
        clearInterval(game.questionTimer);
        game.questionTimer = null;
        
        // Yanlış cevap olarak işle
        console.log('⏰ Süre doldu! Hız modunda otomatik yanlış cevap...');
        
        // Tüm seçenekleri devre dışı bırak
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.add('disabled');
        });
        
        // Yanlış cevap işle
        game.processAnswer(false, null);
    }
}

function clearQuestionTimer() {
    if (game && game.questionTimer) {
        clearInterval(game.questionTimer);
        game.questionTimer = null;
        
        // Question type'ı normale döndür
        const questionType = document.getElementById('questionType');
        questionType.style.color = '#333';
    }
}

// Add sound effects to all buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click sound to all buttons
    document.addEventListener('click', function(e) {
        try {
            const target = e.target;
            if (!target || !target.classList) return;
            
            const isButton = target.tagName === 'BUTTON' || 
                            target.classList.contains('btn') ||
                            target.classList.contains('game-mode-btn') ||
                            target.classList.contains('difficulty-btn') ||
                            target.classList.contains('option-btn') ||
                            target.classList.contains('action-btn') ||
                            target.classList.contains('key-btn');
            
            if (isButton && window.soundManager) {
                window.soundManager.playClick();
            }
        } catch (error) {
            console.warn('Click sound error:', error);
        }
    });
    
    // Add hover sound to specific interactive elements
    document.addEventListener('mouseenter', function(e) {
        try {
            const target = e.target;
            if (!target || !target.classList) return;
            
            const isHoverable = target.classList.contains('game-mode-btn') ||
                               target.classList.contains('difficulty-btn') ||
                               target.classList.contains('action-btn');
            
            if (isHoverable && window.soundManager) {
                window.soundManager.playHover();
            }
        } catch (error) {
            console.warn('Hover sound error:', error);
        }
    }, true);
    
    // Initialize sound context on first user interaction
    document.addEventListener('click', function initSound() {
        if (window.soundManager && window.soundManager.audioGenerator) {
            window.soundManager.audioGenerator.unlock();
        }
        document.removeEventListener('click', initSound);
    }, { once: true });
    
    // Update sound control UI on load
    updateSoundUI();
});

// Sound Control Functions
function toggleSound() {
    if (window.soundManager) {
        const enabled = window.soundManager.toggleSound();
        updateSoundUI();
    }
}

function toggleMusic() {
    if (window.soundManager) {
        const enabled = window.soundManager.toggleMusic();
        console.log('Müzik toggle edildi, durum:', enabled);
        updateSoundUI();
        
        if (enabled) {
            // Müzik açıldı - main menu'daysa başlat
            if (game && game.currentScreen === 'mainMenu') {
                console.log('Müzik başlatılıyor...');
                window.soundManager.startBackgroundMusic();
            }
        } else {
            // Müzik kapatıldı - her durumda durdur
            console.log('Müzik durduruluyor...');
            window.soundManager.stopBackgroundMusic();
        }
    }
}

function updateSoundUI() {
    if (window.soundManager) {
        const soundBtn = document.getElementById('soundToggle');
        const musicBtn = document.getElementById('musicToggle');
        const soundIcon = document.getElementById('soundIcon');
        const musicIcon = document.getElementById('musicIcon');
        
        // Sound button
        if (soundBtn && soundIcon) {
            if (window.soundManager.soundEnabled) {
                soundBtn.classList.remove('disabled');
                soundIcon.className = 'fas fa-volume-up';
            } else {
                soundBtn.classList.add('disabled');
                soundIcon.className = 'fas fa-volume-mute';
            }
        }
        
        // Music button
        if (musicBtn && musicIcon) {
            if (window.soundManager.musicEnabled) {
                musicBtn.classList.remove('disabled');
                musicIcon.className = 'fas fa-music';
            } else {
                musicBtn.classList.add('disabled');
                musicIcon.className = 'fas fa-music';
            }
        }
    }
}

