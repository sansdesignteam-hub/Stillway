/**
 * The 11 sections of V2, from Storyboard.md §1 ("Peta section").
 * Only structure lives here: id, time on the navbar clock, background and theme.
 * Copy for each section comes from the Strategy Director; layout from the
 * Visual Director's handoff (design/v2/HANDOFF-v2.md). Nothing here is final copy.
 *
 * `time` is where the clock stands when the section starts; `timeEnd` (optional) is where it
 * stands when the section ends. Inside a section the clock moves from `time` to `timeEnd`;
 * between sections it jumps (23:10 → 07:40 is a flashback, not a 8-hour scroll).
 */
export type Theme = 'light' | 'dark';
export type Bg = 'paper' | 'sand' | 'night' | 'dusk';

export interface SectionDef {
  n: string; // "01"
  id: string; // anchor id, also the data-section value
  name: string; // working name from the storyboard (English, shown only in placeholders)
  act: 1 | 2 | 3 | 4;
  time: string;
  timeEnd?: string;
  bg: Bg;
  theme: Theme; // navbar ink on top of this section
  states: number;
}

export const sections: SectionDef[] = [
  { n: '01', id: 'hero', name: 'Hero', act: 1, time: '06:50', bg: 'paper', theme: 'light', states: 4 },
  { n: '02', id: 'why', name: 'Why Stillway', act: 1, time: '07:10', bg: 'paper', theme: 'light', states: 4 },
  { n: '03', id: 'sleep', name: 'Sleep summary', act: 2, time: '23:10', bg: 'night', theme: 'dark', states: 4 },
  { n: '04', id: 'activity', name: 'Activity & rest', act: 2, time: '07:40', timeEnd: '15:30', bg: 'night', theme: 'dark', states: 5 },
  { n: '05', id: 'insight', name: 'Daily insight', act: 2, time: '17:30', bg: 'dusk', theme: 'dark', states: 4 },
  { n: '06', id: 'details', name: 'Product details', act: 3, time: '21:00', bg: 'paper', theme: 'light', states: 4 },
  { n: '07', id: 'specs', name: 'Specs & benefits', act: 3, time: '21:00', bg: 'sand', theme: 'light', states: 5 },
  { n: '08', id: 'features', name: 'Features', act: 3, time: '21:00', bg: 'night', theme: 'dark', states: 3 },
  { n: '09', id: 'app', name: 'The app', act: 3, time: '21:00', bg: 'paper', theme: 'light', states: 3 },
  { n: '10', id: 'finishes', name: 'Finishes & pricing', act: 4, time: '22:00', bg: 'sand', theme: 'light', states: 4 },
  { n: '11', id: 'close', name: 'Closing, FAQ & footer', act: 4, time: '06:50', bg: 'night', theme: 'dark', states: 4 },
];

/** Navbar. Labels and CTA are placeholders until the Strategy Director's V2 copy lands. */
export const nav = {
  status: 'placeholder',
  links: [
    { label: 'Rhythm', href: '#sleep' },
    { label: 'The ring', href: '#details' },
    { label: 'App', href: '#app' },
    { label: 'Finishes', href: '#finishes' },
  ],
  // CTA wording from Storyboard §2 (Section 11); placeholder here.
  cta: { label: 'Find your size', href: '#finishes' },
};

/** Part-of-day label next to the clock (same breaks as V1). */
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
