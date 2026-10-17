// Run: npm test  (node:test + Node's built-in TypeScript type stripping; no extra dependencies)
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFields } from '../../src/lib/validation.ts';
import { deriveRiskScores } from '../../src/lib/riskScoring.ts';
import { nextCode } from '../../src/lib/id.ts';

const fields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'inherentLikelihood', label: 'Inherent Likelihood (1–5)', type: 'number', min: 1, max: 5, required: true },
  { key: 'residualImpact', label: 'Residual Impact (1–5)', type: 'number', min: 1, max: 5 },
];
const ok = { title: 'T', inherentLikelihood: 3 };

test('required fields are flagged when empty, undefined or null', () => {
  const e = validateFields(fields, { title: '', inherentLikelihood: undefined });
  assert.equal(e.title, 'Title is required.');
  assert.equal(e.inherentLikelihood, 'Inherent Likelihood (1–5) is required.');
  assert.deepEqual(validateFields(fields, { title: null, inherentLikelihood: null }).title, 'Title is required.');
});

test('valid values produce no errors; optional empty fields are allowed', () => {
  assert.deepEqual(validateFields(fields, ok), {});
});

test('likelihood/impact accept the boundaries 1 and 5', () => {
  for (const n of [1, 2, 3, 4, 5]) assert.deepEqual(validateFields(fields, { ...ok, inherentLikelihood: n, residualImpact: n }), {});
});

test('likelihood/impact reject 0, 6, negatives, decimals and non-numeric values', () => {
  for (const bad of [0, 6, -1, 1.5, 4.99, NaN, 'abc', Infinity]) {
    const e = validateFields(fields, { ...ok, inherentLikelihood: bad, residualImpact: bad });
    assert.equal(e.inherentLikelihood, 'Enter a whole number from 1 to 5.', String(bad));
    assert.equal(e.residualImpact, 'Enter a whole number from 1 to 5.', String(bad));
  }
});

test('scores are likelihood × impact for inherent and residual', () => {
  assert.deepEqual(deriveRiskScores({ inherentLikelihood: 5, inherentImpact: 5, residualLikelihood: 2, residualImpact: 3 }), {
    inherentScore: 25,
    residualScore: 6,
  });
  assert.equal(deriveRiskScores({ inherentLikelihood: 1, inherentImpact: 1 }).inherentScore, 1);
});

test('residual score is undefined when residual inputs are incomplete; no band labels are invented', () => {
  const s = deriveRiskScores({ inherentLikelihood: 2, inherentImpact: 4, residualLikelihood: 2 });
  assert.equal(s.inherentScore, 8);
  assert.equal(s.residualScore, undefined);
  assert.deepEqual(Object.keys(s).sort(), ['inherentScore', 'residualScore']);
});

test('risk codes follow RSK-YYYY-NNNN and increment from the highest existing sequence', () => {
  const year = new Date().getFullYear();
  assert.equal(nextCode([], 'RSK'), `RSK-${year}-0001`);
  assert.equal(nextCode([{ code: `RSK-${year}-0020` }, { code: `RSK-${year}-0003` }, { code: 'XYZ-2026-0099' }], 'RSK'), `RSK-${year}-0021`);
});

// ---- Decision eligibility: maker-checker and risk-owner restriction ----
import { decisionBlockReason } from '../../src/lib/decisionPolicy.ts';

const riskAction = { module: 'RISK', collection: 'risks', createdBy: 'p-riskmgr' };
const ctx = (over = {}) => ({
  action: riskAction,
  entity: { id: 'r-x', ownerId: 'u-sanjay' },
  personaId: 'p-cro',
  userId: 'u-priya',
  hasApprovePermission: true,
  ...over,
});

test('independent authorised checker (not owner) can approve and reject', () => {
  assert.equal(decisionBlockReason(ctx(), 'approve'), null);
  assert.equal(decisionBlockReason(ctx(), 'reject'), null);
});

test('risk owner cannot approve or reject, even as authorised checker and not the submitter', () => {
  const owner = ctx({ entity: { id: 'r-x', ownerId: 'u-priya' } });
  assert.match(decisionBlockReason(owner, 'approve'), /Owner restriction/);
  assert.match(decisionBlockReason(owner, 'reject'), /Owner restriction/);
});

test('creator == owner: owner (who is also maker) is blocked by separation of duties', () => {
  const same = ctx({ action: { ...riskAction, createdBy: 'p-cro' }, entity: { id: 'r-x', ownerId: 'u-priya' } });
  assert.match(decisionBlockReason(same, 'approve'), /Separation of duties/);
  assert.match(decisionBlockReason(same, 'reject'), /Separation of duties/);
});

test('maker cannot decide own submission', () => {
  const maker = ctx({ personaId: 'p-riskmgr', userId: 'u-arjun' });
  assert.match(decisionBlockReason(maker, 'approve'), /Separation of duties/);
});

