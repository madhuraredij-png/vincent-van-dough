// Which three paintings to show next. Kept free of app imports so it can be
// tested on its own with Node's built-in test runner (see deck.test.ts).
//
// A "deck" is the gallery list in the order it will be dealt. Each refresh
// deals the next three. Nothing repeats until every painting has been shown;
// then the deck starts over (reshuffled, when shuffling is on).

export type Deck<T> = { order: T[]; next: number };

// Fisher–Yates shuffle: every order is equally likely. `random` is passed in
// so tests can use a fixed sequence instead of Math.random.
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function newDeck<T>(items: readonly T[], shuffled: boolean, random?: () => number): Deck<T> {
  return { order: shuffled ? shuffle(items, random) : items.slice(), next: 0 };
}

// Deals `count` items and returns the deck to use next time. When fewer than
// `count` are left, the hand is topped up from a fresh deck, skipping
// anything already in the hand so the screen never shows the same painting
// twice.
export function deal<T>(
  deck: Deck<T>,
  count: number,
  shuffled: boolean,
  random?: () => number,
): { hand: T[]; deck: Deck<T> } {
  const hand = deck.order.slice(deck.next, deck.next + count);
  if (hand.length === count) return { hand, deck: { order: deck.order, next: deck.next + count } };

  // The new round puts the paintings on screen right now (the previous
  // hand) and the leftovers at the back, so a refresh never brings back
  // something the person just saw.
  const previous = deck.order.slice(Math.max(0, deck.next - count), deck.next);
  const recent = [...previous, ...hand];
  const rest = newDeck(deck.order, shuffled, random).order.filter((item) => !recent.includes(item));
  const order = [...rest, ...recent];
  const topUp = order.slice(0, count - hand.length);
  return { hand: [...hand, ...topUp], deck: { order, next: topUp.length } };
}
