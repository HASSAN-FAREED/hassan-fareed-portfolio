'use strict';

/* ==========================================================================
   Hassan Fareed | AI Solutions Consultant
   1. Edit CONFIG.
   2. The game layer (XP, levels, achievements) is defined in QUESTS and LEVELS.
   ========================================================================== */

const CONFIG = {
  name: 'Hassan Fareed',
  email: 'hassanfareed5522@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hassan-fareed-d',
  playStore: 'https://play.google.com/store/apps/details?id=com.aiquiz.ai_quiz_app',
  resume: 'Hassan-Fareed-Resume.pdf',
  caseStudyUrl: ''     // Paste a shared link to the case study PDF. Empty means "request by email".
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   Game layer
   ========================================================================== */

const QUESTS = [
  { id: 'briefing', name: 'Mission briefing', hint: 'Scroll past the opening section', xp: 25 },
  { id: 'map', name: 'Map reader', hint: 'Select a lane on the workflow map', xp: 50 },
  { id: 'results', name: 'Show me the numbers', hint: 'Reach the results section', xp: 25 },
  { id: 'playbook', name: 'Playbook reader', hint: 'Reach the Agile and data-first approach', xp: 25 },
  { id: 'suite', name: 'Suite opener', hint: 'Open a business function automation suite', xp: 50 },
  { id: 'suites', name: 'Whole organisation', hint: 'Open all seven automation suites', xp: 75 },
  { id: 'domain', name: 'Domain scout', hint: 'Open an industry domain', xp: 50 },
  { id: 'domains', name: 'Industry tour', hint: 'Open all six domains', xp: 75 },
  { id: 'challenge', name: 'Automation IQ', hint: 'Finish the three-question challenge', xp: 50 },
  { id: 'perfect', name: 'Perfect run', hint: 'Score 3 out of 3 in the challenge', xp: 50 },
  { id: 'contact', name: 'Ready to talk', hint: 'Reach the contact section', xp: 25 },
  { id: 'signal', name: 'Signal sent', hint: 'Copy or open my email', xp: 25 },
  { id: 'resume', name: 'Paper trail', hint: 'Download the resume', xp: 25 }
];

const LEVELS = [
  { min: 0, name: 'Visitor' },
  { min: 100, name: 'Analyst' },
  { min: 200, name: 'Process designer' },
  { min: 350, name: 'Automation lead' },
  { min: 550, name: 'Transformation partner' }
];

const MAX_XP = QUESTS.reduce((sum, q) => sum + q.xp, 0);
const STORE_KEY = 'hf-portfolio-quests-v1';
const GAME_KEY = 'hf-portfolio-game-mode';
let gameOn = true;

const store = {
  load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  },
  save(ids) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(ids)); } catch (e) { /* storage blocked: progress lasts for this visit */ }
  }
};

const done = new Set(store.load().filter((id) => QUESTS.some((q) => q.id === id)));

const currentXp = () => QUESTS.filter((q) => done.has(q.id)).reduce((sum, q) => sum + q.xp, 0);
const levelFor = (xp) => {
  let index = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.min) index = i; });
  return { number: index + 1, name: LEVELS[index].name };
};

let toastTimer = null;
function toast(html) {
  const el = $('#toast');
  if (!el) return;
  el.innerHTML = html;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3600);
}

function renderHud() {
  const xp = currentXp();
  const level = levelFor(xp);
  const pct = Math.round((xp / MAX_XP) * 100) + '%';

  $('#hud-level').textContent = 'Level ' + level.number + ': ' + level.name;
  $('#hud-xp').textContent = xp + ' / ' + MAX_XP + ' XP';
  $('#hud-bar-fill').style.width = pct;
  $('#xp-fill').style.width = pct;
  $('#hud-sub').textContent = xp >= MAX_XP
    ? 'Every achievement unlocked. You have seen the full picture.'
    : done.size + ' of ' + QUESTS.length + ' unlocked. Explore the site to find the rest.';

  const list = $('#quest-list');
  list.textContent = '';
  QUESTS.forEach((q) => {
    const li = document.createElement('li');
    if (done.has(q.id)) li.className = 'is-done';
    li.innerHTML = '<span class="quest-check" aria-hidden="true"></span>' +
      '<span><span class="quest-name"></span><span class="quest-hint"></span></span>' +
      '<span class="quest-xp"></span>';
    li.querySelector('.quest-name').textContent = q.name;
    li.querySelector('.quest-hint').textContent = q.hint;
    li.querySelector('.quest-xp').textContent = '+' + q.xp + ' XP';
    li.setAttribute('aria-label', q.name + ', ' + (done.has(q.id) ? 'unlocked' : 'locked') + '. ' + q.hint + '.');
    list.appendChild(li);
  });
}

