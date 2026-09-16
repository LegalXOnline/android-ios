/**
 * useAppTheme — returns LegalX design tokens.
 *
 * Single theme only. No color-scheme detection.
 *
 * Usage:
 *   const { colors, typography, spacing } = useAppTheme();
 */
import { theme } from '@theme';
import type { Theme } from '@theme';

export function useAppTheme(): Theme {
  return theme;
}
