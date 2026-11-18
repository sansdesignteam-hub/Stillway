/**
 * Stillway Home — all on-page copy lives here (D-023: copy separated from markup).
 *
 * status:
 *   approved  – accepted in context/decisions.md
 *   proposed  – from context/home-copy.md (Strategy Director), not yet approved
 *   draft     – written by Developer to fill the layout; ILLUSTRATIVE, needs
 *               Strategy Director review before it is treated as copy.
 * All product details are fictional (concept project, D-002 / D-004).
 * Every app number on the page is simulated and labelled as such.
 */

export const meta = {
  status: 'draft',
  title: 'Stillway — Understand your rhythm',
  description:
    'Stillway is a concept smart ring that brings your sleep, activity, and rest into one everyday view. A design exploration by Sans Brothers.',
};

export const nav = {
  status: 'draft',
  links: [
    { label: 'Rhythm', href: '#sleep' },
    { label: 'The ring', href: '#ring' },
    { label: 'Finishes', href: '#finishes' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: { label: 'Explore Stillway', href: '#finishes' }, // proposed (home-copy.md)
};

export const hero = {
  status: 'proposed', // headline approved as working copy (D-014); rest proposed in home-copy.md
  time: '06:40',
  wordmark: 'STILLWAY',
  tagline: 'Understand your rhythm.',
  statement: 'A smart ring that brings your sleep, activity, and rest into one everyday view.',
  features: ['Sleep summary', 'Activity and rest', 'Daily insight'],
  price: '$299',
  cta: { label: 'Explore Stillway', href: '#finishes' },
  offer: ['$299', 'Charger and sizing kit included', 'No required subscription'],
  scroll: 'Scroll down',
  alt: 'A silver Stillway ring above a pale granite stone in a bed of moss, morning sun and leaf shadows on a warm plaster wall.',
};

export const sleep = {
  status: 'draft',
  time: '07:00',
  heading: ['Last night,', 'in one view.'],
  body:
    'Wake up to a short summary of your night: when you settled, how long you rested, and how often it was broken. A picture of the night, not a verdict on it.',

  alt: 'A woman just waking on linen sheets in warm dawn light, her left hand open on the blanket with the ring on her index finger.',
};

export const context = {
  status: 'draft',
  time: '07:20',
  slogan: ['Patterns,', 'not scores.'],
  word: 'Daily',
  body:
    'Stillway keeps the shape of your days: when you sleep, when you move, when you stop. No streaks to protect and no score to chase. Over a few weeks the rhythm starts to show.',
  alt: 'A woman sitting cross-legged on a sofa by a window, holding a cup of tea in both hands and looking outside, the ring on her left index finger.',
};

export const daylight = {
  status: 'draft',
  timeFrom: '07:40',
  timeTo: '15:30',
  heading: ['Activity', 'and rest.'],
  body:
    'Through the day the ring keeps two quiet tallies: the time you spend moving and the moments you stop. Seen together they show the rhythm of a day.',
  // one frame per moment of the day — states and minutes are simulated
  frames: [
    { key: 's0740', time: '07:40', state: 'Moving', detail: '25 min walk', alt: 'A woman walking along a tree-lined path in low morning light, her left hand swinging in front with the ring on her index finger.' },
    { key: 's0900', time: '09:00', state: 'Resting', detail: '40 min focus', alt: 'A woman reading at a table by a window, her left hand resting on an open book, a cup of coffee beside it, the ring on her index finger.' },
    { key: 's1030', time: '10:30', state: 'Moving', detail: '15 min stretch', alt: 'A woman with her eyes closed stretching both arms straight out in front of her, the ring on her left index finger.' },
    { key: 's1230', time: '12:30', state: 'Resting', detail: '30 min lunch', alt: 'A woman eating a salad at an outdoor table under a tree, her left hand relaxed on the table with the ring in the foreground.' },
    { key: 's1530', time: '15:30', state: 'Moving', detail: '20 min stairs and errands', alt: 'A woman on an outdoor staircase, her left hand gripping the railing with the ring on her index finger, a tote with vegetables and a baguette on her shoulder.' },
  ],
  sim: 'Simulated data',
};

export const insight = {
  status: 'draft',
  time: '17:30',
  heading: ['One line a day.'],
  body:
    'In the evening the app turns the day into a single observation, a plain line you can read and put down. It describes what happened. It does not tell you what to fix.',
  phone: {
    label: 'Daily insight',
    day: 'Tuesday',
    time: '17:30',
    gauge: { from: '00:00', to: '24:00', sub: 'Today' },
    sentence: 'You took more short pauses this afternoon than on most weekdays.',
    rows: [
      { label: 'Sleep', value: '6 h 58 m' },
      { label: 'Moving', value: '3 h 05 m' },
      { label: 'Resting', value: '1 h 40 m' },
    ],
  },
};

export const ring = {
  status: 'draft',
  time: '18:30',
  heading: 'Made to be forgotten.',
  steps: [
    {
      title: 'One quiet band',
      body: [
        'A single band of polished metal, with nothing raised on its surface to catch on a sleeve, a bag strap or the edge of a keyboard. It is meant to be worn through the whole day and night, so the outside stays plain and the shape stays simple.',
        'The finish runs evenly all the way round, so there is no front to remember and no wrong way to put it on. Over time it should feel less like a device and more like a ring you simply wear.',
      ],
      img: 'a08',
      alt: 'Macro of the ring’s polished outer band resting on granite.',
    },
    {
      title: 'Softened edges',
      body: [
        'The band keeps a low, even profile, and both edges are bevelled where they meet the finger. That detail matters most at night, when a hard edge would press into the finger beside it.',
        'The inside is gently rounded too, so the ring slides on and off without catching and sits the same way whether your hand is resting, typing or holding a cup.',
      ],
      img: 'a03',
      alt: 'The ring standing upright beside a granite stone, its bevelled edge catching the light.',
    },
    {
      title: 'Sensors on the inside',
      body: [
        'The sensors sit flush on the smooth inner surface, where they rest against the skin and stay out of sight. Nothing on the outside gives them away.',
        'Because they face inward, the ring can quietly note when you rest and when you move without asking for your attention. What it notices becomes the simple views you saw earlier on this page.',
      ],
      img: 'a09',
      alt: 'Macro of the ring’s dark inner surface and its flush sensor pads.',
    },
  ],
};

export const evening = {
  status: 'draft',
  alt: 'The silver ring lying flat on pale stone in low evening sun, casting one long shadow.',
};

export const finishes = {
  status: 'draft', // package facts approved (D-015); wording draft
  time: '19:30',
  heading: ['Three finishes.', 'One price.'],
  body: 'See each finish the way you will live with it, in morning light and under a lamp at night.',
  bgAlt: 'The silver ring lying on a granite stone, low evening sun raking across it.',
  finishLegend: 'Finish',
  lightLegend: 'Light',
  options: [
    { id: 'silver', label: 'Silver' },
    { id: 'black', label: 'Black' },
    { id: 'gold', label: 'Gold' },
  ],
  lights: [
    { id: 'day', label: 'Daylight' },
    { id: 'lamp', label: 'Lamp light' },
  ],
  priceLabel: 'Stillway price',
  price: '$299',
  priceNote: 'Every finish, same price. No required subscription.',
  boxHeading: 'In the box',
  box: 'The ring, a charging dock, and a sizing kit to help you find a comfortable fit.',
  conceptNote: 'Stillway is a concept project and is not for sale.',
  finishAlt: 'The Stillway ring in the {finish} finish, three-quarter view.',
  boxAlt: 'The ring, a round charging dock, and a sizing kit tray laid out on a flat stone.',
};

export const faq = {
  status: 'draft',
  time: '21:00',
  heading: ['Before', 'you decide.'],
  items: [
    {
      q: 'Is there a subscription?',
      a: 'No. The $299 price includes the ring and the companion app. There is no required subscription.',
    },
    {
      q: 'What comes in the box?',
      a: 'The ring, a charging dock, and a sizing kit to help you find a comfortable fit.',
    },
    {
      q: 'Do the finishes cost different amounts?',
      a: 'No. Silver, Black, and Gold are all $299.',
    },
    {
      q: 'How do I find my size?',
      a: 'A sizing kit is included so you can try sizes on before settling on your fit.',
    },
    {
      q: 'Is Stillway a medical device?',
      a: 'No. Stillway shows patterns in your sleep, activity, and rest. It does not diagnose, treat, or prevent any condition.',
    },
    {
      q: 'Is Stillway a real product?',
      a: 'Stillway is a concept project by Sans Brothers: a design exploration, not a product for sale.',
    },
  ],
};

export const close = {
  status: 'draft',
  time: '23:00',
  heading: ['Put the day', 'to rest.'],
  body: 'Put the ring on its dock, let the day settle, and wake up to a clear view of your night.',
  cta: { label: 'Explore Stillway', href: '#finishes' },
  note: 'Stillway is a concept project: a design exploration, not a real product.', // proposed (home-copy.md)
  alt: 'The Stillway ring in moonlight, coming to rest on a mossy stone at night.',
};

export const footer = {
  status: 'approved', // wording given by the user, 17 Nov 2026
  wordmark: 'STILLWAY',
  signature: '©STILLWAY x SANS BROTHERS',
  credit: 'A concept project by Sans Brothers.',
  disclaimer: 'Design exploration, not a real product. Product images are AI-generated. All app data is simulated.',
  enquiryLabel: 'Business enquiry',
  email: 'hello@sansbrothers.com',
  menuLabel: 'Menu',
  hint: 'Hover the lines.',
  top: 'Back to top',
};

/** Time-of-day labels used by the scroll clock (proposed microcopy, home-copy.md). */
export const dayparts: Array<[number, string]> = [
  [0, 'Night'],
  [5 * 60, 'Morning'],
  [12 * 60, 'Midday'],
  [14 * 60, 'Afternoon'],
  [18 * 60, 'Evening'],
  [21 * 60, 'Night'],
];
