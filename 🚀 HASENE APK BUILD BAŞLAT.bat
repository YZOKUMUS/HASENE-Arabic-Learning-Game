@echo off
echo 🚀 HASENE APK Build - Hızlı Başlatma
echo.
echo Bu script şunları yapacak:
echo - HASENE proje klasörünü açar
echo - VS Code'u başlatır  
echo - Terminal'i hazırlar
echo.
pause
echo.
echo 📁 Proje klasörü açılıyor...
start "" "%~dp0"
echo.
echo 💻 VS Code başlatılıyor...
code "%~dp0"
echo.
echo 🎯 APK Build için hazır komutlar:
echo - npm run build-apk-simple   (Test için)
echo - npm run build-apk          (Günlük)
echo - npm run help               (Yardım)
echo.
echo 📖 Kılavuz: QUICK-APK-GUIDE.md dosyasına bakın
echo.
pause