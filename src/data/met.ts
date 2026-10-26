import type { Artwork } from './types';

// The Met Collection API: free, no key, and it allows calls straight from
// the browser (it sends Access-Control-Allow-Origin: *). Object records live
// on v1; only search moved to v1.1, and the app doesn't search.
// Docs: https://metmuseum.github.io/
const OBJECTS = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

// The parts of a Met object record the app uses. The real record has ~60 fields.
type MetObject = {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  objectURL: string;
};

// One request per painting per visit: the first fetch is remembered, and
// later screens reuse it. Failed fetches are forgotten so "Try again" retries.
const cache = new Map<string, Promise<Artwork>>();

export function fetchArtwork(id: string): Promise<Artwork> {
  let p = cache.get(id);
  if (!p) {
    p = load(id);
    p.catch(() => cache.delete(id));
    cache.set(id, p);
  }
  return p;
}

// What the app already has for a painting, without waiting. Lets the
// recipes screen show the title straight away after a tap.
const loaded = new Map<string, Artwork>();
export function cachedArtwork(id: string): Artwork | undefined {
  return loaded.get(id);
}

async function load(id: string): Promise<Artwork> {
  const res = await fetch(`${OBJECTS}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Met object ${id}: HTTP ${res.status}`);
  const o = (await res.json()) as Partial<MetObject>;
  const image = o.primaryImageSmall || o.primaryImage;
  // Only public-domain works with an image may appear (Met Open Access, CC0).
  // The list is curated, but the Met can change a record, so check anyway.
  if (!o.isPublicDomain || !image || !o.title) throw new Error(`Met object ${id} is not usable`);
  const artwork: Artwork = {
    id,
    title: o.title,
    artist: [o.artistDisplayName || 'Unknown artist', o.objectDate].filter(Boolean).join(', '),
    image,
    sourceUrl: o.objectURL || `https://www.metmuseum.org/art/collection/search/${id}`,
  };
  loaded.set(id, artwork);
  return artwork;
}
