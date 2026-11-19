/** Lazy entry: three.js (~150 KB gz) loads after first paint. */
export const loadRing = () => import('./stage');
export type { RingStage } from './stage';
