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

    static String appId = "342585285818702";
    static String appSecret = "8552d94ef0a37a6adc9e995cf48efc0e";
    static String siteUrl = "http://10.0.2.2:3000/api/v1/users";

    //private ProgressDialog progressDialog;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		//progressDialog = new ProgressDialog(this);
		//progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
		//progressDialog.setMessage("Loading ...");
		//progressDialog.show();
		
		WebView webView = new WebView(this);
		webView.setWebViewClient(new WebViewClient() {

			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);
				Log.i(getClass().getName(), "Finished page: " + url);

				if (url != null && url.contains(siteUrl + "?code=")) {

					//if (progressDialog != null) {
					//	progressDialog.dismiss();
					//	progressDialog = null;
					//}

					Intent intent = getIntent();
					//String validationCode = url.split("\\?code=")[1];
					//intent.putExtra("validationCode", validationCode);
					setResult(Activity.RESULT_OK, intent);
					finish();
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
						ViewGroup.LayoutParams.FILL_PARENT)
		);
		webView.loadUrl(
				"https://graph.facebook.com/oauth/authorize?client_id=" + appId +
				"&redirect_uri=" + siteUrl + 
				"&scope=manage_pages,publish_stream,offline_access"
		);
	}
}
