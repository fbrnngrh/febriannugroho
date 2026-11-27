import { goto } from "$app/navigation";
import { page } from "$app/state";

/**
 * Overlays (Explore menu, project detail) push a shallow history entry,
 * so the browser back button closes them (03-ux-pages.md §3).
 */
export function openOverlay(state: App.PageState, hash = "") {
  const url = new URL(page.url.href);
  url.hash = hash;
  return goto(url.href, { shallow: true, state, reset: false });
}

/** Close by going back when we opened the entry; otherwise just clear the state. */
export function closeOverlay(key: keyof App.PageState) {
  if (page.state[key]) {
    history.back();
    return;
  }
  const url = new URL(page.url.href);
  url.hash = "";
  return goto(url.href, { shallow: true, replace: true, state: {}, reset: false });
}

/** A click on a modal dialog's ::backdrop targets the dialog itself, as does a click on its padding; only the first is outside its box. */
export function isBackdropClick(e: MouseEvent, dialog: HTMLDialogElement | undefined) {
  if (e.target !== dialog || !dialog) return false;
  const r = dialog.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
}
