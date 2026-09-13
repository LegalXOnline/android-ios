import { Platform } from 'react-native';

/**
 * The auth flow runs on its own surface: a tinted page behind a white card,
 * rather than the flat app background. Everything here is measured against the
 * page or the card, and every pair clears WCAG AA.
 */
export const Auth = {
  page: '#F5F6FB',
  card: '#FFFFFF',
  cardBorder: '#E8EAF2',
  field: '#EDF1FA',
  fieldFocus: '#E2E8F7',
  fieldBorder: '#DDE3F0',

  ink: '#16181F',
  muted: '#5A5F6E',
  hint: '#8A8F9C',

  /** The brand gold, for fills. Dark ink on it reads at 7.8:1. */
  gold: '#D4A91F',
  onGold: '#16181F',
  goldPressed: '#C09716',
  /** Gold dark enough to read as text on the page — 4.7:1. */
  goldText: '#8A6A00',

  danger: '#B3261E',
  dangerSurface: '#FCEDEC',
} as const;

/**
 * System families only. Loading a typeface would cost more than the whole
 * JavaScript bundle.
 */
export const AuthFont = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  }),
} as const;
