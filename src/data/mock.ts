// Sample recipe data. Paintings are real (from the Met) since Milestone 2;
// real recipes arrive from TheMealDB in Milestone 3, and AI-spotted foods
// in Milestone 4.

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

// Sample recipe results until Milestone 3. Paintings take these in turn by
// their place in the gallery list, so every approved recipe-screen state
// can still be tapped through. They don't describe the real paintings.
export const results: (ArtworkResult | 'error')[] = [
  { spotted: ['pear', 'grapes', 'bread'], recipeIds: ['r1', 'r2'], matches: { r1: ['pear', 'grapes'], r2: ['grapes'] } },
  { spotted: ['bread', 'raisins'], recipeIds: ['r3'], matches: { r3: ['bread', 'raisins'] } },
  { spotted: ['lemon', 'oysters'], recipeIds: [], matches: {} },
  { spotted: ['grapes', 'pear'], recipeIds: ['r2', 'r1'], matches: { r2: ['grapes'], r1: ['pear', 'grapes'] } },
  'error', // fails the first time, so the "kitchen is closed" screen can be seen
  { spotted: ['bread'], recipeIds: ['r3'], matches: { r3: ['bread'] } },
];

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
