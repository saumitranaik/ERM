// Run: npm test. Scoring lifecycle: matrix registry/versioning, assessment snapshot, approval gating and
// the approved-assessment -> parent Risk residual projection. All matrix values are ILLUSTRATIVE.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ILLUSTRATIVE_MATRIX, ACTIVE_MATRIX_REF, MATRIX_REGISTRY, lookupMatrix, activeMatrix, matrixForRef, scoreFor, validateMatrix, resolveBand,
} from '../../src/lib/riskMatrix.ts';
import { deriveRiskScores, deriveRiskFields, residualRef, scoreRefFor } from '../../src/lib/riskScoring.ts';
import {
  snapshotAssessment, deriveAssessmentFields, verifyAssessmentScoring, assessmentApprovalBlockReason,
  planResidualProjection, projectedResidualConsistent, approvalGate,
} from '../../src/lib/riskProjection.ts';

const seed = JSON.parse(readFileSync(new URL('../../src/data/risk.json', import.meta.url), 'utf8'));
const inputs = { inherentLikelihood: 4, inherentImpact: 5, residualLikelihood: 2, residualImpact: 4 };
const assessment = (over = {}) => ({
  id: 'ra-x', code: 'RAS-X', riskId: 'r-x', assessmentDate: '2026-10-01', status: 'SUBMITTED', ...inputs, ...snapshotAssessment(inputs), ...over,
});
const risk = (over = {}) => ({ id: 'r-x', status: 'ACTIVE', residualLikelihood: 3, residualImpact: 3, residualScore: 9, ...over });

// ---- Matrix definition is the single source ----
test('registry: the active reference resolves to the illustrative matrix, which is not approved', () => {
  assert.equal(activeMatrix(), ILLUSTRATIVE_MATRIX);
  assert.equal(ILLUSTRATIVE_MATRIX.status, 'ILLUSTRATIVE');
  assert.ok(MATRIX_REGISTRY.every((m) => validateMatrix(m).length === 0));
  assert.ok(!MATRIX_REGISTRY.some((m) => m.status === 'APPROVED'), 'no AMC-approved matrix has been supplied');
});

test('lookup fails closed for unknown id, unknown version, partial or malformed references', () => {
  for (const bad of [null, undefined, {}, { matrixId: 'x', matrixVersion: 'illustrative-1' }, { matrixId: ILLUSTRATIVE_MATRIX.id, matrixVersion: 'illustrative-2' }, { matrixId: ILLUSTRATIVE_MATRIX.id }, 'str', 5]) {
    assert.equal(lookupMatrix(bad), null, JSON.stringify(bad));
  }
  assert.equal(lookupMatrix(ACTIVE_MATRIX_REF), ILLUSTRATIVE_MATRIX);
});

test('an unreferenced record reads as legacy; a referenced-but-unknown version never falls back to another matrix', () => {
  assert.deepEqual(matrixForRef(undefined), { matrix: ILLUSTRATIVE_MATRIX, legacy: true });
  assert.deepEqual(matrixForRef({}), { matrix: ILLUSTRATIVE_MATRIX, legacy: true });
  assert.deepEqual(matrixForRef({ matrixId: ILLUSTRATIVE_MATRIX.id, matrixVersion: 'illustrative-9' }), { matrix: null, legacy: false });
});

test('matrix labels are validated: count must equal levels and be non-empty', () => {
  assert.match(validateMatrix({ ...ILLUSTRATIVE_MATRIX, likelihoodLabels: ['a'] }).join(), /label per level/);
  assert.match(validateMatrix({ ...ILLUSTRATIVE_MATRIX, impactLabels: ['a', 'b', 'c', 'd', ' '] }).join(), /label per level/);
  assert.match(validateMatrix(null).join(), /missing or malformed/);
  assert.match(validateMatrix({}).join(), /levels/);
});

