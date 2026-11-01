// Decision board: compares each page type across concepts A–D with the review notes, and
// records a decision per page type. See claude/review/README.md (Phase 3).
import { AREAS, CONCEPTS, ENDPOINT, PAGE_TYPES, TEAM } from './pages.js';
import { STRINGS } from './i18n.js';
import {
  OTHER, STATUSES, VERDICTS, conceptUrl, decisionMarkdown, notePath, targetPath, threadsByRow, verdictCounts,
} from './model.js';

/** Shared with review mode (claude/review/config.ts): the name chosen there is used here too. */
const REVIEWER_KEY = 'ags-review-reviewer';
const DEMO_KEY = 'ags-review-demo';
const LANG_KEY = 'ags-review-board-lang';
const DEMO_NOTES = 'ags-review-demo-notes';
const DEMO_PEOPLE = 'ags-review-demo-people';
const DEMO_DECISIONS = 'ags-review-demo-decisions';
const REFRESH_MS = 60_000;

const app = document.getElementById('app');
const state = {
  lang: initialLang(),
  demo: takeDemo(),
  me: savedReviewer(),
  /** "Who's reviewing?" while open: the list, and a decision waiting for a name. */
  who: null,
  notes: [],
  decisions: [],
  rows: {},
  loadedAt: null,
  filters: { area: 'all', show: null, status: 'any', q: '' },
  /** Unsaved decision edits by page type, kept across refreshes. */
  drafts: {},
  saveState: {},
};
const t = () => STRINGS[state.lang];
const types = [...PAGE_TYPES, { id: OTHER, area: 'other', en: STRINGS.en.otherPages, ar: STRINGS.ar.otherPages, pages: {} }];

// ------------------------------------------------------------------ start

function initialLang() {
  const asked = new URLSearchParams(location.search).get('lang');
  if (asked === 'ar' || asked === 'en') return asked;
  try { return localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'en'; } catch { return 'en'; }
}

/** `#review=demo` / `#review=live` switch demo mode for this browser, as in the concepts. */
function takeDemo() {
  const mode = new URLSearchParams(location.hash.slice(1)).get('review');
  try {
    if (mode === 'demo' || mode === 'live') {
      history.replaceState(null, '', location.pathname + location.search);
      if (mode === 'demo') localStorage.setItem(DEMO_KEY, '1'); else localStorage.removeItem(DEMO_KEY);
      localStorage.removeItem(REVIEWER_KEY);
    }
    return localStorage.getItem(DEMO_KEY) === '1';
  } catch { return mode === 'demo'; }
}

function savedReviewer() {
  try {
    const r = JSON.parse(localStorage.getItem(REVIEWER_KEY) || 'null');
    return r && typeof r.id === 'string' && typeof r.name === 'string' ? r : null;
  } catch { return null; }
}

function setReviewer(reviewer) {
  state.me = reviewer;
  try {
    if (reviewer) localStorage.setItem(REVIEWER_KEY, JSON.stringify(reviewer)); else localStorage.removeItem(REVIEWER_KEY);
  } catch { /* keep it for this visit */ }
}

applyLang();
load();

// ------------------------------------------------------------------ backend

async function call(action, payload = {}) {
  if (state.demo) return demoCall(action, payload);
  if (!ENDPOINT) throw new Error('not_configured');
  let res;
  try {
    res = await fetch(ENDPOINT, {
        signal: AbortSignal.timeout(15000),
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, reviewer: state.me?.id, ...payload }),
      redirect: 'follow',
    });
  } catch { throw new Error('offline'); }
  let data;
  try { data = await res.json(); } catch { throw new Error(`HTTP ${res.status}`); }
  if (!data.ok) throw new Error(data.error || 'server');
  return data;
}

