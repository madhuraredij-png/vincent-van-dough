import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';

import { RecipePhoto } from '@/components/ui';
import type { Recipe } from '@/data/types';
import { colors, fonts } from '@/theme';

// One recipe on the recipes screen: a slightly tilted photo with the name
// beside it. Rows alternate sides. Hovering (or pressing, on a phone)
// straightens and enlarges the photo, tints the row and turns the name iris.
export function RecipeRow({
  recipe,
  index,
  size,
  onPress,
}: {
  recipe: Recipe;
  index: number;
  size: number;
  onPress: () => void;
}) {
  const [active, setActive] = useState(false);
  const lift = useRef(new Animated.Value(0)).current;
  const flipped = index % 2 === 1;

  useEffect(() => {
    Animated.timing(lift, {
      toValue: active ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.2, 0.8, 0.3, 1.2),
      useNativeDriver: false,
    }).start();
  }, [active, lift]);

  const tilt = flipped ? '3deg' : '-4deg';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={recipe.name}
      onPress={onPress}
      onHoverIn={() => setActive(true)}
      onHoverOut={() => setActive(false)}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      style={[styles.row, flipped && styles.flipped, active && styles.rowActive]}
    >
      <Animated.View
        style={{
          zIndex: 1,
          transform: [
            { rotate: lift.interpolate({ inputRange: [0, 1], outputRange: [tilt, '0deg'] }) },
            { scale: lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }) },
          ],
        }}
      >
        <RecipePhoto recipe={recipe} size="medium" style={[styles.photo, { width: size, height: size }]} />
      </Animated.View>
      <Text style={[styles.name, active && { color: colors.iris }]}>{recipe.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20, padding: 8, borderRadius: 18 },
  flipped: { flexDirection: 'row-reverse' },
  rowActive: { backgroundColor: colors.surface },
  photo: {
    boxShadow: '0 8px 18px rgba(0,0,0,0.45)',
  },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, lineHeight: 21, color: colors.text, textAlign: 'left' },
});
