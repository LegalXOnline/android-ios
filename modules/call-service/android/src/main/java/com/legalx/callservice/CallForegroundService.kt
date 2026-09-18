package com.legalx.callservice

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat

/**
 * Holds microphone and camera access open for the duration of a consultation.
 *
 * Since Android 14 those are "while-in-use" permissions: the moment the app
 * stops being the foreground app the system revokes capture, and Agora carries
 * on publishing an empty track. The other side sees a frozen frame and hears
 * silence, with no error anywhere — which is indistinguishable from a dropped
 * call. A foreground service of type microphone|camera is the only thing that
 * keeps the grant, so the call survives the client checking a document or
 * taking a note mid-consultation.
 */
class CallForegroundService : Service() {

  companion object {
    const val EXTRA_VIDEO = "video"
    private const val CHANNEL_ID = "consultation_ongoing"
    private const val NOTIFICATION_ID = 8261
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val video = intent?.getBooleanExtra(EXTRA_VIDEO, false) ?: false
    ensureChannel()

    // Declared types must be a subset of the manifest's, and camera must not be
    // claimed for a voice call: asking for a capability the call does not use is
    // grounds for rejection on the Play Store.
    var types = ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
    if (video) types = types or ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA

    ServiceCompat.startForeground(this, NOTIFICATION_ID, buildNotification(video), types)
    return START_NOT_STICKY
  }

  /**
   * Low importance on purpose. This notification exists because Android
   * requires a foreground service to be visible, not because the user needs
   * telling — they are on the call. A higher importance would buzz mid-sentence.
   */
  private fun ensureChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (manager.getNotificationChannel(CHANNEL_ID) != null) return

    val channel = NotificationChannel(
      CHANNEL_ID,
      "Ongoing consultation",
      NotificationManager.IMPORTANCE_LOW,
    ).apply {
      description = "Shown while a voice or video consultation is running."
      setShowBadge(false)
      setSound(null, null)
      enableVibration(false)
    }
    manager.createNotificationChannel(channel)
  }

  private fun buildNotification(video: Boolean): Notification {
    // Tapping it returns to the call rather than opening a second copy of the
    // app on top of the one already in it.
    val launch = packageManager.getLaunchIntentForPackage(packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
    }
    val pending = launch?.let {
      PendingIntent.getActivity(
        this,
        0,
        it,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
      )
    }

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle(if (video) "Video consultation in progress" else "Voice consultation in progress")
      .setContentText("Tap to return to the call.")
      .setSmallIcon(applicationInfo.icon)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setCategory(NotificationCompat.CATEGORY_CALL)
      .setOngoing(true)
      .setSilent(true)
      .setContentIntent(pending)
      .build()
  }

  override fun onDestroy() {
    ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }
}
