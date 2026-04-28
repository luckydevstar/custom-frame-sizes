import { getStoreAssetUrl } from "@framecraft/core";

/** origina-store-b/client/src/constants/mat-lifestyle-images.ts — same filenames/alts, CDN via getStoreAssetUrl */
export interface MatLifestyleImage {
  url: string;
  alt: string;
}

const names = [
  "Mat_Lifestyle_(1)_1765923321072.jpeg",
  "Mat_Lifestyle_(2)_1765923321072.jpeg",
  "Mat_Lifestyle_(3)_1765923321072.jpeg",
  "Mat_Lifestyle_(4)_1765923321071.jpeg",
  "Mat_Lifestyle_(5)_1765923321071.jpeg",
  "Mat_Lifestyle_(6)_1765923321070.jpeg",
  "Mat_Lifestyle_(7)_1765923321070.jpeg",
  "Mat_Lifestyle_(8)_1765923321070.jpeg",
  "Mat_Lifestyle_(9)_1765923321069.jpeg",
  "Mat_Lifestyle_(10)_1765923321069.jpeg",
  "Mat_Lifestyle_(11)_1765923321068.jpeg",
  "Mat_Lifestyle_(12)_1765923321068.jpeg",
  "Mat_Lifestyle_(13)_1765923321068.jpeg",
  "Mat_Lifestyle_(14)_1765923321067.jpeg",
  "Mat_Lifestyle_(15)_1765923298425.jpeg",
  "Mat_Lifestyle_(16)_1765923298434.jpeg",
  "Mat_Lifestyle_(17)_1765923298433.jpeg",
  "Mat_Lifestyle_(18)_1765923298433.jpeg",
  "Mat_Lifestyle_(19)_1765923298432.jpeg",
  "Mat_Lifestyle_(20)_1765923298432.jpeg",
  "Mat_Lifestyle_(21)_1765923298431.jpeg",
  "Mat_Lifestyle_(22)_1765923298430.jpeg",
  "Mat_Lifestyle_(23)_1765923298429.jpeg",
  "Mat_Lifestyle_(24)_1765923298429.jpeg",
  "Mat_Lifestyle_(25)_1765923298428.jpeg",
  "Mat_Lifestyle_(26)_1765923298428.jpeg",
  "Mat_Lifestyle_(27)_1765923298427.jpeg",
] as const;

const alts: string[] = [
  "Family selecting mat boards for photos at dining table",
  "Family reviewing matted photographs on coffee table",
  "Couple laughing while sorting matted photos on floor",
  "Multi-generational family choosing mat colors together",
  "Three adults working on mat boards at dining table",
  "Family selecting matted photos on coffee table",
  "Couple sitting on floor reviewing matted prints",
  "Family with children selecting mat boards at dining table",
  "Family working on matted photos at large dining table",
  "Family with toddler looking at matted photos",
  "Couple reviewing matted photos on living room floor",
  "Multi-generational family selecting mat boards",
  "Family with children working on mat boards together",
  "Family laughing while reviewing matted photos",
  "Family working on mat cutting project at dining table",
  "Multi-generational family preparing matted photos",
  "Family on floor sorting through matted photos",
  "Family sharing memories with matted vintage photos",
  "Family with children selecting mat boards",
  "Vintage photos arranged on rustic table with mat boards",
  "Artist working with colorful mat boards at desk",
  "Person arranging matted photos on rustic table",
  "Studio workspace with colorful mat boards and cameras",
  "Vintage photos with mat boards and dried flowers",
  "Person holding white mat board near window",
  "Colorful mat boards arranged on rustic table",
  "Photography studio with mat boards and vintage cameras",
];

export const MAT_LIFESTYLE_IMAGES: MatLifestyleImage[] = names.map((name, i) => ({
  url: getStoreAssetUrl(name),
  alt: alts[i] ?? "Mat board lifestyle",
}));
