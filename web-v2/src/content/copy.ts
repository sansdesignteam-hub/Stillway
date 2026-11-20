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

/**
 * S01 follows the V1 hero (D-080): wordmark, tagline, three features, price, statement, scroll
 * line. Copy is V1's (web/src/content/home.ts); this overrides home-copy-v2's S01 block for now.
 */
export const hero = {
  status: 'V1 copy per D-080 (headline working copy D-014)',
  wordmark: 'STILLWAY',
  tagline: 'Understand your rhythm.',
  features: ['Sleep summary', 'Activity and rest', 'Daily insight'],
  price: '$299',
  statement: 'A smart ring that brings your sleep, activity, and rest into one everyday view.',
  scroll: 'Scroll down',
  ringAlt: 'The silver Stillway ring, the engraved name on its band, floating above a pale stone in a bed of moss.',
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

export const activity = {
  status: 'title + body draft; states approved D-066',
  heading: ['Activity', 'and rest.'], // shown as "ACTIVITY" caps + "and rest."
  body: 'Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day.',
  simulated: 'Simulated data',
  // photos: 5 C-02 frames from V1, not retouched (D-073); alt text draft (home-copy-v2), adjusted to the frames
  frames: [
    { key: 's0740', time: '07:40', state: 'Moving', detail: '25 min walk', alt: '07:40 — A man walking outside in early light, the ring on his left index finger.' },
    { key: 's0900', time: '09:00', state: 'Resting', detail: '40 min focus', alt: '09:00 — Reading with a coffee at a desk, the ring in view.' },
    { key: 's1030', time: '10:30', state: 'Moving', detail: '15 min stretch', alt: '10:30 — A short stretch by the window, both arms out, the ring on his left index finger.' },
    { key: 's1230', time: '12:30', state: 'Resting', detail: '30 min lunch', alt: '12:30 — Lunch at a table, the ring resting on the hand.' },
    { key: 's1530', time: '15:30', state: 'Moving', detail: '20 min stairs', alt: '15:30 — Taking the stairs on an errand, his hand on the rail.' },
  ],
};

export const insight = {
  status: 'draft (numbers approved D-066)',
  headline: ['Everything it noticed.', 'One calm view.'],
  body: 'In the evening the app gathers the day into one view you can read and put down. It describes what happened. It does not tell you what to fix.',
  card: {
    label: 'Last night',
    value: '7h 12m',
    sr: 'Rested 7 hours 12 minutes',
    progress: 0.9, // bar length only, rested against a personal target; no percent label (home-copy-v2)
    line: 'Settled 23:10 · Up 06:22',
    insight: 'You took more short pauses this afternoon than on most weekdays.',
    simulated: 'Simulated data',
  },
};

export const details = {
  status: 'draft (home-copy-v2 §06)',
  headline: 'Made to be forgotten.',
  steps: [
    { title: 'One quiet band', body: 'A single band with nothing raised on its surface to catch on a sleeve or a keyboard. There is no front to remember and no wrong way to put it on.' },
    { title: 'Softened edges', body: 'Both edges are bevelled where they meet the finger, so the ring sits easily at night and slides on without catching.' },
  ],
  fits: { title: 'Then, it just fits.', body: 'Slip it on in the morning and stop thinking about it.' },
  label: '[ SILVER ]', // the photo ring (A-1b) is brushed, the 3D ring polished: no finish named (open question)
  alt: {
    ring: 'The Stillway ring rolling to a stop on a sand-coloured tile.',
    hand: 'A hand on a plain cream background, the ring settling at the base of one raised finger.',
  },
};

export const specs = {
  status: 'draft (home-copy-v2 §07; facts D-067)',
  headline: ['Through', 'the day.'],
  pill: 'Made for every hour',
  cards: [
    { key: 'night', n: 'I', name: 'Night', title: "Sleeps with you. Charges while you don't.", tag: '[ BATTERY ]', fact: 'Up to 7 days on a charge. Top up on the dock while you shower.', alt: 'Night: asleep under a linen cover, the ring on the index finger of the resting hand.' },
    { key: 'desk', n: 'II', name: 'Desk', title: 'Sized to forget.', tag: '[ SIZE ]', fact: 'Sizes 6–13. Try them on with the sizing kit before you choose.', alt: 'Desk: hands on a keyboard, the plain silver ring on the index finger.' },
    { key: 'move', n: 'III', name: 'Move', title: 'Light enough to lose track of.', tag: '[ WEIGHT · THICKNESS ]', fact: 'About 4 g, 2.6 mm thin.', alt: 'Move: mid-stride on a plain studio floor, the ring on the left hand.' },
    { key: 'rinse', n: 'IV', name: 'Rinse', title: 'Hands in water. Ring stays on.', tag: '[ WATER RATING ]', fact: 'Water resistant to 100 m. Washing up, rain, a swim.', alt: 'Rinse: hands under running water, the wet ring on the index finger.' },
  ],
  // panel values: battery per day is a display of use, so it is labelled (home-copy-v2); the rest are D-067 facts
  battery: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], simulated: 'Simulated data' },
  size: { min: 6, max: 13, value: 9 },
  weight: { g: '4 g', mm: '2.6 mm' },
  water: { rating: '100 m', uses: ['Washing up', 'Rain', 'A swim'] },
  everyday: { title: 'The Everyday', caption: "Ring shown where it's worn.", alt: 'A man seated in a calm paper-and-sand studio, the ring small on his left hand.' },
};
