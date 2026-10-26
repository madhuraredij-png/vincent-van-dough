import type { Box } from './types';

// Where each food sits in its artwork, for the close-up that stands in for
// a photo on house recipes (Madhura's call, 2026-10-26). Boxes are square
// on the painting, in fractions of its width and height: x, y = top-left
// corner. Claude marked them by eye; the AI in Milestone 4 can replace them.
export const CROPS: Record<string, Record<string, Box>> = {
  // The Brioche
  '436946': { 'brioche': { x: 0.32, y: 0.375, w: 0.3, h: 0.37 }, 'plums': { x: 0.23, y: 0.257, w: 0.2, h: 0.247 }, 'grapes': { x: 0.73, y: 0.497, w: 0.2, h: 0.247 } },
  // Still Life with a Glass and Oysters
  '436636': { 'grapes': { x: 0.55, y: 0.408, w: 0.45, h: 0.343 } },
  // Still Life with Lobster and Fruit
  '435663': { 'grapes': { x: 0.58, y: 0.547, w: 0.3, h: 0.246 }, 'melon': { x: 0.77, y: 0.51, w: 0.22, h: 0.181 } },
  // Still Life: A Banqueting Scene
  '436637': { 'grapes': { x: 0.55, y: 0.341, w: 0.16, h: 0.218 } },
  // Basket of Fruit
  '816624': { 'grapes': { x: 0.1, y: 0.368, w: 0.3, h: 0.405 }, 'quince': { x: 0.37, y: 0.415, w: 0.2, h: 0.27 } },
  // Still Life of Fruit and Game
  '437238': { 'grapes': { x: 0.38, y: 0.158, w: 0.2, h: 0.284 }, 'hare': { x: 0.68, y: 0.273, w: 0.32, h: 0.454 } },
  // Still Life with a Vase of Flowers, Melon, Peaches, and Grape
  '888924': { 'melon': { x: 0.42, y: 0.356, w: 0.4, h: 0.489 }, 'grapes': { x: 0.0, y: 0.458, w: 0.2, h: 0.244 } },
  // The Silver Tureen
  '435887': { 'hare': { x: 0.295, y: 0.353, w: 0.35, h: 0.494 } },
  // Still Life with Strawberries
  '436345': { 'artichoke': { x: 0.26, y: 0.6, w: 0.18, h: 0.239 } },
  // Fish Market
  '679844': { 'carp': { x: 0.58, y: 0.362, w: 0.28, h: 0.377 } },
  // Wine Goblet and Lacquer Food Box with New Year’s Meal
  '54731': { 'shrimp': { x: 0.155, y: 0.321, w: 0.35, h: 0.459 } },
  // Teabowl and Powder Cake in a Tube
  '54105': { 'rice cake': { x: 0.2, y: 0.639, w: 0.4, h: 0.361 } },
  // Ebisu and Daikoku Celebrating the New Year Festival
  '57260': { 'sea bream': { x: 0.375, y: 0.566, w: 0.35, h: 0.228 } },
};

// The close-up for the first of `foods` marked in this artwork, if any.
export function cropFor(artworkId: string, foods: string[]): Box | undefined {
  const boxes = CROPS[artworkId];
  const food = boxes && foods.find((f) => boxes[f]);
  return food ? boxes[food] : undefined;
}
