import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * How much of the screen the keyboard is covering, in dp.
 *
 * KeyboardAvoidingView does nothing on Android without a behavior, and the
 * usual answer — letting adjustResize shrink the window — stopped working when
 * edge-to-edge became mandatory: the window now stays full height and the app
 * is handed the keyboard as an inset to deal with itself. Left alone, the
 * message box sits underneath the keyboard, which is exactly where it is
 * impossible to use.
 *
 * The Will/Did split matters: iOS reports the size before the animation so the
 * layout moves with it, while Android only reports it once the keyboard is up.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, (e) =>
      setHeight(e.endCoordinates?.height ?? 0),
    );
    const hide = Keyboard.addListener(hideEvent, () => setHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
