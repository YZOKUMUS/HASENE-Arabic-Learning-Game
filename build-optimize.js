#!/usr/bin/env node

/**
 * 🚀 HASENE APK Optimizasyon ve Build Sistemi
 * Bu script her APK build öncesi otomatik optimizasyon yapar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 HASENE APK Optimizasyon Sistemi Başlatılıyor...\n');

// 1. Büyük dosyaları kaldırma
function removeLargeFiles() {
    console.log('📁 Büyük dosyalar temizleniyor...');
    
    const filesToRemove = [
        'www/sounds/game-music.mp4',
        'sounds/game-music.mp4',
        'www/sounds/*.mp4',
        'sounds/*.mp4'
    ];
    
    filesToRemove.forEach(file => {
        try {
            const fullPath = path.resolve(file);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log(`✅ Silindi: ${file}`);
            }
        } catch (err) {
            // Sessizce devam et
        }
    });
}

// 2. JSON dosyalarını minify etme
function minifyJsonFiles() {
    console.log('📄 JSON dosyalar optimize ediliyor...');
    
    const jsonFiles = [
        'www/data.json',
        'www/ayetoku.json',
        'www/dualar.json',
        'data.json',
        'ayetoku.json',
        'dualar.json'
    ];
    
    jsonFiles.forEach(file => {
        try {
            if (fs.existsSync(file)) {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                fs.writeFileSync(file, JSON.stringify(data));
                const size = (fs.statSync(file).size / 1024).toFixed(2);
                console.log(`✅ Minified: ${file} (${size} KB)`);
            }
        } catch (err) {
            console.log(`⚠️ Hata: ${file} - ${err.message}`);
        }
    });
}

// 3. Cache buster güncelleme
function updateCacheBuster() {
    console.log('🔄 Cache buster güncelleniyor...');
    
    const timestamp = Date.now();
    const version = `2.1.${Math.floor(timestamp / 1000)}`;
    
    // HTML dosyalarında version güncellemesi
    const htmlFiles = ['index.html', 'www/index.html'];
    
    htmlFiles.forEach(file => {
        try {
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, 'utf8');
                
                // CSS ve JS dosya linklerini güncelle
                content = content.replace(/\?v=[\d\.]+/g, `?v=${version}`);
                
                fs.writeFileSync(file, content);
                console.log(`✅ Cache buster güncellendi: ${file}`);
            }
        } catch (err) {
            console.log(`⚠️ Hata: ${file} - ${err.message}`);
        }
    });
    
    return version;
}

// 4. Script.js version güncelleme
function updateScriptVersion(version) {
    console.log('📝 Script version güncelleniyor...');
    
    const scriptFiles = ['script.js', 'www/script.js'];
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    scriptFiles.forEach(file => {
        try {
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, 'utf8');
                
                // APP_VERSION objesini güncelle
                const versionRegex = /const APP_VERSION = \{[\s\S]*?\};/;
                const newVersion = `const APP_VERSION = {
    version: "${version}",
    buildDate: "${currentDate}",
    buildTime: "${currentTime}",
    buildNumber: "${currentDate.replace(/-/g, '')}-${currentTime.replace(':', '')}",
    codeStatus: "Auto Optimized",
    copyright: "© 2025 YZOKUMUS",
    features: ["Auto Build", "Size Optimized", "Cache Managed", "Production Ready"]
};`;
                
                content = content.replace(versionRegex, newVersion);
                fs.writeFileSync(file, content);
                console.log(`✅ Version güncellendi: ${file}`);
            }
        } catch (err) {
            console.log(`⚠️ Hata: ${file} - ${err.message}`);
        }
    });
}

// 5. Boyut raporu
function generateSizeReport() {
    console.log('\n📊 Boyut Raporu:');
    
    const checkPaths = [
        'www',
        'www/sounds',
        'www/data.json',
        'www/ayetoku.json'
    ];
    
    checkPaths.forEach(checkPath => {
        try {
            if (fs.existsSync(checkPath)) {
                const stats = fs.statSync(checkPath);
                if (stats.isDirectory()) {
                    // Klasör boyutu hesapla
                    let totalSize = 0;
                    const files = fs.readdirSync(checkPath, { recursive: true });
                    files.forEach(file => {
                        const filePath = path.join(checkPath, file);
                        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                            totalSize += fs.statSync(filePath).size;
                        }
                    });
                    console.log(`📁 ${checkPath}: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
                } else {
                    console.log(`📄 ${checkPath}: ${(stats.size / 1024).toFixed(2)} KB`);
                }
            }
        } catch (err) {
            console.log(`⚠️ ${checkPath}: Okunamadı`);
        }
    });
}

// 6. Capacitor sync ve build
function buildAPK(version) {
    console.log('\n🔨 APK Build işlemi başlıyor...');
    
    try {
        // Capacitor sync
        console.log('🔄 Capacitor sync...');
        execSync('npx cap sync android', { stdio: 'inherit' });
        
        // Android build
        console.log('📱 Android APK build...');
        execSync('cd android && .\\gradlew.bat assembleDebug', { stdio: 'inherit', shell: true });
        
        // APK kopyalama
        const apkSource = 'android/app/build/outputs/apk/debug/app-debug.apk';
        const apkTarget = `HASENE-Arabic-Learning-Game-v${version}-OPTIMIZED.apk`;
        
        if (fs.existsSync(apkSource)) {
            fs.copyFileSync(apkSource, apkTarget);
            
            const apkSize = (fs.statSync(apkTarget).size / 1024 / 1024).toFixed(2);
            console.log(`\n🎉 APK Başarıyla Oluşturuldu!`);
            console.log(`📱 Dosya: ${apkTarget}`);
            console.log(`📊 Boyut: ${apkSize} MB`);
            
            return apkTarget;
        }
    } catch (error) {
        console.error('❌ Build hatası:', error.message);
        return null;
    }
}

// 7. Git commit (opsiyonel)
function gitCommit(version, apkFile) {
    try {
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "🚀 Auto-Optimized APK v${version} - Automated Build System

✨ Otomatik Optimizasyonlar:
- Büyük dosyalar temizlendi
- JSON dosyalar minify edildi  
- Cache buster güncellendi (v${version})
- APP_VERSION otomatik güncellendi

📱 APK: ${apkFile}
🤖 Otomatik build sistemi ile oluşturuldu"`, { stdio: 'inherit' });
        
        console.log('✅ Git commit tamamlandı');
    } catch (err) {
        console.log('⚠️ Git commit atlandı (değişiklik yok veya git hatası)');
    }
}

// Ana fonksiyon
async function main() {
    try {
        // Tüm optimizasyonları sırayla çalıştır
        removeLargeFiles();
        minifyJsonFiles();
        const version = updateCacheBuster();
        updateScriptVersion(version);
        generateSizeReport();
        
        const apkFile = buildAPK(version);
        
        if (apkFile) {
            gitCommit(version, apkFile);
            
            console.log('\n🎯 Optimizasyon Tamamlandı!');
            console.log(`📱 APK hazır: ${apkFile}`);
            console.log('📋 Sonraki build için: npm run build-apk');
        }
        
    } catch (error) {
        console.error('❌ Genel hata:', error.message);
        process.exit(1);
    }
}

// Scripti çalıştır
main();