/** Demo mode reads the notes and names review mode keeps in this browser. */
function demoCall(action, payload) {
  const read = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const people = [...TEAM, ...read(DEMO_PEOPLE)];
  if (action === 'people') return { people };
  if (action === 'join') {
    const name = String(payload.name || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (name.length < 2) throw new Error('bad_name');
    const same = people.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (same) return { reviewer: same };
    const reviewer = { id: `demo-${Date.now().toString(36)}`, name, role: 'reviewer' };
    localStorage.setItem(DEMO_PEOPLE, JSON.stringify([...read(DEMO_PEOPLE), reviewer]));
    return { reviewer };
  }
  if (action === 'list') return { notes: read(DEMO_NOTES), decisions: read(DEMO_DECISIONS) };
  if (action === 'decide') {
    const me = people.find((p) => p.id === state.me?.id);
    if (!me) throw new Error('unknown_reviewer');
    const decision = { ...payload.decision, updated: new Date().toISOString(), updatedBy: me.name };
    localStorage.setItem(DEMO_DECISIONS, JSON.stringify([...read(DEMO_DECISIONS).filter((d) => d.pageType !== decision.pageType), decision]));
    return { decision };
  }
  throw new Error('unknown_action');
}

function errorText(err) {
  const code = err?.message || String(err);
  if (code === 'offline') return t().offline;
  if (code === 'not_configured') return t().notConfigured;
  return t().serverError(code);
}

async function load() {
  if (!state.loadedAt) app.innerHTML = `<p class="wrap" style="padding-top:40px">${esc(t().loading)}</p>`;
  try {
    const data = await call('list');
    state.notes = (data.notes || []).map((n) => ({ ...n, parentId: n.parentId || '', verdict: n.verdict || '', text: String(n.text ?? '') }));
    state.decisions = data.decisions || [];
    state.rows = threadsByRow(state.notes, types);
    state.loadedAt = new Date();
    if (state.filters.show === null) state.filters.show = state.notes.length || state.decisions.length ? 'activity' : 'all';
    render();
  } catch (err) {
    if (!state.loadedAt) renderError(errorText(err));
    else setText('.updated', errorText(err));
  }
}

/** Checks a remembered name against the list once, so a removed person is asked again. */
async function checkReviewer() {
  if (!state.me) return;
  try {
    const { people } = await call('people');
    const still = people.find((p) => p.id === state.me.id);
    if (!still) setReviewer(null);
    else if (still.name !== state.me.name) setReviewer(still);
    if (state.loadedAt) setText('.who-name', whoLabel());
  } catch { /* offline: keep the remembered name */ }
}
checkReviewer();

setInterval(() => {
  if (!state.loadedAt || document.hidden || state.who) return;
  // Refreshing redraws the rows; wait while a decision is being typed.
  if (app.querySelector('.decision form')?.contains(document.activeElement)) return;
  load();
}, REFRESH_MS);

// ------------------------------------------------------------------ rendering helpers

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function setText(selector, text) {
  const el = app.querySelector(selector);
  if (el) el.textContent = text;
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = t().dir;
  document.title = `${t().title} · AGS`;
}

const label = (type) => type[state.lang] || type.en;
const conceptName = (c) => c[state.lang];
const typeById = (id) => types.find((type) => type.id === id);
const decisionFor = (id) => state.decisions.find((d) => d.pageType === id);
const rowDomId = (id) => `row-${types.findIndex((type) => type.id === id)}`;

function date(value, withTime = false) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(t().locale, withTime ? { hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

/**
 * Concepts run on another origin locally, so their links carry demo mode; published, they share
 * this origin and its storage.
 */
function href(concept, path, noteId) {
  const url = conceptUrl(concept.id, path, location);
  const crossOrigin = new URL(url).origin !== location.origin;
  const hash = new URLSearchParams();
  if (crossOrigin && state.demo) hash.set('review', 'demo');
  if (noteId) hash.set('note', noteId);
  const [base, existing] = url.split('#');
  const rest = [existing, hash.toString()].filter(Boolean).join('&');
  return rest ? `${base}#${rest}` : base;
}

const threadCount = (id) => Object.values(state.rows[id] || {}).reduce((n, list) => n + list.length, 0);

function hasDecision(d) {
  return !!(d && (d.status || d.concepts?.length || d.changes?.trim()));
}

function visibleTypes() {
  const { area, show, status, q } = state.filters;
  const query = q.trim().toLowerCase();
  return types.filter((type) => {
    if (type.id === OTHER && !state.rows[OTHER]) return false;
    if (area !== 'all' && type.area !== area) return false;
    const d = decisionFor(type.id);
    if (show === 'activity' && !threadCount(type.id) && !hasDecision(d)) return false;
    if (status === 'none' && hasDecision(d)) return false;
    if (status !== 'any' && status !== 'none' && d?.status !== status) return false;
    if (query && ![type.en, type.ar, type.id].some((s) => s.toLowerCase().includes(query))) return false;
    return true;
  });
}

// ------------------------------------------------------------------ views

function renderError(error) {
  app.innerHTML = `
    <div class="panel">
      <h1>${esc(t().title)}</h1>
      <p class="error" role="alert">${esc(error)}</p>
      <p style="margin:16px 0 0;display:flex;gap:8px">
        <button class="btn primary" type="button" data-action="refresh">${esc(t().retry)}</button>
        <button class="btn" type="button" data-action="lang">${esc(t().otherLanguage)}</button>
      </p>
    </div>`;
}

// ------------------------------------------------------------------ who's reviewing

const whoLabel = () => (state.me ? t().reviewingAs(state.me.name) : t().chooseName);

/** Opens "Who's reviewing?"; `then` runs once a name is chosen (a decision waiting to be saved). */
async function openWho(then = null) {
  const who = { people: null, error: '', adding: false, busy: false, then };
  state.who = who;
  renderWho();
  try {
    const data = await call('people');
    if (state.who !== who) return;
    who.people = data.people;
  } catch (err) {
    if (state.who !== who) return;
    who.error = errorText(err);
  }
  renderWho();
}

function closeWho() {
  state.who = null;
  renderWho();
}

function choose(reviewer) {
  const then = state.who?.then;
  setReviewer(reviewer);
  closeWho();
  setText('.who-name', whoLabel());
  then?.();
}

function renderWho() {
  let box = document.getElementById('who');
  if (!state.who) { box?.remove(); return; }
  if (!box) {
    box = Object.assign(document.createElement('div'), { id: 'who', className: 'who' });
    document.body.append(box);
  }
  const s = t();
  const w = state.who;
  const name = box.querySelector('input')?.value || '';
  box.innerHTML = `
    <div class="who-backdrop" data-who="close"></div>
    <div class="who-card" role="dialog" aria-modal="true" aria-labelledby="who-title">
      <div class="who-head"><h2 id="who-title">${esc(s.whoTitle)}</h2>
        <button class="btn" type="button" data-who="close" aria-label="${esc(s.close)}">×</button></div>
      <p>${esc(w.then ? s.whoForDecision : s.whoText)}</p>
      ${w.people ? `<ul>${w.people.map((p) => `<li><button type="button" class="person${p.id === state.me?.id ? ' on' : ''}" data-who="pick" data-id="${esc(p.id)}" dir="auto">${esc(p.name)}</button></li>`).join('')}</ul>`
        : w.error ? '' : `<p>${esc(s.loadingNames)}</p>`}
      ${w.error ? `<p class="error" role="alert">${esc(w.error)}</p><button class="btn" type="button" data-who="retry">${esc(s.retry)}</button>` : ''}
      ${w.adding ? `
        <form class="who-add" data-who="add">
          <label for="who-name-input">${esc(s.addYourName)}</label>
          <div><input id="who-name-input" maxlength="80" autocomplete="name" value="${esc(name)}">
          <button class="btn primary" type="submit" ${w.busy ? 'disabled' : ''}>${esc(w.busy ? s.saving : s.addAndStart)}</button></div>
        </form>` : w.people ? `<button class="linkish" type="button" data-who="more">+ ${esc(s.notListed)}</button>` : ''}
    </div>`;
  (box.querySelector('#who-name-input') || box.querySelector('.person.on') || box.querySelector('.person'))?.focus();
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-who]');
  if (!el || !state.who) return;
  const action = el.dataset.who;
  if (action === 'close') closeWho();
  if (action === 'retry') openWho(state.who.then);
  if (action === 'pick') choose(state.who.people.find((p) => p.id === el.dataset.id));
  if (action === 'more') { state.who.adding = true; renderWho(); }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.who) closeWho();
});

