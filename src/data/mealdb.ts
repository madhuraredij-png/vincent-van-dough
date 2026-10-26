import { splitSteps, type MealHit } from './match';
import type { Ingredient, Recipe } from './types';

// TheMealDB: free with the test key "1", which is fine for a non-commercial
// project like this one. It allows calls straight from the browser (it sends
// Access-Control-Allow-Origin: *). The free key searches one ingredient at a
// time; ranking across several lives in match.ts.
// Docs: https://www.themealdb.com/api.php
const API = 'https://www.themealdb.com/api/json/v1/1';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`TheMealDB ${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

// Meals that use one ingredient. Names must match TheMealDB's ingredient
// list (www.themealdb.com/api/json/v1/1/list.php?i=list); an unknown name
// gives no meals rather than an error.
type FilterResponse = { meals: { idMeal: string; strMeal: string; strMealThumb: string }[] | null };

export async function searchIngredient(name: string): Promise<MealHit[]> {
  const data = await get<FilterResponse>(`filter.php?i=${encodeURIComponent(name)}`);
  return (data.meals ?? []).map((m) => ({ id: m.idMeal, name: m.strMeal, image: m.strMealThumb }));
}

// A full meal record. Ingredients come as 20 numbered pairs of fields, with
// the unused ones empty.
type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string | null;
  strSource: string | null;
} & Record<`strIngredient${number}` | `strMeasure${number}`, string | null>;

const recipes = new Map<string, Promise<Recipe>>();
const loaded = new Map<string, Recipe>();

// One request per recipe per visit. Failed fetches are forgotten so "Try
// again" retries.
export function fetchRecipe(id: string): Promise<Recipe> {
  let p = recipes.get(id);
  if (!p) {
    p = lookup(id);
    p.catch(() => recipes.delete(id));
    recipes.set(id, p);
  }
  return p;
}

export function cachedRecipe(id: string): Recipe | undefined {
  return loaded.get(id);
}

async function lookup(id: string): Promise<Recipe> {
  const data = await get<{ meals: Meal[] | null }>(`lookup.php?i=${encodeURIComponent(id)}`);
  const m = data.meals?.[0];
  if (!m) throw new Error(`TheMealDB has no meal ${id}`);
  const recipe = toRecipe(m);
  loaded.set(id, recipe);
  return recipe;
}

export function toRecipe(m: Meal): Recipe {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = m[`strIngredient${i}`]?.trim();
    if (name) ingredients.push({ name, amount: m[`strMeasure${i}`]?.trim() ?? '' });
  }
  return {
    id: m.idMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    ingredients,
    // Word for word from TheMealDB, only split into numbered steps.
    steps: splitSteps(m.strInstructions),
    // The cook's original page when TheMealDB has one, otherwise its own.
    sourceUrl: m.strSource?.trim() || `https://www.themealdb.com/meal/${m.idMeal}`,
  };
}
