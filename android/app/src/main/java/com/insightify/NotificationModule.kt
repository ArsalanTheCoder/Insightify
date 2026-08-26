package com.insightify

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG = "SCAM_DEBUG"
        const val EVENT_NAME = "NotificationReceived"

        // Single, unique action used by worker, notifier, listener, and MainActivity
        const val ACTION_NOTIFICATION = "com.insightify.ACTION_NOTIFICATION"

        const val PREFS = "scam_prefs"
        const val KEY_LAUNCH_PAYLOAD = "launch_payload"
    }

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            try {
                val payload = intent?.getStringExtra("payload") ?: return
                Log.d(TAG, "📥 RN received payload: $payload")

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(EVENT_NAME, payload)

            } catch (e: Exception) {
                Log.e(TAG, "Receiver error", e)
            }
        }
    }

    init {
        try {
            val filter = IntentFilter(ACTION_NOTIFICATION)
            reactContext.registerReceiver(receiver, filter)
            Log.d(TAG, "✅ NotificationModule receiver registered for $ACTION_NOTIFICATION")
        } catch (e: Exception) {
            Log.e(TAG, "❌ registerReceiver failed", e)
        }
    }

    override fun getName(): String = "NotificationModule"

    @ReactMethod
    fun addListener(eventName: String) {
        // Required empty for RN DeviceEventEmitter compatibility
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required empty for RN DeviceEventEmitter compatibility
    }

    @ReactMethod
    fun openNotificationSettings() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
    }

    /**
     * Called by JS on startup to check if we have a persisted launch payload
     * (MainActivity or ScamNotifier stores it under PREFS/KEY_LAUNCH_PAYLOAD).
     * Returns the JSON string or null.
     */
    @ReactMethod
    fun getLaunchPayload(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            val payload = prefs.getString(KEY_LAUNCH_PAYLOAD, null)

            if (payload != null) {
                Log.d(TAG, "🚀 Launch payload delivered to RN")
                prefs.edit().remove(KEY_LAUNCH_PAYLOAD).apply()
                promise.resolve(payload)
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            Log.e(TAG, "getLaunchPayload error", e)
            promise.reject("ERR", e.message)
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            reactContext.unregisterReceiver(receiver)
            Log.d(TAG, "🧹 NotificationModule receiver unregistered")
        } catch (e: Exception) {
            Log.e(TAG, "❌ unregisterReceiver failed or already unregistered", e)
        }
    }
}