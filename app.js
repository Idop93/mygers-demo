/* MyGers demo: stepping, focus, keyboard and drawing.
   All content comes from story.js. Every screen is drawn from scratch for the current
   position, never by patching the last one, so going back and forward is always safe. */
(function () {
  'use strict';

  var STORY = window.STORY;

  // Sizes and positions, in the boards' own 1440 x 900 pixels.
  var STAGE = { width: 1440, height: 900 };
  var PHONE = { height: 620 };
  var LAYOUT = {
    one: { scale: 1.3, top: 47, left: 525 },           // one phone, centred
    onePanel: { scale: 1.3, top: 47, left: 230 },      // one phone beside a panel
    three: { scale: 1.15, top: 22, lefts: [120, 525, 930], labelTop: 745, labelWidth: 345, noteTop: 787, noteOutset: 10 },
    four: { scale: 1.05, top: 18, lefts: [45, 390, 735, 1080], labelTop: 677, labelWidth: 315, noteTop: 719, noteOutset: 0 },
    focus: { scale: 1.3, top: 30, left: 250, labelTop: 844, labelWidth: 390 },
    rail: { left: 40, labelWidth: 150, labelGap: 6, byCount: { 2: { scale: 0.5, tops: [80, 480] }, 3: { scale: 0.4, tops: [70, 345, 620] } } },
    panel: { left: 690, width: 520, wideLeft: 670, wideWidth: 600, minTop: 18 },
    split: { lefts: [780, 980, 1180], top: 250, arrowLeft: 700, arrowTop: 405 }   // 1.7: the three outlined phones
  };
  var SCROLL_SLACK = 4;     // pixels of overflow that do not count as "more below"
  var GERS_DOTS_MS = 600;   // board "How it moves": three dots before Gers replies
  // The one app state.
  //   stop:  where we are on the main line
  //   track: on a scene whose phones have their own timelines, how many steps each phone has taken
  //   focus: null, or { phone } when one phone is enlarged
  //   fresh: what the latest forward move added, so only that animates in
  //   local: what was tapped on this screen (a map tab, a viewing choice, an open pop-up); cleared on every step
  //   cameFrom: where the presenter was before opening a focus board from its phone, so Esc returns there
  var app = { stop: 0, track: [], focus: null, fresh: { main: false, tracks: [] }, lastMove: 'none', instant: false, local: {}, cameFrom: null };
  var stops = [];           // the main line: every step of every scene, in order
  var drawCount = 0;        // lets a late timer see that the screen has moved on
  var shownPanel = { id: null, show: 0 };
  var shownSplit = 0;
  var el = {};

  /* ---------- small helpers ---------- */

  var R = window.RENDER;
  var esc = R.esc;
  var icon = R.icon;

  function sceneHere() { return STORY.scenes[stops[app.stop].scene]; }
  // A phone's own timeline within a scene, or null if it has none.
  function trackOf(scene, phone) {
    var target = scene.focus && scene.focus[phone];
    return typeof target === 'string' ? STORY.journeys[target] : null;
  }
  // Where a phone's timeline comes to rest when all phones step together: after each step that
  // changes the phone itself. Steps that only add to the Behind the scenes panel are taken along
  // the way, because the panel shows only in focus and a click must always change something on screen.
  function restPoints(track) {
    var rests = [0];
    if (!track) return rests;
    // `rest: true` marks a step that changes the phone without adding to it, such as a switch to another screen
    track.steps.forEach(function (step, k) { if (step.add || step.patch || step.rest) rests.push(k + 1); });
    rests[rests.length - 1] = track.steps.length;
    return rests;
  }
  function restIndex(rests, taken) {
    var index = 0;
    while (index + 1 < rests.length && rests[index + 1] <= taken) index++;
    return index;
  }
  function trackLengths(scene) {
    return scene.phones.map(function (phone, i) { var track = trackOf(scene, i); return track ? track.steps.length : 0; });
  }

  /* ---------- what is on screen at the current position ---------- */

  // Walks the story up to the current position and returns what each thread holds,
  // which thread each phone shows, and which panel is open.
  function collectState() {
    var here = stops[app.stop];
    var animate = app.lastMove === 'forward' && !app.instant;
    var focused = app.focus ? app.focus.phone : null;
    var state = { threads: {}, views: {}, labels: {}, panel: null, split: 0 };

    function apply(step, isNewest) {
      (step.add || []).forEach(function (pair) {
        (state.threads[pair[0]] = state.threads[pair[0]] || []).push({ item: pair[1], fresh: animate && isNewest });
      });
      // a patch changes an item that is already on screen, such as an approval arriving on a card
      (step.patch || []).forEach(function (patch) {
        var target = (state.threads[patch[0]] || []).filter(function (entry) { return entry.item.id === patch[1]; })[0];
        if (!target) throw new Error('Patch found no item "' + patch[1] + '" in ' + patch[0]);
        target.item = Object.assign({}, target.item, patch[2]);
      });
    }
    STORY.scenes.forEach(function (scene, sceneIndex) {
      if (sceneIndex > here.scene) return;
      var isHere = sceneIndex === here.scene;
      var lastStep = isHere ? here.step : scene.steps.length - 1;
      for (var j = 0; j <= lastStep; j++) {
        apply(scene.steps[j], isHere && j === here.step && app.fresh.main);
        if (isHere && scene.steps[j].view) Object.assign(state.views, scene.steps[j].view);
        if (isHere && scene.steps[j].panel) state.panel = scene.steps[j].panel;
        if (isHere && scene.steps[j].split) state.split = scene.steps[j].split;
      }
      if (isHere && focused !== null) state.panel = null;   // in focus, only that phone's own panel shows
      // Each phone's own timeline: as far as it has got on this scene, or all of it on scenes already passed.
      scene.phones.forEach(function (phone, i) {
        var track = trackOf(scene, i);
        if (!track) return;
        var taken = isHere ? (app.track[i] || 0) : track.steps.length;
        for (var k = 0; k < taken; k++) {
          var step = track.steps[k];
          apply(step, isHere && k === taken - 1 && app.fresh.tracks.indexOf(i) >= 0);
          if (!isHere) continue;
          if (step.view) state.views[i] = step.view;
          if (step.label) state.labels[i] = step.label;
          if (step.panel && focused === i) state.panel = step.panel;
        }
      });
    });
    return state;
  }

  // Where each phone sits: one, three or four across, or one in focus with the rest in the rail.
  function placePhones(scene, focusPhone, hasPanel) {
    var count = scene.phones.length;
    if (count === 1) {
      var single = hasPanel ? LAYOUT.onePanel : LAYOUT.one;
      return [{ left: single.left, top: single.top, scale: single.scale }];
    }
    if (focusPhone === null) {
      var row = count === 4 ? LAYOUT.four : LAYOUT.three;
      return scene.phones.map(function (phone, i) {
        return { left: row.lefts[i], top: row.top, scale: row.scale, labelTop: row.labelTop, labelWidth: row.labelWidth,
          noteTop: row.noteTop, noteLeft: row.lefts[i] - row.noteOutset, noteWidth: row.labelWidth + 2 * row.noteOutset, noteKind: count === 4 ? 'n4' : 'ticker' };
      });
    }
    var rail = LAYOUT.rail.byCount[count - 1];
    var railSlot = 0;
    return scene.phones.map(function (phone, i) {
      if (i === focusPhone) {
        return { left: LAYOUT.focus.left, top: LAYOUT.focus.top, scale: LAYOUT.focus.scale, labelTop: LAYOUT.focus.labelTop, labelWidth: LAYOUT.focus.labelWidth };
      }
      var top = rail.tops[railSlot++];
      return { left: LAYOUT.rail.left, top: top, scale: rail.scale, rail: true,
        labelTop: top + PHONE.height * rail.scale + LAYOUT.rail.labelGap, labelWidth: LAYOUT.rail.labelWidth };
    });
  }

  /* ---------- drawing ---------- */

  // Shows a soft fade at the foot of a screen while there is more to scroll to.
  function markMoreBelow(body) {
    if (body.classList.contains('chat')) return;   // a chat keeps its newest lines in view; older ones leave at the top
    var more = body.scrollHeight - body.clientHeight - body.scrollTop > SCROLL_SLACK;
    body.parentNode.classList.toggle('more', more);
  }

  function drawPhones(scene, state, slots) {
    var before = {};
    Array.prototype.forEach.call(el.phones.children, function (node) { before[node.dataset.owner] = node; });
    var origin = el.phones.firstElementChild ? el.phones.firstElementChild.style.cssText : '';
    scene.phones.forEach(function (phone, i) {
      var slot = slots[i];
      var node = before[phone.owner];
      var target = 'left:' + slot.left + 'px;top:' + slot.top + 'px;transform:scale(' + slot.scale + ');';
      if (!node) {
        node = document.createElement('div');
        // A new phone starts where the first one stood, then slides out: one phone becomes three.
        if (origin && !app.instant) { node.style.cssText = origin; el.phones.appendChild(node); void node.offsetWidth; }
        else el.phones.appendChild(node);
      }
      delete before[phone.owner];
      node.className = 'sc' + (slot.rail ? ' rail' : '') + (scene.phones.length > 1 ? ' pick' : '');
      node.dataset.owner = phone.owner;
      node.dataset.phone = i;
      node.style.cssText = target;
      var threadId = state.views[i] || phone.thread;
      // A screen longer than the phone scrolls. Keep its place when the same screen is redrawn (a tap on a choice).
      var body = node.querySelector('.ph-b');
      var sameScreen = body && node.dataset.thread === threadId;
      var scrolled = sameScreen ? body.scrollTop : 0;
      var keepPlace = sameScreen && app.lastMove === 'none';   // a tap on this screen, not a step through the story
      node.dataset.thread = threadId;
      node.innerHTML = R.phone(threadId, state.threads[threadId] || [], phone.owner, app.local);
      body = node.querySelector('.ph-b');
      // A chat always shows its newest lines after a step; the presenter can scroll up to earlier ones.
      if (body) { body.scrollTop = body.classList.contains('chat') && !keepPlace ? body.scrollHeight : scrolled; markMoreBelow(body); }
      var pop = app.local.pop;
      if (pop && pop.phone === i) node.firstElementChild.insertAdjacentHTML('beforeend', R.pop(pop));
    });
    Object.keys(before).forEach(function (owner) { el.phones.removeChild(before[owner]); });
  }

  function drawOverlay(scene, state, slots, focusPhone) {
    var html = '';
    scene.phones.forEach(function (phone, i) {
      var slot = slots[i];
      if (!slot.labelTop) return;
      var label = state.labels[i] || phone;
      html += slot.rail
        ? '<div class="plabel rail" style="left:' + slot.left + 'px;top:' + slot.labelTop + 'px;width:' + slot.labelWidth + 'px">' + esc(phone.rail) + '</div>'
        : '<div class="plabel" style="left:' + slot.left + 'px;top:' + slot.labelTop + 'px;width:' + slot.labelWidth + 'px">' + esc(label.label) + '<small>' + esc(label.sub) + '</small></div>';
      if (phone.note && slot.noteKind) html += R.note(phone.note, slot);
    });
    if (focusPhone !== null || scene.parent) html += '<button class="back3" data-action="back">' + icon('back', 14) + '<span>' + esc(scene.backLabel || STORY.ui.back) + '</span></button>';
    if (state.split) {
      var animate = app.lastMove === 'forward' && !app.instant;
      html += R.split(scene.split, state.split, animate ? shownSplit : state.split, LAYOUT.split);
    }
    shownSplit = state.split;
    if (scene.interlude) html += R.interlude(scene.interlude);
    if (scene.club) html += R.club(scene, stops[app.stop].step, app.local);
    // a tap inside the club view (a person in a network) keeps the page where it was scrolled to
    var clubPage = el.overlay.querySelector('.cv-main');
    var clubScroll = clubPage && app.lastMove === 'none' ? clubPage.scrollTop : 0;
    // the club view fades in on arrival, but not when a tap only changes the page it is on
    el.overlay.classList.toggle('arrive', !!scene.club && app.lastMove !== 'none');
    if (scene.placeholder) html += '<div class="placeholder serif">' + esc(STORY.ui.clubViewPlaceholder) + '</div>';
    el.overlay.innerHTML = html;
    if (clubScroll) el.overlay.querySelector('.cv-main').scrollTop = clubScroll;
  }

  function drawPanel(use) {
    if (!use) { el.panel.innerHTML = ''; el.panel.className = 'work'; el.panel.style.cssText = 'display:none'; shownPanel = { id: null, show: 0 }; return; }
    var panel = STORY.panels[use.id];
    if (!panel) throw new Error('Unknown panel: ' + use.id);
    var show = use.show === undefined ? panel.steps.length : use.show;
    var isNewPanel = shownPanel.id !== use.id;
    var animate = app.lastMove === 'forward' && !app.instant;
    var firstNew = animate && !isNewPanel ? shownPanel.show : (animate ? 0 : show);
    el.panel.style.display = '';
    var at = panel.at || {};   // a few boards place their panel by hand
    el.panel.style.left = (at.left || (panel.wide ? LAYOUT.panel.wideLeft : LAYOUT.panel.left)) + 'px';
    el.panel.style.width = (at.width || (panel.wide ? LAYOUT.panel.wideWidth : LAYOUT.panel.width)) + 'px';
    el.panel.classList.toggle('wide', !!panel.wide);   // before measuring: a wide panel is tighter, so shorter
    el.panel.innerHTML = R.panel(panel, show, firstNew);
    el.panel.style.top = (at.top || Math.max(LAYOUT.panel.minTop, Math.round((STAGE.height - el.panel.offsetHeight) / 2))) + 'px';
    el.panel.classList.remove('slide');
    if (isNewPanel && !app.instant) { void el.panel.offsetWidth; el.panel.classList.add('slide'); }
    shownPanel = { id: use.id, show: show };
  }

  // Gers "types" for a moment, then the reply replaces the dots.
  function finishTyping() {
    var mine = ++drawCount;
    var waiting = el.phones.querySelectorAll('[data-typing]');
    if (!waiting.length) return;
    setTimeout(function () {
      if (mine !== drawCount) return;   // the presenter has already moved on
      Array.prototype.forEach.call(waiting, function (node) {
        node.querySelector('.body').textContent = node.dataset.typing;
        node.removeAttribute('data-typing');
      });
    }, GERS_DOTS_MS);
  }

  // The phone that is enlarged: the one the presenter picked, or the one a focus board is about.
  function focusedPhone() {
    var scene = sceneHere();
    return app.focus ? app.focus.phone : (scene.focusPhone === undefined ? null : scene.focusPhone);
  }

  function draw() {
    var scene = sceneHere();
    var state = collectState();
    var focusPhone = focusedPhone();
    var slots = placePhones(scene, focusPhone, !!state.panel || state.split > 0);
    el.stage.classList.toggle('instant', app.instant);
    drawPhones(scene, state, slots);
    drawOverlay(scene, state, slots, focusPhone);
    drawPanel(state.panel);
    finishTyping();
  }

  /* ---------- moving through the story ---------- */

  function move(kind, change) {
    app.fresh = { main: false, tracks: [] };
    var cameFrom = app.cameFrom;
    app.cameFrom = null;   // only an Esc straight after opening a focus board returns to the exact spot
    change(cameFrom);
    app.lastMove = kind;
    app.local = {};
    draw();
  }
  // A tap that changes something on the screen itself, without moving through the story.
  function setLocal(key, value) { app.local[key] = value; app.lastMove = 'none'; draw(); }

  // Moves along the main line. Arriving from before, every phone's timeline starts at zero;
  // arriving from after (stepping back), every timeline is complete.
  function goToStop(index, arriving) {
    var changedScene = stops[index].scene !== stops[app.stop].scene;
    app.stop = index;
    if (!changedScene && arriving !== 'jump') return;
    var lengths = trackLengths(sceneHere());
    app.track = lengths.map(function (length) { return arriving === 'end' ? length : 0; });
    app.focus = null;
  }
  // Staying zoomed in: when the presenter steps on while a phone is enlarged, the same fan's
  // phone is enlarged again on the screen they arrive at. It is not kept where that fan has no
  // phone, or where the screen is a focus board with its own enlarged phone.
  function ownerInFocus() { return app.focus ? sceneHere().phones[app.focus.phone].owner : null; }
  function refocus(owner) {
    var scene = sceneHere();
    if (owner === null || scene.phones.length < 2 || scene.focusPhone !== undefined) return;
    scene.phones.forEach(function (phone, i) {
      var target = scene.focus && scene.focus[i];
      if (phone.owner === owner && !(target && target.scene)) app.focus = { phone: i };
    });
  }
  // Phones' own timelines only run once the scene's shared steps are done.
  function onLastSharedStep() { return stops[app.stop].step === sceneHere().steps.length - 1; }

  function forward() {
    var lengths = trackLengths(sceneHere());
    if (app.focus) {
      var phone = app.focus.phone;
      if (onLastSharedStep() && app.track[phone] < lengths[phone]) return move('forward', function () { app.track[phone]++; app.fresh.tracks = [phone]; });
      // The end of a phone's own timeline (the Act 2 journeys) returns to all the phones.
      if (trackOf(sceneHere(), phone) || app.stop >= stops.length - 1) return unfocus();
      // A phone with no timeline of its own steps on with the story, and stays enlarged.
      var owner = ownerInFocus();
      return move('forward', function () { goToStop(app.stop + 1, 'start'); refocus(owner); app.fresh.main = true; });
    }
    var scene = sceneHere();
    var unfinished = [];
    if (onLastSharedStep()) lengths.forEach(function (length, i) { if (app.track[i] < length) unfinished.push(i); });
    if (unfinished.length) {
      return move('forward', function () {
        unfinished.forEach(function (i) {
          var rests = restPoints(trackOf(scene, i));
          app.track[i] = rests[restIndex(rests, app.track[i]) + 1];
        });
        app.fresh.tracks = unfinished;
      });
    }
    if (app.stop < stops.length - 1) move('forward', function () { goToStop(app.stop + 1, 'start'); app.fresh.main = true; });
  }
  function back() {
    if (app.focus) {
      var phone = app.focus.phone;
      if (app.track[phone] > 0) return move('back', function () { app.track[phone]--; });
      if (trackOf(sceneHere(), phone) || app.stop === 0) return unfocus();
      var owner = ownerInFocus();
      return move('back', function () { goToStop(app.stop - 1, 'end'); refocus(owner); });
    }
    // With all phones on screen, undo the latest joint step: the phones that are furthest along step back one rest.
    var scene = sceneHere();
    var places = app.track.map(function (taken, i) {
      var rests = restPoints(trackOf(scene, i));
      var index = restIndex(rests, taken);
      var between = taken > rests[index];   // left part-way by stepping in focus
      return { rests: rests, index: index, between: between, level: index + (between ? 0.5 : 0) };
    });
    var furthest = Math.max.apply(null, [0].concat(places.map(function (place) { return place.level; })));
    if (furthest > 0) {
      return move('back', function () {
        app.track = app.track.map(function (taken, i) {
          var place = places[i];
          if (place.level !== furthest) return taken;
          return place.between ? place.rests[place.index] : place.rests[place.index - 1];
        });
      });
    }
    if (app.stop > 0) move('back', function () { goToStop(app.stop - 1, 'end'); });
  }
  function firstStopOf(id) {
    for (var i = 0; i < stops.length; i++) if (STORY.scenes[stops[i].scene].id === id) return i;
    throw new Error('Unknown scene: ' + id);
  }
  // keepFocus: a tap on a countdown day while zoomed in on a fan stays zoomed in on that fan.
  function goToScene(id, keepFocus) {
    var index = firstStopOf(id);
    var owner = keepFocus === true ? ownerInFocus() : null;
    move('jump', function () { goToStop(index, 'jump'); refocus(owner); });
  }
  // The chapter menu's jump: to the first screen of a scene, or, with a phone number, to that
  // scene with the phone enlarged and its own timeline at the start.
  // `taken` puts that phone part-way along its own timeline (the other phones stay at their start).
  function goToChapter(id, phone, taken) {
    if (phone === undefined) return goToScene(id);
    var index = firstStopOf(id);
    while (index + 1 < stops.length && stops[index + 1].scene === stops[index].scene) index++;   // timelines run after the shared steps
    move('jump', function () { goToStop(index, 'jump'); app.focus = { phone: phone }; app.track[phone] = taken || 0; });
  }
  // Opens a focus board from its phone, remembering where the presenter was.
  function openFocusBoard(id) {
    var index = firstStopOf(id);
    var from = { stop: app.stop, track: app.track.slice() };
    move('jump', function () { goToStop(index, 'jump'); });
    app.cameFrom = from;
  }
  // Leaves a focus board: back to the exact spot it was opened from (wherever that was), or else to the end of the board it belongs to.
  function leaveFocusBoard(parentId) {
    move('jump', function (cameFrom) {
      if (cameFrom) { goToStop(cameFrom.stop, 'jump'); app.track = cameFrom.track; return; }
      var index = firstStopOf(parentId);
      while (index + 1 < stops.length && stops[index + 1].scene === stops[index].scene) index++;
      goToStop(index, 'jump');
      app.track = trackLengths(sceneHere());
    });
  }
  function sceneExists(id) { return STORY.scenes.some(function (scene) { return scene.id === id; }); }
  // Focusing only enlarges the phone and opens its panel. Nothing on the phone changes.
  function focusPhone(phone) {
    var scene = sceneHere();
    if (scene.phones.length < 2 || phone >= scene.phones.length) return;
    if (!app.focus && scene.focusPhone === phone) return;   // already the phone this focus board is about
    var target = scene.focus && scene.focus[phone];
    if (target && target.scene) return openFocusBoard(target.scene);   // a focus board that sits on the main line
    move('jump', function () { app.focus = { phone: phone }; });
  }
  function unfocus() {
    var scene = sceneHere();
    if (app.focus) return move('jump', function () { app.focus = null; });
    if (scene.parent) leaveFocusBoard(scene.parent);
  }
  // Pop-ups on a phone (the stat breakdowns, a member's profile, "Your matchday").
  function openPop(pop) { setLocal('pop', pop); }
  function closePop() { setLocal('pop', null); }

  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'ArrowRight') forward();
    else if (event.key === 'ArrowLeft') back();
    else if (event.key === 'Escape') { if (app.local.pop) closePop(); else unfocus(); }
    else if (/^[1-4]$/.test(event.key)) focusPhone(Number(event.key) - 1);
    else return;
    event.preventDefault();
  }

  function onClick(event) {
    var action = event.target.closest('[data-action]');
    if (action && action.dataset.action === 'back') return unfocus();
    if (action && action.dataset.action === 'tab') return setLocal(action.dataset.key, action.dataset.value);
    // A button may point at a scene a later build stage adds; until then it does nothing.
    if (action && action.dataset.action === 'goto') { if (sceneExists(action.dataset.scene)) goToScene(action.dataset.scene, true); return; }
    var phone = event.target.closest('.sc');
    if (action && action.dataset.action === 'closepop') return closePop();
    if (event.target.closest('.popsheet')) return;                    // a tap inside an open pop-up does nothing
    if (app.local.pop) return closePop();                             // a tap anywhere else closes it
    if (action && action.dataset.action === 'pop') return openPop({ kind: action.dataset.pop, phone: Number(phone.dataset.phone) });
    if (action && action.dataset.action === 'profile') return openPop({ kind: 'profile', fan: action.dataset.fan, phone: Number(phone.dataset.phone) });
    if (phone && phone.classList.contains('pick') && Number(phone.dataset.phone) !== focusedPhone()) return focusPhone(Number(phone.dataset.phone));
    forward();
  }

  // How much the 1440 x 900 stage is scaled to fit the window.
  function fitScale() { return Math.min(window.innerWidth / STAGE.width, window.innerHeight / STAGE.height); }
  function fitStage() {
    var scale = fitScale();
    el.stage.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
  }

  function start() {
    STORY.scenes.forEach(function (scene, sceneIndex) {
      if (!scene.steps.length) throw new Error('Scene ' + scene.id + ' has no steps');
      scene.steps.forEach(function (step, stepIndex) { stops.push({ scene: sceneIndex, step: stepIndex }); });
    });
    el.stage = document.getElementById('stage');
    el.stage.innerHTML = '<div id="phones"></div><div id="overlay"></div><div id="panel" class="work" style="display:none"></div>';
    el.phones = document.getElementById('phones');
    el.overlay = document.getElementById('overlay');
    el.panel = document.getElementById('panel');
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    document.addEventListener('scroll', function (event) { if (event.target.classList && event.target.classList.contains('ph-b')) markMoreBelow(event.target); }, true);
    window.addEventListener('resize', fitStage);
    fitStage();
    (STORY.preload || []).forEach(function (file) { new Image().src = file; });
    goToStop(0, 'jump');
    draw();
  }

  // For test.html and for checking by hand in the browser console.
  window.APP = {
    state: app, stops: stops, setLocal: setLocal, openPop: openPop, closePop: closePop, forward: forward, back: back, focusPhone: focusPhone, unfocus: unfocus, goToScene: goToScene, goToChapter: goToChapter, draw: draw, fitScale: fitScale,
    sceneHere: sceneHere,
    // What is on screen, as text. Phones are listed in story order, because the page keeps
    // reusing phone elements and their order in the page does not affect what is seen.
    snapshot: function () {
      var phones = Array.prototype.slice.call(el.phones.children).sort(function (a, b) { return a.dataset.phone - b.dataset.phone; });
      return phones.map(function (node) { return node.outerHTML; }).join('') + el.overlay.innerHTML + el.panel.outerHTML;
    }
  };

  start();
})();
