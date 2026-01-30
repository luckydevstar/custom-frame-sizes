/**
 * Certificate and Professional License Standard Sizes Configuration
 *
 * This module provides preset sizes for certificates, professional licenses,
 * and corporate awards. Focused on professional credentials and recognition documents.
 *
 * NOTE: This is separate from diplomaSizes which handles academic diplomas.
 */

export interface CertificateSize {
  id: string;
  category:
    | "Certificate"
    | "Professional License"
    | "Awards/Recognition"
    | "International Certificate"
    | "Military/Government";
  useCase: string;
  documentWidth: number; // in inches
  documentHeight: number; // in inches
  frameWidth: number; // recommended frame opening width
  frameHeight: number; // recommended frame opening height
  notes: string;
  displayName: string; // for UI display
}

/**
 * Standard certificate and license sizes
 * Excludes academic diplomas (high school, college) - see diplomaSizes for those
 */
export const CERTIFICATE_SIZES: CertificateSize[] = [
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
    category: "International Certificate",
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
    id: "award-corporate",
    category: "Awards/Recognition",
    useCase: "Corporate awards & plaques",
    documentWidth: 11,
    documentHeight: 14,
    frameWidth: 14,
    frameHeight: 17,
    notes: "Common for corporate certificates in portrait orientation",
    displayName: '11" × 14" — Corporate Award (Portrait)',
  },
  {
    id: "award-letter",
    category: "Awards/Recognition",
    useCase: "Corporate awards (letter)",
    documentWidth: 8.5,
    documentHeight: 11,
    frameWidth: 11,
    frameHeight: 14,
    notes: "Alternate corporate format in portrait orientation",
    displayName: '8.5" × 11" — Corporate Award (Letter)',
  },
  {
    id: "cert-portrait-letter",
    category: "Certificate",
    useCase: "Portrait orientation certificate",
    documentWidth: 8.5,
    documentHeight: 11,
    frameWidth: 11,
    frameHeight: 14,
    notes: "US Letter in portrait orientation",
    displayName: '8.5" × 11" — Portrait Certificate',
  },
  {
    id: "cert-portrait-a4",
    category: "International Certificate",
    useCase: "Portrait A4 certificate",
    documentWidth: 8.27,
    documentHeight: 11.69,
    frameWidth: 11,
    frameHeight: 14,
    notes: "A4 portrait orientation",
    displayName: '8.27" × 11.69" — A4 Portrait',
  },
  {
    id: "license-portrait",
    category: "Professional License",
    useCase: "Portrait professional license",
    documentWidth: 8,
    documentHeight: 10,
    frameWidth: 10,
    frameHeight: 12,
    notes: "Portrait orientation license",
    displayName: '8" × 10" — License (Portrait)',
  },
  {
    id: "military-govt-cert",
    category: "Military/Government",
    useCase: "Service or agency certificates",
    documentWidth: 12,
    documentHeight: 15,
    frameWidth: 15,
    frameHeight: 18,
    notes: "Common for military and government agency certificates",
    displayName: '12" × 15" — Military/Government Certificate',
  },
];

/**
 * Group sizes by category for organized display
 */
export const CERTIFICATE_SIZES_BY_CATEGORY = CERTIFICATE_SIZES.reduce(
  (acc, size) => {
    const arr = acc[size.category] ?? [];
    arr.push(size);
    acc[size.category] = arr;
    return acc;
  },
  {} as Record<string, CertificateSize[]>
);

/**
 * Get all unique categories
 */
export const CERTIFICATE_CATEGORIES = Array.from(new Set(CERTIFICATE_SIZES.map((s) => s.category)));

/**
 * Find a certificate size by ID
 */
export function getCertificateSizeById(id: string): CertificateSize | undefined {
  return CERTIFICATE_SIZES.find((size) => size.id === id);
}

/**
 * Validate custom certificate dimensions
 */
export function validateCertificateDimensions(
  width: number,
  height: number
): {
  valid: boolean;
  error?: string;
} {
  const minSize = 4;
  const maxSize = 40;

  if (width < minSize || height < minSize) {
    return {
      valid: false,
      error: `Minimum size is ${minSize} inches`,
    };
  }

  if (width > maxSize || height > maxSize) {
    return {
      valid: false,
      error: `Maximum size is ${maxSize} inches`,
    };
  }

  return { valid: true };
}
