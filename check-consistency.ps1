# 🔍 HASENE Kod Tutarlılık Kontrol Scripti
# Farklı dosyalardaki aynı fonksiyonları karşılaştırır

Write-Host "🔍 Kod Tutarlılık Kontrolü Başlatılıyor..." -ForegroundColor Cyan

$mainScript = "script.js"
$wwwScript = "www\script.js"

if (!(Test-Path $mainScript) -or !(Test-Path $wwwScript)) {
    Write-Host "❌ Dosyalar bulunamadı!" -ForegroundColor Red
    exit
}

# Dosya boyutlarını karşılaştır
$mainSize = (Get-Item $mainScript).Length
$wwwSize = (Get-Item $wwwScript).Length

Write-Host "📏 Dosya Boyutları:" -ForegroundColor Yellow
Write-Host "  Ana script.js: $mainSize bytes" -ForegroundColor White
Write-Host "  www/script.js: $wwwSize bytes" -ForegroundColor White

if ($mainSize -eq $wwwSize) {
    Write-Host "✅ Dosya boyutları eşleşiyor" -ForegroundColor Green
} else {
    Write-Host "⚠️ Dosya boyutları farklı! Senkronizasyon gerekli" -ForegroundColor Red
}

# Kritik fonksiyonları kontrol et
$criticalFunctions = @(
    "calculateTotalHaseneFromDaily",
    "storeDailyHasene", 
    "updateGameStats",
    "showStats",
    "earnedHasene"
)

Write-Host "`n🔎 Kritik Fonksiyon Kontrolü:" -ForegroundColor Yellow

$mainContent = Get-Content $mainScript -Raw
$wwwContent = Get-Content $wwwScript -Raw

foreach ($func in $criticalFunctions) {
    $mainHas = $mainContent -match $func
    $wwwHas = $wwwContent -match $func
    
    if ($mainHas -and $wwwHas) {
        Write-Host "  ✅ ${func}: Her iki dosyada da mevcut" -ForegroundColor Green
    } elseif ($mainHas -and !$wwwHas) {
        Write-Host "  ❌ ${func}: Sadece ana dosyada var!" -ForegroundColor Red
    } elseif (!$mainHas -and $wwwHas) {
        Write-Host "  ❌ ${func}: Sadece www dosyasında var!" -ForegroundColor Red
    } else {
        Write-Host "  ⚠️ ${func}: Her iki dosyada da yok!" -ForegroundColor Yellow
    }
}

Write-Host "`n💡 Tavsiye: Farklılık varsa 'sync-files.ps1' scriptini çalıştır" -ForegroundColor Cyan