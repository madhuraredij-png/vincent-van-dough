import type { Recipe } from './types';

// Recipes written for this app, for foods and dishes TheMealDB doesn't have
// (Madhura's call, 2026-10-26). Nobody has cooked them yet, so the recipe
// screen labels them "Written for this app, not kitchen-tested".
//
// Each one lists the ingredient names it answers to (`uses`), spelled the
// way foods.ts searches TheMealDB, so it turns up in the same searches. IDs
// start with "vvd-" so they can't clash with TheMealDB's numeric IDs.

export type HouseRecipe = Recipe & { uses: string[] };

const house = (r: Omit<HouseRecipe, 'sourceUrl' | 'by' | 'image'>): HouseRecipe => ({ ...r, image: '', sourceUrl: '', by: 'house' });

export const HOUSE_RECIPES: HouseRecipe[] = [
  house({
    id: 'vvd-brioche',
    name: 'Brioche loaf',
    uses: ['Brioche'],
    fill: ['#E2B66E', '#8A5A2B'],
    ingredients: [
      { name: 'Strong white bread flour', amount: '500g' },
      { name: 'Fast-action dried yeast', amount: '7g' },
      { name: 'Caster sugar', amount: '50g' },
      { name: 'Salt', amount: '1 tsp' },
      { name: 'Eggs', amount: '5, plus 1 to glaze' },
      { name: 'Milk, lukewarm', amount: '80ml' },
      { name: 'Unsalted butter, soft', amount: '250g' },
    ],
    steps: [
      'Mix the flour, yeast, sugar and salt in a large bowl. Add the 5 eggs and the milk and bring it together into a sticky dough.',
      'Knead for 10 minutes, by hand or with a dough hook, until smooth and stretchy.',
      'Add the butter a little at a time, kneading after each piece until it disappears. The dough will be soft and glossy.',
      'Cover and chill overnight. Cold dough is much easier to shape.',
      'Butter a 900g loaf tin. Divide the dough into 6 balls and pack them into the tin in two rows.',
      'Cover and leave somewhere warm for 1 to 2 hours, until the dough reaches the top of the tin.',
      'Heat the oven to 190C (170C fan). Beat the last egg and brush it over the top.',
      'Bake for 30 to 35 minutes until deep golden. If it browns too fast, cover loosely with foil. Cool in the tin for 10 minutes, then on a rack.',
    ],
  }),
  house({
    id: 'vvd-roasted-grapes',
    name: 'Roasted grapes on ricotta toast',
    uses: ['Grapes'],
    fill: ['#B9A7C9', '#5B3F6B'],
    ingredients: [
      { name: 'Red or black grapes', amount: '400g' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Honey', amount: '1 tbsp' },
      { name: 'Thyme', amount: '4 sprigs' },
      { name: 'Ricotta', amount: '250g' },
      { name: 'Sourdough', amount: '4 thick slices' },
      { name: 'Salt and black pepper', amount: 'to taste' },
    ],
    steps: [
      'Heat the oven to 220C (200C fan).',
      'Toss the grapes with the olive oil, honey, thyme and a pinch of salt on a baking tray.',
      'Roast for 15 to 20 minutes, until the grapes are blistered and some have burst into a syrup.',
      'Toast the bread. Spread it thickly with ricotta.',
      'Spoon the warm grapes and their juices over the toast, then finish with black pepper.',
    ],
  }),
  house({
    id: 'vvd-roasted-plums',
    name: 'Honey-roasted plums with yogurt',
    uses: ['Plums'],
    fill: ['#B5677B', '#5A2335'],
    ingredients: [
      { name: 'Ripe plums', amount: '8' },
      { name: 'Honey', amount: '3 tbsp' },
      { name: 'Orange', amount: '1, zest and juice' },
      { name: 'Cinnamon stick', amount: '1' },
      { name: 'Greek yogurt', amount: 'to serve' },
    ],
    steps: [
      'Heat the oven to 200C (180C fan).',
      'Halve the plums and remove the stones. Lay them cut side up in a baking dish.',
      'Drizzle with the honey and orange juice, scatter over the zest and tuck in the cinnamon stick.',
      'Roast for 20 to 25 minutes, until soft and sitting in a pink syrup.',
      'Serve warm with spoonfuls of yogurt and the syrup poured over.',
    ],
  }),
  house({
    id: 'vvd-melon-salad',
    name: 'Melon, mint and lime salad',
    uses: ['Melon'],
    fill: ['#E8B07A', '#8C5B2E'],
    ingredients: [
      { name: 'Cantaloupe melon', amount: '1' },
      { name: 'Lime', amount: '1' },
      { name: 'Honey', amount: '1 tsp' },
      { name: 'Mint leaves', amount: 'a handful' },
      { name: 'Flaky salt', amount: 'a pinch' },
    ],
    steps: [
      'Halve the melon, scoop out the seeds, cut away the skin and slice the flesh into thin wedges.',
      'Whisk the lime zest and juice with the honey.',
      'Lay the melon on a plate and pour the dressing over.',
      'Tear over the mint and finish with a pinch of flaky salt. Serve cold.',
    ],
  }),
  house({
    id: 'vvd-poached-quince',
    name: 'Poached quince',
    uses: ['Quince'],
    fill: ['#E0B25C', '#9A4A2C'],
    ingredients: [
      { name: 'Quinces', amount: '3' },
      { name: 'Water', amount: '1 litre' },
      { name: 'Sugar', amount: '200g' },
      { name: 'Lemon', amount: '1, juice and a strip of peel' },
      { name: 'Vanilla pod', amount: '1, split' },
    ],
    steps: [
      'Put the water, sugar, lemon peel and vanilla in a wide pan and heat gently until the sugar dissolves.',
      'Peel the quinces, quarter them and cut out the hard cores. Drop the pieces into the syrup as you go, with the lemon juice, so they don’t brown.',
      'Cover with a circle of baking paper and simmer very gently for 1.5 to 2 hours, until tender and turned a deep pink.',
      'Serve warm or cold with cream or yogurt. They keep in their syrup in the fridge for a week.',
    ],
  }),
  house({
    id: 'vvd-braised-hare',
    name: 'Hare braised in red wine',
    uses: ['Hare'],
    fill: ['#8E5A4A', '#3E2219'],
    ingredients: [
      { name: 'Hare, jointed', amount: '1 (about 1.5kg)' },
      { name: 'Red wine', amount: '750ml' },
      { name: 'Smoked bacon lardons', amount: '150g' },
      { name: 'Onions', amount: '2, chopped' },
      { name: 'Carrots', amount: '2, chopped' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Plain flour', amount: '2 tbsp' },
      { name: 'Bay leaves', amount: '2' },
      { name: 'Thyme', amount: '4 sprigs' },
      { name: 'Olive oil', amount: '2 tbsp' },
    ],
    steps: [
      'Heat the oven to 160C (140C fan).',
      'Season the hare pieces and brown them in the oil in a large casserole, in batches. Set aside.',
      'Fry the bacon, onions and carrots in the same pan for 10 minutes until soft. Add the garlic for 1 minute.',
      'Stir in the flour, then pour in the wine a little at a time, scraping up the browned bits.',
      'Return the hare, add the bay and thyme, and bring to a simmer.',
      'Cover and cook in the oven for 2.5 to 3 hours, until the meat falls from the bone.',
      'Check the seasoning and serve with mashed potato or buttered noodles.',
    ],
  }),
  house({
    id: 'vvd-braised-artichokes',
    name: 'Braised artichokes with lemon',
    uses: ['Artichoke'],
    fill: ['#9AAE7A', '#45552F'],
    ingredients: [
      { name: 'Globe artichokes', amount: '4' },
      { name: 'Lemons', amount: '2' },
      { name: 'Olive oil', amount: '100ml' },
      { name: 'Garlic', amount: '3 cloves, sliced' },
      { name: 'White wine', amount: '150ml' },
      { name: 'Parsley', amount: 'a handful, chopped' },
      { name: 'Mint', amount: 'a few leaves' },
    ],
    steps: [
      'Fill a bowl with water and the juice of 1 lemon.',
      'Pull off the tough outer leaves of each artichoke, trim the stem and cut off the top third. Halve them and scoop out the hairy choke. Drop each one into the lemon water.',
      'Warm the oil in a wide pan and soften the garlic for a minute.',
      'Add the drained artichokes cut side down, the wine and the juice of the second lemon.',
      'Cover and simmer gently for 20 to 25 minutes, until a knife slides easily into the base.',
      'Scatter with parsley and mint and serve warm, with bread for the juices.',
    ],
  }),
  house({
    id: 'vvd-baked-carp',
    name: 'Baked carp with paprika and potatoes',
    uses: ['Carp'],
    fill: ['#C9955C', '#6B4426'],
    ingredients: [
      { name: 'Carp fillets, skin on', amount: '4' },
      { name: 'Potatoes', amount: '800g, thinly sliced' },
      { name: 'Onion', amount: '1, sliced' },
      { name: 'Sweet paprika', amount: '2 tsp' },
      { name: 'Butter', amount: '50g, melted' },
      { name: 'Sour cream', amount: '150ml' },
      { name: 'Salt', amount: 'to taste' },
    ],
    steps: [
      'Heat the oven to 200C (180C fan).',
      'Toss the potatoes and onion with half the butter and some salt. Spread in a roasting tin and bake for 25 minutes.',
      'Season the carp with salt and the paprika.',
      'Lay the fish skin side up on the potatoes and brush with the rest of the butter.',
      'Bake for 15 to 20 minutes, until the fish is opaque and flakes easily.',
      'Serve with sour cream spooned over.',
    ],
  }),
  house({
    id: 'vvd-ebi-no-umani',
    name: 'New Year simmered prawns (ebi no umani)',
    uses: [],
    fill: ['#E59A6E', '#8C3B22'],
    ingredients: [
      { name: 'Large shell-on prawns', amount: '8' },
      { name: 'Dashi stock', amount: '200ml' },
      { name: 'Sake', amount: '3 tbsp' },
      { name: 'Mirin', amount: '3 tbsp' },
      { name: 'Light soy sauce', amount: '1.5 tbsp' },
      { name: 'Sugar', amount: '1 tsp' },
    ],
    steps: [
      'Leave the prawns in their shells. Snip off the legs and devein them through the back with a toothpick.',
      'Bring the dashi, sake, mirin, soy sauce and sugar to a simmer in a small pan.',
      'Add the prawns and simmer for 3 to 4 minutes, turning once, until they turn red and curl.',
      'Take the pan off the heat and let the prawns cool in the liquid so they soak up the flavour.',
      'Serve cold, as part of a New Year box.',
    ],
  }),
  house({
    id: 'vvd-kinako-dango',
    name: 'Rice-flour dumplings with roasted soy flour (kinako dango)',
    uses: [],
    fill: ['#E3CFA3', '#9C7B45'],
    ingredients: [
      { name: 'Glutinous rice flour (shiratamako)', amount: '100g' },
      { name: 'Water', amount: 'about 90ml' },
      { name: 'Kinako (roasted soy flour)', amount: '3 tbsp' },
      { name: 'Sugar', amount: '2 tbsp' },
      { name: 'Salt', amount: 'a pinch' },
    ],
    steps: [
      'Mix the rice flour with the water a little at a time until it feels like an earlobe: soft, smooth and not sticky.',
      'Roll into 16 small balls.',
      'Drop them into a pan of boiling water. When they float, cook 2 minutes more.',
      'Lift them into a bowl of cold water, then drain.',
      'Mix the kinako, sugar and salt, and roll the dumplings in it. Eat the same day, with green tea.',
    ],
  }),
  house({
    id: 'vvd-tai-shioyaki',
    name: 'Salt-grilled sea bream (tai no shioyaki)',
    uses: [],
    fill: ['#D98C7A', '#7A3A2E'],
    ingredients: [
      { name: 'Whole sea bream, cleaned', amount: '1 (about 500g)' },
      { name: 'Sea salt', amount: '1 tbsp' },
      { name: 'Sake', amount: '1 tbsp' },
      { name: 'Lemon or sudachi', amount: 'wedges, to serve' },
    ],
    steps: [
      'Pat the fish dry and brush it with the sake.',
      'Make two shallow cuts on each side. Rub salt all over, pressing extra onto the fins and tail so they don’t burn.',
      'Leave for 15 minutes, then pat off any liquid.',
      'Grill under a hot grill for 8 to 10 minutes a side, until the skin is crisp and the flesh is opaque at the bone.',
      'Serve whole with lemon. In Japan it is eaten at New Year and celebrations.',
    ],
  }),
];

const byId = new Map(HOUSE_RECIPES.map((r) => [r.id, r]));

export function isHouseRecipe(id: string): boolean {
  return id.startsWith('vvd-');
}

export function houseRecipe(id: string): HouseRecipe | undefined {
  return byId.get(id);
}

// House recipes that answer to a searched ingredient name, as search hits.
export function houseRecipesUsing(name: string): { id: string; name: string; image: string }[] {
  const n = name.toLowerCase();
  return HOUSE_RECIPES.filter((r) => r.uses.some((u) => u.toLowerCase() === n)).map((r) => ({ id: r.id, name: r.name, image: '' }));
}
