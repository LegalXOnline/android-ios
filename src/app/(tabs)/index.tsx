/**
 * Home tab route — SCR-01
 *
 * Thin route wrapper. All logic lives in src/features/home/HomeScreen.tsx.
 * §10 (one screen = one file, screen-specific sub-components co-located).
 */
import { HomeScreen } from '@features/home/HomeScreen';

export default function HomeTab() {
  return <HomeScreen />;
}