test('scoreFor: every grid cell scores L×I; every boundary and bad value fails closed', () => {
  for (let l = 1; l <= 5; l++) for (let i = 1; i <= 5; i++) assert.equal(scoreFor(l, i, ILLUSTRATIVE_MATRIX), l * i);
  for (const bad of [0, 6, -1, 1.5, NaN, Infinity, '3', null, undefined]) {
    assert.equal(scoreFor(bad, 3, ILLUSTRATIVE_MATRIX), null, `L=${bad}`);
    assert.equal(scoreFor(3, bad, ILLUSTRATIVE_MATRIX), null, `I=${bad}`);
  }
  assert.equal(scoreFor(3, 3, null), null);
  assert.equal(scoreFor(3, 3, { ...ILLUSTRATIVE_MATRIX, bands: [] }), null);
});

test('matrix drives dimensions: a 3×3 matrix accepts 3 and rejects 4; deriveRiskScores uses the active grid', () => {
  const m3 = { ...ILLUSTRATIVE_MATRIX, likelihoodLevels: 3, impactLevels: 3, likelihoodLabels: ['a', 'b', 'c'], impactLabels: ['a', 'b', 'c'], bands: [{ label: 'Low', min: 1, max: 4, tone: 'green' }, { label: 'High', min: 5, max: 9, tone: 'red' }] };
  assert.deepEqual(validateMatrix(m3), []);
  assert.equal(scoreFor(3, 3, m3), 9);
  assert.equal(scoreFor(4, 1, m3), null);
  assert.equal(deriveRiskScores({ inherentLikelihood: 6, inherentImpact: 2, residualLikelihood: 5, residualImpact: 5 }).inherentScore, undefined);
  assert.equal(deriveRiskScores({ inherentLikelihood: 5, inherentImpact: 5 }).inherentScore, 25);
});

// ---- Assessment snapshot and verification ----
test('assessment snapshot records matrix id/version, scores and band labels', () => {
  const s = snapshotAssessment(inputs);
  assert.deepEqual(s, {
    scoringMatrixId: ACTIVE_MATRIX_REF.matrixId, scoringMatrixVersion: ACTIVE_MATRIX_REF.matrixVersion,
    inherentScore: 20, inherentBand: 'Critical', residualScore: 8, residualBand: 'Medium',
  });
  assert.deepEqual(deriveAssessmentFields(inputs), s);
});

test('invalid assessment inputs give no scores (unscored, unapprovable), never a partial or guessed score', () => {
  const f = deriveAssessmentFields({ ...inputs, inherentLikelihood: 9 });
  assert.equal(f.inherentScore, undefined);
  assert.equal(f.residualScore, undefined);
  assert.equal(f.residualBand, undefined);
  assert.match(verifyAssessmentScoring({ ...assessment(), ...f, inherentLikelihood: 9 }).reason, /outside the scoring matrix|does not match/);
  assert.equal(snapshotAssessment({ ...inputs, residualImpact: undefined }), null);
});

test('verification passes for a consistent snapshot and fails closed for every inconsistency', () => {
  assert.equal(verifyAssessmentScoring(assessment()).ok, true);
  assert.match(verifyAssessmentScoring(undefined).reason, /not found/);
  assert.match(verifyAssessmentScoring(assessment({ scoringMatrixId: undefined })).reason, /no recorded scoring matrix version/);
  assert.match(verifyAssessmentScoring(assessment({ scoringMatrixVersion: 'illustrative-9' })).reason, /unavailable or invalid/);
  assert.match(verifyAssessmentScoring(assessment({ residualScore: 99 })).reason, /residualScore/);
  assert.match(verifyAssessmentScoring(assessment({ residualBand: 'Critical' })).reason, /residualBand/);
  assert.match(verifyAssessmentScoring(assessment({ residualImpact: 0 })).reason, /outside the scoring matrix/);
});

test('historical integrity: an assessment keeps its score under its own version when the active version changes', () => {
  const old = assessment();
  // Simulate a later active version by pointing new work elsewhere: the old record still verifies against its own ref.
  assert.equal(lookupMatrix({ matrixId: old.scoringMatrixId, matrixVersion: old.scoringMatrixVersion }), ILLUSTRATIVE_MATRIX);
  assert.equal(verifyAssessmentScoring(old).ok, true);
  assert.equal(old.residualScore, 8);
});

