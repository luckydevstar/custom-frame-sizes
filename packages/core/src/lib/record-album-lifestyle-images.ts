/**
 * Record Album (Vinyl) Lifestyle Images
 * Used in RecordAlbumDesigner for background/lifestyle photo.
 * Naming: Record_Frame_Lifestyle (1).png ... (49).png; images 43-48 use .jpg.
 */

const RECORD_ALBUM_LIFESTYLE_COUNT = 49;
const BASE_PATH = "/images/record-album-lifestyle/Record_Frame_Lifestyle";
const EXTENSION_OVERRIDES: Record<number, string> = {
  43: "jpg",
  44: "jpg",
  45: "jpg",
  46: "jpg",
  47: "jpg",
  48: "jpg",
};

function getExtension(index: number): string {
  return EXTENSION_OVERRIDES[index] ?? "png";
}

/**
 * Get record album lifestyle image URL by index (1-based).
 */
export function getRecordAlbumLifestyleImageUrl(index: number): string {
  if (index < 1 || index > RECORD_ALBUM_LIFESTYLE_COUNT) {
    return `${BASE_PATH} (1).png`;
  }
  const ext = getExtension(index);
  return `${BASE_PATH} (${index}).${ext}`;
}

/**
 * Get a random record album lifestyle image URL (for designer background).
 */
export function getRandomRecordAlbumLifestyleImageUrl(): string {
  const index = Math.floor(Math.random() * RECORD_ALBUM_LIFESTYLE_COUNT) + 1;
  return getRecordAlbumLifestyleImageUrl(index);
}
