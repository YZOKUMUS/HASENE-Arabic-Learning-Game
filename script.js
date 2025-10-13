// Duolingo-style Game Logic - Updated
class ArabicLearningGame {
    constructor() {
        this.wordData = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.hearts = 3;
        this.gameXP = 0;
        this.totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
        this.streak = parseInt(localStorage.getItem('streak')) || 0;
        this.level = Math.floor(this.totalHasene / 1000) + 1;
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
                this.streak++;
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
        const questionCount = 10;
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
            if (this.gameMode === 'translation' || this.gameMode === 'listening') {
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
            'writing': 'Türkçe anlamı verilen kelimeyi yaz'
        };
        document.getElementById('questionType').textContent = questionTypeTexts[this.gameMode];
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
        if (this.gameMode === 'translation' || this.gameMode === 'listening') {
            this.showMultipleChoiceQuestion(question);
        } else if (this.gameMode === 'writing') {
            this.showWritingQuestion(question);
        }
        
        // Hide feedback and continue button
        this.hideFeedback();
        document.getElementById('continueBtn').style.display = 'none';
    }
    
    showMultipleChoiceQuestion(question) {
        // Show question text
        if (this.gameMode === 'translation') {
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
            
            // Show correct feedback
            this.showFeedback(true, question);
            
            // Play correct sound
            this.playSound('correct');
            
            if (selectedButton) {
                selectedButton.classList.add('correct');
            }
        } else {
            this.hearts--;
            
            // Show incorrect feedback
            this.showFeedback(false, question);
            
            // Play incorrect sound
            this.playSound('incorrect');
            
            // Update hearts display
            if (this.hearts >= 0) {
                const heartIndex = 5 - this.hearts;
                const heart = document.getElementById(`heart${heartIndex}`);
                if (heart) {
                    heart.classList.add('lost');
                }
            }
            
            if (selectedButton) {
                selectedButton.classList.add('incorrect');
                // Highlight correct answer
                const correctIndex = question.correctIndex;
                const options = document.querySelectorAll('.option-btn');
                if (options[correctIndex]) {
                    options[correctIndex].classList.add('correct');
                }
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
            } else {
                console.error('Continue button not found!');
            }
        }, 800);
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
        
        meaning.textContent = `${question.word.kelime} = ${question.word.anlam}`;
        
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
        
        // Store audio for feedback
        this.currentAudio = question.word.ses_dosyasi;
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
        this.totalAnswers++;
        
        // Show correct answer
        this.showFeedback(false, question);
        
        // Show continue button
        setTimeout(() => {
            document.getElementById('continueBtn').style.display = 'inline-block';
        }, 800);
        
        localStorage.setItem('totalAnswers', this.totalAnswers.toString());
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
        
        alert('Oyun bitti! Tekrar deneyin.');
        this.returnToMenu();
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

// Initialize keyboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initArabicKeyboard();
});