test('persona without the approve permission cannot decide', () => {
  assert.match(decisionBlockReason(ctx({ hasApprovePermission: false }), 'approve'), /RISK_CHECKER/);
  assert.match(decisionBlockReason(ctx({ hasApprovePermission: false }), 'reject'), /RISK_CHECKER/);
});

test('owner restriction is not extended to other collections or to "return"', () => {
  const owner = ctx({ entity: { id: 'r-x', ownerId: 'u-priya' } });
  assert.equal(decisionBlockReason(owner, 'return'), null);
  const other = ctx({ action: { module: 'CONTROLS', collection: 'controls', createdBy: 'p-controlowner' }, entity: { ownerId: 'u-priya' } });
  assert.equal(decisionBlockReason(other, 'approve'), null);
});

// ---- Checker availability: sole checker is the owner -> fail closed; independent checker can decide ----
// Isolated fixtures only; the seed data (a single RISK_CHECKER persona, the CRO) is not altered.
const eligibleDeciders = (personas, entity, decision = 'approve') =>
  personas.filter((p) => decisionBlockReason(ctx({ personaId: p.id, userId: p.userId, hasApprovePermission: p.checker, entity }), decision) === null);

test('sole RISK_CHECKER who owns the risk: nobody is eligible (fail closed, no silent permit)', () => {
  const personas = [
    { id: 'p-cro', userId: 'u-priya', checker: true },
    { id: 'p-riskmgr', userId: 'u-arjun', checker: false },
  ];
  const entity = { id: 'r-x', ownerId: 'u-priya' };
  assert.deepEqual(eligibleDeciders(personas, entity, 'approve'), []);
  assert.deepEqual(eligibleDeciders(personas, entity, 'reject'), []);
});

test('with an independent checker (fixture), the owner is denied and the independent checker can decide', () => {
  const personas = [
    { id: 'p-cro', userId: 'u-priya', checker: true },
    { id: 'p-alt', userId: 'u-alt', checker: true },
  ];
  const entity = { id: 'r-x', ownerId: 'u-priya' };
  assert.deepEqual(eligibleDeciders(personas, entity).map((p) => p.id), ['p-alt']);
});

// ---- Scoring matrix: consistency, band resolution, invalid configuration (illustrative values) ----
import { ILLUSTRATIVE_MATRIX, validateMatrix, resolveBand } from '../../src/lib/riskMatrix.ts';

test('illustrative matrix is internally consistent and labelled illustrative', () => {
  assert.deepEqual(validateMatrix(ILLUSTRATIVE_MATRIX), []);
  assert.equal(ILLUSTRATIVE_MATRIX.status, 'ILLUSTRATIVE');
});

test('every achievable score 1..25 resolves to exactly one band label', () => {
  for (let s = 1; s <= 25; s++) {
    const b = resolveBand(s);
    assert.ok(b && b.label, `score ${s}`);
    assert.equal(ILLUSTRATIVE_MATRIX.bands.filter((x) => s >= x.min && s <= x.max).length, 1);
  }
  assert.equal(resolveBand(4).label, 'Low');
  assert.equal(resolveBand(5).label, 'Medium');
  assert.equal(resolveBand(16).label, 'High');
  assert.equal(resolveBand(25).label, 'Critical');
});

test('every likelihood × impact product resolves to a band', () => {
  for (let l = 1; l <= 5; l++) for (let i = 1; i <= 5; i++) assert.ok(resolveBand(l * i), `${l}x${i}`);
});

test('out-of-range or non-integer scores do not resolve', () => {
  for (const bad of [0, 26, -3, 4.5, NaN, undefined, null, '8']) assert.equal(resolveBand(bad), null, String(bad));
});

test('invalid matrices are rejected: gap, overlap, short coverage, overrun, duplicate/missing label, bad levels', () => {
  const m = (bands, extra = {}) => ({ ...ILLUSTRATIVE_MATRIX, bands, ...extra });
  const B = ILLUSTRATIVE_MATRIX.bands;
  assert.match(validateMatrix(m([B[0], { ...B[1], min: 6 }, B[2], B[3]])).join(), /resolve to no band/);
  assert.match(validateMatrix(m([B[0], { ...B[1], min: 4 }, B[2], B[3]])).join(), /overlap/);
  assert.match(validateMatrix(m(B.slice(0, 3))).join(), /17–25 resolve to no band/);
  assert.match(validateMatrix(m([...B.slice(0, 3), { ...B[3], max: 30 }])).join(), /past the maximum/);
  assert.match(validateMatrix(m([B[0], { ...B[1], label: 'low' }, B[2], B[3]])).join(), /Duplicate/);
  assert.match(validateMatrix(m([{ ...B[0], label: ' ' }, ...B.slice(1)])).join(), /label/);
  assert.match(validateMatrix(m([])).join(), /At least one band/);
  assert.match(validateMatrix(m(B, { likelihoodLevels: 0 })).join(), /levels/);
});

test('an invalid matrix fails closed: no band is resolved', () => {
  assert.equal(resolveBand(8, { ...ILLUSTRATIVE_MATRIX, bands: ILLUSTRATIVE_MATRIX.bands.slice(0, 2) }), null);
});

