/**
 * 🔧 DEBUG MANAGER - Test ve Debug İçin Araç Seti
 * Bu dosya sadece geliştirme amaçlı kullanılır
 */

class DebugManager {
    constructor() {
        this.config = null;
        this.isDebugMode = false;
        this.loadConfig();
        this.setupKeyboardShortcuts();
        
        // Global erişim için
        window.debugManager = this;
        
        console.log('🔧 Debug Manager loaded. Press Ctrl+D to toggle debug panel');
    }

    async loadConfig() {
        try {
            const response = await fetch('debug-config.json');
            this.config = await response.json();
            this.isDebugMode = this.config.debugMode;
            
            if (this.isDebugMode) {
                console.log('🟢 Debug Mode ACTIVE');
                this.enableDebugFeatures();
            }
        } catch (error) {
            console.warn('⚠️ Debug config not found, using defaults');
            this.config = { debugMode: false };
        }
    }

    enableDebugFeatures() {
        // Console logging
        if (this.config.logging?.enableConsoleLog) {
            this.enableConsoleLogging();
        }
        
        // Auto-show debug panel
        if (this.config.ui?.showDebugPanel) {
            this.showPanel();
        }
        
        // Quick game mode
        if (this.config.quickGame?.enabled) {
            this.enableQuickGame();
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+D: Toggle debug panel
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.togglePanel();
            }
            
            // Ctrl+Shift+R: Reset all data
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.clearAllData();
            }
            
