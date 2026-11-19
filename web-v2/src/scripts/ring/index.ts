/**
 * Lazy entry for the ring stage: three.js (~150 KB gz) loads only when a section asks for it.
 *   const { createRingStage, POSES, LED } = await loadRing();
 */
export const loadRing = () =>
  Promise.all([import('./stage'), import('./poses')]).then(([s, p]) => ({ ...s, ...p }));
export type { RingStage, RingStageOptions } from './stage';
