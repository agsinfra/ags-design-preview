// SOW coverage page: why every page of the four concepts exists (SOW section, AGS Bylaws article
// or nice to have), and which pages deliver each SOW item. Data comes from claude/review/sow.ts
// through `npm run build:board` (data.js). The presenter sidebar links here with #<page type id>.
import { BYLAWS, CONCEPTS, COVERAGE, MILESTONES, PAGES, SOW } from './data.js';
import { targetPath } from '../review/model.js';

const LANG_KEY = 'ags-sow-coverage-lang';

const STR = {
  en: {
    dir: 'ltr', other: 'العربية', brand: 'Design review',
    title: 'Why each page exists',
    lede: 'Every page of the four concepts, traced to the scope of work (SOW) section that asks for it, the AGS Bylaws article it follows, or marked as a nice to have. For membership and governance the Bylaws are the primary source. Section numbers refer to the current SOW; its text is not reproduced here.',
    tabs: { pages: 'By page', sections: 'By SOW section', gaps: 'Gaps and partly shown' },
    search: 'Search', searchPh: 'Page, SOW item or §',
    sourceLabel: 'Reason', anySource: 'All reasons',
    source: { sow: 'Scope of work', bylaws: 'AGS Bylaws', nice: 'Nice to have' },
    notInSow: 'Not in the SOW',
    state: { shown: 'Shown', everywhere: 'Every page', partial: 'Partly shown', build: 'Build-time', gap: 'Not shown' },
    statPages: 'Pages, by reason', statItems: 'SOW items, by coverage', statMilestones: 'Pages, by SOW milestone',
    milestone: (n, w) => `Milestone ${n} · Week ${w}`, noMilestone: 'No milestone (not in the SOW)',
    areas: { public: 'Public site', member: 'Affiliate Member area', portal: 'Fellow portal', governance: 'Governance (Fellow portal)', partner: 'Partner portal', admin: 'Secretariat', other: 'Other' },
    sowRef: (id) => `SOW §${id}`, bylawRef: (id) => `Bylaws §${id}`, related: 'Related',
    delivers: 'Delivers', item: 'SOW item', pages: 'Pages', status: 'Status',
    open: (c, page) => `Open ${page} in Concept ${c}`, absent: (c) => `Not in Concept ${c}`,
    inConcept: (c) => `Concept ${c}`,
    none: 'No page matches.', noPages: '—',
    gapsLede: 'SOW items the prototypes show only in part, or that are build-time or service requirements a design prototype cannot show. Every other SOW item is shown on at least one page.',
    allShown: 'Every SOW item is shown on at least one page.',
    foot: ['Generated from claude/review/sow.ts. Concept links open the page as the role that can see it.', 'People, messages and figures in the concepts are fictional samples.'],
  },
  ar: {
    dir: 'rtl', other: 'English', brand: 'مراجعة التصاميم',
    title: 'سبب وجود كل صفحة',
    lede: 'كل صفحة في التصاميم الأربعة مربوطة ببند نطاق العمل الذي يطلبها، أو بمادة النظام الأساسي للرابطة التي تتبعها، أو موسومة كميزة إضافية. في العضوية والحوكمة يكون النظام الأساسي هو المصدر الأول. تشير أرقام البنود إلى نطاق العمل الحالي، ولا يُنقل نصه هنا.',
    tabs: { pages: 'حسب الصفحة', sections: 'حسب بنود نطاق العمل', gaps: 'الفجوات وما يظهر جزئيًا' },
    search: 'بحث', searchPh: 'صفحة أو بند أو §',
    sourceLabel: 'السبب', anySource: 'كل الأسباب',
    source: { sow: 'نطاق العمل', bylaws: 'النظام الأساسي', nice: 'ميزة إضافية' },
    notInSow: 'ليست ضمن نطاق العمل',
    state: { shown: 'معروضة', everywhere: 'في كل الصفحات', partial: 'معروضة جزئيًا', build: 'عند البناء', gap: 'غير معروضة' },
    statPages: 'الصفحات حسب السبب', statItems: 'بنود نطاق العمل حسب التغطية', statMilestones: 'الصفحات حسب مراحل التسليم',
    milestone: (n, w) => `المرحلة ${n} · الأسبوع ${w}`, noMilestone: 'دون مرحلة (ليست ضمن نطاق العمل)',
    areas: { public: 'الموقع العام', member: 'مساحة العضو المنتسب', portal: 'بوابة الزملاء', governance: 'الحوكمة (بوابة الزملاء)', partner: 'بوابة الشركاء', admin: 'الأمانة العامة', other: 'أخرى' },
    sowRef: (id) => `نطاق العمل ${id}`, bylawRef: (id) => `النظام الأساسي ${id}`, related: 'ذو صلة',
    delivers: 'تقدّم', item: 'بند نطاق العمل', pages: 'الصفحات', status: 'الحالة',
    open: (c, page) => `افتح ${page} في التصميم ${c}`, absent: (c) => `غير موجودة في التصميم ${c}`,
    inConcept: (c) => `التصميم ${c}`,
    none: 'لا توجد صفحة مطابقة.', noPages: '—',
    gapsLede: 'بنود نطاق العمل التي تظهر جزئيًا في النماذج، أو المتطلبات التي تُنفذ عند البناء أو كخدمة ولا يمكن لنموذج تصميم إظهارها. كل بند آخر يظهر في صفحة واحدة على الأقل.',
    allShown: 'كل بنود نطاق العمل تظهر في صفحة واحدة على الأقل.',
    foot: ['مولّدة من claude/review/sow.ts. تفتح روابط التصاميم الصفحة بصفة الدور الذي يمكنه رؤيتها.', 'الأشخاص والرسائل والأرقام في التصاميم عينات خيالية.'],
  },
};