test('grid size is a matrix property: a 4×4 matrix needs coverage to 16', () => {
  const m4 = { ...ILLUSTRATIVE_MATRIX, likelihoodLevels: 4, impactLevels: 4, likelihoodLabels: ['a', 'b', 'c', 'd'], impactLabels: ['a', 'b', 'c', 'd'], bands: [{ label: 'Low', min: 1, max: 6, tone: 'green' }, { label: 'High', min: 7, max: 16, tone: 'red' }] };
  assert.deepEqual(validateMatrix(m4), []);
  assert.equal(resolveBand(17, m4), null);
  assert.equal(resolveBand(16, m4).label, 'High');
});

import { resolveBandFor } from '../../src/lib/riskMatrix.ts';
import { hasEligibleDecider } from '../../src/lib/decisionPolicy.ts';

test('malformed matrix configuration is rejected and fails closed (no throw)', () => {
  for (const bad of [null, 'x', {}, { ...ILLUSTRATIVE_MATRIX, bands: 'nope' }, { ...ILLUSTRATIVE_MATRIX, bands: [null] },
    { ...ILLUSTRATIVE_MATRIX, bands: [{ label: 7, min: 1, max: 25, tone: 'red' }] },
    { ...ILLUSTRATIVE_MATRIX, bands: [{ label: 'All', min: '1', max: 25, tone: 'red' }] },
    { ...ILLUSTRATIVE_MATRIX, bands: [{ label: 'All', min: 1, max: 25, tone: 'purple' }] }]) {
    assert.ok(validateMatrix(bad).length > 0, JSON.stringify(bad));
    assert.equal(resolveBand(5, bad), null);
  }
});

test('resolveBandFor resolves L×I within the grid and rejects out-of-range or non-integer inputs', () => {
  assert.equal(resolveBandFor(5, 5).label, 'Critical');
  assert.equal(resolveBandFor(1, 1).label, 'Low');
  assert.equal(resolveBandFor(3, 3).label, 'Medium');
  for (const [l, i] of [[0, 3], [6, 1], [1, 6], [2.5, 2], ['3', 3], [null, 3], [3, undefined]]) assert.equal(resolveBandFor(l, i), null);
});

test('hasEligibleDecider: false when only checker owns the risk or list is empty; true with an independent checker', () => {
  const entity = { id: 'r-x', ownerId: 'u-priya' };
  const cro = { personaId: 'p-cro', userId: 'u-priya', hasApprovePermission: true };
  const alt = { personaId: 'p-alt', userId: 'u-alt', hasApprovePermission: true };
  assert.equal(hasEligibleDecider(riskAction, entity, [cro]), false);
  assert.equal(hasEligibleDecider(riskAction, entity, []), false);
  assert.equal(hasEligibleDecider(riskAction, entity, [cro, alt]), true);
  assert.equal(hasEligibleDecider(riskAction, entity, [{ ...alt, hasApprovePermission: false }]), false);
});

test('real seed data: a CRO-owned risk has no eligible decider; a non-CRO-owned risk does (seed unchanged)', async () => {
  const { readFileSync } = await import('node:fs');
  const org = JSON.parse(readFileSync(new URL('../../src/data/org.json', import.meta.url), 'utf8'));
  const checkers = org.personas.filter((p) => p.roles.includes('RISK_CHECKER'));
  assert.deepEqual(checkers.map((p) => p.id), ['p-cro']);
  const cands = org.personas.map((p) => ({ personaId: p.id, userId: p.userId, hasApprovePermission: p.roles.includes('RISK_CHECKER') }));
  const cro = org.personas.find((p) => p.id === 'p-cro');
  assert.equal(hasEligibleDecider(riskAction, { ownerId: cro.userId }, cands), false);
  assert.equal(hasEligibleDecider(riskAction, { ownerId: 'u-someone-else' }, cands), true);
});

test('seed risks: stored scores equal L×I and every scored value resolves to a band (data integrity; no policy implied)', async () => {
  const { readFileSync } = await import('node:fs');
  const { risks, riskAssessments } = JSON.parse(readFileSync(new URL('../../src/data/risk.json', import.meta.url), 'utf8'));
  for (const r of risks) {
    for (const k of ['inherent', 'residual']) {
      const l = r[`${k}Likelihood`], i = r[`${k}Impact`], s = r[`${k}Score`];
      if (l == null && i == null) { assert.ok(s == null, `${r.id} ${k} score without inputs`); continue; }
      assert.equal(s, l * i, `${r.id} ${k}Score`);
      assert.equal(resolveBandFor(l, i)?.label, resolveBand(s)?.label, `${r.id} ${k} band`);
      assert.ok(resolveBand(s), `${r.id} ${k} band resolves`);
    }
  }
  for (const a of riskAssessments) {
    for (const k of ['inherent', 'residual']) assert.ok(resolveBandFor(a[`${k}Likelihood`], a[`${k}Impact`]), `${a.id} ${k} resolves`);
  }
});
