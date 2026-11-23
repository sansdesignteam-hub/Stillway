/**
 * Sections not built yet (S06–S11): a dashed label, no ring.
 * The ring leaves as the camera backs out: it shrinks and fades in the first half of the
 * connection (so it is gone before the Dusk → Paper change at 30–70%), in the paper env.
 */
import { put, seg, lerp, window4 } from '../anim';
import { pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

export const placeholder: SectionMotion = {
  update(u, ctx, root) {
    put(root.querySelector<HTMLElement>('[data-ph]'), { o: window4(u, -0.3, 0, 0.6, 1.2) }, ctx);
  },
  // hidden; paper env so a ring leaving toward an unbuilt light section (S06) does not turn dark
  ring: () => pose({ x: -0.32, y: 1.4, w: 0.18, light: 0 }),
  ringIn(x, _ctx, from) {
    const t = seg(x, 0, 0.45);
    const to: Pose = { ...from, w: from.w * 0.4, y: from.y + 1.3 };
    const o = {} as Pose;
    for (const k of Object.keys(from) as (keyof Pose)[]) o[k] = lerp(from[k], to[k], t);
    return o;
  },
};
