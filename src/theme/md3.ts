/**
 * Material 3 Expressive tokens.
 *
 * Tonal palettes generated once from the brand source colour #D4A91F
 * (L* 71.2, hue 88.2, chroma 61.2) and shipped static — no colour library
 * in the bundle. Light scheme only; role names follow the M3 spec.
 */

export const Tones = {
  "primary": {
    "0": "#020000",
    "4": "#150D00",
    "6": "#1B1200",
    "10": "#241A00",
    "12": "#291E00",
    "17": "#362800",
    "20": "#3D2E00",
    "22": "#433300",
    "24": "#483700",
    "30": "#594400",
    "40": "#755B00",
    "50": "#937300",
    "60": "#B28C00",
    "70": "#D0A61A",
    "80": "#EFC13B",
    "87": "#FFD56E",
    "90": "#FFDF9B",
    "92": "#FFE5B2",
    "94": "#FFECC8",
    "95": "#FFEFD2",
    "96": "#FFF2DB",
    "98": "#FFF9EE",
    "99": "#FFFCF6",
    "100": "#FFFFFF"
  },
  "secondary": {
    "0": "#020000",
    "4": "#150D00",
    "6": "#1B1200",
    "10": "#241A00",
    "12": "#281E05",
    "17": "#322913",
    "20": "#392F19",
    "22": "#3E341D",
    "24": "#423821",
    "30": "#51452E",
    "40": "#695D44",
    "50": "#83765C",
    "60": "#9D8F75",
    "70": "#B8AA8E",
    "80": "#D4C5A9",
    "87": "#E8D8BC",
    "90": "#F1E1C4",
    "92": "#F6E6CA",
    "94": "#FCECCF",
    "95": "#FFEFD2",
    "96": "#FFF2DB",
    "98": "#FFF9EE",
    "99": "#FFFCF6",
    "100": "#FFFFFF"
  },
  "tertiary": {
    "0": "#000100",
    "4": "#001300",
    "6": "#001900",
    "10": "#002204",
    "12": "#02260A",
    "17": "#0C3116",
    "20": "#14371C",
    "22": "#183C20",
    "24": "#1D4025",
    "30": "#2B4E32",
    "40": "#426748",
    "50": "#5A8060",
    "60": "#739A79",
    "70": "#8DB593",
    "80": "#A8D0AD",
    "87": "#BBE4C0",
    "90": "#C4EDC9",
    "92": "#C9F3CE",
    "94": "#CFF8D4",
    "95": "#D2FBD7",
    "96": "#D4FED9",
    "98": "#E9FFEB",
    "99": "#F4FFF5",
    "100": "#FFFFFF"
  },
  "neutral": {
    "0": "#020000",
    "4": "#100E0B",
    "6": "#141311",
    "10": "#1C1B19",
    "12": "#211F1D",
    "17": "#2B2A28",
    "20": "#31302E",
    "22": "#363532",
    "24": "#3A3937",
    "30": "#484744",
    "40": "#5F5E5C",
    "50": "#787774",
    "60": "#92908E",
    "70": "#ACABA8",
    "80": "#C8C6C4",
    "87": "#DBDAD7",
    "90": "#E4E2DF",
    "92": "#EAE8E5",
    "94": "#EFEEEB",
    "95": "#F2F0EE",
    "96": "#F5F3F1",
    "98": "#FBF9F6",
    "99": "#FEFCF9",
    "100": "#FFFFFF"
  },
  "neutralVariant": {
    "0": "#020000",
    "4": "#120E05",
    "6": "#16130C",
    "10": "#1E1B16",
    "12": "#221F1A",
    "17": "#2D2A24",
    "20": "#33302B",
    "22": "#37342F",
    "24": "#3C3933",
    "30": "#4A4640",
    "40": "#615E58",
    "50": "#7A7770",
    "60": "#94908A",
    "70": "#AFABA4",
    "80": "#CAC6BF",
    "87": "#DED9D2",
    "90": "#E6E2DB",
    "92": "#ECE8E0",
    "94": "#F2EDE6",
    "95": "#F5F0E9",
    "96": "#F7F3EC",
    "98": "#FDF9F2",
    "99": "#FFFCF6",
    "100": "#FFFFFF"
  },
  "error": {
    "0": "#000000",
    "4": "#280001",
    "6": "#310004",
    "10": "#410E0B",
    "12": "#49100D",
    "17": "#5A1512",
    "20": "#601410",
    "22": "#68150F",
    "24": "#6F1614",
    "30": "#8C1D18",
    "40": "#B3261E",
    "50": "#DC362E",
    "60": "#E46962",
    "70": "#EC928E",
    "80": "#F2B8B5",
    "87": "#F7CFCD",
    "90": "#F9DEDC",
    "92": "#FBE4E2",
    "94": "#FCE9E7",
    "95": "#FCEEEE",
    "96": "#FDF0EF",
    "98": "#FFF8F7",
    "99": "#FFFBF9",
    "100": "#FFFFFF"
  }
} as const;

