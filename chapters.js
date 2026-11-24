/* MyGers demo: the chapter menu.
   A drawer on the left edge of the window that jumps to any part of the story, so the presenter
   never has to step back through every screen. The list itself is STORY.chapters in story.js.
   It listens before app.js does (in the capture phase), so a click or key meant for the menu
   never also steps the story. */
(function () {
  'use strict';

  var STORY = window.STORY;
  var APP = window.APP;
  var esc = window.RENDER.esc;

  // The menu's own state: whether the drawer is open, and which chapter the keyboard is on.
  var menu = { open: false, picked: 0 };
  var chapters = [];   // every chapter in list order, each with the number of its scene on the main line
  var el = {};

  var HANDLE_ICON = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 3h8M2 6h8M2 9h8"></path></svg>';

  function sceneNumber(id) {
    for (var i = 0; i < STORY.scenes.length; i++) if (STORY.scenes[i].id === id) return i;
    throw new Error('Chapter points at an unknown scene: ' + id);
  }

  // The chapter the story is in now: the last one at or before the current scene. A chapter that
  // zooms in on one phone counts only while that phone is the one in focus on that scene.
  function chapterHere() {
    var sceneNow = APP.stops[APP.state.stop].scene;
    var focusNow = APP.state.focus ? APP.state.focus.phone : undefined;
    var best = 0;
    chapters.forEach(function (chapter, i) {
      if (chapter.at > sceneNow) return;
      if (chapter.focus === undefined ? chapter.at > chapters[best].at : (chapter.at === sceneNow && chapter.focus === focusNow)) best = i;
    });
    return best;
  }

  function show() {
    var here = chapterHere();
    el.root.classList.toggle('open', menu.open);
    Array.prototype.forEach.call(el.items, function (node, i) {
      node.classList.toggle('here', i === here);
      node.classList.toggle('picked', menu.open && i === menu.picked);
    });
    if (menu.open) el.items[menu.picked].scrollIntoView({ block: 'nearest' });
  }
  function open() { menu.open = true; menu.picked = chapterHere(); show(); }
  function close() { menu.open = false; show(); }
  function toggle() { if (menu.open) close(); else open(); }
  function pick(change) {
    menu.picked = (menu.picked + change + chapters.length) % chapters.length;
    show();
  }
  function jump(index) {
    var chapter = chapters[index];
    menu.open = false;
    APP.goToChapter(chapter.scene, chapter.focus, chapter.step);
    show();
  }

  function fit() { el.root.style.setProperty('--fit', APP.fitScale()); }

  function swallow(event) { event.preventDefault(); event.stopPropagation(); }

  function onClick(event) {
    var item = event.target.closest('.chitem');
    if (event.target.closest('.chandle')) toggle();
    else if (item) jump(Number(item.dataset.chapter));
    else if (!menu.open) return;                                   // not for the menu: the story handles it
    else if (!event.target.closest('.chdrawer')) close();          // a click outside the open drawer closes it
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();   // so Enter never re-presses a button
    swallow(event);
  }

  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'c' || event.key === 'C') toggle();
    else if (!menu.open) return;
    else if (event.key === 'ArrowDown') pick(1);
    else if (event.key === 'ArrowUp') pick(-1);
    else if (event.key === 'Enter') jump(menu.picked);
    else if (event.key === 'Escape') close();
    // any other key is swallowed too: while the drawer is open the story behind it stays still
    swallow(event);
  }

  function start() {
    var html = '<button class="chandle" title="' + esc(STORY.ui.chapters) + ' (C)" aria-label="' + esc(STORY.ui.chapters) + '">' + HANDLE_ICON + '</button>' +
      '<div class="chscrim"></div><nav class="chdrawer"><h2>' + esc(STORY.ui.chapters) + '</h2>';
    STORY.chapters.forEach(function (group) {
      html += '<div class="chgroup">' + esc(group.group) + '</div>';
      group.items.forEach(function (item) {
        html += '<button class="chitem" data-chapter="' + chapters.length + '">' + esc(item.label) + '</button>';
        chapters.push({ scene: item.scene, focus: item.focus, step: item.step, at: sceneNumber(item.scene) });
      });
    });
    el.root = document.createElement('div');
    el.root.id = 'chapters';
    el.root.innerHTML = html + '</nav>';
    // It sits on the window, not on the stage: on a screen wider than the stage the drawer still
    // opens from the very left edge. It is scaled like the stage, so its text matches the phones'.
    document.body.appendChild(el.root);
    window.addEventListener('resize', fit);
    fit();
    el.items = el.root.querySelectorAll('.chitem');
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true);
    show();
  }

  // For test.html and the console.
  window.CHAPTERS = { state: menu, list: chapters, open: open, close: close, here: chapterHere };

  start();
})();
