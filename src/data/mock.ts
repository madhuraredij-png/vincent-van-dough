// Sample data for Milestone 1. Nothing here comes from the internet:
// real paintings arrive from The Met in Milestone 2, real recipes from
// TheMealDB in Milestone 3, and AI-spotted foods in Milestone 4.
// Titles are placeholders on purpose, so sample data is never mistaken
// for real museum records.

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  fill: readonly [string, string];
};

export type Ingredient = { name: string; amount: string };

export type Recipe = {
  id: string;
  name: string;
  fill: readonly [string, string];
  ingredients: Ingredient[];
  steps: string[]; // empty when the source has no written method
  sourceUrl: string;
};

// What "looking at" a painting produced: the foods spotted in it and the
// recipes that use them (at most 2, best match first).
export type ArtworkResult = {
  spotted: string[];
  recipeIds: string[];
  // Which spotted foods each recipe uses, for the "From the painting" line.
  matches: Record<string, string[]>;
};

export const artworks: Artwork[] = [
  { id: 'a1', title: '[Sample still life 1]', artist: '[Artist, date]', fill: ['#6E6458', '#2E2925'] },
  { id: 'a2', title: '[Sample still life 2]', artist: '[Artist, date]', fill: ['#7A7468', '#35302A'] },
  { id: 'a3', title: '[Sample still life 3]', artist: '[Artist, date]', fill: ['#66605A', '#2A2622'] },
  { id: 'a4', title: '[Sample still life 4]', artist: '[Artist, date]', fill: ['#74695B', '#30291F'] },
  { id: 'a5', title: '[Sample still life 5]', artist: '[Artist, date]', fill: ['#5F5A55', '#28241F'] },
  { id: 'a6', title: '[Sample still life 6]', artist: '[Artist, date]', fill: ['#7B6F60', '#332B22'] },
];

export const recipes: Record<string, Recipe> = {
  r1: {
    id: 'r1',
    name: 'Pear and almond tart',
    fill: ['#CDB89A', '#8C6F4E'],
    ingredients: [
      { name: 'Pears', amount: '4' },
      { name: 'Ground almonds', amount: '100g' },
      { name: 'Butter', amount: '100g' },
      { name: 'Caster sugar', amount: '100g' },
      { name: 'Eggs', amount: '2' },
      { name: 'Shortcrust pastry', amount: '1 sheet' },
      { name: 'Grapes', amount: 'to serve' },
    ],
    steps: [
      'Sample step. Real instructions come from the recipe provider, word for word.',
      'Sample step. Line the tin with pastry and chill while you make the filling.',
      'Sample step. Beat the butter, sugar, eggs and almonds, then spread into the case.',
      'Sample step. Arrange sliced pears on top and bake until golden.',
    ],
    sourceUrl: 'https://www.themealdb.com/',
  },
  r2: {
    id: 'r2',
    name: 'Roast chicken with grapes',
    fill: ['#C9A57E', '#7A5236'],
    ingredients: [
      { name: 'Chicken thighs', amount: '6' },
      { name: 'Red grapes', amount: '300g' },
      { name: 'Shallots', amount: '4' },
      { name: 'Thyme', amount: '4 sprigs' },
      { name: 'Olive oil', amount: '2 tbsp' },
    ],
    steps: [
      'Sample step. Real instructions come from the recipe provider, word for word.',
      'Sample step. Brown the chicken, then add shallots, grapes and thyme.',
      'Sample step. Roast until the grapes burst and the chicken is cooked through.',
    ],
    sourceUrl: 'https://www.themealdb.com/',
  },
  r3: {
    id: 'r3',
    name: 'Bread pudding',
    fill: ['#D9B98C', '#95683F'],
    ingredients: [
      { name: 'Stale bread', amount: '400g' },
      { name: 'Milk', amount: '500ml' },
      { name: 'Eggs', amount: '3' },
      { name: 'Raisins', amount: '100g' },
      { name: 'Nutmeg', amount: 'a pinch' },
    ],
    // No written method: the recipe page shows "See the full recipe" instead.
    steps: [],
    sourceUrl: 'https://www.themealdb.com/',
  },
};

// Each sample painting shows a different recipe-screen state, so every
// approved design can be tapped through.
export const results: Record<string, ArtworkResult | 'error'> = {
  a1: { spotted: ['pear', 'grapes', 'bread'], recipeIds: ['r1', 'r2'], matches: { r1: ['pear', 'grapes'], r2: ['grapes'] } },
  a2: { spotted: ['bread', 'raisins'], recipeIds: ['r3'], matches: { r3: ['bread', 'raisins'] } },
  a3: { spotted: ['lemon', 'oysters'], recipeIds: [], matches: {} },
  a4: { spotted: ['grapes', 'pear'], recipeIds: ['r2', 'r1'], matches: { r2: ['grapes'], r1: ['pear', 'grapes'] } },
  a5: 'error', // fails the first time, so the "kitchen is closed" screen can be seen
  a6: { spotted: ['bread'], recipeIds: ['r3'], matches: { r3: ['bread'] } },
};

// Rotating copy for the no-recipes screen (all picked by Madhura).
export const noRecipeLines = [
  'Only found in paint!',
  'This feast is for looking only.',
  'Still life, no recipe.',
  'The artist kept this one secret.',
  "Museum rules: look, don't eat.",
  'Too painterly for the kitchen.',
];

export const noRecipeButtons = ['Find a tastier painting', 'Try another masterpiece', 'Visit another canvas'];
