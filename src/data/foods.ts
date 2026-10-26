import type { Food } from './match';

// The foods in each artwork, by Met object ID, until AI recognition arrives
// in Milestone 4. Claude drafted them by looking at each artwork; Madhura
// reviews them. `label` is what the app shows after "Spotted:";
// `ingredients` are the TheMealDB names searched for it (its list is at
// www.themealdb.com/api/json/v1/1/list.php?i=list). An empty list means
// TheMealDB has no recipes with that food, so it is shown but not searched.
// Written f(label, ...ingredients) to keep each artwork on one line.
// An artwork with no entry shows the no-recipes screen.
const f = (label: string, ...ingredients: string[]): Food => ({ label, ingredients });

export const FOODS: Record<string, Food[]> = {
  // The Brioche
  '436946': [f('brioche', 'Bread'), f('plums'), f('peaches', 'Peaches'), f('grapes')],
  // Still Life with Apples and Pears
  '435883': [f('apples', 'Apples', 'Cooking Apples'), f('pears', 'Pears')],
  // Still Life with a Ginger Jar and Eggplants
  '435881': [f('eggplants', 'Aubergine', 'Egg Plants', 'Baby Aubergine'), f('lemon', 'Lemon', 'Lemons'), f('apples', 'Apples'), f('pears', 'Pears')],
  // Strawberries
  '436963': [f('strawberries', 'Strawberries')],
  // Still Life with Ham
  '437513': [f('ham', 'Ham', 'Smoked Ham'), f('bread', 'Bread'), f('wine', 'Red Wine')],
  // Still Life
  '436305': [f('lemon', 'Lemon', 'Lemons'), f('bread', 'Bread'), f('walnuts', 'Walnuts'), f('wine', 'White Wine', 'Dry White Wine')],
  // Still Life with a Glass and Oysters
  '436636': [f('oysters', 'Oysters'), f('lemon', 'Lemon', 'Lemons'), f('grapes')],
  // Still Life with Lobster and Fruit
  '435663': [f('lobster', 'Lobster'), f('lemon', 'Lemon', 'Lemons'), f('peaches', 'Peaches'), f('grapes'), f('melon')],
  // Still Life: A Banqueting Scene
  '436637': [f('lobster', 'Lobster'), f('lemon', 'Lemon', 'Lemons'), f('peaches', 'Peaches'), f('grapes')],
  // Basket of Fruit
  '816624': [f('figs', 'Figs'), f('pomegranate', 'Pomegranate'), f('grapes'), f('quince')],
  // Still Life of Fruit and Game
  '437238': [f('duck', 'Duck Legs', 'Duck'), f('peaches', 'Peaches'), f('grapes'), f('hare')],
  // A Cat Stealing Fish
  '437376': [f('fish', 'White Fish', 'White Fish Fillets', 'Fish fillet'), f('pomegranate', 'Pomegranate')],
  // Fish Market
  '679844': [f('salmon', 'Salmon'), f('cod', 'Cod'), f('carp')],
  // Still Life with a Vase of Flowers, Melon, Peaches, and Grapes
  '888924': [f('peaches', 'Peaches'), f('melon'), f('grapes')],
  // Still Life with Strawberries
  '436345': [f('strawberries', 'Strawberries'), f('peas', 'Peas', 'Frozen Peas'), f('asparagus', 'Asparagus'), f('artichoke')],
  // New Year's Sake and Sushi
  '54455': [f('sushi', 'Sushi Rice'), f('tuna', 'Tuna'), f('sake', 'Sake')],
  // Wine Goblet and Lacquer Food Box with New Year's Meal
  '54731': [f('rice', 'Rice'), f('shrimp', 'Shrimp', 'Prawns'), f('sake', 'Sake')],
  // Teabowl and Powder Cake in a Tube
  '54105': [f('rice cake', 'Rice Flour', 'Sticky Rice Flour', 'Glutinous Rice'), f('tea')],
  // Princess with Attendants Picnicking in the Open Air, Folio from the Da
  '448468': [f('rice', 'Rice', 'Basmati Rice'), f('fruit')],
  // Ebisu and Daikoku Celebrating the New Year Festival
  '57260': [f('sea bream', 'White Fish', 'Fish fillet'), f('sake', 'Sake'), f('rice', 'Rice')],
  // The Kitchen of a Joroya.
  '37254': [f('rice', 'Rice'), f('fish', 'White Fish', 'Fish fillet')],
  // Kitchen Scene
  '437956': [f('chicken', 'Chicken'), f('beef', 'Beef'), f('eggs', 'Eggs'), f('duck', 'Duck Legs', 'Duck')],
  // The Fat Kitchen
  '392424': [f('sausages', 'Sausages'), f('ham', 'Ham'), f('chicken', 'Chicken'), f('pork', 'Pork')],
  // The Thin Kitchen
  '392426': [f('mussels', 'Mussels'), f('turnips', 'Turnips'), f('bread', 'Bread')],
  // Kitchen Scene
  '370463': [f('bread', 'Bread'), f('cheese', 'Cheese'), f('herring', 'Herring')],
  // The Squire's Kitchen
  '358677': [f('ham', 'Ham'), f('turkey', 'Turkey'), f('beef', 'Beef')],
  // The Peeler
  '745661': [f('turnips', 'Turnips'), f('pumpkin', 'Pumpkin')],
  // Broken Eggs
  '436579': [f('eggs', 'Eggs')],
  // Baker Boy
  '398223': [f('bread', 'Bread', 'Bread Rolls')],
  // The Feast of Acheloüs
  '437525': [f('oysters', 'Oysters'), f('fish', 'White Fish', 'Fish fillet'), f('lobster', 'Lobster')],
  // Halt of the Hunt
  '437865': [f('bread', 'Bread'), f('chicken', 'Chicken'), f('wine', 'Red Wine')],
  // The Silver Tureen
  '435887': [f('hare'), f('apples', 'Apples'), f('pears', 'Pears'), f('orange', 'Orange')],
  // The Breakfast
  '810982': [f('turkey', 'Turkey'), f('bread', 'Bread')],
  // At Dinner
  '811061': [f('chicken', 'Chicken'), f('eggs', 'Eggs')],
};
