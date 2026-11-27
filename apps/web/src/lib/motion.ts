/** Motion tokens (docs/redesign-handoff/04-motion.md). CSS twins live in app.css as --ease-* / --dur-*. */

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
export const EASE_STAGE = [0.645, 0.045, 0.355, 1] as const;
export const EASE_FLOW = [0.2, 0, 0, 1] as const;

export const bezier = (e: readonly number[]) => `cubic-bezier(${e.join(", ")})`;

export const DURATION = {
  press: 100,
  release: 150,
  hover: 150,
  card: 200,
  page: 250,
  reveal: 300,
  dialog: 350,
  dialogOut: 150,
  sheet: 350,
  stageBg: 600,
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth scroll to an element: 600 ms ease-in-out, or an instant jump under reduced motion. */
export function scrollToElement(el: Element, duration = 600) {
  // same offset as anchor jumps (html scroll-padding-top), so the fixed Explore button never covers the target
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 24;
  const top = el.getBoundingClientRect().top + window.scrollY - pad;
  if (prefersReducedMotion()) {
    window.scrollTo(0, top);
    return;
  }
  const start = window.scrollY;
  const distance = top - start;
  const [x1, y1, x2, y2] = EASE_IN_OUT;
  const ease = cubicBezier(x1, y1, x2, y2);
  const t0 = performance.now();
  let raf = 0;
  // the user's own wheel or touch wins over the scripted scroll
  const stop = () => cancelAnimationFrame(raf);
  window.addEventListener("wheel", stop, { once: true, passive: true });
  window.addEventListener("touchstart", stop, { once: true, passive: true });
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + distance * ease(p));
    if (p < 1) raf = requestAnimationFrame(step);
    else {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    }
  };
  raf = requestAnimationFrame(step);
}

/** Solve a CSS cubic-bezier for y at progress x (Newton steps, then bisection). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const err = sx(t) - x;
      const d = dx(t);
      if (Math.abs(err) < 1e-5) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0, hi = 1;
    t = x;
    while (hi - lo > 1e-5) {
      if (sx(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}
