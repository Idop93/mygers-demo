/* The MyGers story, part 3 of 3: the countdown week, matchday and full time (boards 3.1 to 4.6).
   Adds its scenes, chats, panels and figures to the story started in story.js.
   The ready-drawn screens it names (`{ type: 'drawn', use: ... }`) are in story-screens.js.

   Order on the main line: 2.2 → the "7 days to go" card → 3.1 … 3.6 → 3.8 → 3.7 → 3.9 → the "It’s matchday" card → 4.1 … 4.6 → club view.
   3.8 comes straight after 3.6 because it is the close-up of Calum's 3.6 phone; 3.9 follows 3.7 the same way.

   The wordings marked DRAFT below were written by the agent and confirmed by Ido on 22 Nov 2026. */
(function () {
  'use strict';
  var STORY = window.STORY;

  Object.assign(STORY.ui, {
    backFour: 'Back to all four phones',
    backThreePhones: 'Back to all three phones',
    close: 'Close',
    rangers: 'Rangers',
    celtic: 'Celtic'
  });

  // The countdown strip at the top of every fan's phone. Tapping a day jumps to that day's scene.
  STORY.week = {
    sub: 'Countdown · Rangers v Celtic · Sun 3 Jan',
    crests: ['rangers', 'celtic'],
    days: [
      { offset: '−7', date: '27', label: 'Sun 27', scene: '3.1' },
      { offset: '−6', date: '28', label: 'Mon 28', scene: '3.2' },
      { offset: '−5', date: '29', label: 'Tue 29', scene: '3.3' },
      { offset: '−4', date: '30', label: 'Wed 30', scene: '3.4' },
      { offset: '−3', date: '31', label: 'Thu 31', scene: '3.5' },
      { offset: '−2', date: '1', label: 'Fri 1', scene: '3.6' },
      { offset: '−1', date: '2', label: 'Sat 2', scene: '3.7' },
      { offset: 'MD', date: '3', label: 'Sun 3', scene: '4.1', matchday: true }
    ]
  };

  // The five legends (PRD, "Favourite players"). The photos are the team's own files.
  STORY.legends = {
    mccoist:   { name: 'Ally McCoist',   era: '1980s and 1990s',        face: 'assets/legends-web/mccoist-face.jpg',   hero: 'assets/legends-web/mccoist-hero.jpg' },
    laudrup:   { name: 'Brian Laudrup',  era: 'Mid to late 1990s',      face: 'assets/legends-web/laudrup-face.jpg',   hero: 'assets/legends-web/laudrup-hero.jpg' },
    ferguson:  { name: 'Barry Ferguson', era: 'Late 1990s and 2000s',   face: 'assets/legends-web/ferguson-face.jpg',  hero: 'assets/legends-web/ferguson-hero.jpg' },
    mcgregor:  { name: 'Allan McGregor', era: '2000s to early 2020s',   face: 'assets/legends-web/mcgregor-face.jpg',  hero: 'assets/legends-web/mcgregor-hero.jpg' },
    tavernier: { name: 'James Tavernier', era: '2015 onward',           face: 'assets/legends-web/tavernier-face.jpg', hero: 'assets/legends-web/tavernier-hero.jpg' }
  };

  // Photos fetched as the page opens, so no card shows blank for a moment the first time it appears.
  STORY.preload = ['assets/fans/bar.jpg', 'assets/fans/flat.jpg', 'assets/fans/goodiebag.jpg', 'assets/fans/hq.jpg', 'assets/fans/ibrox-lot.jpg', 'assets/fans/ibrox-seats.jpg',
    'assets/fans/ibrox-two.jpg', 'assets/fans/pubcrew.jpg', 'assets/crests/celtic.png', 'assets/crests/dundee.png'].concat(
    Object.keys(STORY.legends).reduce(function (files, id) { return files.concat([STORY.legends[id].face, STORY.legends[id].hero]); }, []));

  // DRAFT (decision Q15): the member profile that opens when a member's name or avatar is tapped.
  // No board exists; the facts are the PRD's cast table, held in `fans` in story.js.
  STORY.profile = {
    kicker: 'MyGers member',
    rows: { matchday: 'On matchday', interest: 'Cares most about', legend: 'Their legend' },
    where: { Glasgow: 'Ibrox, Glasgow', Melbourne: 'Pub, Melbourne', Dubai: 'Watch party, Dubai' }
  };

  // DRAFT (decision Q12): the data behind the two chips on Calum's preview. All figures are mock.
  // The averages match the card: PPDA 8.7 v 11.2 (174 ÷ 20 and 190 ÷ 17), xG 1.9 v 1.4.
  STORY.pops = {
    ppda: {
      title: 'PPDA · our press', versus: '8.7 v 11.2',
      line: 'How many passes Celtic make before we win the ball back. Lower means a harder press.',
      sections: [
        { label: 'How it is worked out · per match', rows: [
          ['Opponent’s passes in their own half', '174', '190'],
          ['Tackles, interceptions and fouls there', '20', '17'],
          ['Passes ÷ actions = PPDA', '8.7', '11.2']
        ] },
        { label: 'Winning it high · per match', rows: [['Balls won in their third', '7.4', '4.9']] },
        { label: 'PPDA in each of the last 5 matches', rows: [
          ['Match 1', '8.1', '11.8'], ['Match 2', '9.4', '10.6'], ['Match 3', '8.3', '11.5'], ['Match 4', '9.0', '10.9'], ['Match 5 · latest', '8.7', '11.2']
        ] }
      ]
    },
    xg: {
      title: 'xG · chance quality', versus: '1.9 v 1.4',
      line: 'How good our chances are: the goals we would expect to score from them.',
      sections: [
        { label: 'Per match, last 5', rows: [
          ['Shots', '15.2', '11.6'], ['Shots on target', '5.8', '4.0'], ['Big chances', '2.6', '1.6'], ['xG per shot', '0.13', '0.12']
        ] },
        { label: 'Where the shots come from', rows: [['Inside the box', '68%', '57%'], ['Outside the box', '32%', '43%']] },
        { label: 'xG in each of the last 5 matches', rows: [
          ['Match 1', '2.3', '1.2'], ['Match 2', '1.6', '1.7'], ['Match 3', '2.1', '1.1'], ['Match 4', '1.4', '1.6'], ['Match 5 · latest', '2.1', '1.4']
        ] }
      ]
    }
  };

  // The team sheet (PRD, "Matchday"): the XI from St Mirren 0–2 Rangers, 7 Nov 2026, as a stand-in, in a 4-4-2.
  // x and y are each player's place on the pitch, in percent.
  STORY.teamSheet = {
    captain: 'C',
    players: [
      { number: 1, name: 'Pandur', x: 50, y: 89, keeper: true },
      { number: 29, name: 'Penrice', x: 13, y: 66 }, { number: 24, name: 'Makhanya', x: 38, y: 66 }, { number: 37, name: 'Fernandez', x: 62, y: 66 }, { number: 21, name: 'Sterling', x: 87, y: 66 },
      { number: 10, name: 'Kim', x: 13, y: 39 }, { number: 6, name: 'Neil', x: 38, y: 39 }, { number: 43, name: 'Raskin', x: 62, y: 39, captain: true }, { number: 26, name: 'Bouanani', x: 87, y: 39 },
      { number: 19, name: 'Kelsy', x: 34, y: 13 }, { number: 20, name: 'Naderi', x: 66, y: 13 }
    ]
  };

  // 4.3 Rangers TV. The board shows Calum's choices (tactical, every chance, deep, club channel).
  // The other choices behave like "Try the controls" on the proposal site (decision Q16).
  // DRAFT: the tags, stats and commentary lines for the choices the board does not draw.
  STORY.tv = {
    minute: '27’',
    start: { tvCamera: 'tactical', tvReplays: 'chances', tvStats: 'deep', tvCommentary: 'club' },
    groups: [
      { key: 'tvCamera', label: 'Camera', options: [
        { id: 'main', name: 'Main', tag: 'MAIN CAMERA' },
        { id: 'tactical', name: 'Tactical', tag: 'TACTICAL CAMERA' },
        { id: 'goal', name: 'Behind the goal', tag: 'BEHIND THE GOAL' }
      ] },
      { key: 'tvReplays', label: 'Replays', options: [
        { id: 'goals', name: 'Goals only' }, { id: 'chances', name: 'Every chance' }, { id: 'player', name: 'One player: Naderi' }
      ] },
      { key: 'tvStats', label: 'Statistics', options: [
        { id: 'off', name: 'Off' },
        { id: 'basic', name: 'Basic', title: 'MATCH STATS', lines: ['Possession 58 · 42', 'Shots 5 · 2'] },
        { id: 'deep', name: 'Deep', title: 'DEEP STATS', lines: ['Chance quality 0.9 · 0.3', 'Passes into box 7 · 2'] }
      ] },
      { key: 'tvCommentary', label: 'Commentary', options: [
        { id: 'club', name: 'Club channel', line: '“Rangers pinning them back down the right…”' },
        { id: 'neutral', name: 'Neutral', line: '“Rangers on top here, working it down the right-hand side.”' },
        { id: 'crowd', name: 'Crowd only', line: 'No commentary. Just the noise of Ibrox.' }
      ] }
    ],
    footer: 'Each phone in the room can choose its own view',
    // The picture: 11 v 11 on a pitch 1050 by 680, laid out as on the proposal site's "Try the controls".
    // Each pair is a player's place; `passes` are the lines drawn when deep statistics are on.
    rangers: [[60, 340], [230, 140], [210, 280], [210, 400], [230, 540], [420, 220], [400, 340], [420, 460], [620, 160], [660, 340], [620, 520]],
    celtic: [[990, 340], [830, 150], [850, 290], [850, 400], [830, 530], [700, 230], [720, 350], [700, 470], [560, 240], [540, 420], [480, 340]],
    ball: [676, 330],
    passes: [[400, 340, 660, 340], [420, 220, 620, 160], [660, 340, 620, 520]]
  };

  Object.assign(STORY.threads, {
    preview: { kind: 'screen', sub: 'Fri 1 Jan · for Calum', title: 'Match preview',
      items: [{ type: 'drawn', use: 'preview1' }, { type: 'drawn', use: 'preview2' }, { type: 'drawn', use: 'preview3' }, { type: 'drawn', use: 'preview4' }, { type: 'drawn', use: 'preview5' }] },
    matchday: { kind: 'screen', sub: 'Sun 3 Jan · Ibrox', title: 'Matchday',
      items: [{ type: 'drawn', use: 'matchdayTracker' },
        { type: 'teamSheet', size: 'large', label: 'Team sheet · 11:00', formation: '4-4-2', badge: 'NEW', bench: 'Bench: Curtis passed his fitness test' },
        { type: 'drawn', use: 'seatPhotoButton' }] },
    tv: { kind: 'screen', sub: 'Rangers TV · live · in your MyGers', title: 'Rangers v Celtic', matchCrests: ['rangers', 'celtic'], items: [{ type: 'rangersTv' }] },
    passAileen: { kind: 'screen', sub: 'Season 2026/27 · new entry', title: 'My Passport', items: [{ type: 'drawn', use: 'fullTime' }, { type: 'drawn', use: 'passportAileen' }, { type: 'drawn', use: 'postMatchBundle' }] },
    passFraser: { kind: 'screen', sub: 'Season 2026/27 · new entry', title: 'My Passport', items: [{ type: 'drawn', use: 'fullTime' }, { type: 'drawn', use: 'passportFraser' }, { type: 'drawn', use: 'postMatchBundle' }] },
    passCalum:  { kind: 'screen', sub: 'Season 2026/27 · new entry', title: 'My Passport', items: [{ type: 'drawn', use: 'fullTime' }, { type: 'drawn', use: 'passportCalum' }, { type: 'drawn', use: 'postMatchBundle' }] },
    passAileenFull: { kind: 'screen', sub: 'Season 2026/27', title: 'My Passport', items: [{ type: 'drawn', use: 'passportTally' }, { type: 'drawn', use: 'passportAileen' }, { type: 'drawn', use: 'shareEntry' }] }
  });

  Object.assign(STORY.panels, {
    // 3.8
    analyst: {
      agent: 'analyst', kick: 'How the preview was built',
      steps: [
        { status: 'done', icon: 'video', tool: 'Match video', title: 'Celtic’s last five matches, 450 minutes' },
        { status: 'done', icon: 'db', tool: 'Event data', title: '212 attacks and 61 set pieces tagged', detail: 'Where each attack started and how it ended.' },
        { status: 'done', icon: 'db', tool: 'Rangers data', title: 'Compared with our last five matches' },
        { status: 'done', icon: 'bars', tool: 'Built for Calum', title: 'Three things that decide Sunday', detail: 'He follows analytics, so he gets the full version first.' },
        { status: 'wait', icon: 'people', tool: 'Partner slot', title: '“Presented by” line for a partner', detail: 'Shown to 15 fans: one revenue line in the club view.' }
      ],
      footer: 'Figures are examples until real data is connected.'
    },
    // 3.9
    video: {
      agent: 'player', kick: 'How the message was made',
      steps: [
        { status: 'done', icon: 'people', tool: 'Watch Party HQ', title: '10 members · host Morag, 58' },
        { status: 'done', icon: 'db', tool: 'Matched by age', title: 'Morag grew up with Ally McCoist', detail: 'Each fan follows the legend of the era they grew up with.' },
        { status: 'done', icon: 'mail', tool: 'Request to the club', title: 'Script: Morag’s name, the party, 16:00 kick-off in Dubai' },
        { status: 'done', icon: 'video', tool: 'Recorded by the club’s media team', title: '45 seconds' },
        { status: 'done', icon: 'mail', tool: 'Delivered', title: 'Sat 2 Jan, 10:00 Dubai time', detail: 'In their MyGers membership. Nothing extra to pay.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    // 4.2. DRAFT: "10:30" stands in for the board's "[time from the club]".
    gettingThere: {
      agent: 'matchday', kick: 'Getting them there',
      steps: [
        { status: 'done', icon: 'calendar', tool: 'Subway times', title: 'Next train 10:49 · 12 minutes to Ibrox' },
        { status: 'done', icon: 'globe', tool: 'Club matchday information', title: 'Turnstiles open 10:30', detail: 'Bags and entry rules for this match.' },
        { status: 'done', icon: 'db', tool: 'Team sheet', title: 'Named at 11:00, posted at 11:00', detail: 'Before any news site had it.' },
        { status: 'now', icon: 'camera', tool: 'Seat photo', title: 'A reminder at 11:40 for a photo of the two of them', detail: 'It goes straight into their passport.' }
      ],
      footer: 'Nothing is booked, bought or sent without the fan’s approval.'
    },
    // 4.3
    watching: {
      agent: 'matchday', kick: 'How the party is watching',
      steps: [
        { status: 'done', icon: 'tv', tool: 'Rangers TV', title: 'Live in Dubai, 16:00, on Morag’s TV and 10 phones' },
        { status: 'done', icon: 'eye', tool: 'Calum’s choices', title: 'Tactical camera · every chance · deep stats', detail: 'He follows analytics, so deep stats were offered first.' },
        { status: 'done', icon: 'eye', tool: 'The room', title: '6 on the main camera, 3 tactical, 1 behind the goal', detail: 'Commentary: 8 club channel, 2 crowd only.' },
        { status: 'wait', icon: 'db', tool: 'For the club', title: 'Every choice is a viewing preference', detail: 'It feeds the club view at the end.' }
      ],
      footer: 'Choices are counted, never shared with other fans.'
    },
    // 4.6
    passport: {
      agent: 'matchday', kick: 'From turnstile to passport',
      steps: [
        { status: 'done', icon: 'ticket', tool: 'Trigger · ticket scan', title: 'Copland Road turnstile, 11:28 · CF3, row G, seat 083',
          detail: 'The club’s ticketing system passes the scan to the Matchday agent. That scan opens Aileen’s entry for this match and stamps it “I was there”.' },
        { status: 'done', icon: 'people', tool: 'Who with', title: 'Rory scanned in at 11:29, seat 084', detail: 'Both seats came from the same club release, so the two entries are linked.' },
        { status: 'done', icon: 'camera', tool: 'Photos', title: 'During the match: 4 from Ibrox Two, 2 from Ibrox Lot', detail: 'Only their own photos. Nothing is generated.' },
        { status: 'done', icon: 'db', tool: 'Official result', title: 'Full time: Rangers 2, Celtic 1', detail: 'The club’s result closes the entry and links the highlights.' },
        { status: 'done', icon: 'eye', tool: 'Moment', title: 'Rory’s first Old Firm, marked on both entries' },
        { status: 'done', icon: 'passport', tool: 'Passport', title: 'In Aileen’s passport at the final whistle', detail: 'Her season tally updates (6 matches, 2 grounds, 1 Old Firm), and she can share it in one tap.' }
      ],
      footer: 'No form to fill in: the scan starts it, the final whistle finishes it.'
    }
  });

  // The four fans of the countdown week, one per interest. The note under each phone changes every day.
  function weekPhones(day, notes) {
    var fans = [
      { owner: 'calum', label: 'Calum', sub: 'Analytics · Dubai' },
      { owner: 'hamish', label: 'Hamish', sub: 'History · Melbourne' },
      { owner: 'aileen', label: 'Aileen', sub: 'Players · Ibrox' },
      { owner: 'morag', label: 'Morag', sub: 'Behind the scenes · Dubai' }
    ];
    return fans.map(function (fan, i) {
      return { owner: fan.owner, thread: 'cd' + day + fan.owner, label: fan.label, sub: fan.sub, rail: fan.label, note: { agent: notes[i][0], text: notes[i][1] } };
    });
  }

  var MESSAGE_DAY = 'Sat 2 Jan · tomorrow';
  var matchdayPhones = [
    { owner: 'aileen', thread: 'ibroxTwo', label: 'Aileen and Rory', sub: 'Ibrox · 11:20', rail: 'Ibrox', note: { agent: 'matchday', text: 'team sheet posted at 11:00' } },
    { owner: 'fraser', thread: 'pubCrew', label: 'Fraser, Kirsty, Hamish', sub: 'Kicks Bar, Melbourne · 22:20', rail: 'Melbourne', note: { agent: 'matchday', text: 'checked: match on, sound up' } },
    { owner: 'calum', thread: 'hq', label: 'Calum, Morag and 8 more', sub: 'Morag’s flat, Dubai · 15:20', rail: 'Dubai', note: { agent: 'matchday', text: 'Rangers TV live on Morag’s TV' } }
  ];
  function withSub(phones, index, sub) {
    return phones.map(function (phone, i) { return i === index ? Object.assign({}, phone, { sub: sub }) : phone; });
  }

  STORY.scenes = STORY.scenes.concat([
    // DRAFT (Ido, 22 Nov): the card between Act 2 and the countdown week, so the switch from three journeys to four fans is clear.
    { id: 'week', title: 'Into the countdown week', phones: [],
      interlude: { kicker: 'Sun 27 Dec', title: '7 days to go', text: 'Four fans, four countdowns. Each one is shaped by what that fan cares about.', fans: ['calum', 'hamish', 'aileen', 'morag'] },
      steps: [{}] },

    { id: '3.1', title: '−7 Sun 27 Dec · the week ahead', backLabel: STORY.ui.backFour, steps: [{}],
      phones: weekPhones(7, [['analyst', 'Pulled form and scorer stats. Gers led with them for Calum.'], ['archive', 'Found the last five meetings and a New Year archive clip.'],
        ['player', 'Picked three updates on the four players Aileen follows.'], ['access', 'Lined up the week’s behind-the-scenes clips for Morag.']]) },
    { id: '3.2', title: '−6 Mon 28 Dec · training report', backLabel: STORY.ui.backFour, steps: [{}],
      phones: weekPhones(6, [['analyst', 'Split our home goals into 15-minute periods.'], ['archive', 'Cut extended highlights of May 1999.'],
        ['player', 'Cut Raskin’s interview to the Old Firm answers.'], ['access', 'Took the rondo clip from the club camera.']]) },
    { id: '3.3', title: '−5 Tue 29 Dec · injury update', backLabel: STORY.ui.backFour, steps: [{}],
      phones: weekPhones(5, [['analyst', 'Compared our right side with and without Gassama.'], ['archive', 'Sorted the full Old Firm games by length.'],
        ['player', 'Found Gassama’s fitness interview.'], ['access', 'Got the physio-room clip cleared by the club.']]) },
    { id: '3.4', title: '−4 Wed 30 Dec · legends’ videos', backLabel: STORY.ui.backFour, steps: [{}],
      phones: weekPhones(4, [['player', 'Matched Calum to Barry Ferguson by age.'], ['player', 'Matched Hamish to Brian Laudrup by age.'],
        ['player', 'Matched Aileen to Allan McGregor by age.'], ['player', 'Matched Morag to Ally McCoist by age.']]) },
    { id: '3.5', title: '−3 Thu 31 Dec · last night’s match, plus behind the scenes', backLabel: STORY.ui.backFour, steps: [{}],
      phones: weekPhones(3, [['analyst', 'Mapped where Celtic’s corners land.'], ['archive', 'Wrote up the New Year Old Firm story.'],
        ['player', 'Delivered Chermiti’s message to members.'], ['access', 'Picked the training-ground clip of the week.']]) },
    { id: '3.6', title: '−2 Fri 1 Jan · content by interest', backLabel: STORY.ui.backFour, steps: [{}], focus: { 0: { scene: '3.8' } },
      phones: weekPhones(2, [['analyst', 'Built the three things that decide Sunday.'], ['archive', 'Put the history and the head-to-head together.'],
        ['player', 'Cut the press conference to the Sunday answers.'], ['access', 'Turned the press conference into Q&A cards.']]) },

    { id: '3.8', title: 'Focus: how the Analyst agent built Calum’s preview', parent: '3.6', backLabel: STORY.ui.backFour,
      phones: [{ owner: 'calum', thread: 'preview' }],
      steps: [{ panel: { id: 'analyst', show: 1 } }, { panel: { id: 'analyst', show: 2 } }, { panel: { id: 'analyst', show: 3 } }, { panel: { id: 'analyst', show: 4 } }, { panel: { id: 'analyst', show: 5 } }] },

    // Ido, 22 Nov: three phones here, one per journey, not the board's four (no second Watch Party HQ phone).
    { id: '3.7', title: '−1 Sat 2 Jan · the personalized video', backLabel: STORY.ui.backThreePhones, focus: { 2: { scene: '3.9' } },
      phones: [
        { owner: 'hamish', thread: 'pubCrew', label: 'Hamish', sub: 'History · Melbourne', rail: 'Hamish', note: { agent: 'player', text: 'Delivered Laudrup’s message to the Pub Crew.' } },
        { owner: 'aileen', thread: 'ibroxTwo', label: 'Aileen', sub: 'Players · Ibrox', rail: 'Aileen', note: { agent: 'player', text: 'Delivered McGregor’s message to Ibrox Two.' } },
        { owner: 'morag', thread: 'hq', label: 'Morag', sub: 'Behind the scenes · Dubai', rail: 'Morag', note: { agent: 'player', text: 'Asked the club for McCoist’s message, naming Morag’s party.' } }
      ],
      steps: [
        { add: [
          ['pubCrew', { type: 'day', cut: true, text: MESSAGE_DAY }], ['pubCrew', { type: 'gers', text: 'A message for the Pub Crew, from Brian Laudrup.' }],
          ['ibroxTwo', { type: 'day', cut: true, text: MESSAGE_DAY }], ['ibroxTwo', { type: 'gers', text: 'A message for you both before your first Old Firm together, from Allan McGregor.' }],
          ['hq', { type: 'day', cut: true, text: MESSAGE_DAY }], ['hq', { type: 'gers', text: 'Morag, a message for you and the party, from your legend.' }]
        ] },
        { add: [
          ['pubCrew', { type: 'videoTile', legend: 'laudrup', label: 'A message for the Pub Crew · 0:45', title: 'A message from Brian Laudrup' }],
          ['ibroxTwo', { type: 'videoTile', legend: 'mcgregor', label: 'A message for Aileen and Rory · 0:45', title: 'A message from Allan McGregor' }],
          ['hq', { type: 'videoTile', legend: 'mccoist', label: 'A message for Morag’s party · 0:45', title: 'A message from Ally McCoist' }]
        ] },
        { add: [
          ['pubCrew', { type: 'msg', from: 'fraser', text: 'Laudrup. In Melbourne. Mental' }],
          ['ibroxTwo', { type: 'msg', from: 'rory', text: 'I’m not crying, you’re crying' }],
          ['hq', { type: 'msg', from: 'morag', text: 'He SAID MY NAME' }]
        ] },
        { add: [
          ['pubCrew', { type: 'msg', from: 'hamish', text: 'Played it four times already' }],
          ['hq', { type: 'msg', from: 'isla', text: 'Ally McCoist knows about your flat' }]
        ] },
        { add: [['hq', { type: 'msg', from: 'calum', text: 'Greatest day of my life and it’s not even matchday' }]] },
        { add: [['hq', { type: 'msg', from: 'niamh', text: 'Playing it on the big telly tomorrow' }]] }
      ] },

    { id: '3.9', title: 'Focus: how the personalized video was made', parent: '3.7', backLabel: STORY.ui.backThreePhones,
      phones: [{ owner: 'morag', thread: 'hq' }],
      steps: [{ panel: { id: 'video', show: 1 } }, { panel: { id: 'video', show: 2 } }, { panel: { id: 'video', show: 3 } }, { panel: { id: 'video', show: 4 } }, { panel: { id: 'video', show: 5 } }] },

    // DRAFT (Ido, 22 Nov): a card that says it is matchday, before the three phones appear.
    { id: 'matchday', title: 'Into matchday', phones: [],
      interlude: { kicker: 'Sun 3 Jan', title: 'It’s matchday', crests: ['rangers', 'celtic'], text: 'Rangers v Celtic. One match, watched in three places.',
        places: [
          { name: 'Ibrox', who: 'Aileen and Rory', time: 'Kick-off 12:00' },
          { name: 'Kicks Bar, Melbourne', who: 'Fraser, Kirsty and Hamish', time: 'Kick-off 23:00' },
          { name: 'Morag’s flat, Dubai', who: 'Calum, Morag and 8 more', time: 'Kick-off 16:00' }
        ] },
      steps: [{}] },

    { id: '4.1', title: 'Before kick-off, three places', phones: matchdayPhones, focus: { 0: { scene: '4.2' }, 2: { scene: '4.3' } },
      steps: [
        { add: [
          ['ibroxTwo', { type: 'day', cut: true, text: 'Sun 3 Jan · matchday' }],
          ['ibroxTwo', { type: 'gers', text: 'Morning, you two! Next subway to Ibrox is in 8 minutes from Buchanan Street. The station’s already packed, so come out the main exit and head for the Copland Road turnstiles. You’ll be in your seats by 11:30, in time for the team sheet.' }],
          ['pubCrew', { type: 'day', cut: true, text: 'Sun 3 Jan · 22:20' }],
          ['pubCrew', { type: 'gers', text: 'It’s matchday, Pub Crew! I checked with Kicks Bar at 21:30: the game’s on the big screen with the sound up, and your table’s waiting. The Melbourne Rangers lot are already in.' }],
          ['hq', { type: 'day', cut: true, text: 'Sun 3 Jan · 15:20' }],
          ['hq', { type: 'gers', text: 'It’s matchday, Watch Party HQ! Rangers TV is live on Morag’s telly and the flat looks the part. If you fancy more, you can also watch on your phones: pick a camera angle, replays or live stats.' }]
        ] },
        { add: [
          ['ibroxTwo', { type: 'teamSheet', size: 'small', label: 'Team sheet · 11:00 · 4-4-2', badge: 'NEW' }],
          ['pubCrew', { type: 'promiseCard', title: 'Kicks Bar · table for 3', pill: 'Promise kept', detail: 'Match on and sound on, as confirmed on 13 Dec' }],
          ['hq', { type: 'photo', image: 'flat', height: 110, alt: 'Photo · the flat, dressed from the goodie bag' }]
        ] },
        { add: [
          ['ibroxTwo', { type: 'photo', image: 'seats', height: 80, alt: 'Photo · Aileen and Rory, CF3 row G' }],
          ['pubCrew', { type: 'photoGrid', images: ['bar', 'pub', 'hq'], alt: 'Photo · the bar' }],
          ['hq', { type: 'msg', from: 'niamh', text: 'Scarves on. Playlist on. Ready' }]
        ] },
        { add: [
          ['ibroxTwo', { type: 'msg', from: 'rory', text: 'Look at this place' }],
          ['pubCrew', { type: 'msg', from: 'hamish', text: 'A Rangers crowd in Melbourne at 11pm. Love it' }],
          ['hq', { type: 'msg', from: 'calum', text: 'Pies are in the oven' }]
        ] }
      ] },

    { id: '4.2', title: 'Focus Ibrox: getting there', phones: matchdayPhones, focusPhone: 0, parent: '4.1', focus: { 2: { scene: '4.3' } },
      steps: [{ view: { 0: 'matchday' }, panel: { id: 'gettingThere', show: 1 } }, { panel: { id: 'gettingThere', show: 2 } }, { panel: { id: 'gettingThere', show: 3 } }, { panel: { id: 'gettingThere', show: 4 } }] },

    { id: '4.3', title: 'Focus Dubai: watching on Rangers TV', phones: withSub(matchdayPhones, 2, 'Morag’s flat, Dubai · 16:27'), focusPhone: 2, parent: '4.1', focus: { 0: { scene: '4.2' } },
      steps: [{ view: { 2: 'tv' }, panel: { id: 'watching', show: 1 } }, { panel: { id: 'watching', show: 2 } }, { panel: { id: 'watching', show: 3 } }, { panel: { id: 'watching', show: 4 } }] },

    // The goal lands in the main Ibrox Lot chat, shown on all three phones, each from its owner's side.
    { id: '4.4', title: '34 minutes: the goal, in three cities',
      phones: [
        { owner: 'aileen', thread: 'ibroxLot', label: 'Aileen and Rory', sub: 'Ibrox · 12:34', rail: 'Ibrox' },
        { owner: 'fraser', thread: 'ibroxLot', label: 'Fraser, Kirsty, Hamish', sub: 'Kicks Bar, Melbourne · 23:34', rail: 'Melbourne' },
        { owner: 'calum', thread: 'ibroxLot', label: 'Calum, Morag and 8 more', sub: 'Morag’s flat, Dubai · 16:34', rail: 'Dubai' }
      ],
      steps: [
        { add: [['ibroxLot', { type: 'day', cut: true, text: 'Sun 3 Jan · 12:34 in Glasgow' }],
          ['ibroxLot', { type: 'goalCard', kicker: 'GOAL · 34’', title: 'Rangers 1, Celtic 0', detail: 'Ibrox · Kicks Bar · Morag’s flat, all at once' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'aileen', text: 'GET IN' }], ['ibroxLot', { type: 'msg', from: 'fraser', text: 'Kicks Bar is BOUNCING' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'morag', text: 'The flat’s shaking' }], ['ibroxLot', { type: 'msg', from: 'rory', text: 'I can’t hear myself think' }]] },
        { add: [['ibroxLot', { type: 'msg', from: 'hamish', text: '11.34pm and I’m hugging strangers' }], ['ibroxLot', { type: 'msg', from: 'calum', text: 'Ten of us screaming in Dubai' }]] }
      ] },

    { id: '4.5', title: 'Full time: three passport entries', focus: { 0: { scene: '4.6' } }, steps: [{}],
      phones: [
        { owner: 'aileen', thread: 'passAileen', label: 'Aileen', sub: 'Ibrox · I was there', rail: 'Ibrox', note: { agent: 'matchday', text: 'entry built from the ticket scan and photos' } },
        { owner: 'fraser', thread: 'passFraser', label: 'Fraser', sub: 'Kicks Bar, Melbourne', rail: 'Melbourne', note: { agent: 'matchday', text: 'entry built from the booking and photos' } },
        { owner: 'calum', thread: 'passCalum', label: 'Calum', sub: 'Watch party, Dubai', rail: 'Dubai', note: { agent: 'matchday', text: 'entry built from the party and Rangers TV' } }
      ] },

    { id: '4.6', title: 'Focus: Aileen’s passport, built by itself', focusPhone: 0, parent: '4.5', backLabel: STORY.ui.backThreePhones,
      phones: [
        { owner: 'aileen', thread: 'passAileenFull', label: 'Aileen', sub: 'Ibrox · I was there', rail: 'Ibrox' },
        { owner: 'fraser', thread: 'passFraser', label: 'Fraser', sub: 'Kicks Bar, Melbourne', rail: 'Melbourne' },
        { owner: 'calum', thread: 'passCalum', label: 'Calum', sub: 'Watch party, Dubai', rail: 'Dubai' }
      ],
      steps: [{ panel: { id: 'passport', show: 1 } }, { panel: { id: 'passport', show: 2 } }, { panel: { id: 'passport', show: 3 } }, { panel: { id: 'passport', show: 4 } }, { panel: { id: 'passport', show: 5 } }, { panel: { id: 'passport', show: 6 } }] },

    // After 4.6: no dead end. The club view (5.1, 5.2) is built later, from `priceList` and `purchases`.
    { id: 'club', title: 'Club view placeholder', placeholder: true, phones: [], steps: [{}] }
  ]);

  // What the story adds for the club view: the analyst preview's partner line reached all 15 fans (3.8),
  // and ten of them watched on Rangers TV, which is part of the membership (4.3).
  STORY.purchases.push(
    { what: 'previewSlot', who: Object.keys(STORY.fans), quantity: 15, scene: '3.8' },
    { what: 'membership', who: Object.keys(STORY.fans), quantity: 15, scene: 'all' }
  );
  STORY.viewing = { scene: '4.3', viewers: 10, cameras: { main: 6, tactical: 3, goal: 1 }, commentary: { club: 8, crowd: 2 } };
})();
