// Decision board logic without the page: matching notes to page types, links and the export.
// Tested by claude/review/board.test.ts.

export const VERDICTS = ['keep', 'change', 'drop', 'question'];
export const STATUSES = ['decided', 'discuss', 'deferred'];
/** Notes on pages that no page type covers. */
export const OTHER = '(other)';

const segments = (path) => (path ? path.split('/') : []);

function covers(pattern, path) {
  const p = segments(pattern), s = segments(path);
  return p.length === s.length && p.every((seg, i) => seg.startsWith(':') || seg === s[i]);
}

/** The page type a note belongs to: the most specific route and query that match its page. */
export function rowFor(note, types) {
  const [path, query = ''] = String(note.page || '').split('?');
  const params = new URLSearchParams(query);
  let best, score = -1;
  for (const type of types) {
    const t = type.pages[note.concept];
    if (!t || t.hash || t.sameAs || !covers(t.path, path)) continue;
    const needs = [...new URLSearchParams(t.query || '')];
    if (!needs.every(([k, v]) => params.get(k) === v)) continue;
    const s = needs.length * 100 + segments(t.path).filter((seg) => !seg.startsWith(':')).length;
    if (s > score) { best = type; score = s; }
  }
  return best ? best.id : OTHER;
}

/**
 * Notes by page type and concept, as threads: `{ [typeId]: { [conceptId]: [{ note, replies }] } }`.
 * Replies follow their note, oldest first.
 */
export function threadsByRow(notes, types) {
  const byCreated = (a, b) => String(a.created).localeCompare(String(b.created));
  const replies = new Map();
  for (const n of notes) if (n.parentId) replies.set(n.parentId, [...(replies.get(n.parentId) || []), n]);
  const rows = {};
  for (const note of notes.filter((n) => !n.parentId).sort(byCreated)) {
    const row = (rows[rowFor(note, types)] ||= {});
    (row[note.concept] ||= []).push({ note, replies: (replies.get(note.id) || []).sort(byCreated) });
  }
  return rows;
}

export function verdictCounts(threads = []) {
  const counts = Object.fromEntries(VERDICTS.map((v) => [v, 0]));
  for (const { note } of threads) if (note.verdict in counts) counts[note.verdict] += 1;
  return counts;
}

/** Path of a page from the concept root, in the given language. `null` for a detail route. */
export function targetPath(concept, target, lang) {
  if (target.path === '(selector)') return '/';
  if (target.path.includes(':')) return null;
  const route = [concept.slug, lang, ...segments(target.path)].join('/');
  return `/${route}${target.query ? `?${target.query}` : ''}${target.hash ? `#${target.hash}` : ''}`;
}

/** A note's page in the given language (notes on one page are shared by both languages). */
export function notePath(note, lang) {
  const parts = String(note.path || '/').split('/');
  if (parts[2] === 'en' || parts[2] === 'ar') parts[2] = lang;
  return parts.join('/');
}

/**
 * URL of a concept page. Published, the board is `/ags-design-preview/review/` beside
 * `/ags-design-preview/design-N/`. Locally it runs on port 5190 and concepts on 5181–5184.
 */
export function conceptUrl(conceptId, path, location) {
  const n = conceptId.replace('design-', '');
  if (location.port === '5190' && !location.pathname.startsWith('/ags-design-preview/')) return `${location.protocol}//${location.hostname}:518${n}${path}`;
  const base = location.pathname.replace(/review\/(index\.html)?$/, '');
  return `${location.origin}${base}design-${n}${path}`;
}

/**
 * The decision record: what to take from which concept, page type by page type. It is the
 * brief for the final design.
 */
export function decisionMarkdown({ types, decisions, rows, concepts, t, lang, date, url }) {
  const name = (c) => `${t.concept} ${c.letter} (${c[lang]})`;
  const label = (type) => type[lang];
  const byId = new Map(decisions.map((d) => [d.pageType, d]));
  const decided = types.filter((type) => byId.get(type.id)?.status || byId.get(type.id)?.concepts.length || byId.get(type.id)?.changes);
  const out = [`# ${t.recordTitle}`, '', t.recordIntro(date, url), ''];
  for (const status of [...STATUSES, '']) {
    const list = decided.filter((type) => (byId.get(type.id).status || '') === status);
    if (!list.length) continue;
    out.push(`## ${status ? t.status[status] : t.noStatus} (${list.length})`, '');
    let area;
    for (const type of list) {
      if (type.area !== area) { area = type.area; out.push(`### ${t.areas[area]}`, ''); }
      const d = byId.get(type.id);
      const chosen = concepts.filter((c) => d.concepts.includes(c.id));
      const noteCount = Object.values(rows[type.id] || {}).reduce((n, list) => n + list.length, 0);
      out.push(`**${label(type)}** — ${chosen.length ? t.takeFromList(chosen.map(name)) : t.noConcept}`);
      if (d.changes.trim()) out.push('', ...d.changes.trim().split('\n').map((line) => `> ${line}`));
      out.push('', `_${[t.noteCount(noteCount), d.updatedBy && t.updatedBy(d.updatedBy, String(d.updated).slice(0, 10))].filter(Boolean).join(' · ')}_`, '');
    }
  }
  const open = types.filter((type) => !decided.includes(type) && rows[type.id]);
  if (open.length) {
    out.push(`## ${t.withoutDecision} (${open.length})`, '');
    for (const type of open) out.push(`- ${label(type)} — ${t.noteCount(Object.values(rows[type.id]).reduce((n, l) => n + l.length, 0))}`);
    out.push('');
  }
  if (!decided.length && !open.length) out.push(t.recordEmpty, '');
  return out.join('\n');
}
