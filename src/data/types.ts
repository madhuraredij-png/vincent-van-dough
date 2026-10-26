// A painting as the screens use it. Filled from a Met object record (see met.ts).
export type Artwork = {
  id: string; // the Met's object ID
  title: string;
  artist: string; // "Artist, date", ready to show under the title
  image: string; // image URL on images.metmuseum.org
  sourceUrl: string; // the painting's page on metmuseum.org
};