function award(id) {
  if (!gameOn || done.has(id)) return;
  const quest = QUESTS.find((q) => q.id === id);
  if (!quest) return;

  const before = levelFor(currentXp());
  done.add(id);
  store.save(Array.from(done));
  renderHud();

  const xp = currentXp();
  const after = levelFor(xp);
  if (xp >= MAX_XP) {
    toast('<strong>All achievements unlocked.</strong> You know my work as well as I do. <a href="#contact">Let\'s talk</a>.');
  } else if (after.number > before.number) {
    toast('<strong>Level up: ' + after.name + '.</strong> ' + quest.name + ' unlocked, +' + quest.xp + ' XP.');
  } else {
    toast('<strong>Achievement unlocked:</strong> ' + quest.name + ', +' + quest.xp + ' XP.');
  }
}

function setupHud() {
  const hud = $('#hud');
  const button = $('#hud-button');
  const panel = $('#hud-panel');
  if (!hud || !button || !panel) return;

  hud.hidden = false;
  renderHud();

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  button.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) { setOpen(false); button.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !hud.contains(event.target)) setOpen(false);
  });

  $('#hud-reset').addEventListener('click', () => {
    done.clear();
    store.save([]);
    seenSuites.clear();
    seenDomains.clear();
    $$('.suite').forEach((s) => s.classList.remove('is-seen'));
    updateCounters();
    renderHud();
    toast('Progress reset. Start exploring again.');
  });
}

function setupSectionQuests() {
  if (!('IntersectionObserver' in window)) return;
  const map = { about: 'briefing', results: 'results', approach: 'playbook', contact: 'contact' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) award(map[entry.target.id]);
    });
  }, { threshold: 0.25 });
  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function setupGameSwitch() {
  const sw = $('#game-switch');
  try { gameOn = localStorage.getItem(GAME_KEY) !== 'off'; } catch (e) { gameOn = true; }

  const apply = () => {
    document.body.classList.toggle('game-off', !gameOn);
    if (sw) {
      sw.setAttribute('aria-checked', String(gameOn));
      sw.setAttribute('aria-label', 'Game mode ' + (gameOn ? 'on' : 'off'));
    }
    if (!gameOn) {
      const panel = $('#hud-panel');
      if (panel) panel.hidden = true;
    }
  };

  apply();
  if (!sw) return;
  sw.hidden = false;
  sw.addEventListener('click', () => {
    gameOn = !gameOn;
    try { localStorage.setItem(GAME_KEY, gameOn ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
    apply();
    if (gameOn) toast('<strong>Game mode on.</strong> Your progress is still here.');
  });
}

/* ==========================================================================
   Site features
   ========================================================================== */

function applyConfig() {
  $$('[data-link="email"]').forEach((a) => {
    a.href = 'mailto:' + CONFIG.email;
    if (a.textContent.indexOf('@') !== -1) a.textContent = 'Email ' + CONFIG.email;
    a.addEventListener('click', () => award('signal'));
  });

  $$('[data-link="play"]').forEach((a) => { a.href = CONFIG.playStore; });

  $$('[data-link="resume"]').forEach((a) => {
    a.href = CONFIG.resume;
    a.setAttribute('download', CONFIG.resume.split('/').pop());
    a.addEventListener('click', () => award('resume'));
  });

  $$('[data-link="linkedin"]').forEach((a) => {
    a.hidden = !CONFIG.linkedin;
    if (CONFIG.linkedin) a.href = CONFIG.linkedin;
  });

  $$('[data-link="casestudy"]').forEach((a) => {
    if (CONFIG.caseStudyUrl) {
      a.href = CONFIG.caseStudyUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Read the case study';
    } else {
      const subject = encodeURIComponent('Case study request');
      const body = encodeURIComponent('Hi ' + CONFIG.name.split(' ')[0] + ',\n\nCould you share your workflow automation case study?\n');
      a.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
    }
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupNav() {
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });
}

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

/* ---------- Workflow map lanes ---------- */
const FUNCTION_INFO = {
  sales: { text: 'Sales automation suite: morning lead digests and monthly hot lead reports.', target: 'fn-sales' },
  presales: { text: 'Presales automation suite: bench-to-job matching, tender discovery and account signal digests.', target: 'fn-presales' },
  delivery: { text: 'Delivery automation suite: sprint status, velocity and workload reports, with the deck and email.', target: 'fn-delivery' },
  finance: { text: 'Finance automation suite: a 22-slide monthly finance report built from accounting data.', target: 'fn-finance' },
  talent: { text: 'Talent automation suite: candidate sourcing from the recruiting system and LinkedIn.', target: 'fn-talent' },
  operations: { text: 'Operations automation suite: invoice and project status on request.', target: 'fn-operations' }
};

function openSuite(id) {
  const suite = document.getElementById(id);
  if (!suite) return;
  suite.open = true;
  suite.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  const summary = suite.querySelector('summary');
  if (summary) summary.focus({ preventScroll: true });
}

function setupMap() {
  const svg = $('.opmap');
  const caption = $('#map-caption');
  if (!svg || !caption) return;
  if (reducedMotion && typeof svg.pauseAnimations === 'function') svg.pauseAnimations();

  const lanes = $$('.lane-g', svg);
  const select = (lane) => {
    const info = FUNCTION_INFO[lane.dataset.fn];
    if (!info) return;
    lanes.forEach((l) => l.classList.toggle('is-active', l === lane));
    caption.textContent = info.text + ' ';
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Open this suite';
    open.addEventListener('click', () => openSuite(info.target));
    caption.appendChild(open);
    award('map');
  };

  lanes.forEach((lane) => {
    lane.addEventListener('click', () => select(lane));
    lane.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(lane); }
    });
  });
}

