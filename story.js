/* The MyGers story. Every message, name, price and figure the page shows lives here.
   The page (app.js) only draws what this file says.

   This file is part 1 of 3: Acts 1 and 2 (scenes 1.1 to 2.2 and the three journeys), the fans, agents and prices.
   Part 2, story-screens.js, holds the ready-drawn screens. Part 3, story-week.js, holds Acts 3 and 4.

   How it reads
   - scenes: the main line, in order. → walks their steps one by one.
   - a step is one click. `add` lists what appears: [thread, item] pairs.
     To make two things arrive on one click, put both pairs in the same step.
   - threads: a chat or a screen. A phone shows one thread; a message is drawn as "mine"
     when its `from` is the phone's owner.
   - journeys: each phone's own timeline within a scene (scene.focus maps phone number to journey).
     It plays the same with all phones on screen or with one in focus.
   - panels: the Behind the scenes notes. A step's `panel: {id, show}` shows the first `show` steps.
     Once opened, a panel stays until the scene ends.
   - `cut: true` on a day marker starts a fresh screen: the chat shows only what comes from that
     marker on, as the boards do when the story jumps to a later day.
   - `patch: [[thread, itemId, fields]]` changes an item already on screen (an approval arriving on a card).
*/
window.STORY = {
  ui: {
    back: 'Back to all three chats',
    chatInput: 'Message, or tag @Gers',
    panelTitle: 'Behind the scenes',
    gers: 'Gers',
    gersTag: '@Gers',
    reportsTo: '→ Gers',
    clubViewPlaceholder: 'Club view: coming next'
  },

  match: {
    home: 'Rangers', away: 'Celtic', ground: 'Ibrox',
    date: 'Sun 3 Jan', kickOff: { glasgow: '12:00', melbourne: '23:00', dubai: '16:00' },
    result: { home: 2, away: 1 }
  },

  // bg and fg are each fan's avatar and name colours, as on the boards
  fans: {
    calum:    { name: 'Calum',    initials: 'CA', bg: '#dbe5ff', fg: '#0032a0', age: 38, place: 'Dubai',     interest: 'Analytics',         legend: 'ferguson' },
    aileen:   { name: 'Aileen',   initials: 'AI', bg: '#fde2e3', fg: '#a3161c', age: 31, place: 'Glasgow',   interest: 'Players',           legend: 'mcgregor' },
    rory:     { name: 'Rory',     initials: 'RO', bg: '#dff1e7', fg: '#0b6b47', age: 24, place: 'Glasgow',   interest: 'Behind the scenes', legend: 'tavernier' },
    fraser:   { name: 'Fraser',   initials: 'FR', bg: '#fbecd0', fg: '#7a4b00', age: 46, place: 'Melbourne', interest: 'Analytics',         legend: 'laudrup' },
    kirsty:   { name: 'Kirsty',   initials: 'KI', bg: '#efe3fb', fg: '#5b2a8c', age: 36, place: 'Melbourne', interest: 'Players',           legend: 'ferguson' },
    hamish:   { name: 'Hamish',   initials: 'HA', bg: '#e3eef6', fg: '#24506e', age: 47, place: 'Melbourne', interest: 'History',           legend: 'laudrup' },
    morag:    { name: 'Morag',    initials: 'MO', bg: '#f3e1f0', fg: '#7d2269', age: 58, place: 'Dubai',     interest: 'Behind the scenes', legend: 'mccoist' },
    ewan:     { name: 'Ewan',     initials: 'EW', bg: '#e4f0f0', fg: '#1f5e5e', age: 39, place: 'Dubai',     interest: 'Players',           legend: 'ferguson' },
    isla:     { name: 'Isla',     initials: 'IS', bg: '#f6e9dc', fg: '#7a4316', age: 29, place: 'Dubai',     interest: 'Analytics',         legend: 'mcgregor' },
    angus:    { name: 'Angus',    initials: 'AN', bg: '#e6e9ee', fg: '#3a4557', age: 55, place: 'Dubai',     interest: 'History',           legend: 'mccoist' },
    niamh:    { name: 'Niamh',    initials: 'NI', bg: '#e9f4dc', fg: '#3f6212', age: 22, place: 'Dubai',     interest: 'Behind the scenes', legend: 'tavernier' },
    greig:    { name: 'Greig',    initials: 'GR', bg: '#e1e8f7', fg: '#2b3f7a', age: 52, place: 'Dubai',     interest: 'Analytics',         legend: 'mccoist' },
    catriona: { name: 'Catriona', initials: 'CT', bg: '#fbe4ea', fg: '#8d1f43', age: 44, place: 'Dubai',     interest: 'Players',           legend: 'laudrup' },
    lewis:    { name: 'Lewis',    initials: 'LE', bg: '#dcefff', fg: '#0b4f86', age: 30, place: 'Dubai',     interest: 'History',           legend: 'mcgregor' },
    jamie:    { name: 'Jamie',    initials: 'JA', bg: '#fff1cc', fg: '#6b4e00', age: 25, place: 'Dubai',     interest: 'Analytics',         legend: 'tavernier' }
  },

  // the agents behind Gers; fans never see these names
  agents: {
    ticket:   { name: 'Ticket agent',   icon: 'ticket' },
    matchday: { name: 'Matchday agent', icon: 'pin' },
    analyst:  { name: 'Analyst agent',  icon: 'bars' },
    player:   { name: 'Player agent',   icon: 'shirt' },
    access:   { name: 'Access agent',   icon: 'doc' },
    archive:  { name: 'Archive agent',  icon: 'book' }
  },

  // Mock prices (PRD, "Price list"). The club view will add its totals up from `purchases`.
  priceList: {
    membership: { item: 'MyGers membership, per year', price: 55, currency: 'GBP', line: 'Membership' },
    seat: { item: 'Match seat through the club’s resale', price: 60, currency: 'GBP', line: 'Not counted' },
    pubCover: { item: 'Partner pub booking fee, per cover', price: 2, currency: 'GBP', line: 'Sponsorship' },
    previewSlot: { item: '“Presented by” slot on the analyst preview, per fan reached', price: 0.5, currency: 'GBP', line: 'Sponsorship' },
    goodieBag: { item: 'Goodie bag for a watch party', price: 0, currency: 'GBP', line: 'None' },
    food: { item: 'Watch party food, Bob’s Fish & Chips', price: 760, currency: 'AED', line: 'Not counted' }
  },
  // Everything bought or booked in the story so far, for the club view to add up later.
  purchases: [
    { what: 'seat', who: ['aileen', 'rory'], quantity: 2, scene: 'Ibrox 2' },
    { what: 'pubCover', who: ['fraser', 'kirsty', 'hamish'], quantity: 3, scene: 'Melbourne 2' },
    { what: 'goodieBag', who: ['morag'], quantity: 1, scene: 'Dubai 3' },
    { what: 'food', who: ['morag'], quantity: 1, scene: 'Dubai 4' }
  ],

  crests: {
    rangers: { name: 'Rangers', file: 'assets/crests/rangers.svg' },
    celtic: { name: 'Celtic', file: 'assets/crests/celtic.png' },
    dundee: { name: 'Dundee', file: 'assets/crests/dundee.png' }
  },

  threads: {
    // 1.1: the mock of today's RangersFC.com. Tapping it opens MyGers.
    site: { kind: 'site', menuLabel: 'Menu', menu: [
      { icon: 'news', text: 'NEWS' }, { icon: 'fixtures', text: 'FIXTURES' }, { icon: 'tv', text: 'RANGERSTV' },
      { icon: 'shop', text: 'SHOP' }, { icon: 'ticket', text: 'TICKETS' }, { icon: 'card', text: 'MYGERS' }
    ] },
    home: { kind: 'screen', title: 'MyGers', sub: 'Good evening, Calum' },
    ibroxLot: { kind: 'chat', title: 'Ibrox Lot', sub: '15 members', avatars: ['calum', 'aileen', 'morag'] },
    ibroxTwo: { kind: 'chat', title: 'Ibrox Two', sub: '2 members', avatars: ['aileen', 'rory'] },
    pubCrew:  { kind: 'chat', title: 'Pub Crew · Melbourne', sub: '3 members', avatars: ['fraser', 'kirsty', 'hamish'] },
    hq:       { kind: 'chat', title: 'Watch Party HQ · Dubai', sub: '10 members', avatars: ['morag', 'calum', 'isla'] },
    wallet: { kind: 'screen', title: 'My tickets', sub: 'MyGers wallet' },                      // Ibrox 3
    party: { kind: 'screen', title: 'Old Firm at Morag’s', sub: 'Watch Party HQ · Dubai' }      // Dubai 3
  },

  panels: {
    meetGers: {
      title: 'Meet Gers', subtitle: 'What the fan doesn’t see',
      steps: [
        { note: 'Gers is the only assistant fans see. They tag @Gers in any chat.' },
        { note: 'Behind Gers, agents do the work: tickets, matchday, analysis, players, behind the scenes and history. Gers passes each task to the right agent and brings the answer back.' },
        { note: 'None of that is visible to the fan, who only ever talks to Gers.' }
      ]
    },
    ticketSearch: {
      agent: 'ticket', kick: 'What it did',
      steps: [
        { status: 'done', icon: 'globe', tool: 'Rangers ticketing', title: 'Fixture page: Rangers v Celtic, Sun 3 Jan', detail: 'Season ticket holders only. No general sale.',
          preview: { url: 'tickets.rangers.co.uk · home tickets', rows: [{ text: 'Rangers v Celtic · Sun 3 Jan', pill: 'Sold out', tone: 'r' }] } },
        { status: 'done', icon: 'db', tool: 'SeatSub, the club’s resale', title: '0 seats listed right now', detail: 'Seats appear when holders release them.' },
        { status: 'done', icon: 'eye', tool: 'Resale sites · prices only', title: '4 sites checked: $485 to $712 a seat',
          range: { points: [0, 28, 61, 96], from: '$485', to: '$712 · seen 18 Nov' } },
        { status: 'now', icon: 'people', tool: 'MyGers priority and network', title: 'Checking Aileen’s and Rory’s MyGers network', detail: 'Watching Copland Front first, blocks CF2 to CF4, then the rest of the ground.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    network: {
      agent: 'ticket', kick: 'Searching their network',
      steps: [
        { status: 'done', icon: 'people', tool: 'Rangers network', title: 'Members Aileen and Rory are linked to: 23 friends, family and colleagues', detail: 'People they’ve connected with in MyGers.' },
        { status: 'done', icon: 'db', tool: 'Season ticket records', title: '3 of them hold season tickets for this match', detail: 'One is away abroad. Two could release seats.' },
        { status: 'done', icon: 'people', tool: 'Best match', title: 'Dougie holds two seats together: Copland Front, block CF3, row G', detail: 'Exactly what Aileen and Rory asked for.' },
        { status: 'now', icon: 'mail', tool: 'MyGers message', title: 'Draft to Dougie and Shona, approved by both', detail: 'Sent 19:42. If they release, the seats go through the club.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    split: {
      subtitle: 'What the fan doesn’t see', at: { left: 780, top: 640, width: 570 },
      steps: [{ note: 'Behind it: the Ticket agent stays on Ibrox Two. The Matchday agent picks up Pub Crew and Watch Party HQ.' }]
    },
    resaleWatch: {
      agent: 'ticket', kick: 'Watching the resale',
      steps: [
        { status: 'done', icon: 'db', tool: 'Mon 23 Nov', title: 'Dougie read the message' },
        { status: 'done', icon: 'db', tool: 'Mon 30 Nov', title: 'Shona is using hers' },
        { status: 'done', icon: 'db', tool: 'Sun 6 Dec · 02:14', title: 'A single seat came up: Copland Rear, CR2, row K', detail: 'Skipped: they asked to sit together.' },
        { status: 'now', icon: 'eye', tool: 'SeatSub watch', title: 'Checking the club’s resale every few minutes', detail: 'Copland Front first, then the rest of the ground.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    seatsThrough: {
      agent: 'ticket', kick: 'The seats come through',
      steps: [
        { status: 'done', icon: 'db', tool: 'Sat 12 Dec · 21:05', title: 'Dougie released CF3, row G, seats 083 and 084', detail: 'Held for Aileen and Rory, not the general queue.' },
        { status: 'done', icon: 'db', tool: 'Sun 13 Dec · 09:00', title: 'Owner changed in the Rangers system', detail: 'Dougie gets 75% back as club credit. The club knows who will sit there.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    ticketing: {
      agent: 'ticket', kick: 'What changed in the club’s system',
      steps: [
        { status: 'done', icon: 'db', tool: 'Rangers ticketing', title: 'CF3, row G, seat 083: Dougie → Aileen' },
        { status: 'done', icon: 'db', tool: 'Rangers ticketing', title: 'CF3, row G, seat 084: Dougie’s wife → Rory' },
        { status: 'done', icon: 'db', tool: 'SeatSub', title: 'Dougie gets 75% back as club credit' },
        { status: 'done', icon: 'eye', tool: 'What the club now knows', title: 'Aileen and Rory will be in CF3, row G', detail: 'Bought on an outside site, the club would know nothing.' }
      ],
      footer: 'Tickets only ever change hands through the club.'
    },
    pubSearch: {
      agent: 'matchday', kick: 'Finding the pub, step by step', wide: true,
      brief: { label: 'Gers’ brief:', text: 'a pub in Melbourne for 3 on Sun 3 Jan, 23:00 kick-off. Big screen, sound on, a Rangers crowd. Never a Celtic bar.' },
      steps: [
        { status: 'done', number: '1', icon: 'pin', tool: 'Google Maps', title: 'Searched “Rangers bar Melbourne”: 4 places near the CBD', detail: 'One is a Celtic supporters’ bar, so it’s dropped.',
          map: { label: 'Rangers supporters bar, Melbourne', pins: [[44, 30], [63, 48], [27, 52]], dropped: [76, 22] } },
        { status: 'done', number: '2', icon: 'globe', tool: 'Supporters’ club site', title: 'Melbourne City Loyal RSC meets at Kicks Bar, 450 Elizabeth St', detail: 'So it’s a Rangers crowd.' },
        { status: 'done', number: '3', icon: 'globe', tool: 'kicksbar · What’s on', title: 'Opened the bar’s fixture page',
          preview: { url: 'Kicks Bar · what’s on', kind: 'fixture', crests: ['rangers', 'celtic'], title: 'Sun 3 Jan · 23:00', detail: 'Rangers v Celtic · big screen · sound on', pill: 'Showing it', tone: 'g' } },
        { status: 'done', number: '4', icon: 'calendar', tool: 'kicksbar · Book a table', title: 'Checked a table for 3 is free from 22:15', detail: 'Nothing booked yet: that waits for Fraser’s yes.',
          preview: { url: 'Kicks Bar · book a table', kind: 'slots', slots: [{ text: '21:45' }, { text: '22:15 · 3 guests', on: true }, { text: '22:45' }] } },
        { status: 'done', number: '5', icon: 'search', tool: 'Check against the ask', title: 'Kicks Bar has everything they asked for', checks: ['Big screen', 'Sound on', 'Open late', 'Rangers crowd', 'Table for 3'] },
        { status: 'done', number: '6', icon: 'arrow', tool: 'Report to Gers', title: '“Kicks Bar ticks every box. Offer it and let Fraser book.”' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    pubBooking: {
      agent: 'matchday', kick: 'Booking the table',
      steps: [
        { status: 'done', icon: 'calendar', tool: 'Kicks Bar bookings', title: 'Table for 3 requested after Fraser said yes',
          preview: { url: 'Kicks Bar · book a table', kind: 'form', rows: [['Date', 'Sun 3 Jan'], ['Time', '22:15'], ['Guests', '3'], ['Name', 'Fraser'], ['Note', 'Rangers v Celtic, sound on please']] } },
        { status: 'done', icon: 'mail', tool: 'Confirmation', title: 'Booking confirmed, ref KB-0417' },
        { status: 'done', icon: 'calendar', tool: 'Calendars', title: 'Added for Fraser, Kirsty and Hamish' },
        { status: 'done', icon: 'mail', tool: 'Email', title: 'Booking details sent to all three', detail: 'Kicks Bar, 450 Elizabeth St, Sun 3 Jan from 22:15, table for 3, ref KB-0417.' },
        { status: 'wait', icon: 'eye', tool: 'On the day', title: 'I’ll check the pub still has it on, with sound' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    partyPlan: {
      agent: 'matchday', kick: 'Building the plan',
      steps: [
        { status: 'done', icon: 'tv', tool: 'Rangers TV', title: 'Live in the UAE for this match', detail: 'Included in the MyGers membership, so a party at home can watch it legally.' },
        { status: 'done', icon: 'people', tool: 'Ibrox Lot', title: '10 members live in Dubai' },
        { status: 'done', icon: 'box', tool: 'Club gift programme', title: 'Goodie bag for watch parties of 10 or more', detail: 'Signed programmes, scarves, Ibrox decorations.' },
        { status: 'done', icon: 'music', tool: 'Club playlist', title: 'Matchday playlist ready for the host' },
        { status: 'done', icon: 'check', iconSize: 12, tool: 'Morag’s approval', title: 'Plan approved: “Do it”', detail: 'Only now does anything get set up.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    invites: {
      agent: 'matchday', kick: 'Invites and RSVPs',
      steps: [
        { status: 'done', icon: 'globe', tool: 'Party page', title: 'Created the party page for Morag',
          preview: { url: 'mygers · Old Firm at Morag’s', kind: 'party', title: 'Sun 3 Jan · 16:00 Dubai time', detail: 'Host: Morag · Live on Rangers TV · Matchday playlist', pills: [{ text: 'I’m going', tone: 'b' }, { text: 'Can’t make it', tone: 'x' }] } },
        { status: 'done', icon: 'mail', tool: 'Invites', title: 'Sent to all 10 in Dubai', detail: 'In this chat, as a MyGers notification, and by email.' },
        { status: 'done', icon: 'eye', tool: 'Privacy', title: 'Morag’s address goes only to those who say yes' },
        { status: 'now', icon: 'people', tool: 'RSVPs', title: '6 going, 1 maybe, 3 still to answer', detail: 'Lewis is a maybe until he’s back on the 2nd.' },
        { status: 'wait', icon: 'calendar', tool: 'Reminder', title: 'A nudge on Sun 29 Nov to anyone who hasn’t answered' },
        { status: 'wait', icon: 'box', tool: 'Goodie bag', title: 'Ordered from the club once 10 say yes' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    reachedTen: {
      agent: 'matchday', kick: 'The party reached 10',
      steps: [
        { status: 'done', icon: 'people', tool: 'Party page', title: '10th yes: Jamie, Sun 27 Dec, 18:40' },
        { status: 'done', icon: 'box', tool: 'Club gift order', title: 'Goodie bag for 10, Morag approved' },
        { status: 'done', icon: 'box', tool: 'Shipping', title: 'To Morag’s flat in Dubai · arrives Thu 31 Dec' },
        { status: 'done', icon: 'tv', tool: 'Rangers TV', title: 'Set up on Morag’s TV for 16:00' },
        { status: 'wait', icon: 'video', tool: 'Player agent', title: 'A video message for the party on Sat 2 Jan' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    foodOrder: {
      agent: 'matchday', kick: 'Ordering the food, step by step', wide: true,
      brief: { label: 'Gers’ brief:', text: 'food for 10 at Morag’s on Sun 3 Jan, before the 16:00 kick-off. A proper chippy tea, with pies. One veggie.' },
      steps: [
        { status: 'done', number: '1', icon: 'people', tool: 'Read the chat', title: 'Who wants what', detail: 'Pies for Calum, veggie for Niamh, 10 going (from the RSVPs).' },
        { status: 'done', number: '2', icon: 'pin', tool: 'Google Maps', title: 'Searched “British chippy Dubai, delivery”', detail: 'Bob’s Fish & Chips, Dream Tower 2, Dubai Marina: steak pies, a veggie lentil burger, delivers to Morag’s area.' },
        { status: 'done', number: '3', icon: 'globe', tool: 'Bob’s online ordering', title: 'Built the basket and checked the slot', detail: 'Sun 3 Jan, 15:00–15:30 is free. Nothing ordered yet.',
          preview: { url: 'Bob’s Fish & Chips · checkout', kind: 'kv', rows: [['Deliver to', 'Morag’s flat, Dubai'], ['Slot', 'Sun 3 Jan · 15:00–15:30'], ['Basket', '4 items · AED 760']] } },
        { status: 'done', number: '4', icon: 'check', iconSize: 12, tool: 'Morag’s approval', title: 'Sent the order to the chat; Morag said “Order it”' },
        { status: 'done', number: '5', icon: 'mail', tool: 'Order placed', title: 'Paid with Morag’s card, ref BOB-2231', detail: 'Confirmation emailed to Morag.' },
        { status: 'done', number: '6', icon: 'people', tool: 'Split the bill', title: 'AED 76 request to each of the other 9, in MyGers' },
        { status: 'done', number: '7', icon: 'arrow', tool: 'Report to Gers', title: '“Ordered. Tell them their share is in MyGers.”' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    }
  },

  scenes: [
    /* ---------- Act 1 · Opening and the ticket hunt (one phone, Calum's) ---------- */
    {
      id: '1.1', title: 'Today’s RangersFC.com: tap MyGers',
      phones: [{ owner: 'calum', thread: 'site' }],
      steps: [{}]
    },
    {
      id: '1.2', title: 'MyGers home: the group chat on top',
      phones: [{ owner: 'calum', thread: 'home' }],
      steps: [
        { add: [
          ['home', { type: 'nextMatch', kicker: 'Rangers v Celtic · Ibrox', crests: ['rangers', 'celtic'], title: 'Old Firm in 6 weeks',
            detail: 'Sun 3 Jan · 12:00 in Glasgow, 16:00 for you in Dubai', button: { text: 'Matchday countdown ›', scene: '3.1', label: 'Open the matchday countdown' } }],
          ['home', { type: 'chatList', label: 'Your chats', chats: [
            { initials: 'IL', color: '#0f1b2d', name: 'Ibrox Lot', last: 'Hamish: $600 a seat on a resale site…', unread: '9' },
            { initials: 'RF', color: '#e11b22', name: 'Rangers Family', last: 'Stuart: Same back four for Sunday, surely?' }
          ] }],
          ['home', { type: 'tagGers', text: 'Tag @Gers in any chat' }],
          ['home', { type: 'membership', label: 'Membership', name: 'MyGers 2026/27', status: 'Active' }]
        ] },
        { panel: { id: 'meetGers', show: 1 } },
        { panel: { id: 'meetGers', show: 2 } },
        { panel: { id: 'meetGers', show: 3 } }
      ]
    },
    {
      id: '1.3', title: 'Ibrox Lot: the friends hit the outside prices',
      phones: [{ owner: 'calum', thread: 'ibroxLot' }],
      steps: [
        { add: [['ibroxLot', { type: 'day', text: 'Sun 22 Nov' }], ['ibroxLot', { type: 'msg', from: 'calum', text: 'Right, you lot. Old Firm at Ibrox, 3rd Jan. Who’s doing what?' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'fraser', text: 'Gutted, but me, Kirsty and Hamish are in Melbourne over New Year. Flights are booked' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'morag', text: 'And ten of us are out in Dubai now, you included, Calum. No Ibrox for us either' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'aileen', text: 'Well, me and Rory are still in Glasgow and we’re not missing it. We want to be there' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'rory', text: 'I’ve never been to an Old Firm. It has to be this one' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'aileen', text: 'Trouble is, the season ticket holders have the lot' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'rory', text: 'I checked the club’s own resale this morning. Nothing at all' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'hamish', text: 'I had a look for you two. Resale sites want $600 a seat. Daylight robbery' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'ewan', text: 'Some guy on Facebook is asking £250. Looks dodgy to me' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'morag', text: 'Has anyone asked the agent?' }]] }
      ]
    },
    {
      id: '1.4', title: 'Rory tags Gers; the Ticket agent searches',
      phones: [{ owner: 'calum', thread: 'ibroxLot' }],
      steps: [
        { add: [['ibroxLot', { type: 'msg', from: 'rory', tag: true, text: 'can you find me and Aileen two together? Copland Front if you can, near the singing' }]] },
        { add: [['ibroxLot', { type: 'gers', text: 'On it. Here’s the honest picture first.' }]], panel: { id: 'ticketSearch', show: 1 } },
        { panel: { id: 'ticketSearch', show: 2 } },
        { panel: { id: 'ticketSearch', show: 3 } },
        { add: [['ibroxLot', { type: 'statusCard', label: 'Rangers v Celtic · tickets today', crests: ['rangers', 'celtic'], rows: [
          { text: 'Season tickets', pill: 'Sold out', tone: 'r' },
          { text: 'General sale', pill: 'None for this match', tone: 'r' },
          { text: 'Club resale (SeatSub)', pill: 'Watching', tone: 'y' },
          { text: 'Outside resale, $485–712', pill: 'I won’t buy', tone: 'x' }
        ] }]], panel: { id: 'ticketSearch', show: 3 } },
        { add: [['ibroxLot', { type: 'gers', text: 'Outside sites are pushing prices way too high, and you can’t always trust what turns up. I’ll go through the club’s own resale and your MyGers network instead. That’s where the right seats come from.' }]], panel: { id: 'ticketSearch', show: 4 } }
      ]
    },
    {
      id: '1.5', title: 'Gers drafts to Dougie and Shona',
      phones: [{ owner: 'calum', thread: 'ibroxLot' }],
      steps: [
        { add: [['ibroxLot', { type: 'gers', text: 'Two people you know hold season tickets. Here’s what I’d send them. Nothing goes until you both say yes.' }]], panel: { id: 'network', show: 1 } },
        { panel: { id: 'network', show: 2 } },
        { add: [['ibroxLot', { type: 'networkCard', label: 'In your Rangers network', people: [
          { initials: 'DO', name: 'Dougie', detail: 'Aileen’s uncle · 2 season tickets, side by side' },
          { initials: 'SH', name: 'Shona', detail: 'Rory’s colleague · 1 season ticket' }
        ] }]], panel: { id: 'network', show: 3 } },
        { add: [['ibroxLot', { type: 'draftCard', id: 'draft', label: 'Draft · to Dougie and Shona',
          text: 'Hi, it’s Gers, for Aileen and Rory. They’re after two seats together in Copland Front for Sun 3 Jan. Dougie, yours in CF3 would be perfect. If you can’t go, release them through the club and they can come to them.',
          approvals: [] }]], panel: { id: 'network', show: 3 } },
        { patch: [['ibroxLot', 'draft', { approvals: ['Aileen approved'] }]], panel: { id: 'network', show: 3 } },
        { add: [['ibroxLot', { type: 'msg', from: 'rory', text: 'Aye, send it' }]], patch: [['ibroxLot', 'draft', { approvals: ['Aileen approved', 'Rory approved'] }]], panel: { id: 'network', show: 3 } },
        { add: [['ibroxLot', { type: 'gers', small: true, text: 'Sent, 19:42. I’ll watch the club’s resale day and night too and will let you know if something comes up.' }]], panel: { id: 'network', show: 4 } }
      ]
    },
    {
      id: '1.6', title: 'Where to watch? Fraser and Morag ask Gers',
      phones: [{ owner: 'calum', thread: 'ibroxLot' }],
      steps: [
        { add: [['ibroxLot', { type: 'msg', from: 'fraser', text: 'Right, Melbourne. We land on the 28th and I’ve no idea where we’d even watch it' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'kirsty', text: 'It’s 11 at night there. Will anywhere even have it on?' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'morag', text: 'Same problem here. Ten of us in Dubai and nowhere to watch it' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'calum', text: 'Sports bars here have the sound off and the cricket on' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'isla', text: 'Could we not just stream it at someone’s? Is that even allowed?' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'morag', tag: true, text: 'what are our options in Dubai?' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'fraser', tag: true, text: 'and for Melbourne?' }]] },
        { add: [['ibroxLot', { type: 'gers', text: 'Good questions. Easiest if each group has its own chat, so I can sort Melbourne and Dubai properly. Want me to set them up? Aileen and Rory, I’ll keep watching for your seats in yours.' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'fraser', text: 'Aye, go on' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'morag', text: 'Do it' }]] }
      ]
    },
    {
      id: '1.7', title: 'Gers splits the group into three chats',
      phones: [{ owner: 'calum', thread: 'ibroxLot' }],
      // the three outlined phones that appear beside Calum's, one per new chat
      split: [
        { title: 'Ibrox Two', who: 'Aileen and Rory' },
        { title: 'Pub Crew', who: 'Fraser, Kirsty, Hamish' },
        { title: 'Watch Party HQ', who: 'Morag, Calum and 8 more' }
      ],
      steps: [
        { add: [['ibroxLot', { type: 'sys', text: 'Gers created “Ibrox Two” · Aileen, Rory' }]], split: 1 },
        { add: [['ibroxLot', { type: 'sys', text: 'Gers created “Pub Crew · Melbourne” · Fraser, Kirsty, Hamish' }]], split: 2 },
        { add: [['ibroxLot', { type: 'sys', text: 'Gers created “Watch Party HQ · Dubai” · Morag, Calum and 8 more' }]], split: 3 },
        { add: [['ibroxLot', { type: 'gers', text: 'Done. Three new chats, one for each plan. Ibrox Lot stays for everyone.' }]], split: 3, panel: { id: 'split' } },
        { add: [['ibroxLot', { type: 'msg', from: 'calum', text: 'Magic. See you all in there' }]], split: 3, panel: { id: 'split' } }
      ]
    },

    /* ---------- Act 2 · Three journeys, and focus on each phone ---------- */
    {
      id: '2.1', title: 'Three new chats (Sun 22 Nov) · click a phone to focus',
      phones: [
        { owner: 'aileen', thread: 'ibroxTwo', label: 'Aileen and Rory', sub: 'Ibrox Two · Glasgow', rail: 'Ibrox', note: { agent: 'ticket', text: 'watching SeatSub for two seats together' } },
        { owner: 'fraser', thread: 'pubCrew', label: 'Fraser, Kirsty, Hamish', sub: 'Pub Crew · Melbourne', rail: 'Melbourne', note: { agent: 'matchday', text: 'searching Maps for Rangers pubs' } },
        { owner: 'calum', thread: 'hq', label: 'Calum, Morag and 8 more', sub: 'Watch Party HQ · Dubai', rail: 'Dubai', note: { agent: 'matchday', text: 'checking Rangers TV in the UAE' } }
      ],
      // each phone's own timeline (see `journeys`): the chat lines of 22 Nov, then that group's journey
      focus: { 0: 'ibrox', 1: 'melbourne', 2: 'dubai' },
      steps: [
        { add: [
          ['ibroxTwo', { type: 'day', text: 'Sun 22 Nov' }], ['ibroxTwo', { type: 'sys', text: 'Gers created this chat for Aileen and Rory' }],
          ['pubCrew', { type: 'day', text: 'Sun 22 Nov' }], ['pubCrew', { type: 'sys', text: 'Gers created this chat for the Melbourne three' }],
          ['hq', { type: 'day', text: 'Sun 22 Nov' }], ['hq', { type: 'sys', text: 'Gers created this chat for the Dubai ten' }]
        ] }
      ]
    },
    {
      id: '2.2', title: 'Back to all three: seven days to go (Sun 27 Dec)',
      phones: [
        { owner: 'aileen', thread: 'ibroxTwo', label: 'Aileen and Rory', sub: 'Ibrox Two · Glasgow', rail: 'Ibrox', note: { agent: 'matchday', text: 'planning the walk to Ibrox' } },
        { owner: 'fraser', thread: 'pubCrew', label: 'Fraser, Kirsty, Hamish', sub: 'Pub Crew · Melbourne', rail: 'Melbourne', note: { agent: 'matchday', text: 'Kicks Bar booking still confirmed' } },
        { owner: 'calum', thread: 'hq', label: 'Calum, Morag and 8 more', sub: 'Watch Party HQ · Dubai', rail: 'Dubai', note: { agent: 'matchday', text: 'ordering the goodie bag' } }
      ],
      steps: [
        { add: [
          ['ibroxTwo', { type: 'day', cut: true, text: 'Sun 27 Dec · 7 days to go' }], ['ibroxTwo', { type: 'gers', text: 'A week to go. Here’s the plan for the day. I’ll firm up the times on Saturday.' }],
          ['pubCrew', { type: 'day', cut: true, text: 'Sun 27 Dec · 7 days to go' }], ['pubCrew', { type: 'gers', text: 'A week to go. Your table is still confirmed.' }],
          ['hq', { type: 'day', cut: true, text: 'Sun 27 Dec · 7 days to go' }], ['hq', { type: 'sys', text: 'Lewis is going · 9 of 10' }]
        ] },
        { add: [
          ['ibroxTwo', { type: 'planList', label: 'Your matchday plan · draft', rows: [
            { time: '10:45', title: 'Leave for Ibrox', detail: 'Subway to Ibrox station, then a short walk' },
            { time: '11:00', title: 'Team sheet', detail: 'I’ll post it the second it’s named' },
            { time: '11:30', title: 'In your seats', detail: 'Copland Front, CF3 · row G · 083, 084' },
            { time: '12:00', title: 'Kick-off', detail: '' }
          ] }],
          ['pubCrew', { type: 'confirmCard', title: 'Kicks Bar · table for 3', detail: 'Sun 3 Jan · from 22:15 · kick-off 23:00', pill: 'Confirmed' }],
          ['hq', { type: 'sys', text: 'Jamie is going · 10 of 10' }]
        ] },
        { add: [
          ['ibroxTwo', { type: 'msg', from: 'rory', text: 'Counting the sleeps' }],
          ['pubCrew', { type: 'msg', from: 'hamish', text: 'Wouldn’t miss it' }],
          ['hq', { type: 'gers', text: 'That’s 10. The club is sending you a goodie bag.' }]
        ] },
        { add: [
          ['pubCrew', { type: 'msg', from: 'fraser', text: 'Our flight home is on the 5th, so that works perfectly' }],
          ['hq', { type: 'goodieCard', label: 'Unlocked at 10 of 10', title: 'Your goodie bag is coming', lead: 'A gift from the club, to Morag’s flat:', pills: ['Signed programmes', 'Scarves', 'Ibrox decorations'] }]
        ] },
        { add: [['hq', { type: 'msg', from: 'niamh', text: 'YESSS' }]] },
        { add: [['hq', { type: 'msg', from: 'jamie', text: 'Sorry I was last. Worth the wait' }]] }
      ]
    }
    // Acts 3 and 4 (the countdown week, matchday, full time) and the club placeholder are added by story-week.js.
  ],

  /* ---------- Act 2: each phone's own timeline on 2.1 ----------
     With all three phones on screen, one click moves every phone one step along its timeline.
     With one phone in focus, a click moves only that phone, and its Behind the scenes panel shows.
     The content is the same either way. When all three have finished, the next click is 2.2. */
  journeys: {
    // Ibrox 1 to 3: watching the resale, the two seats, the wallet
    ibrox: {
      steps: [
        { add: [['ibroxTwo', { type: 'gers', text: 'This one’s for your seats. I’m watching the club’s resale day and night, and waiting to hear from Dougie and Shona.' }]] },
        { add: [['ibroxTwo', { type: 'msg', from: 'rory', text: 'Fingers crossed' }]] },
        { add: [['ibroxTwo', { type: 'msg', from: 'aileen', text: 'Copland Front or bust' }]] },
        { add: [['ibroxTwo', { type: 'day', text: 'Mon 30 Nov' }], ['ibroxTwo', { type: 'gers', text: 'Shona’s using hers. No word from Dougie yet. Still watching.' }]], panel: { id: 'resaleWatch', show: 2 } },
        { add: [['ibroxTwo', { type: 'day', text: 'Sun 6 Dec' }], ['ibroxTwo', { type: 'gers', text: 'A single seat came up at 02:14, in Copland Rear. I skipped it: you asked to sit together.' }]], panel: { id: 'resaleWatch', show: 3 } },
        { add: [['ibroxTwo', { type: 'msg', from: 'aileen', text: 'Good call' }]] },
        { add: [['ibroxTwo', { type: 'msg', from: 'rory', text: 'Two or nothing' }]], panel: { id: 'resaleWatch', show: 4 } },
        { add: [['ibroxTwo', { type: 'day', text: 'Sun 13 Dec · 3 weeks to go' }], ['ibroxTwo', { type: 'gers', text: 'Good news. Dougie and his wife can’t go, so they released both seats through the club. They came straight to you.' }]], panel: { id: 'seatsThrough', show: 1 } },
        { add: [['ibroxTwo', { type: 'seatOffer', label: 'Ibrox · Sun 3 Jan · 12:00', title: 'Rangers v Celtic', crests: ['rangers', 'celtic'], lead: '2 seats together', price: '£60 each',
          detail: 'Copland Front · block CF3 · row G · seats 083 and 084 · club resale price', button: 'Take the seats' }]] },
        { add: [['ibroxTwo', { type: 'msg', from: 'aileen', text: 'RORY. WE’RE GOING' }]], panel: { id: 'seatsThrough', show: 2 } },
        { add: [['ibroxTwo', { type: 'msg', from: 'rory', text: 'Buzzing. Thank Dougie for me' }]] },
        { view: 'wallet', add: [
          ['wallet', { type: 'walletTicket', label: 'Ibrox · Sun 3 Jan · 12:00', title: 'Rangers v Celtic', crests: ['rangers', 'celtic'], name: 'Aileen', lines: ['CF3 · Row G · Seat 083', 'Rory beside you, 084'] }],
          ['wallet', { type: 'seatFinder', label: 'Find your seats', hint: 'Tap to explore', viewTile: 'View from row G',
            stands: { north: 'GOVAN STAND', south: 'BILL STRUTH MAIN STAND', west: 'BROOMLOAN RD', east: 'COPLAND RD' },
            marks: { toilets: 'WC', food: 'F', drinks: 'D' },
            // Route is the board's own wording. View, Food, Drinks and Toilets are DRAFTS awaiting Ido's confirmation (decision Q8).
            tabs: [
              { id: 'route', name: 'Route', title: 'Copland Road turnstiles → stair to CF3 → row G', detail: 'About 4 min. Toilets and food on the same concourse.' },
              { id: 'view', name: 'View', title: 'Row G, behind the Copland Road goal', detail: 'Seven rows from the pitch, looking straight down it.' },
              { id: 'food', name: 'Food', title: 'Food kiosk → on the CF3 concourse', detail: 'About 1 min from your seats. Quietest before 11:30.' },
              { id: 'drinks', name: 'Drinks', title: 'Drinks kiosk → at the Copland Road corner', detail: 'About 2 min from your seats, past the food kiosk.' },
              { id: 'toilets', name: 'Toilets', title: 'Toilets → top of the CF3 stair', detail: 'About 1 min from your seats, on the same concourse.' }
            ] }]
        ], panel: { id: 'ticketing', show: 1 } },
        { view: 'wallet', panel: { id: 'ticketing', show: 2 } },
        { view: 'wallet', panel: { id: 'ticketing', show: 3 } },
        { view: 'wallet', panel: { id: 'ticketing', show: 4 } }
      ]
    },
    // Melbourne 1 and 2: finding Kicks Bar, booking the table
    melbourne: {
      steps: [
        { add: [['pubCrew', { type: 'msg', from: 'hamish', text: 'Right, which pub?' }]] },
        { add: [['pubCrew', { type: 'msg', from: 'kirsty', text: 'Needs a big screen AND the sound on' }]] },
        { add: [['pubCrew', { type: 'msg', from: 'fraser', text: 'Nobody answers the phone over New Year' }]] },
        { add: [['pubCrew', { type: 'msg', from: 'kirsty', tag: true, text: 'find us a Rangers pub' }]] },
        { add: [['pubCrew', { type: 'gers', text: 'Looking now. Kick-off is 23:00 on the Sunday for you.' }]] },
        { panel: { id: 'pubSearch', show: 1 } },
        { panel: { id: 'pubSearch', show: 2 } },
        { panel: { id: 'pubSearch', show: 3 } },
        { panel: { id: 'pubSearch', show: 4 } },
        { panel: { id: 'pubSearch', show: 5 } },
        { panel: { id: 'pubSearch', show: 6 } },
        { add: [['pubCrew', { type: 'gers', text: 'Good news: Kicks Bar is showing it live, with the sound on. It’s where the Melbourne Rangers supporters’ club meets.' }]] },
        { add: [['pubCrew', { type: 'pubCard', name: 'Kicks Bar', area: 'CBD', detail: '450 Elizabeth St · Melbourne City Loyal RSC meets here', pills: ['Match on: confirmed', 'Sound: confirmed'], button: 'Book a table for 3 · from 22:15' }]] },
        { add: [['pubCrew', { type: 'msg', from: 'fraser', text: 'Kicks Bar, obviously. Book it' }]], panel: { id: 'pubBooking', show: 1 } },
        { add: [['pubCrew', { type: 'gers', text: 'Booked. It’s in all three of your calendars, and the details are in your email.' }]], panel: { id: 'pubBooking', show: 2 } },
        { add: [['pubCrew', { type: 'bookingCard', label: 'Booked', title: 'Kicks Bar · table for 3', rows: [['When', 'Sun 3 Jan, from 22:15'], ['Where', '450 Elizabeth St'], ['Kick-off', '23:00, sound on'], ['Reference', 'KB-0417']] }]], panel: { id: 'pubBooking', show: 4 } },
        { add: [['pubCrew', { type: 'msg', from: 'kirsty', text: 'Sound on or we riot' }]] },
        { add: [['pubCrew', { type: 'msg', from: 'hamish', text: 'Legend. First round’s on Fraser' }]], panel: { id: 'pubBooking', show: 5 } }
      ]
    },
    // Dubai 1 to 4: the plan, the invites, the goodie bag at 10 of 10, the food order
    dubai: {
      steps: [
        { add: [['hq', { type: 'msg', from: 'morag', text: 'Right, mine it is. Big telly sorted' }]] },
        { add: [['hq', { type: 'msg', from: 'isla', text: 'What do we actually need? Projector?' }]] },
        { add: [['hq', { type: 'msg', from: 'niamh', text: 'Can we even watch it live out here?' }]] },
        { add: [['hq', { type: 'msg', from: 'calum', text: 'I’ll bring the pies. Who’s on drinks?' }]] },
        { add: [['hq', { type: 'msg', from: 'morag', tag: true, text: 'how can we watch the game in Dubai?' }]] },
        { add: [['hq', { type: 'gers', text: 'Easy, Morag. You can watch it live on Rangers TV with your MyGers account. It’s included in your membership.' }]] },
        { panel: { id: 'partyPlan', show: 1 } },
        { panel: { id: 'partyPlan', show: 2 } },
        { panel: { id: 'partyPlan', show: 3 } },
        { panel: { id: 'partyPlan', show: 4 } },
        { add: [['hq', { type: 'gers', text: 'Rangers TV has it live in the UAE. Here’s the plan, Morag. Say yes and I’ll set it up.' }]] },
        { add: [['hq', { type: 'planCard', label: 'The plan for Morag’s', rows: [
          { icon: 'tv', title: 'Live on Rangers TV', detail: 'In your MyGers membership · on in the UAE', done: true },
          { icon: 'people', title: 'Party page with RSVPs', detail: 'Everyone taps I’m going' },
          { icon: 'box', title: 'Goodie bag from the club', detail: 'If 10 of you say yes', pill: '0/10' },
          { icon: 'music', title: 'Matchday playlist', detail: 'From the club, for the host' }
        ], button: 'Approve plan' }]] },
        { add: [['hq', { type: 'msg', from: 'morag', text: 'Do it' }]], panel: { id: 'partyPlan', show: 5 } },
        { add: [['hq', { type: 'gers', small: true, text: 'On it, Morag. Setting it all up now.' }]] },
        { add: [['hq', { type: 'gers', text: 'Party page is up, and I’ve sent the invite to all 10 of you. Tap I’m going so Morag knows numbers.' }]], panel: { id: 'invites', show: 1 } },
        { add: [['hq', { type: 'inviteCard', label: 'You’re invited · Sun 3 Jan · 16:00', title: 'Old Firm at Morag’s', detail: 'Live on Rangers TV · address sent when you say yes',
          going: ['morag', 'calum', 'ewan', 'isla', 'angus', 'niamh'], count: '6 of 10 going', percent: 60, note: 'Goodie bag from the club at 10', yes: 'You’re going', no: 'Can’t go' }]], panel: { id: 'invites', show: 2 } },
        { add: [['hq', { type: 'sys', text: 'Isla, Ewan, Niamh, Greig and Angus are going' }]], panel: { id: 'invites', show: 3 } },
        { add: [['hq', { type: 'msg', from: 'ewan', text: 'Wouldn’t miss it' }]] },
        { add: [['hq', { type: 'msg', from: 'lewis', text: 'Back from Abu Dhabi on the 2nd. Maybe?' }]], panel: { id: 'invites', show: 4 } },
        { add: [['hq', { type: 'gers', small: true, text: 'No bother, Lewis. I’ll check in with you on the 1st.' }]], panel: { id: 'invites', show: 6 } },
        { view: 'party', add: [
          ['party', { type: 'partyHero', label: 'Sun 3 Jan · kick-off 16:00 in Dubai', title: '10 of 10 going', going: ['morag', 'calum', 'ewan', 'isla', 'angus', 'niamh', 'greig', 'catriona', 'lewis', 'jamie'] }],
          ['party', { type: 'goodieCard', label: 'Unlocked at 10 of 10', title: 'Your goodie bag is coming', lead: 'A gift from the club, to Morag’s flat:', pills: ['Signed programmes', 'Scarves', 'Ibrox decorations'] }],
          ['party', { type: 'setupCard', label: 'Set up for Morag', rows: [
            { done: true, title: 'Live on Rangers TV', detail: 'In MyGers · set up on Morag’s TV' },
            { done: true, title: 'Matchday playlist', detail: 'Shared with the host' },
            { icon: 'video', title: 'A message for the party', detail: 'Arrives Sat 2 Jan' }
          ] }]
        ], panel: { id: 'reachedTen', show: 1 } },
        { view: 'party', panel: { id: 'reachedTen', show: 2 } },
        { view: 'party', panel: { id: 'reachedTen', show: 3 } },
        { view: 'party', panel: { id: 'reachedTen', show: 4 } },
        { view: 'party', panel: { id: 'reachedTen', show: 5 } },
        { view: 'hq', add: [['hq', { type: 'day', text: 'Wed 30 Dec' }], ['hq', { type: 'msg', from: 'morag', tag: true, text: 'can you sort the food for Sunday? A proper chippy tea' }]] },
        { view: 'hq', add: [['hq', { type: 'msg', from: 'niamh', text: 'Veggie for me please' }]] },
        { view: 'hq', add: [['hq', { type: 'msg', from: 'calum', text: 'Pies. Non-negotiable' }]], panel: { id: 'foodOrder', show: 1 } },
        { view: 'hq', panel: { id: 'foodOrder', show: 2 } },
        { view: 'hq', panel: { id: 'foodOrder', show: 3 } },
        { view: 'hq', add: [['hq', { type: 'gers', small: true, text: 'Here’s an order for 10, at Morag’s by 15:15.' }]] },
        { view: 'hq', add: [['hq', { type: 'foodCard', label: 'Food for 10 · needs Morag’s OK', shop: 'Bob’s Fish & Chips, Dubai Marina', lines: [
          { name: 'Steak pie', qty: '× 9', price: 'AED 531' },
          { name: 'Lentil burger, veggie', qty: '× 1', price: 'AED 45' },
          { name: 'Jumbo chips', qty: '× 5', price: 'AED 120' },
          { name: 'Mushy peas', qty: '× 4', price: 'AED 64' }
        ], total: 'AED 760 · AED 76 each', slot: 'Sun 15:15', button: 'Approve order' }]] },
        { view: 'hq', add: [['hq', { type: 'msg', from: 'morag', text: 'Perfect. Order it' }]], panel: { id: 'foodOrder', show: 4 } },
        { view: 'hq', panel: { id: 'foodOrder', show: 5 } },
        { view: 'hq', panel: { id: 'foodOrder', show: 6 } },
        { view: 'hq', add: [['hq', { type: 'gers', small: true, text: 'Ordered. I’ve sent each of you your share, AED 76, in MyGers.' }]], panel: { id: 'foodOrder', show: 7 } }
      ]
    }
  }
};
