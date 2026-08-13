/* Coco Palms — landing page behaviour.
   Progressive enhancement: every section is readable and usable with JS off.
   One rAF-throttled scroll loop drives the progress bar, header, parallax
   and the sticky process section. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO  = 'IntersectionObserver' in window;

  /* ================= 1. Heading word-split =================
     Wraps each word in .wm > i so it can rise out of a mask.
     Done in JS so the markup stays readable; these headings are all
     below the fold, and the mask only engages once split. */
  function splitHeading(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'wm';
      span.style.setProperty('--wd', (i * 55) + 'ms');
      var it = document.createElement('i');
      it.textContent = w;
      span.appendChild(it);
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  if (!reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), splitHeading);
  }

  /* ================= 2. Reveal on scroll ================= */
  var revealables = document.querySelectorAll('[data-reveal], [data-mask], [data-split], [data-bars]');

  if (reduce || !hasIO) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
        if (entry.target.hasAttribute('data-reveal')) startCounters(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ================= 3. Count-up numerals ================= */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function startCounters(scope) {
    var nodes = scope.querySelectorAll('[data-count]');
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.dataset.done) return;
      node.dataset.done = '1';
      var target = parseFloat(node.getAttribute('data-count'));
      var dec = parseInt(node.getAttribute('data-dec') || '0', 10);
      if (reduce || isNaN(target)) return;
      var dur = 1500, t0 = null;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var v = target * easeOutExpo(p);
        node.textContent = dec
          ? v.toFixed(dec)
          : Math.round(v).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(frame);
      }
      node.textContent = dec ? (0).toFixed(dec) : '0';
      requestAnimationFrame(frame);
    });
  }

  /* ================= 4. Mobile drawer ================= */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var closeBtn = document.getElementById('drawerClose');
  var lastFocus = null;

  function setDrawer(open) {
    drawer.setAttribute('data-open', String(open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { lastFocus = document.activeElement; closeBtn.focus(); }
    else if (lastFocus) { lastFocus.focus(); }
  }
  burger.addEventListener('click', function () { setDrawer(true); });
  closeBtn.addEventListener('click', function () { setDrawer(false); });
  drawer.addEventListener('click', function (e) { if (e.target.tagName === 'A') setDrawer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') setDrawer(false);
  });

  /* ================= 5. Scroll-driven bits =================
     Sticky process pattern adapted from 21st.dev "Scroll 01"
     (felipemenezes098): a pinned media column crossfades between images
     while the text column scrolls, with the active index taken from
     whichever step sits closest to the viewport centre. */
  var hdr      = document.getElementById('hdr');
  var prog     = document.getElementById('prog');
  var toTop    = document.getElementById('toTop');
  var parNodes = document.querySelectorAll('[data-par]');

  var proc     = document.getElementById('proc');
  var procImgs = proc ? proc.querySelectorAll('.proc__media img') : [];
  var procSteps= proc ? proc.querySelectorAll('.pstep') : [];
  var procFill = document.getElementById('procFill');
  var procNum  = document.getElementById('procNum');
  var procLbl  = document.getElementById('procLbl');
  var procActive = -1;

  var lastY = window.scrollY;
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    /* progress bar */
    prog.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

    /* header: solid past the fold, hide when scrolling down */
    hdr.classList.toggle('is-stuck', y > 24);
    if (y > 420 && y > lastY + 4) hdr.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 200) hdr.classList.remove('is-hidden');
    lastY = y;

    /* back to top */
    toTop.classList.toggle('is-on', y > vh * 1.2);

    /* parallax */
    if (!reduce) {
      Array.prototype.forEach.call(parNodes, function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-par')) || 0;
        var offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    }

    /* sticky process */
    if (proc && procSteps.length && getComputedStyle(proc).display !== 'none') {
      var centre = vh * 0.5;
      var best = 0, bestDist = Infinity;
      for (var i = 0; i < procSteps.length; i++) {
        var pr = procSteps[i].getBoundingClientRect();
        var d = Math.abs(pr.top + pr.height / 2 - centre);
        if (d < bestDist) { bestDist = d; best = i; }
        /* fade steps by distance from centre so the active one reads loudest */
        var fade = Math.max(0.32, 1 - Math.min(d / (vh * 0.6), 1) * 0.72);
        procSteps[i].style.opacity = reduce ? 1 : fade.toFixed(2);
      }
      if (best !== procActive) {
        procActive = best;
        for (var j = 0; j < procImgs.length; j++) procImgs[j].classList.toggle('is-on', j === best);
        procNum.textContent = String(best + 1).padStart(2, '0');
        procLbl.textContent = procSteps[best].querySelector('h3').textContent;
      }
      /* progress line */
      var track = proc.querySelector('.proc__steps');
      var tr = track.getBoundingClientRect();
      var p = (centre - tr.top) / tr.height;
      procFill.style.height = (Math.max(0, Math.min(1, p)) * tr.height) + 'px';
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onFrame();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ================= 6. Active nav link ================= */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);

  if (sections.length && hasIO) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ================= 7. Enquiry form → mailto ================= */
  var form = document.getElementById('enquiryForm');
  var ok = document.getElementById('formOk');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var d = new FormData(form);
    var get = function (k) { return (d.get(k) || '').toString().trim(); };

    var body = [
      'Company:            ' + get('company'),
      'Contact:            ' + get('name'),
      'Email:              ' + get('email'),
      'Grade:              ' + get('grade'),
      'Annual volume:      ' + get('volume'),
      'Destination port:   ' + get('port'),
      '',
      'Specification:',
      get('message')
    ].join('\n');

    var href = 'mailto:info@blackboxtraders.in'
      + '?subject=' + encodeURIComponent('Export enquiry — ' + (get('company') || get('name')))
      + '&body=' + encodeURIComponent(body);

    ok.setAttribute('data-show', 'true');
    window.location.href = href;
  });

  /* ================= 8. Footer year ================= */
  document.getElementById('yr').textContent = new Date().getFullYear();
})();
