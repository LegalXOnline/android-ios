import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { api } from './api';

/**
 * Native push.
 *
 * The website uses Web Push — a VAPID endpoint plus two encryption keys, none
 * of which exists on a phone. Android goes through FCM and iOS through APNs,
 * and both hand the app a single opaque token. Expo fronts the two, so the
 * server sends to one endpoint and neither credential lives in the repo.
 */

/** Foreground behaviour. A ring should interrupt; an update should not. */
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const kind = notification.request.content.data?.kind;
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: kind === 'call' || kind === 'message',
      shouldSetBadge: false,
    };
  },
});

async function ensureAndroidChannels() {
  if (Platform.OS !== 'android') return;

  // A call needs its own channel: Android ties sound and importance to the
  // channel, and a ring delivered on the default one is silent by policy.
  await Notifications.setNotificationChannelAsync('calls', {
    name: 'Consultation calls',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 400, 250, 400],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });

  // Messages are heard but do not take over the screen. Android ties sound to
  // the channel, so a message delivered on the default one is silent by policy
  // — which in a paid consultation reads as the message never arriving.
  await Notifications.setNotificationChannelAsync('messages', {
    name: 'Consultation messages',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 200],
  });

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Updates',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Registers this install for push, if the user allows it.
 *
 * Returns the token so sign-out can unregister exactly this device rather than
 * every device the account owns.
 */
export async function registerForPush(): Promise<string | null> {
  // A simulator has no push service to register with, so asking would only
  // produce a confusing failure.
  if (!Device.isDevice) return null;

  try {
    await ensureAndroidChannels();

    const existing = await Notifications.getPermissionsAsync();
    let granted = existing.granted;

    if (!granted && existing.canAskAgain) {
      const asked = await Notifications.requestPermissionsAsync();
      granted = asked.granted;
    }
    if (!granted) return null;

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

    const { data: token } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    if (!token) return null;

    await api('/api/notifications/device/register', {
      method: 'POST',
      body: {
        token,
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
        deviceName: Device.deviceName ?? undefined,
      },
    });

    return token;
  } catch {
    // Push is an enhancement. Failing to register must not block sign-in.
    return null;
  }
}

/** Called on sign-out, so the next person on this phone is not rung. */
export async function unregisterPush(token: string): Promise<void> {
  try {
    await api('/api/notifications/device/unregister', {
      method: 'POST',
      body: { token },
    });
  } catch {
    // The row is harmless if it survives; Expo drops it once the install goes.
  }
}
