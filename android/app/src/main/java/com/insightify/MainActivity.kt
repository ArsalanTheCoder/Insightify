package com.insightify

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  companion object {
    private const val TAG = "SCAM_DEBUG"
    private const val PREFS = "scam_prefs"
    private const val KEY_LAUNCH_PAYLOAD = "launch_payload"
  }

  override fun getMainComponentName(): String = "Insightify"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleLaunchIntent(intent)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    handleLaunchIntent(intent)
  }

  private fun handleLaunchIntent(intent: Intent?) {
    try {
      val payload = intent?.getStringExtra("payload")
      if (!payload.isNullOrEmpty()) {
        Log.d(TAG, "App launched from notification. Rebroadcasting payload to RN: $payload")

        // store it to SharedPreferences in case RN not ready
        val prefs = applicationContext.getSharedPreferences(PREFS, MODE_PRIVATE)
        prefs.edit().putString(KEY_LAUNCH_PAYLOAD, payload).apply()

        // rebroadcast so native receiver (NotificationModule) can pick it up immediately
        val b = Intent(NotificationModule.ACTION_NOTIFICATION)
        b.putExtra("payload", payload)
        sendBroadcast(b)
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error handling launch payload", e)
    }
  }
}
