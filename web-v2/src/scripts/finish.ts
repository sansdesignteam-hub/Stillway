/**
 * The visitor's finish and light choice (S10), shared with S11 (D-098). Changed only by clicking a
 * swatch or the light toggle, never by scroll (D-069). Poses read it each frame; a short tween
 * blends the material (finA → finB by finT) and the Lamp env.
 */
import gsap from 'gsap';

export const FINISHES = ['Silver', 'Black', 'Gold'] as const;
export type FinishName = (typeof FINISHES)[number];

export const choice = { finA: 0, finB: 0, finT: 1, lamp: 0, index: 0, lampOn: false };
const listeners = new Set<() => void>();
export const onChoice = (fn: () => void) => listeners.add(fn);
const emit = () => listeners.forEach((f) => f());

export function setFinish(i: number, reduced = false) {
  if (i === choice.index) return;
  // start the blend from wherever the material is now
  choice.finA = choice.finT >= 0.5 ? choice.finB : choice.finA;
  choice.finB = i;
  choice.index = i;
  choice.finT = 0;
  gsap.to(choice, { finT: 1, duration: reduced ? 0 : 0.6, ease: 'power2.inOut', overwrite: true });
  emit();
}

export function setLamp(on: boolean, reduced = false) {
  if (on === choice.lampOn) return;
  choice.lampOn = on;
  gsap.to(choice, { lamp: on ? 1 : 0, duration: reduced ? 0 : 0.7, ease: 'power2.inOut' });
  emit();
}

/** pose fields for a section that shows the choice (S10, S11) */
export const finishPose = (custom = 1) => ({ custom, finA: choice.finA, finB: choice.finB, finT: choice.finT });
