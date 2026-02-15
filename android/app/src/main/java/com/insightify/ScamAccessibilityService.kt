package com.insightify

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.facebook.react.bridge.Arguments
import org.json.JSONObject
import java.util.regex.Pattern

class ScamAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "SCAM_DEBUG"

        // 2-minute dedup — prevents same message from being shown again
        private const val DEDUPE_TIME_MS = 120_000L

        // Max seen messages before trimming
        private const val MAX_SEEN_SIZE = 300

        // Minimum text length to analyze (filters out labels/buttons)
        private const val MIN_TEXT_LENGTH = 15

        // Max depth for node traversal (prevents deep recursion)
        private const val MAX_NODE_DEPTH = 5

        // Throttle: minimum ms between processed events
        private const val THROTTLE_MS = 1000L

        // Packages to NEVER read from
        private val IGNORED_PACKAGES = setOf(
            "com.insightify",
            "com.android.systemui",
            "com.google.android.inputmethod.latin",
            "com.samsung.android.keyboard",
            "com.google.android.apps.nexuslauncher",
            "com.sec.android.app.launcher",
            "com.android.vending",
            "com.google.android.gms",
            "com.android.settings"
        )

        // Common UI noise strings (lowercase exact match)
        private val NOISE_EXACT = setOf(
            "whatsapp", "telegram", "messages", "instagram",
            "chats", "status", "calls", "communities", "updates",
            "camera", "search", "new chat", "more options",
            "type a message", "type a message...", "message",
            "reply", "mark as read", "delete", "mute", "archive",
            "send", "clear all", "message detected", "online",
            "settings", "home", "back", "groups", "contacts",
            "emoji", "gif", "stickers", "attach", "voice message",
            "video call", "voice call", "new group", "select all",
            "forward", "copy", "share", "info", "view contact",
            "start chat", "end-to-end encrypted", "disappearing messages",
            "group info", "muted", "new messages", "tap for more info",
            "messages are end-to-end encrypted"
        )

        // Noise patterns (contains match)
        private val NOISE_CONTAINS = listOf(
            "typing...", "last seen", "unread message", "new message",
            "backup", "connected to", "downloading", "uploading",
            "missed call", "security code", "waiting for this message"
        )

        // Shortened URLs
        private val SHORT_URL_PATTERN: Pattern = Pattern.compile(
            "(bit\\.ly|tinyurl\\.com|t\\.co|goo\\.gl|is\\.gd|rb\\.gy|shorturl\\.at|cutt\\.ly|ow\\.ly)/\\S+"
        )
    }

    // Permanent dedup: hash -> timestamp
    private val seenMessages = LinkedHashMap<Int, Long>(MAX_SEEN_SIZE, 0.75f, true)

    // Throttle timestamp
    private var lastProcessedTime = 0L

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val packageName = event.packageName?.toString() ?: return
        if (IGNORED_PACKAGES.contains(packageName)) return

        val now = System.currentTimeMillis()

        when (event.eventType) {
            AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED -> {
                // Always process notifications (they contain sender info)
                val notifText = event.text?.filterNotNull()
                    ?.filter { it.isNotBlank() }
                    ?.joinToString(" ")?.trim() ?: ""

                if (notifText.length >= MIN_TEXT_LENGTH) {
                    processMessage(notifText, packageName, "NOTIFICATION")
                }

                // Also try to read the notification content via source node
                try {
                    val source = event.source
                    if (source != null) {
                        val extracted = extractTextsFromNode(source, 0)
                        source.recycle()
                        for (text in extracted) {
                            processMessage(text, packageName, "NOTIF_CONTENT")
                        }
                    }
                } catch (e: Exception) {
                    // source might not be available
                }
            }

            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> {
                // Throttle screen content events (these fire A LOT)
                if (now - lastProcessedTime < THROTTLE_MS) return
                lastProcessedTime = now

                // Read the event's direct text first
                val directText = event.text?.filterNotNull()
                    ?.filter { it.isNotBlank() && it.length >= MIN_TEXT_LENGTH }
                    ?.joinToString(" ")?.trim() ?: ""

                if (directText.length >= MIN_TEXT_LENGTH && !isNoise(directText)) {
                    processMessage(directText, packageName, "SCREEN_TEXT")
                }

                // Then try the source node (controlled, depth-limited traversal)
                try {
                    val source = event.source
                    if (source != null) {
                        val extracted = extractTextsFromNode(source, 0)
                        source.recycle()
                        for (text in extracted) {
                            processMessage(text, packageName, "SCREEN_NODE")
                        }
                    }
                } catch (e: Exception) {
                    // source might be null or stale
                }
            }
        }
    }

    /**
     * Extract meaningful text from accessibility nodes with STRICT limits:
     * - Max depth = 5 (no deep recursion)
     * - Max results = 3 per event (prevents flooding)
     * - Min length = 15 chars (filters buttons/labels)
     * - Noise filter (skips UI chrome)
     */
    private fun extractTextsFromNode(node: AccessibilityNodeInfo, depth: Int): List<String> {
        val results = mutableListOf<String>()

        if (depth > MAX_NODE_DEPTH) return results
        if (results.size >= 3) return results

        // Read this node's text
        val text = node.text?.toString()?.trim()
        if (text != null && text.length >= MIN_TEXT_LENGTH && !isNoise(text)) {
            results.add(text)
        }

        // Recurse into children (limited)
        val childCount = node.childCount
        for (i in 0 until childCount) {
            if (results.size >= 3) break
            val child = try { node.getChild(i) } catch (e: Exception) { null }
            if (child != null) {
                try {
                    results.addAll(extractTextsFromNode(child, depth + 1))
                } finally {
                    child.recycle()
                }
            }
        }

        return results
    }

    /**
     * Main processing pipeline with strict dedup
     */
    private fun processMessage(text: String, packageName: String, source: String) {
        if (text.length < MIN_TEXT_LENGTH) return
        if (isNoise(text)) return

        // --- STRICT DEDUP ---
        val hash = text.trim().lowercase().hashCode()
        val now = System.currentTimeMillis()
        synchronized(seenMessages) {
            val lastSeen = seenMessages[hash]
            if (lastSeen != null && (now - lastSeen) < DEDUPE_TIME_MS) {
                return // Already processed
            }
            seenMessages[hash] = now

            // Trim old entries
            if (seenMessages.size > MAX_SEEN_SIZE) {
                val iter = seenMessages.entries.iterator()
                while (seenMessages.size > MAX_SEEN_SIZE / 2 && iter.hasNext()) {
                    iter.next()
                    iter.remove()
                }
            }
        }

        // --- LAYER 1: Local heuristic scoring ---
        val localScore = ScamFilter.computeLocalScore("", text)
        val hasShortUrl = SHORT_URL_PATTERN.matcher(text).find()

        var adjustedScore = localScore
        if (hasShortUrl) adjustedScore += 2

        val appLabel = getAppLabel(packageName)
        Log.d(TAG, "🔍 [$source] app=$appLabel score=$adjustedScore text=\"${text.take(80)}\"")

        // Score < 2 → SAFE
        if (adjustedScore < 2) {
            Log.d(TAG, "✅ SAFE (score=$adjustedScore)")
            return
        }

        Log.d(TAG, "⚠️ SUSPICIOUS (score=$adjustedScore) — processing...")

        // Send to React Native
        try {
            val params = Arguments.createMap().apply {
                putString("message", text)
                putString("source", source)
                putString("app", packageName)
                putInt("localScore", adjustedScore)
                putBoolean("hasLink", hasShortUrl)
                putDouble("timestamp", now.toDouble())
            }
            AccessibilityModule.sendPayload(AccessibilityModule.EVENT_NAME, params)
        } catch (e: Exception) {
            Log.e(TAG, "sendPayload error", e)
        }

        // Score >= 2 → show system notification (visible over any app)
        if (adjustedScore >= 2) {
            showSystemAlert(text, packageName, adjustedScore, now)
        }

        // Score >= 2 → send to backend AI
        sendToBackend(text, packageName, now)
    }

    private fun showSystemAlert(text: String, packageName: String, score: Int, timestamp: Long) {
        try {
            val appLabel = getAppLabel(packageName)
            val id = text.hashCode().toString()

            val payload = JSONObject().apply {
                put("id", id)
                put("app", packageName)
                put("title", "$appLabel Message")
                put("text", text)
                put("score", score.toDouble() / 5.0)
                put("timestamp", timestamp)
                put("source", "accessibility")
            }

            ScamNotifier.showAlertNotification(applicationContext, payload)
            Log.d(TAG, "🚨 SYSTEM NOTIFICATION shown for: ${text.take(60)}")
        } catch (e: Exception) {
            Log.e(TAG, "showSystemAlert error", e)
        }
    }

    private fun sendToBackend(text: String, packageName: String, timestamp: Long) {
        try {
            val appLabel = getAppLabel(packageName)
            val id = text.hashCode().toString()

            val payload = JSONObject().apply {
                put("id", id)
                put("app", packageName)
                put("title", "$appLabel (Accessibility)")
                put("text", text)
                put("timestamp", timestamp)
                put("source", "accessibility")
            }

            val data = Data.Builder()
                .putString("payload", payload.toString())
                .build()

            val work = OneTimeWorkRequestBuilder<NotificationScoreWorker>()
                .setInputData(data)
                .build()

            WorkManager.getInstance(applicationContext).enqueue(work)
            Log.d(TAG, "🚀 Backend AI queued")
        } catch (e: Exception) {
            Log.e(TAG, "sendToBackend error", e)
        }
    }

    private fun isNoise(text: String): Boolean {
        val lower = text.lowercase().trim()
        if (lower.length < MIN_TEXT_LENGTH) return true
        if (NOISE_EXACT.contains(lower)) return true
        if (NOISE_CONTAINS.any { lower.contains(it) }) return true
        if (lower.matches(Regex("\\d{1,2}:\\d{2}(\\s?[ap]m)?"))) return true
        if (lower.matches(Regex("\\d{1,2}/\\d{1,2}/\\d{2,4}"))) return true
        if (lower.matches(Regex("today|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday"))) return true
        if (lower.matches(Regex("\\d+ new messages?"))) return true
        return false
    }

    private fun getAppLabel(packageName: String): String {
        return when {
            packageName.contains("whatsapp") -> "WhatsApp"
            packageName.contains("telegram") -> "Telegram"
            packageName.contains("instagram") -> "Instagram"
            packageName.contains("messaging") || packageName.contains("mms") -> "SMS"
            else -> "Message"
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted")
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "✅ ScamAccessibilityService CONNECTED — monitoring notifications + screen content")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "ScamAccessibilityService destroyed")
        seenMessages.clear()
    }
}
