/* =========================================================================
   MERAK TOURS — interaction layer
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================= */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '38763822083';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var requestIdle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 1); };

  /* ---------------- header --------------------------------------------- */
  var hdr = $('#hdr');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (hdr) {
      hdr.classList.toggle('is-solid', y > 40);
      hdr.classList.toggle('is-hidden', y > 420 && y > lastY && !document.body.classList.contains('menu-open'));
    }
    var wf = $('#waFloat');
    if (wf) wf.classList.toggle('is-in', y > 620);
    var bb = $('.bookbar');
    if (bb) bb.classList.toggle('is-in', y > 520);
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile drawer -------------------------------------- */
  var burger = $('#burger');
  var drawer = $('#drawer');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', String(open));
    if (drawer) {
      if (open) { drawer.hidden = false; }
      else { setTimeout(function () { if (!document.body.classList.contains('menu-open')) drawer.hidden = true; }, 700); }
    }
  }
  if (burger) burger.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  if (drawer) $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); closeSheet(); }
  });

  /* ---------------- word-split heading reveal ---------------------------
     Deferred to idle time so it never lands on the critical path. */
  function splitOne(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.style.setProperty('--i', i);
      var inner = document.createElement('i');
      inner.textContent = w;
      span.appendChild(inner);
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* ---------------- reveal on scroll ----------------------------------- */
  var io;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target.hasAttribute('data-split')) splitOne(en.target);
        en.target.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('.rv, .rv-mask, .fig-rv, [data-routemap]').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv, .rv-mask, .fig-rv, [data-split], [data-routemap]').forEach(function (el) { el.classList.add('is-in'); });
  }

  var hero = $('.hero') || $('.thero');
  if (hero) requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('is-in'); }, 60); });

  /* ---------------- the hero, moving through the country ----------------
     Mostar is where every journey starts, so it opens; the rest of the
     country follows, one slow crossfade at a time. */
  var slides = $$('[data-heroslides] .hero__slide');
  if (slides.length > 1 && !reduce) requestIdle(function () {
    var placeEl = $('[data-heroplace]'), at = 0;
    slides.forEach(function (f, i) {
      if (!i) return;
      var im = $('img', f), src = im && im.getAttribute('data-src');
      if (im && src) { im.setAttribute('src', src); im.removeAttribute('data-src'); }
    });
    setInterval(function () {
      if (document.hidden || scrollY > innerHeight * 1.4) return;
      slides[at].classList.remove('is-on');
      at = (at + 1) % slides.length;
      slides[at].classList.add('is-on');
      if (placeEl) placeEl.textContent = slides[at].getAttribute('data-place') || '';
    }, 6800);
  });

  /* ---------------- pillar hover image (desktop) ----------------------- */
  var pillarImg = $('#pillarImg');
  if (pillarImg && matchMedia('(min-width:860px)').matches && matchMedia('(hover:hover)').matches && !reduce) {
    var pImg = $('img', pillarImg);
    var raf = null, tx = 0, ty = 0, cx = 0, cy = 0, showing = false;
    $$('.pillar').forEach(function (p) {
      p.addEventListener('mouseenter', function () {
        var src = p.getAttribute('data-img');
        if (src && pImg.getAttribute('src') !== src) pImg.setAttribute('src', src);
        showing = true; pillarImg.style.opacity = '1'; pillarImg.style.transform = 'translate(-50%,-50%) scale(1)';
      });
      p.addEventListener('mouseleave', function () {
        showing = false; pillarImg.style.opacity = '0'; pillarImg.style.transform = 'translate(-50%,-50%) scale(.94)';
      });
    });
    addEventListener('mousemove', function (e) { tx = e.clientX + 150; ty = e.clientY; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    function tick() {
      cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
      pillarImg.style.left = cx + 'px'; pillarImg.style.top = cy + 'px';
      raf = showing || Math.abs(tx - cx) > 0.5 ? requestAnimationFrame(tick) : null;
    }
  }

  /* ---------------- timeline progress ---------------------------------- */
  var tl = $('#tl'), tlProg = $('#tlProg');
  if (tl && tlProg) {
    var items = $$('.tl__item', tl);
    var ticking = false;
    function tlUpdate() {
      ticking = false;
      var r = tl.getBoundingClientRect();
      var mark = innerHeight * 0.55;
      var p = Math.min(Math.max((mark - r.top) / r.height, 0), 1);
      tlProg.style.height = (p * (r.height - 32)) + 'px';
      items.forEach(function (it) {
        var ir = it.getBoundingClientRect();
        it.classList.toggle('is-on', ir.top < mark);
      });
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(tlUpdate); } }, { passive: true });
    addEventListener('resize', tlUpdate, { passive: true });
    tlUpdate();
  }

  /* ---------------- WhatsApp message builders -------------------------- */
  function fmtDate(v) {
    if (!v) return '';
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d)) return v;
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function bookingMessage(o) {
    var L = [];
    L.push('Hello Merak Tours!');
    L.push('');
    L.push('I would like to check availability for:');
    L.push('• Tour: ' + (o.tourName || '—'));
    L.push('• Preferred date: ' + (o.date ? fmtDate(o.date) : 'still flexible'));
    L.push('• Travellers: ' + (o.guests || '—'));
    L.push('• Pickup location: ' + (o.pickup ? o.pickup : 'to be confirmed'));
    if (o.note && o.note.trim()) { L.push(''); L.push('Notes: ' + o.note.trim()); }
    L.push('');
    L.push('Thank you!');
    return L.join('\n');
  }
  function journeyMessage(o) {
    var L = [];
    L.push('Hello Merak Tours!');
    L.push('');
    L.push('I would like to create my own journey in Bosnia and Herzegovina.');
    if (o.interests.length) L.push('• Interests: ' + o.interests.join(', '));
    if (o.places.length) L.push('• Places I have in mind: ' + o.places.join(', '));
    L.push('• Preferred date: ' + (o.date ? fmtDate(o.date) : 'still flexible'));
    L.push('• Travellers: ' + (o.guests || '—'));
    L.push('• Pickup location: ' + (o.pickup ? o.pickup : 'to be confirmed'));
    if (o.note && o.note.trim()) { L.push(''); L.push('Notes: ' + o.note.trim()); }
    L.push('');
    L.push('Could you help me put a route together? Thank you!');
    return L.join('\n');
  }
  function openWa(text) {
    // An anchor click is the only handoff that survives iOS Safari, Android
    // Chrome and desktop popup blockers without hijacking the current tab.
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); }, 0);
  }

  /* ---------------- booking sheet -------------------------------------- */
  var sheet = $('#sheet'), form = $('#bookForm'), preview = $('#bookPreview');
  var lastFocus = null;

  function readBooking() {
    return {
      tourName: $('#bookTourName') ? $('#bookTourName').value : '',
      date: $('#bookDate') ? $('#bookDate').value : '',
      guests: $('#bookGuests') ? $('#bookGuests').value : '',
      pickup: $('#bookPickup') ? $('#bookPickup').value : '',
      note: $('#bookNote') ? $('#bookNote').value : ''
    };
  }
  function refreshBooking() { if (preview) preview.textContent = bookingMessage(readBooking()); }

  function openSheet(tourName) {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    var sel = $('#bookTourName');
    if (sel && tourName) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === tourName) { sel.selectedIndex = i; break; }
      }
    }
    refreshBooking();
    var first = $('#bookDate');
    if (first) setTimeout(function () { first.focus(); }, 350);
  }
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { sheet.hidden = true; }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-book]').forEach(function (b) {
    b.addEventListener('click', function () { openSheet(b.getAttribute('data-book')); });
  });
  var sheetClose = $('#sheetClose');
  if (sheetClose) sheetClose.addEventListener('click', closeSheet);
  if (sheet) sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  if (form) {
    form.addEventListener('input', refreshBooking);
    form.addEventListener('change', refreshBooking);
    form.addEventListener('submit', function (e) { e.preventDefault(); openWa(bookingMessage(readBooking())); });
    refreshBooking();
  }
  // focus trap
  if (sheet) sheet.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href],button:not([disabled]),input,select,textarea', sheet).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------------- journey builder ------------------------------------ */
  var jForm = $('#journeyForm'), jPrev = $('#journeyPreview');
  function readJourney() {
    return {
      interests: $$('input[name="interest"]:checked', jForm).map(function (i) { return i.value; }),
      places: $$('input[name="place"]:checked', jForm).map(function (i) { return i.value; }),
      date: $('#jDate') ? $('#jDate').value : '',
      guests: $('#jGuests') ? $('#jGuests').value : '',
      pickup: $('#jPickup') ? $('#jPickup').value : '',
      note: $('#jNote') ? $('#jNote').value : ''
    };
  }
  if (jForm) {
    var refreshJourney = function () { if (jPrev) jPrev.textContent = journeyMessage(readJourney()); };
    jForm.addEventListener('input', refreshJourney);
    jForm.addEventListener('change', refreshJourney);
    jForm.addEventListener('submit', function (e) { e.preventDefault(); openWa(journeyMessage(readJourney())); });
    refreshJourney();
  }

  /* min date = today */
  var today = new Date();
  var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  $$('input[type="date"]').forEach(function (d) { d.min = iso; });

  /* ---------------- the places index ----------------------------------- */
  /* Reading the list moves the photograph. No canvas, no library — the
     whole thing is one class swap and a transform. */
  var pidx = $('#placesIndex');
  if (pidx) {
    var rows = $$('.pidx__row', pidx);
    var shots = $$('.pidx__shot', pidx);
    var cue = $('.pidx__cue', pidx);
    var pCur = 0, pRaf = 0;

    var showPlace = function (i) {
      if (i === pCur || !shots[i]) return;
      pCur = i;
      rows.forEach(function (r, n) { r.classList.toggle('is-on', n === i); });
      shots.forEach(function (f, n) { f.classList.toggle('is-on', n === i); });
    };

    rows.forEach(function (r, i) {
      r.addEventListener('mouseenter', function () { showPlace(i); });
      r.addEventListener('focusin', function () { showPlace(i); });
    });

    /* a small bubble that follows the pointer over the list — the only
       cursor flourish on the site, and only where it means "open this" */
    if (cue && matchMedia('(min-width: 900px) and (hover: hover)').matches && !reduce) {
      var list = $('.pidx__list', pidx), cueX = 0, cueY = 0;
      pidx.addEventListener('pointermove', function (e) {
        var b = pidx.getBoundingClientRect();
        cueX = e.clientX - b.left; cueY = e.clientY - b.top;
        if (pRaf) return;
        pRaf = requestAnimationFrame(function () {
          pRaf = 0;
          cue.style.setProperty('--cx', cueX + 'px');
          cue.style.setProperty('--cy', cueY + 'px');
        });
      });
      list.addEventListener('pointerenter', function () { pidx.classList.add('is-pointing'); });
      list.addEventListener('pointerleave', function () { pidx.classList.remove('is-pointing'); });
    }
  }

  /* ---------------- the journey: an atlas that draws itself --------------
     One SVG, one scroll listener. The line is the hero; everything else
     follows it. No canvas, no library, nothing to download. */
  var jsec = $('#journey');
  function bootJourney() {
    var tours = [];
    try { tours = JSON.parse(jsec.getAttribute('data-tours') || '[]'); } catch (e) { return; }
    if (!tours.length) return;

    var SHEET_W = 909, SHEET_H = 947;                 // set by the atlas builder
    var svg = $('#atlas');
    if (svg) {
      var vb = (svg.getAttribute('viewBox') || '').split(/\s+/);
      if (vb.length === 4) { SHEET_W = +vb[2]; SHEET_H = +vb[3]; }
    }

    /* ---- the day as a strip of scroll ---------------------------------- */
    function segmentsFor(t) {
      var segs = [], i;
      for (i = 0; i < t.stops.length; i++) {
        var s = t.stops[i];
        if (i > 0 && s.node > t.stops[i - 1].node) {
          segs.push({ kind: 'drive', from: t.stops[i - 1].node, to: s.node, si: i });
        }
        segs.push({ kind: 'dwell', si: i, mins: s.mins || 45 });
      }
      segs.push({ kind: 'end' });
      var total = 0;
      segs.forEach(function (g) {
        g.w = g.kind === 'drive' ? 1 : g.kind === 'end' ? 1.15
            : Math.max(.7, Math.min(1.9, .62 + Math.sqrt(Math.max(10, g.mins) / 60) * .5));
        total += g.w;
      });
      var acc = 0;
      segs.forEach(function (g) { g.p0 = acc / total; acc += g.w; g.p1 = acc / total; });
      return segs;
    }

    /* where each stop sits along the drawn line */
    function measure(path, stops) {
      var L = path.getTotalLength();
      if (!L) return stops.map(function (s, i) { return i / Math.max(1, stops.length - 1); });
      var N = 260, pts = [], i;
      for (i = 0; i <= N; i++) pts.push(path.getPointAtLength(L * i / N));
      return stops.map(function (s) {
        var best = 0, bd = Infinity;
        for (i = 0; i <= N; i++) {
          var dx = pts[i].x - s.x, dy = pts[i].y - s.y, d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = i; }
        }
        return best / N;
      });
    }

    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

    tours.forEach(function (t) { t.segs = segmentsFor(t); });

    /* ---- desktop: the sheet and the story ------------------------------ */
    var track = $('#journeyTrack');
    var wide = matchMedia('(min-width: 900px)');
    /* the live layer must be found before anything reaches into it */
    var live = $('#atlasLive');
    var liveView = live && $('[data-live-view]', live);
    var routes = live ? $$('.atlas__route', live) : [];
    var ghosts = live ? $$('.atlas__ghost', live) : [];
    var view = svg && $('[data-view]', svg);
    var marks = live && $('[data-marks]', live);
    var rose = live && $('[data-rose]', live);
    var scale = live && $('[data-scale]', live);
    var scaleBar = live && $('[data-scalebar]', live);
    var scaleLabel = live && $('[data-scalelabel]', live);
    var counters = svg ? $$('[data-ctr]', svg) : [];
    var shot = $('[data-jshot]'), shotImgs = shot ? $$('img', shot) : [];
    var text = $('.jsec__text'), stepEl = $('[data-jstep]'), nameEl = $('[data-jname]');
    var timeEl = $('[data-jtime]'), descEl = $('[data-jdesc]'), tagsEl = $('[data-jtags]');
    var dotsEl = $('[data-jdots]'), ctaEl = $('[data-jcta]'), capEl = $('[data-jcaption]');
    var tabs = $$('[data-jtour]');

    var cur = 0, layer = 0, shotSrc = '', phase = '', lens = [], stopAt = [];
    /* the sheet is cropped to fill the panel, so the compass and the scale bar
       are placed against what is actually on screen */
    var vis = { x: 0, y: 0, w: SHEET_W, h: SHEET_H };
    function layout() {
      if (!svg) return;
      var r = svg.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var ratio = Math.max(r.width / SHEET_W, r.height / SHEET_H);
      vis.w = r.width / ratio; vis.h = r.height / ratio;
      vis.x = (SHEET_W - vis.w) / 2; vis.y = (SHEET_H - vis.h) / 2;
      if (rose) rose.setAttribute('transform', 'translate(' + (vis.x + vis.w - 46).toFixed(0) + ' ' + (vis.y + 58).toFixed(0) + ')');
      if (scale) scale.setAttribute('transform', 'translate(' + (vis.x + vis.w - 46).toFixed(0) + ' ' + (vis.y + vis.h - 42).toFixed(0) + ')');
    }
    var vw = { x: 0, y: 0, k: 1 }, vwT = { x: 0, y: 0, k: 1 }, raf = 0, needsFrame = false;
    var KM_PER_UNIT = 111.32 / 640;

    /* a marker and its name, drawn once per place of the active journey */
    var markNode = {}, pathLen = 0, lastK = -1;
    function buildMarks(t) {
      if (!marks) return;
      var seen = {}, html = '';
      t.stops.forEach(function (s) {
        if (seen[s.key]) return;
        seen[s.key] = 1;
        var o = LABELS[s.key] || [0, -17, 'middle'];
        html += '<g class="atlas__place" data-place="' + s.key + '">' +
          '<circle class="atlas__halo" cx="0" cy="0" r="15"/>' +
          '<circle class="atlas__dot" cx="0" cy="0" r="4.4"/>' +
          '<text class="atlas__name" x="' + o[0] + '" y="' + o[1] + '" text-anchor="' + o[2] + '">' +
          s.key.charAt(0).toUpperCase() + '</text></g>';
      });
      marks.innerHTML = html;
      markNode = {};
      $$('.atlas__place', marks).forEach(function (g) {
        var k = g.getAttribute('data-place');
        markNode[k] = g;
        g.querySelector('.atlas__name').textContent = PLACE_NAMES[k] || k;
      });
    }

    var LABELS = {
      mostar: [0, -17, 'middle'], fortica: [15, 6, 'start'], blagaj: [14, 15, 'start'],
      pocitelj: [14, 14, 'start'], kravice: [-14, 14, 'end'],
      jablanica: [-15, 5, 'end'], sarajevo: [0, -17, 'middle']
    };
    var PLACE_NAMES = {
      mostar: 'Mostar', fortica: 'Fortica', blagaj: 'Blagaj', pocitelj: 'Počitelj',
      kravice: 'Kravice', jablanica: 'Jablanica', sarajevo: 'Sarajevo'
    };

    function frameFor(box) {
      var k = clamp(Math.min(SHEET_W * .46 / Math.max(box.w, 1), SHEET_H * .46 / Math.max(box.h, 1)), 1, 2.6);
      return { k: k, cx: box.x + box.w / 2, cy: box.y + box.h / 2 };
    }

    function applyView() {
      if (!view) return;
      var k = vw.k;
      var tx = clamp(vw.x, SHEET_W - k * SHEET_W, 0);
      var ty = clamp(vw.y, SHEET_H - k * SHEET_H, 0);
      var tf = 'translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ') scale(' + k.toFixed(3) + ')';
      view.setAttribute('transform', tf);
      if (liveView) liveView.setAttribute('transform', tf);
      vw.tx = tx; vw.ty = ty;
      /* labels and town dots are drawn back down to their printed size —
         only when the zoom actually changes, which is on a tour switch */
      if (Math.abs(k - lastK) > 1e-4) {
        lastK = k;
        if (live) live.style.setProperty('--k', k.toFixed(3));
        var ik = (1 / k).toFixed(4);
        for (var c = 0; c < counters.length; c++) counters[c].setAttribute('transform', 'scale(' + ik + ')');
      }
      if (scaleBar && scaleLabel) {
        var opts = [5, 10, 20, 50, 100], km = 5, px = 5 / KM_PER_UNIT * k;
        for (var i = opts.length - 1; i >= 0; i--) {
          var w = opts[i] / KM_PER_UNIT * k;
          if (w < Math.min(150, vis.w * .3)) { km = opts[i]; px = w; break; }
        }
        scaleBar.setAttribute('d', 'M' + (-px).toFixed(1) + ' 0 H0 M' + (-px).toFixed(1) + ' -4 V4 M0 -4 V4');
        scaleLabel.setAttribute('x', (-px).toFixed(1));
        scaleLabel.textContent = km + ' km';
      }
    }

    function placeMarks(t, drawn, moved) {
      if (!marks) return;
      var k = vw.k, tx = vw.tx, ty = vw.ty, seen = {}, i, g;
      for (i = 0; i < t.stops.length; i++) {
        var st = t.stops[i];
        g = markNode[st.key];
        if (!g) continue;
        if (moved) g.setAttribute('transform', 'translate(' + (st.x * k + tx).toFixed(1) + ' ' + (st.y * k + ty).toFixed(1) + ')');
        if (drawn >= stopAt[i] - .004) seen[st.key] = 1;
      }
      for (var key in markNode) markNode[key].classList.toggle('is-on', !!seen[key]);
    }

    function setShot(src) {
      if (!shot || !src || src === shotSrc) return;
      shotSrc = src;
      var next = shotImgs[layer ? 0 : 1], prev = shotImgs[layer];
      if (!next) return;
      var show = function () {
        next.classList.add('is-on');
        if (prev) prev.classList.remove('is-on');
        layer = layer ? 0 : 1;
      };
      if (next.getAttribute('src') === src) return show();
      next.onload = show; next.onerror = show;
      next.setAttribute('src', src);
    }

    function say(step, name, time, desc, tags) {
      if (stepEl) stepEl.textContent = step;
      if (nameEl) nameEl.textContent = name;
      if (timeEl) timeEl.textContent = time;
      if (descEl) descEl.textContent = desc;
      if (tagsEl) tagsEl.textContent = tags || '';
      if (text) { text.classList.remove('is-swap'); void text.offsetWidth; text.classList.add('is-swap'); }
    }

    function progress() {
      if (!track) return 0;
      var span = track.offsetHeight - innerHeight;
      if (span <= 0) return 0;
      return clamp(-track.getBoundingClientRect().top / span, 0, 1);
    }

    /* everything the map shows for one point in the day */
    var lastDrawn = -1, lastVX = -1, lastVY = -1;
    function paint(drawn, nowKey, nowIdx, hideVan) {
      var t = tours[cur], path = routes[cur], i;
      var moved = Math.abs(vw.tx - lastVX) > .05 || Math.abs(vw.ty - lastVY) > .05;
      if (moved) { lastVX = vw.tx; lastVY = vw.ty; }
      if (Math.abs(drawn - lastDrawn) < .0004 && !moved) return;
      lastDrawn = drawn;
      if (path) path.style.strokeDashoffset = String(Math.round(1000 * (1 - clamp(drawn, 0, 1))));
      var vanG = marks && marks.querySelector('.atlas__van');
      if (path && vanG) {
        if (!pathLen) pathLen = path.getTotalLength();
        var pt = path.getPointAtLength(pathLen * clamp(drawn, 0, 1));
        vanG.setAttribute('transform', 'translate(' + (pt.x * vw.k + vw.tx).toFixed(1) + ' ' + (pt.y * vw.k + vw.ty).toFixed(1) + ')');
        vanG.classList.toggle('is-on', !hideVan);
        /* on a wide screen the sheet drifts a little with the traveller; on a
           phone it stays put, which is both calmer and a great deal cheaper */
        var fr = frameFor(t.box);
        vwT.k = fr.k;
        var pull = wide.matches ? .22 : 0;
        vwT.x = SHEET_W / 2 - fr.k * (fr.cx + (pt.x - fr.cx) * pull);
        vwT.y = SHEET_H / 2 - fr.k * (fr.cy + (pt.y - fr.cy) * pull);
      }
      placeMarks(t, drawn, moved);
      if (marks) $$('.atlas__place', marks).forEach(function (g) {
        g.classList.toggle('is-now', g.getAttribute('data-place') === nowKey);
      });
      if (dotsEl) {
        var kids = dotsEl.children;
        for (i = 0; i < kids.length; i++) {
          kids[i].classList.toggle('is-done', drawn >= stopAt[i] - .004);
          kids[i].classList.toggle('is-now', i === nowIdx);
        }
      }
    }

    function render(p) {
      var t = tours[cur], segs = t.segs, seg = segs[segs.length - 1], f = 1, i;
      for (i = 0; i < segs.length; i++) {
        if (p <= segs[i].p1 || i === segs.length - 1) {
          seg = segs[i];
          f = seg.p1 > seg.p0 ? clamp((p - seg.p0) / (seg.p1 - seg.p0), 0, 1) : 1;
          break;
        }
      }
      var drawn;
      if (seg.kind === 'drive') {
        var a = stopAt[seg.si - 1] != null ? stopAt[seg.si - 1] : 0;
        drawn = a + (stopAt[seg.si] - a) * easeInOut(f);
      } else if (seg.kind === 'dwell') drawn = stopAt[seg.si];
      else drawn = 1;

      paint(drawn, seg.kind === 'dwell' ? t.stops[seg.si].key : null,
            seg.kind === 'dwell' ? seg.si : -1, seg.kind === 'end' && f >= .4);

      var key = seg.kind + ':' + (seg.si != null ? seg.si : '');
      if (key !== phase) {
        phase = key;
        if (seg.kind === 'dwell') {
          var s = t.stops[seg.si];
          say('Stop ' + (seg.si + 1) + ' of ' + t.stops.length, s.name, s.time, s.note, s.tags);
          setShot(s.shot);
        } else if (seg.kind === 'drive') {
          var to = t.stops[seg.si];
          say('On the road', 'Towards ' + to.name, to.drive ? to.drive + ' drive' : '', '', '');
          setShot(to.shot);
        } else {
          var last = t.stops[t.stops.length - 1];
          say('The whole day', t.name, t.duration, 'Back in Mostar, where the day started.', '');
          setShot(last.shot);
        }
      }
    }

    function tick() {
      raf = 0;
      var k = .12;
      if (!wide.matches) {
        vw.k += (vwT.k - vw.k) * k; vw.x += (vwT.x - vw.x) * k; vw.y += (vwT.y - vw.y) * k;
        applyView(); mobDraw();
        if (Math.abs(vwT.k - vw.k) > 1e-4 || Math.abs(vwT.x - vw.x) > .2) queue();
        return;
      }
      vw.k += (vwT.k - vw.k) * k;
      vw.x += (vwT.x - vw.x) * k;
      vw.y += (vwT.y - vw.y) * k;
      applyView();
      render(progress());
      if (Math.abs(vwT.k - vw.k) > 1e-4 || Math.abs(vwT.x - vw.x) > .2 || Math.abs(vwT.y - vw.y) > .2) queue();
    }
    function queue() { if (!raf) raf = requestAnimationFrame(tick); }

    function select(i, fromClick) {
      cur = clamp(i, 0, tours.length - 1);
      var t = tours[cur];
      tabs.forEach(function (b) { b.setAttribute('aria-selected', String(+b.getAttribute('data-jtour') === cur)); });
      routes.forEach(function (r, n) { r.classList.toggle('is-on', n === cur); r.style.strokeDashoffset = '1000'; });
      ghosts.forEach(function (r, n) { r.classList.toggle('is-on', n === cur); });
      if (ctaEl) { ctaEl.setAttribute('href', t.href); ctaEl.setAttribute('aria-label', 'Book journey ' + t.num + ' — ' + t.name); }
      if (capEl) capEl.textContent = 'Journey ' + t.num + ' · ' + t.name + ' · ' + t.duration;
      if (dotsEl) dotsEl.innerHTML = t.stops.map(function () { return '<li></li>'; }).join('');
      buildMarks(t);
      if (marks && !marks.querySelector('.atlas__van')) {
        marks.insertAdjacentHTML('beforeend',
          '<g class="atlas__van"><circle class="atlas__vanShadow" cx="0" cy="3" r="11"/>' +
          '<circle class="atlas__vanDisc" cx="0" cy="0" r="10.5"/>' +
          '<g class="atlas__vanMark" transform="translate(-7.5,-5)">' +
          '<path d="M0.6 7.4V3.1c0-.7.6-1.3 1.3-1.3h5.4l2.4 2.2h2.9c.8 0 1.4.6 1.4 1.4v2" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round"/>' +
          '<path d="M0.6 7.4h1.5m2.9 0h4.7m2.9 0h1.4" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/>' +
          '<circle cx="3.3" cy="7.9" r="1.35" fill="none" stroke="currentColor" stroke-width="1.05"/>' +
          '<circle cx="11" cy="7.9" r="1.35" fill="none" stroke="currentColor" stroke-width="1.05"/></g></g>');
      }
      pathLen = 0; lastDrawn = -1;
      stopAt = routes[cur] ? measure(routes[cur], t.stops) : t.stops.map(function (s, n) { return n / Math.max(1, t.stops.length - 1); });
      lens = stopAt;
      phase = '';
      /* the sheet settles onto the new route */
      var fr = frameFor(t.box);
      vwT.k = fr.k; vwT.x = SHEET_W / 2 - fr.k * fr.cx; vwT.y = SHEET_H / 2 - fr.k * fr.cy;
      /* mobile: swap which story is on screen */
      stories.forEach(function (o, n) { o.hidden = n !== cur; o.classList.toggle('is-on', n === cur); });
      mstops = stories[cur] ? $$('.mstop', stories[cur]) : [];
      t.stops.forEach(function (s) { if (s.shot) { var im = new Image(); im.decoding = 'async'; im.src = wide.matches ? s.shot : s.shotSm; } });
      queue();
      mobDraw();
      if (fromClick && track && wide.matches && progress() > .03) track.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---- phone: the vertical story -------------------------------------- */
    var stories = $$('[data-mtour]');
    var mstops = stories[0] ? $$('.mstop', stories[0]) : [];
    var mrail = $('[data-mrail]'), mvan = $('[data-mvan]'), mrailBox = $('.mrail');

    /* On a phone the story below drives the same map above it: whichever
       stop you are reading, the line has drawn exactly that far. */
    function mobDraw() {
      if (wide.matches || !mstops.length || !mrailBox) return;
      var box = mrailBox.getBoundingClientRect();
      var mark = innerHeight * .54;
      var now = -1, i;
      for (i = 0; i < mstops.length; i++) {
        var r = mstops[i].getBoundingClientRect();
        if (r.top <= mark) now = i;
        /* revealed just before it arrives, so a fast scroll never lands on an empty frame */
        mstops[i].classList.toggle('is-on', r.top < innerHeight * 1.15);
      }
      for (i = 0; i < mstops.length; i++) mstops[i].classList.toggle('is-now', i === now);
      var fill = clamp((mark - box.top) / Math.max(1, box.height), 0, 1);
      if (mrail) mrail.style.height = (fill * 100).toFixed(2) + '%';
      if (mvan) mvan.style.transform = 'translateY(' + (fill * box.height - 8).toFixed(1) + 'px)';

      var t = tours[cur], last = stopAt.length - 1, drawn = 0, nowKey = null;
      if (now >= 0) {
        var a = stopAt[Math.min(now, last)], b2 = stopAt[Math.min(now + 1, last)];
        var rr = mstops[now].getBoundingClientRect();
        var f = clamp((mark - rr.top) / Math.max(1, rr.height), 0, 1);
        /* the van waits at the stop you are reading about, and only sets off
           as the next one comes up the screen */
        var go = clamp((f - .58) / .42, 0, 1);
        drawn = a + (b2 - a) * (go * go * (3 - 2 * go));
        if (t.stops[now]) nowKey = go < .5 ? t.stops[now].key : null;
      }
      paint(drawn, nowKey, now, now >= last && drawn > .999);
    }

    /* ---- wiring --------------------------------------------------------- */
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        select(+b.getAttribute('data-jtour'), true);
        if (b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    });

    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', function () { layout(); queue(); mobDraw(); });

    jsec.classList.add('is-live');
    layout();
    select(0);
    vw.k = vwT.k; vw.x = vwT.x; vw.y = vwT.y;
    applyView();
    queue();
    mobDraw();
  }

  if (jsec && !reduce) {
    if ('IntersectionObserver' in window) {
      var jio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { jio.disconnect(); bootJourney(); }
      }, { rootMargin: '700px' });
      jio.observe(jsec);
    } else bootJourney();
  }

  /* ---------------- the ambient layer -----------------------------------
     Four small things, all on one scroll listener and one pointer listener,
     so the page keeps breathing without costing a frame. */
  if (!reduce) requestIdle(function () {
    var prog = $('#progress');
    var pars = $$('[data-par]');
    var parState = [];
    var ambTick = false;

    var measurePars = function () {
      parState = pars.map(function (el) {
        var im = el.tagName === 'IMG' ? el : $('img', el);
        var r = el.getBoundingClientRect();
        return im ? { el: el, im: im, top: r.top + scrollY, h: r.height,
                      amt: parseFloat(el.getAttribute('data-par')) || 14 } : null;
      }).filter(Boolean);
    };
    measurePars();

    var ambient = function () {
      if (ambTick) return;
      ambTick = true;
      requestAnimationFrame(function () {
        ambTick = false;
        var y = scrollY, vh = innerHeight;

        /* how far through the page you are */
        if (prog) {
          var max = document.documentElement.scrollHeight - vh;
          prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
        }

        /* photographs drift a little slower than the page they sit in */
        for (var i = 0; i < parState.length; i++) {
          var p = parState[i];
          var mid = p.top + p.h / 2 - y;
          if (mid < -p.h || mid > vh + p.h) continue;
          var t = (mid - vh / 2) / vh;
          p.im.style.transform = 'translate3d(0,' + (t * -p.amt).toFixed(1) + 'px,0) scale(1.09)';
        }
      });
    };
    addEventListener('scroll', ambient, { passive: true });
    addEventListener('resize', function () { measurePars(); ambient(); });
    ambient();

    /* the journey cards lean a little toward the cursor */
    if (matchMedia('(min-width: 900px) and (hover: hover)').matches) {
      $$('.jcard').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var b = card.getBoundingClientRect();
          card.style.setProperty('--mx', (((e.clientX - b.left) / b.width - .5) * -16).toFixed(1) + 'px');
          card.style.setProperty('--my', (((e.clientY - b.top) / b.height - .5) * -16).toFixed(1) + 'px');
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--mx', '0px'); card.style.setProperty('--my', '0px');
        });
      });

      /* buttons reach for the cursor when it comes close */
      $$('.btn').forEach(function (b) {
        var raf = 0, tx = 0, ty = 0;
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - .5) * 10;
          ty = ((e.clientY - r.top) / r.height - .5) * 8;
          if (raf) return;
          raf = requestAnimationFrame(function () {
            raf = 0; b.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
          });
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
      });
    }
  });

  /* ---------------- smooth in-page focus ------------------------------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
      t.setAttribute('tabindex', '-1');
      setTimeout(function () { t.focus({ preventScroll: true }); }, 500);
    });
  });
})();
