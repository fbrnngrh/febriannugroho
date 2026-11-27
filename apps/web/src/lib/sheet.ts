/**
 * Drag-to-dismiss for phone sheets (04-motion.md §5, gestures skill):
 * follows the finger 1:1, rubber-bands upward at 0.2, closes past 40% height or 500 px/s,
 * otherwise springs back with --ease-drawer. Writes the transform on the sheet itself,
 * never through Svelte state on every pointermove.
 */
export function sheetDrag(onDismiss: () => void) {
  return (sheet: HTMLElement) => {
    const phone = window.matchMedia("(max-width: 767.98px)");
    let startY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let height = 0;
    let dragging = false;
    let swallow = false;
    let pointerId = -1;

    function down(e: PointerEvent) {
      if (!phone.matches || e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, [data-no-drag]")) return;
      // let the content scroll first; only drag from the top of the scroll area
      const scroller = target.closest<HTMLElement>("[data-sheet-scroll]");
      if (scroller && scroller.scrollTop > 0) return;
      dragging = true;
      swallow = false;
      pointerId = e.pointerId;
      startY = lastY = e.clientY;
      lastT = e.timeStamp;
      velocity = 0;
      height = sheet.offsetHeight; // read once: no forced layout per move
      sheet.style.transition = "none";
      sheet.classList.add("dragging");
    }

    function move(e: PointerEvent) {
      if (!dragging || e.pointerId !== pointerId) return;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 4 && !sheet.hasPointerCapture(pointerId)) sheet.setPointerCapture(pointerId);
      const y = dy < 0 ? dy * 0.2 : dy;
      sheet.style.translate = `0 ${y}px`;
      sheet.style.setProperty("--backdrop-a", String(Math.max(0, 1 - y / height)));
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = ((e.clientY - lastY) / dt) * 1000;
      lastY = e.clientY;
      lastT = e.timeStamp;
    }

    function up(e: PointerEvent) {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      sheet.classList.remove("dragging");
      const dy = Math.max(0, e.clientY - startY);
      // finger held still before lifting = no fling
      const v = e.timeStamp - lastT > 80 ? 0 : velocity;
      swallow = Math.abs(e.clientY - startY) > 4;
      sheet.style.transition = "";
      if (e.type !== "pointercancel" && (dy > height * 0.4 || v > 500)) {
        // exit from where the finger let go; no snap back while the close goes through history
        sheet.style.translate = "0 100%";
        sheet.style.setProperty("--backdrop-a", "0");
        sheet.addEventListener(
          "close",
          () => {
            sheet.style.translate = "";
            sheet.style.removeProperty("--backdrop-a");
          },
          { once: true },
        );
        onDismiss();
        return;
      }
      sheet.style.removeProperty("--backdrop-a");
      sheet.style.translate = "";
    }

    // the click that ends a drag must not count as a tap (e.g. the backdrop-click close)
    function click(e: Event) {
      if (!swallow) return;
      swallow = false;
      e.preventDefault();
      e.stopPropagation();
    }

    sheet.addEventListener("pointerdown", down);
    sheet.addEventListener("pointermove", move);
    sheet.addEventListener("pointerup", up);
    sheet.addEventListener("pointercancel", up);
    sheet.addEventListener("click", click, true);
    return () => {
      sheet.removeEventListener("pointerdown", down);
      sheet.removeEventListener("pointermove", move);
      sheet.removeEventListener("pointerup", up);
      sheet.removeEventListener("pointercancel", up);
      sheet.removeEventListener("click", click, true);
    };
  };
}
