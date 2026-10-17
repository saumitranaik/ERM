// Browser end-to-end check of the Log Risk journey. No dependencies: drives an installed
// Chromium-based browser (Edge/Chrome) over the DevTools protocol using Node's built-in WebSocket.
// Prereq: the prototype running (npm run dev). Run: npm run test:e2e
// Env: BASE_URL (default http://localhost:3100), BROWSER_PATH (override browser executable).
// Uses a throwaway browser profile, so it never touches real browser data or localStorage.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:3100';
const PORT = 9400 + Math.floor(Math.random() * 400);
const candidates = [
  process.env.BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const exe = candidates.find((p) => existsSync(p));
if (!exe) {
  console.error('No Chromium-based browser found; set BROWSER_PATH.');
  process.exit(2);
}

const profile = mkdtempSync(join(tmpdir(), 'erm-e2e-'));
const proc = spawn(exe, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let tabs;
for (let i = 0; i < 40 && !tabs; i++) {
  try { tabs = await (await fetch(`http://localhost:${PORT}/json`)).json(); } catch { await sleep(250); }
}
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pend = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); pend.get(m.id)?.(m); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result.result.value;
};
const nav = async (p) => { await send('Page.navigate', { url: BASE + p }); await sleep(2500); };
const text = () => ev('document.body.innerText');
const path = () => ev('location.pathname + location.search');
const typeInto = async (sel, value) => {
  await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});e.focus();e.select();})()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  if (value) await send('Input.insertText', { text: value });
};
const ALL = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];
const fire = (target) => ALL.map((k) => `${target}.dispatchEvent(new PointerEvent('${k}',{bubbles:true,button:0,pointerType:'mouse'}))`).join(';');
// Radix selects occasionally ignore a synthetic option click under load, so retry until the trigger shows a value.
const pick = async (fieldId, label) => {
  let r = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    await ev(`(()=>{const b=document.querySelector('#${fieldId}');${fire('b')}})()`);
    await sleep(400);
    r = await ev(`(()=>{const o=[...document.querySelectorAll('[role=option]')];const e=${label ? `o.find(x=>x.textContent.includes(${JSON.stringify(label)}))` : 'o[0]'};if(!e)return null;${fire('e')};return e.textContent})()`);
    await sleep(300);
    if (r && !/^Select/.test(await ev(`document.querySelector('#${fieldId}').textContent.trim()`))) return r;
    await ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
    await sleep(200);
  }
  return r;
};
const setDate = (sel, v) => ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(v)});e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
const clickButton = (label) => ev(`(()=>{const e=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()===${JSON.stringify(label)});if(!e)return false;e.click();return true})()`);
const setPersona = (p) => ev(`localStorage.setItem('erm-prototype-session-v1','${p}')`);
const getDb = async () => JSON.parse(await ev(`localStorage.getItem('erm-prototype-db-v1')`));

let failed = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  -> ' + detail}`);
  if (!cond) failed++;
};

