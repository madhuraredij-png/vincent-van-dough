// The artworks the app may show: Met object IDs Madhura picked from two
// shortlists of public-domain works with food in them (2026-10-26). The site
// is public, so the app shows only these and never searches the Met.
export const GALLERY_IDS: readonly string[] = [
  // Round 1: still life paintings
  '436946', '435883', '435881', '436963', '437513', '436305', '436636', '435663',
  '436637', '816624', '437238', '437376', '679844', '888924', '436345',
  // Round 2: prepared food in other styles (prints, drawings, manuscripts)
  '54455', '54731', '54105', '448468', '57260', '37254', '437956', '392424',
  '392426', '370463', '358677', '745661', '436579', '398223', '437525', '437865',
  '435887', '810982', '811061',
];

// Shuffle on every visit, so each person sees a different first three
// (Madhura's call, 2026-10-26). false would keep the list's order.
export const SHUFFLE = true;
