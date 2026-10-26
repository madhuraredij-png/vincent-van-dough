import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// A breakpoint is the screen width where the layout switches arrangement.
// Phone below 600px, tablet 600–1023px, desktop from 1024px.
export type Breakpoint = 'phone' | 'tablet' | 'desktop';

export function breakpointFor(width: number): Breakpoint {
  if (width >= 1024) return 'desktop';
  if (width >= 600) return 'tablet';
  return 'phone';
}

const sidePadding: Record<Breakpoint, number> = { phone: 18, tablet: 40, desktop: 80 };

export type Layout = {
  bp: Breakpoint;
  width: number;
  height: number;
  top: number;
  bottom: number;
  side: number;
};

// Screen size plus the padding every screen uses, so all screens line up.
export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bp = breakpointFor(width);
  const top = insets.top + (Platform.OS === 'web' ? (bp === 'desktop' ? 32 : 24) : 12);
  const bottom = Math.max(insets.bottom, bp === 'phone' ? 24 : 40);
  return { bp, width, height, top, bottom, side: sidePadding[bp] };
}

// Height of the header row that holds the back arrow and the centered title
// on the recipe screens (title line + artist line).
export const TITLE_ROW_HEIGHT = 56;
export const TITLE_GAP = 18;

// Where the big painting sits on the "Finding recipes" screen. The tap
// animation grows the painting into exactly this box, so the hand-off from
// the gallery to the recipes screen doesn't jump.
export function loadingPaintingRect(l: Layout) {
  const y = l.top + TITLE_ROW_HEIGHT + TITLE_GAP;
  const maxH = l.height - y - l.bottom;
  if (l.bp === 'phone') {
    return { x: l.side, y, width: l.width - l.side * 2, height: maxH };
  }
  // Tablet and desktop: a centered 3:4 painting that fills the height.
  const maxW = l.width - l.side * 2;
  const height = Math.min(maxH, (maxW * 4) / 3);
  const width = (height * 3) / 4;
  return { x: (l.width - width) / 2, y, width, height };
}
