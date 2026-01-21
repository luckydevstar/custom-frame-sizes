/**
 * Specialty Types
 *
 * Type definitions for specialty frame designers:
 * - Shadowbox types
 * - Mat-specific types
 * - Other specialty frame configurations
 */

// ============================================================================
// SHADOWBOX TYPES
// ============================================================================

export interface ShadowboxMatLayer {
  color: string;
  thicknessIn: number;
  windowSizeIn?: { w: number; h: number };
}

export interface ShadowboxJerseyMount {
  enable: boolean;
  openingIn?: { w: number; h: number };
}

export interface ShadowboxAccessory {
  sku: string;
  position?: { x: number; y: number };
}

export interface ShadowboxBackground {
  material: "suede" | "linen" | "paper" | "plywood" | "mat-color";
  color: string;
}

export type ShadowboxGlazing = "acrylic-AR" | "glass-AR" | "acrylic" | "glass" | "none";

export interface ShadowboxConfig {
  widthIn: number;
  heightIn: number;
  depthIn: number;
  mouldingId?: string;
  matLayers: ShadowboxMatLayer[];
  background: ShadowboxBackground;
  glazing: ShadowboxGlazing;
  hangingHardware?: "standard" | "security";
  jerseyMount?: ShadowboxJerseyMount;
  accessories?: ShadowboxAccessory[];
  // Allow additional unknown fields for forward compatibility
  [key: string]: any;
}

export interface ShadowboxLayout {
  outerWIn: number;
  outerHIn: number;
  window: { w: number; h: number };
}

/**
 * PostMessage Event Types for Embed Mode
 */
export type ShadowboxMessageType =
  | "SHADOWBOX_READY"
  | "SHADOWBOX_CHANGE"
  | "SHADOWBOX_SAVE"
  | "SHADOWBOX_LOAD"
  | "SHADOWBOX_SET_READONLY";

export interface ShadowboxReadyMessage {
  type: "SHADOWBOX_READY";
  data: {
    version: string;
    origin?: string; // 'wildcard' or actual origin after lock
  };
}

export interface ShadowboxChangeMessage {
  type: "SHADOWBOX_CHANGE";
  data: {
    design: ShadowboxConfig;
  };
}

export interface ShadowboxSaveMessage {
  type: "SHADOWBOX_SAVE";
  data: {
    designId: string;
    previewUrl?: string;
    design: ShadowboxConfig;
  };
}

export interface ShadowboxLoadMessage {
  type: "SHADOWBOX_LOAD";
  data: {
    design: ShadowboxConfig;
  };
}

export interface ShadowboxSetReadonlyMessage {
  type: "SHADOWBOX_SET_READONLY";
  data: {
    readonly: boolean;
  };
}

export type ShadowboxOutgoingMessage =
  | ShadowboxReadyMessage
  | ShadowboxChangeMessage
  | ShadowboxSaveMessage;

export type ShadowboxIncomingMessage = ShadowboxLoadMessage | ShadowboxSetReadonlyMessage;

/**
 * Feature Flags for Shadowbox Designer
 */
export interface ShadowboxFeatureFlags {
  FEATURE_MOULDING_PICKER?: boolean;
  FEATURE_MAT_SET?: boolean;
  FEATURE_JERSEY_MOUNT?: boolean;
}
