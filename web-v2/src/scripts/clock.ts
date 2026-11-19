/**
 * Time-of-day clock in the navbar (Storyboard §1: 06:50 → 07:10 → 23:10 → 07:40–15:30 →
 * 17:30 → 21:00 → 22:00 → 06:50). The page is one day; the clock follows the scroll.
 *
 * Each section carries data-time (clock at its start) and optionally data-time-end (clock at
 * its end). Inside a section the clock interpolates; at a boundary it jumps to the next
 * section's time. The reading line is the middle of the viewport. Shown in 5-minute steps.
 * The navbar theme (light/dark ink) follows the section under the navbar.
 */
import { dayparts } from '../content/sections';

export const toMin = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};
export const fmt = (min: number) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
const partOf = (min: number) => {
  let label = dayparts[0][1];
  for (const [start, l] of dayparts) if (min >= start) label = l;
  return label;
};

interface Box {
  el: HTMLElement;
  top: number;
  bottom: number;
  from: number;
  to: number;
  theme: string;
}

export function initClock(subscribe: (fn: () => void) => void) {
  const times = document.querySelectorAll<HTMLElement>('[data-clock-time]');
  const part = document.querySelector<HTMLElement>('[data-clock-part]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const els = [...document.querySelectorAll<HTMLElement>('[data-section][data-time]')];
  let boxes: Box[] = [];

  const measure = () => {
    boxes = els.map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const from = toMin(el.dataset.time!);
      return {
        el,
        top,
        bottom: top + el.offsetHeight,
        from,
        to: el.dataset.timeEnd ? toMin(el.dataset.timeEnd) : from,
        theme: el.dataset.theme ?? 'light',
      };
    });
  };

  let shown = '';
  let theme = '';
  const update = () => {
    if (!boxes.length) return;
    const y = window.scrollY + window.innerHeight * 0.5;
    const b = boxes.find((x) => y >= x.top && y < x.bottom) ?? (y < boxes[0].top ? boxes[0] : boxes[boxes.length - 1]);
    const t = Math.min(1, Math.max(0, (y - b.top) / Math.max(1, b.bottom - b.top)));
    const text = fmt(Math.floor((b.from + (b.to - b.from) * t) / 5) * 5);
    if (text !== shown) {
      shown = text;
      times.forEach((el) => (el.textContent = text));
      if (part) part.textContent = partOf(toMin(text));
    }
    // navbar ink: the section under the navbar's middle line
    const hy = window.scrollY + 36;
    const under = boxes.find((x) => hy >= x.top && hy < x.bottom);
    if (nav && under && under.theme !== theme) {
      theme = under.theme;
      nav.dataset.theme = theme;
    }
  };

  const refresh = () => {
    measure();
    update();
  };
  refresh();
  window.addEventListener('resize', refresh);
  subscribe(update);
  return { refresh, update };
}