/* ---------- Suites and domains ---------- */
const seenSuites = new Set();
const seenDomains = new Set();

function updateCounters() {
  const suiteTotal = $$('.suite').length;
  const domainTotal = $$('.domain').length;
  const sc = $('#suite-counter');
  const dc = $('#domain-counter');
  if (sc) sc.textContent = seenSuites.size + ' of ' + suiteTotal + ' suites explored';
  if (dc) dc.textContent = seenDomains.size + ' of ' + domainTotal + ' domains explored';
}

function setupSuites() {
  const suites = $$('.suite');
  suites.forEach((suite) => {
    suite.addEventListener('toggle', () => {
      if (!suite.open) return;
      seenSuites.add(suite.id);
      suite.classList.add('is-seen');
      updateCounters();
      award('suite');
      if (seenSuites.size === suites.length) award('suites');
    });
  });
}

function setupDomains() {
  const domains = $$('.domain');
  domains.forEach((domain) => {
    const button = $('.domain-toggle', domain);
    const body = $('.domain-body', domain);
    const meta = $('.dom-meta', domain);
    if (!button || !body) return;

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      body.hidden = !open;
      domain.classList.toggle('is-open', open);
      if (meta) meta.textContent = open ? 'Close domain' : 'Open domain';
      if (open) {
        seenDomains.add(domain.dataset.domain);
        updateCounters();
        award('domain');
        if (seenDomains.size === domains.length) award('domains');
      }
    });
  });
}

/* ---------- Automation IQ challenge ---------- */
const QUESTIONS = [
  {
    q: 'A workflow sends client emails automatically. Where should a person step in?',
    options: ['Only when an email bounces', 'Before each email is sent, to approve the exact text', 'Once a quarter, in a review meeting'],
    answer: 1,
    why: 'Anything that leaves the organisation or changes a record waits for a person to approve the exact action. Reads and drafts can run on their own.'
  },
  {
    q: 'You are asked to automate a monthly finance report. What comes first?',
    options: ['Choose the AI model', 'Map the data sources and agree the KPIs', 'Design the slide template'],
    answer: 1,
    why: 'Data first. Without a clear source for each number and an agreed KPI baseline, the automation cannot be trusted or measured.'
  },
  {
    q: 'A team wants every automation built before anything goes live. What is the Agile answer?',
    options: ['Build everything, then launch', 'Ship the highest-value workflow first, then improve it each sprint', 'Wait for a complete requirements document'],
    answer: 1,
    why: 'Ship value early, learn from real use, and let each sprint demo and retro shape the next automation.'
  }
];

