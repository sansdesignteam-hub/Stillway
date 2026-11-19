/**
 * On-page copy for V2, from context/home-copy-v2.md (Strategy Director, draft 2, branch
 * Strategic-Content; D-066 makes that file the V2 copy source). `status` mirrors the file:
 * 'approved' only where a decision says so, otherwise 'draft'.
 */
export const nav = {
  status: 'draft',
  links: [
    { label: 'Rhythm', href: '#sleep' },
    { label: 'The ring', href: '#details' },
    { label: 'The app', href: '#app' },
    { label: 'Finishes', href: '#finishes' },
    { label: 'FAQ', href: '#close' },
  ],
  cta: { label: 'Find your size', href: '#finishes', status: 'approved D-069' },
  menu: { open: 'Menu', close: 'Close' },
};

export const hero = {
  status: 'draft',
  wordmark: 'Stillway',
  eyebrow: 'Meet Stillway',
  headline: 'Understand your rhythm.', // working copy D-014
  sub: 'A smart ring that brings your sleep, activity, and rest into one everyday view.',
  link: { label: 'Explore Stillway', href: '#why' },
  scroll: 'Scroll down',
  ringAlt: 'The silver Stillway ring, standing upright in soft morning light.',
};

export const why = {
  status: 'draft',
  label: 'Why Stillway',
  backWord: 'rhythm',
  steps: [
    {
      big: 'Your body already keeps a rhythm.',
      small: 'Sleep, heart rate and temperature already move in a daily pattern, whether you look or not.',
    },
    {
      big: 'Most devices turn it into a score.',
      small: 'Scores, streaks and red alerts can make rest feel like homework.',
    },
    {
      big: 'Stillway just keeps the pattern.',
      small: 'No score to chase. Just what your days look like, kept quietly.',
    },
  ],
  wide: 'keeps the pattern.',
};

export const sleep = {
  status: 'headline + small line draft; numbers approved D-066',
  kicker: 'Last night',
  headline: 'Last night, in one view.',
  // Simulated data set V2 (D-066)
  stats: [
    { tag: 'Settled', value: '23:10', sr: 'Settled at 23:10' },
    { tag: 'Rested', value: '7h 12m', sr: 'Rested 7 hours 12 minutes' },
    { tag: 'Broken', value: '2×', sr: 'Broken twice' },
  ],
  line: 'A picture of the night, not a verdict on it.',
  simulated: 'Simulated data',
};
