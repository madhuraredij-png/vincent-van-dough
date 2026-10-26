import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FrameFlight, type Rect } from '@/components/frame-flight';
import { BrokenImage, Refresh } from '@/components/icons';
import { Body, Painting, PrimaryButton, Title } from '@/components/ui';
import { getArtworks } from '@/data/api';
import type { Artwork } from '@/data/types';
import { loadingPaintingRect, useLayout } from '@/lib/layout';
import { colors, fonts } from '@/theme';

type Status = 'loading' | 'error' | 'ready';

// Screen 1: "Choose an artwork". Three paintings, stacked on phone and
// tablet, side by side on desktop.
export default function ChooseArtwork() {
  const l = useLayout();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<Artwork[]>([]);
  const [flight, setFlight] = useState<{ artwork: Artwork; from: Rect } | null>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const cards = useRef<Record<string, ComponentRef<typeof View> | null>>({});

  const load = useCallback(async (next: boolean) => {
    setStatus('loading');
    try {
      setItems(await getArtworks(next));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  // Coming back from the recipes screen: undo the tap animation.
  useFocusEffect(
    useCallback(() => {
      fade.setValue(1);
      setFlight(null);
    }, [fade]),
  );

  async function open(artwork: Artwork) {
    if (flight) return;
    const go = (framed: boolean) =>
      router.push({ pathname: '/artwork/[id]', params: { id: artwork.id, ...(framed ? { framed: '1' } : {}) } });
    // People who turn on Reduce Motion skip the animation entirely.
    if (await AccessibilityInfo.isReduceMotionEnabled()) return go(false);
    const card = cards.current[artwork.id];
    if (!card) return go(false);
    card.measureInWindow((x, y, width, height) => setFlight({ artwork, from: { x, y, width, height } }));
  }

  const desktop = l.bp === 'desktop';

  return (
    <View style={[styles.screen, { paddingTop: l.top, paddingBottom: l.bottom, paddingHorizontal: l.side }]}>
      <Animated.View style={[styles.column, { opacity: fade }]}>
        <Text style={[styles.appName, { fontSize: l.bp === 'phone' ? 16 : 18 }]}>Vincent van Dough</Text>
        <View style={[styles.header, desktop && { justifyContent: 'center' }]}>
          <Title size={l.bp === 'phone' ? 26 : 30}>Choose an artwork</Title>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show three different paintings"
            disabled={status === 'loading'}
            onPress={() => load(true)}
            style={({ pressed }) => [styles.refresh, desktop && styles.refreshDesktop, status === 'loading' && { opacity: 0.5 }, pressed && { opacity: 0.7 }]}
          >
            <Refresh />
          </Pressable>
        </View>

        {status === 'error' ? (
          <View accessibilityRole="alert" style={styles.error}>
            <View style={styles.dashed}>
              <BrokenImage />
            </View>
            <Title size={30} style={{ textAlign: 'center' }}>
              The gallery is closed for a moment
            </Title>
            <Body muted style={{ textAlign: 'center' }}>
              We couldn&apos;t load the paintings. Check your connection and try again.
            </Body>
            {l.bp !== 'phone' && <PrimaryButton label="Try again" onPress={() => load(false)} style={styles.inlineButton} />}
          </View>
        ) : (
          <View
            accessibilityLabel={status === 'loading' ? 'Loading paintings' : 'Three paintings'}
            style={[styles.cards, { flexDirection: desktop ? 'row' : 'column', gap: l.bp === 'phone' ? 14 : desktop ? 28 : 20 }]}
          >
            {status === 'loading'
              ? [0, 1, 2].map((i) => <View key={i} style={styles.skeleton} />)
              : items.map((a) => (
                  <Pressable
                    key={a.id}
                    ref={(r) => {
                      cards.current[a.id] = r;
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${a.title}`}
                    onPress={() => open(a)}
                    style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
                  >
                    <Painting uri={a.image} style={StyleSheet.absoluteFill} />
                  </Pressable>
                ))}
          </View>
        )}
        {status === 'loading' && <Body muted style={styles.loadingText}>Hanging three paintings…</Body>}
        {status === 'error' && l.bp === 'phone' && <PrimaryButton label="Try again" onPress={() => load(false)} />}
      </Animated.View>

      {flight && (
        <FrameFlight
          from={flight.from}
          to={loadingPaintingRect(l)}
          image={flight.artwork.image}
          onGrowStart={() => Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: false }).start()}
          onDone={() => router.push({ pathname: '/artwork/[id]', params: { id: flight.artwork.id, framed: '1' } })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  column: { flex: 1, gap: 18 },
  appName: { alignSelf: 'center', fontFamily: fonts.serif, color: colors.iris },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  refresh: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshDesktop: { position: 'absolute', right: 0 },
  cards: { flex: 1, minHeight: 0 },
  card: { flex: 1, minHeight: 0, minWidth: 0 },
  skeleton: { flex: 1, backgroundColor: colors.surface },
  loadingText: { textAlign: 'center', fontSize: 14 },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 20, maxWidth: 460, alignSelf: 'center' },
  dashed: {
    width: 120,
    height: 150,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.dashed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineButton: { marginTop: 12, minWidth: 240 },
});