            // Ctrl+E: Export data
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.exportData();
            }
        });
    }

    showPanel() {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            panel.style.display = 'block';
            this.updatePanelData();
        }
    }

    hidePanel() {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    togglePanel() {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            if (panel.style.display === 'none') {
                this.showPanel();
            } else {
                this.hidePanel();
            }
        }
    }

    updatePanelData() {
        const container = document.getElementById('debugLocalStorage');
        if (!container) return;
        
        // Basic stats
        const data = {
            streak: localStorage.getItem('streak') || '0',
            lastPlayDate: localStorage.getItem('lastPlayDate') || 'none',
            totalCorrect: localStorage.getItem('totalCorrect') || '0',
            totalGames: localStorage.getItem('totalGames') || '0',
            bestStreak: localStorage.getItem('bestStreak') || '0',
            dailyHasene: localStorage.getItem('dailyHasene') || '0'
        };
        
        // Word statistics
        const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
        data.totalWordsInStats = Object.keys(wordStats).length;
        
        // Mastered words sayısını hesapla
        let masteredCount = 0;
        Object.keys(wordStats).forEach(word => {
            const stats = wordStats[word];
            if (stats.correct >= 10) {
                const accuracy = stats.correct / (stats.correct + stats.wrong);
                if (accuracy >= 0.8) {
                    masteredCount++;
                }
            }
        });
        data.masteredWords = masteredCount;
        
        let html = '';
        for (const [key, value] of Object.entries(data)) {
            html += `<div><strong>${key}:</strong> ${value}</div>`;
        }
        
        // Son mastered kelimeleri göster
        if (masteredCount > 0) {
            const masteredWords = [];
            Object.keys(wordStats).forEach(word => {
                const stats = wordStats[word];
                if (stats.correct >= 10) {
                    const accuracy = stats.correct / (stats.correct + stats.wrong);
                    if (accuracy >= 0.8) {
                        masteredWords.push(`${word} (${stats.correct}/${stats.wrong})`);
                    }
                }
            });
            const lastMastered = masteredWords.slice(-3).join(', ');
            html += `<div style="margin-top:8px;"><strong>Son mastereds:</strong><br><small>${lastMastered}</small></div>`;
        }
        
        container.innerHTML = html;
    }

    // =================== TEST FUNCTIONS ===================
    
    resetStreak() {
        localStorage.setItem('streak', '0');
        localStorage.setItem('lastPlayDate', '');
        localStorage.setItem('bestStreak', '0');
        console.log('🔄 Streak reset to 0');
        this.updatePanelData();
        
        // Update UI if game is loaded
        if (window.game) {
            window.game.streak = 0;
            window.game.updateUI();
        }
    }

    setStreak(days) {
        localStorage.setItem('streak', days.toString());
        localStorage.setItem('lastPlayDate', new Date().toDateString());
        console.log(`🔥 Streak set to ${days} days`);
        this.updatePanelData();
        
        if (window.game) {
            window.game.streak = parseInt(days);
            window.game.updateUI();
        }
    }

    addFakeStats() {
        const current = parseInt(localStorage.getItem('totalCorrect') || '0');
        const games = parseInt(localStorage.getItem('totalGames') || '0');
        
        localStorage.setItem('totalCorrect', (current + 100).toString());
        localStorage.setItem('totalGames', (games + 10).toString());
        localStorage.setItem('dailyHasene', '1500');
        
        console.log('📊 Added fake stats: +100 correct, +10 games');
        this.updatePanelData();
        
        if (window.game) {
            window.game.updateUI();
        }
    }

    addFakeLearnedWords() {
        // Fake öğrenilen kelimeler oluştur
        const fakeWords = [
            'مُسْلِمٌ', 'إِيمَانٌ', 'صَلَاةٌ', 'زَكَاةٌ', 'حَجٌّ', 'صَوْمٌ', 'قُرْآنٌ', 'حَدِيثٌ',
            'نَبِيٌّ', 'رَسُولٌ', 'اللَّهُ', 'مُحَمَّدٌ', 'عِيسَى', 'مُوسَى', 'إِبْرَاهِيمُ',
            'جَنَّةٌ', 'نَارٌ', 'يَوْمُ الدِّينِ', 'مَلَكٌ', 'شَيْطَانٌ', 'تَوْبَةٌ', 'رَحْمَةٌ',
            'عَدْلٌ', 'حِكْمَةٌ', 'صَبْرٌ', 'شُكْرٌ', 'حُبٌّ', 'خَوْفٌ', 'رَجَاءٌ', 'يَقِينٌ'
        ];
        
        // Mevcut wordStats'ı al
        let wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
        
        // Her fake kelime için mastered stats oluştur
        fakeWords.forEach((word, index) => {
            // Rastgele mastered kelimeler oluştur (kriterleri karşılayacak şekilde)
            const correct = 10 + Math.floor(Math.random() * 20); // 10-30 arası doğru
            const wrong = Math.floor(Math.random() * 3); // 0-2 arası yanlış (yüksek accuracy için)
            
            wordStats[word] = {
                correct: correct,
                wrong: wrong,
                lastSeen: new Date().toISOString()
            };
        });
        
        // localStorage'a kaydet
        localStorage.setItem('wordStats', JSON.stringify(wordStats));
        
        // Mastered kelimeleri hesapla
        let masteredCount = 0;
        Object.keys(wordStats).forEach(word => {
            const stats = wordStats[word];
            if (stats.correct >= 10) {
                const accuracy = stats.correct / (stats.correct + stats.wrong);
                if (accuracy >= 0.8) {
                    masteredCount++;
                }
            }
        });
        
        console.log(`📚 Added ${fakeWords.length} fake word stats. Mastered words: ${masteredCount}`);
        this.updatePanelData();
        
        if (window.game) {
            window.game.wordsLearned = window.game.calculateMasteredWords();
            window.game.updateUI();
        }
        
        return masteredCount;
    }

    clearAllData() {
        if (confirm('🗑️ Clear ALL localStorage data? This cannot be undone!')) {
            localStorage.clear();
            console.log('🧹 All localStorage data cleared');
            this.updatePanelData();
            
            if (window.game) {
                window.game.initializeFromStorage();
                window.game.updateUI();
            }
            
            alert('✅ All data cleared! Refresh the page.');
        }
    }

    exportData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hasene-data-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('💾 Data exported');
    }

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, value);
            }
            console.log('📥 Data imported successfully');
            this.updatePanelData();
            
            if (window.game) {
                window.game.initializeFromStorage();
                window.game.updateUI();
            }
        } catch (error) {
            console.error('❌ Import failed:', error);
            alert('Failed to import data. Check console for details.');
        }
    }

    // Command system
    executeCommand(command) {
        const input = document.getElementById('debugCommand');
        if (input) input.value = '';
        
        try {
            if (command.startsWith('streak ')) {
                const days = parseInt(command.split(' ')[1]);
                this.setStreak(days);
            } else if (command === 'clear') {
                this.clearAllData();
            } else if (command === 'export') {
                this.exportData();
            } else if (command === 'stats') {
                this.addFakeStats();
            } else if (command === 'refresh') {
                this.updatePanelData();
            } else if (command.startsWith('set ')) {
                const [_, key, value] = command.split(' ');
                localStorage.setItem(key, value);
                console.log(`🔧 Set ${key} = ${value}`);
                this.updatePanelData();
            } else {
                console.log(`❓ Unknown command: ${command}`);
                console.log('Available commands: streak <num>, clear, export, stats, refresh, set <key> <value>');
            }
        } catch (error) {
            console.error('❌ Command failed:', error);
        }
    }

    // Quick game mode
    enableQuickGame() {
        console.log('⚡ Quick game mode enabled');
        // Bu özelliği oyun yüklendiğinde aktif hale getirmek için bir flag set edelim
        window.debugQuickGame = true;
    }

    // Console logging
    enableConsoleLogging() {
        window.debugConsole = true;
        console.log('📝 Enhanced console logging enabled');
    }

    // =================== ADVANCED TESTS ===================
    
    simulateStreakTest() {
        console.log('🧪 Starting streak simulation test...');
        
        // Test 1: İlk kurulum
        localStorage.clear();
        console.log('Test 1: Fresh install - streak should be 0');
        
        // Test 2: İlk oyun
        localStorage.setItem('lastPlayDate', new Date().toDateString());
        localStorage.setItem('streak', '1');
        console.log('Test 2: First game - streak should be 1');
        
        // Test 3: Ardışık gün
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        localStorage.setItem('lastPlayDate', yesterday.toDateString());
        console.log('Test 3: Consecutive day - streak should increase');
        
        // Test 4: Gün kaçırma
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        localStorage.setItem('lastPlayDate', threeDaysAgo.toDateString());
        console.log('Test 4: Missed days - streak should reset');
        
        this.updatePanelData();
    }

    testWordLearning() {
        console.log('📚 Testing word learning system...');
        
        // Simulate learned words
        const learnedWords = ['kitab', 'masjid', 'salah', 'quran', 'islam'];
        localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
        
        console.log('✅ Added test learned words:', learnedWords);
        this.updatePanelData();
    }
}

// Initialize debug manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DebugManager();
});

// Global debug functions for console access
window.debug = {
    streak: (days) => window.debugManager.setStreak(days),
    clear: () => window.debugManager.clearAllData(),
    export: () => window.debugManager.exportData(),
    stats: () => window.debugManager.addFakeStats(),
    panel: () => window.debugManager.togglePanel(),
    test: () => window.debugManager.simulateStreakTest()
};

console.log('🎮 Debug shortcuts loaded! Type debug.help() for commands');
console.log('🔧 Available: debug.streak(5), debug.clear(), debug.export(), debug.stats()');