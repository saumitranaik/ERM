// Run from the repo root: node demos/validate-catalogue.mjs [--strict-renders]   (no dependencies)
// Checks the derived ERM_Video_Catalogue_and_Descriptions.md against the authoritative
// video-production-manifest.md. Read-only.
//  - Structural validation (default): catalogue/manifest/links/anchors/statuses/production packages.
//    Passes on a clean checkout: generated MP4s are Git-ignored and are NOT required.
//  - Render validation: local MP4 presence is reported as informational notes by default
//    (never a failure). With --strict-renders, a manifest-'Rendered' video whose local MP4 is
//    missing, or an MP4 present that the manifest does not mark Rendered, is a failure.
// Exits 1 on any failure.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
// Normalise CRLF (Windows checkouts with core.autocrlf) so the line-anchored patterns below match.
const read = (f) => readFileSync(join(dir, f), 'utf8').replace(/\r\n/g, '\n');
const cat = read('ERM_Video_Catalogue_and_Descriptions.md');
const man = read('video-production-manifest.md');
const strict = process.argv.includes('--strict-renders');
const errors = [];
const notes = [];
const fail = (m) => errors.push(m);
const renderIssue = (m) => (strict ? errors.push(m) : notes.push(m));

// Manifest Table C rows: | NN | status x4 | `demos/<folder>/` | `<file>.mp4` | ...
const rows = [...man.matchAll(/^\| (\d\d) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| `demos\/([^/`]+)\/` \| `([^`]+\.mp4)`/gm)]
  .map((m) => ({ n: m[1], pkg: m[2].trim(), render: m[3].trim(), qa: m[4].trim(), approval: m[5].trim(), folder: m[6], mp4: m[7] }));
if (rows.length !== 46) fail(`manifest status table has ${rows.length} rows, expected 46`);

// Manifest titles + workflow ids: | NN | L?-NN | Title | ...
const titles = new Map([...man.matchAll(/^\| (\d\d) \| (L\d-\d\d) \| ([^|]+) \|/gm)].map((m) => [m[1], { wf: m[2], title: m[3].trim() }]));

// Catalogue sections
const sections = [...cat.matchAll(/<a id="video-(\d\d)"><\/a>\n### Video \1 — (.+)\n\n- \*\*Identifier\*\*: Video \1 \(workflow (L\d-\d\d)\)\n- \*\*Status\*\*: (.+)\n\n(.+)/g)];
const ids = sections.map((s) => s[1]);
if (new Set(ids).size !== ids.length) fail('duplicate video ids in catalogue');
if (JSON.stringify(ids) !== JSON.stringify(rows.map((r) => r.n))) fail(`catalogue video order/coverage differs from manifest (${ids.length} vs ${rows.length})`);
if ((cat.match(/<a id="erm-summary-video"><\/a>/g) ?? []).length !== 1) fail('ERM Summary Video anchor must appear exactly once');
if (cat.indexOf('erm-summary-video"></a>') > cat.indexOf('<a id="video-01">')) fail('ERM Summary Video must precede Video 01');

// Anchors: every ToC link resolves; anchors unique
const anchors = [...cat.matchAll(/<a id="([^"]+)"><\/a>/g)].map((m) => m[1]);
if (new Set(anchors).size !== anchors.length) fail('duplicate anchors');
for (const m of cat.matchAll(/\]\(#([^)]+)\)/g)) if (!anchors.includes(m[1])) fail(`unresolved in-page link #${m[1]}`);

// Relative file links resolve
for (const m of cat.matchAll(/\]\((?!https?:|#)([^)#]+)(#[^)]*)?\)/g)) if (!existsSync(join(dir, m[1]))) fail(`broken link ${m[1]}`);

let renderPresent = 0;
for (const s of sections) {
  const [, n, title, wf, status, desc] = s;
  const row = rows.find((r) => r.n === n);
  const t = titles.get(n);
  if (!row || !t) { fail(`Video ${n}: not in manifest`); continue; }
  if (t.title !== title.trim()) fail(`Video ${n}: title "${title}" != manifest "${t.title}"`);
  if (t.wf !== wf) fail(`Video ${n}: workflow ${wf} != manifest ${t.wf}`);
  if (desc.trim().length < 80) fail(`Video ${n}: description missing or too short`);
  const mp4 = join(dir, row.folder, row.mp4);
  const produced = row.pkg !== 'Not Started';
  const rendered = row.render.startsWith('Rendered');
  // Status in catalogue must match manifest axes
  const st = status.toLowerCase();
  if (!produced && !/^not started/.test(st)) fail(`Video ${n}: manifest Not Started but catalogue says "${status}"`);
  if (produced && !st.includes('production package complete')) fail(`Video ${n}: catalogue missing package status`);
  if (rendered !== st.includes('rendered')) fail(`Video ${n}: rendered claim disagrees with manifest`);
  if (/approved|published/.test(st.replace(/not (published|approved)|approval not started/g, '')) && row.approval === 'Not Started') fail(`Video ${n}: catalogue claims approval/publication manifest does not record`);
  // Evidence on disk
  if (rendered && !existsSync(mp4)) renderIssue(`Video ${n}: manifest says rendered but local ${row.folder}/${row.mp4} is absent (MP4s are Git-ignored)`);
  if (!rendered && existsSync(mp4)) renderIssue(`Video ${n}: local ${row.mp4} exists but manifest does not say rendered`);
  if (rendered && existsSync(mp4)) renderPresent++;
  if (produced && !existsSync(join(dir, row.folder, 'asset-inventory.md'))) fail(`Video ${n}: production package folder incomplete`);
}

if (errors.length) { console.error(errors.map((e) => 'FAIL  ' + e).join('\n')); console.error(`\n${errors.length} problem(s)`); process.exit(1); }
const renderedCount = rows.filter((r) => r.render.startsWith('Rendered')).length;
for (const n of notes) console.warn('NOTE  ' + n);
console.log(`RENDER  ${renderPresent}/${renderedCount} manifest-rendered videos have a local MP4${strict ? ' (strict: enforced)' : ' (informational; use --strict-renders to enforce)'}`);
console.log(`OK  structural: ${sections.length} catalogue entries match manifest (${rows.filter((r) => r.pkg !== 'Not Started').length} with production activity); links, anchors, order and production packages verified`);