export const M3 = {
  primary: '#755B00',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFDF9B',
  onPrimaryContainer: '#241A00',

  secondary: '#695D44',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F1E1C4',
  onSecondaryContainer: '#241A00',

  tertiary: '#426748',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#C4EDC9',
  onTertiaryContainer: '#002204',

  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',

  surface: '#FBF9F6',
  onSurface: '#1C1B19',
  surfaceVariant: '#E6E2DB',
  onSurfaceVariant: '#4A4640',
  surfaceDim: '#DBDAD7',
  surfaceBright: '#FBF9F6',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F3F1',
  surfaceContainer: '#EFEEEB',
  surfaceContainerHigh: '#EAE8E5',
  surfaceContainerHighest: '#E4E2DF',

  outline: '#7A7770',
  outlineVariant: '#CAC6BF',

  inverseSurface: '#31302E',
  inverseOnSurface: '#F2F0EE',
  inversePrimary: '#EFC13B',

  scrim: '#020000',
  shadow: '#020000',
} as const;

/** M3 Expressive type scale. Emphasized weights on display and headline. */
export const TypeScale = {
  displayLarge:   { fontSize: 57, lineHeight: 64, letterSpacing: -0.25, fontWeight: '400' },
  displayMedium:  { fontSize: 45, lineHeight: 52, letterSpacing: 0, fontWeight: '400' },
  displaySmall:   { fontSize: 36, lineHeight: 44, letterSpacing: 0, fontWeight: '400' },
  headlineLarge:  { fontSize: 32, lineHeight: 40, letterSpacing: 0, fontWeight: '600' },
  headlineMedium: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: '600' },
  headlineSmall:  { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: '600' },
  titleLarge:     { fontSize: 22, lineHeight: 28, letterSpacing: 0, fontWeight: '500' },
  titleMedium:    { fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: '500' },
  titleSmall:     { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '500' },
  bodyLarge:      { fontSize: 16, lineHeight: 24, letterSpacing: 0.5, fontWeight: '400' },
  bodyMedium:     { fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontWeight: '400' },
  bodySmall:      { fontSize: 12, lineHeight: 16, letterSpacing: 0.4, fontWeight: '400' },
  labelLarge:     { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '500' },
  labelMedium:    { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: '500' },
  labelSmall:     { fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontWeight: '500' },
} as const;

/** Expressive shape scale — rounder than baseline M3. */
export const Shape = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  largeIncreased: 20,
  extraLarge: 28,
  extraLargeIncreased: 32,
  extraExtraLarge: 48,
  full: 9999,
} as const;

/** Expressive motion is spring-based. Values feed Animated.spring directly. */
export const Motion = {
  spatialFast:      { damping: 0.9, stiffness: 1400, mass: 1 },
  spatialDefault:   { damping: 0.9, stiffness: 700, mass: 1 },
  spatialSlow:      { damping: 0.9, stiffness: 300, mass: 1 },
  effectsFast:      { damping: 1, stiffness: 3800, mass: 1 },
  effectsDefault:   { damping: 1, stiffness: 1600, mass: 1 },
  effectsSlow:      { damping: 1, stiffness: 800, mass: 1 },
} as const;

/** Opacity of the state layer drawn over a component. */
export const StateLayer = {
  hover: 0.08,
  focus: 0.1,
  pressed: 0.1,
  dragged: 0.16,
  disabledContent: 0.38,
  disabledContainer: 0.12,
} as const;

/** M3 elevation mapped to React Native shadow props. */
export const Elevation = {
  level0: { elevation: 0, shadowColor: M3.shadow, shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 } },
  level1: { elevation: 1, shadowColor: M3.shadow, shadowOpacity: 0.15, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  level2: { elevation: 3, shadowColor: M3.shadow, shadowOpacity: 0.16, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  level3: { elevation: 6, shadowColor: M3.shadow, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  level4: { elevation: 8, shadowColor: M3.shadow, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  level5: { elevation: 12, shadowColor: M3.shadow, shadowOpacity: 0.22, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
} as const;

export type M3Color = keyof typeof M3;
