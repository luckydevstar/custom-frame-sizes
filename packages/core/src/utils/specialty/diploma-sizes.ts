/**
 * Diploma and Certificate Standard Sizes Configuration
 *
 * Preset sizes for common diploma, certificate, license, and award documents.
 * Each preset includes document size and recommended frame opening with matting.
 */

export interface DiplomaSize {
  id: string;
  category:
    | "Certificate"
    | "Professional License"
    | "High School Diploma"
    | "College/University Diploma"
    | "Awards/Recognition"
    | "Military/Government"
    | "International Diploma";
  useCase: string;
  documentWidth: number;
  documentHeight: number;
  frameWidth: number;
  frameHeight: number;
  notes: string;
  displayName: string;
}

/**
 * Standard diploma and certificate sizes
 */
export const DIPLOMA_SIZES: DiplomaSize[] = [
  {
    id: "cert-letter",
    category: "Certificate",
    useCase: "General certificate (US Letter)",
    documentWidth: 11,
    documentHeight: 8.5,
    frameWidth: 14,
    frameHeight: 11,
    notes: "Standard letter size; landscape orientation",
    displayName: '11" × 8.5" — US Letter Certificate',
  },
  {
    id: "cert-a4",
    category: "Certificate",
    useCase: "International certificate (A4)",
    documentWidth: 11.69,
    documentHeight: 8.27,
    frameWidth: 14,
    frameHeight: 11,
    notes: "A4 common outside US; landscape orientation",
    displayName: '11.69" × 8.27" — A4 Certificate',
  },
  {
    id: "license-standard",
    category: "Professional License",
    useCase: "Medical/legal/trade boards",
    documentWidth: 10,
    documentHeight: 8,
    frameWidth: 12,
    frameHeight: 10,
    notes: "Common for licenses and board certs",
    displayName: '10" × 8" — Professional License',
  },
  {
    id: "hs-diploma-modern",
    category: "High School Diploma",
    useCase: "Modern high school diploma",
    documentWidth: 11,
    documentHeight: 8.5,
    frameWidth: 14,
    frameHeight: 11,
    notes: "Most US high schools",
    displayName: '11" × 8.5" — High School Diploma',
  },
  {
    id: "college-diploma-modern",
    category: "College/University Diploma",
    useCase: "Bachelor's/Master's (modern)",
    documentWidth: 14,
    documentHeight: 11,
    frameWidth: 17,
    frameHeight: 14,
    notes: "Most US universities",
    displayName: '14" × 11" — College Diploma (Modern)',
  },
  {
    id: "college-diploma-traditional",
    category: "College/University Diploma",
    useCase: "Traditional/older diplomas",
    documentWidth: 13,
    documentHeight: 10,
    frameWidth: 16,
    frameHeight: 13,
    notes: "Used by some institutions pre-2000s",
    displayName: '13" × 10" — College Diploma (Traditional)',
  },
  {
    id: "award-corporate",
    category: "Awards/Recognition",
    useCase: "Corporate awards & plaques",
    documentWidth: 14,
    documentHeight: 11,
    frameWidth: 17,
    frameHeight: 14,
    notes: "Common for corporate certificates",
    displayName: '14" × 11" — Corporate Award',
  },
  {
    id: "award-letter",
    category: "Awards/Recognition",
    useCase: "Corporate awards (letter)",
    documentWidth: 11,
    documentHeight: 8.5,
    frameWidth: 14,
    frameHeight: 11,
    notes: "Alternate corporate format",
    displayName: '11" × 8.5" — Corporate Award (Letter)',
  },
  {
    id: "military-cert",
    category: "Military/Government",
    useCase: "Certain service or agency certificates",
    documentWidth: 15,
    documentHeight: 12,
    frameWidth: 18,
    frameHeight: 15,
    notes: "Less common specialty size",
    displayName: '15" × 12" — Military/Government',
  },
  {
    id: "intl-diploma-large",
    category: "International Diploma",
    useCase: "UK/EU variants",
    documentWidth: 17,
    documentHeight: 13,
    frameWidth: 20,
    frameHeight: 16,
    notes: "Some international diplomas",
    displayName: '17" × 13" — International Diploma',
  },
];

/**
 * Group sizes by category for organized display
 */
export const DIPLOMA_SIZES_BY_CATEGORY = DIPLOMA_SIZES.reduce(
  (acc, size) => {
    (acc[size.category] ??= []).push(size);
    return acc;
  },
  {} as Record<string, DiplomaSize[]>
);

/**
 * Find a diploma size by ID
 */
export function getDiplomaSizeById(id: string): DiplomaSize | undefined {
  return DIPLOMA_SIZES.find((size) => size.id === id);
}

/**
 * Validate custom diploma dimensions
 */
export function validateDiplomaDimensions(
  width: number,
  height: number
): { valid: boolean; error?: string } {
  const minSize = 4;
  const maxSize = 40;

  if (width < minSize || height < minSize) {
    return { valid: false, error: `Minimum size is ${minSize} inches` };
  }
  if (width > maxSize || height > maxSize) {
    return { valid: false, error: `Maximum size is ${maxSize} inches` };
  }
  return { valid: true };
}
