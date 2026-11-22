/* MyGers demo: the cards and screens of Act 2 (boards Ibrox 1–3, Melbourne 1–2, Dubai 1–4, 2.2).
   Adds to the item list in render.js. Holds no copy: every word comes from story.js.
   The markup and inline sizes are the design canvas's own. */
(function () {
  'use strict';

  var R = window.RENDER;
  var esc = R.esc, icon = R.icon, pill = R.pill, crestPair = R.crestPair, avatar = R.avatar;

  // The pattern of the ticket's QR-style square on board Ibrox 3 (1 = dark). It is a drawing, not a working code.
  var QR = '1001010001010010010010100010100110100101100101000101001001001010';
  var V_ON_DARK = 'font-size:10px;font-weight:800;color:rgba(255,255,255,.7)';

  // The dark strip at the top of a ticket or invite: label, match title, both crests.
  function matchHead(item, crestSize, titleSize, padding) {
    return '<div style="background:#061230;color:#fff;padding:' + padding + ';display:flex;align-items:center;justify-content:space-between;gap:8px"><div><div class="lbl" style="color:#b9c9f3">' + esc(item.label) +
      '</div><div class="serif" style="font-size:' + titleSize + 'px;line-height:1.1;margin-top:2px;white-space:nowrap">' + esc(item.title) + '</div></div>' + crestPair(item.crests, crestSize, 5, V_ON_DARK) + '</div>';
  }
  function stackedAvatars(ids, size, ring, ringRadius) {
    return '<div class="row" style="gap:0">' + ids.map(function (id) {
      return '<div style="margin-right:-5px;border:2px solid ' + ring + ';border-radius:' + ringRadius + 'px">' + avatar(id, size) + '</div>';
    }).join('') + '</div>';
  }
  function keyValueRows(rows) {
    return rows.map(function (row) { return '<div class="row" style="justify-content:space-between"><span class="s">' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>'; }).join('');
  }

  // Ibrox 3: the plan of Ibrox. The active tab decides what is picked out.
  function ibroxMap(item, tab) {
    var s = item.stands;
    function mark(x, y, text, on) {
      return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + (on ? '#0032a0' : '#fff') + '" stroke="' + (on ? '#fff' : '#0f1b2d') + '" stroke-width="1.2"></circle><text x="' + x + '" y="' + (y + 2.8) +
        '" text-anchor="middle" font-size="7.5" font-weight="800" fill="' + (on ? '#fff' : '#0f1b2d') + '">' + esc(text) + '</text>';
    }
    var stand = 'text-anchor="middle" font-size="7.5" font-weight="700" fill="#5a6b85"';
    var route = tab === 'route' ? '<path d="M250 98 L238 98 L238 84 L228 84" fill="none" stroke="#e11b22" stroke-width="2" stroke-dasharray="3 2.5" stroke-linecap="round"></path>' : '';
    var sightLine = tab === 'view' ? '<path d="M224 78 L46 44 L46 106 Z" fill="#fff" fill-opacity=".28"></path>' : '';
    return '<svg viewBox="0 0 252 150" width="100%" style="display:block" role="img" aria-label="Map of Ibrox">' +
      '<rect x="40" y="4" width="172" height="22" rx="6" fill="#dfe6f3"></rect><text x="126" y="18" ' + stand + '>' + esc(s.north) + '</text>' +
      '<rect x="40" y="124" width="172" height="22" rx="6" fill="#dfe6f3"></rect><text x="126" y="138" ' + stand + '>' + esc(s.south) + '</text>' +
      '<rect x="4" y="30" width="30" height="90" rx="6" fill="#dfe6f3"></rect><text x="19" y="78" ' + stand + ' transform="rotate(-90 19 75)">' + esc(s.west) + '</text>' +
      '<rect x="218" y="30" width="30" height="90" rx="6" fill="#dfe6f3"></rect><text x="240" y="75" ' + stand + ' transform="rotate(90 240 75)">' + esc(s.east) + '</text>' +
      '<rect x="218" y="30" width="13" height="90" rx="3" fill="#c6d3ee"></rect><rect x="218" y="62" width="13" height="26" rx="3" fill="#0032a0"></rect>' +
      '<rect x="40" y="30" width="172" height="90" rx="4" fill="#2f8a4e"></rect><rect x="46" y="36" width="160" height="78" fill="none" stroke="#fff" stroke-opacity=".6"></rect>' +
      '<line x1="126" y1="36" x2="126" y2="114" stroke="#fff" stroke-opacity=".6"></line><circle cx="126" cy="75" r="12" fill="none" stroke="#fff" stroke-opacity=".6"></circle>' +
      sightLine + route + '<circle cx="224" cy="78" r="5" fill="#e11b22" stroke="#fff" stroke-width="1.5"></circle>' +
      mark(205, 26, item.marks.toilets, tab === 'toilets') + mark(205, 124, item.marks.food, tab === 'food') + mark(240, 126, item.marks.drinks, tab === 'drinks') + '</svg>';
  }

  var cards = {
    // Ibrox 2: the two seats, offered at the club's resale price
    seatOffer: function (item) {
      return '<div class="card" style="padding:0;overflow:hidden">' + matchHead(item, 26, 17, '11px 12px') + '<div style="padding:10px 12px"><div class="row" style="justify-content:space-between"><b style="font-size:13px">' +
        esc(item.lead) + '</b><b style="font-size:13px">' + esc(item.price) + '</b></div><div class="s" style="font-size:11px;margin-top:2px">' + esc(item.detail) + '</div><div style="height:8px"></div><button class="btnp">' + esc(item.button) + '</button></div></div>';
    },
    // Ibrox 3: the ticket in the MyGers wallet
    walletTicket: function (item) {
      var squares = QR.split('').map(function (dark) { return '<span style="background:' + (dark === '1' ? '#0f1b2d' : '#fff') + '"></span>'; }).join('');
      return '<div class="card" style="padding:0;overflow:hidden">' + matchHead(item, 28, 18, '12px') + '<div style="padding:10px 12px;display:flex;gap:12px;align-items:center">' +
        '<div style="transform:scale(.7);transform-origin:left center;width:68px;height:68px"><div style="width:96px;height:96px;border-radius:8px;background:#fff;border:6px solid #fff;outline:1px solid #e4e7ec;display:grid;grid-template-columns:repeat(8,1fr);gap:2px">' + squares + '</div></div>' +
        '<div style="font-size:11.5px;line-height:1.45"><b style="font-size:13.5px">' + esc(item.name) + '</b>' + item.lines.map(function (line) { return '<div class="s">' + esc(line) + '</div>'; }).join('') + '</div></div></div>';
    },
    // Ibrox 3: Find your seats. Each tab picks out something different on the map and shows its own line.
    seatFinder: function (item, owner, typing, local) {
      var active = item.tabs.filter(function (tab) { return tab.id === local.seatTab; })[0] || item.tabs[0];
      var tabs = item.tabs.map(function (tab) {
        var on = tab.id === active.id;
        return '<button class="tabchip" data-action="tab" data-key="seatTab" data-value="' + tab.id + '" style="background:' + (on ? '#0032a0' : '#eef1f5') + ';color:' + (on ? '#fff' : '#4a5568') + '">' + esc(tab.name) + '</button>';
      }).join('');
      return '<div class="card" style="padding:10px 11px"><div class="row" style="justify-content:space-between"><div class="lbl">' + esc(item.label) + '</div><span class="s" style="font-size:10px">' + esc(item.hint) + '</span></div>' +
        '<div style="margin-top:6px;border-radius:10px;overflow:hidden;background:#f1f4f9;padding:4px">' + ibroxMap(item, active.id) + '</div><div class="row" style="gap:4px;margin-top:7px">' + tabs + '</div>' +
        '<div class="row" style="gap:8px;margin-top:7px;align-items:flex-start"><div style="flex:1;font-size:10.5px;line-height:1.4"><b>' + esc(active.title) + '</b><span class="s" style="display:block">' + esc(active.detail) + '</span></div>' +
        '<div style="width:92px;flex:none;height:58px;border-radius:9px;background:linear-gradient(180deg,#9fb6d9,#2f8a4e 62%);position:relative"><span style="position:absolute;left:6px;bottom:4px;font-size:9px;font-weight:800;color:#fff">' + esc(item.viewTile) +
        '</span><span style="position:absolute;right:5px;top:4px;color:#fff">' + icon('play', 14) + '</span></div></div></div>';
    },
    // Melbourne 1: the one pub Gers offers
    pubCard: function (item) {
      return '<div class="card" style="padding:9px 11px"><div class="row" style="justify-content:space-between"><b style="font-size:12.5px">' + esc(item.name) + '</b><span class="s" style="font-size:10.5px">' + esc(item.area) + '</span></div>' +
        '<div class="s" style="font-size:10.5px;margin-top:2px">' + esc(item.detail) + '</div><div class="row" style="margin-top:6px;flex-wrap:wrap;gap:5px">' + item.pills.map(function (text) { return pill(text, 'g'); }).join('') +
        '</div><button class="btnp" style="margin-top:7px">' + esc(item.button) + '</button></div>';
    },
    // Melbourne 2: the booking
    bookingCard: function (item) {
      return '<div class="card" style="padding:0;overflow:hidden"><div style="background:#0032a0;color:#fff;padding:10px 12px"><div class="lbl" style="color:#b9c9f3">' + esc(item.label) + '</div><b style="font-size:15px">' + esc(item.title) +
        '</b></div><div style="padding:9px 12px;font-size:11.5px;line-height:1.5">' + keyValueRows(item.rows) + '</div></div>';
    },
    // Dubai 1: the plan Morag approves
    planCard: function (item) {
      var rows = item.rows.map(function (row, i) {
        var end = row.done ? '<span class="pill g">' + icon('check', 12) + '</span>' : (row.pill ? pill(row.pill, 'y') : '');
        return '<div class="li"' + (i === 0 ? ' style="border-top:0;padding-top:6px"' : '') + '><span class="num g" style="width:28px;height:28px;color:#0032a0">' + icon(row.icon, 11) + '</span><span style="flex:1"><b>' + esc(row.title) +
          '</b><span class="s">' + esc(row.detail) + '</span></span>' + end + '</div>';
      }).join('');
      return '<div class="card" style="padding:9px 12px"><div class="lbl">' + esc(item.label) + '</div>' + rows + '<button class="btnp" style="margin-top:8px">' + esc(item.button) + '</button></div>';
    },
    // Dubai 2: the invite, with who is going so far
    inviteCard: function (item) {
      return '<div class="card" style="padding:0;overflow:hidden"><div style="background:#061230;color:#fff;padding:11px 12px"><div class="lbl" style="color:#b9c9f3">' + esc(item.label) + '</div><div class="serif" style="font-size:18px;line-height:1.15;margin-top:2px">' +
        esc(item.title) + '</div><div style="font-size:11px;color:#d5dae1;margin-top:3px">' + esc(item.detail) + '</div></div><div style="padding:10px 12px"><div class="row" style="justify-content:space-between;align-items:center">' +
        stackedAvatars(item.going, 20, '#fff', 12) + '<b style="font-size:12px">' + esc(item.count) + '</b></div><div style="height:6px;border-radius:3px;background:#eef1f4;margin-top:8px;overflow:hidden"><div style="width:' + item.percent +
        '%;height:100%;background:#0032a0"></div></div><div class="s" style="font-size:10.5px;margin-top:4px">' + esc(item.note) + '</div><div class="row" style="gap:6px;margin-top:8px"><button class="btnp" style="min-height:32px;font-size:12px">' +
        icon('check', 12) + '&nbsp;' + esc(item.yes) + '</button><button class="btns" style="min-height:32px;font-size:12px;width:55%">' + esc(item.no) + '</button></div></div></div>';
    },
    // Dubai 3: the top of the party page
    partyHero: function (item) {
      return '<div class="heroP" style="background:#061230;min-height:0"><span class="lbl" style="color:#b9c9f3">' + esc(item.label) + '</span><b>' + esc(item.title) + '</b><div style="margin-top:6px">' + stackedAvatars(item.going, 24, '#061230', 13) + '</div></div>';
    },
    // Dubai 3 and 2.2: the goodie bag unlocking at 10 of 10, with its small celebration
    goodieCard: function (item) {
      var confetti = [[180, 8, '#ffd84a', 30], [214, 20, '#e11b22', 10], [240, 6, '#fff', 45], [150, 22, '#fff', 20]].map(function (bit) {
        return '<span class="confetti" style="left:' + bit[0] + 'px;top:' + bit[1] + 'px;background:' + bit[2] + ';transform:rotate(' + bit[3] + 'deg)"></span>';
      }).join('');
      return '<div class="card goodie" style="padding:0;overflow:hidden;border:2px solid #ffd84a"><div style="background:#0032a0;color:#fff;padding:11px 12px;position:relative">' + confetti + '<div class="lbl" style="color:#ffd84a">' + esc(item.label) +
        '</div><b style="font-size:15px">' + esc(item.title) + '</b></div><div style="padding:9px 12px;font-size:11.5px"><span class="s">' + esc(item.lead) + '</span><div class="row" style="flex-wrap:wrap;gap:5px;margin-top:6px">' +
        item.pills.map(function (text) { return '<span class="pill">' + esc(text) + '</span>'; }).join('') + '</div></div></div>';
    },
    // Dubai 3: what Gers has set up for the host
    setupCard: function (item) {
      var rows = item.rows.map(function (row, i) {
        var badge = row.done ? '<span class="num g" style="width:28px;height:28px;background:#e6f4ec;color:#0b6b47">' + icon('check', 12) + '</span>' : '<span class="num g" style="width:28px;height:28px;color:#0032a0">' + icon(row.icon, 11) + '</span>';
        return '<div class="li"' + (i === 0 ? ' style="border-top:0;padding-top:6px"' : '') + '>' + badge + '<span><b>' + esc(row.title) + '</b><span class="s">' + esc(row.detail) + '</span></span></div>';
      }).join('');
      return '<div class="card"><div class="lbl">' + esc(item.label) + '</div>' + rows + '</div>';
    },
    // Dubai 4: the food order Morag approves
    foodCard: function (item) {
      var lines = item.lines.map(function (line, i) {
        return '<div class="row" style="justify-content:space-between;font-size:11px;padding:2px 0;' + (i === 0 ? 'margin-top:6px' : 'border-top:1px solid #eef1f4') + '"><span>' + esc(line.name) + ' <span class="s">' + esc(line.qty) + '</span></span><b>' + esc(line.price) + '</b></div>';
      }).join('');
      return '<div class="card" style="padding:9px 12px"><div class="lbl">' + esc(item.label) + '</div><b style="font-size:12.5px">' + esc(item.shop) + '</b>' + lines +
        '<div class="row" style="justify-content:space-between;font-size:11.5px;padding-top:4px;border-top:1px solid #d5dae1;margin-top:2px"><b>' + esc(item.total) + '</b><b>' + esc(item.slot) + '</b></div>' +
        '<button class="btnp" style="margin-top:7px;min-height:30px;font-size:12px">' + esc(item.button) + '</button></div>';
    },
    // 2.2: the draft matchday plan for Ibrox Two
    planList: function (item) {
      var rows = item.rows.map(function (row, i) {
        return '<div class="li"' + (i === 0 ? ' style="border-top:0;padding-top:6px"' : '') + '><span class="num g">' + esc(row.time) + '</span><span><b>' + esc(row.title) + '</b><span class="s">' + esc(row.detail) + '</span></span></div>';
      }).join('');
      return '<div class="card" style="padding:9px 12px"><div class="lbl">' + esc(item.label) + '</div>' + rows + '</div>';
    },
    // 2.2: the table is still confirmed
    confirmCard: function (item) {
      return '<div class="card" style="padding:9px 12px"><div class="row" style="justify-content:space-between"><span><b style="font-size:12.5px">' + esc(item.title) + '</b><span class="s" style="display:block;font-size:11px">' + esc(item.detail) +
        '</span></span><span class="pill g">' + icon('check', 12) + ' ' + esc(item.pill) + '</span></div></div>';
    }
  };

  Object.keys(cards).forEach(function (type) { R.items[type] = cards[type]; });
})();
