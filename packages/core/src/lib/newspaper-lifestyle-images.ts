/**
 * Newspaper lifestyle image paths and alt text.
 * Files: shared_assets/newspaper/lifestyle/lifestyle_1.jpg … lifestyle_26.jpg.
 * Use with getSharedAssetUrl to build full URLs.
 */

export interface NewspaperLifestyleImage {
  path: string;
  alt: string;
}

const LIFESTYLE_COUNT = 26;
const BASE_PATH = "newspaper/lifestyle";

const ALTS: string[] = [
  "Framed vintage newspaper clipping in home office setting",
  "Historic newspaper front page in classic black frame",
  "Sports championship newspaper headline in custom frame",
  "Wedding announcement newspaper clipping framed with mat",
  "Birth announcement newspaper in nursery setting",
  "Historic news event front page in dark wood frame",
  "Local newspaper milestone article professionally framed",
  "Vintage newspaper clipping in rustic frame display",
  "Championship game newspaper headline in sports room",
  "Historic newspaper front page preserved in custom frame",
  "Newspaper obituary memorial framed with archival materials",
  "Graduation announcement newspaper clipping in frame",
  "Vintage newspaper in library setting with classic frame",
  "Sports victory newspaper headline in man cave display",
  "Historic event newspaper preserved in archival frame",
  "Newspaper birth announcement in baby room setting",
  "Championship newspaper clipping in sports memorabilia display",
  "Vintage newspaper article in elegant home office",
  "Historic newspaper front page with custom matting",
  "Newspaper milestone announcement professionally framed",
  "Sports championship newspaper held by proud fan",
  "Championship title newspaper in sports collection room",
  "Space shuttle newspaper headline in kids bedroom",
  "UFO sighting newspaper clipping in retro room display",
  "Historic presidential newspaper in traditional setting",
  "Space shuttle launch newspaper in child bedroom",
];

export function getNewspaperLifestyleImages(): NewspaperLifestyleImage[] {
  const out: NewspaperLifestyleImage[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      path: `${BASE_PATH}/lifestyle_${i}.jpg`,
      alt: ALTS[i - 1] ?? `Newspaper frame lifestyle ${i}`,
    });
  }
  return out;
}

export function getRandomNewspaperLifestyleImage(): NewspaperLifestyleImage | null {
  const images = getNewspaperLifestyleImages();
  if (images.length === 0) return null;
  const index = Math.floor(Math.random() * images.length);
  return images[index] ?? null;
}
