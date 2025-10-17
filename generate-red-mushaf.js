const sharp = require('sharp');

// MUSHAF-HİLAL ikonu - Yeşil yerine KIRMIZI fon
const mushafRedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
    <defs>
        <linearGradient id="redIslamicBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B0000"/>
            <stop offset="50%" style="stop-color:#DC143C"/>
            <stop offset="100%" style="stop-color:#e30a17"/>
        </linearGradient>
        <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="black" flood-opacity="0.3"/>
        </filter>
        <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
    </defs>
    
    <!-- Ana çerçeve - KIRMIZI arkaplan -->
    <circle cx="96" cy="96" r="88" fill="url(#redIslamicBg)" stroke="#C9A961" stroke-width="6"/>
    <circle cx="96" cy="96" r="75" fill="none" stroke="#C9A961" stroke-width="1" opacity="0.5"/>
    
    <!-- Açık Mushaf (Kuran) - Daha gerçekçi -->
    <g transform="translate(96,90)" filter="url(#shadow)">
        <!-- Sol sayfa - Daha kavisli -->
        <path d="M-35,-25 Q-20,-27 -5,-22 L-5,20 Q-20,25 -35,25 Z" fill="#F5F5DC" stroke="#C9A961" stroke-width="1"/>
        <!-- Sağ sayfa - Daha kavisli -->  
        <path d="M5,-22 Q20,-27 35,-25 Q35,25 20,25 Q5,20 5,-22 Z" fill="#F5F5DC" stroke="#C9A961" stroke-width="1"/>
        
        <!-- Sol sayfa - Muhammed (محمد) yazısı -->
        <text x="-20" y="-10" font-family="Times New Roman" font-size="12" font-weight="bold" 
              text-anchor="middle" fill="#8B0000">محمد</text>
        
        <!-- Sol sayfa - Arapça metin çizgileri -->
        <line x1="-30" y1="-2" x2="-10" y2="-1" stroke="#2D5016" stroke-width="0.8"/>
        <line x1="-30" y1="4" x2="-10" y2="5" stroke="#2D5016" stroke-width="0.8"/>
        <line x1="-30" y1="10" x2="-10" y2="11" stroke="#2D5016" stroke-width="0.8"/>
        <line x1="-30" y1="16" x2="-10" y2="17" stroke="#2D5016" stroke-width="0.8"/>
        
        <!-- Sağ sayfa - Allah (الله) yazısı -->
        <text x="20" y="-10" font-family="Times New Roman" font-size="12" font-weight="bold" 
              text-anchor="middle" fill="#8B0000">الله</text>
        
        <!-- Sağ sayfa - Arapça metin çizgileri -->
        <line x1="10" y1="-1" x2="30" y2="-2" stroke="#2D5016" stroke-width="0.8"/>
        <line x1="10" y1="5" x2="30" y2="4" stroke="#2D5016" stroke-width="0.8"/>
        <line x1="10" y1="11" x2="30" y2="10" stroke="#2D5016" stroke-width="0.8"/>
        <line x1="10" y1="17" x2="30" y2="16" stroke="#2D5016" stroke-width="0.8"/>
        
        <!-- Orta cilt (kitap ortası) -->
        <line x1="-2" y1="-25" x2="-2" y2="25" stroke="#C9A961" stroke-width="2"/>
        <line x1="2" y1="-25" x2="2" y2="25" stroke="#C9A961" stroke-width="2"/>
        
        <!-- Sayfa numaraları -->
        <text x="-20" y="22" font-family="Arial" font-size="6" text-anchor="middle" fill="#7f8c8d">۲</text>
        <text x="20" y="22" font-family="Arial" font-size="6" text-anchor="middle" fill="#7f8c8d">۳</text>
    </g>
    
    <!-- Üstte büyük hilal ve yıldız -->
    <g transform="translate(96,35)" filter="url(#glow)">
        <circle cx="-8" cy="0" r="15" fill="#C9A961"/>
        <circle cx="-2" cy="0" r="11" fill="url(#redIslamicBg)"/>
        <path d="M12,-8 L15,-2 L21,0 L15,2 L12,8 L9,2 L3,0 L9,-2 Z" fill="#C9A961"/>
    </g>
    
    <!-- HASENE yazısı altında + Arapça + 2025 -->
    <text x="96" y="158" font-family="Arial Black" font-size="14" font-weight="900" 
          text-anchor="middle" fill="#C9A961" filter="url(#glow)">HASENE</text>
    <text x="96" y="172" font-family="Times New Roman" font-size="10" font-weight="bold" 
          text-anchor="middle" fill="#C9A961" opacity="0.8">الحسنة</text>
    <text x="96" y="184" font-family="Arial" font-size="8" font-weight="bold" 
          text-anchor="middle" fill="#FFD700" opacity="0.7">2025</text>
</svg>`;

async function generateRedMushafIcon() {
    try {
        console.log('🔴 MUSHAF-HİLAL İkonu Kırmızı Versiyonu Üretiliyor...');
        
        const svgBuffer = Buffer.from(mushafRedSvg);
        
        // 192x192 PNG oluştur
        await sharp(svgBuffer)
            .resize(192, 192)
            .png({ quality: 100 })
            .toFile('icon-192-v4-RED-MUSHAF.png');
        
        // 512x512 PNG oluştur  
        await sharp(svgBuffer)
            .resize(512, 512)
            .png({ quality: 100 })
            .toFile('icon-512-v4-RED-MUSHAF.png');
            
        // Android ikonları için farklı boyutlar
        const androidSizes = [
            { size: 48, path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png' },
            { size: 72, path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png' },
            { size: 96, path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png' },
            { size: 144, path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png' },
            { size: 192, path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png' }
        ];
        
        for (const { size, path: filePath } of androidSizes) {
            await sharp(svgBuffer)
                .resize(size, size)
                .png({ quality: 100 })
                .toFile(filePath);
        }
        
        console.log('✅ Kırmızı MUSHAF-HİLAL ikonu başarıyla oluşturuldu!');
        console.log('📁 Dosyalar:');
        console.log('   - icon-192-v4-RED-MUSHAF.png');
        console.log('   - icon-512-v4-RED-MUSHAF.png');
        console.log('   - Android mipmap klasörlerinde güncellemeler');
        console.log('🔴 Arkaplan: Yeşil → Kırmızı gradyent olarak değiştirildi');
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    }
}

generateRedMushafIcon();