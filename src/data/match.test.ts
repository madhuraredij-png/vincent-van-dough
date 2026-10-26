/// <reference types="node" />
// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { rankMeals, splitSteps, type Food, type MealHit } from './match.ts';

const meal = (id: string, name = `Meal ${id}`): MealHit => ({ id, name, image: `${id}.jpg` });

const pear: Food = { label: 'pear', ingredients: ['Pears'] };
const grapes: Food = { label: 'grapes', ingredients: ['Grapes', 'Red Grapes'] };
const bread: Food = { label: 'bread', ingredients: ['Bread'] };

test('a meal that uses more of the foods ranks first', () => {
  const r = rankMeals([pear, grapes], [[meal('1', 'A'), meal('2', 'B')], [meal('2', 'B')]]);
  assert.deepEqual(r.map((x) => x.meal.id), ['2', '1']);
  assert.deepEqual(r[0].foods, ['pear', 'grapes']);
  assert.deepEqual(r[1].foods, ['pear']);
});

test('a meal found under two names for the same food counts once', () => {
  // Searched as "Grapes" and "Red Grapes": the caller merges both into one list.
  const r = rankMeals([grapes, bread], [[meal('1'), meal('1')], [meal('2')]]);
  assert.deepEqual(r.find((x) => x.meal.id === '1')?.foods, ['grapes']);
});

test('each meal appears once', () => {
  const r = rankMeals([pear, grapes, bread], [[meal('1')], [meal('1')], [meal('1')]]);
  assert.equal(r.length, 1);
  assert.equal(r[0].foods.length, 3);
});

test('ties are ordered by name unless a tie-break says otherwise', () => {
  const hits = [[meal('1', 'Cake'), meal('2', 'Apple pie'), meal('3', 'Bread pudding')]];
  assert.deepEqual(rankMeals([pear], hits).map((x) => x.meal.name), ['Apple pie', 'Bread pudding', 'Cake']);
  const reversed = rankMeals([pear], hits, (t) => [...t].reverse());
  assert.deepEqual(reversed.map((x) => x.meal.name), ['Cake', 'Bread pudding', 'Apple pie']);
});

test('among meals using as many foods, the rarer food wins', () => {
  // Lemon turns up in three recipes, oysters in one.
  const oysters: Food = { label: 'oysters', ingredients: ['Oysters'] };
  const lemon: Food = { label: 'lemon', ingredients: ['Lemon'] };
  const r = rankMeals([oysters, lemon], [[meal('9', 'Zebra pie')], [meal('1', 'A'), meal('2', 'B'), meal('3', 'C')]]);
  assert.equal(r[0].meal.name, 'Zebra pie');
});

test('rarity never beats using more of the foods', () => {
  const oysters: Food = { label: 'oysters', ingredients: ['Oysters'] };
  const r = rankMeals([oysters, pear, grapes], [[meal('9')], [meal('1'), meal('2')], [meal('1'), meal('3')]]);
  assert.equal(r[0].meal.id, '1');
});

test('a tie-break only shuffles equally good matches', () => {
  const lemon: Food = { label: 'lemon', ingredients: ['Lemon'] };
  const r = rankMeals([pear, lemon], [[meal('9')], [meal('1'), meal('2')]], (t) => [...t].reverse());
  assert.deepEqual(r.map((x) => x.meal.id), ['9', '2', '1']);
});

test('the recipe for a prepared food comes first', () => {
  // A print of sushi with sake: the sushi recipe beats a recipe using both.
  const sushi: Food = { label: 'sushi', ingredients: ['Sushi Rice'], dishes: ['7'] };
  const sake: Food = { label: 'sake', ingredients: ['Sake'] };
  const r = rankMeals([sushi, sake], [[meal('7', 'Sushi'), meal('1', 'Rice bowl')], [meal('1', 'Rice bowl')]]);
  assert.deepEqual(r.map((x) => [x.meal.id, x.dish]), [['7', true], ['1', false]]);
});

test('several dish recipes are shuffled together, ahead of the rest', () => {
  const bread: Food = { label: 'bread', ingredients: ['Bread'], dishes: ['1', '2'] };
  const r = rankMeals([bread, pear], [[meal('1', 'A'), meal('2', 'B'), meal('3', 'C')], [meal('3', 'C')]], (t) => [...t].reverse());
  assert.deepEqual(r.map((x) => x.meal.id), ['2', '1', '3']);
});

test('a tie-break never lifts a weaker match above a stronger one', () => {
  const r = rankMeals([pear, grapes], [[meal('1'), meal('2'), meal('3')], [meal('3')]], (t) => [...t].reverse());
  assert.equal(r[0].meal.id, '3');
});

test('no foods or no hits gives no recipes', () => {
  assert.deepEqual(rankMeals([], []), []);
  assert.deepEqual(rankMeals([pear], [[]]), []);
});

test('steps split on line breaks and drop blank lines', () => {
  assert.deepEqual(splitSteps('Mix it.\r\n\r\nBake it.\r\n'), ['Mix it.', 'Bake it.']);
});

test('step labels and numbers are removed, the words are kept', () => {
  assert.deepEqual(splitSteps('STEP 1\r\nPreheat.\r\nstep 2: Mix.\r\n3. Bake at 180C.\r\n4) Serve.'), [
    'Preheat.',
    'Mix.',
    'Bake at 180C.',
    'Serve.',
  ]);
});

test('a number that starts a sentence is kept', () => {
  assert.deepEqual(splitSteps('2 eggs go in last.'), ['2 eggs go in last.']);
});

test('missing method text gives no steps', () => {
  assert.deepEqual(splitSteps(null), []);
  assert.deepEqual(splitSteps('   '), []);
});

test('a decimal amount at the start of a line is kept', () => {
  assert.deepEqual(splitSteps('1.5 litres of stock go in next.'), ['1.5 litres of stock go in next.']);
});
