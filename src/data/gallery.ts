// The paintings the app may show: Met object IDs picked by Madhura from the
// shortlist (public domain, with food in them). The site is public, so the
// app shows only these and never searches the Met.
// TEMPORARY: the full shortlist, until Madhura's picks replace it.
export const GALLERY_IDS: readonly string[] = [
  '437053', '436946', '437429', '437428', '435883', '435866', '437989', '435884', '435882',
  '437317', '435881', '436963', '437916', '437513', '436305', '436636', '438376', '436805',
  '435663', '436637', '436698', '816519', '816520', '816624', '712013', '437238', '437376',
  '679844', '437703', '437999', '437997', '436292', '888924', '816523', '436752', '436345',
];

// Madhura's choice: shuffle on every visit, or keep the list's order.
export const SHUFFLE = true;
