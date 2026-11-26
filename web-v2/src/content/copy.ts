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
    { label: 'FAQ', href: '#faq' },
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
      big: 'Stillway notes the days and stays quiet.',
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
};

export const activity = {
  status: 'title + body draft; states approved D-066',
  heading: ['Activity', 'and rest.'], // shown as "ACTIVITY" caps + "and rest."
  body: 'Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day.',
  // photos: Figma Day arc / State 3 (D-172); alt text describes the new frames
  frames: [
    { key: 's0740', time: '07:40', state: 'Moving', detail: '25 min walk', alt: '07:40 — A hand on the rail of a treadmill, the silver ring on one finger.' },
    { key: 's0900', time: '09:00', state: 'Resting', detail: '40 min focus', alt: '09:00 — A hand resting near his face, a black ring on one finger.' },
    { key: 's1030', time: '10:30', state: 'Moving', detail: '15 min stretch', alt: '10:30 — A hand holding the ring up between finger and thumb.' },
    { key: 's1230', time: '12:30', state: 'Resting', detail: '30 min lunch', alt: '12:30 — A man in sunglasses by the water, a gold ring on his hand.' },
    { key: 's1530', time: '15:30', state: 'Moving', detail: '20 min stairs', alt: '15:30 — The ring on a ledge in warm amber light.' },
  ],
};

export const insight = {
  status: 'draft (numbers approved D-066)',
  eyebrow: '17:30 · Daily insight', // Figma S05 (D-142), shown in capitals (D-156: no [ ])
  headline: ['Everything it noticed.', 'One calm view.'],
  body: 'In the evening the app gathers the day into one view you can read and put down. It describes what happened. It does not tell you what to fix.',
  card: {
    label: 'Last night',
    value: '7h 12m',
    sr: 'Rested 7 hours 12 minutes',
    progress: 0.9, // bar length only, rested against a personal target; no percent label (home-copy-v2)
    line: 'Settled 23:10 · Up 06:22',
    insight: 'You woke briefly twice, both before 03:00.',
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
  alt: {
    ring: 'The Stillway ring rolling to a stop on a sand-coloured tile.',
    hand: 'A hand on a plain cream background, the ring settling at the base of one raised finger.',
  },
};

export const specs = {
  status: 'Figma Design 07 State 1–7 (D-149); facts D-067',
  headline: ['Through', 'the day.'],
  // Figma State 3–6: title above the line, sentence below it (left); spec + small note (right).
  // '\n' = a line break kept from Figma
  cards: [
    { key: 'night', n: 'I', name: 'Night', title: 'Sleeps with you.\nCharges while you don’t.', spec: 'Up to 7 days on a charge.', note: 'Top up on the dock while you shower.', alt: 'Night: asleep under a linen cover, the ring on the index finger of the resting hand.' },
    { key: 'desk', n: 'II', name: 'Desk', title: 'Sized to forget.', spec: 'Sizes 6–13.', note: 'Try them on with the sizing kit before you choose.', alt: 'Desk: hands on a keyboard, the plain silver ring on the index finger.' },
    { key: 'move', n: 'III', name: 'Move', title: 'Light enough to lose track of.', spec: 'About 4 g, 2.6 mm thin.', note: '', alt: 'Move: tying a shoe on a studio floor, the ring on the left hand.' },
    { key: 'rinse', n: 'IV', name: 'Rinse', title: 'Hands in water. Ring stays on.', spec: 'Water resistant to 100 m.', note: 'Washing up, rain, a swim.', alt: 'Rinse: hands under running water, the wet ring on the index finger.' },
  ],
  everyday: { the: 'The', word: 'Everyday', caption: 'Ring shown where it’s worn.', alt: 'Three Stillway rings on a mossy stone in warm light: silver standing, black in its charging dock, gold lying down.' },
};

export const features = {
  status: 'Figma Design 08 State 1–4 (D-154); lights are mode status, not sensor claims (D-062); red only means off',
  kickers: ['Features', 'Sensor · Light'], // shown in capitals (D-156: no [ ])
  heads: ['Inside the ring.', 'One light, tuned to the task.', 'Blue at night. Violet by morning.', 'Red means it’s off.'],
  legend: [
    { key: 'green', label: 'Heart rate', detail: 'Green · Heart rate' },
    { key: 'blue', label: 'Sleep', detail: 'Blue · Sleep' },
    { key: 'violet', label: 'Recovery', detail: 'Violet · Recovery' },
  ],
  off: 'Red means it’s off.',
  offLong: 'When the battery runs out, one small red light shows in the lower sensor window.',
  alt: 'The inside of the Stillway ring, one small window lit green, then blue, then violet; when the ring is off, a small red light in the lower window.',
};

export const app = {
  status: 'draft (home-copy-v2 §09); numbers simulated (D-066), no score',
  states: [
    { key: 'green', chip: 'Green light · Heart rate', left: 'The green light, read back. Your heart rate through the day, at a glance.', right: 'Resting 58 bpm. Peak on the stairs, 15:30.', label: 'Heart rate' },
    { key: 'blue', chip: 'Blue light · Sleep', left: 'The blue light, read back. Your night, in order: when you settled, how deep you went.', right: 'Deep, light and REM sleep, laid out across the night.', label: 'Sleep' },
    { key: 'violet', chip: 'Violet light · Recovery', left: 'The violet light, read back. How the night sat against the rest of your week.', right: 'HRV across the week, with today in full colour.', label: 'Recovery' },
  ],
  scroll: 'Scroll down',
  heart: { label: 'Resting', value: '58', unit: 'bpm', peak: 'Peak 82 bpm · 15:30 stairs' },
  // stage durations are simulated and add up to 7h 12m (D-066 set)
  sleep: { line: 'Settled 23:10 · Up 06:22', h: '7', m: '12', stages: [{ name: 'Deep', d: '1h 24m', min: 84 }, { name: 'REM', d: '1h 36m', min: 96 }, { name: 'Light', d: '4h 12m', min: 252 }] },
  recovery: { title: 'HRV · this week', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], bars: [0.62, 0.55, 0.7, 0.58, 0.66, 0.74, 0.8], line: 'Steady day, calm evening.' },
};