document.addEventListener('submit', async (e) => {
  if (e.target.dataset.who !== 'add') return;
  e.preventDefault();
  const w = state.who;
  const name = e.target.querySelector('input').value.replace(/\s+/g, ' ').trim();
  if (name.length < 2) { w.error = t().nameRequired; renderWho(); return; }
  w.busy = true;
  w.error = '';
  renderWho();
  try {
    choose((await call('join', { name })).reviewer);
  } catch (err) {
    w.busy = false;
    w.error = errorText(err);
    renderWho();
  }
});

function summaryHtml() {
  const s = t();
  const decided = Object.fromEntries(STATUSES.map((st) => [st, state.decisions.filter((d) => d.status === st).length]));
  const topLevel = state.notes.filter((n) => !n.parentId).length;
  const undecided = PAGE_TYPES.filter((type) => !hasDecision(decisionFor(type.id))).length;
  return `
    <span><b>${esc(s.summary(topLevel, Object.keys(state.rows).length))}</b></span>
    ${STATUSES.map((st) => `<span>${esc(s.summaryStatus(decided[st], s.status[st]))}</span>`).join('')}
    <span>${esc(s.summaryOpen(undecided))}</span>`;
}

function render() {
  const s = t();
  const f = state.filters;
  app.innerHTML = `
    <header class="head"><div class="wrap">
      <a class="brand" href="../"><img src="../assets/ags-horizontal.svg" alt="Arab Global Scholars"><span>${esc(s.title)}</span></a>
      <div class="tools">
        <button class="btn who-name" type="button" data-action="who" title="${esc(s.changeName)}">${esc(whoLabel())}</button>
        <button class="btn" type="button" data-action="lang" lang="${state.lang === 'ar' ? 'en' : 'ar'}">${esc(s.otherLanguage)}</button>
        <button class="btn" type="button" data-action="refresh">${esc(s.refresh)}</button>
        <button class="btn" type="button" data-action="copy">${esc(s.copy)}</button>
        <button class="btn primary" type="button" data-action="download">${esc(s.download)}</button>
      </div>
    </div></header>
    ${state.demo ? `<div class="demo"><div class="wrap">${esc(s.demo)}</div></div>` : ''}
    <section class="wrap intro">
      <h1>${esc(s.title)}</h1>
      <p>${esc(s.lede)}</p>
      <p class="summary">${summaryHtml()}</p>
    </section>
    <div class="bar"><div class="wrap">
      <form class="filters" id="filters">
        <label>${esc(s.areaLabel)}
          <select name="area">
            <option value="all">${esc(s.allAreas)}</option>
            ${AREAS.map((a) => `<option value="${a}" ${f.area === a ? 'selected' : ''}>${esc(s.areas[a])}</option>`).join('')}
          </select>
        </label>
        <label>${esc(s.showLabel)}
          <select name="show">
            <option value="activity" ${f.show === 'activity' ? 'selected' : ''}>${esc(s.withActivity)}</option>
            <option value="all" ${f.show === 'all' ? 'selected' : ''}>${esc(s.allPages)}</option>
          </select>
        </label>
        <label>${esc(s.statusLabel)}
          <select name="status">
            <option value="any">${esc(s.anyStatus)}</option>
            <option value="none" ${f.status === 'none' ? 'selected' : ''}>${esc(s.noDecisionYet)}</option>
            ${STATUSES.map((st) => `<option value="${st}" ${f.status === st ? 'selected' : ''}>${esc(s.status[st])}</option>`).join('')}
          </select>
        </label>
        <label>${esc(s.searchLabel)}
          <input type="search" name="q" value="${esc(f.q)}">
        </label>
        <span class="updated" aria-live="polite">${state.loadedAt ? esc(s.updatedAt(date(state.loadedAt, true))) : ''}</span>
      </form>
      <div class="cols" aria-hidden="true">
        ${CONCEPTS.map((c) => `<div><span class="badge ${c.letter}">${c.letter}</span>${esc(conceptName(c))}</div>`).join('')}
      </div>
    </div></div>
    <main class="wrap" id="rows"></main>`;
  renderRows();
}

