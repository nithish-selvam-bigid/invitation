/* ============================================================================
   app.js — renders window.INVITE into the page.
   Small independent "components", each an IIFE-free init function called once
   at the bottom. No dependencies, no build step.
   ========================================================================= */

(function () {
  'use strict';

  const C = window.INVITE;
  if (!C) { console.error('config.js did not load'); return; }

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Reads a dotted path ("couple.groom") out of the config object. */
  const get = (path) =>
    path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), C);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── text binding ───────────────────────────────────────────────────────
     Any element with data-c="path" receives the config value as text.       */
  function bindText() {
    $$('[data-c]').forEach((node) => {
      const value = get(node.dataset.c);
      node.textContent = value == null ? '' : String(value);
    });
  }

  /* ── document head (in-app share sheets, tab title) ─────────────────── */
  function bindMeta() {
    const title = `${C.couple.shortTitle} — ${C.event.title}`;
    document.title = title;

    const set = (selector, value) => {
      const node = $(selector);
      if (node) node.setAttribute('content', value);
    };
    set('meta[name="description"]',
      `${C.event.invitationLine} ${C.couple.groom} & ${C.couple.bride}. ` +
      `${C.event.dateLabel}, ${C.venue.name}.`);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]',
      `${C.couple.tagline} ${C.event.dateLabel} · ${C.venue.name}.`);
  }

  /* ── venue block + action links ─────────────────────────────────────── */
  function bindVenue() {
    const address = $('#venueAddress');
    if (address) {
      address.textContent = '';
      C.venue.addressLines.forEach((line, i) => {
        if (i) address.appendChild(document.createElement('br'));
        address.appendChild(document.createTextNode(line));
      });
    }

    const map = $('#mapBtn');
    if (map) {
      if (C.venue.mapUrl) map.href = C.venue.mapUrl;
      else map.hidden = true;
    }
  }

  /* ── couple photograph ──────────────────────────────────────────────── */
  function bindCouple() {
    const photo = $('#couplePhoto');
    if (!photo) return;

    // no photograph yet — drop the frame rather than show a placeholder
    if (!C.couple.photo) {
      const figure = photo.closest('.couple__figure');
      if (figure) figure.remove();
      return;
    }

    photo.src = C.couple.photo;
    photo.alt = C.couple.photoAlt || `${C.couple.groom} and ${C.couple.bride}`;
  }

  /* ── family cards ───────────────────────────────────────────────────── */
  function renderFamily(target, data) {
    const host = $(target);
    if (!host || !data) return;

    host.appendChild(el('p', 'family-card__heading', data.heading));
    host.appendChild(el('p', 'family-card__relation', data.relation));

    const list = el('ul', 'family-card__parents');
    (data.parents || []).forEach((name) => list.appendChild(el('li', null, name)));
    host.appendChild(list);

    if (data.place) host.appendChild(el('p', 'family-card__place', data.place));
  }

  /* ── RSVP ───────────────────────────────────────────────────────────── */
  function bindRsvp() {
    const block = $('#rsvpBlock');
    const cfg = C.rsvp;
    if (!block || !cfg || !cfg.enabled) return;

    block.hidden = false;
    $('#rsvpLabel').textContent = cfg.label || 'RSVP';

    const wa = $('#whatsappBtn');
    wa.href = `https://wa.me/${cfg.whatsapp}?text=` +
      encodeURIComponent(`${cfg.message} — ${C.couple.groom} & ${C.couple.bride}`);

    const phone = $('#phoneBtn');
    phone.textContent = cfg.phoneDisplay;
    phone.href = 'tel:' + cfg.phoneDisplay.replace(/[^\d+]/g, '');
  }

  /* ── opening envelope ───────────────────────────────────────────────── */
  function initSeal() {
    const seal = $('#seal');
    const page = $('#page');
    const envelope = $('#envelope');
    const hint = $('#sealHint');
    if (!seal || !page || !envelope) return;

    if (!C.options.envelope) { seal.hidden = true; return; }

    page.classList.add('is-hidden');
    document.body.style.overflow = 'hidden';

    // flap swing + card rise, then the overlay clears
    const FLAP_MS = reducedMotion ? 0 : 1100;
    const CLEAR_MS = reducedMotion ? 0 : 700;

    let opened = false;

    function open() {
      if (opened) return;
      opened = true;

      envelope.classList.add('is-opening');
      if (hint) hint.classList.add('is-gone');

      setTimeout(() => {
        seal.classList.add('is-open');
        page.classList.remove('is-hidden');
        document.body.style.overflow = '';

        const hero = $('#hero');
        hero.setAttribute('tabindex', '-1');
        hero.focus({ preventScroll: true });

        setTimeout(() => { seal.hidden = true; }, CLEAR_MS + 200);
      }, FLAP_MS);
    }

    envelope.addEventListener('click', open);
    seal.addEventListener('click', open);            // tapping the backdrop works too
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') open();
    });
  }

  /* ── countdown ──────────────────────────────────────────────────────── */
  function initCountdown() {
    const section = $('#countdown');
    if (!section || !C.options.countdown) return;

    section.hidden = false;

    const target = new Date(C.event.startsAt).getTime();
    if (Number.isNaN(target)) { section.hidden = true; return; }

    const grid = $('#countdownGrid');
    const done = $('#countdownDone');
    const cells = {};
    $$('[data-unit]', section).forEach((node) => { cells[node.dataset.unit] = node; });

    const pad = (n) => String(n).padStart(2, '0');
    let timer;

    function tick() {
      const remaining = target - Date.now();

      if (remaining <= 0) {
        grid.hidden = true;
        done.hidden = false;
        done.classList.add('is-in');
        clearInterval(timer);
        return;
      }

      const total = Math.floor(remaining / 1000);
      cells.days.textContent    = pad(Math.floor(total / 86400));
      cells.hours.textContent   = pad(Math.floor((total % 86400) / 3600));
      cells.minutes.textContent = pad(Math.floor((total % 3600) / 60));
      cells.seconds.textContent = pad(total % 60);
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ── add to calendar (.ics built client-side) ───────────────────────── */
  function initCalendar() {
    const button = $('#calendarBtn');
    if (!button) return;

    const stamp = (value) =>
      new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const escape = (text) =>
      String(text).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Engagement Invitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@invitation`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(C.event.startsAt)}`,
      `DTEND:${stamp(C.event.endsAt)}`,
      `SUMMARY:${escape(`${C.event.title} — ${C.couple.groom} & ${C.couple.bride}`)}`,
      `LOCATION:${escape([C.venue.name].concat(C.venue.addressLines).join(', '))}`,
      `DESCRIPTION:${escape(C.event.invitationLine + ' ' + C.couple.groom + ' & ' + C.couple.bride)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    button.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  }

  /* ── section reveals ────────────────────────────────────────────────── */
  function initReveal() {
    const targets = $$('.reveal');

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((node) => node.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((node) => observer.observe(node));

    // stagger siblings inside a group for a softer cascade
    ['.detail-grid', '.countdown__grid', '.families__grid'].forEach((sel) => {
      const group = $(sel);
      if (!group) return;
      Array.from(group.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 0.12) + 's';
      });
    });
  }

  /* ── floating jasmine petals ────────────────────────────────────────── */
  function initFlowers() {
    const field = $('#flowers');
    if (!field || !C.options.floatingFlowers || reducedMotion) return;

    const frag = document.createDocumentFragment();
    const count = C.options.flowerCount || 12;

    for (let i = 0; i < count; i++) {
      const size = 12 + Math.random() * 12;
      const node = el('span', 'flower' + (i % 3 === 0 ? ' flower--gold' : ''));
      node.style.left = (Math.random() * 100) + 'vw';
      node.style.width = size + 'px';
      node.style.height = size + 'px';
      node.style.opacity = (0.35 + Math.random() * 0.4).toFixed(2);
      node.style.setProperty('--drift', (Math.random() * 12 - 6) + 'rem');
      node.style.animationDuration = (16 + Math.random() * 16) + 's';
      node.style.animationDelay = (-Math.random() * 28) + 's';
      node.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><use href="#jasmine" /></svg>';
      frag.appendChild(node);
    }
    field.appendChild(frag);
  }

  /* ── optional background music (never autoplays) ────────────────────── */
  function initMusic() {
    const button = $('#musicBtn');
    const audio = $('#audio');
    const label = $('#musicLabel');
    if (!button || !C.options.music || !C.options.musicSrc) return;

    audio.src = C.options.musicSrc;
    label.textContent = C.options.musicLabel || 'Play music';
    button.hidden = false;

    button.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          button.setAttribute('aria-pressed', 'true');
          label.textContent = 'Pause music';
        }).catch(() => {
          label.textContent = 'Audio unavailable';
        });
      } else {
        audio.pause();
        button.setAttribute('aria-pressed', 'false');
        label.textContent = C.options.musicLabel || 'Play music';
      }
    });
  }

  /* ── boot ───────────────────────────────────────────────────────────── */
  bindText();
  bindMeta();
  bindVenue();
  bindCouple();
  renderFamily('#familyGroom', C.families.groom);
  renderFamily('#familyBride', C.families.bride);
  bindRsvp();
  initSeal();
  initCountdown();
  initCalendar();
  initReveal();
  initFlowers();
  initMusic();
})();
