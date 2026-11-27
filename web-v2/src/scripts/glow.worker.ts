/** D-191: the light painter's pixels, computed off the main thread (see glow.ts, glowPaint.ts). */
import { lightPixels, type ResolvedLight } from './glowPaint';

self.onmessage = (e: MessageEvent<{ id: number; W: number; H: number; light: ResolvedLight }>) => {
  const { id, W, H, light } = e.data;
  const px = lightPixels(W, H, light);
  (self as any).postMessage({ id, px }, [px.buffer]);
};