function renderRows() {
  const list = visibleTypes();
  const main = app.querySelector('#rows');
  if (!list.length) { main.innerHTML = `<p class="empty">${esc(t().noMatches)}</p>`; return; }
  main.innerHTML = AREAS.map((area) => {
    const rows = list.filter((type) => type.area === area);
    if (!rows.length) return '';
    return `<section class="area"><h2>${esc(t().areas[area])}<small>${rows.length}</small></h2>${rows.map(rowHtml).join('')}</section>`;
  }).join('');
}

function rowHtml(type) {
  const s = t();
  const d = decisionFor(type.id);
  const n = threadCount(type.id);
  return `
    <article class="row" id="${rowDomId(type.id)}" data-type="${esc(type.id)}">
      <header class="row-head">
        <h3>${esc(label(type))}</h3>
        ${type.id !== OTHER && type.id !== '(selector)' ? `<span class="mono" dir="ltr">/${esc(type.id)}</span>` : ''}
        <span class="count">${esc(n ? s.noteCount(n) : s.noNotes)}</span>
        ${d?.status ? `<span class="pill ${d.status}">${esc(s.status[d.status])}</span>` : ''}
      </header>
      <div class="cells">${CONCEPTS.map((c) => cellHtml(type, c)).join('')}</div>
      ${type.id === OTHER ? '' : decisionHtml(type, d)}
    </article>`;
}

