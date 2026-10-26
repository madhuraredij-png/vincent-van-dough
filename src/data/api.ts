import { deal, newDeck, type Deck } from './deck';
import { GALLERY_IDS, SHUFFLE } from './gallery';
import { cachedArtwork, fetchArtwork } from './met';
import { recipes, results, type ArtworkResult, type Recipe } from './mock';
import type { Artwork } from './types';

// The app talks to its data only through these functions. Paintings come
// from the Met (Milestone 2). Recipes are still sample data with a short
// pause, so loading states are visible, until Milestone 3.

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A query string like ?demo=gallery-error lets a reviewer force a state
// that normal tapping can't reach (the gallery failing to load).
function demoFlag(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;
  return new URLSearchParams(window.location.search).get('demo');
}

let deck: Deck<string> = newDeck(GALLERY_IDS, SHUFFLE);
let onScreen: string[] = [];

// Three paintings at a time. `next` deals three new ones (the refresh
// button); otherwise the three already on screen load again, so "Try again"
// and coming back don't reshuffle.
export async function getArtworks(next = false): Promise<Artwork[]> {
  if (demoFlag() === 'gallery-error') {
    await wait(900);
    throw new Error('Gallery unavailable (demo)');
  }
  if (next || onScreen.length === 0) {
    const r = deal(deck, 3, SHUFFLE);
    deck = r.deck;
    onScreen = r.hand;
  }
  // All three at once. If any fails, the gallery shows its error screen
  // rather than a gap.
  return Promise.all(onScreen.map(fetchArtwork));
}

export function isInGallery(id: string): boolean {
  return GALLERY_IDS.includes(id);
}

export function getArtwork(id: string): Promise<Artwork> {
  if (!isInGallery(id)) return Promise.reject(new Error(`${id} is not in the gallery`));
  return fetchArtwork(id);
}

// Already-loaded painting, if any, so a screen can draw without waiting.
export function peekArtwork(id: string): Artwork | undefined {
  return cachedArtwork(id);
}

const failedOnce = new Set<string>();

export async function getRecipesFor(artworkId: string): Promise<ArtworkResult> {
  await wait(1600);
  const result = results[Math.max(0, GALLERY_IDS.indexOf(artworkId)) % results.length];
  if (result === 'error' && !failedOnce.has(artworkId)) {
    failedOnce.add(artworkId);
    throw new Error('Recipes unavailable (demo)');
  }
  if (result === 'error') return { spotted: ['bread'], recipeIds: ['r3'], matches: { r3: ['bread'] } };
  return result;
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes[id];
}
