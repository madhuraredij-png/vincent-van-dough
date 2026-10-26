// A painting as the screens use it. Filled from a Met object record (see met.ts).
export type Artwork = {
  id: string; // the Met's object ID
  title: string;
  artist: string; // "Artist, date", ready to show under the title
  image: string; // image URL on images.metmuseum.org
  sourceUrl: string; // the painting's page on metmuseum.org
};

export type Ingredient = { name: string; amount: string };

// A recipe as the screens use it. Filled from a TheMealDB meal (see mealdb.ts).
export type Recipe = {
  id: string; // TheMealDB's meal ID
  name: string;
  image: string; // photo URL on www.themealdb.com
  ingredients: Ingredient[];
  steps: string[]; // empty when the source has no written method
  sourceUrl: string;
};

// What "looking at" a painting produced: the foods spotted in it and the
// recipes that use them (at most 2, best match first).
export type ArtworkResult = {
  spotted: string[];
  recipes: Recipe[];
  // Which spotted foods each recipe uses, by recipe ID, for the "From the
  // painting" line.
  matches: Record<string, string[]>;
};
