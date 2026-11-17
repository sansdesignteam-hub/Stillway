/**
 * Motion layer for Stillway Home.
 * - Lenis smooth scroll on the GSAP ticker (skipped for reduced motion)
 * - the scroll clock: the page is one day, 06:40 → 23:00
 * - hero: the ring floats in front of the wordmark, then lands on the stone
 * - activity: a strip of moments slides through a fixed frame
 * - the ring: three plates replace one another while the steps change
 * Only transform, opacity and clip-path are animated.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dayparts, daylight } from '../content/home';
import { initFooterLines } from './footerLines';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __stillwayMotion?: boolean;
  }
}

const toMin = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (min: number) => {
  const m = Math.round(min) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
const partOf = (min: number) => {
  let label = dayparts[0][1];
  for (const [start, l] of dayparts) if (min >= start) label = l;
  return label;
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function initMotion() {
  window.__stillwayMotion = true;
  const mm = gsap.matchMedia();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPhone = () => window.matchMedia('(max-width: 760px)').matches;

  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  /* ---------------- smooth scroll ---------------- */
  let lenis: Lenis | null = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95, anchors: { offset: -4 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- scroll clock + header theme ---------------- */
  const clockTimes = document.querySelectorAll<HTMLElement>('[data-clock-time]');
  const clockPart = document.querySelector<HTMLElement>('[data-clock-part]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
  let markers: { y: number; min: number }[] = [];
  let chapterBoxes: { top: number; bottom: number; el: HTMLElement }[] = [];

  const absTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
  const measure = () => {
    markers = [...document.querySelectorAll<HTMLElement>('[data-time]')]
      .map((el) => ({ y: absTop(el), min: toMin(el.dataset.time!) }))
      .sort((a, b) => a.y - b.y);
    chapterBoxes = chapters.map((el) => ({ el, top: absTop(el), bottom: absTop(el) + el.offsetHeight }));
  };

  let lastShown = '';
  let lastChapter: HTMLElement | null = null;
  const updateClock = () => {
    if (!markers.length) return;
    const y = window.scrollY + window.innerHeight * 0.5;
    let min = markers[0].min;
    for (let i = 0; i < markers.length; i++) {
      const a = markers[i];
      const b = markers[i + 1];
      if (y < a.y) break;
      if (!b) {
        min = a.min;
        break;
      }
      if (y < b.y) {
        min = a.min + ((b.min - a.min) * (y - a.y)) / Math.max(1, b.y - a.y);
        break;
      }
      min = b.min;
    }
    const text = fmt(Math.floor(min / 5) * 5);
    if (text !== lastShown) {
      lastShown = text;
      clockTimes.forEach((el) => (el.textContent = text));
      if (clockPart) clockPart.textContent = partOf(toMin(text));
    }

    const hy = window.scrollY + 36;
    const ch = chapterBoxes.find((c) => hy >= c.top && hy < c.bottom)?.el ?? null;
    if (ch && ch !== lastChapter && header) {
      lastChapter = ch;
      const theme = ch.dataset.theme;
      header.dataset.theme = theme ?? 'light';
      const s = header.style;
      if (theme === 'photo') {
        s.setProperty('--header-ink', '#fff');
        s.setProperty('--bar-bg', 'rgb(255 255 255 / 0.14)');
        s.setProperty('--bar-rule', 'rgb(255 255 255 / 0.25)');
      } else if (theme === 'dark') {
        s.setProperty('--header-ink', 'var(--paper)');
        s.setProperty('--bar-bg', 'rgb(255 255 255 / 0.08)');
        s.setProperty('--bar-rule', 'rgb(255 255 255 / 0.14)');
      } else {
        s.setProperty('--header-ink', 'var(--ink)');
        s.setProperty('--bar-bg', 'rgb(255 255 255 / 0.55)');
        s.setProperty('--bar-rule', 'rgb(31 30 28 / 0.12)');
      }
    }
  };
  ScrollTrigger.addEventListener('refresh', () => {
    measure();
    updateClock();
  });
  if (lenis) lenis.on('scroll', updateClock);
  else window.addEventListener('scroll', updateClock, { passive: true });

  /* ---------------- hero: the ring lands ---------------- */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const ring = document.querySelector<HTMLElement>('[data-hero-ring]');
  const ringImg = ring?.querySelector('img');
  const stage = document.querySelector<HTMLElement>('.hero__stage--front');
  const pin = document.querySelector<HTMLElement>('.hero__pin');
  let heroP = 0;

  if (hero && ring && stage && pin) {
    // float pose, relative to the landed pose set in CSS
    const float = () => {
      const W = stage.offsetWidth;
      const H = stage.offsetHeight;
      const pinH = pin.offsetHeight;
      const lw = ring.offsetWidth;
      const lh = ring.offsetHeight;
      const lcx = ring.offsetLeft + lw / 2;
      const lcy = ring.offsetTop + lh / 2;
      const targetW = isPhone() ? window.innerWidth * 0.66 : Math.min(window.innerWidth * 0.3, pinH * 0.62);
      const fcx = W / 2;
      const fcy = H / 2 + pinH * (isPhone() ? 0.0 : 0.03);
      return { x: fcx - lcx, y: fcy - lcy, scale: targetW / lw };
    };

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // load
      const intro = gsap.timeline({ delay: 0.1 });
      intro
        .fromTo('[data-hero-bg]', { scale: 1.08 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
        .fromTo('[data-hero-dim]', { opacity: 0.75 }, { opacity: 0.42, duration: 1.8, ease: 'power2.out' }, 0)
        .fromTo('.hero__char', { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.045 }, 0.2)
        .fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.55)
        .fromTo('[data-hero-meta], [data-hero-fade]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.9);

      // float while waiting; the hover fades out as it lands
      gsap.ticker.add(heroBob);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
          invalidateOnRefresh: true,
          onUpdate: (self) => (heroP = self.progress),
        },
      });
      tl.fromTo(
        ring,
        { x: () => float().x, y: () => float().y, scale: () => float().scale, rotation: -9 },
        { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.72, ease: 'power2.inOut' },
        0,
      )
        .to('[data-hero-dim]', { opacity: 0.2, duration: 0.7 }, 0)
        .fromTo('[data-hero-contact]', { opacity: 0, scaleX: 0.6 }, { opacity: 0.55, scaleX: 1, duration: 0.2, ease: 'power2.out' }, 0.56)
        .to('[data-hero-word]', { yPercent: -18, opacity: 0, duration: 0.45 }, 0.12)
        .to('[data-hero-meta]', { opacity: 0, duration: 0.3 }, 0.08)
        .to('.hero__statement', { opacity: 0, y: -16, duration: 0.2 }, 0.38)
        .fromTo('[data-hero-offer]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.66)
        .to({}, { duration: 0.12 });

      return () => gsap.ticker.remove(heroBob);
    });
  }
  function heroBob(time: number) {
    if (!ringImg) return;
    const k = 1 - smooth(clamp01(heroP / 0.7));
    gsap.set(ringImg, { y: Math.sin(time * 1.3) * 10 * k, rotation: Math.sin(time * 0.9) * 1.6 * k });
  }

  /* ---------------- section entrances ---------------- */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((h) => {
      gsap.fromTo(
        h.querySelectorAll('.line__inner'),
        { yPercent: 110, y: 0 },
        { yPercent: 0, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: h, start: 'top 88%', once: true } },
      );
    });

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.95, stagger: 0.08, delay: 0.1, overwrite: true }),
    });

    document.querySelectorAll<HTMLElement>('[data-img-reveal]').forEach((el) => {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' });
      if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.15);
    });

    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
      const box = img.closest('[data-img-reveal], .tile') ?? img;
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
    });



    gsap.fromTo('[data-finishes-bg]', { yPercent: -6, scale: 1.08 }, { yPercent: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: '.finishes', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('[data-order-card]', { y: 120, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: '.finishes', start: 'top 85%', end: 'top 20%', scrub: 1 } });

    gsap.fromTo(
      '[data-close-ring]',
      { yPercent: -70, rotation: -14, scale: 1.12 },
      { yPercent: 0, rotation: 0, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: '.close', start: 'top 90%', end: 'top top', scrub: 1 } },
    );

  });

  /* ---------------- rhythm: sticky copy follows the photograph in view ---------------- */
  const rSteps = [...document.querySelectorAll<HTMLElement>('[data-rhythm-step]')];
  const rShots = [...document.querySelectorAll<HTMLElement>('[data-rhythm-shot]')];
  const setRhythm = (i: number) => rSteps.forEach((s, k) => s.classList.toggle('is-active', k === i));
  mm.add('(min-width: 761px)', () => {
    rShots.forEach((shot, i) =>
      ScrollTrigger.create({
        trigger: shot,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => self.isActive && setRhythm(i),
      }),
    );
    if (!reduced)
      rShots.forEach((shot) =>
        gsap.fromTo(shot, { clipPath: 'inset(8% 6% 8% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'top 35%', scrub: true } }),
      );
  });

  /* ---------------- one line a day: the ring settles, the card rises ---------------- */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ring = document.querySelector('[data-insight-ring]');
    const card = document.querySelector('[data-insight-card]');
    const fill = document.querySelector<SVGPathElement>('[data-gauge-fill]');
    if (ring)
      gsap.fromTo(ring, { scale: 1.12, rotation: -6, yPercent: 6 }, { scale: 1, rotation: 0, yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.insight', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    if (card) {
      const parts = card.querySelectorAll('[data-glass-part]');
      const stats = card.querySelectorAll('.glass__stats > div');
      // the card glides in with the scroll …
      gsap.fromTo(
        card,
        { y: 140, scale: 0.9, opacity: 0, rotateX: 14, transformPerspective: 900 },
        { y: 0, scale: 1, opacity: 1, rotateX: 0, ease: 'power2.out', scrollTrigger: { trigger: '.insight__stage', start: 'top 95%', end: 'top 35%', scrub: 1.1 } },
      );
      // … then its contents settle in once, in reading order
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 70%', once: true } });
      tl.fromTo(parts, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1 });
      if (fill) {
        const len = fill.style.getPropertyValue('--len');
        tl.fromTo(fill, { strokeDasharray: '0 400' }, { strokeDasharray: `${len} 400`, duration: 1.6, ease: 'power3.inOut' }, 0.15);
      }
      tl.fromTo(stats, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.55);
    }
  });

  /* ---------------- hand-overs (ayocin): the next chapter rises over the last one ----------------
     Rhythm → Activity and rest, and Made to be forgotten → the product. The outgoing chapter
     holds still at its end, sinks back a little and dims while the next one slides up over it. */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const pairs: [string, string][] = [
      ['.rhythm', '.rhythm__grid'],
      ['.ring-story', '.ring-story__stage'],
    ];
    for (const [out, innerSel] of pairs) {
      const section = document.querySelector<HTMLElement>(out);
      const inner = section?.querySelector<HTMLElement>(innerSel);
      if (!section || !inner) continue;
      ScrollTrigger.create({ trigger: section, start: 'bottom bottom', end: '+=100%', pin: true, pinSpacing: false });
      gsap.to(inner, {
        scale: 0.94,
        opacity: 0.35,
        yPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'bottom bottom', end: '+=100%', scrub: true },
      });
    }
  });

  /* ---------------- activity and rest: the strip ---------------- */
  const track = document.querySelector<HTMLElement>('[data-activity]');
  const items = [...document.querySelectorAll<HTMLElement>('[data-activity-item]')];
  const nowTime = document.querySelector<HTMLElement>('[data-activity-time]');
  const nowState = document.querySelector<HTMLElement>('[data-activity-state]');
  const nowKey = document.querySelector<HTMLElement>('[data-activity-key]');
  const nowDetail = document.querySelector<HTMLElement>('[data-activity-detail]');
  const ticks = [...document.querySelectorAll<HTMLElement>('[data-activity-tick]')];
  if (track && items.length) {
    const N = items.length;
    let active = -1;
    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      const f = daylight.frames[i];
      if (nowTime) nowTime.textContent = f.time;
      if (nowState) nowState.textContent = f.state;
      if (nowKey) nowKey.dataset.state = f.state;
      if (nowDetail) nowDetail.textContent = f.detail;
      ticks.forEach((t, k) => t.classList.toggle('is-active', k === i));
      if (!reduced && nowTime)
        gsap.fromTo([nowTime, nowState?.parentElement, nowDetail], { y: 10, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, overwrite: true });
    };
    setActive(0);

    const layout = (p: number) => {
      // dwell on each frame: the strip moves between frames and rests on them
      const raw = p * (N - 1);
      const base = Math.floor(raw);
      const f = Math.min(N - 1, base + smooth(smooth(raw - base)));
      const bw = items[0].offsetWidth;
      const s = isPhone() ? 0.4 : 0.36;
      const sw = bw * s;
      const gap = isPhone() ? 12 : 22;
      const near = bw / 2 + gap + sw / 2;
      items.forEach((el, i) => {
        const d = i - f;
        const ad = Math.abs(d);
        const k = smooth(Math.min(1, ad));
        const x = Math.sign(d) * (ad <= 1 ? k * near : near + (ad - 1) * (sw + gap));
        gsap.set(el, { x, scale: lerp(1, s, k), zIndex: 100 - Math.round(ad * 10), opacity: ad > 4 ? 0 : 1 });
      });
      setActive(Math.round(f));
    };

    if (!reduced) {
      layout(0);
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => layout(self.progress),
        onRefresh: (self) => layout(self.progress),
      });
    }
  }

  /* ---------------- the ring: three plates ---------------- */
  const story = document.querySelector<HTMLElement>('[data-ring-story]');
  const steps = [...document.querySelectorAll<HTMLElement>('[data-step]')];
  const plates = [...document.querySelectorAll<HTMLElement>('[data-ring-plate]')];
  const bodies = [...document.querySelectorAll<HTMLElement>('[data-step-body]')];
  if (story && plates.length) {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(plates.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            const n = plates.length;
            const idx = Math.min(n - 1, Math.floor(self.progress * n * 0.999));
            steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
            bodies.forEach((s, i) => s.classList.toggle('is-active', i === idx));
          },
        },
      });
      tl.fromTo(plates[0].querySelector('img'), { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
      plates.slice(1).forEach((p, i) => {
        const at = 0.75 + i * 1.0;
        tl.to(p, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.inOut' }, at);
        tl.fromTo(p.querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 1.1 }, at);
      });
      tl.to({}, { duration: 0.2 });
    });
  }

  /* ---------------- finishes: finish × light ---------------- */
  const picker = document.querySelector<HTMLFormElement>('[data-picker]');
  const finishStage = document.querySelector<HTMLElement>('[data-finish-stage]');
  const status = document.querySelector<HTMLElement>('[data-picker-status]');
  const fName = document.querySelector<HTMLElement>('[data-finish-name]');
  const lName = document.querySelector<HTMLElement>('[data-light-name]');
  if (picker && finishStage) {
    picker.addEventListener('change', () => {
      const data = new FormData(picker);
      const finish = String(data.get('finish'));
      const light = String(data.get('light'));
      finishStage.dataset.finish = finish;
      finishStage.dataset.light = light;
      const F = finish[0].toUpperCase() + finish.slice(1);
      const L = light === 'day' ? 'Daylight' : 'Lamp light';
      if (fName) fName.textContent = F;
      if (lName) lName.textContent = L;
      if (status) status.textContent = `${F} in ${L.toLowerCase()}.`;
    });
  }

  /* ---------------- FAQ ---------------- */
  document.querySelectorAll<HTMLDetailsElement>('.qa').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!d.open || reduced) return;
      const a = d.querySelector('.qa__a');
      if (a) gsap.fromTo(a, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5 });
      ScrollTrigger.refresh();
    });
  });

  initFooterLines();

  /* ---------------- CTA → footer: the page lifts off a fixed footer (gulfalts) ---------------- */
  const footerEl = document.querySelector<HTMLElement>('[data-footer]');
  const mainEl = document.querySelector<HTMLElement>('main#main');
  if (footerEl && mainEl) {
    const fit = () => {
      const h = footerEl.offsetHeight;
      // only when the whole footer fits on screen; otherwise it stays in the flow
      const on = h > 0 && h < window.innerHeight - 40;
      document.documentElement.classList.toggle('footer-reveal', on);
      document.documentElement.style.setProperty('--footer-h', on ? `${h}px` : '0px');
      ScrollTrigger.refresh();
    };
    new ResizeObserver(() => fit()).observe(footerEl);
    window.addEventListener('resize', fit);
    fit();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // the footer's contents rise a little as they are uncovered
      gsap.fromTo(
        footerEl.querySelectorAll('.footer__top, .footer__mark'),
        { yPercent: 18, opacity: 0.4 },
        { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: mainEl, start: 'bottom bottom', end: () => `+=${footerEl.offsetHeight}`, scrub: true, invalidateOnRefresh: true } },
      );
    });
  }
  measure();
  updateClock();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
