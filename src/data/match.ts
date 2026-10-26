// Ranking recipes for a painting. TheMealDB's free key can only search one
// ingredient at a time, so we search once per food and count how many of
// those searches each meal turned up in. A meal found for both "pear" and
// "grapes" uses both, so it ranks above one found for "pear" alone.

// A food in a painting: the word shown to people ("grapes") and the
// TheMealDB ingredient names to search for it (its list spells things its
// own way, e.g. "Red Grapes"). A prepared food, like sushi, also names the
// TheMealDB recipes for that dish by meal ID, and those come first.
export type Food = { label: string; ingredients: string[]; dishes?: string[] };

// One search result: TheMealDB's filter gives only the id, name and photo.
export type MealHit = { id: string; name: string; image: string };

// `dish` is true when the meal is the recipe for a prepared food in the
// painting (the sushi recipe for a print of sushi).
export type Ranked = { meal: MealHit; foods: string[]; dish: boolean };

// `hits` holds each food's search results, in the same order as `foods`.
// Returns meals best first, each with the foods (labels) it uses. A meal
// listed under two ingredient names of the same food still counts once.
//
// `hits[i]` should include the food's dish recipes, if it has any.
//
// Order (Madhura's rules, 2026-10-26): the recipe for a prepared food in the
// painting comes first. Then by how many of the foods a meal uses. Among meals that use
// the same number, rarer foods count for more: oysters turn up in one
// recipe and lemon in fifty, so the oyster recipe is the better match for
// a painting of oysters with a lemon garnish. Meals still level after that
// keep a stable order (by name) unless `tieBreak` reorders them.
export function rankMeals(
  foods: Food[],
  hits: MealHit[][],
  tieBreak: (tied: Ranked[]) => Ranked[] = (t) => t,
): Ranked[] {
  const byId = new Map<string, Ranked>();
  const rarity = new Map<string, number>();
  foods.forEach((food, i) => {
    const ids = new Set((hits[i] ?? []).map((m) => m.id));
    rarity.set(food.label, ids.size ? 1 / ids.size : 0);
    for (const meal of hits[i] ?? []) {
      const r = byId.get(meal.id) ?? { meal, foods: [], dish: false };
      if (!r.foods.includes(food.label)) r.foods.push(food.label);
      if (food.dishes?.includes(meal.id)) r.dish = true;
      byId.set(meal.id, r);
    }
  });
  const score = (r: Ranked) => r.foods.reduce((sum, f) => sum + (rarity.get(f) ?? 0), 0);
  // Scores are fractions, so compare them with a little slack.
  // Dish recipes are level with each other whatever foods they use.
  const level = (a: Ranked, b: Ranked) =>
    a.dish === b.dish && (a.dish || (a.foods.length === b.foods.length && Math.abs(score(a) - score(b)) < 1e-9));
  const sorted = [...byId.values()].sort(
    (a, b) =>
      Number(b.dish) - Number(a.dish) ||
      (a.dish ? 0 : b.foods.length - a.foods.length) ||
      (level(a, b) ? 0 : score(b) - score(a)) ||
      a.meal.name.localeCompare(b.meal.name),
  );
  // Reorder within each run of equally good matches.
  const out: Ranked[] = [];
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (j < sorted.length && level(sorted[j], sorted[i])) j++;
    out.push(...tieBreak(sorted.slice(i, j)));
    i = j;
  }
  return out;
}

// TheMealDB writes method text as one block: lines split by line breaks,
// sometimes with "STEP 1" headings or "1." numbers. The app numbers steps
// itself, so those labels go; the words stay as written.
export function splitSteps(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/^\s*(step\s*\d+\s*[:.)-]?|\d+[.)](?!\d)|[-•▢])\s*/i, '')
        .trim(),
    )
    .filter((line) => line.length > 0);
}
