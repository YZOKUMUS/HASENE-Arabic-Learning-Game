/**
 * 📊 KELİME ÖĞRENME İSTATİSTİK ANALİZCİSİ
 * LocalStorage'dan kelime verilerini analiz eder
 * Browser console'da çalıştırılabilir
 */

class WordLearningAnalyzer {
    constructor() {
        this.wordStats = this.loadWordStats();
        this.totalWords = Object.keys(this.wordStats).length;
    }
    
    loadWordStats() {
        try {
            return JSON.parse(localStorage.getItem('wordStats')) || {};
        } catch (error) {
            console.log('📊 WordStats bulunamadı - henüz oyun oynamamış');
            return {};
        }
    }
    
    analyzeProgress() {
        console.log('\n📊 KELİME ÖĞRENME ANALİZİ');
        console.log('='.repeat(50));
        
        if (this.totalWords === 0) {
            console.log('⚠️ Henüz kelime istatistiği yok!');
            console.log('💡 Önce birkaç oyun oynayın, sonra tekrar analiz yapın.');
            return;
        }
        
        let learnedWords = 0;
        let progressingWords = 0;
        let strugglingWords = 0;
        
        const categories = {
            learned: [],     // Öğrenilmiş (%80+ başarı, 10+ doğru)
            progressing: [], // İlerliyor (5+ doğru ama henüz öğrenmemiş)
            struggling: []   // Zorlanıyor (%50 altı başarı)
        };
        
        // Her kelimeyi kategorize et
        Object.keys(this.wordStats).forEach(word => {
            const stats = this.wordStats[word];
            const accuracy = stats.correct / (stats.correct + stats.wrong);
            const totalAttempts = stats.correct + stats.wrong;
            
            if (stats.correct >= 10 && accuracy >= 0.8) {
                // Öğrenilmiş kelime
                learnedWords++;
                categories.learned.push({
                    word, 
                    accuracy: (accuracy * 100).toFixed(1),
                    attempts: totalAttempts,
                    correct: stats.correct
                });
            } else if (stats.correct >= 5) {
                // İlerleyen kelime
                progressingWords++;
                categories.progressing.push({
                    word, 
                    accuracy: (accuracy * 100).toFixed(1),
                    attempts: totalAttempts,
                    correct: stats.correct,
                    needed: 10 - stats.correct
                });
            } else {
                // Zorlanılan kelime
                strugglingWords++;
                categories.struggling.push({
                    word, 
                    accuracy: (accuracy * 100).toFixed(1),
                    attempts: totalAttempts,
                    correct: stats.correct
                });
            }
        });
        
        // Özet bilgiler
        console.log(`📚 Toplam Kelime: ${this.totalWords}`);
        console.log(`✅ Öğrenilmiş: ${learnedWords} (%${((learnedWords/this.totalWords)*100).toFixed(1)})`);
        console.log(`🔄 İlerliyor: ${progressingWords} (%${((progressingWords/this.totalWords)*100).toFixed(1)})`);
        console.log(`😅 Zorlanıyor: ${strugglingWords} (%${((strugglingWords/this.totalWords)*100).toFixed(1)})`);
        
        // Detaylar
        if (categories.learned.length > 0) {
            console.log('\n✅ ÖĞRENİLMİŞ KELİMELER:');
            categories.learned.forEach(item => {
                console.log(`   🎯 ${item.word}: ${item.accuracy}% başarı (${item.correct}/10+ doğru)`);
            });
        }
        
        if (categories.progressing.length > 0) {
            console.log('\n🔄 İLERLEYEN KELİMELER:');
            categories.progressing.slice(0, 10).forEach(item => {
                console.log(`   ⚡ ${item.word}: ${item.accuracy}% başarı (${item.needed} doğru daha gerekli)`);
            });
        }
        
        if (categories.struggling.length > 0) {
            console.log('\n😅 ZORLANAN KELİMELER (ilk 5):');
            categories.struggling.slice(0, 5).forEach(item => {
                console.log(`   🤔 ${item.word}: ${item.accuracy}% başarı (${item.correct} doğru)`);
            });
        }
        
        return {
            total: this.totalWords,
            learned: learnedWords,
            progressing: progressingWords,
            struggling: strugglingWords,
            categories
        };
    }
    
    estimateGamesForFirstWord() {
        console.log('\n🎯 İLK KELİME ÖĞRENME TAHMİNİ');
        console.log('='.repeat(50));
        
        if (this.totalWords === 0) {
            console.log('📅 Tahmini süre:');
            console.log('   🟢 Kolay seviye: 3-4 oyun');
            console.log('   🟡 Orta seviye: 4-6 oyun');  
            console.log('   🔴 Zor seviye: 6-8 oyun');
            console.log('\n💡 İlk kelime öğrenmek için günde 2-3 oyun oynayın!');
            return;
        }
        
        // Mevcut verilerden tahmin
        const maxCorrect = Math.max(...Object.values(this.wordStats).map(s => s.correct));
        const avgCorrect = Object.values(this.wordStats).reduce((sum, s) => sum + s.correct, 0) / this.totalWords;
        
        console.log(`📊 Şu anki en iyi kelime: ${maxCorrect}/10 doğru`);
        console.log(`📊 Ortalama ilerleme: ${avgCorrect.toFixed(1)}/10 doğru`);
        
        if (maxCorrect >= 10) {
            console.log('🎉 Tebrikler! Zaten kelime öğrenmeye başladınız!');
        } else {
            const needed = 10 - maxCorrect;
            console.log(`⏳ İlk kelime için ${needed} doğru cevap daha gerekli`);
            console.log(`🎮 Tahmini ${Math.ceil(needed / 3)} oyun daha`);
        }
    }
    
    getGameRecommendations() {
        console.log('\n💡 ÖNERILER');
        console.log('='.repeat(50));
        
        const analysis = this.analyzeProgress();
        
        if (analysis.learned > 0) {
            console.log('🎯 Harika! Kelime öğrenmeye başladınız!');
            console.log('📚 Öğrendiğiniz kelimeleri pekiştirmek için haftada 1-2 oyun oynayın');
        } else if (analysis.progressing > 0) {
            console.log('🔄 Bazı kelimeler öğrenmeye yakın!');
            console.log('⚡ Aynı zorluk seviyesinde oyun oynayarak odaklanın');
        } else if (analysis.total > 0) {
            console.log('💪 İyi başlangıç! Devam edin!');
            console.log('🎮 Günde 2-3 oyun oynarsanız yakında ilk kelimelerinizi öğrenirsiniz');
        }
        
        // Zorluk önerisi
        if (analysis.struggling > analysis.progressing) {
            console.log('💡 Öneri: Daha kolay seviye seçin (hızlı öğrenme)');
        }
        
        console.log('\n📈 Hız modu avantajı: Daha fazla kelime tekrarı = daha hızlı öğrenme!');
    }
}

// Analizi çalıştır
function analyzeWordLearning() {
    const analyzer = new WordLearningAnalyzer();
    analyzer.analyzeProgress();
    analyzer.estimateGamesForFirstWord();
    analyzer.getGameRecommendations();
    
    return analyzer;
}

// Browser console için global erişim
if (typeof window !== 'undefined') {
    window.analyzeWordLearning = analyzeWordLearning;
    console.log('📊 KELİME ÖĞRENME ANALİZCİSİ HAZIR!');
    console.log('🎯 Kullanım: analyzeWordLearning() komutunu browser console\'da çalıştırın');
}

// Node.js için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordLearningAnalyzer;
}