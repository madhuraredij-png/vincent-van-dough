/// <reference types="node" />
// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { deal, newDeck, shuffle } from './deck.ts';

const ids = Array.from({ length: 17 }, (_, i) => i + 1);

// A repeatable stand-in for Math.random.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

test('shuffle keeps every painting exactly once', () => {
  const out = shuffle(ids, seeded(7));
  assert.equal(out.length, ids.length);
  assert.deepEqual([...out].sort((a, b) => a - b), ids);
});

test('fixed order deals the list in order', () => {
  const { hand } = deal(newDeck(ids, false), 3, false);
  assert.deepEqual(hand, [1, 2, 3]);
});

for (const shuffled of [true, false]) {
  test(`no repeats until all have been seen (shuffled: ${shuffled})`, () => {
    const random = seeded(42);
    let deck = newDeck(ids, shuffled, random);
    const seen: number[] = [];
    // 17 paintings = 5 full hands of 3 plus 2 left over.
    for (let i = 0; i < 5; i++) {
      const r = deal(deck, 3, shuffled, random);
      seen.push(...r.hand);
      deck = r.deck;
    }
    assert.equal(new Set(seen).size, 15);
  });

  test(`every hand has three different paintings, across many rounds (shuffled: ${shuffled})`, () => {
    const random = seeded(3);
    let deck = newDeck(ids, shuffled, random);
    let previous: number[] = [];
    for (let i = 0; i < 200; i++) {
      const r = deal(deck, 3, shuffled, random);
      assert.equal(new Set(r.hand).size, 3);
      // A refresh never shows any of the three paintings that were just on screen.
      for (const id of r.hand) assert.ok(!previous.includes(id), `hand ${i} repeated ${id}`);
      previous = r.hand;
      deck = r.deck;
    }
  });
}
