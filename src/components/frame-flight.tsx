import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { GiltFrame, PaintingPlaceholder } from '@/components/ui';
import { gilt, motion } from '@/theme';

export type Rect = { x: number; y: number; width: number; height: number };

// The tap animation from the gallery: the tapped painting sprouts an
// antique gold frame, then the framed painting grows to where the recipes
// screen shows it. The recipes screen fades the frame out afterwards, so
// the three steps read as one motion across two screens.
export function FrameFlight({
  from,
  to,
  fill,
  onGrowStart,
  onDone,
}: {
  from: Rect;
  to: Rect;
  fill: readonly [string, string];
  onGrowStart: () => void;
  onDone: () => void;
}) {
  const frame = useRef(new Animated.Value(0)).current;
  const grow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Layout properties (top, width…) can't run on the native animation
    // thread, so useNativeDriver is off. At this size that's still smooth.
    // Runs once per flight; the parent mounts a new FrameFlight for each tap.
    Animated.timing(frame, { toValue: 1, duration: motion.frameIn, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
      onGrowStart();
      Animated.timing(grow, { toValue: 1, duration: motion.grow, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start(
        ({ finished }) => finished && onDone(),
      );
    });
  }, []);

  const lerp = (a: number, b: number) => grow.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const pad = frame.interpolate({ inputRange: [0, 1], outputRange: [0, gilt.thickness] });
  const negPad = Animated.multiply(pad, -1);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          position: 'absolute',
          left: lerp(from.x, to.x),
          top: lerp(from.y, to.y),
          width: lerp(from.width, to.width),
          height: lerp(from.height, to.height),
        }}
      >
        <Animated.View style={{ position: 'absolute', left: negPad, top: negPad, right: negPad, bottom: negPad, opacity: frame }}>
          <GiltFrame />
        </Animated.View>
        <PaintingPlaceholder fill={fill} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}
