// @ts-nocheck — three.js types are not installed on purpose (same as stage.ts).
/**
 * D-191: EXR environment maps, decoded in a worker (exr.worker.ts) so the page stays responsive
 * while they load. Returns the texture EXRLoader.loadAsync returned before, pixel for pixel: same
 * decoder, same half-float data, same texture settings (DataTextureLoader._applyTexData).
 * Without module workers the map is decoded on the main thread as before.
 */
import { DataTexture, ClampToEdgeWrapping, LinearFilter } from 'three';

let worker: Worker | null = null;
let seq = 0;
const waiting = new Map<number, { ok: (t: any) => void; fail: (e: unknown) => void }>();

function viaWorker(url: string): Promise<any> {
  if (!worker) {
    worker = new Worker(new URL('./exr.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const w = waiting.get(e.data.id);
      if (!w) return;
      waiting.delete(e.data.id);
      if (e.data.error) w.fail(new Error(e.data.error));
      else w.ok(e.data.tex);
    };
    worker.onerror = (e) => {
      waiting.forEach((w) => w.fail(e));
      waiting.clear();
      worker = null;
    };
  }
  const id = ++seq;
  return new Promise((ok, fail) => {
    waiting.set(id, { ok, fail });
    worker!.postMessage({ id, url: new URL(url, location.href).href });
  });
}

async function onMain(url: string) {
  const { EXRLoader } = await import('three/examples/jsm/loaders/EXRLoader.js');
  const buffer = await fetch(url).then((r) => r.arrayBuffer());
  const { header, ...tex } = new EXRLoader().parse(buffer);
  return tex;
}

export async function loadExr(url: string): Promise<DataTexture> {
  let d: any;
  try {
    d = await viaWorker(url);
  } catch {
    d = await onMain(url);
  }
  // = DataTextureLoader._applyTexData for what EXRLoader.parse returns
  const t = new DataTexture();
  t.image.width = d.width;
  t.image.height = d.height;
  t.image.data = d.data;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.magFilter = d.magFilter ?? LinearFilter;
  t.minFilter = d.minFilter ?? LinearFilter;
  t.anisotropy = 1;
  if (d.colorSpace !== undefined) t.colorSpace = d.colorSpace;
  if (d.flipY !== undefined) t.flipY = d.flipY;
  if (d.format !== undefined) t.format = d.format;
  if (d.type !== undefined) t.type = d.type;
  if (d.generateMipmaps !== undefined) t.generateMipmaps = d.generateMipmaps;
  t.needsUpdate = true;
  return t;
}

/** the worker is not needed once the last map is in */
export function closeExr() {
  if (waiting.size) return;
  worker?.terminate();
  worker = null;
}
