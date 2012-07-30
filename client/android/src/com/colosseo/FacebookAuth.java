package com.colosseo;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class FacebookAuth extends Activity {

	private static String authSiteUrl = "http://10.0.2.2:3000/auths/mobile";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		WebView webView = new WebView(this);
		webView.setWebViewClient(new WebViewClient() {
			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);
				Log.i(getClass().getName(), "Finished page: " + url);

				// FIXME: Should contain full url.
				if (url != null && url.contains("?colosseo=login")) {
					Log.i(getClass().getName(), "Succeeded to login");
					Intent intent = getIntent();
					setResult(Activity.RESULT_OK, intent);
					finish(); // NOTE: close this Activity.
				}
			}

			@Override
			public void onPageStarted(WebView view, String url, Bitmap favicon) {
				super.onPageStarted(view, url, favicon);
				Log.i(getClass().getName(), "Started page: " + url);
			}
		});

		setContentView(webView,
				new LayoutParams(
						ViewGroup.LayoutParams.WRAP_CONTENT,
						ViewGroup.LayoutParams.WRAP_CONTENT)
				);
		// load an authentication page for colosseo.
		webView.loadUrl(authSiteUrl);
	}
}