export const finishes = {
  status: 'draft (home-copy-v2 §10); $299 D-015/D-067, 30-night trial D-068, button D-069/D-074',
  heads: ['Turn it yourself.', 'Find your size and finish.'],
  hint: { desktop: 'Drag to turn', mobile: 'Swipe to turn' },
  prev: 'Previous angle',
  next: 'Next angle',
  name: 'Stillway Ring',
  price: '$299',
  priceLine: 'Every finish, same price. No required subscription.',
  finishLabel: 'Finish',
  finishes: [
    { name: 'Silver', still: '/ring-fallback/fb-s10-silver-polished.webp' },
    { name: 'Black', still: '/ring-fallback/fb-s10-black-polished.webp' },
    { name: 'Gold', still: '/ring-fallback/fb-s10-gold-polished.webp' },
  ],
  light: { label: 'Light', day: 'Daylight', lamp: 'Lamp light' },
  sizeLabel: 'Size',
  sizeLine: 'Not sure? A sizing kit comes first, so you can try before you settle.',
  sizes: [6, 7, 8, 9, 10, 11, 12, 13],
  trial: '30-night trial',
  box: 'In the box: the ring, a charging dock, and a sizing kit.',
  button: (f: string) => `Choose ${f} · $299`,
  note: 'Stillway is a concept project and is not for sale.',
  alt: 'The Stillway ring, turning on a sand ground in the chosen finish.',
};

export const close = {
  status: 'draft (home-copy-v2 §11); FAQ battery approved in full D-099; footer D-045/D-067/D-069',
  kicker: 'Tomorrow morning,',
  line: 'see your night.',
  cta: 'Find your size and finish',
  ctaLine: 'No required subscription · Sizing kit included · 30-night trial',
  faqTitle: 'Questions, briefly.',
  faq: [
    { q: 'How do I find my size?', a: 'A sizing kit comes in the box. Wear a sample size for a day and a night, then choose the size that feels right. Stillway comes in sizes 6 to 13.' },
    { q: 'Does it work with my phone?', a: 'Yes. The Stillway app works with iPhone and Android.' },
    { q: 'How long does the battery last, and how do I turn it off?', a: 'Up to 7 days on a charge, and it tops up on the dock. To switch it off, hold it on the dock until the light turns red.' },
    { q: 'Can I return it?', a: "Yes. Every Stillway comes with a 30-night trial. Wear it through your days and nights, and if it isn't right for you, send it back within 30 nights of delivery for a full refund." },
    { q: 'Is there a subscription?', a: 'No. The $299 price includes the ring and the companion app. There is no required subscription.' },
    { q: 'Is Stillway a medical device?', a: 'No. Stillway shows patterns in your sleep, activity, and rest. It does not diagnose, treat, or prevent any condition.' },
  ],
  statement: 'Sleep on it. Stillway keeps the pattern.',
  signature: '©STILLWAY x SANS BROTHERS',
  credit: 'A concept project by Sans Brothers.',
  disclaimer: 'Stillway is a concept project and is not for sale. Product images are AI-generated. All app data is simulated.',
  contactLabel: 'Business enquiry',
  email: 'hello@sansbrothers.com',
  menu: [
    { label: 'Rhythm', href: '#sleep' },
    { label: 'The ring', href: '#details' },
    { label: 'The app', href: '#app' },
    { label: 'Finishes', href: '#finishes' },
    { label: 'FAQ', href: '#faq' },
  ],
  top: 'Back to top',
  wordmark: 'Stillway',
};