function cellHtml(type, concept) {
  const s = t();
  const target = type.pages[concept.id];
  const threads = state.rows[type.id]?.[concept.id] || [];
  const badge = `<span class="badge ${concept.letter}" title="${esc(conceptName(concept))}">${concept.letter}</span>`;
  if (!target && type.id !== OTHER) {
    return `<div class="cell missing"><div class="cell-head">${badge}${esc(s.notInConcept)}</div></div>`;
  }
  let head = '';
  let hint = '';
  if (target) {
    const path = targetPath(concept, target, state.lang);
    const route = `<span class="route mono" dir="ltr">${esc(target.path === '(selector)' ? '/' : `/${target.path}${target.query ? `?${target.query}` : ''}${target.hash ? `#${target.hash}` : ''}`)}</span>`;
    if (path) head = `<a href="${esc(href(concept, path))}" target="_blank" rel="noopener">${esc(s.openPage)} ↗</a>${route}`;
    else {
      const first = threads[0]?.note;
      const parent = target.parent && targetPath(concept, { path: target.parent }, state.lang);
      head = first
        ? `<a href="${esc(href(concept, notePath(first, state.lang)))}" target="_blank" rel="noopener">${esc(s.openPage)} ↗</a>${route}`
        : `${parent ? `<a href="${esc(href(concept, parent))}" target="_blank" rel="noopener">${esc(s.openList)} ↗</a>` : ''}${route}`;
      if (!first) hint = s.onePerItem;
    }
    if (target.sameAs) {
      const owner = typeById(target.sameAs);
      hint = `${target.hash ? s.sectionOf : s.sameAs} <button type="button" data-action="goto" data-target="${esc(target.sameAs)}">${esc(owner ? label(owner) : target.sameAs)}</button>`;
    }
  }
  const counts = verdictCounts(threads);
  return `
    <div class="cell">
      <div class="cell-head">${badge}${head}</div>
      ${hint ? `<p class="hint">${target?.sameAs ? hint : esc(hint)}</p>` : ''}
      ${threads.length ? `<div class="counts">${VERDICTS.filter((v) => counts[v]).map((v) => `<span class="v-${v}">${counts[v]} ${esc(s.verdict[v])}</span>`).join('')}</div>` : ''}
      ${threads.length ? `<ul class="notes">${threads.map((th) => noteHtml(th, type, concept)).join('')}</ul>` : target?.sameAs ? '' : `<p class="empty">${esc(s.noNotes)}</p>`}
    </div>`;
}

