/**
 * useAppTheme — returns LegalX design tokens.
 *
 * Single theme only. No color-scheme detection.
 * See 24_AI_BUILD_GUIDE.md §18 — "One theme only."
 *
 * Usage:
 *   const { colors, typography, spacing } = useAppTheme();
 */
import { theme } from '@theme';
import type { Theme } from '@theme';

export function useAppTheme(): Theme {
  return theme;
}
