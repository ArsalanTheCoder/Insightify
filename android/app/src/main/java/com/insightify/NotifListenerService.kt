package com.insightify

import android.app.Notification
import android.content.Context
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import org.json.JSONObject
import java.util.HashMap
import java.util.HashSet

class NotifListenerService : NotificationListenerService() {

    companion object {
        const val TAG = "SCAM_DEBUG"
        const val ACTION_NOTIFICATION = "NOTIFICATION_EVENT"   // <- ADDED constant
        const val PREFS = "scam_prefs"
        const val KEY_SEEN = "seen_ids"

        // ⏱ Cooldown: 60 seconds per sender
        const val COOLDOWN_MS = 60_000L
    }

    // Allowed apps
    private val allowedPackages = setOf(
        "com.whatsapp",
        "com.whatsapp.w4b",
        "com.google.android.apps.messaging",
        "com.android.mms",
        "com.google.android.gm"
    )

    // In-memory cooldown
    private val cooldownMap = HashMap<String, Long>()

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        try {
            if (sbn == null) return
            val pkg = sbn.packageName ?: return

            // App filter
            if (allowedPackages.none { pkg.contains(it, true) }) return

            val n: Notification = sbn.notification ?: return
            val extras = n.extras ?: return

            val rawTitle = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
            var text = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()
                ?: extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()

            if (text.isNullOrEmpty()) {
                val lines = extras.getCharSequenceArray(Notification.EXTRA_TEXT_LINES)
                if (!lines.isNullOrEmpty()) {
                    text = lines.joinToString(" ") { it.toString() }
                }
            }

            if (text.isNullOrEmpty()) {
                text = extras.getCharSequence(Notification.EXTRA_SUMMARY_TEXT)?.toString()
            }

            val title = rawTitle.trim()
            val cleanText = text?.trim() ?: ""

            if (title.isEmpty() && cleanText.isEmpty()) return

            // Ignore grouped summaries
            val lower = cleanText.lowercase()
            val isSummary = lower.contains("new messages") ||
                    lower.matches(Regex("\\d+ messages.*")) ||
                    title.lowercase() == "whatsapp"

            if (isSummary) {
                Log.d(TAG, "Ignored summary notification: title=$title text=$cleanText")
                return
            }

            // Stable ID
            val idSource = "$pkg|$title|$cleanText"
            val id = idSource.hashCode().toString()

            // Persistent dedupe
            val prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            val seen = prefs.getStringSet(KEY_SEEN, HashSet()) ?: HashSet()
            if (seen.contains(id)) {
                Log.d(TAG, "Already seen notification (id=$id), skipping")
                return
            }

            // Cooldown check
            val cooldownKey = "$pkg|$title"
            val now = System.currentTimeMillis()
            val last = cooldownMap[cooldownKey]
            if (last != null && now - last < COOLDOWN_MS) {
                Log.d(TAG, "Cooldown active for $cooldownKey, skipping")
                return
            }
            cooldownMap[cooldownKey] = now

            // Mark seen
            val updatedSeen = HashSet(seen)
            updatedSeen.add(id)
            prefs.edit().putStringSet(KEY_SEEN, updatedSeen).apply()

            val payload = JSONObject().apply {
                put("id", id)
                put("app", pkg)
                put("title", title)
                put("text", cleanText)
                put("timestamp", now)
            }

            Log.d(TAG, "Captured notification → $payload")

            // Local keyword filter
            if (!ScamFilter.shouldSendToBackend(title, cleanText)) {
                Log.d(TAG, "Local filter blocked message (id=$id)")
                return
            }

            // Enqueue worker (backend scoring)
            val data = Data.Builder()
                .putString("payload", payload.toString())
                .build()

            val work = OneTimeWorkRequestBuilder<NotificationScoreWorker>()
                .setInputData(data)
                .build()

            WorkManager.getInstance(applicationContext).enqueue(work)
            Log.d(TAG, "Worker enqueued for $id")

        } catch (e: Exception) {
            Log.e(TAG, "onNotificationPosted error", e)
        }
    }
}