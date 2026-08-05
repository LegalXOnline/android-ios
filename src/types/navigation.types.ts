/**
 * Navigation types — Expo Router typed routes.
 *
 * Route param types for all screens in 05_Screen_Inventory.md.
 * With typedRoutes: true in app.json experiments, Expo Router generates
 * route types automatically — these supplements that with explicit param shapes.
 */

// ─── Tab routes ───────────────────────────────────────────────────────────────

export type TabRoute =
  | '/(tabs)'
  | '/(tabs)/documentation'
  | '/(tabs)/knowledge-centre'
  | '/(tabs)/talk-to-lawyer';

// ─── Profile routes ───────────────────────────────────────────────────────────

export type ProfileRoute =
  | '/profile'
  | '/profile/edit'
  | '/profile/lx-coins'
  | '/profile/favourites'
  | '/profile/call-history'
  | '/profile/transactions'
  | '/profile/support';

// ─── Auth routes ──────────────────────────────────────────────────────────────

export type AuthRoute = '/(auth)/onboarding' | '/(auth)/login';

// ─── Feature routes (to be expanded per screen in future phases) ──────────────

export type AppRoute = TabRoute | ProfileRoute | AuthRoute;

// ─── Screen IDs (05_Screen_Inventory.md) ──────────────────────────────────────
// Used for analytics event tracking (21_Analytics_Events.md).

export type ScreenId =
  | 'SCR-00a' // Onboarding
  | 'SCR-00b' // Login
  | 'SCR-01' // Home
  | 'SCR-02' // Search Results
  | 'SCR-03' // Service List
  | 'SCR-04' // Service Detail
  | 'SCR-05' // Knowledge Feed
  | 'SCR-06' // Article Detail
  | 'SCR-07' // Lawyer Listing
  | 'SCR-08' // Search / Filters
  | 'SCR-09' // Lawyer Profile Detail
  | 'SCR-10' // Mode Selection
  | 'SCR-11' // Date Selection
  | 'SCR-12' // Time Selection
  | 'SCR-13' // Billing
  | 'SCR-14' // Razorpay Checkout
  | 'SCR-15' // Confirmation
  | 'SCR-16' // Profile root
  | 'SCR-17' // Edit Profile
  | 'SCR-18' // LX Coins
  | 'SCR-19' // Favourite Lawyers
  | 'SCR-20' // Call History
  | 'SCR-21' // Transactions
  | 'SCR-22' // Support
  | 'SCR-23' // Select Verification Package
  | 'SCR-24'; // Upload Document
