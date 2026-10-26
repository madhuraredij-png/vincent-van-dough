import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { ChevronLeft } from '@/components/icons';
import type { Box } from '@/data/types';
import { colors, fonts, gilt } from '@/theme';

// Small building blocks shared by every screen.

export function Title({ children, size = 28, lines, style }: { children: ReactNode; size?: number; lines?: number; style?: StyleProp<TextStyle> }) {
  return (
    <Text accessibilityRole="header" numberOfLines={lines} style={[{ fontFamily: fonts.serif, fontSize: size, lineHeight: size * 1.1, color: colors.text }, style]}>
      {children}
    </Text>
  );
}

// One line of text that shrinks to fit its width, from `size` down to
// `min`; past that it ends in "…" (Madhura's call for long Met titles).
// iOS and Android shrink text natively. The browser can't, so on the web
// the text is measured with a canvas and the size worked out from that.
export function FitLine({
  children,
  size,
  min,
  fontFamily,
  style,
  header,
}: {
  children: string;
  size: number;
  min: number;
  fontFamily: string;
  style?: StyleProp<TextStyle>;
  header?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const fitted = Platform.OS === 'web' && width > 0 ? fitSize(children, fontFamily, size, min, width) : size;
  return (
    <Text
      accessibilityRole={header ? 'header' : undefined}
      numberOfLines={1}
      adjustsFontSizeToFit={Platform.OS !== 'web'}
      minimumFontScale={min / size}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[{ fontFamily, fontSize: fitted, lineHeight: size * 1.1, alignSelf: 'stretch' }, style]}
    >
      {children}
    </Text>
  );
}

let canvas: { getContext(kind: '2d'): { font: string; measureText(t: string): { width: number } } | null } | null = null;
function fitSize(text: string, fontFamily: string, size: number, min: number, width: number): number {
  if (typeof document === 'undefined') return size;
  canvas ??= document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return size;
  ctx.font = `${size}px ${fontFamily}`;
  const natural = ctx.measureText(text).width;
  // Round down to whole pixels so the text never sits a hair too wide.
  return natural <= width ? size : Math.max(min, Math.floor((size * width) / natural));
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

// A recipe photo from TheMealDB, rounded (Madhura's call). TheMealDB serves
// each photo at 700px, plus smaller copies: "medium" (350px) is plenty for
// the list rows and keeps them quick to load on a phone. House recipes have
// no photo, so a close-up of the food in the painting stands in (Madhura's
// call); with no close-up marked, a warm color tile does.
export function RecipePhoto({
  recipe,
  crop,
  size = 'full',
  style,
}: {
  recipe: { image: string; fill?: readonly [string, string] };
  crop?: { uri: string; box: Box };
  size?: 'medium' | 'full';
  style?: StyleProp<ViewStyle>;
}) {
  if (!recipe.image && crop) {
    const { x, y, w, h } = crop.box;
    // The whole painting, scaled so the box fills this tile and shifted so
    // the box sits in it; the tile clips the rest.
    return (
      <View style={[{ borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surface }, style]}>
        <Image
          source={{ uri: crop.uri }}
          contentFit="fill"
          transition={250}
          accessible={false}
          style={{ position: 'absolute', width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }}
        />
      </View>
    );
  }
  if (!recipe.image) {
    return (
      <LinearGradient
        colors={recipe.fill ?? ['#CDB89A', '#8C6F4E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[{ borderRadius: 16 }, style]}
      />
    );
  }
  const uri = size === 'full' ? recipe.image : `${recipe.image}/${size}`;
  return (
    <View style={[{ borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surface }, style]}>
      <Image source={{ uri }} contentFit="cover" transition={250} accessible={false} style={StyleSheet.absoluteFill} />
    </View>
  );
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
