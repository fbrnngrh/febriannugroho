import { prefersReducedMotion } from "$lib/motion";

export type InviewOptions = {
  class?: string;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
};

const DEFAULT_OPTIONS: Required<InviewOptions> = {
  class: "in-view",
  once: true,
  threshold: 0.08,
  rootMargin: "0px 0px -8% 0px",
};

type ElementState = {
  activeClass: string;
  once: boolean;
};

let sharedObserver: IntersectionObserver | null = null;
const elementStates = new WeakMap<Element, ElementState>();

function getSharedObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const state = elementStates.get(entry.target);
        if (!state) continue;

        entry.target.classList.add(state.activeClass);

        if (state.once) {
          sharedObserver?.unobserve(entry.target);
          elementStates.delete(entry.target);
        }
      }
    },
    {
      threshold: DEFAULT_OPTIONS.threshold,
      rootMargin: DEFAULT_OPTIONS.rootMargin,
    },
  );

  return sharedObserver;
}

export function inview(node: HTMLElement, options: InviewOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  function reveal() {
    node.classList.add(opts.class);
  }

  if (prefersReducedMotion()) {
    reveal();
    return {};
  }

  elementStates.set(node, { activeClass: opts.class, once: opts.once });
  getSharedObserver().observe(node);

  return {
    update(newOptions: InviewOptions) {
      Object.assign(opts, { ...DEFAULT_OPTIONS, ...newOptions });
      elementStates.set(node, { activeClass: opts.class, once: opts.once });
    },
    destroy() {
      sharedObserver?.unobserve(node);
      elementStates.delete(node);
    },
  };
}
