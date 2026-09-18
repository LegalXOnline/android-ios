package com.legalx.callservice

import android.content.Intent
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Starts and stops the call foreground service from JavaScript.
 *
 * Both functions are safe to call twice: the call screen starts the service on
 * join and stops it on teardown, and teardown can run from either the hang-up
 * button or the unmount that follows it.
 */
class CallServiceModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("CallService")

    Function("start") { video: Boolean ->
      val context = appContext.reactContext ?: return@Function false
      val intent = Intent(context, CallForegroundService::class.java).apply {
        putExtra(CallForegroundService.EXTRA_VIDEO, video)
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
      true
    }

    Function("stop") {
      val context = appContext.reactContext ?: return@Function false
      context.stopService(Intent(context, CallForegroundService::class.java))
      true
    }
  }
}