function noteHtml({ note, replies }, type, concept) {
  const s = t();
  const target = type.pages[concept.id];
  const page = note.page === '(selector)' ? '/' : `/${note.page}`;
  const showPage = !target || target.path.includes(':') || note.page !== `${target.path}${target.query ? `?${target.query}` : ''}`;
  const edited = note.updated && note.updated !== note.created ? ` · ${esc(s.edited)}` : '';
  return `
    <li class="note ${esc(note.verdict)}">
      ${note.verdict ? `<div class="verdict v-${esc(note.verdict)}">${esc(s.verdict[note.verdict] || note.verdict)}</div>` : ''}
      ${note.text ? `<p dir="auto">${esc(note.text)}</p>` : ''}
      <div class="meta">
        ${esc(note.author)} · ${esc(date(note.created))}${edited}
        ${note.label ? ` · ${esc(s.section)}: ${esc(note.label)}` : ''}
        ${showPage ? ` · <span class="mono" dir="ltr">${esc(page)}</span>` : ''}
        · <a href="${esc(href(concept, notePath(note, state.lang), note.id))}" target="_blank" rel="noopener">${esc(s.openNote)} ↗</a>
      </div>
      ${replies.length ? `<ul class="replies">${replies.map((r) => `
        <li><p dir="auto">${esc(r.text)}</p><div class="meta">${esc(r.author)} · ${esc(date(r.created))}</div></li>`).join('')}</ul>` : ''}
    </li>`;
}

function decisionHtml(type, d) {
  const s = t();
  const v = state.drafts[type.id] || { concepts: d?.concepts || [], changes: d?.changes || '', status: d?.status || '' };
  const saveState = state.saveState[type.id];
  const stateText = saveState === 'saving' ? s.saving : saveState === 'error' ? s.saveFailed
    : state.drafts[type.id] ? s.unsaved : saveState === 'saved' ? s.saved : d?.updatedBy ? s.updatedBy(d.updatedBy, date(d.updated)) : '';
  const available = CONCEPTS.filter((c) => type.pages[c.id]);
  return `
    <div class="decision"><h4>${esc(s.decision)}</h4>
      <form data-decision="${esc(type.id)}">
        <fieldset><legend>${esc(s.takeFrom)}</legend><div class="choices">
          ${available.map((c) => `<label title="${esc(conceptName(c))}"><input type="checkbox" name="concepts" value="${c.id}" ${v.concepts.includes(c.id) ? 'checked' : ''}>${c.letter}</label>`).join('')}
        </div></fieldset>
        <label><span class="visually-hidden">${esc(s.changes)}</span>
          <textarea name="changes" dir="auto" placeholder="${esc(s.changes)} — ${esc(s.changesPlaceholder)}">${esc(v.changes)}</textarea>
        </label>
        <div class="side">
          <fieldset><legend>${esc(s.statusLabel)}</legend><div class="choices">
            ${['', ...STATUSES].map((st) => `<label><input type="radio" name="status" value="${st}" ${v.status === st ? 'checked' : ''}>${esc(st ? s.status[st] : s.noStatus)}</label>`).join('')}
          </div></fieldset>
          <button class="btn primary" type="submit" ${saveState === 'saving' ? 'disabled' : ''}>${esc(saveState === 'saving' ? s.saving : s.save)}</button>
          <span class="state ${saveState === 'error' ? 'error' : ''}" aria-live="polite">${esc(stateText)}</span>
        </div>
      </form>
    </div>`;
}

