# 🔄 HASENE Otomatik Dosya Senkronizasyon Scripti
# Bu script her değişiklikten sonra çalıştırılmalı

Write-Host "🔄 HASENE Dosya Senkronizasyonu Başlatılıyor..." -ForegroundColor Cyan

# Ana dizin
$rootDir = Get-Location

# Senkronize edilecek dosyalar
$filesToSync = @(
    "script.js",
    "style.css", 
    "index.html",
    "ayetoku.json",
    "data.json",
    "dualar.json",
    "manifest.json",
    "party-effects.js",
    "sw.js"
)

# Hedef dizinler
$targetDirs = @(
    "www",
    "android\app\src\main\assets\www"
)

foreach ($targetDir in $targetDirs) {
    if (Test-Path $targetDir) {
        Write-Host "📂 Senkronize ediliyor: $targetDir" -ForegroundColor Yellow
        
        foreach ($file in $filesToSync) {
            if (Test-Path $file) {
                Copy-Item $file -Destination "$targetDir\$file" -Force
                Write-Host "  ✅ $file → $targetDir" -ForegroundColor Green
            } else {
                Write-Host "  ❌ $file bulunamadı!" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "❌ Hedef dizin bulunamadı: $targetDir" -ForegroundColor Red
    }
}

# Sounds klasörü senkronizasyonu
if (Test-Path "sounds") {
    foreach ($targetDir in $targetDirs) {
        if (Test-Path $targetDir) {
            $targetSounds = "$targetDir\sounds"
            if (!(Test-Path $targetSounds)) {
                New-Item -ItemType Directory -Path $targetSounds -Force
            }
            Copy-Item "sounds\*" -Destination $targetSounds -Force -Recurse
            Write-Host "  🔊 sounds → $targetDir\sounds" -ForegroundColor Magenta
        }
    }
}

Write-Host "✨ Senkronizasyon tamamlandı!" -ForegroundColor Green
Write-Host "💡 Değişiklikleri test etmek için: http://localhost:8080" -ForegroundColor Cyan