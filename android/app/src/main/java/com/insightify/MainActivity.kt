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
    private const val TAG = "MainActivity"
    private const val PREFS = "InsightifyPrefs"
    private const val KEY_LAUNCH_PAYLOAD = "launch_payload"
  }

  // Name registered in index.js
  override fun getMainComponentName(): String = "Insightify"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // 🔔 Handle app launch from notification
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleLaunchIntent(intent)
  }

  // 🔁 Handle new intent when app already running
  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    handleLaunchIntent(intent)
  }

  /**
   * Reads payload from notification intent and rebroadcasts
   * so React Native can pick it up even if JS isn't ready yet.
   */
  private fun handleLaunchIntent(intent: Intent?) {
    try {
      val payload = intent?.getStringExtra("payload")
      if (!payload.isNullOrEmpty()) {
        Log.d(TAG, "App launched from notification. Payload: $payload")

        // Store in SharedPreferences as fallback
        val prefs = applicationContext.getSharedPreferences(PREFS, MODE_PRIVATE)
        prefs.edit().putString(KEY_LAUNCH_PAYLOAD, payload).apply()

        // Rebroadcast for NotificationModule / AccessibilityModule
        val broadcast = Intent(NotificationModule.ACTION_NOTIFICATION)
        broadcast.putExtra("payload", payload)
        sendBroadcast(broadcast)
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error handling launch payload", e)
    }
  }
}