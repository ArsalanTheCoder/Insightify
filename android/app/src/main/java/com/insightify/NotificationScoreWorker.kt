package com.insightify

import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject

class NotificationScoreWorker(
    private val ctx: Context,
    params: WorkerParameters
) : Worker(ctx, params) {

    companion object {
        private const val TAG = "SCAM_DEBUG"
        // Replace local IP with deployed URL (HTTPS)
        private const val BACKEND_URL = "https://scam-backend-production.up.railway.app/api/v1/score"
    }


    override fun doWork(): Result {
        return try {
            val payloadStr = inputData.getString("payload") ?: return Result.success()
            val payload = JSONObject(payloadStr)

            // Wrap payload as backend expects
            val reqBody = JSONObject().apply {
                put("items", JSONArray().put(payload))
            }

            val client = OkHttpClient()
            val request = Request.Builder()
                .url(BACKEND_URL)
                .post(reqBody.toString().toRequestBody("application/json".toMediaType()))
                .build()

            val response = client.newCall(request).execute()
            if (!response.isSuccessful) {
                Log.e(TAG, "Backend call failed: ${response.code}")
                return Result.retry()
            }

            val bodyStr = response.body?.string() ?: return Result.success()
            val arr = JSONArray(bodyStr)
            if (arr.length() == 0) return Result.success()

            val result = arr.getJSONObject(0)

            val score = result.optDouble("score", 0.0)
            val reason = result.optString("reason", "")

            // 🔥 Severity decision
            val severity = when {
                score >= 0.70 -> Severity.DANGEROUS
                score >= 0.40 -> Severity.SUSPICIOUS
                else -> Severity.SAFE
            }

            // Attach AI result so RN & notifier can use it
            payload.put("score", score)
            payload.put("severity", severity.name)
            payload.put("reason", reason)

            Log.d(TAG, "AI result → score=$score severity=$severity")

            when (severity) {
                Severity.SAFE -> {
                    Log.d(TAG, "SAFE → ignoring")
                }

                Severity.SUSPICIOUS -> {
                    // App UI only
                    broadcastToReactNative(payload)
                    Log.d(TAG, "SUSPICIOUS → sent to app UI")
                }

                Severity.DANGEROUS -> {
                    // 🔔 System alert + app UI
                    ScamNotifier.showAlertNotification(ctx, payload)
                    broadcastToReactNative(payload)
                    Log.d(TAG, "DANGEROUS → system alert + UI")
                }
            }

            Result.success()

        } catch (e: Exception) {
            Log.e(TAG, "Worker error", e)
            Result.failure()
        }
    }

    private fun broadcastToReactNative(payload: JSONObject) {
        // Use unified action so NotificationModule receives it
        val intent = Intent(NotificationModule.ACTION_NOTIFICATION)
        intent.putExtra("payload", payload.toString())
        ctx.sendBroadcast(intent)
    }
}

/**
 * Severity enum
 */
enum class Severity {
    SAFE,
    SUSPICIOUS,
    DANGEROUS
}