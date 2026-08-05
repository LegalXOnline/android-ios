/**
 * Route name constants.
 *
 * Used anywhere a route string is referenced programmatically
 * to prevent typos and enable find-all-references.
 *
 * With typedRoutes: true in app.json, Expo Router also generates
 * typed href types — these constants complement that typing.
 */

export const ROUTES = {
  // ─── Tabs ────────────────────────────────────────────────────────────────
  HOME: '/(tabs)' as const,
  DOCUMENTATION: '/(tabs)/documentation' as const,
  KNOWLEDGE_CENTRE: '/(tabs)/knowledge-centre' as const,
  TALK_TO_LAWYER: '/(tabs)/talk-to-lawyer' as const,

  // ─── Auth ─────────────────────────────────────────────────────────────────
  ONBOARDING: '/(auth)/onboarding' as const,
  LOGIN: '/(auth)/login' as const,

  // ─── Profile (stack, pushed from Home) ───────────────────────────────────
  PROFILE: '/profile' as const,
  PROFILE_EDIT: '/profile/edit' as const,
  PROFILE_LX_COINS: '/profile/lx-coins' as const,
  PROFILE_FAVOURITES: '/profile/favourites' as const,
  PROFILE_CALL_HISTORY: '/profile/call-history' as const,
  PROFILE_TRANSACTIONS: '/profile/transactions' as const,
  PROFILE_SUPPORT: '/profile/support' as const,
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
