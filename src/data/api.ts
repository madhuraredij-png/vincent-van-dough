import { deal, newDeck, shuffle, type Deck } from './deck';
import { GALLERY_IDS, SHUFFLE } from './gallery';
import { cachedArtwork, fetchArtwork } from './met';
import { FOODS } from './foods';
import { rankMeals, type Food, type MealHit } from './match';
import { cachedRecipe, fetchRecipe, searchIngredient } from './mealdb';
import type { Artwork, ArtworkResult, Recipe } from './types';

// The app talks to its data only through these functions. Paintings come
// from the Met (Milestone 2) and recipes from TheMealDB (Milestone 3). The
// foods in each painting are hand-listed in foods.ts until Milestone 4.

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A query string like ?demo=gallery-error (or kitchen-error) lets a reviewer
// force a state that normal tapping can't reach, like a service failing.
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

// Up to two recipes per painting, as approved in the designs.
const MAX_RECIPES = 2;

// Equally good recipes are shuffled, so each visit to a painting can show a
// different pair (Madhura's call, 2026-10-26). false keeps them by name.
const SHUFFLE_TIES = true;

// Each painting's TheMealDB searches, remembered for the visit. A failure
// is forgotten so "Try again" retries.
const searches = new Map<string, Promise<MealHit[][]>>();

function searchFoods(artworkId: string, foods: Food[]): Promise<MealHit[][]> {
  let p = searches.get(artworkId);
  if (!p) {
    // One list per food, merging the searches for each of its names with
    // the food's own dish recipes, if it is a prepared food.
    p = Promise.all(
      foods.map(async (food) => {
        const [found, dishes] = await Promise.all([
          Promise.all(food.ingredients.map(searchIngredient)),
          Promise.all((food.dishes ?? []).map(fetchRecipe)),
        ]);
        return [...found.flat(), ...dishes.map(({ id, name, image }) => ({ id, name, image }))];
      }),
    );
    p.catch(() => searches.delete(artworkId));
    searches.set(artworkId, p);
  }
  return p;
}

// Searches TheMealDB once per ingredient name, ranks the meals (a prepared
// food's own recipe first, then by how many of the painting's foods they
// use; see match.ts), then loads the top two
// in full so their photos and steps are ready.
export async function getRecipesFor(artworkId: string): Promise<ArtworkResult> {
  if (demoFlag() === 'kitchen-error') {
    await wait(900);
    throw new Error('Recipes unavailable (demo)');
  }
  const foods = FOODS[artworkId] ?? [];
  const hits = await searchFoods(artworkId, foods);
  const top = rankMeals(foods, hits, SHUFFLE_TIES ? (tied) => shuffle(tied) : undefined).slice(0, MAX_RECIPES);
  const recipes = await Promise.all(top.map((r) => fetchRecipe(r.meal.id)));
  return {
    spotted: foods.map((f) => f.label),
    recipes,
    matches: Object.fromEntries(top.map((r) => [r.meal.id, r.foods])),
  };
}

export function getRecipe(id: string): Promise<Recipe> {
  return fetchRecipe(id);
}

// Already-loaded recipe, if any, so the recipe screen can draw without waiting.
export function peekRecipe(id: string): Recipe | undefined {
  return cachedRecipe(id);
}
