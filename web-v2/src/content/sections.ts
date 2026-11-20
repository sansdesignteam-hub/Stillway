/**
 * The 11 sections of V2 (Storyboard §1). Structure only; copy is in copy.ts.
 *
 * Scroll model (story.ts): the page is a row of "tracks" in normal flow. Each track is as tall
 * as its story needs; everything visible lives on one fixed stage (D-063). Lengths are in
 * viewport heights:
 *   tin   incoming connection (Storyboard §3): 0–30% out, 30–70% middle, 70–100% in + clock change
 *   states  1 state = 1 viewport of scroll between state 1 and the last state
 *   hold  dwell on the last state before the next connection starts
 */
export type Bg = 'paper' | 'sand' | 'night' | 'dusk';

export interface SectionDef {
  n: string;
  id: string; // anchor id + data-section
  name: string;
  act: 1 | 2 | 3 | 4;
  time: string;
  timeEnd?: string;
  part?: string; // daypart label override next to the clock (home-copy-v2: "Last night", "Tomorrow")
  bg: Bg;
  states: number;
  tin: number;
  hold: number;
  built: boolean; // false = placeholder until its handoff/copy is built
}

export const sections: SectionDef[] = [
  { n: '01', id: 'hero', name: 'Hero', act: 1, time: '06:50', bg: 'paper', states: 4, tin: 0, hold: 0.5, built: true },
  { n: '02', id: 'why', name: 'Why Stillway', act: 1, time: '07:10', bg: 'paper', states: 4, tin: 0.6, hold: 0.6, built: true },
  { n: '03', id: 'sleep', name: 'Sleep summary', act: 2, time: '23:10', part: 'Last night', bg: 'night', states: 4, tin: 1, hold: 0.6, built: true },
  { n: '04', id: 'activity', name: 'Activity & rest', act: 2, time: '07:40', timeEnd: '15:30', bg: 'night', states: 5, tin: 1, hold: 0.6, built: true },
  { n: '05', id: 'insight', name: 'Daily insight', act: 2, time: '17:30', bg: 'dusk', states: 4, tin: 1, hold: 0.6, built: true },
  { n: '06', id: 'details', name: 'Product details', act: 3, time: '21:00', bg: 'paper', states: 5, tin: 1, hold: 0.6, built: true },
  { n: '07', id: 'specs', name: 'Specs & benefits', act: 3, time: '21:00', bg: 'sand', states: 7, tin: 1, hold: 0.6, built: true },
  { n: '08', id: 'features', name: 'Features', act: 3, time: '21:00', bg: 'night', states: 3, tin: 1, hold: 0.6, built: true },
  { n: '09', id: 'app', name: 'The app', act: 3, time: '21:00', bg: 'paper', states: 3, tin: 1, hold: 0.6, built: true },
  { n: '10', id: 'finishes', name: 'Finishes & pricing', act: 4, time: '22:00', bg: 'sand', states: 1, tin: 1, hold: 0.6, built: false },
  { n: '11', id: 'close', name: 'Closing, FAQ & footer', act: 4, time: '06:50', part: 'Tomorrow', bg: 'night', states: 1, tin: 1, hold: 0.6, built: false },
];

/** Daypart label next to the clock (home-copy-v2 §0, same breaks as V1). */
export const dayparts: Array<[number, string]> = [
  [0, 'Night'],
  [5 * 60, 'Morning'],
  [12 * 60, 'Midday'],
  [14 * 60, 'Afternoon'],
  [18 * 60, 'Evening'],
  [21 * 60, 'Night'],
];

export const meta = {
  title: 'Stillway — Understand your rhythm',
  description: 'Stillway is a concept smart ring. A design exploration, not a product for sale.',
};
