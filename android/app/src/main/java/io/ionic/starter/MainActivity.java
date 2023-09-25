package io.ionic.starter;

import android.os.Bundle; // required for onCreate parameter

import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.community.speechrecognition.SpeechRecognition;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        // Social
        registerPlugin(com.getcapacitor.community.facebooklogin.FacebookLogin.class);
        registerPlugin(GoogleAuth.class);
        // Speech Recognition
        registerPlugin(SpeechRecognition.class);
    }
}
