package com.colosseo;

import org.apache.cordova.DroidGap;

import android.content.Intent;
import android.os.Bundle;

public class Main extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		
        startActivityForResult(new Intent(this, FacebookAuth.class), 0);
        //super.loadUrl("file:///android_asset/www/index.html");
    }
    
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		if (intent == null) 
			return;
		
		super.loadUrl("file:///android_asset/www/index.html");
	}
}

