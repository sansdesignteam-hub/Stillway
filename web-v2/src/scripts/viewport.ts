/**
 * QA27 M-11: one stable viewport for the whole story.
 * Android Chrome (and in-app browsers) show and hide the address bar while the page scrolls, which
 * changes window.innerHeight. Nothing may be sized from it: `h` is the small viewport (svh: the
 * layout the copy and the ring poses use), `lh` the large one (lvh: what the canvas and the photo
 * cover). On touch screens both are locked at load; a resize that only changes the height a little
 * (the address bar) is ignored, a width change (rotation) or a large height change measures again.
 * The CSS reads the same two numbers through --svh / --lvh (tokens.css).
 */
export const view = { w: 0, h: 0, lh: 0 };
/** a height-only change below this is the browser's own bars */
const BARS = 160;

function probe(height: string) {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `position:absolute;top:0;left:0;width:1px;height:${height};visibility:hidden;pointer-events:none`;
  document.body.appendChild(el);
  return el;
}

if (typeof window !== 'undefined') {
  const small = probe('100svh');
  const large = probe('100lvh');
  const touch = window.matchMedia('(pointer: coarse)');
  const root = document.documentElement.style;
  const measure = () => {
    const w = window.innerWidth;
    const h = small.offsetHeight || window.innerHeight;
    const lh = Math.max(h, large.offsetHeight || window.innerHeight);
    if (touch.matches && w === view.w && Math.abs(h - view.h) < BARS && Math.abs(lh - view.lh) < BARS) return;
    view.w = w;
    view.h = h;
    view.lh = lh;
    if (touch.matches) {
      root.setProperty('--svh', `${h / 100}px`);
      root.setProperty('--lvh', `${lh / 100}px`);
    } else {
      root.removeProperty('--svh');
      root.removeProperty('--lvh');
    }
  };
  measure();
  // registered at import, before any section: every later resize listener reads fresh values
  window.addEventListener('resize', measure);
  touch.addEventListener('change', measure);
}