const ROLE = { member: 'member', portal: 'fellow', governance: 'fellow', partner: 'partner', admin: 'admin' };
const AREAS = ['public', 'member', 'portal', 'governance', 'partner', 'admin', 'other'];

const state = { lang: initialLang(), tab: 'pages', q: '', source: '' };
const t = () => STR[state.lang];
const L = () => (state.lang === 'ar' ? 1 : 0);
const app = document.getElementById('app');

const itemById = new Map(SOW.flatMap((s) => s.items.map((it) => [it.id, it])));
const sectionById = new Map(SOW.map((s) => [s.id, s]));
const bylawById = new Map(BYLAWS.map((b) => [b.id, b]));
const pageById = new Map(PAGES.map((p) => [p.id, p]));

function initialLang() {
  const asked = new URLSearchParams(location.search).get('lang');
  if (asked === 'ar' || asked === 'en') return asked;
  try { return localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'en'; } catch { return 'en'; }
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const domId = (pageId) => `p-${pageId ? pageId.replace(/[^a-zA-Z0-9]+/g, '-') : 'home'}`;

function milestoneOf(why) {
  if (!why || why.source === 'nice') return null;
  for (const id of why.sow || []) {
    const m = sectionById.get(id)?.milestone;
    if (m) return m;
  }
  return null;
}

/** URL of a page in a concept: the published layout beside this page, or the local servers. */
function conceptUrl(conceptId, path) {
  const n = conceptId.replace('design-', '');
  if (location.port === '5190' && !location.pathname.startsWith('/ags-design-preview/')) return `${location.protocol}//${location.hostname}:518${n}${path}`;
  const base = location.pathname.replace(/sow\/(index\.html)?$/, '');
  return `${location.origin}${base}design-${n}${path}`;
}

function pageHref(page, concept) {
  let target = page.pages[concept.id];
  if (!target) return null;
  if (target.path.includes(':')) {
    if (!target.parent) return null;
    target = { path: target.parent };
  }
  const path = targetPath(concept, target, state.lang);
  if (!path) return null;
  const url = new URL(conceptUrl(concept.id, path));
  const role = ROLE[page.area];
  if (role) url.searchParams.set('pv-role', role);
  return url.href;
}

// ------------------------------------------------------------------ pieces

function sourcePills(why) {
  const m = milestoneOf(why);
  return `<span class="pill ${why.source}">${esc(t().source[why.source])}</span>`
    + (why.source === 'nice' ? `<span class="pill plain">${esc(t().notInSow)}</span>` : '')
    + (m ? `<span class="pill plain">${esc(t().milestone(m, MILESTONES[m].week))}</span>` : '');
}

function refsList(why) {
  const bylaws = (why.bylaws || []).map((id) => `<li><span class="mono bylaws-ref">${esc(t().bylawRef(id))}</span><span>${esc(bylawById.get(id)?.title[L()])}</span></li>`);
  const sow = (why.sow || []).map((id) => `<li><span class="mono sow-ref"><a href="#s-${esc(id)}" data-section="${esc(id)}">${esc(t().sowRef(id))}</a></span><span>${esc(sectionById.get(id)?.title[L()])}</span></li>`);
  const list = why.source === 'sow' ? [...sow, ...bylaws] : [...bylaws, ...sow];
  if (!list.length) return '';
  return `${why.source === 'nice' ? `<p class="note">${esc(t().related)}</p>` : ''}<ul class="refs">${list.join('')}</ul>`;
}

function conceptBadges(page) {
  return CONCEPTS.map((c) => {
    const href = pageHref(page, c);
    if (href) return `<a class="badge ${c.letter}" href="${esc(href)}" target="_blank" rel="noopener" title="${esc(t().open(c.letter, page[state.lang]))}" aria-label="${esc(t().open(c.letter, page[state.lang]))}">${c.letter}</a>`;
    const present = !!page.pages[c.id];
    return `<span class="badge ${present ? c.letter : 'off'}" title="${esc(present ? t().inConcept(c.letter) : t().absent(c.letter))}" aria-label="${esc(present ? t().inConcept(c.letter) : t().absent(c.letter))}">${c.letter}</span>`;
  }).join('');
}

function pageCard(page) {
  const why = page.why;
  const items = (why.items || []).map((id) => itemById.get(id)).filter(Boolean);
  const notes = Object.entries(why.notes || {}).map(([cid, text]) => {
    const c = CONCEPTS.find((x) => x.id === cid);
    return `<p class="note"><b>${esc(t().inConcept(c?.letter || ''))}:</b> ${esc(text[L()])}</p>`;
  }).join('');
  return `<article class="page" id="${domId(page.id)}">
    <div>
      <h3>${esc(page[state.lang])} <span class="mono" dir="ltr">/${esc(page.id === '(selector)' ? '' : page.id)}</span></h3>
      <div class="tags">${sourcePills(why)}</div>
      <p class="why">${esc(why.why[L()])}</p>
      ${notes}
      ${refsList(why)}
      ${items.length ? `<ul class="items" aria-label="${esc(t().delivers)}">${items.map((it) => `<li class="${it.status ? 'partial' : ''}">${it.status ? '◐ ' : '✓ '}${esc(it.text[L()])}</li>`).join('')}</ul>` : ''}
    </div>
    <div class="concepts">${conceptBadges(page)}</div>
  </article>`;
}

function matches(page) {
  if (state.source && page.why.source !== state.source) return false;
  const q = state.q.trim().toLowerCase().replace(/^§/, '');
  if (!q) return true;
  const why = page.why;
  const hay = [
    page.en, page.ar, page.id, why.why[0], why.why[1],
    ...(why.sow || []).flatMap((id) => [id, ...(sectionById.get(id)?.title || [])]),
    ...(why.bylaws || []).flatMap((id) => [id, ...(bylawById.get(id)?.title || [])]),
    ...(why.items || []).flatMap((id) => itemById.get(id)?.text || []),
  ].join(' ').toLowerCase();
  return hay.includes(q);
}

function pageLink(id) {
  const p = pageById.get(id);
  return p ? `<a href="#${domId(id)}" data-page="${esc(id)}">${esc(p[state.lang])}</a>` : '';
}

// ------------------------------------------------------------------ views

function stats() {
  const by = (fn) => PAGES.reduce((acc, p) => { const k = fn(p); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  const sources = by((p) => p.why.source);
  const states = COVERAGE.reduce((acc, c) => { acc[c.state] = (acc[c.state] || 0) + 1; return acc; }, {});
  const ms = by((p) => milestoneOf(p.why) || 0);
  const li = (pill, label, n) => `<li><b>${n || 0}</b><span class="pill ${pill}">${esc(label)}</span></li>`;
  return `<div class="stats">
    <section class="stat"><h2>${esc(t().statPages)}</h2><ul>${['sow', 'bylaws', 'nice'].map((s) => li(s, t().source[s], sources[s])).join('')}</ul></section>
    <section class="stat"><h2>${esc(t().statItems)}</h2><ul>${['shown', 'everywhere', 'partial', 'build', 'gap'].filter((s) => states[s] || s !== 'gap').map((s) => li(s, t().state[s], states[s])).join('')}</ul></section>
    <section class="stat"><h2>${esc(t().statMilestones)}</h2><ul>${[1, 2, 3].map((m) => li('plain', t().milestone(m, MILESTONES[m].week), ms[m])).join('')}${li('plain', t().noMilestone, ms[0])}</ul></section>
  </div>`;
}

function pagesView() {
  const shown = PAGES.filter(matches);
  if (!shown.length) return `<p class="empty">${esc(t().none)}</p>`;
  return AREAS.map((area) => {
    const list = shown.filter((p) => p.area === area);
    if (!list.length) return '';
    return `<section class="area"><h2>${esc(t().areas[area])}</h2>${list.map(pageCard).join('')}</section>`;
  }).join('');
}

function itemRow(cov) {
  const it = itemById.get(cov.item);
  const pages = cov.pages.map(pageLink).filter(Boolean);
  return `<tr>
    <td>${esc(it.text[L()])}${it.note ? `<span class="why-note">${esc(it.note[L()])}</span>` : ''}</td>
    <td class="state"><span class="pill ${cov.state}">${esc(t().state[cov.state])}</span></td>
    <td><div class="links">${pages.length ? pages.join('') : `<span class="muted">${esc(t().noPages)}</span>`}</div></td>
  </tr>`;
}

function sectionsView(filter) {
  const q = state.q.trim().toLowerCase().replace(/^§/, '');
  const out = SOW.map((s) => {
    let rows = COVERAGE.filter((c) => c.section === s.id && (!filter || filter(c)));
    if (q && !`${s.id} ${s.title.join(' ')}`.toLowerCase().includes(q)) rows = rows.filter((c) => itemById.get(c.item).text.join(' ').toLowerCase().includes(q));
    if (!rows.length) return '';
    const m = s.milestone;
    return `<section class="section" id="s-${esc(s.id)}">
      <div class="section-head"><h3><bdi class="mono" dir="ltr">§${esc(s.id)}</bdi> ${esc(s.title[L()])}</h3>${m ? `<span class="pill plain">${esc(t().milestone(m, MILESTONES[m].week))}</span>` : ''}</div>
      <table><thead><tr><th>${esc(t().item)}</th><th>${esc(t().status)}</th><th>${esc(t().pages)}</th></tr></thead><tbody>${rows.map(itemRow).join('')}</tbody></table>
    </section>`;
  }).join('');
  return out || `<p class="empty">${esc(t().none)}</p>`;
}

function gapsView() {
  const rest = (c) => c.state !== 'shown' && c.state !== 'everywhere';
  const any = COVERAGE.some(rest);
  return `<p class="intro-note muted" style="max-width:78ch">${esc(any ? t().gapsLede : t().allShown)}</p>${any ? sectionsView(rest) : ''}`;
}

function render() {
  const s = t();
  document.documentElement.lang = state.lang;
  document.documentElement.dir = s.dir;
  document.title = `${s.title} · AGS`;
  document.getElementById('brand-label').textContent = s.brand;
  const langBtn = document.getElementById('lang');
  langBtn.textContent = s.other;
  langBtn.lang = state.lang === 'ar' ? 'en' : 'ar';

  const focused = document.activeElement?.id;
  const caret = document.activeElement?.selectionStart;
  const tabs = Object.entries(s.tabs).map(([id, label]) => `<button type="button" role="tab" id="tab-${id}" aria-selected="${state.tab === id}" aria-controls="view" data-tab="${id}">${esc(label)}</button>`).join('');
  const body = state.tab === 'pages' ? pagesView() : state.tab === 'sections' ? sectionsView() : gapsView();
  app.innerHTML = `
    <div class="wrap intro"><h1>${esc(s.title)}</h1><p>${esc(s.lede)}</p>${stats()}</div>
    <div class="bar"><div class="wrap">
      <div class="tabs" role="tablist">${tabs}</div>
      <div class="filters">
        ${state.tab === 'pages' ? `<label>${esc(s.sourceLabel)}<select id="source"><option value="">${esc(s.anySource)}</option>${['sow', 'bylaws', 'nice'].map((x) => `<option value="${x}" ${state.source === x ? 'selected' : ''}>${esc(s.source[x])}</option>`).join('')}</select></label>` : ''}
        <label>${esc(s.search)}<input id="q" type="search" value="${esc(state.q)}" placeholder="${esc(s.searchPh)}"></label>
      </div>
    </div></div>
    <main class="wrap" id="view" role="tabpanel" aria-labelledby="tab-${state.tab}">${body}</main>
    <footer class="site-foot"><div class="wrap">${s.foot.map((p) => `<p>${esc(p)}</p>`).join('')}</div></footer>`;
  if (focused === 'q') {
    const q = document.getElementById('q');
    q.focus();
    if (caret != null) q.setSelectionRange(caret, caret);
  }
}

/** Show the page or section the address points at: `#<page type id>` from the presenter sidebar, `#p-…`, or `#s-3.1`. */
function followHash() {
  const raw = decodeURIComponent(location.hash.slice(1));
  if (!raw) return;
  let id;
  if (raw.startsWith('s-')) { state.tab = 'sections'; id = raw; }
  else {
    const page = raw === 'home' ? pageById.get('') : pageById.get(raw) || PAGES.find((p) => domId(p.id) === raw);
    if (!page) return;
    state.tab = 'pages'; state.q = ''; state.source = '';
    id = domId(page.id);
  }
  render();
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('hit');
  el.scrollIntoView({ block: 'start' });
}

app.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-tab]');
  if (tab) { state.tab = tab.dataset.tab; render(); return; }
  const sec = e.target.closest('[data-section]');
  if (sec) { e.preventDefault(); history.replaceState(null, '', `#s-${sec.dataset.section}`); followHash(); return; }
  const page = e.target.closest('[data-page]');
  if (page) { e.preventDefault(); state.q = ''; history.replaceState(null, '', `#${domId(page.dataset.page)}`); followHash(); }
});
app.addEventListener('keydown', (e) => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const ids = Object.keys(t().tabs);
  const step = (e.key === 'ArrowRight') === (state.lang === 'en') ? 1 : -1;
  state.tab = ids[(ids.indexOf(state.tab) + step + ids.length) % ids.length];
  render();
  document.getElementById(`tab-${state.tab}`)?.focus();
});
app.addEventListener('input', (e) => {
  if (e.target.id === 'q') { state.q = e.target.value; render(); }
});
app.addEventListener('change', (e) => {
  if (e.target.id === 'source') { state.source = e.target.value; render(); }
});
document.getElementById('lang').addEventListener('click', () => {
  state.lang = state.lang === 'ar' ? 'en' : 'ar';
  try { localStorage.setItem(LANG_KEY, state.lang); } catch { /* ignore */ }
  render();
});
window.addEventListener('hashchange', followHash);

render();
followHash();
