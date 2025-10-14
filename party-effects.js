// 🎊 Parti Efektleri - Duolingo Tarzı Kutlamalar

class PartyEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isActive = false;
    }

    // Konfeti efekti
    showConfetti(duration = 3000) {
        this.createCanvas();
        this.isActive = true;
        
        // Konfeti parçacıkları oluştur
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: this.getRandomColor(),
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        this.animate();
        
        // Belirli süre sonra durdur
        setTimeout(() => {
            this.stop();
        }, duration);
    }

    // Başarı patlaması
    showAchievementBurst(x, y) {
        this.createCanvas();
        this.isActive = true;
        
        // Yıldız patlaması
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * (Math.random() * 5 + 2),
                vy: Math.sin(angle) * (Math.random() * 5 + 2),
                color: '#FFD700',
                size: Math.random() * 6 + 3,
                life: 1,
                decay: 0.02,
                type: 'star'
            });
        }

        this.animate();
        
        setTimeout(() => {
            this.stop();
        }, 2000);
    }

    // Seviye atlama efekti
    showLevelUpEffect() {
        this.createCanvas();
        this.isActive = true;
        
        // Altın yağmuru
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: -20,
                vx: 0,
                vy: Math.random() * 2 + 1,
                color: '#FFD700',
                size: Math.random() * 6 + 4,
                type: 'coin',
                rotation: 0,
                rotationSpeed: 5
            });
        }

        this.animate();
        
        setTimeout(() => {
            this.stop();
        }, 4000);
    }

    createCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '9999';
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Hareket
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Yerçekimi
            
            if (particle.rotation !== undefined) {
                particle.rotation += particle.rotationSpeed;
            }
            
            if (particle.life !== undefined) {
                particle.life -= particle.decay;
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }
            
            // Ekran dışına çıkanları kaldır
            if (particle.y > this.canvas.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Çizim
            this.drawParticle(particle);
        }
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        
        if (particle.rotation) {
            this.ctx.rotate(particle.rotation * Math.PI / 180);
        }
        
        if (particle.life !== undefined) {
            this.ctx.globalAlpha = particle.life;
        }
        
        this.ctx.fillStyle = particle.color;
        
        if (particle.type === 'star') {
            this.drawStar(0, 0, particle.size);
        } else if (particle.type === 'coin') {
            this.drawCoin(0, 0, particle.size);
        } else {
            // Normal konfeti
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        }
        
        this.ctx.restore();
    }

    drawStar(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x1 = Math.cos(angle) * size;
            const y1 = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(x1, y1);
            } else {
                this.ctx.lineTo(x1, y1);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawCoin(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // İç daire
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    stop() {
        this.isActive = false;
        this.particles = [];
        if (this.canvas) {
            document.body.removeChild(this.canvas);
            this.canvas = null;
            this.ctx = null;
        }
    }
}

// Global instance
window.partyEffects = new PartyEffects();