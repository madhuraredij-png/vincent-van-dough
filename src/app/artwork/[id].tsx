import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';

import type { Rect } from '@/components/frame-flight';
import { RecipeRow } from '@/components/recipe-row';
import { BackButton, Body, GiltFrame, PaintingPlaceholder, PrimaryButton, Title } from '@/components/ui';
import { getArtwork, getRecipe, getRecipesFor } from '@/data/api';
import { noRecipeButtons, noRecipeLines, type ArtworkResult, type Recipe } from '@/data/mock';
import { loadingPaintingRect, TITLE_GAP, TITLE_ROW_HEIGHT, useLayout, type Layout } from '@/lib/layout';
import { colors, fonts, gilt, motion } from '@/theme';

type Status = 'loading' | 'error' | 'ready';

// Each visit to a no-recipes screen shows the next line, so the copy rotates.
let emptyVisits = 0;

const ROW = 100; // one recipe row: 84px photo + padding
const ROW_GAP = 14;
const SPOTTED = 22;

// Screen 2: the chosen painting with up to two recipes. It opens in the
// "Finding recipes" state (big painting, toast), then the painting settles
// into place and the recipes slide up.
export default function Recipes() {
  const { id, framed } = useLocalSearchParams<{ id: string; framed?: string }>();
  const artwork = getArtwork(id);
  const l = useLayout();
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<ArtworkResult | null>(null);
  const [empty, setEmpty] = useState({ line: noRecipeLines[0], button: noRecipeButtons[0] });
  // 0 = "Finding recipes" layout, 1 = results layout. Every moving part
  // reads from this one value, so they stay in step.
  const settle = useRef(new Animated.Value(0)).current;
  const frame = useRef(new Animated.Value(framed ? 1 : 0)).current;

  // Last step of the tap animation: the gilt frame fades away.
  useEffect(() => {
    if (framed) Animated.timing(frame, { toValue: 0, duration: motion.frameOut, useNativeDriver: false }).start();
  }, [framed, frame]);

  const load = useCallback(async () => {
    setStatus('loading');
    settle.setValue(0);
    try {
      const r = await getRecipesFor(id);
      if (r.recipeIds.length === 0) {
        setEmpty({
          line: noRecipeLines[emptyVisits % noRecipeLines.length],
          button: noRecipeButtons[emptyVisits % noRecipeButtons.length],
        });
        emptyVisits += 1;
      }
      setResult(r);
      setStatus('ready');
      if (await AccessibilityInfo.isReduceMotionEnabled()) settle.setValue(1);
      else Animated.timing(settle, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start();
    } catch {
      setStatus('error');
    }
  }, [id, settle]);

  useEffect(() => {
    load();
  }, [load]);

  if (!artwork) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Body>That painting isn&apos;t in the gallery.</Body>
        <PrimaryButton label="Back to the gallery" onPress={() => router.replace('/')} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const recipes = (result?.recipeIds ?? []).map(getRecipe).filter((r): r is Recipe => !!r);
  const desktop = l.bp === 'desktop';
  const titleSize = l.bp === 'phone' ? 28 : l.bp === 'tablet' ? 32 : 34;
  const start = loadingPaintingRect(l);
  const geo = resultGeometry(l, status === 'ready' ? recipes.length : 2);
  const lerp = (a: number, b: number) => settle.interpolate({ inputRange: [0, 1], outputRange: [a, b] });
  const reveal = {
    opacity: settle.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] }),
    transform: [{ translateY: settle.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
  };

  const titleBlock = (
    <View style={styles.titleBlock}>
      <Title size={titleSize} style={{ textAlign: 'center' }}>
        {artwork.title}
      </Title>
      <Text style={styles.artist}>{artwork.artist}</Text>
    </View>
  );

  const goToRecipe = (r: Recipe) =>
    router.push({ pathname: '/recipe/[id]', params: { id: r.id, from: (result?.matches[r.id] ?? []).join(', ') } });

  const details =
    status !== 'ready' || !result ? null : recipes.length === 0 ? (
      <View accessibilityRole="summary" style={styles.emptyBox}>
        <View style={{ gap: 6 }}>
          <Title size={24} style={{ textAlign: 'center' }}>
            {empty.line}
          </Title>
          <Body muted style={{ textAlign: 'center', fontSize: 14 }}>
            We couldn&apos;t find recipes for this artwork.
          </Body>
        </View>
        <PrimaryButton label={empty.button} onPress={() => router.back()} style={l.bp !== 'phone' && styles.wideButton} />
      </View>
    ) : (
      <View style={{ gap: 18 }}>
        <Text style={styles.spotted}>
          Spotted: <Text style={{ color: colors.text }}>{result.spotted.join(', ')}</Text>
        </Text>
        <View style={{ gap: ROW_GAP }}>
          {recipes.map((r, i) => (
            <RecipeRow key={r.id} recipe={r} index={i} size={desktop ? 96 : 84} onPress={() => goToRecipe(r)} />
          ))}
        </View>
      </View>
    );

  if (status === 'error') {
    return (
      <View style={[styles.screen, { paddingTop: l.top, paddingBottom: l.bottom, paddingHorizontal: l.side }]}>
        <BackButton label="Back to paintings" />
        <View accessibilityRole="alert" style={styles.errorBox}>
          <View style={styles.emptyFrame}>
            <GiltFrame />
            <View style={styles.emptyFrameInside} />
          </View>
          <Title size={30} style={{ textAlign: 'center' }}>
            The kitchen is closed at the moment
          </Title>
          <Body muted style={{ textAlign: 'center' }}>
            We couldn&apos;t load recipes for this artwork. Check your connection and try again.
          </Body>
          {l.bp !== 'phone' && <PrimaryButton label="Try again" onPress={load} style={styles.wideButton} />}
        </View>
        {l.bp === 'phone' && <PrimaryButton label="Try again" onPress={load} />}
      </View>
    );
  }

  const end = geo.painting;

  return (
    <View style={styles.screen}>
      {/* Header row: back arrow with the centered title. On desktop the title
          moves into the right-hand column once recipes arrive. */}
      <Animated.View
        style={[
          styles.titleRow,
          { top: l.top, left: l.side, right: l.side, height: TITLE_ROW_HEIGHT },
          desktop && { opacity: settle.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' }) },
        ]}
      >
        {titleBlock}
      </Animated.View>
      <View style={[styles.backSlot, { top: l.top + (TITLE_ROW_HEIGHT - 44) / 2, left: l.side }]}>
        <BackButton label="Back to paintings" />
      </View>

      <Animated.View
        accessibilityLabel={`${artwork.title}, ${artwork.artist}`}
        style={{
          position: 'absolute',
          left: lerp(start.x, end.x),
          top: lerp(start.y, end.y),
          width: lerp(start.width, end.width),
          height: lerp(start.height, end.height),
        }}
      >
        <Animated.View style={[styles.frame, { opacity: frame }]}>
          <GiltFrame />
        </Animated.View>
        <PaintingPlaceholder fill={artwork.fill} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {status === 'loading' && (
        <View accessibilityRole="progressbar" accessibilityLabel="Finding recipes" style={[styles.toast, { bottom: l.bottom + 20 }]}>
          <ActivityIndicator size="small" color={colors.background} />
          <Text style={styles.toastText}>Finding recipes…</Text>
        </View>
      )}

      {details && (
        <Animated.View style={[styles.below, geo.below, reveal]}>
          {desktop && titleBlock}
          {details}
        </Animated.View>
      )}
    </View>
  );
}

// Where the painting and the recipes sit once results are in.
function resultGeometry(l: Layout, count: number): { painting: Rect; below: object } {
  const contentW = l.width - l.side * 2;
  if (l.bp === 'desktop') {
    const top = l.top + 44 + 16;
    const maxH = l.height - top - l.bottom;
    const width = Math.min((maxH * 3) / 4, contentW * 0.52);
    const height = Math.min(maxH, (width * 4) / 3);
    const left = l.side + width + 56;
    return {
      painting: { x: l.side, y: top, width, height },
      below: { left, right: l.side, top, height: maxH, justifyContent: 'center', gap: 28 },
    };
  }
  const y = l.top + TITLE_ROW_HEIGHT + TITLE_GAP;
  const belowH = count === 0 ? 190 : SPOTTED + 18 + count * ROW + (count - 1) * ROW_GAP;
  const cap = contentW * (l.bp === 'phone' ? 1.4 : 0.8);
  const height = Math.max(220, Math.min(cap, l.height - y - l.bottom - TITLE_GAP - belowH));
  const belowW = Math.min(contentW, 560);
  return {
    painting: { x: l.side, y, width: contentW, height },
    below: { top: y + height + TITLE_GAP, bottom: l.bottom, left: (l.width - belowW) / 2, width: belowW, justifyContent: count === 0 ? 'center' : 'flex-start' },
  };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  titleRow: { position: 'absolute', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 44 },
  titleBlock: { alignItems: 'center', gap: 4 },
  artist: { fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  backSlot: { position: 'absolute', zIndex: 2 },
  frame: { position: 'absolute', top: -gilt.thickness, left: -gilt.thickness, right: -gilt.thickness, bottom: -gilt.thickness },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.toast,
    boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
  },
  toastText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.background },
  below: { position: 'absolute' },
  spotted: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  emptyBox: { flex: 1, justifyContent: 'space-evenly', gap: 18 },
  wideButton: { alignSelf: 'center', minWidth: 280 },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, maxWidth: 460, alignSelf: 'center' },
  emptyFrame: { width: 132, height: 164, marginBottom: 6, boxShadow: '0 14px 34px rgba(0,0,0,0.65)' },
  emptyFrameInside: {
    position: 'absolute',
    top: gilt.thickness,
    left: gilt.thickness,
    right: gilt.thickness,
    bottom: gilt.thickness,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#33240E',
  },
});
