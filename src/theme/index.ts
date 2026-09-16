/**
 * LegalX Design Tokens — Single Theme
 *
 * Source of truth: 04_Design_System.md
 * Rule: ONE theme only. No light/dark split. No color-scheme detection.
 *
 * All styling in the app must import from this file.
 * Never define colors, spacing, or typography inline or per-component.
 */

import { M3, TypeScale, Shape, Elevation, Motion, StateLayer } from './md3';
import { LX } from './lx';

// ─── Colors (04_Design_System.md §2) ─────────────────────────────────────────

/**
 * These names are what the screens import. Each resolves to a role in ./lx, so
 * every screen moves with the design system instead of drifting from it.
 *
 * primary is the darker gold deliberately: it is used both as text on a light
 * background and as a fill behind white, and only this tone clears AA in both
 * directions (4.75:1 and 5.07:1). The bright brand gold is for large filled
 * controls carrying dark ink — LX.gold with LX.onGold.
 */
export const Colors = {
  /** Accents, links, and filled controls that carry white text. */
  primary: LX.goldText,

  /** Primary text, headers, nav bar active state. */
  ink: LX.ink,

  /** App background. */
  surface: LX.bg,

  /** Elevated cards. */
  surfaceAlt: LX.surface,

  /** Hairline dividers, input borders. */
  border: LX.border,

  /** Sub-labels, metadata. */
  textSecondary: LX.inkMuted,

  /** Payment success, "Verified" badges. */
  success: LX.success,

  /** Errors, cancellation states. */
  danger: LX.danger,

  /** Pending states. */
  warning: '#8A5100',
} as const;

export type ColorToken = keyof typeof Colors;

// ─── Typography (04_Design_System.md §3) ──────────────────────────────────────

/**
 * Font family: system default (SF Pro on iOS, Roboto on Android).
 * No custom font loading in V1 — bundle size / load time constraint.
 */
export const FontFamily = {
  /** System sans-serif — Roboto on Android, SF Pro on iOS */
  sans: undefined, // undefined = RN default (Roboto / SF Pro)
} as const;

export const FontSize = {
  /** Onboarding / empty states only */
  display: 28,
  /** Screen titles (e.g. "GST Registration") */
  h1: 22,
  /** Section headers (Key Details, FAQ, etc.) */
  h2: 18,
  /** Paragraph content, descriptions */
  body: 15,
  /** Metadata, timestamps, helper text */
  bodySmall: 13,
  /** Form field labels, chip text */
  label: 13,
  /** Price display — always paired with primary accent */
  price: 20,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
} as const;

/** Typography presets — use these instead of raw font values. */
export const Typography = {
  display: { fontSize: FontSize.display, fontWeight: FontWeight.semibold },
  h1: { fontSize: FontSize.h1, fontWeight: FontWeight.semibold },
  h2: { fontSize: FontSize.h2, fontWeight: FontWeight.medium },
  body: { fontSize: FontSize.body, fontWeight: FontWeight.regular },
  bodySmall: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.regular },
  label: { fontSize: FontSize.label, fontWeight: FontWeight.medium },
  price: { fontSize: FontSize.price, fontWeight: FontWeight.semibold },
} as const;

// ─── Spacing (04_Design_System.md §4) ─────────────────────────────────────────
// Base unit: 4px. All values are multiples of 4.

export const Spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px — standard screen horizontal padding */
  lg: 16,
  /** 20px — card-heavy screens (Home, Talk to Lawyer) */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,
} as const;

// ─── Layout (04_Design_System.md §4) ──────────────────────────────────────────

export const Layout = {
  /** Standard screen horizontal padding */
  screenPaddingH: Spacing.lg,
  /** Card-heavy screens (Home, Talk to Lawyer listing) */
  screenPaddingHWide: Spacing.xl,
  /** Card internal padding */
  cardPadding: Spacing.lg,
  /** Minimum tap target: 44×44px (04_Design_System.md §4, WCAG) */
  minTapTarget: 44,
} as const;

// ─── Border Radius (04_Design_System.md §4) ───────────────────────────────────

export const Radii = {
  /** Cards */
  card: 12,
  /** Buttons */
  button: 8,
  /** Chips / pills / practice-area tags */
  pill: 999,
  /** Small elements */
  sm: 4,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
// Subtle elevation for cards — keeps the "trustworthy, clean" brand pillar.

export const Shadows = {
  card: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2, // Android
  },
} as const;

// ─── Theme object (convenience re-export) ─────────────────────────────────────

export * from './md3';

export const theme = {
  colors: Colors,
  typography: Typography,
  fontFamily: FontFamily,
  fontSize: FontSize,
  fontWeight: FontWeight,
  spacing: Spacing,
  layout: Layout,
  radii: Radii,
  shadows: Shadows,
  m3: M3,
  type: TypeScale,
  shape: Shape,
  elevation: Elevation,
  motion: Motion,
  state: StateLayer,
} as const;

export type Theme = typeof theme;

export * from './lx';
