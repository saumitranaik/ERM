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
