/**
 * Sections not built yet (S04–S11): a dashed label, no ring.
 * The ring leaves through the default connection (shrinks and fades to the left in 30–70%,
 * matching 03 → 04 in Storyboard §3).
 */
import { put, window4 } from '../anim';
import { pose } from '../ring/poses';
import type { SectionMotion } from '../story';

export const placeholder: SectionMotion = {
  update(u, ctx, root) {
    put(root.querySelector<HTMLElement>('[data-ph]'), { o: window4(u, -0.3, 0, 0.6, 1.2) }, ctx);
  },
  ring: () => pose({ x: -0.32, y: 0, w: 0.18, alpha: 0, light: 1 }),
};
