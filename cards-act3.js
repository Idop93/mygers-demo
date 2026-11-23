/* MyGers demo: the cards, screens and pop-ups of Acts 3 and 4 (boards 3.1 to 4.6).
   Adds to the item list in render.js. Holds no copy: every word and figure comes from the story files.
   The markup and inline sizes are the design canvas's own. */
(function () {
  'use strict';

  var STORY = window.STORY;
  var R = window.RENDER;
  var esc = R.esc, icon = R.icon, avatar = R.avatar;

  var PLAY = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"></path></svg>';
  var LINE = '1.5px solid rgba(255,255,255,.55)';
  // The two sizes the team sheet is drawn at: inside a chat (4.1) and on the Matchday screen (4.2).
  var PITCH = {
    small: { height: 118, stripe: 14, circle: 23, dot: 17, number: 7.1, name: 7, badge: 12, badgeFont: 7 },
    large: { height: 300, stripe: 37, circle: 60, dot: 26, number: 10.9, name: 9, badge: 14, badgeFont: 8 }
  };
  // How the 4.3 picture is turned for each camera: the proposal site's three views, sized for the phone.
  var CAMERA_VIEW = {
    main: 'rotateX(50deg) scale(1.06)',
    tactical: 'rotateX(0deg) scale(.96)',
    goal: 'rotateX(58deg) rotateZ(90deg) scale(1.4)'
  };
  // The pitch itself, 1050 by 680: stripes, touchlines, halfway line, centre circle, both boxes, six-yard boxes, spots and goals.
  var PITCH_LINES = '<rect width="1050" height="680" fill="#2f8f4e"/><g fill="#37a05a"><rect x="105" width="105" height="680"/><rect x="315" width="105" height="680"/><rect x="525" width="105" height="680"/>' +
    '<rect x="735" width="105" height="680"/><rect x="945" width="105" height="680"/></g><g stroke="#fff" stroke-width="5" fill="none" opacity=".9"><rect x="4" y="4" width="1042" height="672"/><path d="M525 4V676"/>' +
    '<circle cx="525" cy="340" r="92"/><rect x="4" y="138" width="165" height="404"/><rect x="881" y="138" width="165" height="404"/><rect x="4" y="248" width="55" height="184"/><rect x="991" y="248" width="55" height="184"/>' +
    '<path d="M169 267A92 92 0 0 1 169 413M881 267A92 92 0 0 0 881 413"/></g><g fill="#fff"><circle cx="525" cy="340" r="7"/><circle cx="114" cy="340" r="6"/><circle cx="936" cy="340" r="6"/></g>' +
    '<g stroke="#fff" stroke-width="5" fill="rgba(255,255,255,.25)"><rect x="-22" y="303" width="24" height="74"/><rect x="1048" y="303" width="24" height="74"/></g>';
  var SHEET = 'background:#f6f7f9;border-radius:22px 22px 0 0;padding:10px 14px 18px;display:flex;flex-direction:column;gap:10px;box-shadow:0 -10px 30px rgba(0,0,0,.2)';

  function drawn(name) {
    if (!STORY.drawn[name]) throw new Error('Unknown ready-drawn card: ' + name);
    return STORY.drawn[name];
  }
  function legend(id) {
    if (!STORY.legends[id]) throw new Error('Unknown legend: ' + id);
    return STORY.legends[id];
  }

  function playerHtml(player, size) {
    var badge = player.captain ? '<span style="position:absolute;right:-5px;top:-4px;width:' + size.badge + 'px;height:' + size.badge + 'px;border-radius:' + size.badge / 2 +
      'px;background:#e11b22;color:#fff;font-size:' + size.badgeFont + 'px;font-weight:800;display:flex;align-items:center;justify-content:center;border:1px solid #fff">' + esc(STORY.teamSheet.captain) + '</span>' : '';
    return '<span style="position:absolute;left:' + player.x + '%;top:' + player.y + '%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px">' +
      '<span style="position:relative;width:' + size.dot + 'px;height:' + size.dot + 'px;border-radius:' + Math.floor(size.dot / 2) + 'px;background:' + (player.keeper ? '#ffd84a' : '#0032a0') +
      ';border:1.5px solid #fff;color:' + (player.keeper ? '#0f1b2d' : '#fff') + ';font-size:' + size.number + 'px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.35)">' +
      player.number + badge + '</span><span style="font-size:' + size.name + 'px;font-weight:800;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.7);white-space:nowrap;line-height:1">' + esc(player.name) + '</span></span>';
  }
  function pitchHtml(size) {
    var half = Math.floor(size.circle / 2);
    return '<div style="position:relative;height:' + size.height + 'px;border-radius:10px;overflow:hidden;background:#2f8f4e;background-image:repeating-linear-gradient(180deg,rgba(255,255,255,.07) 0 ' + size.stripe +
      'px,transparent ' + size.stripe + 'px ' + (size.stripe * 2 + 1) + 'px);margin-top:7px"><span style="position:absolute;left:0;right:0;top:50%;border-top:' + LINE + '"></span>' +
      '<span style="position:absolute;left:50%;top:50%;width:' + size.circle + 'px;height:' + size.circle + 'px;margin:-' + half + 'px;border:' + LINE + ';border-radius:50%"></span>' +
      '<span style="position:absolute;left:22%;right:22%;top:0;height:15%;border:' + LINE + ';border-top:0"></span><span style="position:absolute;left:22%;right:22%;bottom:0;height:15%;border:' + LINE + ';border-bottom:0"></span>' +
      '<span style="position:absolute;left:38%;right:38%;bottom:0;height:6%;border:' + LINE + ';border-bottom:0"></span><span style="position:absolute;left:38%;right:38%;top:0;height:6%;border:' + LINE + ';border-top:0"></span>' +
      STORY.teamSheet.players.map(function (player) { return playerHtml(player, size); }).join('') + '</div>';
  }

  var cards = {
    // a card kept in the board's own markup (story-screens.js)
    drawn: function (item) { return drawn(item.use); },

    // the seven days and matchday across the top of the countdown; tapping a day jumps to it
    dayStrip: function (item) {
      var days = STORY.week.days;
      var today = days.map(function (day) { return day.scene; }).indexOf(item.day);
      if (today < 0) throw new Error('No countdown day for scene ' + item.day);
      var buttons = days.map(function (day, i) {
        var look = i === today ? 'background:#fff;color:#0f1b2d;border:2px solid #e11b22'
          : i < today ? 'background:#0032a0;color:#fff;border:1px solid #0032a0'
          : day.matchday ? 'background:#fff;color:#a3161c;border:1px dashed #e11b22' : 'background:#fff;color:#5b6577;border:1px solid #d5dae1';
        return '<button data-action="goto" data-scene="' + esc(day.scene) + '" aria-label="' + esc(day.label) + '" style="flex:1;min-width:0;height:40px;border-radius:9px;' + look +
          ';font:800 10.5px \'Plus Jakarta Sans\',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;padding:0"><span>' + esc(day.offset) +
          '</span><span style="font-size:8.5px;font-weight:600;opacity:.85">' + esc(day.date) + '</span></button>';
      }).join('');
      return '<div style="display:flex;gap:4px;flex:none">' + buttons + '</div>';
    },

    // 3.7: a legend's message. A photo, a play button and a title; nothing plays.
    videoTile: function (item) {
      return '<div class="heroP" style="min-height:150px;background:linear-gradient(180deg,rgba(6,18,48,0) 25%,rgba(6,18,48,.94) 85%),url(' + legend(item.legend).hero + ') center 25%/cover">' +
        '<span style="position:absolute;right:14px;top:14px;width:40px;height:40px;border-radius:20px;background:#fff;color:#0032a0;display:flex;align-items:center;justify-content:center">' + PLAY + '</span>' +
        '<span class="lbl" style="color:#b9c9f3">' + esc(item.label) + '</span><b>' + esc(item.title) + '</b></div>';
    },

    // 4.1 and 4.2: the team sheet, drawn as a formation on a pitch
    teamSheet: function (item) {
      var size = PITCH[item.size];
      var badge = '<span class="livep">' + esc(item.badge) + '</span>';
      var right = item.formation ? '<span class="row" style="gap:5px"><span class="pill x" style="height:20px;font-size:9.5px">' + esc(item.formation) + '</span>' + badge + '</span>' : badge;
      return '<div class="card" style="padding:9px 12px"><div class="row" style="justify-content:space-between"><span class="lbl">' + esc(item.label) + '</span>' + right + '</div>' + pitchHtml(size) +
        (item.bench ? '<div class="s" style="font-size:10.5px;margin-top:6px">' + esc(item.bench) + '</div>' : '') + '</div>';
    },
    // 4.1: the fans' own photos in the chat
    photo: function (item) {
      return '<div class="photo fx-' + esc(item.image) + '" role="img" aria-label="' + esc(item.alt) + '" style="height:' + item.height + 'px;flex:none"></div>';
    },
    photoGrid: function (item) {
      return '<div class="pgrid" role="img" aria-label="' + esc(item.alt) + '" style="margin-top:0"><div class="photo fx-' + esc(item.images[0]) + '" style="height:104px;"></div><div class="photo fx-' + esc(item.images[1]) +
        '" style="height:50px;flex:none"></div><div class="photo fx-' + esc(item.images[2]) + '" style="height:50px;flex:none"></div></div>';
    },
    // 4.1: Kicks Bar did what it promised
    promiseCard: function (item) {
      return '<div class="card" style="padding:9px 12px"><div class="row" style="justify-content:space-between"><b style="font-size:12.5px">' + esc(item.title) + '</b><span class="pill g">' + icon('check', 12) + ' ' + esc(item.pill) +
        '</span></div><div class="s" style="font-size:11px;margin-top:3px">' + esc(item.detail) + '</div></div>';
    },
    // 4.4: the goal
    goalCard: function (item) {
      return '<div class="heroC" style="background:#e11b22"><span style="letter-spacing:.1em;font-weight:800">' + esc(item.kicker) + '</span><b>' + esc(item.title) + '</b>' + (item.detail ? '<span>' + esc(item.detail) + '</span>' : '') + '</div>';
    },

    // 4.3: Rangers TV. Nothing covers the picture; the camera tag, stats and commentary sit below it, then the choices.
    rangersTv: function (item, owner, typing, local) {
      var tv = STORY.tv;
      var chosen = {};
      tv.groups.forEach(function (group) {
        var id = (local && local[group.key]) || tv.start[group.key];
        chosen[group.key] = group.options.filter(function (option) { return option.id === id; })[0];
      });
      function players(places, fill, stroke) {
        return '<g fill="' + fill + '" stroke="' + stroke + '" stroke-width="3">' + places.map(function (at) { return '<circle cx="' + at[0] + '" cy="' + at[1] + '" r="15"/>'; }).join('') + '</g>';
      }
      // with deep statistics on, the passing lines show on the pitch, as on the proposal site
      var passes = chosen.tvStats.id === 'deep' ? '<g stroke="#ffd84a" stroke-width="5" fill="none">' + tv.passes.map(function (line) {
        return '<path d="M' + line[0] + ' ' + line[1] + 'L' + line[2] + ' ' + line[3] + '"/>'; }).join('') + '</g>' : '';
      var picture = '<div style="position:relative;height:150px;border-radius:14px;overflow:hidden;background:#04102b;flex:none;perspective:700px"><div class="tvpitch" style="position:absolute;left:50%;top:50%;width:230px;height:148px;' +
        'margin:-74px 0 0 -115px;transform:' + CAMERA_VIEW[chosen.tvCamera.id] + '"><svg viewBox="-26 0 1102 680" width="100%" height="100%" style="display:block" role="img" aria-label="' + esc(chosen.tvCamera.name) + '">' + PITCH_LINES + passes +
        players(tv.rangers, '#0032a0', '#fff') + players(tv.celtic, '#e9edf3', '#3a4557') + '<circle cx="' + tv.ball[0] + '" cy="' + tv.ball[1] + '" r="9" fill="#fff" stroke="#0f1b2d" stroke-width="2"/></svg></div></div>';
      var stats = chosen.tvStats.lines ? '<span style="flex:1;min-width:0;background:#fff;border:1px solid #e4e7ec;border-radius:8px;padding:4px 8px;font-size:9.5px;line-height:1.35;color:#0f1b2d"><b style="font-size:8px;letter-spacing:.1em;color:#5b6577;display:block">' +
        esc(chosen.tvStats.title) + '</b>' + chosen.tvStats.lines.map(esc).join('<br>') + '</span>' : '';
      var tag = '<div style="flex:none;display:flex;gap:6px;align-items:stretch"><span style="flex:none;display:flex;gap:5px;align-items:center;background:#0f1b2d;color:#fff;font-size:9.5px;font-weight:800;letter-spacing:.06em;padding:5px 8px;border-radius:8px">' +
        '<i style="width:6px;height:6px;border-radius:3px;background:#e11b22"></i>' + esc(chosen.tvCamera.tag) + ' · ' + esc(tv.minute) + '</span>' + stats + '</div>';
      var commentary = '<div style="flex:none;display:flex;gap:6px;align-items:baseline;background:#fff;border:1px solid #e4e7ec;border-radius:10px;padding:6px 9px;font-size:10px;line-height:1.35;color:#0f1b2d"><b style="color:#0032a0;white-space:nowrap;font-size:9.5px">' +
        esc(chosen.tvCommentary.name) + '</b><span>' + esc(chosen.tvCommentary.line) + '</span></div>';
      var choices = tv.groups.map(function (group) {
        return '<div style="margin-top:7px"><div class="lbl">' + esc(group.label) + '</div><div class="row" style="gap:5px;flex-wrap:wrap;margin-top:5px">' + group.options.map(function (option) {
          return '<span class="pill' + (option === chosen[group.key] ? ' b' : '') + '" role="button" data-action="tab" data-key="' + group.key + '" data-value="' + option.id + '">' + esc(option.name) + '</span>';
        }).join('') + '</div></div>';
      }).join('');
      return picture + tag + commentary + '<div class="card" style="padding:9px 12px">' + choices + '</div><div class="s" style="font-size:10px;text-align:center">' + esc(tv.footer) + '</div>';
    }
  };
  Object.keys(cards).forEach(function (type) { R.items[type] = cards[type]; });

  /* ---------- pop-ups on the phone: closed with ✕ or a tap outside ---------- */

  function sheet(title, sub, body) {
    return '<div style="' + SHEET + '"><span style="align-self:center;width:36px;height:4px;border-radius:2px;background:#c9ced7"></span><div class="row" style="justify-content:space-between">' +
      '<span style="display:flex;flex-direction:column;gap:1px"><b style="font-size:16px">' + title + '</b><span class="s" style="font-size:11px">' + sub + '</span></span>' +
      '<button data-action="closepop" aria-label="' + esc(STORY.ui.close) + '" style="width:32px;height:32px;border-radius:16px;border:0;background:#e6e9ee;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none">' +
      icon('x', 14) + '</button></div>' + body + '</div>';
  }
  // 3.8: the data behind a stat chip
  function statSheet(pop) {
    var heads = '<span></span><b style="color:#0032a0">' + esc(STORY.ui.rangers) + '</b><i>' + esc(STORY.ui.celtic) + '</i>';
    var sections = pop.sections.map(function (section) {
      return '<div class="card" style="padding:8px 11px"><div class="lbl">' + esc(section.label) + '</div><div class="statr" style="margin-top:5px;font-size:11px;gap:3px 12px">' + heads +
        section.rows.map(function (row) { return '<span>' + esc(row[0]) + '</span><b>' + esc(row[1]) + '</b><i>' + esc(row[2]) + '</i>'; }).join('') + '</div></div>';
    }).join('');
    return sheet(esc(pop.title), esc(pop.versus), '<div style="font-size:12px;line-height:1.4">' + esc(pop.line) + '</div>' + sections);
  }
  // a member's profile: what MyGers knows about them (PRD cast table)
  function profileSheet(id) {
    var fan = STORY.fans[id];
    if (!fan) throw new Error('Unknown fan: ' + id);
    var labels = STORY.profile.rows;
    var hero = legend(fan.legend);
    function line(label, value) { return '<div class="li"><span style="flex:1"><span class="s">' + esc(label) + '</span><b>' + value + '</b></span></div>'; }
    var body = '<div class="row" style="gap:10px">' + avatar(id, 44) + '<span><b style="font-size:15px;display:block">' + esc(fan.name) + ', ' + fan.age + '</b><span class="s" style="font-size:11px">' + esc(fan.place) + '</span></span></div>' +
      '<div class="card" style="padding:6px 12px">' + line(labels.matchday, esc(STORY.profile.where[fan.place])) + line(labels.interest, esc(fan.interest)) +
      '<div class="li"><span class="num g" style="width:34px;height:34px;background:url(' + hero.face + ') center/cover"></span><span style="flex:1"><span class="s">' + esc(labels.legend) + '</span><b>' + esc(hero.name) +
      '</b><span class="s">' + esc(hero.era) + '</span></span></div></div>';
    return sheet(esc(STORY.profile.kicker), esc(fan.name), body);
  }

  // What is open on a phone: { kind: 'ppda' | 'xg' | 'journey' | 'profile', fan }
  R.pop = function (pop) {
    var inner = pop.kind === 'journey' ? drawn('matchdaySheet')
      : pop.kind === 'profile' ? profileSheet(pop.fan)
      : STORY.pops[pop.kind] ? statSheet(STORY.pops[pop.kind]) : null;
    if (!inner) throw new Error('Unknown pop-up: ' + pop.kind);
    return '<div class="popscrim" data-action="closepop"><div class="popsheet">' + inner + '</div></div>';
  };

  // A full-screen card that marks a change of chapter: into the countdown week (four fans), into matchday (three places).
  R.interlude = function (interlude) {
    var chips = (interlude.fans || []).map(function (id) {
      var fan = STORY.fans[id];
      return '<div class="fanchip">' + avatar(id, 44) + '<b>' + esc(fan.name) + '</b><span>' + esc(fan.interest) + '</span><small>' + esc(fan.place) + '</small></div>';
    }).concat((interlude.places || []).map(function (place) {
      return '<div class="fanchip wide"><b>' + esc(place.name) + '</b><span>' + esc(place.time) + '</span><small>' + esc(place.who) + '</small></div>';
    })).join('');
    var crests = interlude.crests ? '<div class="crestrow">' + R.crestPair(interlude.crests, 64, 14, 'font-size:18px;font-weight:800;color:rgba(255,255,255,.7)') + '</div>' : '';
    return '<div class="interlude">' + crests + '<div class="kick">' + esc(interlude.kicker) + '</div><div class="big">' + esc(interlude.title) + '</div><p>' + esc(interlude.text) + '</p><div class="fanrow">' + chips + '</div></div>';
  };
})();
