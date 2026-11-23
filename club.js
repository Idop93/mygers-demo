/* MyGers demo: the club view (overview, fans, one fan's profile, act on it).
   Draws from STORY.club (story-club.js) and adds up what the story itself produces from
   story.js. Holds no copy and no figures of its own. Adds RENDER.club. */
(function () {
  'use strict';

  var STORY = window.STORY;
  var R = window.RENDER;
  var esc = R.esc;
  var CLUB = STORY.club;
  var UI = CLUB.ui;

  var MINUTES_IN_HOUR = 60;
  var PERCENT = 100;
  var CHART_HEIGHT = 84;    // the daily bars, in pixels at full height
  // The network picture: the fan in the middle, close groups on the inner ring, the rest on the outer one.
  var NETWORK = { width: 400, height: 372, centreX: 200, centreY: 186, centre: 27, innerRing: 92, outerRing: 160,
    node: 13, strongNode: 16, innerMost: 3, groupGap: 1.5, startDegrees: 90, fullTurn: 360 };
  var SPLIT_SHADES = ['#0032a0', '#6f8fe0', '#c9d6fb'];   // the parts of a split bar, largest first

  /* ---------- small helpers ---------- */

  var fanIds = Object.keys(STORY.fans);
  function sum(numbers) { return numbers.reduce(function (total, n) { return total + n; }, 0); }
  function median(numbers) {
    var sorted = numbers.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
  function duration(minutes) {
    var hours = Math.floor(minutes / MINUTES_IN_HOUR);
    var rest = Math.round(minutes % MINUTES_IN_HOUR);
    return hours ? hours + ' h ' + rest + ' min' : rest + ' min';
  }
  function share(part, whole) { return Math.round(part / whole * PERCENT) + '%'; }
  function countBy(read) {
    var counts = {};
    fanIds.forEach(function (id) { var key = read(id); if (key) counts[key] = (counts[key] || 0) + 1; });
    return counts;
  }
  function activeDays(id) { return CLUB.usage[id].days.split('1').length - 1; }
  function quantityOf(what) {
    return sum(STORY.purchases.filter(function (purchase) { return purchase.what === what; }).map(function (purchase) { return purchase.quantity; }));
  }
  function avatar(person, size) {
    return '<span class="cv-av" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.38) + 'px;background:' + person.bg + ';color:' + person.fg + '">' + esc(person.initials) + '</span>';
  }

  /* ---------- building blocks, as in the Learn the Game admin ---------- */

  function statCard(label, value) {
    return '<div class="cv-stat"><div class="cv-lbl">' + esc(label) + '</div><div class="cv-val">' + esc(value) + '</div></div>';
  }
  function section(title, aside, body, extraClass) {
    return '<section class="cv-card ' + (extraClass || '') + '"><div class="cv-cardh"><h2>' + esc(title) + '</h2>' + (aside ? '<span>' + esc(aside) + '</span>' : '') + '</div>' + body + '</section>';
  }
  // Rows of label, bar and figure. `rows` is a list of [label, number]; `unit` follows the number.
  function barRows(rows, whole, unit) {
    return '<div class="cv-bars">' + rows.map(function (row) {
      return '<div class="cv-bar"><span>' + esc(row[0]) + '</span><i><b style="width:' + (row[1] / whole * PERCENT) + '%"></b></i><em>' + row[1] + (unit || '') + '</em></div>';
    }).join('') + '</div>';
  }
  function dayBoxes(id) {
    return '<span class="cv-days">' + CLUB.usage[id].days.split('').map(function (on) { return '<i class="' + (on === '1' ? 'on' : '') + '"></i>'; }).join('') + '</span>';
  }

  /* ---------- screen 1: overview ---------- */

  // One viewing choice, as a single bar split into its options.
  function splitBar(group) {
    var bar = group.parts.map(function (part, i) { return '<b style="width:' + part[1] + '%;background:' + SPLIT_SHADES[i] + '"></b>'; }).join('');
    var key = group.parts.map(function (part, i) { return '<span><i style="background:' + SPLIT_SHADES[i] + '"></i>' + esc(part[0]) + ' <em>' + part[1] + '%</em></span>'; }).join('');
    return '<div class="cv-split"><div class="cv-sub">' + esc(group.label) + '</div><div class="bar">' + bar + '</div><div class="key">' + key + '</div></div>';
  }

  function overview() {
    var copy = CLUB.overview;
    var usage = fanIds.map(function (id) { return CLUB.usage[id]; });
    var visits = usage.map(function (use) { return use.visits; });
    var activeThisWeek = fanIds.filter(function (id) { return activeDays(id) > 0; }).length;
    var gapDays = (CLUB.periodDays / median(visits)).toFixed(1);
    var cards = '<div class="cv-stats">' +
      statCard(copy.cards.members, fanIds.length) +
      statCard(copy.cards.active, activeThisWeek + ' ' + UI.of + ' ' + fanIds.length) +
      statCard(copy.cards.visits, sum(visits)) +
      statCard(copy.cards.time, duration(median(usage.map(function (use) { return use.minutes; })))) +
      statCard(copy.cards.gap, gapDays + ' days') +
      statCard(copy.cards.asks, sum(usage.map(function (use) { return use.asks; }))) + '</div>';

    var perDay = CLUB.days.map(function (day, i) { return fanIds.filter(function (id) { return CLUB.usage[id].days[i] === '1'; }).length; });
    var chart = '<div class="cv-chart">' + perDay.map(function (count, i) {
      return '<div class="cv-col"><em>' + count + '</em><i style="height:' + Math.round(count / fanIds.length * CHART_HEIGHT) + 'px"></i><span>' + esc(CLUB.days[i]) + '</span></div>';
    }).join('') + '</div>';

    var fromStory = { viewers: STORY.viewing.viewers, pubCover: quantityOf('pubCover'), seat: quantityOf('seat') };
    var featureRows = CLUB.features.map(function (feature) { return [feature.label, feature.from ? fromStory[feature.from] : feature.members]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    var features = '<table class="cv-table tight"><thead><tr><th>' + esc(copy.features.columns[0]) + '</th><th class="n">' + esc(copy.features.columns[1]) + '</th><th class="n">' + esc(copy.features.columns[2]) + '</th></tr></thead><tbody>' +
      featureRows.map(function (row) { return '<tr><td>' + esc(row[0]) + '</td><td class="n">' + row[1] + '</td><td class="n">' + share(row[1], fanIds.length) + '</td></tr>'; }).join('') + '</tbody></table>';

    var interests = countBy(function (id) { return STORY.fans[id].interest; });
    var interestRows = Object.keys(interests).map(function (key) { return [key, interests[key]]; }).sort(function (a, b) { return b[1] - a[1]; });
    var largestShare = Math.max.apply(null, copy.watch.rows.map(function (row) { return row[1]; }));
    var tv = '<div class="cv-tvstats">' + copy.tv.stats.map(function (stat) { return '<div><b>' + esc(stat[0]) + '</b><span>' + esc(stat[1]) + '</span></div>'; }).join('') + '</div>' +
      '<div class="cv-splits">' + copy.tv.groups.map(splitBar).join('') + '</div>';

    return '<h1>' + esc(copy.title) + '</h1>' + cards +
      '<div class="cv-row two">' + section(copy.daily.title, copy.daily.aside, chart) + section(copy.features.title, copy.features.aside, features) + '</div>' +
      '<div class="cv-row three">' + section(copy.interests.title, copy.interests.aside, barRows(interestRows, fanIds.length)) +
        section(copy.watch.title, copy.watch.aside, barRows(copy.watch.rows, largestShare, '%'), 'wide') +
        section(copy.tv.title, copy.tv.aside, tv) + '</div>';
  }

  /* ---------- screen 2: the fans ---------- */

  function fansTable() {
    var copy = CLUB.fansPage;
    var columns = copy.columns;
    var head = '<tr><th>' + esc(columns.fan) + '</th><th>' + esc(columns.city) + '</th><th>' + esc(columns.watched) + '</th><th>' + esc(columns.interest) + '</th><th>' + esc(columns.legend) +
      '</th><th>' + esc(columns.days) + '</th><th class="n">' + esc(columns.visits) + '</th><th class="n">' + esc(columns.time) + '</th><th class="n">' + esc(columns.asks) + '</th><th>' + esc(columns.stood) + '</th></tr>';
    var rows = fanIds.map(function (id) {
      var fan = STORY.fans[id];
      var use = CLUB.usage[id];
      return '<tr class="pick" data-action="tab" data-key="clubFan" data-value="' + id + '"><td><span class="cv-who">' + avatar(fan, 26) + '<b>' + esc(fan.name) + '</b><small>' + fan.age + '</small></span></td>' +
        '<td>' + esc(fan.place) + '</td><td>' + esc(CLUB.watched[fan.place]) + '</td><td>' + esc(fan.interest) + '</td><td>' + esc(STORY.legends[fan.legend].name) + '</td>' +
        '<td>' + dayBoxes(id) + '</td><td class="n">' + use.visits + '</td><td class="n">' + duration(use.minutes) + '</td><td class="n">' + use.asks + '</td><td class="soft">' + esc(use.stood) + '</td></tr>';
    }).join('');
    return '<div class="cv-head"><h1>' + esc(copy.title) + '</h1><span>' + esc(copy.aside) + '</span></div>' +
      '<section class="cv-card flush"><table class="cv-table fans"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></section>';
  }

  /* ---------- screen 3: one fan ---------- */

  // The profile every fan gets from the story alone, for those without a written one.
  function profileFromStory(id) {
    var fan = STORY.fans[id];
    var use = CLUB.usage[id];
    var rows = CLUB.profilePage.rows;
    var names = fanIds.filter(function (other) { return other !== id && STORY.fans[other].place === fan.place; }).map(function (other) { return STORY.fans[other].name; });
    var withWho = names.length > 3 ? names.slice(0, 2).join(', ') + ' and ' + (names.length - 2) + ' more' : names.join(', ');
    var facts = [
      { label: rows.watched, weeks: CLUB.watched[fan.place] + ', ' + fan.place },
      { label: rows.withWho, weeks: withWho },
      { label: rows.interest, weeks: fan.interest },
      { label: rows.legend, weeks: STORY.legends[fan.legend].name },
      { label: rows.stood, weeks: use.stood }
    ];
    if (use.tv) facts.splice(4, 0, { label: rows.tv, weeks: CLUB.overview.cameras[use.tv.camera] + ' camera · ' + CLUB.overview.commentaries[use.tv.commentary].toLowerCase() });
    return {
      usage: { weeks: { visits: String(use.visits), time: duration(use.minutes), asks: String(use.asks), days: activeDays(id) + ' ' + UI.of + ' ' + CLUB.days.length } },
      facts: facts,
      activity: [{ items: CLUB.groupActivity[fan.place] }]
    };
  }

  function adds(profile, span) {
    var tiles = profile.facts.map(function (fact) {
      var value = fact[span] || (span === 'seasons' ? fact.weeks : null);
      return '<div class="cv-fact' + (value ? '' : ' empty') + '"><div class="cv-lbl">' + esc(fact.label) + '</div><div class="v">' + esc(value || UI.notYet) + '</div></div>';
    }).join('');
    return '<div class="cv-adds"><div class="cv-kick blue">' + esc(CLUB.profilePage.adds.title) + '</div><div class="cv-facts">' + tiles + '</div></div>';
  }

  function activity(profile, span) {
    var copy = CLUB.profilePage.activity;
    var body = profile.activity.filter(function (block) { return span === 'seasons' || !block.later; }).map(function (block) {
      return (block.season ? '<div class="cv-season">' + esc(block.season) + '</div>' : '') + block.items.map(function (item) {
        return '<div class="cv-act"><span class="when">' + esc(item[0]) + '</span><span class="time">' + esc(item[1]) + '</span><span class="tag">' + esc(item[2]) + '</span><span>' + esc(item[3]) + '</span></div>';
      }).join('');
    }).join('');
    return section(copy.title, copy.aside, '<div class="cv-acts">' + body + '</div>');
  }

  // Everyone the club can link to a fan: the story's own links (the fan's chat, the rest of
  // Ibrox Lot), then the wider network from story-club.js. `key` is each person's place in the
  // full list, so it stays the same in both views of a written profile.
  function networkPeople(id, span) {
    var fan = STORY.fans[id];
    var written = CLUB.profiles[id];
    var ties = (written && written.ties) || {};
    var fromStory = fanIds.filter(function (other) { return other !== id; }).map(function (other) {
      var friend = STORY.fans[other];
      var together = friend.place === fan.place;
      var link = together ? CLUB.journeys[fan.place] : CLUB.lot;
      return Object.assign({ name: friend.name, initials: friend.initials, place: friend.place, group: together ? 'journey' : 'lot' + friend.place, tie: link.tie, from: link.from }, ties[other]);
    });
    return fromStory.concat(CLUB.networks[id] || []).map(function (person, key) { return Object.assign({ key: key }, person); })
      .filter(function (person) { return span === 'seasons' || !person.later; });
  }
  function headCount(people) { return sum(people.map(function (person) { return person.count || 1; })); }

  // Places every person round the fan: each group gets a share of the circle in proportion to its size.
  function placeNetwork(people) {
    var groups = Object.keys(CLUB.networkGroups).map(function (groupId) {
      return { id: groupId, members: people.filter(function (person) { return person.group === groupId; }) };
    }).filter(function (group) { return group.members.length; });
    var weights = sum(groups.map(function (group) { return group.members.length + NETWORK.groupGap; }));
    var turned = 0;
    var placed = [];
    groups.forEach(function (group) {
      var arc = NETWORK.fullTurn * (group.members.length + NETWORK.groupGap) / weights;
      var isInner = CLUB.networkGroups[group.id].inner && group.members.length <= NETWORK.innerMost;
      var ring = isInner ? NETWORK.innerRing : NETWORK.outerRing;
      group.members.forEach(function (person, i) {
        var degrees = NETWORK.startDegrees - turned - arc * (i + 0.5) / group.members.length;   // clockwise from the top
        var angle = degrees * Math.PI / 180;
        placed.push({ person: person, x: NETWORK.centreX + ring * Math.cos(angle), y: NETWORK.centreY - ring * Math.sin(angle) });
      });
      turned += arc;
    });
    return { groups: groups, placed: placed };
  }

  function groupLabel(groupId, fan) { return groupId === 'journey' ? CLUB.journeys[fan.place].label : CLUB.networkGroups[groupId].label; }

  // The fan in the middle and everyone round them. Each person is a button: a click shows where the connection comes from.
  function networkPicture(id, fan, people, chosen) {
    var layout = placeNetwork(people);
    var lines = '';
    var nodes = '';
    layout.placed.forEach(function (spot) {
      var person = spot.person;
      var color = CLUB.networkGroups[person.group].color;
      var radius = person.strong ? NETWORK.strongNode : NETWORK.node;
      lines += '<line x1="' + NETWORK.centreX + '" y1="' + NETWORK.centreY + '" x2="' + spot.x.toFixed(1) + '" y2="' + spot.y.toFixed(1) + '" stroke="' + color + '" stroke-width="' + (person.strong ? 2.5 : 1) + '" opacity="' + (person.strong || person.key === chosen.key ? 0.75 : 0.35) + '"></line>';
      nodes += '<button class="cv-node' + (person.key === chosen.key ? ' on' : '') + '" data-action="tab" data-key="clubPerson" data-value="' + id + ':' + person.key + '" title="' + esc(person.name) + '" ' +
        'style="left:' + (spot.x - radius).toFixed(1) + 'px;top:' + (spot.y - radius).toFixed(1) + 'px;width:' + (radius * 2) + 'px;height:' + (radius * 2) + 'px;color:' + color + '">' + esc(person.count ? '×' + person.count : person.initials) + '</button>';
    });
    var legend = layout.groups.map(function (group) {
      return '<span><i style="background:' + CLUB.networkGroups[group.id].color + '"></i>' + esc(groupLabel(group.id, fan)) + ' · ' + headCount(group.members) + '</span>';
    }).join('');
    return '<div class="cv-net"><div class="cv-graph" style="width:' + NETWORK.width + 'px;height:' + NETWORK.height + 'px"><svg viewBox="0 0 ' + NETWORK.width + ' ' + NETWORK.height + '" width="' + NETWORK.width + '" height="' + NETWORK.height + '">' + lines + '</svg>' + nodes +
      '<span class="cv-me" style="left:' + (NETWORK.centreX - NETWORK.centre) + 'px;top:' + (NETWORK.centreY - NETWORK.centre) + 'px;width:' + (NETWORK.centre * 2) + 'px;height:' + (NETWORK.centre * 2) + 'px;background:' + fan.bg + ';color:' + fan.fg + '">' + esc(fan.initials) + '</span></div>' +
      '<div class="cv-legend">' + legend + '</div></div>';
  }

  function network(id, span, local) {
    var copy = CLUB.profilePage.network;
    var fan = STORY.fans[id];
    var people = networkPeople(id, span);
    // the person picked on this profile, or to begin with the closest tie
    var picked = String(local.clubPerson || '').split(':');
    var chosen = people.filter(function (person) { return picked[0] === id && String(person.key) === picked[1]; })[0] ||
      people.filter(function (person) { return person.strong; })[0] || people.filter(function (person) { return person.group === 'journey'; })[0] || people[0];
    function flagged(flag) { return headCount(people.filter(function (person) { return person[flag]; })); }
    var places = {};
    people.concat([fan]).forEach(function (person) { places[person.place || fan.place] = true; });
    var totals = [[headCount(people), copy.summary.people], [flagged('holder'), copy.summary.holders], [flagged('invited'), copy.summary.invited], [Object.keys(places).length, copy.summary.countries]];
    var summary = '<div class="cv-netsum">' + totals.map(function (pair) { return '<div><b>' + pair[0] + '</b><span>' + esc(pair[1]) + '</span></div>'; }).join('') + '</div>';
    var color = CLUB.networkGroups[chosen.group].color;
    var note = chosen.note && (chosen.note[span] || chosen.note.weeks);
    var detail = '<div class="cv-link" style="border-color:' + color + '"><div class="who"><span class="cv-dot" style="background:' + color + '"></span><b>' + esc(chosen.name) + '</b><span>' + esc(chosen.tie) + '</span><em>' + esc(groupLabel(chosen.group, fan)) + '</em></div>' +
      '<div class="cv-lbl">' + esc(copy.from) + '</div><div class="v">' + esc(chosen.from) + '</div>' +
      (note ? '<div class="cv-lbl">' + esc(copy.sees) + '</div><div class="v">' + esc(note) + '</div>' : '') + '</div>';
    return section(copy.title, copy.aside, summary + networkPicture(id, fan, people, chosen) + detail);
  }

  function fanProfile(id, span, backAction, local) {
    var fan = STORY.fans[id];
    var written = CLUB.profiles[id];
    var profile = written || profileFromStory(id);
    if (!written) span = 'weeks';
    var use = profile.usage[span];
    var usageCopy = CLUB.profilePage.usage;
    var spans = written ? '<div class="cv-spans">' + Object.keys(UI.spans).map(function (key) {
      return '<button class="' + (key === span ? 'on' : '') + '" data-action="tab" data-key="clubSpan" data-value="' + key + '">' + esc(UI.spans[key]) + '</button>';
    }).join('') + '</div>' : '';
    var meta = [fan.age, fan.place, written ? written.since : null, written ? written.asOf[span] : null].filter(Boolean).join(' · ');
    return '<button class="cv-back" ' + backAction + '>‹ ' + esc(UI.allFans) + '</button>' +
      '<div class="cv-head profile">' + avatar(fan, 52) + '<div><h1>' + esc(fan.name) + '</h1><span>' + esc(meta) + '</span></div>' + spans + '</div>' +
      '<div class="cv-stats four">' + Object.keys(usageCopy).map(function (key) { return statCard(usageCopy[key], use[key]); }).join('') + '</div>' +
      adds(profile, span) +
      '<div class="cv-row profile">' + activity(profile, span) + network(id, span, local) + '</div>';
  }

  /* ---------- screen 4: act on it ---------- */

  var ACT_PHONE_SCALE = 0.84;   // the phone on the page, against the boards' 300 x 620 phone
  var PHONE = { width: 300, height: 620 };

  // compact: inside the phone, a level is its name and price only
  function tierRows(offer, compact) {
    return offer.tiers.map(function (tier) {
      return '<div class="cv-tier' + (compact ? ' compact' : '') + '"><div><b>' + esc(tier.name) + '</b>' + (compact ? '' : '<span>' + esc(tier.text) + '</span>') + '</div><em>' + esc(offer.currency) + tier.price + '<small>' + esc(offer.per) + '</small></em></div>';
    }).join('');
  }
  function legendHead(offer) {
    var legend = STORY.legends[offer.legend];
    return '<div class="cv-legendhead"><img src="' + legend.face + '" alt=""><div><span>' + esc(offer.kicker) + '</span><b>' + esc(legend.name) + '</b></div></div>';
  }
  // The offer as it arrives in the fan's chat with Gers: the same three levels, from the same data.
  R.items.offerCard = function (item) {
    var offer = CLUB.act.offer;
    return '<div class="card cv-offercard">' + legendHead(offer) + tierRows(offer, true) + '<div class="places">' + esc(item.note) + '</div><button class="btnp">' + esc(item.button) + '</button></div>';
  };

  // step: how many of the four parts are filled in so far (0 = the signal only).
  function actPage(step, local) {
    var act = CLUB.act;
    var fan = STORY.fans[act.fan];
    function part(index, title, aside, body, extraClass) { return section(title, aside, body, (extraClass || '') + (step < index ? ' wait' : '')); }

    var signal = '<div class="cv-who big">' + avatar(fan, 34) + '<b>' + esc(fan.name) + '</b><small>' + fan.age + ' · ' + esc(fan.place) + '</small></div>' +
      '<div class="cv-kv">' + act.signal.rows.map(function (row) { return '<div><span>' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>'; }).join('') + '</div>';

    var offer = legendHead(act.offer) + '<div class="cv-guests">' + esc(act.offer.guests) + '</div>' + tierRows(act.offer);

    var channel = act.send.channels.filter(function (one) { return one.id === local.clubChannel; })[0] || act.send.channels[0];
    var send = '<div class="cv-channels">' + act.send.channels.map(function (one) {
      return '<button class="' + (one === channel ? 'on' : '') + '" data-action="tab" data-key="clubChannel" data-value="' + one.id + '">' + esc(one.label) + '</button>';
    }).join('') + '</div>' + (channel.text ? '<div class="cv-how">' + esc(channel.text) + '</div>'
        : '<div class="cv-kv boxed">' + channel.lines.map(function (line) { return '<div><span>' + esc(line[0]) + '</span><b>' + esc(line[1]) + '</b></div>'; }).join('') + '</div>') +
      '<div class="cv-sub">' + esc(act.send.more.title) + '</div><div class="cv-rules">' + act.send.more.rows.map(function (row) { return '<div><span>' + esc(row[0]) + '</span><i>→</i><b>' + esc(row[1]) + '</b></div>'; }).join('') + '</div>';

    var entries = act.phone.items.map(function (item) { return { item: item, fresh: false }; });
    var phone = '<div class="cv-phone' + (step < 3 ? ' wait' : '') + '"><div class="cv-phonetitle">' + esc(act.phone.title) + '</div>' +
      '<div class="cv-phonebox" style="width:' + PHONE.width * ACT_PHONE_SCALE + 'px;height:' + PHONE.height * ACT_PHONE_SCALE + 'px"><div style="transform:scale(' + ACT_PHONE_SCALE + ')">' + R.phone(act.phone.thread, entries, act.fan, {}).replace(/ data-action="profile"/g, '') + '</div></div></div>';   // no member pop-ups here: this phone is a picture inside the page

    return '<h1>' + esc(act.title) + '</h1><div class="cv-row act">' + part(0, act.signal.title, act.signal.aside, signal) + part(1, act.offer.title, act.offer.aside, offer) + part(2, act.send.title, act.send.aside, send) + phone + '</div>';
  }

  /* ---------- the frame: top bar, menu, page ---------- */

  function menu(active, fanName) {
    function item(key, scene) {
      return '<button class="' + (active === key ? 'on' : '') + '" data-action="goto" data-scene="' + scene + '">' + esc(UI.menu[key]) + '</button>';
    }
    return '<nav class="cv-menu">' + item('overview', 'club') + item('fans', 'clubFans') + (fanName ? '<button class="sub on">' + esc(fanName) + '</button>' : '') + item('act', 'clubAct') + '</nav>';
  }

  // scene: the club scene on screen. step: how far into it. local: what was tapped on this screen.
  R.club = function (scene, step, local) {
    var page;
    var fanId = scene.club === 'fan' ? scene.fan : (scene.club === 'fans' ? local.clubFan : null);
    if (fanId) {
      var span = local.clubSpan || (scene.spans ? scene.spans[step] : 'weeks');
      var back = scene.club === 'fan' ? 'data-action="goto" data-scene="clubFans"' : 'data-action="tab" data-key="clubFan" data-value=""';
      page = fanProfile(fanId, span, back, local);
    } else {
      page = scene.club === 'fans' ? fansTable() : scene.club === 'act' ? actPage(step, local) : overview();
    }
    return '<div class="cv"><header class="cv-top"><img src="' + STORY.crests.rangers.file + '" alt=""><b>' + esc(UI.product) + '</b><span class="cv-pill">' + esc(UI.badge) + '</span></header>' +
      '<div class="cv-body">' + menu(fanId ? null : scene.club, fanId ? STORY.fans[fanId].name : null) + '<main class="cv-main">' + page + '</main></div></div>';
  };
})();
