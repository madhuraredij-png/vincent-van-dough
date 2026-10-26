/// <reference types="node" />
// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { FOODS } from './foods.ts';
import { HOUSE_RECIPES, houseRecipe, houseRecipesUsing } from './house-recipes.ts';

test('every house recipe has a unique vvd- id, ingredients and steps', () => {
  const ids = HOUSE_RECIPES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const r of HOUSE_RECIPES) {
    assert.match(r.id, /^vvd-/);
    assert.ok(r.ingredients.length > 0, r.id);
    assert.ok(r.steps.length > 0, r.id);
    assert.equal(r.by, 'house');
  }
});

test('every house dish named in foods.ts exists', () => {
  for (const [artwork, foods] of Object.entries(FOODS)) {
    for (const id of foods.flatMap((f) => f.dishes ?? []).filter((d) => d.startsWith('vvd-'))) {
      assert.ok(houseRecipe(id), `${artwork} names missing house recipe ${id}`);
    }
  }
});

test('house recipes turn up in searches for their ingredient, in any case', () => {
  assert.deepEqual(houseRecipesUsing('grapes').map((r) => r.id), ['vvd-roasted-grapes']);
  assert.deepEqual(houseRecipesUsing('Chicken'), []);
});

test('every house recipe is reachable from some artwork', () => {
  const searched = new Set(Object.values(FOODS).flat().flatMap((f) => [...f.ingredients, ...(f.dishes ?? [])]));
  for (const r of HOUSE_RECIPES) {
    assert.ok(searched.has(r.id) || r.uses.some((u) => searched.has(u)), `${r.id} is never shown`);
  }
});
