/**
 * AR Model Generator
 *
 * Generates 3D GLTF/GLB models for AR preview using Three.js
 * Compatible with iOS Quick Look (USDZ conversion) and Web AR viewers
 *
 * NOTE: Requires three.js as a peer dependency
 * Install: npm install three
 */

// @ts-expect-error - three.js types may not be available in all projects
import * as THREE from "three";
// @ts-expect-error - GLTFExporter types may not be available
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

interface FrameConfig {
  artworkWidth: number;
  artworkHeight: number;
  matType: "none" | "single" | "double";
  matBorderWidth: number;
  matRevealWidth: number;
}

interface FrameStyle {
  id: string;
  name: string;
  mouldingWidth: number;
  usableDepth: number;
  color: string;
}

interface MatColor {
  id: string;
  name: string;
  hexColor: string; // Field name from mats.json
  color?: string; // Backward compatibility alias
}

function inchesToMeters(inches: number): number {
  return inches * 0.0254;
}

interface GenerateARModelParams {
  config: FrameConfig;
  frameStyle: FrameStyle;
  matColor?: MatColor;
  matInnerColor?: MatColor;
  imageDataUrl?: string;
}

export async function generateARModelBlob(params: GenerateARModelParams): Promise<string> {
  const { config, frameStyle, matColor, matInnerColor, imageDataUrl } = params;

  // Create scene
  const scene = new THREE.Scene();

  // Convert dimensions to meters
  const artworkWidthM = inchesToMeters(config.artworkWidth);
  const artworkHeightM = inchesToMeters(config.artworkHeight);
  const mouldingWidthM = inchesToMeters(frameStyle.mouldingWidth);
  const mouldingDepthM = inchesToMeters(frameStyle.usableDepth);

  // Calculate mat dimensions if applicable
  let matBorderWidthM = 0;
  let matRevealWidthM = 0;
  if (config.matType !== "none") {
    matBorderWidthM = inchesToMeters(config.matBorderWidth);
    matRevealWidthM = config.matType === "double" ? inchesToMeters(config.matRevealWidth) : 0;
  }

  // Create group to hold all frame components
  const frameGroup = new THREE.Group();
  frameGroup.name = "CustomFrame";

  // 1. Create artwork plane (background image)
  if (imageDataUrl) {
    const textureLoader = new THREE.TextureLoader();
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(imageDataUrl, resolve, undefined, reject);
    });

    // Set texture color space for accurate color reproduction
    texture.colorSpace = THREE.SRGBColorSpace;

    const artworkGeometry = new THREE.PlaneGeometry(artworkWidthM, artworkHeightM);
    // Use MeshStandardMaterial (not MeshBasicMaterial) so GLTF export creates
    // a baseColorTexture that survives Model Viewer's GLB→USDZ conversion for iOS Quick Look
    const artworkMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8, // Matte finish like a photograph
      metalness: 0.0, // Not metallic
      side: THREE.FrontSide,
    });
    const artwork = new THREE.Mesh(artworkGeometry, artworkMaterial);
    artwork.name = "Artwork";
    artwork.position.z = -mouldingDepthM * 0.5; // Recessed into frame
    frameGroup.add(artwork);
  }

  // 2. Create mat boards (if applicable)
  // Track outer mat dimensions for frame sizing
  let outerMatWidth = artworkWidthM;
  let outerMatHeight = artworkHeightM;

  if (config.matType !== "none" && matColor) {
    // Calculate outer mat dimensions
    outerMatWidth = artworkWidthM + matBorderWidthM * 2;
    outerMatHeight = artworkHeightM + matBorderWidthM * 2;

    // Outer mat (white in double mat) - CLOSEST TO FRONT
    const outerMatMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(matColor.hexColor || matColor.color || "#FFFFFF"),
      roughness: 0.8,
      metalness: 0.0,
    });

    const outerMat = createMatBorders(
      outerMatWidth,
      outerMatHeight,
      artworkWidthM + matRevealWidthM * 2,
      artworkHeightM + matRevealWidthM * 2,
      0.002, // Mat thickness in meters (~2mm)
      outerMatMaterial
    );
    outerMat.name = "OuterMat";
    outerMat.position.z = -mouldingDepthM * 0.15; // CLOSEST TO FRONT (in front of inner mat)
    frameGroup.add(outerMat);

    // Inner mat (blue in double mat) - BEHIND OUTER MAT
    if (config.matType === "double" && matInnerColor) {
      const innerMatWidth = artworkWidthM + matRevealWidthM * 2 + matBorderWidthM * 2;
      const innerMatHeight = artworkHeightM + matRevealWidthM * 2 + matBorderWidthM * 2;

      const innerMatMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(matInnerColor.hexColor || matInnerColor.color || "#FFFFFF"),
        roughness: 0.8,
        metalness: 0.0,
      });

      const innerMat = createMatBorders(
        innerMatWidth,
        innerMatHeight,
        artworkWidthM,
        artworkHeightM,
        0.002,
        innerMatMaterial
      );
      innerMat.name = "InnerMat";
      innerMat.position.z = -mouldingDepthM * 0.35; // BEHIND outer mat
      frameGroup.add(innerMat);
    }
  }

  // 3. Create frame moulding (4 pieces with proper mitered corners)
  // Frame wraps around the OUTER MAT (or artwork if no mat)
  const totalWidth = outerMatWidth + mouldingWidthM * 2;
  const totalHeight = outerMatHeight + mouldingWidthM * 2;

  // Frame color from style
  const frameColor = new THREE.Color(frameStyle.color || "#8B7355");
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: 0.6,
    metalness: 0.1,
  });

  // Top piece (shorter to account for mitered corners)
  const topGeometry = new THREE.BoxGeometry(
    totalWidth - mouldingWidthM * 2, // Subtract corner widths
    mouldingWidthM,
    mouldingDepthM
  );
  const topPiece = new THREE.Mesh(topGeometry, frameMaterial);
  topPiece.name = "FrameTop";
  topPiece.position.y = totalHeight / 2 - mouldingWidthM / 2;
  topPiece.position.z = 0;
  frameGroup.add(topPiece);

  // Bottom piece (shorter to account for mitered corners)
  const bottomGeometry = new THREE.BoxGeometry(
    totalWidth - mouldingWidthM * 2, // Subtract corner widths
    mouldingWidthM,
    mouldingDepthM
  );
  const bottomPiece = new THREE.Mesh(bottomGeometry, frameMaterial);
  bottomPiece.name = "FrameBottom";
  bottomPiece.position.y = -(totalHeight / 2) + mouldingWidthM / 2;
  bottomPiece.position.z = 0;
  frameGroup.add(bottomPiece);

  // Left piece (full height)
  const leftGeometry = new THREE.BoxGeometry(mouldingWidthM, totalHeight, mouldingDepthM);
  const leftPiece = new THREE.Mesh(leftGeometry, frameMaterial);
  leftPiece.name = "FrameLeft";
  leftPiece.position.x = -(totalWidth / 2) + mouldingWidthM / 2;
  leftPiece.position.z = 0;
  frameGroup.add(leftPiece);

  // Right piece (full height)
  const rightGeometry = new THREE.BoxGeometry(mouldingWidthM, totalHeight, mouldingDepthM);
  const rightPiece = new THREE.Mesh(rightGeometry, frameMaterial);
  rightPiece.name = "FrameRight";
  rightPiece.position.x = totalWidth / 2 - mouldingWidthM / 2;
  rightPiece.position.z = 0;
  frameGroup.add(rightPiece);

  // 4. Create glass/acrylic plane (transparent overlay)
  const glassGeometry = new THREE.PlaneGeometry(totalWidth, totalHeight);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.05,
    roughness: 0.1,
    metalness: 0.0,
    reflectivity: 0.2,
  });
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.name = "Glass";
  glass.position.z = mouldingDepthM * 0.4; // In front of everything
  frameGroup.add(glass);

  // Add lighting (important for AR realism)
  // Note: Only directional, point, and spot lights are supported in GLTF
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add frame group to scene
  scene.add(frameGroup);

  // Export as GLTF binary (GLB)
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result: ArrayBuffer | object) => {
        let blob: Blob;

        if (result instanceof ArrayBuffer) {
          blob = new Blob([result], { type: "model/gltf-binary" });
        } else {
          // Convert JSON to blob
          const json = JSON.stringify(result);
          blob = new Blob([json], { type: "model/gltf+json" });
        }

        // Create blob URL
        const blobUrl = URL.createObjectURL(blob);
        resolve(blobUrl);
      },
      (error: Error) => reject(error),
      { binary: true } // Export as GLB for better AR compatibility
    );
  });
}

