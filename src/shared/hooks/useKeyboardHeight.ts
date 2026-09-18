import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, Platform } from 'react-native';

/**
 * How much of the window the keyboard is actually covering, in dp.
 *
 * KeyboardAvoidingView does nothing on Android without a behavior, and the
 * usual answer — letting adjustResize shrink the window — stopped working when
 * edge-to-edge became mandatory: the window stays full height and the app is
 * handed the keyboard as an inset to deal with itself.
 *
 * Measured from where the keyboard starts rather than from the height it
 * reports. On Android the reported height covers the keys but not the
 * suggestion strip above them, so padding by it left the message box tucked
 * behind that strip — visible, and still unusable. The gap between the window
 * bottom and the keyboard's top edge is the real overlap, whatever the
 * keyboard chooses to include in its own height.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // iOS reports before the animation so the layout can move with it; Android
    // only reports once the keyboard is up.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, (e) => {
      const end = e.endCoordinates;
      if (!end) return;
      const windowHeight = Dimensions.get('window').height;
      const overlap = windowHeight - end.screenY;
      setHeight(Math.max(0, Number.isFinite(overlap) ? overlap : end.height));
    });
    const hide = Keyboard.addListener(hideEvent, () => setHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
