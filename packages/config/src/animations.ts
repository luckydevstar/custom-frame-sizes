/**
 * Animation configuration for FrameCraft
 * Defines animation settings for parallax, scroll animations, and micro-interactions
 */

export const animations = {
  enabled: true,

  parallax: {
    enabled: true,
    mobile: false,
    strength: 0.015, // 1.5% movement - barely noticeable
  },

  fadeRise: {
    distance: 12, // pixels to rise - ultra minimal
    duration: 700, // milliseconds - Apple-style smooth
    easing: "cubic-bezier(0.19, 1.0, 0.22, 1.0)", // Apple spring easing
  },

  slideIn: {
    distance: 16, // ultra minimal distance
    duration: 650, // smooth
    easing: "cubic-bezier(0.19, 1.0, 0.22, 1.0)", // Apple spring easing
  },

  scaleIn: {
    from: 0.98,
    to: 1,
    duration: 650, // smooth
    easing: "cubic-bezier(0.19, 1.0, 0.22, 1.0)", // Apple spring easing
  },

  stagger: {
    delay: 60, // milliseconds between children - tight and rhythmic
  },

  microInteractions: {
    hover: {
      scale: 1.008, // barely noticeable
      duration: 280, // smooth
      easing: "cubic-bezier(0.19, 1.0, 0.22, 1.0)",
    },
    tap: {
      scale: 0.992, // barely noticeable
      duration: 180, // snappy
    },
  },

  configurator: {
    crossFade: {
      duration: 450, // smooth cross-fade
      easing: "cubic-bezier(0.19, 1.0, 0.22, 1.0)", // Apple spring easing
    },
  },
} as const;

export type AnimationConfig = typeof animations;
