#!/usr/bin/env node

/**
 * 🎯 HASENE APK İsimlendirme Konfigürasyonu
 * APK dosya isimlerini farklı formatlarla oluşturmak için
 */

const args = process.argv.slice(2);
const mode = args[0] || 'daily';

console.log(`📱 APK İsimlendirme Modu: ${mode}`);

function getAPKName(mode) {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = Math.floor(Date.now() / 1000);
    const buildNumber = Math.floor(Date.now() / 86400000); // Günlük build
    
    switch(mode) {
        case 'daily':
            return `HASENE-Arabic-Learning-Game-FINAL-${currentDate}.apk`;
            
        case 'version':
            return `HASENE-Arabic-Learning-Game-v2.1.${buildNumber}.apk`;
            
        case 'timestamp':
            return `HASENE-Arabic-Learning-Game-${timestamp}.apk`;
            
        case 'simple':
            return `HASENE-Arabic-Learning-Game-LATEST.apk`;
            
        case 'release':
            return `HASENE-Arabic-Learning-Game-RELEASE-v2.1.apk`;
            
        default:
            return `HASENE-Arabic-Learning-Game-FINAL-${currentDate}.apk`;
    }
}

// Ana script'e APK adını gönder
console.log(getAPKName(mode));