// @ts-nocheck — three.js types are not installed on purpose (same as stage.ts).
/**
 * D-191: the environment maps (EXR, DWA-compressed) are decoded here, off the main thread.
 * EXRLoader.parse is plain JavaScript and took 100–130 ms per map on a desktop (four times that on a
 * phone), three times at page load. The decoder and its output are the same as before: the main
 * thread gets the half-float pixels and builds the same DataTexture from them (ring/exr.ts).
 */
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

self.onmessage = async (e: MessageEvent<{ id: number; url: string }>) => {
  const { id, url } = e.data;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    // header is dropped (not needed, not always cloneable); the rest is what DataTextureLoader applies
    const { header, ...tex } = new EXRLoader().parse(await res.arrayBuffer());
    (self as any).postMessage({ id, tex }, [tex.data.buffer]);
  } catch (err) {
    (self as any).postMessage({ id, error: String(err) });
  }
};
