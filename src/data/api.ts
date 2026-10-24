import { artworks, recipes, results, type Artwork, type ArtworkResult, type Recipe } from './mock';

// The app talks to its data only through these three functions. In
// Milestone 1 they return sample data after a short pause, so loading
// states are visible. Later milestones swap the insides for real API calls
// without the screens changing.

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A query string like ?demo=gallery-error lets a reviewer force a state
// that normal tapping can't reach (the gallery failing to load).
function demoFlag(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;
  return new URLSearchParams(window.location.search).get('demo');
}

let page = 0;

// Three paintings at a time. Each call moves to the next three, so
// "Show three different paintings" never repeats the set on screen.
export async function getArtworks(next = false): Promise<Artwork[]> {
  await wait(900);
  if (demoFlag() === 'gallery-error') throw new Error('Gallery unavailable (demo)');
  if (next) page = (page + 1) % 2;
  return artworks.slice(page * 3, page * 3 + 3);
}

export function getArtwork(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}

const failedOnce = new Set<string>();

export async function getRecipesFor(artworkId: string): Promise<ArtworkResult> {
  await wait(1600);
  const result = results[artworkId];
  if (result === 'error' && !failedOnce.has(artworkId)) {
    failedOnce.add(artworkId);
    throw new Error('Recipes unavailable (demo)');
  }
  if (!result || result === 'error') return { spotted: ['bread'], recipeIds: ['r3'], matches: { r3: ['bread'] } };
  return result;
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes[id];
}
