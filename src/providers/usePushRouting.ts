import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

/**
 * Opens what a tapped notification points at.
 *
 * Registering for push only makes a notification arrive. Nothing in
 * expo-notifications navigates on a tap — without this the ring lands, the
 * client taps it, and the app opens on whatever screen it was last showing
 * while the lawyer waits in a channel nobody joins.
 *
 * useLastNotificationResponse covers both routes in: a tap while the app is
 * running, and the tap that launched it from cold, which arrives before any
 * listener could have been attached.
 */

/**
 * The payload is server data, so it picks a route rather than supplying one.
 * Pushing a path straight from a notification would let anything that can
 * reach the push endpoint choose a screen.
 */
function routeFor(url: unknown): { pathname: string; params?: Record<string, string> } | null {
  if (typeof url !== 'string') return null;

  const consultation = /^\/consultation\/([0-9a-fA-F-]{36})$/.exec(url);
  if (consultation) {
    return { pathname: '/consultation/[id]', params: { id: consultation[1] } };
  }

  if (url === '/notifications' || url.startsWith('/notifications')) {
    return { pathname: '/profile/notifications' };
  }

  if (/^\/orders?\b/.test(url)) return { pathname: '/profile/orders' };
  if (/^\/wallet\b|^\/lx-coins\b/.test(url)) return { pathname: '/profile/lx-coins' };

  return null;
}

/** @param enabled false until a client session exists — the router has nowhere to send them otherwise. */
export function usePushRouting(enabled: boolean): void {
  const router = useRouter();
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !response) return;
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;

    // The hook replays the same response on every render; without this a call
    // that was tapped once is re-entered every time the tree updates.
    const id = response.notification.request.identifier;
    if (handled.current === id) return;
    handled.current = id;

    const route = routeFor(response.notification.request.content.data?.url);
    if (!route) return;

    // @ts-expect-error expo-router types the union of literal routes; this is
    // resolved from a payload and validated by routeFor above.
    router.push(route);
  }, [enabled, response, router]);
}