// ---- Approval gating ----
test('approval is blocked when scoring is invalid or the parent is missing / RETIRED / ACCEPTED; allowed otherwise', () => {
  assert.equal(assessmentApprovalBlockReason(assessment(), risk()), null);
  for (const status of ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACTIVE', 'ESCALATED']) assert.equal(assessmentApprovalBlockReason(assessment(), risk({ status })), null, status);
  assert.match(assessmentApprovalBlockReason(assessment(), risk({ status: 'RETIRED' })), /RETIRED/);
  assert.match(assessmentApprovalBlockReason(assessment(), risk({ status: 'ACCEPTED' })), /ACCEPTED/);
  assert.match(assessmentApprovalBlockReason(assessment(), undefined), /no longer exists/);
  assert.match(assessmentApprovalBlockReason(assessment({ scoringMatrixVersion: 'nope' }), risk()), /unavailable/);
  assert.match(assessmentApprovalBlockReason(assessment({ inherentScore: 1 }), risk()), /inherentScore/);
});

// ---- Projection ----
test('projection copies the residual (only) from the approved assessment and records its provenance', () => {
  const plan = planResidualProjection(assessment(), risk({ inherentLikelihood: 1, inherentImpact: 1, inherentScore: 1 }));
  assert.equal(plan.project, true);
  assert.deepEqual(
    { l: plan.patch.residualLikelihood, i: plan.patch.residualImpact, s: plan.patch.residualScore, o: plan.patch.residualOrigin, src: plan.patch.residualSourceAssessmentId, v: plan.patch.residualSourceMatrixVersion, d: plan.patch.lastAssessedDate },
    { l: 2, i: 4, s: 8, o: 'APPROVED_ASSESSMENT', src: 'ra-x', v: ACTIVE_MATRIX_REF.matrixVersion, d: '2026-10-01' },
  );
  assert.ok(!Object.keys(plan.patch).some((k) => k.startsWith('inherent') || k === 'status'), 'inherent and status are not projected');
});

test('projection is deterministic and idempotent for the same inputs', () => {
  const a = assessment(), r = risk();
  assert.deepEqual(planResidualProjection(a, r), planResidualProjection(a, r));
  const applied = { ...r, ...planResidualProjection(a, r).patch };
  assert.deepEqual(planResidualProjection(a, applied).patch, planResidualProjection(a, r).patch);
});

test('supersession: a newer approved assessment replaces the source; an older-dated one is recorded but not projected', () => {
  const first = assessment({ id: 'ra-1', code: 'RAS-1', assessmentDate: '2026-08-01' });
  const afterFirst = { ...risk(), ...planResidualProjection(first, risk()).patch };
  const newer = assessment({ id: 'ra-2', code: 'RAS-2', assessmentDate: '2026-09-01', ...snapshotAssessment({ ...inputs, residualLikelihood: 1, residualImpact: 1 }), residualLikelihood: 1, residualImpact: 1 });
  const afterNewer = { ...afterFirst, ...planResidualProjection(newer, afterFirst).patch };
  assert.equal(afterNewer.residualSourceAssessmentId, 'ra-2');
  assert.equal(afterNewer.residualScore, 1);
  const older = assessment({ id: 'ra-0', code: 'RAS-0', assessmentDate: '2026-07-01' });
  const plan = planResidualProjection(older, afterNewer);
  assert.equal(plan.project, false);
  assert.match(plan.reason, /not projected/);
  const sameDay = assessment({ id: 'ra-3', code: 'RAS-3', assessmentDate: '2026-09-01' });
  assert.equal(planResidualProjection(sameDay, afterNewer).project, true, 'equal date: later approval wins');
});

test('projection refuses an unverifiable assessment even if called directly', () => {
  assert.equal(planResidualProjection(assessment({ scoringMatrixVersion: 'nope' }), risk()).project, false);
});

test('consistency: a projected Risk residual equals its source assessment; any drift is detected', () => {
  const a = assessment({ status: 'APPROVED' });
  const r = { ...risk(), ...planResidualProjection(a, risk()).patch };
  assert.equal(projectedResidualConsistent(r, a), true);
  assert.equal(projectedResidualConsistent({ ...r, residualScore: 10 }, a), false);
  assert.equal(projectedResidualConsistent(r, { ...a, status: 'REJECTED' }), false);
  assert.equal(projectedResidualConsistent(r, undefined), false);
  assert.equal(projectedResidualConsistent(risk(), undefined), true, 'direct-entry residual has no source to check');
});

test('Risk form save: a projected residual cannot be overwritten by edited residual inputs', () => {
  const a = assessment({ status: 'APPROVED' });
  const projected = { ...risk({ inherentLikelihood: 3, inherentImpact: 3 }), ...planResidualProjection(a, risk()).patch };
  const edited = deriveRiskFields({ ...projected, residualLikelihood: 5, residualImpact: 5, inherentLikelihood: 2, inherentImpact: 2 });
  assert.equal(edited.residualLikelihood, 2);
  assert.equal(edited.residualImpact, 4);
  assert.equal(edited.residualScore, 8);
  assert.equal(edited.inherentScore, 4);
  const direct = deriveRiskFields({ inherentLikelihood: 2, inherentImpact: 2, residualLikelihood: 3, residualImpact: 3 });
  assert.equal(direct.residualScore, 9);
  assert.equal(direct.scoringMatrixVersion, ACTIVE_MATRIX_REF.matrixVersion);
});

test('score references: residual of a projected Risk uses the source version; unknown version resolves to no band', () => {
  const r = { ...risk(), residualOrigin: 'APPROVED_ASSESSMENT', residualSourceMatrixId: ILLUSTRATIVE_MATRIX.id, residualSourceMatrixVersion: 'gone', scoringMatrixId: ILLUSTRATIVE_MATRIX.id, scoringMatrixVersion: ILLUSTRATIVE_MATRIX.version };
  assert.equal(residualRef(r).matrixVersion, 'gone');
  assert.equal(matrixForRef(scoreRefFor('residualScore', r)).matrix, null);
  assert.equal(matrixForRef(scoreRefFor('inherentScore', r)).matrix, ILLUSTRATIVE_MATRIX);
});

// ---- Seed integrity ----
test('seed assessments carry a verifiable matrix snapshot; approved ones that source a Risk match it exactly', () => {
  const byId = Object.fromEntries(seed.riskAssessments.map((a) => [a.id, a]));
  for (const a of seed.riskAssessments) assert.equal(verifyAssessmentScoring(a).ok, true, a.id);
  for (const r of seed.risks.filter((x) => x.residualOrigin === 'APPROVED_ASSESSMENT')) {
    const a = byId[r.residualSourceAssessmentId];
    assert.equal(a.riskId, r.id, `${r.id} source belongs to it`);
    assert.equal(projectedResidualConsistent(r, a), true, r.id);
    assert.equal(r.residualSourceAssessmentDate, a.assessmentDate);
  }
});

test('seed risks: scores equal L×I under the matrix they reference (or the legacy matrix) and resolve to a band', () => {
  for (const r of seed.risks) {
    for (const k of ['inherent', 'residual']) {
      const l = r[`${k}Likelihood`], i = r[`${k}Impact`];
      if (l == null && i == null) { assert.ok(r[`${k}Score`] == null, `${r.id} ${k}`); continue; }
      const { matrix } = matrixForRef(scoreRefFor(`${k}Score`, r));
      assert.equal(r[`${k}Score`], scoreFor(l, i, matrix), `${r.id} ${k}`);
      assert.ok(resolveBand(r[`${k}Score`], matrix), `${r.id} ${k} band`);
    }
  }
});

// ---- Inherent projection (spec 10-risk §325: approval updates Risk.inherent_*) ----
import {
  assessmentSubmitBlockReason, planInherentProjection, planProjection, payloadHasUnsafeKey, projectedInherentConsistent, payloadTouchesAssessmentScoring,
} from '../../src/lib/riskProjection.ts';
import { inherentRef, deriveRiskFields as deriveFields } from '../../src/lib/riskScoring.ts';

test('inherent projection copies only inherent L/I/score with its own provenance; residual and status untouched', () => {
  const plan = planInherentProjection(assessment(), risk({ inherentLikelihood: 1, inherentImpact: 1, inherentScore: 1 }));
  assert.equal(plan.project, true);
  assert.deepEqual(
    { l: plan.patch.inherentLikelihood, i: plan.patch.inherentImpact, s: plan.patch.inherentScore, o: plan.patch.inherentOrigin, src: plan.patch.inherentSourceAssessmentId, v: plan.patch.inherentSourceMatrixVersion },
    { l: 4, i: 5, s: 20, o: 'APPROVED_ASSESSMENT', src: 'ra-x', v: ACTIVE_MATRIX_REF.matrixVersion },
  );
  assert.ok(!Object.keys(plan.patch).some((k) => k.startsWith('residual') || k === 'status'));
});

test('inherent and residual are ordered independently: each compares against its own current source date', () => {
  const r = risk({ inherentOrigin: 'APPROVED_ASSESSMENT', inherentSourceAssessmentDate: '2026-12-01', inherentSourceAssessmentCode: 'RAS-I' });
  const a = assessment({ assessmentDate: '2026-10-01' });
  assert.equal(planInherentProjection(a, r).project, false);
  assert.match(planInherentProjection(a, r).reason, /inherent not projected/);
  assert.equal(planResidualProjection(a, r).project, true, 'residual has no source yet, so it is not blocked by the inherent source');
});

test('inherent and residual consistency checks are separate and detect drift', () => {
  const a = assessment({ status: 'APPROVED' });
  const r = { ...risk(), ...planInherentProjection(a, risk()).patch, ...planResidualProjection(a, risk()).patch };
  assert.equal(projectedInherentConsistent(r, a), true);
  assert.equal(projectedInherentConsistent({ ...r, inherentScore: 3 }, a), false);
  assert.equal(projectedInherentConsistent(r, { ...a, status: 'REJECTED' }), false);
  assert.equal(projectedInherentConsistent(risk(), undefined), true);
});

test('Risk form save: projected inherent inputs/score cannot be overwritten; direct-entry residual remains editable', () => {
  const a = assessment({ status: 'APPROVED' });
  const projected = { ...risk(), ...planInherentProjection(a, risk()).patch };
  const e = deriveFields({ ...projected, inherentLikelihood: 1, inherentImpact: 1, residualLikelihood: 2, residualImpact: 2 });
  assert.equal(e.inherentLikelihood, 4);
  assert.equal(e.inherentImpact, 5);
  assert.equal(e.inherentScore, 20);
  assert.equal(e.residualScore, 4, 'residual not projected: direct entry still applies');
});

test('score references: a projected inherent uses its source version; a direct residual keeps the direct stamp, not the inherent source', () => {
  const r = { inherentOrigin: 'APPROVED_ASSESSMENT', inherentSourceMatrixId: ILLUSTRATIVE_MATRIX.id, inherentSourceMatrixVersion: 'gone', scoringMatrixId: ILLUSTRATIVE_MATRIX.id, scoringMatrixVersion: ILLUSTRATIVE_MATRIX.version };
  assert.equal(inherentRef(r).matrixVersion, 'gone');
  assert.equal(matrixForRef(scoreRefFor('inherentScore', r)).matrix, null);
  assert.equal(matrixForRef(scoreRefFor('residualScore', r)).matrix, ILLUSTRATIVE_MATRIX);
});

// ---- Approval-boundary hardening ----
test('approvalGate: reject and return are never gated by scoring, payload or parent problems; only approve is', () => {
  const broken = assessment({ residualScore: 99, assessmentDate: 'garbage', scoringMatrixVersion: 'nope' });
  for (const d of ['reject', 'return']) {
    const g = approvalGate(d, 'riskAssessments', JSON.parse('{"__proto__":{"x":1},"residualScore":1}'), broken, undefined);
    assert.deepEqual(g, { ok: true, inherentPlan: null, residualPlan: null }, d);
  }
  assert.equal(approvalGate('approve', 'riskAssessments', undefined, broken, risk()).ok, false);
});

test('approvalGate: approve is refused before any plan for each hazard, with a distinct reason', () => {
  const NOW = Date.parse('2026-10-17T00:00:00Z');
  const gate = (over, payload, r = risk()) => approvalGate('approve', 'riskAssessments', payload, assessment(over), r, NOW);
  assert.equal(gate({}).ok, true);
  assert.match(gate({ scoringMatrixVersion: 'unknown-9' }).reason, /unavailable or invalid/);
  assert.match(gate({ residualScore: 25 }).reason, /does not match/);
  assert.match(gate({}, undefined, risk({ id: 'r-other' })).reason, /does not belong/);
  assert.match(gate({ assessmentDate: '2026-02-30' }).reason, /assessment date/);
  assert.match(gate({}, JSON.parse('{"__proto__":{"a":1}}')).reason, /protected key/);
  assert.match(gate({}, { status: 'APPROVED' }).reason, /protected key/);
  assert.match(gate({}, { residualScore: 1 }).reason, /scoring record/);
  assert.equal(approvalGate('approve', 'riskAssessments', undefined, undefined, risk(), NOW).ok, false);
  // non-assessment collections: only the unsafe-key check applies
  assert.equal(approvalGate('approve', 'risks', { title: 'x' }, { id: 'r' }, undefined, NOW).ok, true);
  assert.equal(approvalGate('approve', 'risks', { createdBy: 'x' }, { id: 'r' }, undefined, NOW).ok, false);
});

test('calendar-impossible dates are malformed, not rolled over', () => {
  for (const d of ['2026-02-30', '2026-04-31', '2026-02-29', '2026-00-10', '2026-06-00']) {
    assert.match(assessmentApprovalBlockReason(assessment({ assessmentDate: d }), risk()), /assessment date/, d);
  }
  assert.equal(assessmentApprovalBlockReason(assessment({ assessmentDate: '2028-02-29' }), risk(), Date.parse('2030-01-01')), null, 'real leap day is valid');
  const bad = risk({ residualOrigin: 'APPROVED_ASSESSMENT', residualSourceAssessmentDate: '2026-02-30' });
  assert.match(assessmentApprovalBlockReason(assessment(), bad), /residual source date/);
});

test('future-dated assessments are refused (they would displace every later assessment); same-day passes in any timezone', () => {
  const NOW = Date.parse('2026-10-17T12:00:00Z');
  assert.equal(assessmentApprovalBlockReason(assessment({ assessmentDate: '2026-10-17' }), risk(), NOW), null);
  assert.equal(assessmentApprovalBlockReason(assessment({ assessmentDate: '2026-10-18' }), risk(), NOW), null, 'one-day timezone tolerance');
  assert.match(assessmentApprovalBlockReason(assessment({ assessmentDate: '2026-10-19' }), risk(), NOW), /in the future/);
  assert.match(assessmentApprovalBlockReason(assessment({ assessmentDate: '2099-01-01' }), risk(), NOW), /in the future/);
});

test('lastAssessedDate never moves backwards when projecting an older-dated assessment onto a direct-entry risk', () => {
  const later = risk({ lastAssessedDate: '2026-12-01' });
  assert.equal(planResidualProjection(assessment({ assessmentDate: '2026-10-01' }), later).patch.lastAssessedDate, '2026-12-01');
  assert.equal(planResidualProjection(assessment({ assessmentDate: '2026-10-01' }), risk({ lastAssessedDate: '2026-01-01' })).patch.lastAssessedDate, '2026-10-01');
  assert.equal(planResidualProjection(assessment({ assessmentDate: '2026-10-01' }), risk({ lastAssessedDate: 'junk' })).patch.lastAssessedDate, '2026-10-01');
  assert.equal(planInherentProjection(assessment({ assessmentDate: '2026-10-01' }), risk({ lastAssessedDate: '2026-01-01' })).patch.lastAssessedDate, '2026-10-01', 'inherent projection advances it too (prototype convention)');
});

test('approval is blocked for a parent that does not own the assessment, and for malformed dates', () => {
  assert.match(assessmentApprovalBlockReason(assessment(), risk({ id: 'r-other' })), /does not belong/);
  for (const d of [undefined, '', '2026-9-1', '01/10/2026', 20261001, '2026-13-45']) {
    assert.match(assessmentApprovalBlockReason(assessment({ assessmentDate: d }), risk()), /assessment date/, String(d));
  }
  for (const dim of ['inherent', 'residual']) {
    const r = risk({ [`${dim}Origin`]: 'APPROVED_ASSESSMENT', [`${dim}SourceAssessmentDate`]: 'garbage' });
    assert.match(assessmentApprovalBlockReason(assessment(), r), new RegExp(`${dim} source date`));
    assert.equal(planProjection(dim, assessment(), r).project, false, 'planning also fails closed');
  }
});

test('approval payloads cannot alter the verified scoring record', () => {
  for (const k of ['residualScore', 'inherentImpact', 'scoringMatrixVersion', 'riskId', 'assessmentDate']) {
    assert.equal(payloadTouchesAssessmentScoring({ [k]: 1 }), true, k);
  }
  assert.equal(payloadTouchesAssessmentScoring(undefined), false);
  assert.equal(payloadTouchesAssessmentScoring({ reviewedNote: 'x' }), false);
});

test('seed: every risk with an inherent origin matches its approved source assessment exactly', () => {
  const byId = Object.fromEntries(seed.riskAssessments.map((a) => [a.id, a]));
  const linked = seed.risks.filter((x) => x.inherentOrigin === 'APPROVED_ASSESSMENT');
  assert.ok(linked.length >= 3);
  for (const r of linked) {
    const a = byId[r.inherentSourceAssessmentId];
    assert.equal(a.riskId, r.id);
    assert.equal(projectedInherentConsistent(r, a), true, r.id);
    assert.equal(r.inherentSourceAssessmentDate, a.assessmentDate);
    assert.equal(r.inherentSourceLikelihood, a.inherentLikelihood);
  }
});

test('approval payloads with protected / prototype keys are refused for any entity', () => {
  assert.equal(payloadHasUnsafeKey(JSON.parse('{"__proto__": {"isAdmin": true}}')), true);
  for (const k of ['constructor', 'prototype', 'id', 'code', 'status', 'createdBy', 'createdAt', 'updatedAt']) assert.equal(payloadHasUnsafeKey({ [k]: 1 }), true, k);
  assert.equal(payloadHasUnsafeKey({ title: 'x' }), false);
  assert.equal(payloadHasUnsafeKey(undefined), false);
});

test('ledger wiring: decidePendingAction calls approvalGate before its first write, and the scoring guard sees non-enumerable keys', () => {
  const src = readFileSync(new URL('../../src/lib/governance.ts', import.meta.url), 'utf8');
  const decide = src.slice(src.indexOf('export function decidePendingAction'), src.indexOf('export function applyTransition'));
  const gateAt = decide.indexOf('approvalGate(');
  assert.ok(gateAt > 0);
  assert.ok(gateAt < decide.indexOf('mutate('), 'gate must precede mutate');
  assert.ok(gateAt > decide.indexOf('decisionBlockReason('), 'maker-checker / owner check still runs first');
  assert.match(decide, /if \(!gate\.ok\) return gate\.reason;/);
  const hidden = {}; Object.defineProperty(hidden, 'residualScore', { value: 1, enumerable: false });
  assert.equal(payloadTouchesAssessmentScoring(hidden), true);
});

// ---- Inherent-only projection and lastAssessedDate (prototype convention; spec 10-risk §325 is silent) ----
test('inherent-only projection (residual source is newer) advances lastAssessedDate but leaves residual untouched', () => {
  const r = risk({ lastAssessedDate: '2026-05-01', residualOrigin: 'APPROVED_ASSESSMENT', residualSourceAssessmentDate: '2026-12-01', residualSourceAssessmentCode: 'RAS-R' });
  const a = assessment({ assessmentDate: '2026-10-01' });
  const inh = planInherentProjection(a, r);
  assert.equal(planResidualProjection(a, r).project, false);
  assert.equal(inh.project, true);
  assert.equal(inh.patch.lastAssessedDate, '2026-10-01');
  assert.ok(!Object.keys(inh.patch).some((k) => k.startsWith('residual')), 'residual source tracking stays distinct');
});

test('lastAssessedDate never moves backwards via inherent projection, and is untouched when nothing projects', () => {
  const later = risk({ lastAssessedDate: '2026-12-01' });
  assert.equal(planInherentProjection(assessment({ assessmentDate: '2026-10-01' }), later).patch.lastAssessedDate, '2026-12-01');
  const both = risk({ inherentOrigin: 'APPROVED_ASSESSMENT', inherentSourceAssessmentDate: '2026-12-01', residualOrigin: 'APPROVED_ASSESSMENT', residualSourceAssessmentDate: '2026-12-01' });
  const a = assessment({ assessmentDate: '2026-10-01' });
  assert.equal(planInherentProjection(a, both).project, false);
  assert.equal(planResidualProjection(a, both).project, false);
});

// ---- Submit-time validation: same rules as the approval gate, which still refuses independently ----
const NOW = Date.parse('2026-10-17T12:00:00Z');
// A fully completed draft: the base fixture lacks the free-text fields submission requires.
const full = (over = {}) => assessment({ title: 'Q3 reassessment', assessorId: 'u-1', rationale: 'Controls operated.', assessmentDate: '2026-10-17', ...over });
test('submit accepts a valid, scored, past-dated assessment on an eligible parent', () => {
  assert.equal(assessmentSubmitBlockReason(full(), risk(), NOW), null);
});

test('submit rejects impossible, malformed, missing and future assessment dates with a clear reason', () => {
  for (const d of ['2026-02-30', '2026-13-01', '17/10/2026', '', undefined, null, '2027-01-01']) {
    const reason = assessmentSubmitBlockReason(full({ assessmentDate: d }), risk(), NOW);
    assert.match(reason ?? '', /assessment date/i, String(d));
    assert.doesNotMatch(reason, /Approval is refused/, 'submit wording, not approval wording');
  }
});

test('submit rejects missing required fields, unscorable inputs, tampered scores and ineligible parents', () => {
  assert.match(assessmentSubmitBlockReason(full({ rationale: ' ' }), risk(), NOW), /Rationale/);
  assert.match(assessmentSubmitBlockReason(full({ title: undefined, assessorId: '' }), risk(), NOW), /Title, Assessor/);
  assert.ok(assessmentSubmitBlockReason(full({ inherentLikelihood: 9 }), risk(), NOW));
  assert.ok(assessmentSubmitBlockReason(full({ inherentScore: 1 }), risk(), NOW), 'snapshot mismatch');
  assert.match(assessmentSubmitBlockReason(full(), undefined, NOW), /parent risk/);
  assert.match(assessmentSubmitBlockReason(full(), risk({ status: 'RETIRED' }), NOW), /RETIRED/);
  assert.match(assessmentSubmitBlockReason(full({ riskId: 'other' }), risk(), NOW), /does not belong/);
});

test('submit and approval agree on every case above; the approval gate still refuses tampered data on its own', () => {
  const cases = [
    [full({ assessmentDate: '2026-02-30' }), risk()],
    [full({ assessmentDate: '2027-01-01' }), risk()],
    [full({ residualScore: 1 }), risk()],
    [full(), risk({ status: 'ACCEPTED' })],
    [full(), risk()],
  ];
  for (const [a, r] of cases) {
    assert.equal(!!assessmentSubmitBlockReason(a, r, NOW), !!assessmentApprovalBlockReason(a, r, NOW));
  }
  // Data edited after a clean submission is still stopped at approval.
  const submitted = full();
  assert.equal(assessmentSubmitBlockReason(submitted, risk(), NOW), null);
  const tampered = { ...submitted, assessmentDate: '2099-01-01', inherentScore: 1 };
  assert.equal(approvalGate('approve', 'riskAssessments', undefined, tampered, risk(), NOW).ok, false);
  assert.equal(approvalGate('reject', 'riskAssessments', undefined, tampered, risk(), NOW).ok, true, 'reject/return are never gated');
});

test('ledger wiring: submitForApproval runs the assessment submit check after GOV-07 and before its first write; the approval gate is still in place', () => {
  const src = readFileSync(new URL('../../src/lib/governance.ts', import.meta.url), 'utf8');
  const submit = src.slice(src.indexOf('export function submitForApproval'), src.indexOf('export type Decision'));
  const at = submit.indexOf('assessmentSubmitBlockReason(');
  assert.ok(at > submit.indexOf('GOV-07'), 'duplicate-pending check still first');
  assert.ok(at < submit.indexOf('mutate('), 'validation precedes any write');
  assert.match(submit, /if \(blocked\) return blocked;/);
  assert.match(src, /approvalGate\(decision, action\.collection/, 'approval-time checks retained');
});
