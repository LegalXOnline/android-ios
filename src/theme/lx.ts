import { Platform } from 'react-native';

/**
 * The app's surface language, Material 3 Expressive over the LegalX palette.
 *
 * The generated M3 roles in ./md3 stay the reference for colour relationships;
 * this is the warm surface set the product actually sits on, plus the shape and
 * type steps the expressive spec asks for. Every foreground here clears WCAG AA
 * against the background it is used on.
 */
export const LX = {
  // Surfaces — warm, not the neutral grey of a stock M3 light scheme.
  bg: '#FBF7F0',
  surface: '#FFFFFF',
  surfaceSunken: '#F4EEE4',
  surfaceHover: '#F7F2E9',
  border: '#EBE4D8',
  borderStrong: '#DDD3C2',

  // Text
  ink: '#1A1815',
  inkMuted: '#6F6A61',
  inkFaint: '#948F85',
  onDark: '#FBF7F0',

  // Brand gold. Dark ink on the fill reads at 7.8:1; goldText is the version
  // that survives on a light background, where the fill itself is only 2.1:1.
  gold: '#D4A91F',
  goldPressed: '#BE9619',
  goldSoft: '#FBECC4',
  goldSofter: '#FDF6E3',
  onGold: '#1A1815',
  goldText: '#8A6A00',

  // The floating navigation bar and anything else inverted.
  dark: '#22201C',
  darkSoft: '#332F29',

  success: '#146B4F',
  successSoft: '#DDF3E9',
  danger: '#B3261E',
  dangerSoft: '#FCEDEC',
  info: '#1B4D8F',
  infoSoft: '#E4EDFA',
} as const;

/** Expressive shape scale — larger corners than baseline M3. */
export const LXShape = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
  full: 999,
} as const;

export const LXSpace = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

export const LXFont = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  }),
} as const;

/**
 * Expressive type scale. Display and headline carry the emphasized weight the
 * spec calls for; body and label stay regular so the contrast means something.
 */
export const LXType = {
  display:      { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.8 },
  headline:     { fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.5 },
  title:        { fontSize: 20, lineHeight: 26, fontWeight: '700', letterSpacing: -0.3 },
  titleSmall:   { fontSize: 16, lineHeight: 22, fontWeight: '700', letterSpacing: -0.1 },
  body:         { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySmall:    { fontSize: 13, lineHeight: 19, fontWeight: '400' },
  label:        { fontSize: 13, lineHeight: 17, fontWeight: '600' },
  overline:     { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.8 },
} as const;

/** Soft, warm elevation. A grey shadow on a cream ground reads as dirt. */
export const LXShadow = {
  card: {
    shadowColor: '#4A3B1A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#2A2214',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;
