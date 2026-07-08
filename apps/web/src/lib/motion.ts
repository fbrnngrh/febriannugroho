/** Shared motion tokens and spring configs for subtle premium animations */

export const MOTION_EASE_PREMIUM = "cubic-bezier(0.22, 1, 0.36, 1)";

export const MOTION_DURATION = {
  fast: 150,
  normal: 220,
  slow: 300,
} as const;

export const MOTION_STAGGER = {
  micro: 30,
  standard: 40,
  card: 50,
} as const;

export const SPRING_PROGRESS = {
  stiffness: 0.08,
  damping: 0.85,
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function staggerDelay(
  index: number,
  stepMs: number = MOTION_STAGGER.standard,
  maxItems = 8,
): string {
  return `${Math.min(index, maxItems) * stepMs}ms`;
}