/**
 * Create mat board as 4 border pieces using BoxGeometry
 * This approach is compatible with GLB→USDZ conversion for iOS Quick Look
 * (ExtrudeGeometry fails in USDZ conversion)
 *
 * Strategy: Top/bottom span full width, left/right fill middle gap
 * - Top/bottom: Full outer width (covers all 4 corners)
 * - Left/right: Inner height only (butts cleanly against top/bottom)
 * - No gaps, no overlaps, no z-fighting
 */
function createMatBorders(
  outerWidth: number,
  outerHeight: number,
  innerWidth: number,
  innerHeight: number,
  thickness: number,
  material: THREE.Material
): THREE.Group {
  const matGroup = new THREE.Group();

  // Calculate border widths
  const horizontalBorderWidth = (outerWidth - innerWidth) / 2;
  const verticalBorderWidth = (outerHeight - innerHeight) / 2;

  // Top border - FULL outer width (covers top-left and top-right corners)
  const topGeometry = new THREE.BoxGeometry(outerWidth, verticalBorderWidth, thickness);
  const topBorder = new THREE.Mesh(topGeometry, material);
  topBorder.position.y = outerHeight / 2 - verticalBorderWidth / 2;
  topBorder.position.z = 0;
  matGroup.add(topBorder);

  // Bottom border - FULL outer width (covers bottom-left and bottom-right corners)
  const bottomGeometry = new THREE.BoxGeometry(outerWidth, verticalBorderWidth, thickness);
  const bottomBorder = new THREE.Mesh(bottomGeometry, material);
  bottomBorder.position.y = -(outerHeight / 2) + verticalBorderWidth / 2;
  bottomBorder.position.z = 0;
  matGroup.add(bottomBorder);

  // Left border - INNER height only (butts against top/bottom, no overlap)
  const leftGeometry = new THREE.BoxGeometry(
    horizontalBorderWidth,
    innerHeight, // Only middle section - top/bottom cover the corners
    thickness
  );
  const leftBorder = new THREE.Mesh(leftGeometry, material);
  leftBorder.position.x = -(outerWidth / 2) + horizontalBorderWidth / 2;
  leftBorder.position.z = 0;
  matGroup.add(leftBorder);

  // Right border - INNER height only (butts against top/bottom, no overlap)
  const rightGeometry = new THREE.BoxGeometry(
    horizontalBorderWidth,
    innerHeight, // Only middle section - top/bottom cover the corners
    thickness
  );
  const rightBorder = new THREE.Mesh(rightGeometry, material);
  rightBorder.position.x = outerWidth / 2 - horizontalBorderWidth / 2;
  rightBorder.position.z = 0;
  matGroup.add(rightBorder);

  return matGroup;
}
