/**
 * Scroll reveal (04-motion.md §9). Adds `is-in` once the element crosses 85% of the viewport
 * (90% on phones), then stops observing. Pair with `data-reveal` and an optional `--reveal-delay`.
 * Elements that enter in the same frame as many others (a fast jump) reveal together without delay.
 */
export type InviewOptions = {
  class?: string;
  /** bottom root margin; "-5%" ≈ 95% trigger for the footer */
  margin?: string;
};

type Entry = { cls: string };

const observers = new Map<string, IntersectionObserver>();
const states = new WeakMap<Element, Entry>();

function defaultMargin() {
  return window.matchMedia("(max-width: 767.98px)").matches ? "-10%" : "-15%";
}

function observerFor(margin: string) {
  let io = observers.get(margin);
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting);
      const batch = entering.length > 4;
      for (const entry of entering) {
        const state = states.get(entry.target);
        if (!state) continue;
        if (batch) entry.target.classList.add("no-delay");
        entry.target.classList.add(state.cls);
        io!.unobserve(entry.target);
        states.delete(entry.target);
      }
    },
    { threshold: 0, rootMargin: `0px 0px ${margin} 0px` },
  );
  observers.set(margin, io);
  return io;
}

export function inview(node: HTMLElement, options: InviewOptions = {}) {
  const cls = options.class ?? "is-in";
  const margin = options.margin ?? defaultMargin();
  const io = observerFor(margin);
  states.set(node, { cls });
  io.observe(node);
  return {
    destroy() {
      io.unobserve(node);
      states.delete(node);
    },
  };
}