function rerenderRow(id) {
  const el = document.getElementById(rowDomId(id));
  const type = typeById(id);
  if (el && type) el.outerHTML = rowHtml(type);
}

// ------------------------------------------------------------------ events

function readForm(form) {
  const data = new FormData(form);
  return { concepts: data.getAll('concepts'), changes: String(data.get('changes') || ''), status: String(data.get('status') || '') };
}

app.addEventListener('input', (e) => {
  const filters = e.target.closest('#filters');
  if (filters) {
    state.filters[e.target.name] = e.target.value;
    renderRows();
    return;
  }
  const form = e.target.closest('form[data-decision]');
  if (form) {
    const id = form.dataset.decision;
    state.drafts[id] = readForm(form);
    delete state.saveState[id];
    form.querySelector('.state').textContent = t().unsaved;
    form.querySelector('.state').classList.remove('error');
  }
});

app.addEventListener('submit', async (e) => {
  if (e.target.id === 'filters') e.preventDefault();
  const form = e.target.closest('form[data-decision]');
  if (!form) return;
  e.preventDefault();
  const id = form.dataset.decision;
  state.drafts[id] = readForm(form);
  saveDecision(id);
});

async function saveDecision(id) {
  // Decisions record who saved them: ask for a name first, then carry on.
  if (!state.me) { openWho(() => saveDecision(id)); return; }
  state.saveState[id] = 'saving';
  rerenderRow(id);
  try {
    const { decision } = await call('decide', { decision: { pageType: id, ...state.drafts[id] } });
    state.decisions = [...state.decisions.filter((d) => d.pageType !== id), decision];
    delete state.drafts[id];
    state.saveState[id] = 'saved';
    app.querySelector('.summary').innerHTML = summaryHtml();
  } catch (err) {
    state.saveState[id] = 'error';
    if (err.message === 'unknown_reviewer') {
      setReviewer(null);
      setText('.who-name', whoLabel());
      openWho(() => saveDecision(id));
    }
  }
  rerenderRow(id);
}

app.addEventListener('click', async (e) => {
  const button = e.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'lang') {
    state.lang = state.lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem(LANG_KEY, state.lang); } catch { /* ignore */ }
    applyLang();
    if (state.loadedAt) render(); else load();
    renderWho();
  }
  if (action === 'refresh') load();
  if (action === 'who') openWho();
  if (action === 'goto') {
    const el = document.getElementById(rowDomId(button.dataset.target));
    if (!el) {
      state.filters = { area: 'all', show: 'all', status: 'any', q: '' };
      render();
    }
    document.getElementById(rowDomId(button.dataset.target))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (action === 'copy' || action === 'download') {
    const markdown = record();
    let copied = false;
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(markdown);
        copied = true;
        button.textContent = t().copied;
        setTimeout(() => { button.textContent = t().copy; }, 1500);
      } catch { /* no clipboard access: download instead */ }
    }
    if (!copied) {
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: `ags-design-decisions-${new Date().toISOString().slice(0, 10)}${state.lang === 'ar' ? '-ar' : ''}.md`,
      });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
  }
});

function record() {
  return decisionMarkdown({
    types: PAGE_TYPES,
    decisions: state.decisions,
    rows: state.rows,
    concepts: CONCEPTS,
    t: t(),
    lang: state.lang,
    date: date(new Date()),
    url: location.origin + location.pathname,
  });
}
