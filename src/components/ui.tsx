import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { ChevronLeft } from '@/components/icons';
import { colors, fonts, gilt } from '@/theme';

// Small building blocks shared by every screen.

export function Title({ children, size = 28, style }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle> }) {
  return (
    <Text accessibilityRole="header" style={[{ fontFamily: fonts.serif, fontSize: size, lineHeight: size * 1.1, color: colors.text }, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, muted }: { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean }) {
  return <Text style={[styles.body, muted && { color: colors.textMuted }, style]}>{children}</Text>;
}

// A painting from the Met. Square corners (Madhura's call); recipe photos
// are rounded. The dark surface shows while the image downloads.
// expo-image caches downloads, so the same painting on the next screen
// appears at once.
export function Painting({ uri, fit = 'cover', style }: { uri: string; fit?: 'cover' | 'contain'; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: colors.surface }, style]}>
      <Image source={{ uri }} contentFit={fit} transition={250} accessible={false} style={StyleSheet.absoluteFill} />
    </View>
  );
}

export function RecipePhoto({ fill, style }: { fill: readonly [string, string]; style?: StyleProp<ViewStyle> }) {
  return <LinearGradient colors={fill} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }} style={[{ borderRadius: 16 }, style]} />;
}

// The antique gold gilt frame. It fills its parent, so place it inside a
// box that is `gilt.thickness` larger than the painting on every side.
export function GiltFrame({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <LinearGradient colors={gilt.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'rgba(214,186,128,0.35)' }]} />
      <View style={[StyleSheet.absoluteFill, { margin: 2, borderWidth: 4, borderColor: gilt.inner }]} />
      <View style={[StyleSheet.absoluteFill, { margin: 6, borderWidth: 2, borderColor: gilt.lip }]} />
    </View>
  );
}

export function BackButton({ label, fallback = '/' }: { label: string; fallback?: '/' }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
      style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
    >
      <ChevronLeft />
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress, style }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }, style]}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  back: { width: 44, height: 44, marginLeft: -10, alignItems: 'center', justifyContent: 'center' },
  primary: {
    minHeight: 56,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: colors.iris,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.onIris },
});
