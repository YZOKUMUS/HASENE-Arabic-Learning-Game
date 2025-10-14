// Web Audio API ile ses oluşturucu
class AudioGenerator {
    constructor() {
        this.audioContext = null;
        this.activeOscillators = [];
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API desteklenmiyor:', error);
        }
    }

    // Ses çalmak için AudioContext'i unlock et (user interaction gerekli)
    unlock() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Tüm aktif müziği durdur
    stopAllMusic() {
        console.log('stopAllMusic çağrıldı, aktif oscillator sayısı:', this.activeOscillators.length);
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Zaten durmuş olabilir
            }
        });
        this.activeOscillators = [];
    }

    // Basit ton oluştur
    createTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Doğru cevap sesi (yükselen melodi)
    playCorrectSound() {
        this.unlock();
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.2, 'sine', 0.4);
            }, index * 100);
        });
    }

    // Yanlış cevap sesi (düşük buzzer)
    playIncorrectSound() {
        this.unlock();
        this.createTone(196, 0.5, 'sawtooth', 0.3);
    }

    // Buton tıklama sesi
    playClickSound() {
        this.unlock();
        this.createTone(800, 0.1, 'square', 0.2);
    }

    // Buton hover sesi
    playHoverSound() {
        this.unlock();
        this.createTone(1000, 0.05, 'sine', 0.15);
    }

    // Başarı fanfarı
    playSuccessFanfare() {
        this.unlock();
        const melody = [
            {freq: 523.25, time: 0},    // C5
            {freq: 659.25, time: 150},  // E5
            {freq: 783.99, time: 300},  // G5
            {freq: 1046.50, time: 450}, // C6
            {freq: 783.99, time: 600},  // G5
            {freq: 1046.50, time: 750}  // C6
        ];
        
        melody.forEach(note => {
            setTimeout(() => {
                this.createTone(note.freq, 0.3, 'sine', 0.4);
            }, note.time);
        });
    }

    // Level atlama sesi
    playLevelUpSound() {
        this.unlock();
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4-E5
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.2, 'triangle', 0.35);
            }, index * 80);
        });
    }

    // Rozet kazanma sesi
    playAchievementSound() {
        this.unlock();
        // Parlak ve kutlama tarzı
        const sparkle = [
            {freq: 1396.91, time: 0},   // F6
            {freq: 1661.22, time: 100}, // G#6
            {freq: 2093.00, time: 200}, // C7
            {freq: 1661.22, time: 300}, // G#6
            {freq: 2093.00, time: 400}  // C7
        ];
        
        sparkle.forEach(note => {
            setTimeout(() => {
                this.createTone(note.freq, 0.15, 'sine', 0.3);
            }, note.time);
        });
    }

    // Kalp kaybı sesi
    playHeartLostSound() {
        this.unlock();
        this.createTone(220, 0.3, 'triangle', 0.25);
        setTimeout(() => {
            this.createTone(196, 0.4, 'triangle', 0.3);
        }, 200);
    }

    // Arka plan müziği (dini ney tarzı)
    playBackgroundMusic() {
        console.log('playBackgroundMusic çağrıldı');
        if (!this.audioContext) {
            console.log('audioContext yok, müzik çalamıyor');
            return;
        }
        
        const playNeyNote = (freq, startTime, duration, vibrato = false) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            // Oscillator'ı takip listesine ekle
            this.activeOscillators.push(oscillator);
            
            // Ney tarzı ses için sine wave ve filter
            oscillator.type = 'sine';
            filterNode.type = 'lowpass';
            filterNode.frequency.value = 2000;
            filterNode.Q.value = 1;
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = freq;
            
            // Ney tarzı attack ve decay
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.06, startTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.03, startTime + duration - 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            // Oscillator bittiğinde listeden çıkar
            oscillator.addEventListener('ended', () => {
                const index = this.activeOscillators.indexOf(oscillator);
                if (index > -1) {
                    this.activeOscillators.splice(index, 1);
                }
            });
            
            // Hafif vibrato ekle
            if (vibrato) {
                const lfo = this.audioContext.createOscillator();
                const lfoGain = this.audioContext.createGain();
                
                lfo.frequency.value = 4; // Yavaş vibrato
                lfoGain.gain.value = 2; // Çok hafif
                
                lfo.connect(lfoGain);
                lfoGain.connect(oscillator.frequency);
                
                lfo.start(startTime);
                lfo.stop(startTime + duration);
            }
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        // İslami makam tarzında melodi (Hicaz makamı benzeri)
        const melody = [
            // D4, Eb4, F#4, G4, A4, Bb4, C5, D5 (Hicaz benzeri)
            293.66, 311.13, 369.99, 392.00, 440.00, 466.16, 523.25, 587.33,
            523.25, 466.16, 440.00, 392.00, 369.99, 311.13, 293.66
        ];
        
        const now = this.audioContext.currentTime;
        melody.forEach((freq, index) => {
            const isLongNote = index % 3 === 0; // Her 3. nota uzun
            const duration = isLongNote ? 1.2 : 0.8;
            const hasVibrato = isLongNote; // Uzun notalarda vibrato
            
            playNeyNote(freq, now + index * 1.0, duration, hasVibrato);
        });
    }

    // 🎉 Victory fanfare - Level complete
    playVictoryFanfare() {
        this.unlock();
        const notes = [
            { freq: 523.25, duration: 0.25, delay: 0 },    // C5
            { freq: 659.25, duration: 0.25, delay: 200 },  // E5
            { freq: 783.99, duration: 0.25, delay: 400 },  // G5
            { freq: 1046.5, duration: 0.5, delay: 600 },   // C6 (longer)
        ];
        
        notes.forEach(note => {
            setTimeout(() => {
                this.createTone(note.freq, note.duration, 'triangle', 0.4);
            }, note.delay);
        });
    }

    // ⭐ Perfect score fanfare - All answers correct  
    playPerfectFanfare() {
        this.unlock();
        const melody = [
            { freq: 523.25, duration: 0.15, delay: 0 },    // C5
            { freq: 659.25, duration: 0.15, delay: 150 },  // E5
            { freq: 783.99, duration: 0.15, delay: 300 },  // G5
            { freq: 1046.5, duration: 0.15, delay: 450 },  // C6
            { freq: 1318.5, duration: 0.25, delay: 600 },  // E6
            { freq: 1568.0, duration: 0.4, delay: 800 },   // G6 (triumphant)
        ];
        
        melody.forEach(note => {
            setTimeout(() => {
                this.createTone(note.freq, note.duration, 'triangle', 0.45);
                // Harmonic için ikinci ses
                setTimeout(() => {
                    this.createTone(note.freq * 1.5, note.duration * 0.7, 'sine', 0.2);
                }, 30);
            }, note.delay);
        });
    }

    // 🏆 Achievement unlocked fanfare
    playAchievementFanfare() {
        this.unlock();
        const achievement = [
            { freq: 440.00, duration: 0.2, delay: 0 },     // A4
            { freq: 554.37, duration: 0.2, delay: 180 },   // C#5
            { freq: 659.25, duration: 0.2, delay: 360 },   // E5
            { freq: 880.00, duration: 0.3, delay: 540 },   // A5
            { freq: 1108.7, duration: 0.5, delay: 720 },   // C#6
        ];
        
        achievement.forEach(note => {
            setTimeout(() => {
                this.createTone(note.freq, note.duration, 'sawtooth', 0.35);
                // Echo effect
                setTimeout(() => {
                    this.createTone(note.freq, note.duration * 0.5, 'sine', 0.15);
                }, 80);
            }, note.delay);
        });
    }

    // 🔥 Streak milestone fanfare
    playStreakFanfare() {
        this.unlock();
        // Yükselen scala
        const scale = [698.46, 783.99, 880.00, 987.77, 1108.7]; // F5 to C#6
        
        scale.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.18, 'triangle', 0.3);
            }, index * 120);
        });
        
        // Final celebration chord
        setTimeout(() => {
            [1108.7, 1318.5, 1568.0].forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.6, 'sine', 0.25);
                }, index * 50);
            });
        }, 650);
    }
}

// Global instance
window.audioGenerator = new AudioGenerator();