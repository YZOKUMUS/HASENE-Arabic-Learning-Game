package com.hasene.arabiclearning.v6;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;
import android.os.Build;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // WebView cache temizle ve debug aktif et
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Tam ekran immersive mode ayarları
        enableFullScreen();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Resume'da da tam ekran modunu aktif et
        enableFullScreen();
    }
    
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            enableFullScreen();
        }
    }
    
    private void enableFullScreen() {
        View decorView = getWindow().getDecorView();
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // API 19+ için sticky immersive mode
            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            decorView.setSystemUiVisibility(uiOptions);
        } else {
            // Eski API'ler için
            getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                               WindowManager.LayoutParams.FLAG_FULLSCREEN);
        }
        
        // Her açılışta cache temizle
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().clearCache(true);
        }
    }
}