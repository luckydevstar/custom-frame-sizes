/**
 * Mat configurator store – single source of truth for mat designer (aligned with original)
 */

import { create } from "zustand";
import { recenterAfterSizeChange } from "@framecraft/core";
import { getMatsInDisplayOrder } from "@framecraft/config";
import type { MatConfig, MatOpening, MatLayer } from "./types";

function recenterOpening(opening: MatOpening, matW: number, matH: number): MatOpening {
  return recenterAfterSizeChange(opening, matW, matH) as MatOpening;
}

function getDefaultConfig(): MatConfig {
  const mats = getMatsInDisplayOrder("desktop", true, true);
  const white = mats.find((m) => m.name === "White") ?? mats[0];
  return {
    overallWIn: 16,
    overallHIn: 20,
    singleOrDouble: "single",
    topMat: {
      color: white?.name ?? "White",
      openings: [
        {
          id: "opening-1",
          shape: "rect",
          xIn: 4,
          yIn: 5,
          wIn: 8,
          hIn: 10,
          cornerStyle: "square",
        },
      ],
    },
    bottomMat: undefined,
    standardOverlap: true,
    matRevealWidth: 0.25,
    quantity: 1,
    vGroove: { enabled: false, offsetIn: 0.5 },
    backingKit: { enabled: false },
    selectedFrameId: null,
    selectedGlassId: "standard",
    hardware: "standard",
  };
}

interface MatStore {
  config: MatConfig;
  configVersion: number;
  setOverallSize: (wIn: number, hIn: number) => void;
  setMatColor: (layer: "top" | "bottom", colorName: string) => void;
  updateOpening: (layer: "top" | "bottom", id: string, partial: Partial<MatOpening>) => void;
  toggleSingleDouble: () => void;
  toggleStandardOverlap: (enabled: boolean) => void;
  setMatRevealWidth: (width: number) => void;
  setVGrooveEnabled: (enabled: boolean) => void;
  setVGrooveOffset: (offsetIn: number) => void;
  setBackingKitEnabled: (enabled: boolean) => void;
  setQuantity: (quantity: number) => void;
  setShowBorders: (enabled: boolean) => void;
  setSelectedFrame: (frameId: string | null) => void;
  setSelectedGlass: (glassId: string | null) => void;
  setHardware: (hardware: "standard" | "security") => void;
}