function setupChallenge() {
  const screen = $('#challenge');
  if (!screen) return;

  let index = 0;
  let score = 0;
  let results = [];

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };

  const header = () => {
    const wrap = document.createDocumentFragment();
    wrap.appendChild(el('p', 'phone-label', 'Automation IQ challenge'));
    const progress = el('div', 'ch-progress');
    progress.appendChild(el('span', '', index < QUESTIONS.length ? 'Question ' + (index + 1) + ' of ' + QUESTIONS.length : 'Results'));
    const dots = el('span', 'ch-dots');
    dots.setAttribute('aria-hidden', 'true');
    QUESTIONS.forEach((_, i) => {
      const d = el('span');
      if (results[i] === true) d.className = 'is-right';
      else if (results[i] === false) d.className = 'is-wrong';
      else if (i === index) d.className = 'is-now';
      dots.appendChild(d);
    });
    progress.appendChild(dots);
    wrap.appendChild(progress);
    return wrap;
  };

  const renderQuestion = () => {
    const item = QUESTIONS[index];
    screen.textContent = '';
    screen.appendChild(header());
    screen.appendChild(el('h3', 'quiz-q', item.q));
    const options = el('div', 'quiz-options');
    item.options.forEach((label, i) => {
      const b = el('button', 'quiz-option', label);
      b.type = 'button';
      b.addEventListener('click', () => answer(i));
      options.appendChild(b);
    });
    screen.appendChild(options);
  };

  const answer = (choice) => {
    const item = QUESTIONS[index];
    const right = choice === item.answer;
    if (right) score += 1;
    results[index] = right;

    $$('.quiz-option', screen).forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add('is-correct');
      if (i === choice && !right) b.classList.add('is-wrong');
    });

    const feedback = el('p', 'quiz-feedback', (right ? 'Correct. ' : 'Not quite. ') + item.why);
    screen.appendChild(feedback);

    const last = index === QUESTIONS.length - 1;
    const next = el('button', 'ch-next', last ? 'See my score' : 'Next question');
    next.type = 'button';
    next.addEventListener('click', () => {
      index += 1;
      if (index < QUESTIONS.length) renderQuestion();
      else renderResult();
    });
    screen.appendChild(next);
    next.focus();
  };

  const renderResult = () => {
    screen.textContent = '';
    screen.appendChild(header());
    screen.appendChild(el('p', 'ch-score', score + ' / ' + QUESTIONS.length));
    const message = score === QUESTIONS.length
      ? 'Perfect run. You think like an automation consultant: people approve, data comes first, and value ships early.'
      : 'Good start. The best automations keep a person in the loop, start from the data, and ship in small steps.';
    screen.appendChild(el('p', 'ch-text', message));
    const again = el('button', 'ch-next', 'Play again');
    again.type = 'button';
    again.addEventListener('click', () => { index = 0; score = 0; results = []; renderQuestion(); });
    screen.appendChild(again);
    again.focus();

    award('challenge');
    if (score === QUESTIONS.length) award('perfect');
  };

  renderQuestion();
}

/* ---------- Copy email ---------- */
function setupCopyEmail() {
  const button = $('#copy-email');
  const status = $('#copy-status');
  if (!button || !status) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      status.textContent = 'Email copied: ' + CONFIG.email;
    } catch (error) {
      status.textContent = 'Copy is blocked in this browser. The address is ' + CONFIG.email;
    }
    award('signal');
  });
}

/* ---------- Start ---------- */
setupGameSwitch();
applyConfig();
setupNav();
setupNavHighlight();
setupHud();
setupSectionQuests();
setupMap();
setupSuites();
setupDomains();
updateCounters();
setupChallenge();
setupCopyEmail();
