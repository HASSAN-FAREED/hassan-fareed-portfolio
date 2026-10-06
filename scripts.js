'use strict';

/* ==========================================================================
   Hassan Fareed | Portfolio
   Edit CONFIG first. Everything else reads from the HTML, so connector names
   and tool counts live in one place: the .connector rows in index.html.
   ========================================================================== */

const CONFIG = {
  name: 'Hassan Fareed',
  email: 'hassmireventures@gmail.com',
  linkedin: '',        // Paste your LinkedIn profile URL. The button stays hidden while this is empty.
  playStore: 'https://play.google.com/store/apps/details?id=com.aiquiz.ai_quiz_app',
  caseStudyUrl: ''     // Paste a shared link to the case study PDF. Empty means "request by email".
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Config: links and year ---------- */
function applyConfig() {
  $$('[data-link="email"]').forEach((a) => { a.href = 'mailto:' + CONFIG.email; });
  $$('[data-link="play"]').forEach((a) => { a.href = CONFIG.playStore; });

  $$('[data-link="linkedin"]').forEach((a) => {
    if (CONFIG.linkedin) {
      a.href = CONFIG.linkedin;
      a.hidden = false;
    } else {
      a.hidden = true;
    }
  });

  $$('[data-link="casestudy"]').forEach((a) => {
    if (CONFIG.caseStudyUrl) {
      a.href = CONFIG.caseStudyUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Read the case study';
    } else {
      const subject = encodeURIComponent('Case study request');
      const body = encodeURIComponent('Hi ' + CONFIG.name.split(' ')[0] + ',\n\nCould you share the custom MCP connectors case study?\n');
      a.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
    }
  });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Mobile navigation ---------- */
function setupNav() {
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

/* ---------- Highlight the section being read ---------- */
function setupNavHighlight() {
  if (!('IntersectionObserver' in window)) return;

  const links = $$('.site-nav a[href^="#"]');
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = byId.get(entry.target.id);
      if (!link || !entry.isIntersecting) return;
      links.forEach((l) => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/* ---------- Connector constellation (hero) ---------- */
function buildConstellation() {
  const host = $('#constellation');
  const panel = $('#node-panel');
  const rows = $$('.connector');
  if (!host || !rows.length) return;

  const NS = 'http://www.w3.org/2000/svg';
  const W = 640;
  const H = 560;
  const cx = W / 2;
  const cy = H / 2;
  const R = 190;

  const make = (tag, attrs, parent) => {
    const node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach((key) => node.setAttribute(key, attrs[key]));
    if (parent) parent.appendChild(node);
    return node;
  };

  const svg = make('svg', { viewBox: '0 0 ' + W + ' ' + H, focusable: 'false' });

  const defs = make('defs', {}, svg);
  const glow = make('radialGradient', { id: 'core-glow' }, defs);
  make('stop', { offset: '0%', 'stop-color': '#4fe3f0', 'stop-opacity': '0.95' }, glow);
  make('stop', { offset: '100%', 'stop-color': '#9d8cff', 'stop-opacity': '0.55' }, glow);

  make('circle', { cx: cx, cy: cy, r: R, class: 'orbit' }, svg);

  const count = rows.length;
  const nodes = rows.map((row, i) => {
    const angle = (-90 + (360 / count) * i) * Math.PI / 180;
    const tools = Number(row.dataset.tools);
    return {
      row: row,
      index: i,
      tools: tools,
      label: row.dataset.label,
      short: row.dataset.short || row.dataset.label,
      r: 11 + Math.sqrt(tools) * 1.45,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle)
    };
  });

  // Spokes and travelling pulses sit behind the nodes
  nodes.forEach((n) => {
    make('path', {
      d: 'M' + cx + ' ' + cy + 'L' + n.x.toFixed(1) + ' ' + n.y.toFixed(1),
      class: 'spoke',
      pathLength: '1',
      style: '--i:' + n.index
    }, svg);
  });

  if (!reducedMotion) {
    nodes.forEach((n) => {
      const pulse = make('circle', { r: '3', class: 'pulse', opacity: '0' }, svg);
      make('animateMotion', {
        path: 'M' + n.x.toFixed(1) + ' ' + n.y.toFixed(1) + 'L' + cx + ' ' + cy,
        dur: (3.2 + n.index * 0.45).toFixed(2) + 's',
        begin: (1.6 + n.index * 0.35).toFixed(2) + 's',
        repeatCount: 'indefinite'
      }, pulse);
      make('animate', {
        attributeName: 'opacity',
        values: '0;1;1;0',
        keyTimes: '0;0.15;0.85;1',
        dur: (3.2 + n.index * 0.45).toFixed(2) + 's',
        begin: (1.6 + n.index * 0.35).toFixed(2) + 's',
        repeatCount: 'indefinite'
      }, pulse);
    });
  }

  // Core
  make('circle', { cx: cx, cy: cy, r: '50', fill: 'url(#core-glow)', class: 'core' }, svg);
  const coreLabel = make('text', { x: cx, y: cy, class: 'core-label' }, svg);
  coreLabel.textContent = 'Claude';

  const defaultPanel = panel ? panel.textContent : '';
  const groups = new Map();

  const showPanel = (n) => {
    if (!panel) return;
    const detail = $('.c-body p', n.row);
    panel.textContent = '';
    const title = document.createElement('strong');
    title.textContent = n.label + ', ' + n.tools + (n.tools === 1 ? ' tool' : ' tools');
    panel.appendChild(title);
    panel.appendChild(document.createTextNode(detail ? detail.textContent : ''));
  };

  const setActive = (n) => {
    groups.forEach((g) => g.classList.remove('is-active'));
    groups.get(n.row.dataset.id).classList.add('is-active');
    showPanel(n);
  };

  const openRow = (n) => {
    n.row.open = true;
    n.row.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  };

  nodes.forEach((n) => {
    const g = make('g', {
      class: 'node',
      tabindex: '0',
      role: 'button',
      'aria-label': n.label + ', ' + n.tools + ' tools. Show details.',
      style: '--i:' + n.index
    }, svg);

    make('circle', { cx: n.x.toFixed(1), cy: n.y.toFixed(1), r: n.r.toFixed(1), class: 'shape' }, g);

    const num = make('text', { x: n.x.toFixed(1), y: n.y.toFixed(1), class: 'count' }, g);
    num.textContent = n.tools;

    // Label sits outside the ring, anchored away from the centre
    let lx;
    let ly;
    let anchor;
    if (Math.abs(n.cos) < 0.35) {
      anchor = 'middle';
      lx = n.x;
      ly = n.sin < 0 ? n.y - n.r - 12 : n.y + n.r + 14;
    } else {
      anchor = n.cos > 0 ? 'start' : 'end';
      lx = n.x + Math.sign(n.cos) * (n.r + 12);
      ly = n.y;
    }
    const label = make('text', {
      x: lx.toFixed(1),
      y: ly.toFixed(1),
      class: 'label',
      'text-anchor': anchor
    }, g);
    label.textContent = n.short;

    g.addEventListener('mouseenter', () => setActive(n));
    g.addEventListener('focus', () => setActive(n));
    g.addEventListener('click', () => { setActive(n); openRow(n); });
    g.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(n);
        openRow(n);
      }
    });

    n.row.addEventListener('toggle', () => { if (n.row.open) setActive(n); });
    groups.set(n.row.dataset.id, g);
  });

  host.appendChild(svg);

  if (panel) {
    host.addEventListener('mouseleave', () => {
      groups.forEach((g) => g.classList.remove('is-active'));
      panel.textContent = defaultPanel;
    });
  }
}

/* ---------- Tool-count bars grow once, when the list scrolls into view ---------- */
function setupBars() {
  const list = $('.connector-list');
  if (!list) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    list.classList.add('in-view');
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        list.classList.add('in-view');
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(list);
}

/* ---------- Sample quiz in the Rivox section ---------- */
function setupQuiz() {
  const quiz = $('#quiz');
  const feedback = $('#quiz-feedback');
  const reset = $('#quiz-reset');
  if (!quiz || !feedback || !reset) return;

  const options = $$('.quiz-option', quiz);

  options.forEach((button) => {
    button.addEventListener('click', () => {
      const correct = button.dataset.correct === 'true';

      options.forEach((o) => {
        o.disabled = true;
        if (o.dataset.correct === 'true') o.classList.add('is-correct');
      });
      if (!correct) button.classList.add('is-wrong');

      feedback.textContent = (correct ? 'Correct. ' : 'Not quite. ') + feedback.dataset.explain;
      feedback.hidden = false;
      reset.hidden = false;
      reset.focus();
    });
  });

  reset.addEventListener('click', () => {
    options.forEach((o) => {
      o.disabled = false;
      o.classList.remove('is-correct', 'is-wrong');
    });
    feedback.hidden = true;
    reset.hidden = true;
    options[0].focus();
  });
}

/* ---------- Start ---------- */
applyConfig();
setupNav();
setupNavHighlight();
buildConstellation();
setupBars();
setupQuiz();