export const useMatStore = create<MatStore>((set, _get) => ({
  config: getDefaultConfig(),
  configVersion: 0,

  setOverallSize: (wIn, hIn) => {
    set((state) => {
      const primary =
        state.config.singleOrDouble === "double" && state.config.bottomMat
          ? state.config.bottomMat.openings[0]
          : state.config.topMat.openings[0];
      if (!primary) return state;
      const recentered = recenterOpening(primary, wIn, hIn);
      const topOpenings = [recentered];
      let bottomOpenings = state.config.bottomMat?.openings;
      if (
        state.config.singleOrDouble === "double" &&
        state.config.bottomMat &&
        bottomOpenings?.[0]
      ) {
        bottomOpenings = [recenterOpening(bottomOpenings[0], wIn, hIn)];
      }
      return {
        configVersion: state.configVersion + 1,
        config: {
          ...state.config,
          overallWIn: wIn,
          overallHIn: hIn,
          topMat: { ...state.config.topMat, openings: topOpenings },
          bottomMat: state.config.bottomMat
            ? { ...state.config.bottomMat, openings: bottomOpenings ?? [] }
            : undefined,
        },
      };
    });
  },

  setMatColor: (layer, colorName) => {
    set((state) => {
      if (layer === "top") {
        return {
          config: {
            ...state.config,
            topMat: { ...state.config.topMat, color: colorName },
          },
        };
      }
      if (!state.config.bottomMat) return state;
      return {
        config: {
          ...state.config,
          bottomMat: { ...state.config.bottomMat, color: colorName },
        },
      };
    });
  },

  updateOpening: (layer, id, partial) => {
    set((state) => {
      const REVEAL = state.config.matRevealWidth;

      const createTopFromBottom = (bottom: MatOpening): MatOpening => ({
        ...bottom,
        wIn: (bottom.wIn ?? 0) + REVEAL * 2,
        hIn: (bottom.hIn ?? 0) + REVEAL * 2,
        xIn: bottom.xIn - REVEAL,
        yIn: bottom.yIn - REVEAL,
      });

      if (layer === "bottom" && state.config.bottomMat) {
        const bottom = state.config.bottomMat.openings.find((o) => o.id === id);
        if (!bottom) return state;
        let next = { ...bottom, ...partial };
        const isDimChange = "wIn" in partial || "hIn" in partial;
        if (isDimChange)
          next = recenterOpening(next, state.config.overallWIn, state.config.overallHIn);
        const topOpening = createTopFromBottom(next);
        return {
          configVersion: state.configVersion + 1,
          config: {
            ...state.config,
            bottomMat: {
              ...state.config.bottomMat,
              openings: state.config.bottomMat.openings.map((o) => (o.id === id ? next : o)),
            },
            topMat: {
              ...state.config.topMat,
              openings: state.config.topMat.openings.map((o) => (o.id === id ? topOpening : o)),
            },
          },
        };
      }

      const top = state.config.topMat.openings.find((o) => o.id === id);
      if (!top) return state;
      let next = { ...top, ...partial };
      const isDimChange = "wIn" in partial || "hIn" in partial;
      if (isDimChange)
        next = recenterOpening(next, state.config.overallWIn, state.config.overallHIn);

      const isDouble = state.config.singleOrDouble === "double" && state.config.bottomMat;
      let bottomUpdate: MatLayer | undefined = state.config.bottomMat;
      if (isDouble && state.config.bottomMat && ("shape" in partial || "cornerStyle" in partial)) {
        const bottom = state.config.bottomMat.openings.find((o) => o.id === id);
        if (bottom) {
          bottomUpdate = {
            ...state.config.bottomMat,
            openings: state.config.bottomMat.openings.map((o) =>
              o.id === id
                ? {
                    ...o,
                    ...(partial.shape !== undefined && { shape: partial.shape }),
                    ...(partial.cornerStyle !== undefined && {
                      cornerStyle: partial.cornerStyle,
                    }),
                  }
                : o
            ),
          };
        }
      }

      return {
        configVersion: state.configVersion + 1,
        config: {
          ...state.config,
          topMat: {
            ...state.config.topMat,
            openings: state.config.topMat.openings.map((o) => (o.id === id ? next : o)),
          },
          ...(bottomUpdate !== undefined && { bottomMat: bottomUpdate }),
        },
      };
    });
  },

  toggleSingleDouble: () => {
    set((state) => {
      const REVEAL = state.config.matRevealWidth;
      const createTopFromBottom = (bottom: MatOpening): MatOpening => ({
        ...bottom,
        wIn: (bottom.wIn ?? 0) + REVEAL * 2,
        hIn: (bottom.hIn ?? 0) + REVEAL * 2,
        xIn: bottom.xIn - REVEAL,
        yIn: bottom.yIn - REVEAL,
      });

      if (state.config.singleOrDouble === "single") {
        const mats = getMatsInDisplayOrder("desktop", true, true);
        const second =
          mats.find((m) => m.name === "Cream" || m.name === "Ivory") ?? mats[1] ?? mats[0];
        const bottomOpenings = state.config.topMat.openings.map((o) => ({ ...o }));
        const topOpenings = bottomOpenings.map(createTopFromBottom);
        return {
          configVersion: state.configVersion + 1,
          config: {
            ...state.config,
            singleOrDouble: "double",
            bottomMat: {
              color: second?.name ?? "Cream",
              openings: bottomOpenings,
            },
            topMat: { ...state.config.topMat, openings: topOpenings },
          },
        };
      }
      const source = state.config.bottomMat?.openings ?? state.config.topMat.openings;
      return {
        configVersion: state.configVersion + 1,
        config: {
          ...state.config,
          singleOrDouble: "single",
          topMat: {
            ...state.config.topMat,
            openings: source.map((o) => ({ ...o })),
          },
          bottomMat: undefined,
        },
      };
    });
  },

  toggleStandardOverlap: (enabled) => {
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: { ...state.config, standardOverlap: enabled },
    }));
  },

  setMatRevealWidth: (width) => {
    set((state) => {
      if (!state.config.bottomMat) return state;
      const REVEAL = width;
      const createTopFromBottom = (bottom: MatOpening): MatOpening => ({
        ...bottom,
        wIn: (bottom.wIn ?? 0) + REVEAL * 2,
        hIn: (bottom.hIn ?? 0) + REVEAL * 2,
        xIn: bottom.xIn - REVEAL,
        yIn: bottom.yIn - REVEAL,
      });
      return {
        config: {
          ...state.config,
          matRevealWidth: width,
          topMat: {
            ...state.config.topMat,
            openings: state.config.bottomMat.openings.map(createTopFromBottom),
          },
        },
      };
    });
  },

  setVGrooveEnabled: (enabled) => {
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: {
        ...state.config,
        vGroove: {
          ...state.config.vGroove,
          enabled,
          offsetIn: state.config.vGroove?.offsetIn ?? 0.5,
        },
      },
    }));
  },

  setVGrooveOffset: (offsetIn) => {
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: {
        ...state.config,
        vGroove: {
          ...(state.config.vGroove ?? { enabled: false, offsetIn: 0.5 }),
          offsetIn,
        },
      },
    }));
  },

  setBackingKitEnabled: (enabled) => {
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: {
        ...state.config,
        backingKit: { enabled },
      },
    }));
  },

  setQuantity: (quantity) => {
    set((state) => ({
      config: {
        ...state.config,
        quantity: Math.max(1, Math.floor(quantity)),
      },
    }));
  },

  setShowBorders: (enabled) => {
    set((state) => ({
      config: { ...state.config, showBorders: enabled },
    }));
  },

  setSelectedFrame: (frameId) => {
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: { ...state.config, selectedFrameId: frameId ?? null },
    }));
  },

  setSelectedGlass: (glassId) => {
    const normalized = glassId === "none" ? "standard" : glassId;
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: { ...state.config, selectedGlassId: normalized ?? "standard" },
    }));
  },

  setHardware: (hardware) => {
    set((state) => ({
      configVersion: state.configVersion + 1,
      config: { ...state.config, hardware },
    }));
  },
}));
