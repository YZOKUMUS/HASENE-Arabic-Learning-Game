const sharp = require('sharp');
const fs = require('fs');

// Birden fazla ikon tasarımı için SVG şablonları
const iconDesigns = {
    
    // 1. KURAN + AY YILDIZ (Türk Bayrağı temalı)
    turkish_quran: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
        <defs>
            <radialGradient id="turkishBg" cx="50%" cy="50%">
                <stop offset="0%" style="stop-color:#e30a17"/>
                <stop offset="70%" style="stop-color:#c1272d"/> 
                <stop offset="100%" style="stop-color:#1e3c72"/>
            </radialGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        
        <!-- Türk bayrağı renkleri arkaplan -->
        <circle cx="96" cy="96" r="88" fill="url(#turkishBg)" stroke="#FFD700" stroke-width="4"/>
        
        <!-- Kuran-ı Kerim kitabı -->
        <g transform="translate(96,96)">
            <rect x="-25" y="-30" width="50" height="35" rx="3" fill="#2D5016" stroke="#FFD700" stroke-width="1"/>
            <rect x="-23" y="-28" width="46" height="31" rx="2" fill="#0F4C3A"/>
            
            <!-- Kuran yazısı (Arapça) -->
            <text x="0" y="-10" font-family="Times New Roman" font-size="16" font-weight="bold" 
                  text-anchor="middle" fill="#FFD700">القرآن</text>
            <text x="0" y="5" font-family="Arial" font-size="8" font-weight="bold" 
                  text-anchor="middle" fill="#FFD700">KURAN</text>
        </g>
        
        <!-- Türk bayrağı ay yıldız (sol üst) -->
        <g transform="translate(50,50)">
            <circle cx="-3" cy="0" r="8" fill="#ffffff"/>
            <circle cx="1" cy="0" r="6" fill="#e30a17"/>
            <path d="M8,-5 L10,-1 L14,0 L10,1 L8,5 L6,1 L2,0 L6,-1 Z" fill="#ffffff"/>
        </g>
        
        <!-- Dekoratif İslami desenler -->
        <circle cx="40" cy="140" r="3" fill="#FFD700" opacity="0.8"/>
        <circle cx="152" cy="140" r="3" fill="#FFD700" opacity="0.8"/>
        <circle cx="152" cy="52" r="3" fill="#FFD700" opacity="0.8"/>
    </svg>`,

    // 2. MUSHAF + HİLAL (Klasik İslami)
    mushaf_crescent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
        <defs>
            <linearGradient id="islamicGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0F4C3A"/>
                <stop offset="50%" style="stop-color:#2D5016"/>
                <stop offset="100%" style="stop-color:#58cc02"/>
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="black" flood-opacity="0.3"/>
            </filter>
        </defs>
        
        <!-- Ana çerçeve -->
        <circle cx="96" cy="96" r="88" fill="url(#islamicGreen)" stroke="#C9A961" stroke-width="6"/>
        <circle cx="96" cy="96" r="75" fill="none" stroke="#C9A961" stroke-width="1" opacity="0.5"/>
        
        <!-- Açık Mushaf (Kuran) -->
        <g transform="translate(96,90)" filter="url(#shadow)">
            <!-- Sol sayfa -->
            <path d="M-35,-25 L-5,-22 L-5,20 L-35,25 Z" fill="#F5F5DC" stroke="#C9A961" stroke-width="1"/>
            <!-- Sağ sayfa -->  
            <path d="M5,-22 L35,-25 L35,25 L5,20 Z" fill="#F5F5DC" stroke="#C9A961" stroke-width="1"/>
            
            <!-- Sol sayfa metni (Arapça çizgiler) -->
            <line x1="-30" y1="-15" x2="-10" y2="-13" stroke="#2D5016" stroke-width="1"/>
            <line x1="-30" y1="-8" x2="-10" y2="-6" stroke="#2D5016" stroke-width="1"/>
            <line x1="-30" y1="-1" x2="-10" y2="1" stroke="#2D5016" stroke-width="1"/>
            <line x1="-30" y1="6" x2="-10" y2="8" stroke="#2D5016" stroke-width="1"/>
            
            <!-- Sağ sayfa metni -->
            <line x1="10" y1="-13" x2="30" y2="-15" stroke="#2D5016" stroke-width="1"/>
            <line x1="10" y1="-6" x2="30" y2="-8" stroke="#2D5016" stroke-width="1"/>
            <line x1="10" y1="1" x2="30" y2="-1" stroke="#2D5016" stroke-width="1"/>
            <line x1="10" y1="8" x2="30" y2="6" stroke="#2D5016" stroke-width="1"/>
        </g>
        
        <!-- Üstte büyük hilal ve yıldız -->
        <g transform="translate(96,35)">
            <circle cx="-8" cy="0" r="15" fill="#C9A961"/>
            <circle cx="-2" cy="0" r="11" fill="url(#islamicGreen)"/>
            <path d="M12,-8 L15,-2 L21,0 L15,2 L12,8 L9,2 L3,0 L9,-2 Z" fill="#C9A961"/>
        </g>
        
        <!-- HASENE yazısı altında -->
        <text x="96" y="165" font-family="Arial Black" font-size="14" font-weight="900" 
              text-anchor="middle" fill="#C9A961">HASENE</text>
    </svg>`,

    // 3. MODERN MİNİMAL (App Store tarzı)
    modern_minimal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
        <defs>
            <linearGradient id="modernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea"/>
                <stop offset="50%" style="stop-color:#764ba2"/>
                <stop offset="100%" style="stop-color:#58cc02"/>
            </linearGradient>
        </defs>
        
        <!-- Modern yuvarlak köşeli kare -->
        <rect x="12" y="12" width="168" height="168" rx="42" fill="url(#modernGrad)"/>
        
        <!-- Merkezi büyük Arapça harf -->
        <text x="96" y="125" font-family="Times New Roman" font-size="90" font-weight="bold" 
              text-anchor="middle" fill="white" opacity="0.95">ق</text>
        
        <!-- Üst köşede Türk bayrağı rengi nokta -->
        <circle cx="150" cy="42" r="8" fill="#e30a17"/>
        <circle cx="148" cy="40" r="4" fill="white"/>
        <path d="M152,38 L153,40 L155,40.5 L153,41 L152,43 L151,41 L149,40.5 L151,40 Z" fill="#e30a17"/>
        
        <!-- Alt kısımda subtle hilal -->
        <g transform="translate(96,165)" opacity="0.7">
            <circle cx="-3" cy="0" r="6" fill="white"/>
            <circle cx="-1" cy="0" r="4" fill="url(#modernGrad)"/>
        </g>
    </svg>`,

    // 4. KABE + HİLAL (Hacı temalı)
    kabe_themed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
        <defs>
            <radialGradient id="kabeBg" cx="50%" cy="50%">
                <stop offset="0%" style="stop-color:#1a1a1a"/>
                <stop offset="50%" style="stop-color:#2c3e50"/>
                <stop offset="100%" style="stop-color:#0F4C3A"/>
            </radialGradient>
        </defs>
        
        <!-- Gece gökyüzü arkaplan -->
        <circle cx="96" cy="96" r="88" fill="url(#kabeBg)" stroke="#C9A961" stroke-width="3"/>
        
        <!-- Kabe (siyah küp) -->
        <g transform="translate(96,100)">
            <rect x="-20" y="-15" width="40" height="25" fill="#000000" stroke="#C9A961" stroke-width="1"/>
            <!-- Altın bordür (Kiswah detayı) -->
            <rect x="-19" y="-8" width="38" height="3" fill="#C9A961"/>
            <rect x="-15" y="-14" width="6" height="23" fill="#C9A961" opacity="0.3"/>
            <rect x="9" y="-14" width="6" height="23" fill="#C9A961" opacity="0.3"/>
        </g>
        
        <!-- Büyük hilal ay (üstte) -->
        <g transform="translate(96,45)">
            <circle cx="-5" cy="0" r="18" fill="#C9A961"/>
            <circle cx="2" cy="0" r="13" fill="url(#kabeBg)"/>
        </g>
        
        <!-- Yıldızlar (gece gökyüzü) -->
        <circle cx="50" cy="60" r="1.5" fill="#C9A961"/>
        <circle cx="140" cy="70" r="1" fill="#C9A961"/>
        <circle cx="60" cy="130" r="1" fill="#C9A961"/>
        <circle cx="135" cy="125" r="1.5" fill="#C9A961"/>
        
        <!-- HASENE - Türkçe alt yazı -->
        <text x="96" y="175" font-family="Arial" font-size="12" font-weight="bold" 
              text-anchor="middle" fill="#C9A961">HASENE</text>
        <text x="96" y="165" font-family="Times New Roman" font-size="10" 
              text-anchor="middle" fill="#C9A961">حسنة</text>
    </svg>`,

    // 5. TÜRK KÜLTÜR SEMBOL (En Türk temalı)
    turkish_cultural: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
        <defs>
            <radialGradient id="turkBg" cx="50%" cy="50%">
                <stop offset="0%" style="stop-color:#e30a17"/>
                <stop offset="80%" style="stop-color:#c1272d"/>
                <stop offset="100%" style="stop-color:#8B0000"/>
            </radialGradient>
        </defs>
        
        <!-- Türk bayrağı kırmızısı arkaplan -->
        <circle cx="96" cy="96" r="88" fill="url(#turkBg)" stroke="#C9A961" stroke-width="4"/>
        
        <!-- Merkezi Osmanli tuğra tarzı desen -->
        <g transform="translate(96,90)">
            <!-- Ana kalligrafik şekil -->
            <path d="M-25,-20 Q-10,-25 0,-15 Q10,-25 25,-20 Q20,0 0,5 Q-20,0 -25,-20" 
                  fill="#FFD700" stroke="#ffffff" stroke-width="1"/>
            
            <!-- Kuran yazısı ortada -->
            <text x="0" y="-5" font-family="Times New Roman" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="#e30a17">قرآن</text>
        </g>
        
        <!-- Sol üstte Türk ay yıldız (büyük) -->
        <g transform="translate(65,65)">
            <circle cx="-5" cy="0" r="15" fill="#ffffff"/>
            <circle cx="0" cy="0" r="11" fill="#e30a17"/>
            <path d="M12,-10 L15,-3 L22,0 L15,3 L12,10 L9,3 L2,0 L9,-3 Z" fill="#ffffff"/>
        </g>
        
        <!-- Sağ altta mini Türk bayrağı -->
        <g transform="translate(140,140)">
            <rect x="-8" y="-5" width="16" height="10" fill="#e30a17" stroke="#FFD700" stroke-width="1"/>
            <circle cx="-2" cy="0" r="3" fill="#ffffff"/>
            <circle cx="0" cy="0" r="2" fill="#e30a17"/>
            <path d="M3,-2 L4,-1 L5,0 L4,1 L3,2 L2,1 L1,0 L2,-1 Z" fill="#ffffff"/>
        </g>
        
        <!-- TÜRK YAPIMI yazısı -->
        <text x="96" y="175" font-family="Arial" font-size="8" font-weight="bold" 
              text-anchor="middle" fill="#FFD700" opacity="0.8">MADE IN TÜRKİYE</text>
    </svg>`
};

async function generateMultipleIcons() {
    console.log('🇹🇷 Türk Yapımı HASENE İkonları Üretiliyor...\n');

    const iconNames = [
        { key: 'turkish_quran', name: 'TÜRK-KURAN', desc: '🇹🇷 Türk Bayrağı + Kuran Kitabı' },
        { key: 'mushaf_crescent', name: 'MUSHAF-HİLAL', desc: '📖 Açık Mushaf + Klasik İslami' },
        { key: 'modern_minimal', name: 'MODERN-MİNİMAL', desc: '📱 App Store Tarzı Modern' },
        { key: 'kabe_themed', name: 'KABE-TEMA', desc: '🕋 Kabe + Gece Gökyüzü' },
        { key: 'turkish_cultural', name: 'TÜRK-KÜLTÜR', desc: '🎨 Osmanli + Türk Sembol' }
    ];

    for (const { key, name, desc } of iconNames) {
        try {
            const svgBuffer = Buffer.from(iconDesigns[key]);
            
            // 192x192 
            await sharp(svgBuffer)
                .resize(192, 192)
                .png({ quality: 100 })
                .toFile(`icon-${name}-192.png`);
                
            // 512x512
            await sharp(svgBuffer)
                .resize(512, 512) 
                .png({ quality: 100 })
                .toFile(`icon-${name}-512.png`);
                
            console.log(`✅ ${desc}`);
            console.log(`   📁 icon-${name}-192.png & icon-${name}-512.png`);
            
        } catch (error) {
            console.error(`❌ ${name} hatası:`, error.message);
        }
    }
    
    console.log('\n🎨 Tüm ikonlar hazır! Artık en beğendiğinizi seçebilirsiniz.');
    console.log('📱 Her biri farklı Türk/İslami tema taşıyor.');
}

generateMultipleIcons();