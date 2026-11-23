/* MyGers demo: turns story items into the boards' markup.
   Nothing here holds copy or figures; every word comes from story.js.
   The markup and inline sizes are the design canvas's own, so screens match the boards. */
(function () {
  'use strict';

  var STORY = window.STORY;
  var CHAT_TAIL = 16;   // a chat only ever shows its newest lines; older ones are off the top

  var ICONS = {
    ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"></path><path d="M14 6v12" stroke-dasharray="2 2.5"></path>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle>',
    bars: '<path d="M5 20V11M12 20V5M19 20v-7"></path>',
    shirt: '<path d="M8 3l-5 3 2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"></path>',
    doc: '<path d="M14 3H6v18h12V7z"></path><path d="M14 3v4h4"></path><circle cx="11" cy="13" r=".6" fill="currentColor"></circle>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"></path><path d="M4 19V5"></path><path d="M9 7h6"></path>',
    arrow: '<path d="M4 12h15M14 6l6 6-6 6"></path>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"></path>',
    back: '<path d="M15 5l-7 7 7 7"></path>',
    globe: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"></path>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"></ellipse><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"></path>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle>',
    people: '<circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"></path><circle cx="17" cy="9" r="2.4"></circle><path d="M16 14.2c2.9.4 5 2.8 5 5.8"></path>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path>',
    clock: '<circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2.5 2.5M9 2h6"></path>',
    menu: '<path d="M5 8h14M5 16h14"></path>',
    news: '<path d="M5 4h11l3 3v13H5z"></path><path d="M8 9h8M8 13h8M8 17h5"></path>',
    fixtures: '<circle cx="12" cy="12" r="8"></circle><path d="M12 4v16M4 12h16"></path>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"></rect><path d="M8 21h8"></path>',
    shop: '<path d="M5 8h14l-1 12H6z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"></rect><path d="M3 10h18M7 15h4"></path>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M4 10h16M9 3v4M15 3v4"></path>',
    search: '<circle cx="11" cy="11" r="6"></circle><path d="M20 20l-4.5-4.5"></path>',
    pinx: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"></path><path d="M8 6l8 8M16 6l-8 8"></path>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"></path><path d="M3 7l9 4 9-4M12 11v10"></path>',
    music: '<path d="M9 18V5l11-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="16" r="3"></circle>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path>',
    play: '<circle cx="12" cy="12" r="9"></circle><path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor"></path>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2"></rect><circle cx="12" cy="13.5" r="3.5"></circle><path d="M8 7l2-3h4l2 3"></path>',
    passport: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 8h6M9 12h6M9 16h3"></path>',
    x: '<path d="M6 6l12 12M18 6L6 18"></path>'
  };

  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function icon(name, size) {
    if (!ICONS[name]) throw new Error('Unknown icon: ' + name);
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }
  function gersMark(size) {
    return '<span class="mg" style="width:' + size + 'px;height:' + size + 'px" aria-hidden="true"></span>';
  }
  function fan(id) {
    if (!STORY.fans[id]) throw new Error('Unknown fan: ' + id);
    return STORY.fans[id];
  }
  function crest(id, size) {
    var club = STORY.crests[id];
    if (!club) throw new Error('Unknown crest: ' + id);
    return '<span role="img" aria-label="' + esc(club.name) + ' crest" style="width:' + size + 'px;height:' + size + 'px;border-radius:' + size / 2 +
      'px;background:#fff url(' + club.file + ') center/80% no-repeat;flex:none;display:inline-block"></span>';
  }
  // Wherever a match is shown, both crests sit side by side.
  function crestPair(ids, size, gap, vStyle) {
    return '<span style="display:inline-flex;align-items:center;gap:' + gap + 'px;flex:none">' + crest(ids[0], size) + '<span style="' + vStyle + '">v</span>' + crest(ids[1], size) + '</span>';
  }
  function avatar(id, size) {
    return '<div class="av" style="background:' + fan(id).bg + ';color:' + fan(id).fg + ';width:' + size + 'px;height:' + size + 'px;border-radius:' + size / 2 + 'px;font-size:' + Math.round(size * 3.9) / 10 + 'px">' + fan(id).initials + '</div>';
  }
  function pill(text, tone) { return '<span class="pill ' + tone + '">' + esc(text) + '</span>'; }

  /* ---------- items inside a phone ---------- */

  var drawItem = {
    day: function (item) { return '<div class="day">' + esc(item.text) + '</div>'; },
    sys: function (item) { return '<div class="sys">' + esc(item.text) + '</div>'; },
    msg: function (item, owner) {
      var tag = item.tag ? '<b class="at">' + esc(STORY.ui.gersTag) + '</b> ' : '';
      if (item.from === owner) return '<div class="msg me">' + tag + esc(item.text) + '</div>';
      var from = fan(item.from);
      return '<div class="msg"><span class="who" data-action="profile" data-fan="' + esc(item.from) + '" style="color:' + from.fg + '">' + esc(from.name) + '</span>' + tag + esc(item.text) + '</div>';
    },
    gers: function (item, owner, typing) {
      var body = typing ? '<span class="dots"><i></i><i></i><i></i></span>' : esc(item.text);
      return '<div class="msg ai"' + (item.small ? ' style="font-size:11px"' : '') + (typing ? ' data-typing="' + esc(item.text) + '"' : '') +
        '><span class="who">' + gersMark(16) + esc(STORY.ui.gers) + '</span><span class="body">' + body + '</span></div>';
    },
    // 1.2 the next-match card on MyGers home, with the Matchday countdown button
    nextMatch: function (item) {
      return '<div class="heroC" style="background:#061230"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
        '<span style="letter-spacing:.1em;text-transform:uppercase;font-weight:800">' + esc(item.kicker) + '</span>' +
        crestPair(item.crests, 28, 5, 'font-size:10px;font-weight:800;color:rgba(255,255,255,.7)') + '</div><b>' + esc(item.title) + '</b><span>' + esc(item.detail) + '</span>' +
        '<button class="cdbtn" data-action="goto" data-scene="' + esc(item.button.scene) + '" aria-label="' + esc(item.button.label) + '">' + icon('clock', 13) + esc(item.button.text) + '</button></div>';
    },
    chatList: function (item) {
      var rows = item.chats.map(function (chat, i) {
        return '<div class="li"' + (i === 0 ? ' style="border-top:0;padding-top:4px;position:relative"' : '') + '><div class="num" style="background:' + chat.color + '">' + esc(chat.initials) +
          '</div><span style="flex:1"><b>' + esc(chat.name) + '</b><span class="s">' + esc(chat.last) + '</span></span>' +
          (chat.unread ? '<span class="pill b" style="height:20px;padding:0 7px">' + esc(chat.unread) + '</span>' : '') + '</div>';
      }).join('');
      return '<div class="card" style="padding:4px 12px"><div class="lbl" style="padding:8px 0 4px">' + esc(item.label) + '</div>' + rows + '</div>';
    },
    tagGers: function (item) {
      return '<div class="card" style="display:flex;gap:10px;align-items:center;padding:10px 12px">' + gersMark(30) + '<b style="font-size:13px">' + esc(item.text) + '</b></div>';
    },
    membership: function (item) {
      return '<div class="card"><div class="row" style="justify-content:space-between"><div><div class="lbl">' + esc(item.label) + '</div><b style="font-size:13px">' + esc(item.name) + '</b></div>' + pill(item.status, 'g') + '</div></div>';
    },
    // 1.4 the honest picture: where tickets stand today
    statusCard: function (item) {
      var rows = item.rows.map(function (row) { return '<span>' + esc(row.text) + '</span>' + pill(row.pill, row.tone); }).join('');
      return '<div class="card" style="padding:10px 12px"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div class="lbl">' + esc(item.label) + '</div>' +
        crestPair(item.crests, 22, 4, 'font-size:9px;font-weight:800;color:#5b6577') + '</div><div class="statr" style="grid-template-columns:1fr auto;margin-top:7px;gap:6px 10px">' + rows + '</div></div>';
    },
    // 1.5 the season ticket holders in the fans' network
    networkCard: function (item) {
      var people = item.people.map(function (person, i) {
        return '<div class="li"' + (i === 0 ? ' style="border-top:0;padding-top:6px"' : '') + '><span class="num" style="width:28px;height:28px;font-size:10px">' + esc(person.initials) +
          '</span><span style="flex:1"><b>' + esc(person.name) + '</b><span class="s">' + esc(person.detail) + '</span></span></div>';
      }).join('');
      return '<div class="card" style="padding:9px 12px"><div class="lbl">' + esc(item.label) + '</div>' + people + '</div>';
    },
    // 1.5 the message Gers drafts; approvals appear on it as the fans say yes
    draftCard: function (item) {
      var approvals = item.approvals.map(function (text) { return '<span class="pill g">' + icon('check', 12) + ' ' + esc(text) + '</span>'; }).join('');
      return '<div class="card" style="padding:10px 12px"><div class="lbl">' + esc(item.label) + '</div>' +
        '<div style="font-size:11.5px;line-height:1.42;background:#f6f7f9;border-radius:10px;padding:8px 10px;margin-top:6px">' + esc(item.text) + '</div>' +
        (approvals ? '<div class="row" style="margin-top:8px;flex-wrap:wrap;gap:6px">' + approvals + '</div>' : '') + '</div>';
    }
  };

  // `local` holds what the presenter has tapped on this screen, such as the chosen map tab.
  function itemHtml(entry, owner, local) {
    var draw = drawItem[entry.item.type];
    if (!draw) throw new Error('Unknown item type: ' + entry.item.type);
    var html = draw(entry.item, owner, entry.fresh && entry.item.type === 'gers', local);
    return entry.fresh ? html.replace('class="', 'class="enter ') : html;
  }

  /* ---------- the phone ---------- */

  // 1.1 the mock of today's RangersFC.com
  function siteHtml(thread) {
    var rows = thread.menu.map(function (entry) {
      return '<div style="display:flex;align-items:center;gap:16px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.14)"><span style="color:#fff;opacity:.9">' + icon(entry.icon, 18) +
        '</span><span class="serif sitemenu" style="font-size:22px;color:#fff">' + esc(entry.text) + '</span></div>';
    }).join('');
    return '<div class="phone"><div style="flex:1;background:#1d2f94;display:flex;flex-direction:column;position:relative"><div style="display:flex;align-items:center;gap:12px;padding:20px 16px 0">' +
      '<span style="width:40px;height:40px;background:#0f1b4d;display:flex;align-items:center;justify-content:center;color:#fff">' + icon('menu', 18) + '</span>' +
      '<span style="font-size:13px;font-weight:600;color:#fff">' + esc(thread.menuLabel) + '</span></div><div style="padding:12px 16px 0"><span class="crest" role="img" aria-label="Rangers crest"></span></div>' +
      '<div style="padding:14px 20px 0">' + rows + '</div></div></div>';
  }

  function phoneHtml(threadId, entries, owner, local) {
    var thread = STORY.threads[threadId];
    if (!thread) throw new Error('Unknown thread: ' + threadId);
    if (thread.kind === 'site') return siteHtml(thread);
    var title = '<div class="t"><small>' + esc(thread.countdown ? STORY.week.sub : thread.sub) + '</small><b>' + esc(thread.title) + '</b></div>';
    // a one-to-one chat with Gers: its mark and its name, nothing else
    if (thread.gers) title = '<div class="t" style="flex-direction:row;align-items:center;gap:8px">' + gersMark(28) + '<b>' + esc(thread.title) + '</b></div>';
    if (thread.kind === 'chat') {
      var avatars = thread.avatars.map(function (id) { return '<span data-action="profile" data-fan="' + esc(id) + '">' + avatar(id, 24) + '</span>'; }).join('');
      // a day marker flagged `cut` starts a fresh screen, as the boards do when the story jumps to a later day
      var cutAt = entries.map(function (entry) { return !!entry.item.cut; }).lastIndexOf(true);
      var lines = entries.slice(Math.max(cutAt, 0)).slice(-CHAT_TAIL).map(function (entry) { return itemHtml(entry, owner, local); }).join('');
      return '<div class="phone"><div class="ph-h bar">' + title + '<div class="gstack">' + avatars + '</div></div>' +
        '<div class="ph-b chat">' + lines + '</div><div class="inp">' + esc(STORY.ui.chatInput) + '</div></div>';
    }
    // A screen either fills as the story goes (the wallet, the party page) or is complete from the start (`items`).
    var shown = thread.items ? thread.items.map(function (item) { return { item: item, fresh: false }; }) : entries;
    var cards = shown.map(function (entry) { return itemHtml(entry, owner, local); }).join('');
    // Wherever a match is shown, both crests sit side by side: the countdown and Rangers TV carry the pair.
    var mark = thread.countdown ? '<span class="crest pair" role="img" aria-label="Rangers and Celtic crests"></span>'
      : thread.matchCrests ? crestPair(thread.matchCrests, 28, 5, 'font-size:10px;font-weight:800;color:#5b6577')
      : '<span class="crest" role="img" aria-label="Rangers crest"></span>';
    return '<div class="phone"><div class="ph-h">' + title + mark + '</div><div class="ph-b"' + (thread.countdown ? ' style="padding-top:0"' : '') + '>' + cards + '</div></div>';
  }

  /* ---------- around the phones ---------- */

  function noteHtml(note, slot) {
    var agent = STORY.agents[note.agent];
    var box = 'left:' + slot.noteLeft + 'px;top:' + slot.noteTop + 'px;';
    if (slot.noteKind === 'ticker') {
      return '<div class="ticker" style="' + box + 'max-width:' + slot.noteWidth + 'px"><span class="pulse"></span><span class="eye" style="width:22px;height:22px">' + icon(agent.icon, 12) +
        '</span><span><b>' + esc(agent.name) + '</b> ' + esc(STORY.ui.reportsTo) + ' · ' + esc(note.text) + '</span></div>';
    }
    return '<div class="n4" style="' + box + 'width:' + slot.noteWidth + 'px"><div class="row" style="gap:6px"><span class="eye" style="width:20px;height:20px">' + icon(agent.icon, 11) +
      '</span><b>' + esc(agent.name) + '</b><span class="to">' + esc(STORY.ui.reportsTo) + '</span></div><div class="nt">' + esc(note.text) + '</div></div>';
  }

  // The small browser window inside a panel step: what the agent saw on a site.
  var previewBody = {
    rows: function (p) { return p.rows.map(function (row) { return '<div class="row" style="justify-content:space-between"><b>' + esc(row.text) + '</b>' + pill(row.pill, row.tone) + '</div>'; }).join(''); },
    fixture: function (p) {
      return '<div class="row" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:8px">' + crestPair(p.crests, 22, 5, 'font-size:10px;font-weight:800;color:#5b6577') +
        '<span><b>' + esc(p.title) + '</b><br><span class="s">' + esc(p.detail) + '</span></span></span>' + pill(p.pill, p.tone) + '</div>';
    },
    slots: function (p) {
      return '<div class="row" style="gap:5px">' + p.slots.map(function (slot) {
        return '<span style="font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:6px;background:' + (slot.on ? '#0032a0;color:#fff' : '#eef1f5;color:#4a5568') + '">' + esc(slot.text) + '</span>';
      }).join('') + '</div>';
    },
    form: function (p) {
      return p.rows.map(function (row, i) {
        return '<div class="row" style="justify-content:space-between;padding:4px 0;border-top:' + (i ? '1px solid #eef1f4' : '0') + '"><span class="s">' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>';
      }).join('');
    },
    kv: function (p) {
      return '<div style="font-size:11px;line-height:1.55">' + p.rows.map(function (row) { return '<div class="row" style="justify-content:space-between"><span>' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b></div>'; }).join('') + '</div>';
    },
    party: function (p) {
      return '<div style="font-size:11px;line-height:1.5"><b>' + esc(p.title) + '</b><br><span class="s">' + esc(p.detail) + '</span><div class="row" style="gap:5px;margin-top:5px">' +
        p.pills.map(function (entry) { return pill(entry.text, entry.tone); }).join('') + '</div></div>';
    }
  };
  function previewHtml(preview) {
    var body = previewBody[preview.kind || 'rows'];
    if (!body) throw new Error('Unknown preview kind: ' + preview.kind);
    return '<div class="prev"><div class="url"><i></i><i></i><i></i><span style="margin-left:4px">' + esc(preview.url) + '</span></div><div style="padding:9px 11px">' + body(preview) + '</div></div>';
  }
  // Melbourne 1: the map search, with the Celtic bar crossed out
  function searchMapHtml(map) {
    var pins = map.pins.map(function (at) { return '<span style="position:absolute;left:' + at[0] + '%;top:' + at[1] + '%;color:#0032a0">' + icon('pin', 22) + '</span>'; }).join('');
    return '<div class="searchmap"><div class="river"></div>' + pins + '<span style="position:absolute;left:' + map.dropped[0] + '%;top:' + map.dropped[1] + '%;color:#8a93a3">' + icon('pinx', 22) +
      '</span><span class="maplabel">' + esc(map.label) + '</span></div>';
  }
  function checksHtml(checks) {
    return '<div class="row" style="flex-wrap:wrap;gap:5px;margin-top:6px">' + checks.map(function (text) { return '<span class="checkchip">' + icon('check', 12) + esc(text) + '</span>'; }).join('') + '</div>';
  }

  function panelStepHtml(step, isNew) {
    var enter = isNew ? ' enter' : '';
    if (step.note) return '<div class="step note' + enter + '"><div class="dd">' + esc(step.note) + '</div></div>';
    var mark = step.number ? step.number : (step.status === 'done' ? icon('check', 12) : '');
    var preview = step.preview ? previewHtml(step.preview) : '';
    var range = '';
    if (step.range) {
      range = '<div style="margin-top:8px;position:relative;height:26px"><div style="position:absolute;left:0;right:0;top:11px;height:4px;border-radius:2px;background:rgba(255,255,255,.18)"></div>' +
        step.range.points.map(function (percent) { return '<span style="position:absolute;left:' + percent + '%;top:6px;width:14px;height:14px;border-radius:7px;background:#e11b22;border:2px solid #04102b"></span>'; }).join('') +
        '</div><div class="row" style="justify-content:space-between;font-size:11px;color:#9aa6bd"><span>' + esc(step.range.from) + '</span><span>' + esc(step.range.to) + '</span></div>';
    }
    return '<div class="step' + enter + '"><span class="st ' + step.status + '">' + mark + '</span><div>' +
      (step.tool ? '<span class="tool">' + (step.icon ? icon(step.icon, step.iconSize || 11) : '') + esc(step.tool) + '</span>' : '') +
      (step.title ? '<div class="tt">' + esc(step.title) + '</div>' : '') +
      (step.detail ? '<div class="dd">' + esc(step.detail) + '</div>' : '') + (step.map ? searchMapHtml(step.map) : '') + preview + range + (step.checks ? checksHtml(step.checks) : '') + '</div></div>';
  }

  function panelHtml(panel, show, firstNew) {
    var agent = STORY.agents[panel.agent];
    var head = '<div class="wh">' + gersMark(34) + '<div><b>' + esc(panel.title || STORY.ui.panelTitle) + '</b><small>' +
      (agent ? esc(STORY.ui.gers) + ' ' + icon('arrow', 14) + ' ' + esc(agent.name) : esc(panel.subtitle)) + '</small></div></div>';
    var kick = panel.kick ? '<div class="kick">' + esc(panel.kick) + '</div>' : '';
    var brief = panel.brief ? '<div class="brief"><b>' + esc(panel.brief.label) + '</b> ' + esc(panel.brief.text) + '</div>' : '';
    var steps = panel.steps.slice(0, show).map(function (step, i) { return panelStepHtml(step, i >= firstNew); }).join('');
    var footer = panel.footer ? '<div class="ft"><span>' + esc(panel.footer) + '</span></div>' : '';
    return head + kick + brief + steps + footer;
  }

  // 1.7 the outlined phones that appear as Gers creates each new chat
  function splitHtml(chats, shown, firstNew, place) {
    var boxes = chats.slice(0, shown).map(function (chat, i) {
      return '<div class="splitbox' + (i >= firstNew ? ' enter' : '') + '" style="left:' + place.lefts[i] + 'px;top:' + place.top + 'px"><b>' + esc(chat.title) + '</b><span>' + esc(chat.who) + '</span></div>';
    }).join('');
    return '<div class="splitarrow" style="left:' + place.arrowLeft + 'px;top:' + place.arrowTop + 'px">' + icon('arrow', 44) + '</div>' + boxes;
  }

  window.RENDER = { esc: esc, icon: icon, pill: pill, crestPair: crestPair, avatar: avatar, gersMark: gersMark, items: drawItem, phone: phoneHtml, note: noteHtml, panel: panelHtml, split: splitHtml };
})();
