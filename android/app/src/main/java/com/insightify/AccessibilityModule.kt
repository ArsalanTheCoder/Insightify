package com.insightify

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class AccessibilityModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG = "SCAM_DEBUG"
        const val NAME = "AccessibilityModule"
        const val EVENT_NAME = "AccessibilityEvent"

        @Volatile
        private var reactCtx: ReactApplicationContext? = null

        /**
         * Called from ScamAccessibilityService to emit events to JS.
         * Sends message data to React Native.
         */
        @JvmStatic
        fun sendEvent(eventName: String, message: String) {
            val ctx = reactCtx ?: return
            try {
                val params: WritableMap = Arguments.createMap()
                params.putString("message", message)
                ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, params)
                Log.d(TAG, "📤 Accessibility event sent to RN: ${message.take(80)}")
            } catch (e: Exception) {
                Log.e(TAG, "sendEvent error", e)
            }
        }

        /**
         * Send a structured payload (with score, source, etc.) to RN.
         */
        @JvmStatic
        fun sendPayload(eventName: String, payload: WritableMap) {
            val ctx = reactCtx ?: return
            try {
                ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, payload)
                Log.d(TAG, "📤 Accessibility payload sent to RN")
            } catch (e: Exception) {
                Log.e(TAG, "sendPayload error", e)
            }
        }
    }

    init {
        reactCtx = reactContext
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN DeviceEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN DeviceEventEmitter
    }

    /**
     * Open Android Accessibility Settings so user can enable Insightify service.
     */
    @ReactMethod
    fun openAccessibilitySettings() {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "openAccessibilitySettings error", e)
        }
    }

    /**
     * Check if our accessibility service is currently enabled.
     */
    @ReactMethod
    fun isAccessibilityEnabled(promise: Promise) {
        try {
            val enabledServices = Settings.Secure.getString(
                reactContext.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            ) ?: ""
            val isEnabled = enabledServices.contains(
                "${reactContext.packageName}/.ScamAccessibilityService",
                ignoreCase = true
            )
            promise.resolve(isEnabled)
        } catch (e: Exception) {
            Log.e(TAG, "isAccessibilityEnabled error", e)
            promise.resolve(false)
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        reactCtx = null
    }
}