try {
  await nav('/login');
  await ev(`localStorage.removeItem('erm-prototype-db-v1')`);
  await setPersona('p-riskmgr');

  // Entry points
  await nav('/modules/RISK');
  check('dashboard shows Log Risk for RISK_MAKER', await clickButton('Log Risk'));
  await sleep(1500);
  check('dashboard Log Risk opens /risks/new', (await path()) === '/modules/RISK/risks/new', await path());
  await nav('/modules/RISK/risks');
  check('register shows Log Risk', await clickButton('Log Risk'));
  await sleep(1500);
  check('register Log Risk opens /risks/new', (await path()) === '/modules/RISK/risks/new', await path());

  // Empty submit: nothing saved (the db key is only written on the first mutation)
  await clickButton('Log Risk');
  await sleep(500);
  let t = await text();
  check('empty save: "Nothing has been saved." message', t.includes('Nothing has been saved.'));
  check(
    'empty save: inline errors on required fields',
    ['Title is required.', 'Description is required.', 'Inherent Likelihood (1–5) is required.', 'Inherent Impact (1–5) is required.'].every((m) => t.includes(m)),
  );
  check(
    'empty save: stays on form, nothing persisted',
    (await path()) === '/modules/RISK/risks/new' && (await ev(`localStorage.getItem('erm-prototype-db-v1')`)) === null,
  );

  // Boundaries and invalid values
  for (const [v, valid] of [['1', true], ['5', true], ['0', false], ['6', false], ['1.5', false], ['-1', false], ['abc', false]]) {
    await typeInto('#f-inherentLikelihood', v);
    await sleep(150);
    t = await text();
    const rejected = t.includes('Enter a whole number from 1 to 5.') || t.includes('Inherent Likelihood (1–5) is required.');
    check(`likelihood ${JSON.stringify(v)} ${valid ? 'accepted' : 'rejected'}`, valid ? !rejected : rejected);
  }

  // An invalid value blocks save even when everything else is complete
  await typeInto('#f-title', 'ZZ-TEST e2e risk');
  await typeInto('#f-description', 'Disposable e2e risk');
  await pick('f-category', 'Operations');
  await pick('f-ownerId', 'Sanjay');
  await pick('f-departmentId');
  await pick('f-source', 'Manual');
  await setDate('#f-identifiedDate', '2026-10-01');
  await typeInto('#f-inherentLikelihood', '6');
  await typeInto('#f-inherentImpact', '5');
  await clickButton('Log Risk');
  await sleep(600);
  check('out-of-range value blocks save', (await path()) === '/modules/RISK/risks/new' && (await text()).includes('Nothing has been saved.'));
  check('out-of-range save persisted nothing', (await ev(`localStorage.getItem('erm-prototype-db-v1')`)) === null);

  // Valid create
  await typeInto('#f-inherentLikelihood', '5');
  await typeInto('#f-inherentImpact', '5');
  await typeInto('#f-residualLikelihood', '2');
  await typeInto('#f-residualImpact', '3');
  await clickButton('Log Risk');
  // Wait for navigation off the form: the first visit to the detail route compiles on demand under `next dev`.
  for (let i = 0; i < 40 && (await path()).endsWith('/new'); i++) await sleep(500);
  await sleep(500);
  const p = await path();
  t = await text();
  check('save navigates to the new risk detail page (created flag is consumed from the URL)', /^\/modules\/RISK\/risks\/(?!new$)[^/?]+$/.test(p), `${p} :: ${t.slice(t.indexOf('Nothing has been saved'), t.indexOf('Nothing has been saved') + 200).replace(/\s+/g, ' ')}`);
  const db = await getDb();
  const r =db.risks.find((x) => x.title === 'ZZ-TEST e2e risk');
  check('exactly one record added', db.risks.length === 21, String(db.risks.length));
  check('code follows RSK-YYYY-NNNN', /^RSK-\d{4}-\d{4}$/.test(r?.code ?? ''), r?.code);
  check('status is DRAFT', r?.status === 'DRAFT');
  check('inherent score 25, residual score 6', r?.inherentScore === 25 && r?.residualScore === 6, `${r?.inherentScore}/${r?.residualScore}`);
  const hist = db.history.filter((h) => h.entityId === r.id);
  check('history has a single RECORD_CREATED entry', hist.length === 1 && hist[0].action === 'RECORD_CREATED' && hist[0].toStatus === 'DRAFT');
  check('no pending approval created by logging', db.pendingActions.every((a) => a.entityId !== r.id));
  check(
    'banner states Draft / not submitted / this browser',
    t.includes(`${r.code} logged as Draft`) && t.includes('has not been submitted for approval') && t.includes('stored in this browser only'),
  );

  // Persistence and banner behaviour
  await ev('location.reload()');
  await sleep(2500);
  t = await text();
  check('after refresh: record persists and banner does not replay', t.includes(r.code) && !t.includes('has not been submitted'));
  await nav(`/modules/RISK/risks/${r.id}?created=1`);
  const shown = (await text()).includes('has not been submitted');
  await ev(`document.querySelector('[aria-label=Dismiss]').click()`);
  await sleep(300);
  check('banner shown, then dismiss hides it', shown && !(await text()).includes('has not been submitted'));
  await nav('/modules/RISK');
  await nav('/modules/RISK/risks');
  check('record listed in register after navigating away and back', (await text()).includes(r.code));
  await ev(`[...document.querySelectorAll('tbody tr')].find(x=>x.textContent.includes(${JSON.stringify(r.code)})).click()`);
  await sleep(1500);
  check('record opens from register', (await path()) === `/modules/RISK/risks/${r.id}`, await path());

  // Maker-checker intact
  await clickButton('Submit for Assessment Approval');
  await sleep(800);
  await ev(`(()=>{const e=document.querySelector('[role=dialog] textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'e2e');e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await sleep(200);
  await ev(`[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Submit for approval').click()`);
  await sleep(1500);
  const after = await getDb();
  const pa = after.pendingActions.filter((a) => a.entityId === r.id);
  check('submit creates one pending action and moves to UNDER_REVIEW', pa.length === 1 && after.risks.find((x) => x.id === r.id).status === 'UNDER_REVIEW');
  check('maker cannot decide own submission', !/\bApprove\b/.test(await text()));
  await setPersona('p-cro');
  await nav(`/modules/RISK/risks/${r.id}`);
  await sleep(800);
  t = await text();
  check('checker (different persona, not owner) sees Approve and Reject', /\bApprove\b/.test(t) && /\bReject\b/.test(t), t.replace(/\s+/g, ' ').slice(0, 400));

  // Independent checker approves (owner is Sanjay, checker is Priya)
  await clickButton('Approve');
  await sleep(500);
  await ev(`[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Confirm approve').click()`);
  await sleep(1200);
  let d2 = await getDb();
  check('independent checker approve: risk ACTIVE, action approved, ACTION_APPROVED in history',
    d2.risks.find((x) => x.id === r.id).status === 'ACTIVE' &&
    d2.pendingActions.find((a) => a.entityId === r.id).status === 'approved' &&
    d2.history.some((h) => h.entityId === r.id && h.action === 'ACTION_APPROVED' && h.actorId === 'p-cro'));

  // Log + submit a risk as the Risk Manager; owner chosen by name
  const logAndSubmit = async (title, ownerName) => {
    await setPersona('p-riskmgr');
    await nav('/modules/RISK/risks/new');
    await typeInto('#f-title', title);
    await typeInto('#f-description', 'Disposable e2e risk');
    await pick('f-category', 'Operations');
    await pick('f-ownerId', ownerName);
    await pick('f-departmentId');
    await pick('f-source', 'Manual');
    await setDate('#f-identifiedDate', '2026-10-01');
    await typeInto('#f-inherentLikelihood', '3');
    await typeInto('#f-inherentImpact', '3');
    await clickButton('Log Risk');
    for (let i = 0; i < 40 && (await path()).endsWith('/new'); i++) await sleep(500);
    await sleep(500);
    await clickButton('Submit for Assessment Approval');
    await sleep(800);
    await ev(`(()=>{const e=document.querySelector('[role=dialog] textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'e2e');e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    await sleep(200);
    await ev(`[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Submit for approval').click()`);
    await sleep(1500);
    const dbx = await getDb();
    return dbx.risks.find((x) => x.title === title);
  };

  // Risk-owner restriction: Priya (CRO, the only RISK_CHECKER) owns the risk Arjun submitted
  const owned = await logAndSubmit('ZZ-TEST e2e owner-restricted', 'Priya');
  await setPersona('p-cro');
  await nav(`/modules/RISK/risks/${owned.id}`);
  t = await text();
  check('risk owner (authorised checker, not submitter): no Approve/Reject controls, reason shown',
    !/\bApprove\b/.test(t) && !/\bReject\b/.test(t) && t.includes('Owner restriction'), t.slice(0, 0));
  check('no-independent-checker notice shown when the sole checker owns the risk', t.includes('independent checker is required and none is currently available'));
  await nav('/protected/approvals');
  const rowText = await ev(`(()=>{const a=document.querySelector('a[href$="/risks/${owned.id}"]');const c=a&&a.closest('.space-y-3 > *');return c?c.innerText:'<card not found>'})()`);
  check('approvals queue also withholds Approve/Reject from the owner', !/\bApprove\b/.test(rowText) && !/\bReject\b/.test(rowText) && rowText.includes('Owner restriction'), rowText.slice(0, 200));
  const d3 = await getDb();
  check('owner-restricted risk remains UNDER_REVIEW with its action pending',
    d3.risks.find((x) => x.id === owned.id).status === 'UNDER_REVIEW' && d3.pendingActions.find((a) => a.entityId === owned.id).status === 'pending');
  await setPersona('p-riskmgr');
  await nav(`/modules/RISK/risks/${owned.id}`);
  check('the maker still cannot approve/reject (separation of duties)', !/\bApprove\b/.test(await text()) && !/\bReject\b/.test(await text()));

  // Independent checker rejects
  const rej = await logAndSubmit('ZZ-TEST e2e reject', 'Sanjay');
  await setPersona('p-cro');
  await nav(`/modules/RISK/risks/${rej.id}`);
  await clickButton('Reject');
  await sleep(500);
  await ev(`(()=>{const e=document.querySelector('[role=dialog] textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'e2e reason');e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await sleep(200);
  await ev(`[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Confirm reject').click()`);
  await sleep(1200);
  const d4 = await getDb();
  check('independent checker reject: risk back to DRAFT, action rejected, ACTION_REJECTED in history',
    d4.risks.find((x) => x.id === rej.id).status === 'DRAFT' &&
    d4.pendingActions.find((a) => a.entityId === rej.id).status === 'rejected' &&
    d4.history.some((h) => h.entityId === rej.id && h.action === 'ACTION_REJECTED'));

  // Unauthorised persona (no RISK_CHECKER) sees no decision controls on a pending risk
  await setPersona('p-hoc');
  await nav(`/modules/RISK/risks/${owned.id}`);
  t = await text();
  check('persona without RISK_CHECKER cannot decide (no controls, role message)', !/\bApprove\b/.test(t) && !/\bReject\b/.test(t) && t.includes('RISK_CHECKER'));


  // Assessment scoring lifecycle: approve projects the residual onto the parent; reject does not.
  const logAssessment = async (title, riskLabel, rl, ri) => {
    await setPersona('p-riskmgr');
    await nav('/modules/RISK/assessments/new');
    await typeInto('#f-title', title);
    await pick('f-riskId', riskLabel);
    await setDate('#f-assessmentDate', '2026-10-05');
    await pick('f-assessorId', 'Arjun');
    await typeInto('#f-inherentLikelihood', '4');
    await typeInto('#f-inherentImpact', '4');
    await typeInto('#f-residualLikelihood', rl);
    await typeInto('#f-residualImpact', ri);
    await typeInto('#f-rationale', 'e2e rationale');
    await clickButton('Create Risk Assessment');
    for (let i = 0; i < 40 && (await path()).endsWith('/new'); i++) await sleep(500);
    await sleep(500);
    await clickButton('Submit for Approval');
    await sleep(800);
    await ev(`(()=>{const e=document.querySelector('[role=dialog] textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'e2e');e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    await sleep(200);
    await ev(`[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Submit for approval').click()`);
    await sleep(1500);
    return (await getDb()).riskAssessments.find((x) => x.title === title);
  };
  const decide = async (a, label, comment) => {
    await setPersona('p-cro');
    await nav(`/modules/RISK/assessments/${a.id}`);
    await clickButton(label);
    await sleep(500);
    if (comment) await ev(`(()=>{const e=document.querySelector('[role=dialog] textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(comment)});e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    await sleep(200);
    await ev(`[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Confirm ${label.toLowerCase()}').click()`);
    await sleep(1200);
    return getDb();
  };
  const before = (await getDb()).risks.find((x) => x.id === 'r-001');
  const rejA = await logAssessment('ZZ-TEST e2e assessment reject', 'NAV', '1', '1');
  check('assessment saved with a matrix snapshot (inherent 16 High, residual 1 Low)',
    rejA?.scoringMatrixVersion === 'illustrative-1' && rejA.inherentScore === 16 && rejA.inherentBand === 'High' && rejA.residualScore === 1 && rejA.residualBand === 'Low', JSON.stringify(rejA));
  let dd = await decide(rejA, 'Reject', 'e2e reject');
  let r2 = dd.risks.find((x) => x.id === 'r-001');
  check('rejected assessment leaves the parent residual unchanged', r2.residualScore === before.residualScore && r2.residualOrigin === before.residualOrigin, `${r2.residualScore}`);
  const okA = await logAssessment('ZZ-TEST e2e assessment approve', 'NAV', '2', '2');
  dd = await decide(okA, 'Approve');
  r2 = dd.risks.find((x) => x.id === okA.riskId);
  check('approved assessment projects residual 4 onto the parent with provenance',
    r2.residualScore === 4 && r2.residualLikelihood === 2 && r2.residualImpact === 2 && r2.residualOrigin === 'APPROVED_ASSESSMENT' && r2.residualSourceAssessmentId === okA.id && r2.residualSourceMatrixVersion === 'illustrative-1', JSON.stringify(r2));
  check('projection is recorded in the Risk history', dd.history.some((h) => h.entityId === r2.id && h.action === 'RESIDUAL_PROJECTED'));
  check('assessment is APPROVED with its action approved', dd.riskAssessments.find((x) => x.id === okA.id).status === 'APPROVED' && dd.pendingActions.find((a) => a.entityId === okA.id).status === 'approved');
  await nav(`/modules/RISK/risks/${r2.id}`);
  t = await text();
  check('Risk detail shows the residual origin and source assessment', t.includes(okA.code) && /Approved Assessment/i.test(t), t.replace(/\s+/g, ' ').slice(0, 300));

  // Permissions: every persona without RISK_MAKER
  const noCreate = db.personas.filter((x) => !x.roles.includes('RISK_MAKER')).map((x) => x.id);
  const leaks = [];
  for (const pid of noCreate) {
    await setPersona(pid);
    await nav('/modules/RISK/risks/new');
    const form = (await text()).includes('Fields marked');
    await nav('/modules/RISK/risks');
    const reg = (await text()).includes('Log Risk');
    await nav('/modules/RISK');
    const dash = (await text()).includes('Log Risk');
    if (form || reg || dash) leaks.push(pid);
  }
  check(`${noCreate.length} non-RISK_MAKER personas: no Log Risk button, form blocked`, leaks.length === 0, leaks.join(','));
} catch (e) {
  console.error('ERROR', e);
  failed++;
} finally {
  ws.close();
  proc.kill();
  await sleep(500);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* browser may still hold handles */ }
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
