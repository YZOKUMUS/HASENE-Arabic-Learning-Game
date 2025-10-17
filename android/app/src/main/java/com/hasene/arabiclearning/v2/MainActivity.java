package com.hasene.arabiclearning.v2;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // WebView cache temizle ve debug aktif et
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Status bar'ı tamamen gizle (fullscreen mode)
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, 
                           WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        // System UI'ı gizle
        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);
    }
    
    @Override
    public void onResume() {
        super.onResume();
        // Her açılışta cache temizle
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().clearCache(true);
        }
    }
}
