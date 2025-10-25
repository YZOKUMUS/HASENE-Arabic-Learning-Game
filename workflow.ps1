# 🚀 HASENE Geliştirme Workflow Scripti
# Değişiklik → Senkronizasyon → Test → Git → APK

param(
    [string]$commitMessage = "Code updates and synchronization",
    [switch]$skipBuild,
    [switch]$skipGit
)

Write-Host "🚀 HASENE Geliştirme Workflow Başlatılıyor..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# 1. Tutarlılık Kontrolü
Write-Host "`n🔍 Adım 1: Kod Tutarlılık Kontrolü" -ForegroundColor Yellow
& .\check-consistency.ps1

# 2. Dosya Senkronizasyonu
Write-Host "`n🔄 Adım 2: Dosya Senkronizasyonu" -ForegroundColor Yellow
& .\sync-files.ps1

# 3. Git işlemleri (opsiyonel)
if (!$skipGit) {
    Write-Host "`n📝 Adım 3: Git Commit & Push" -ForegroundColor Yellow
    
    git add .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Dosyalar stage'e eklendi" -ForegroundColor Green
        
        git commit -m $commitMessage
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Commit oluşturuldu: $commitMessage" -ForegroundColor Green
            
            git push
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ GitHub'a push yapıldı" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Push hatası!" -ForegroundColor Red
            }
        } else {
            Write-Host "  ❌ Commit hatası!" -ForegroundColor Red
        }
    } else {
        Write-Host "  ❌ Git add hatası!" -ForegroundColor Red
    }
} else {
    Write-Host "`n⏭️ Adım 3: Git işlemleri atlandı" -ForegroundColor Gray
}

# 4. APK Build (opsiyonel)
if (!$skipBuild) {
    Write-Host "`n📱 Adım 4: Android APK Build" -ForegroundColor Yellow
    
    if (Test-Path "android") {
        Set-Location android
        
        Write-Host "  🔨 Gradle build başlatılıyor..." -ForegroundColor Cyan
        .\gradlew assembleDebug
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ APK build başarılı!" -ForegroundColor Green
            $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
            if (Test-Path $apkPath) {
                Write-Host "  📱 APK konumu: android\$apkPath" -ForegroundColor Cyan
            }
        } else {
            Write-Host "  ❌ APK build hatası!" -ForegroundColor Red
        }
        
        Set-Location ..
    } else {
        Write-Host "  ❌ Android klasörü bulunamadı!" -ForegroundColor Red
    }
} else {
    Write-Host "`n⏭️ Adım 4: APK build atlandı" -ForegroundColor Gray
}

# 5. Test URL'si
Write-Host "`n🌐 Adım 5: Test Bilgileri" -ForegroundColor Yellow
Write-Host "  🖥️ Live Server: http://localhost:8080" -ForegroundColor Cyan
Write-Host "  🔗 GitHub Pages: https://yzokumus.github.io/HASENE-Arabic-Learning-Game/" -ForegroundColor Cyan

Write-Host "`n✨ Workflow tamamlandı!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Kullanım örnekleri
Write-Host "`n💡 Kullanım Örnekleri:" -ForegroundColor Cyan
Write-Host "  .\workflow.ps1                                    # Tam workflow" -ForegroundColor White
Write-Host "  .\workflow.ps1 -commitMessage 'Hasene bug fix'    # Özel commit mesajı" -ForegroundColor White
Write-Host "  .\workflow.ps1 -skipBuild                         # APK build'siz" -ForegroundColor White
Write-Host "  .\workflow.ps1 -skipGit -skipBuild                # Sadece senkronizasyon" -ForegroundColor White