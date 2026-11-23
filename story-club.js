/* MyGers demo, story part 4: the club view.
   Everything the club view shows that the story itself does not produce lives here: usage
   figures, the feature list, how members watch, the Rangers TV deep dive, every fan's wider
   network, and Aileen's profile after six weeks and after three seasons.
   All of it is sample data (Ido, 22 Nov 2026): the club view is a sample of how a real
   dashboard would look. Counts the story does produce (members, interests, seats, pub covers,
   Rangers TV viewers) are added up by club.js from story.js. */
(function () {
  'use strict';

  var STORY = window.STORY;

  // One person in a fan's wider network, beyond the 15 of the story.
  //   group: family | holders | work | friends | club | away (see `networkGroups`)
  //   extra: { holder, invited, place, count, strong, later, note }
  function person(name, initials, group, tie, from, extra) {
    return Object.assign({ name: name, initials: initials, group: group, tie: tie, from: from }, extra || {});
  }
  var GLASGOW = 'Glasgow';
  var NAMED = 'Named in the Rangers network given on joining';
  var HOUSEHOLD = 'Same household on the membership';
  function supportersClub(city, count) {
    return person(city + ' supporters’ club', 'SC', 'club', count + ' members of the same supporters’ club', 'Supporters’ club listed on their memberships', { count: count });
  }
  function invitedBy(name, initials, group, tie, fanName) {
    return person(name, initials, group, tie + ' · member since Dec', 'Invited to MyGers by ' + fanName, { invited: true });
  }

  STORY.club = {
    ui: {
      product: 'MyGers', badge: 'Club view',
      menu: { overview: 'Overview', fans: 'Fans', act: 'Act on it' },
      allFans: 'All fans',
      of: 'of',
      spans: { weeks: 'After six weeks', seasons: 'After three seasons' },
      notYet: 'Not known yet'
    },

    // The eight days the daily boxes cover: seven days to go, down to matchday.
    days: ['−7', '−6', '−5', '−4', '−3', '−2', '−1', 'MD'],
    periodDays: 42,   // Sun 22 Nov to Sun 3 Jan

    overview: {
      title: 'Overview',
      cards: { members: 'Members', active: 'Active this week', visits: 'Visits', time: 'Time in MyGers', gap: 'Between visits', asks: 'Requests to Gers' },
      daily: { title: 'Members active per day', aside: 'The last 8 days' },
      features: { title: 'Use per feature', aside: 'Members who used it at least once', columns: ['Feature', 'Members', 'Share'] },
      interests: { title: 'What they care about', aside: 'From what each member opens' },
      // Where and on what members watch a match: share of all match views, in percent.
      watch: { title: 'Where and how they watch', aside: 'Share of match views', rows: [
        ['Watch party · Rangers TV', 26],
        ['At home · Rangers TV', 22],
        ['Pub or supporters’ club', 17],
        ['At Ibrox', 14],
        ['At home · other broadcaster', 11],
        ['On the move · phone', 7],
        ['Away ground', 3]
      ] },
      // How Rangers TV is used: headline figures, then the split of each viewing choice, in percent.
      tv: { title: 'Rangers TV deep dive', aside: 'All matches watched on Rangers TV',
        stats: [['84 min', 'average watch time'], ['72%', 'change a setting'], ['41%', 'watch with others']],
        groups: [
          { label: 'Camera', parts: [['Main', 58], ['Tactical', 27], ['Behind the goal', 15]] },
          { label: 'Replays', parts: [['Goals only', 46], ['Every chance', 38], ['One player', 16]] },
          { label: 'Statistics', parts: [['Basic', 44], ['Deep', 35], ['Off', 21]] },
          { label: 'Commentary', parts: [['Club channel', 63], ['Neutral', 22], ['Crowd only', 15]] }
        ] },
      // for a fan's own profile: the names of their Rangers TV choices
      cameras: { main: 'Main', tactical: 'Tactical', goal: 'Behind the goal' }, commentaries: { club: 'Club channel', crowd: 'Crowd only' }
    },

    // Members who used each feature. `from` names a count the story produces; the rest are sample figures.
    features: [
      { label: 'Group chat with Gers', members: 15 },
      { label: 'Countdown week', members: 15 },
      { label: 'Match passport', members: 15 },
      { label: 'Legends’ videos', members: 13 },
      { label: 'Rangers TV', from: 'viewers' },
      { label: 'Watch party: invites, goodie bag, food', from: 'viewers' },
      { label: 'Analyst preview', members: 9 },
      { label: 'Pub booking', from: 'pubCover' },
      { label: 'Match tickets and wallet', from: 'seat' }
    ],

    fansPage: {
      title: 'Fans',
      aside: 'Click a fan to open their profile',
      columns: { fan: 'Fan', city: 'City', watched: 'Watched', interest: 'Cares about', legend: 'Legend', days: 'Last 8 days', visits: 'Visits', time: 'Time', asks: 'Asked Gers', stood: 'What stood out' }
    },
    watched: { Glasgow: 'Ibrox', Melbourne: 'Kicks Bar', Dubai: 'Watch party' },

    // Per member: the days they opened MyGers (one character per day in `days`), visits and minutes
    // in the six weeks, requests to Gers, their Rangers TV choices, and the one thing that stood out.
    usage: {
      calum:    { days: '11111111', visits: 34, minutes: 212, asks: 9,  tv: { camera: 'tactical', commentary: 'club' },  stood: 'Tactical camera, deep stats' },
      aileen:   { days: '11101111', visits: 29, minutes: 168, asks: 6,  stood: 'Asked for Copland Front' },
      rory:     { days: '10110111', visits: 22, minutes: 121, asks: 7,  stood: 'First Old Firm' },
      fraser:   { days: '11011111', visits: 27, minutes: 149, asks: 8,  stood: 'Booked the table' },
      kirsty:   { days: '10101011', visits: 15, minutes: 74,  asks: 4,  stood: 'Asked for sound on' },
      hamish:   { days: '11110111', visits: 25, minutes: 163, asks: 5,  stood: 'Watched the New Year 1997 match' },
      morag:    { days: '11111111', visits: 41, minutes: 236, asks: 14, tv: { camera: 'main', commentary: 'club' },      stood: 'Hosted 10, earned the goodie bag' },
      ewan:     { days: '01001011', visits: 11, minutes: 52,  asks: 2,  tv: { camera: 'main', commentary: 'club' },      stood: 'Main camera' },
      isla:     { days: '10110111', visits: 19, minutes: 97,  asks: 3,  tv: { camera: 'tactical', commentary: 'club' },  stood: 'Every-chance replays' },
      angus:    { days: '01101011', visits: 14, minutes: 88,  asks: 2,  tv: { camera: 'main', commentary: 'crowd' },     stood: 'Crowd-only commentary' },
      niamh:    { days: '11111111', visits: 31, minutes: 142, asks: 4,  tv: { camera: 'main', commentary: 'club' },      stood: 'Opened MyGers all 8 days' },
      greig:    { days: '10011011', visits: 16, minutes: 91,  asks: 2,  tv: { camera: 'tactical', commentary: 'club' },  stood: 'Deep stats' },
      catriona: { days: '00101111', visits: 13, minutes: 66,  asks: 2,  tv: { camera: 'goal', commentary: 'club' },      stood: 'Behind-the-goal camera' },
      lewis:    { days: '01010111', visits: 15, minutes: 83,  asks: 3,  tv: { camera: 'main', commentary: 'crowd' },     stood: 'Watched the full-game archive' },
      jamie:    { days: '00010011', visits: 8,  minutes: 37,  asks: 1,  tv: { camera: 'main', commentary: 'club' },      stood: 'Last to RSVP' }
    },

    profilePage: {
      adds: { title: 'What the new MyGers adds' },
      activity: { title: 'Activity', aside: 'Newest first' },
      network: { title: 'Network', aside: 'Click a person to see where the connection comes from',
        summary: { people: 'people', holders: 'season ticket holders', invited: 'members brought in', countries: 'countries' },
        from: 'Where the connection comes from', sees: 'What the club sees' },
      usage: { visits: 'Visits', time: 'Time in MyGers', asks: 'Asked Gers', days: 'Days active' },
      // For the fans without a written profile: the lines are built from the story.
      rows: { watched: 'Watched the match', withWho: 'Who with', interest: 'Cares most about', legend: 'Legend', tv: 'On Rangers TV', stood: 'Stood out' }
    },

    /* ---------- networks ---------- */

    // The groups a network is drawn in, in the order they go round the fan. `inner: true` sits close to the fan.
    networkGroups: {
      journey: { color: '#0032a0', inner: true },   // labelled by `journeys`, below
      family: { label: 'Family', color: '#a3161c', inner: true },
      holders: { label: 'Season ticket holders', color: '#7a5a00', inner: true },
      work: { label: 'Colleagues', color: '#24506e' },
      friends: { label: 'Friends', color: '#1f5e5e' },
      club: { label: 'Supporters’ club', color: '#3f6212' },
      away: { label: 'Away-day group', color: '#7a4316' },
      lotGlasgow: { label: 'Ibrox Lot · Glasgow', color: '#8d1f43' },
      lotMelbourne: { label: 'Ibrox Lot · Melbourne', color: '#0b6b47' },
      lotDubai: { label: 'Ibrox Lot · Dubai', color: '#5b2a8c' }
    },
    // The story's own links: the people in a fan's own chat, and the rest of Ibrox Lot.
    journeys: {
      Glasgow: { label: 'Ibrox Two', tie: 'Friend · Ibrox Two', from: 'Seats 083 and 084 came from the same release; scanned in a minute apart' },
      Melbourne: { label: 'Pub Crew · Melbourne', tie: 'Friend · Pub Crew', from: 'On the same table booking at Kicks Bar' },
      Dubai: { label: 'Watch Party HQ · Dubai', tie: 'Friend · Watch Party HQ', from: 'Same watch party: Morag’s invite and the RSVPs' }
    },
    lot: { tie: 'Friend · Ibrox Lot', from: 'Ibrox Lot group chat, 15 members' },

    // Each fan's wider network, on top of the story's links. `later: true` shows only in a three-season view.
    networks: {
      aileen: [
        person('Dougie', 'DO', 'family', 'Uncle · season ticket holder', 'Named in the Rangers network; released both seats through the club', { holder: true, strong: true, note: { weeks: 'Released both seats to Aileen through the club', seasons: 'Released the seats to Aileen 5 times' } }),
        person('Dougie’s wife', 'DW', 'family', 'Aunt · season ticket holder', 'Holds the seat beside Dougie’s; released with his', { holder: true, note: { weeks: 'The seat went to Rory', seasons: 'The seat went to Rory 5 times' } }),
        person('Shona', 'SH', 'holders', 'Rory’s colleague · season ticket holder', 'In Rory’s Rangers network; Gers asked for the seat', { holder: true, note: { weeks: 'Was using the seat', seasons: 'Asked twice more; released once' } }),
        person('Dad', 'DA', 'family', 'Father · member since Aug 2027', 'Invited to MyGers by Aileen', { invited: true, strong: true, later: true, note: { seasons: '6 matches together' } }),
        person('Colleague', 'C1', 'work', 'Colleague · member since Oct 2027', 'Guest on Aileen’s seats, then invited to MyGers', { invited: true, later: true, note: { seasons: 'First match was with Aileen' } }),
        person('Colleague', 'C2', 'work', 'Colleague · member since Oct 2027', 'Guest on Aileen’s seats, then invited to MyGers', { invited: true, later: true, note: { seasons: 'First match was with Aileen' } }),
        person('Away-day group', 'AW', 'away', '4 members met on the European away night', 'Away tickets from the same allocation, Sep 2028', { count: 4, later: true, note: { seasons: 'Two more away matches together since' } })
      ],
      rory: [
        person('Shona', 'SH', 'holders', 'Colleague · season ticket holder', NAMED + '; Gers asked for the seat', { holder: true }),
        person('Mum', 'MU', 'family', 'Mother', HOUSEHOLD),
        invitedBy('Flatmate', 'FL', 'friends', 'Flatmate', 'Rory'),
        person('Five-a-side group', '5S', 'friends', '4 members from five-a-side', NAMED, { count: 4 })
      ],
      calum: [
        person('Wife', 'WI', 'family', 'Wife', HOUSEHOLD),
        person('Brother', 'BR', 'holders', 'Brother · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        invitedBy('Colleague', 'CO', 'work', 'Colleague', 'Calum'),
        supportersClub('Dubai', 6)
      ],
      fraser: [
        person('Son', 'SO', 'family', 'Son · junior member', HOUSEHOLD),
        person('Dad', 'DA', 'holders', 'Father · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        supportersClub('Melbourne', 18)
      ],
      kirsty: [
        person('Sister', 'SI', 'family', 'Sister, Glasgow · member', NAMED, { place: GLASGOW }),
        invitedBy('Colleague', 'CO', 'work', 'Colleague', 'Kirsty'),
        supportersClub('Melbourne', 18)
      ],
      hamish: [
        person('Wife', 'WI', 'family', 'Wife', HOUSEHOLD),
        person('School friend', 'SF', 'holders', 'Friend · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        supportersClub('Melbourne', 18)
      ],
      morag: [
        person('Husband', 'HU', 'family', 'Husband', HOUSEHOLD),
        invitedBy('Daughter', 'DA', 'family', 'Daughter, Glasgow', 'Morag'),
        invitedBy('Neighbour', 'NE', 'friends', 'Neighbour', 'Morag'),
        supportersClub('Dubai', 6)
      ],
      ewan: [
        person('Partner', 'PA', 'family', 'Partner', HOUSEHOLD),
        person('Dad', 'DA', 'holders', 'Father · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        supportersClub('Dubai', 6)
      ],
      isla: [
        person('Brother', 'BR', 'family', 'Brother, Glasgow · member', NAMED, { place: GLASGOW }),
        invitedBy('Flatmate', 'FL', 'friends', 'Flatmate', 'Isla'),
        supportersClub('Dubai', 6)
      ],
      angus: [
        person('Wife', 'WI', 'family', 'Wife', HOUSEHOLD),
        person('Son', 'SO', 'holders', 'Son · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        supportersClub('Dubai', 6)
      ],
      niamh: [
        person('Mum', 'MU', 'family', 'Mother, Glasgow · member', NAMED, { place: GLASGOW }),
        invitedBy('Colleague', 'CO', 'work', 'Colleague', 'Niamh'),
        person('University friends', 'UF', 'friends', '3 members from university', NAMED, { count: 3 })
      ],
      greig: [
        person('Wife', 'WI', 'family', 'Wife', HOUSEHOLD),
        person('Brother', 'BR', 'holders', 'Brother · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        supportersClub('Dubai', 6)
      ],
      catriona: [
        person('Husband', 'HU', 'family', 'Husband', HOUSEHOLD),
        person('Dad', 'DA', 'holders', 'Father · season ticket holder, Glasgow', NAMED, { holder: true, place: GLASGOW }),
        supportersClub('Dubai', 6)
      ],
      lewis: [
        person('Partner', 'PA', 'family', 'Partner', HOUSEHOLD),
        invitedBy('Colleague', 'CO', 'work', 'Colleague', 'Lewis'),
        supportersClub('Dubai', 6)
      ],
      jamie: [
        person('Dad', 'DA', 'family', 'Father, Glasgow · member', NAMED, { place: GLASGOW }),
        person('Flatmates', 'FL', 'friends', '2 flatmates, both members', NAMED, { count: 2 })
      ]
    },

    /* ---------- activity ---------- */

    // What every member of a journey did, for the fans without a written profile.
    // Each line: date, time, kind, what happened.
    groupActivity: {
      Glasgow: [
        ['Sun 3 Jan', '13:56', 'Passport', 'Passport entry built at full time, stamped “I was there”'],
        ['Sun 3 Jan', '11:29', 'Ticket', 'Scanned in at the Copland Road turnstile · seat 084'],
        ['Sat 2 Jan', '18:14', 'Video', 'Watched Allan McGregor’s message for Aileen and Rory'],
        ['Sun 13 Dec', '09:16', 'Ticket', 'Two seats through the club’s resale: CF3, row G'],
        ['Sun 22 Nov', '19:12', 'Chat', 'Tagged Gers in Ibrox Lot to ask for two seats together']
      ],
      Melbourne: [
        ['Mon 4 Jan', '00:57', 'Passport', 'Passport entry built at full time: Kicks Bar, Melbourne'],
        ['Sun 3 Jan', '22:41', 'Matchday', 'Arrived at Kicks Bar for the 23:00 kick-off'],
        ['Sat 2 Jan', '20:05', 'Video', 'Watched the Pub Crew’s personalized video'],
        ['Mon 14 Dec', '18:30', 'Booking', 'Table for three booked at Kicks Bar through Gers'],
        ['Sun 22 Nov', '21:40', 'Chat', 'Pub Crew · Melbourne chat created; asked Gers for a pub']
      ],
      Dubai: [
        ['Sun 3 Jan', '17:56', 'Passport', 'Passport entry built at full time: watch party, Dubai'],
        ['Sun 3 Jan', '15:52', 'Rangers TV', 'Opened Rangers TV for the 16:00 kick-off'],
        ['Sat 2 Jan', '21:20', 'Video', 'Watched Ally McCoist’s message for the watch party'],
        ['Wed 30 Dec', '19:08', 'Food', 'Paid their share of the food order in MyGers'],
        ['Tue 15 Dec', '12:44', 'Party', 'RSVP’d to the watch party at Morag’s flat'],
        ['Sun 22 Nov', '20:15', 'Chat', 'Watch Party HQ · Dubai chat created']
      ]
    },

    /* The written profiles. Each has two views: `weeks` (what the story produced) and `seasons`
       (the same fan three seasons on, to show how the picture fills in). In `facts`, a line with
       no `weeks` value is "not known yet" in the six-week view. */
    profiles: {
      aileen: {
        since: 'Member since Nov 2026',
        asOf: { weeks: 'As of Sun 3 Jan 2027', seasons: 'As of May 2029' },
        usage: {
          weeks: { visits: '29', time: '2 h 48 min', asks: '6', days: '7 of 8' },
          seasons: { visits: '1,140', time: '96 h', asks: '87', days: '412' }
        },
        facts: [
          { label: 'Matches attended', weeks: '1 · Rangers v Celtic, Sun 3 Jan', seasons: '31 at Ibrox · 5 away, one of them in Europe' },
          { label: 'Seat', weeks: 'CF3, row G, seat 083 · asked for Copland Front', seasons: 'Copland Front 24 of 31 · hospitality twice' },
          { label: 'Goes with', weeks: 'Rory, in seat 084', seasons: 'Rory 22 matches · Dad 6 · colleagues 2' },
          { label: 'Players followed', weeks: 'Chermiti, Raskin, Gassama, Curtis · legend: Allan McGregor', seasons: 'Raskin every season · 41 player videos watched · legend: Allan McGregor' },
          { label: 'Content opened', weeks: 'Player content on 6 of 7 days', seasons: 'Players 62% · Behind the scenes 21% · Analytics 9% · History 8%' },
          { label: 'Getting to Ibrox', weeks: 'Subway from Buchanan Street · scanned in 32 min before kick-off', seasons: 'Subway 27 of 31 · seated 35 min before kick-off on average' },
          { label: 'Away from Ibrox', seasons: 'Rangers TV for 14 away matches · main camera, club channel' },
          { label: 'Bought through MyGers', weeks: 'Membership · 2 seats through the club’s resale', seasons: 'Membership renewed 3 times · 11 resale seats · 2 hospitality upgrades · 1 shirt, Raskin’s name' },
          { label: 'Asks Gers for', weeks: 'Two seats together for the Old Firm', seasons: 'Seats together 9 times · away tickets 4 · hospitality for Dad’s 60th' },
          { label: 'Members brought in', seasons: '3 · Dad and two colleagues' },
          { label: 'Moments', weeks: 'First Old Firm with Rory', seasons: 'Dad’s 60th, Mar 2028 · 25th match, Nov 2028' },
          { label: 'Passport', weeks: '1 entry', seasons: '36 entries' }
        ],
        // Newest first. A block with `later: true` shows only in the three-season view; the last
        // block is the story itself and carries no heading of its own.
        activity: [
          { season: 'Season 2028/29', later: true, items: [
            ['12 May 2029', '09:02', 'Membership', 'Renewed MyGers for a fourth season, the day renewals opened'],
            ['4 Nov 2028', '16:58', 'Passport', '25th match in the passport'],
            ['21 Sep 2028', '10:15', 'Ticket', 'European away night: asked Gers for two away tickets, went with Rory']
          ] },
          { season: 'Season 2027/28', later: true, items: [
            ['18 Mar 2028', '11:30', 'Hospitality', 'Dad’s 60th: hospitality for four, booked through Gers'],
            ['9 Dec 2027', '20:44', 'Shop', 'Bought a home shirt with Raskin’s name'],
            ['23 Oct 2027', '14:10', 'Network', 'Brought two colleagues to their first match; both joined MyGers afterwards'],
            ['2 Aug 2027', '08:30', 'Membership', 'Renewed MyGers; invited Dad, who joined']
          ] },
          { season: 'Season 2026/27', later: true, items: [
            ['17 Apr 2027', '15:02', 'Rangers TV', 'Watched the away match on Rangers TV: main camera, club channel'],
            ['6 Feb 2027', '12:48', 'Ticket', 'Back at Ibrox with Rory: two seats through the club’s resale, Copland Front again']
          ] },
          { items: [
            ['Sun 3 Jan', '13:56', 'Passport', 'Passport entry built at full time: Rangers 2, Celtic 1, stamped “I was there”, linked to Rory'],
            ['Sun 3 Jan', '11:41', 'Chat', 'Shared a photo from CF3, row G in Ibrox Two'],
            ['Sun 3 Jan', '11:28', 'Ticket', 'Scanned in at the Copland Road turnstile · seat 083'],
            ['Sun 3 Jan', '10:34', 'Matchday', 'Took Gers’s route: subway from Buchanan Street, Copland Road turnstiles'],
            ['Sat 2 Jan', '18:12', 'Video', 'Watched Allan McGregor’s message for Aileen and Rory, 0:45'],
            ['Fri 1 Jan', '08:47', 'Players', 'Opened Raskin’s press conference, cut to the three answers about Sunday'],
            ['Thu 31 Dec', '12:20', 'Players', 'Watched Chermiti’s New Year message to members'],
            ['Wed 30 Dec', '17:40', 'Video', 'Watched Allan McGregor, “Old Firm games that mattered”, 1:30'],
            ['Mon 28 Dec', '13:15', 'Players', 'Watched Raskin’s interview after training, 1:10'],
            ['Sun 27 Dec', '09:30', 'Players', 'Opened the countdown: Gers follows Chermiti, Raskin, Gassama and Curtis'],
            ['Sun 13 Dec', '09:14', 'Ticket', 'Took two seats through the club’s resale: CF3, row G, 083 and 084; opened Find your seats'],
            ['Sun 22 Nov', '19:20', 'Chat', 'Asked Gers for two seats together in Copland Front']
          ] }
        ],
        // What the club sees on Aileen's own links from the story, on top of the usual lines.
        ties: { rory: { strong: true, note: { weeks: 'Sat in seat 084, beside Aileen', seasons: '22 matches together' } } }
      }
    }
  };

  /* Act on it: one signal from the data becomes a targeted offer, and Gers takes it to the fan.
     The page fills in over four steps: the signal, the offer, how it is sent, what the fan sees.
     Prices are mock. */
  STORY.club.act = {
    title: 'Act on it',
    fan: 'aileen',
    signal: {
      title: '1 · The signal', aside: 'From Aileen’s profile',
      rows: [
        ['Legend', 'Allan McGregor'],
        ['Watched', 'Both of his videos this week: Wed 30 Dec and Sat 2 Jan'],
        ['Opens', 'Player content on 6 of 7 days'],
        ['At Ibrox', 'Sun 3 Jan, CF3 row G, with Rory'],
        ['Lives in', 'Glasgow'],
        ['Network', 'Rory · Dougie, a season ticket holder']
      ]
    },
    offer: {
      title: '2 · The offer', aside: 'One legend, three levels',
      legend: 'mcgregor', kicker: 'An experience with', guests: 'For Aileen · guests can be added', per: 'per person', currency: '£',
      tiers: [
        { name: 'Meet him before the match', text: 'Legends’ lounge, 45 minutes before kick-off. A photo and a signed programme.', price: 60 },
        { name: 'Pitch-side for the warm-up', text: 'Walk out with him for the warm-up, then lunch in the legends’ lounge.', price: 140 },
        { name: 'Watch the match with him', text: 'A seat in his box for the full 90, with hospitality.', price: 320 }
      ]
    },
    send: {
      title: '3 · Send it', aside: 'Three ways out',
      channels: [
        // `text` is one plain box; `lines` is a box of labelled rows
        { id: 'dm', label: 'DM from Gers', text: 'Gers messages Aileen one to one, in its own voice, with the three levels to pick from.' },
        { id: 'push', label: 'In-app notification', text: 'A notification from MyGers: “Allan McGregor would like to meet you.” A tap opens the offer.' },
        { id: 'trigger', label: 'Automatic trigger', lines: [['When', 'A fan watches a legend’s videos twice a week, two weeks running'], ['Then', 'Gers sends that legend’s offer, with add-on places for the people they sat with'], ['Runs', 'Automatically, for every member, the moment it happens']] }
      ],
      more: { title: 'More triggers', rows: [
        ['Fifth match in the passport', 'Hospitality upgrade for the next one'],
        ['Hosted a watch party of 8 or more', 'A signed shirt for the host'],
        ['Brought in a new member', 'Loyalty points for both'],
        ['Asked for seats three times, no luck', 'Priority on the next release']
      ] }
    },
    phone: {
      title: '4 · What Aileen sees', thread: 'gersAileen',
      items: [
        { type: 'gers', text: 'Hey Aileen. You’re a big Allan McGregor fan, and you’ve been following him closely for the past two weeks. Fancy meeting him? There are three ways to do it, and you can come on your own or bring someone with you. Here’s the offer for you.' },
        { type: 'offerCard', note: 'On your own, or add a guest', button: 'Hold my place' }
      ]
    }
  };
  // Gers's own chat with Aileen, for the phone on the Act on it page.
  STORY.threads.gersAileen = { kind: 'chat', gers: true, title: 'Gers', avatars: ['aileen'] };

  // The club view replaces the "coming next" placeholder: four screens on the main line.
  // On the profile, the first step is the six-week view and the next step the three-season view.
  var scenes = STORY.scenes;
  var at = scenes.map(function (scene) { return scene.id; }).indexOf('club');
  scenes.splice(at, 1,
    { id: 'club', title: 'Club view · overview', club: 'overview', phones: [], steps: [{}] },
    { id: 'clubFans', title: 'Club view · fans', club: 'fans', phones: [], steps: [{}] },
    { id: 'clubFan', title: 'Club view · one fan', club: 'fan', fan: 'aileen', spans: ['weeks', 'seasons'], phones: [], steps: [{}, {}] },
    { id: 'clubAct', title: 'Club view · act on it', club: 'act', phones: [], steps: [{}, {}, {}, {}] }
  );

  STORY.chapters.push({ group: 'Club view', items: [
    { label: 'Overview', scene: 'club' },
    { label: 'Fans', scene: 'clubFans' },
    { label: 'One fan · Aileen', scene: 'clubFan' },
    { label: 'Act on it', scene: 'clubAct' }
  ] });
})();
