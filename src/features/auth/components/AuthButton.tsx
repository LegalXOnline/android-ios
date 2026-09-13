import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Auth } from './tokens';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthButton({ label, onPress, loading = false, disabled = false }: AuthButtonProps) {
  const off = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: off, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? Auth.goldPressed : Auth.gold, opacity: off ? 0.55 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Auth.onGold} />
      ) : (
        <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <SymbolView
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={18}
            tintColor={Auth.onGold}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 17, fontWeight: '700', color: Auth.onGold },
});
