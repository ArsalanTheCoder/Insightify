package com.insightify

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import org.json.JSONObject

object ScamNotifier {

    private const val TAG = "SCAM_DEBUG"
    private const val CHANNEL_ID = "scam_alerts"
    private const val CHANNEL_NAME = "Scam Alerts"

    /**
     * Show a high-priority heads-up notification for scam messages.
     * On Android 8+, uses IMPORTANCE_HIGH which shows as a heads-up
     * banner at the top of the screen over ANY app.
     */
    fun showAlertNotification(
        context: Context,
        payload: JSONObject
    ) {
        try {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Create / update notification channel (Android 8+)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH  // Enables heads-up popup
                ).apply {
                    description = "Alerts for suspected scam messages"
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 300, 200, 300) // Double vibrate
                    setSound(
                        alarmSound,
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_NOTIFICATION_EVENT)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
                    )
                    lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
                    setShowBadge(true)
                }
                nm.createNotificationChannel(channel)
            }

            val title = payload.optString("title", "Unknown")
            val text = payload.optString("text", "")
            val score = payload.optDouble("score", 0.0)
            val scorePercent = (score * 100).toInt().coerceIn(0, 100)

            val shortText =
                if (text.length > 120) text.substring(0, 120) + "…" else text

            // Risk level label
            val riskLabel = when {
                scorePercent >= 70 -> "🔴 HIGH RISK"
                scorePercent >= 40 -> "🟠 MEDIUM RISK"
                else -> "🟡 WARNING"
            }

            // Persist payload for cold-start handling
            val prefs = context.getSharedPreferences(NotificationModule.PREFS, Context.MODE_PRIVATE)
            prefs.edit().putString(NotificationModule.KEY_LAUNCH_PAYLOAD, payload.toString()).apply()

            // Launch intent — opens Insightify with the scam message
            val launchIntent =
                context.packageManager.getLaunchIntentForPackage(context.packageName)
            launchIntent?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                putExtra("payload", payload.toString())
                action = NotificationModule.ACTION_NOTIFICATION
            }

            val requestCode = payload.optString("id").hashCode()
            val pendingFlags =
                PendingIntent.FLAG_UPDATE_CURRENT or
                        (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                            PendingIntent.FLAG_IMMUTABLE else 0)

            val pi = PendingIntent.getActivity(
                context,
                requestCode,
                launchIntent,
                pendingFlags
            )

            // Build the notification — HEADS-UP style (appears over other apps)
            val notif = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("⚠️ Scam Detected — $riskLabel")
                .setContentText("$title: $shortText")
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .setBigContentTitle("🚨 Scam Alert — $riskLabel")
                        .bigText("$text\n\n$riskLabel • Risk Score: ${scorePercent}%\n\nTap to analyze in Insightify")
                )
                .setPriority(NotificationCompat.PRIORITY_MAX) // MAX = always heads-up
                .setCategory(NotificationCompat.CATEGORY_ALARM) // Alarm category = highest visibility
                .setDefaults(NotificationCompat.DEFAULT_ALL) // Sound + vibrate + lights
                .setVibrate(longArrayOf(0, 300, 200, 300))
                .setContentIntent(pi)
                .setFullScreenIntent(pi, true) // Full-screen intent = shows as popup over any app
                .setAutoCancel(true)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC) // Show on lock screen
                .setColor(0xFFFF1744.toInt()) // Red accent color
                .build()

            val notifId = payload.optString("id").hashCode()
            nm.notify(notifId, notif)

            Log.d(TAG, "🚨 Scam alert notification shown (id=${payload.optString("id")})")

            // Also broadcast so RN in foreground receives it immediately
            val broadcast = Intent(NotificationModule.ACTION_NOTIFICATION)
            broadcast.putExtra("payload", payload.toString())
            context.sendBroadcast(broadcast)

        } catch (e: Exception) {
            Log.e(TAG, "showAlertNotification failed", e)
        }
    }
}
