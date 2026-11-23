/**
 * The 11 sections of V2 (Storyboard §1). Structure only; copy is in copy.ts.
 *
 * Scroll model (story.ts): the page is a row of "tracks" in normal flow. Each track is as tall
 * as its story needs; everything visible lives on one fixed stage (D-063). Lengths are in
 * viewport heights:
 *   tin   incoming connection (Storyboard §3): 0–30% out, 30–70% middle, 70–100% in + clock change
 *   states  1 state = 1 viewport of scroll between state 1 and the last state
 *   hold  dwell on the last state before the next connection starts
 * The panel of a section rises over `panel` (local u) and covers the one before (D-120); the clock
 * and the navbar theme change when that panel passes the navbar.
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
  /** panel rise window in local u (story.ts); default = the first 40% of the incoming connection */
  panel?: [number, number];
  /**
   * 'rise' (default, D-120): the panel rises from the bottom with a straight edge. 'swap' (D-128,
   * 01 → 02 only): the panel appears in place at the end of its window, under a fade the section
   * modules make themselves (the previous section's content is not moved or cut).
   */
  panelMode?: 'rise' | 'swap';
  /** navbar clock keyframes across the incoming connection, x 0..1 (Storyboard v3 §3) */
  clockIn?: Array<[number, string]>;
}

export const sections: SectionDef[] = [
  { n: '01', id: 'hero', name: 'Hero', act: 1, time: '06:50', bg: 'paper', states: 4, tin: 0, hold: 0.5, built: true },
  // 01 → 02 (D-128): the old fade, as live 81318d9 — the hero photo fades to Paper (hero u 2.05–2.8),
  // then the S02 panel is simply there (Paper over Paper, hero u 2.8) and its wall fades in. No rising edge.
  { n: '02', id: 'why', name: 'Why Stillway', act: 1, time: '07:10', bg: 'paper', states: 4, tin: 0.6, hold: 0.6, built: true, panel: [-1.3, -1.29], panelMode: 'swap', clockIn: [[0, '06:50'], [0.7, '07:10']] },
  // 02 → 03 (D-120): the Night panel rises in 0–35%
  { n: '03', id: 'sleep', name: 'Sleep summary', act: 2, time: '23:10', part: 'Last night', bg: 'night', states: 4, tin: 1, hold: 0.6, built: true, panel: [-1, -0.65] },
  { n: '04', id: 'activity', name: 'Activity & rest', act: 2, time: '07:40', timeEnd: '15:30', bg: 'night', states: 5, tin: 1, hold: 0.6, built: true, clockIn: [[0, '05:30'], [0.62, '07:40']] },
  // 04 → 05 (Viture): S04 out and the Dusk panel up in 0–40%, then the ring rises from the bottom edge
  { n: '05', id: 'insight', name: 'Daily insight', act: 2, time: '17:30', bg: 'dusk', states: 4, tin: 1, hold: 0.6, built: true, clockIn: [[0, '16:40'], [0.55, '17:10'], [0.82, '17:30']] },
  { n: '06', id: 'details', name: 'Product details', act: 3, time: '21:00', bg: 'paper', states: 5, tin: 1, hold: 0.6, built: true, panel: [-0.9, -0.5] },
  // 06 → 07: the hand card shrinks first, then the Sand panel rises (the card leaves upward)
  { n: '07', id: 'specs', name: 'Specs & benefits', act: 3, time: '21:00', bg: 'sand', states: 7, tin: 1, hold: 0.6, built: true, panel: [-0.62, -0.2] },
  { n: '08', id: 'features', name: 'Features', act: 3, time: '21:00', bg: 'night', states: 3, tin: 1, hold: 0.6, built: true, panel: [-1, -0.45] },
  // 08 → 09: the ring leaves upward first, then the Paper panel rises
  { n: '09', id: 'app', name: 'The app', act: 3, time: '21:00', bg: 'paper', states: 3, tin: 1, hold: 0.6, built: true, panel: [-0.72, -0.25] },
  { n: '10', id: 'finishes', name: 'Finishes & pricing', act: 4, time: '22:00', bg: 'sand', states: 2, tin: 1, hold: 1, built: true, panel: [-1, -0.45] },
  { n: '11', id: 'close', name: 'Closing, FAQ & footer', act: 4, time: '06:50', part: 'Tomorrow', bg: 'night', states: 4, tin: 1, hold: 0.4, built: true, panel: [-1, -0.5] },
];

/** Daypart label next to the clock (QA G-04, D-123 P11: 16:40 Afternoon, from 17:00 Evening). */
export const dayparts: Array<[number, string]> = [
  [0, 'Night'],
  [5 * 60, 'Morning'],
  [12 * 60, 'Midday'],
  [14 * 60, 'Afternoon'],
  [17 * 60, 'Evening'],
  [21 * 60, 'Night'],
];

export const meta = {
  title: 'Stillway — Understand your rhythm',
  description: 'Stillway is a concept smart ring. A design exploration, not a product for sale.',
};
