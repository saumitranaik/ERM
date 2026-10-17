/**
 * Assessment scoring snapshot, approval eligibility and the approved-assessment → Risk residual
 * projection. Pure functions (no store access) so the ledger, the approval UI and the tests share
 * one rule set.
 *
 * Authority (see prototype/docs/defects-and-observations.md, item D):
 *  - Assessment: likelihood/impact inputs + matrixId/matrixVersion are authoritative. Score and band
 *    are a snapshot taken when the draft is saved and are re-verified against the referenced matrix
 *    version before approval; any mismatch blocks approval (fail closed).
 *  - Risk: residual L/I/score are a derived copy of the current source assessment (residualSource*).
 *
 * Projection rule (prototype; spec 10-risk §325 says approval updates Risk.inherent_* and residual_*. The
 * Risk status/appetite advance in that row is NOT implemented: no appetite thresholds exist. Inherent and
 * residual are projected independently, each with its own provenance, under the same conventions):
 *  - only an APPROVED assessment projects, only at the moment of approval;
 *  - the parent must exist and not be RETIRED or ACCEPTED (an accepted residual is not changed silently);
 *  - it projects only if its assessmentDate is not earlier than the current source's (an older
 *    assessment approved late is recorded but does not displace a newer one; equal dates: later approval wins).
 * These rules are prototype conventions, not AMC-approved policy.
 */
import {
  ACTIVE_MATRIX_REF, activeMatrix, lookupMatrix, refOf, resolveBand, scoreFor, type ScoringMatrix,
} from './riskMatrix.ts';

type Rec = Record<string, unknown>;

export const NON_PROJECTABLE_RISK_STATUSES = ['RETIRED', 'ACCEPTED'];

/** Score/band snapshot fields for an assessment save; null when inputs are invalid (caller must not treat as scored). */
export function snapshotAssessment(v: Rec, m: ScoringMatrix | null = activeMatrix()): Rec | null {
  if (!m) return null;
  const inh = scoreFor(v.inherentLikelihood, v.inherentImpact, m);
  const res = scoreFor(v.residualLikelihood, v.residualImpact, m);
  const inhBand = inh == null ? null : resolveBand(inh, m);
  const resBand = res == null ? null : resolveBand(res, m);
  if (inh == null || res == null || !inhBand || !resBand) return null;
  return {
    scoringMatrixId: refOf(m).matrixId,
    scoringMatrixVersion: refOf(m).matrixVersion,
    inherentScore: inh,
    inherentBand: inhBand.label,
    residualScore: res,
    residualBand: resBand.label,
  };
}

/** Form-save derivation for assessments. Invalid inputs yield no score fields (the record is unscored and unapprovable). */
export function deriveAssessmentFields(v: Rec): Rec {
  return snapshotAssessment(v) ?? {
    scoringMatrixId: ACTIVE_MATRIX_REF.matrixId,
    scoringMatrixVersion: ACTIVE_MATRIX_REF.matrixVersion,
    inherentScore: undefined, inherentBand: undefined, residualScore: undefined, residualBand: undefined,
  };
}

export type Verification = { ok: true; matrix: ScoringMatrix } | { ok: false; reason: string };

/** Recompute the snapshot from inputs under the *referenced* matrix version and compare with what is stored. */
export function verifyAssessmentScoring(a: Rec | undefined): Verification {
  if (!a) return { ok: false, reason: 'Assessment not found.' };
  if (typeof a.scoringMatrixId !== 'string' || typeof a.scoringMatrixVersion !== 'string') {
    return { ok: false, reason: 'This assessment has no recorded scoring matrix version, so its score cannot be explained or reproduced. Edit and re-save it as a draft.' };
  }
  const m = lookupMatrix({ matrixId: a.scoringMatrixId, matrixVersion: a.scoringMatrixVersion });
  if (!m) {
    return { ok: false, reason: `Scoring matrix ${a.scoringMatrixId} v${a.scoringMatrixVersion} is unavailable or invalid; the score cannot be verified.` };
  }
  const expected = snapshotAssessment(a, m);
  if (!expected) return { ok: false, reason: 'The likelihood/impact values are outside the scoring matrix; the assessment cannot be scored.' };
  for (const k of ['inherentScore', 'inherentBand', 'residualScore', 'residualBand']) {
    if (a[k] !== expected[k]) return { ok: false, reason: `Stored ${k} (${String(a[k])}) does not match the matrix result (${String(expected[k])}); the record is inconsistent.` };
  }
  return { ok: true, matrix: m };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Strict calendar date: Date.parse alone rolls 2026-02-30 over to March, so the date must round-trip unchanged. */
const isIsoDate = (v: unknown): v is string => {
  if (typeof v !== 'string' || !ISO_DATE.test(v)) return false;
  const t = Date.parse(v);
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === v;
};

/** Latest acceptable assessment date: today in UTC plus one day, so a same-day assessment in any timezone passes while a far-future date cannot pre-empt every later assessment. */
const latestAllowedDate = (now: number) => new Date(now + 86_400_000).toISOString().slice(0, 10);

/** Assessment fields an approval payload must never touch: they are the verified scoring record. */
const ASSESSMENT_PROTECTED_KEYS = /^(inherent|residual|scoringMatrix|riskId$|assessmentDate$)/;
export function payloadTouchesAssessmentScoring(payload: Rec | undefined): boolean {
  return !!payload && Object.getOwnPropertyNames(payload).some((k) => ASSESSMENT_PROTECTED_KEYS.test(k));
}

/** Keys that must never be assigned from a client-held approval payload onto any entity (prototype-pollution / identity tampering). */
const UNSAFE_PAYLOAD_KEYS = new Set(['__proto__', 'constructor', 'prototype', 'id', 'code', 'status', 'createdBy', 'createdAt', 'updatedAt']);
export function payloadHasUnsafeKey(payload: Rec | undefined): boolean {
  return !!payload && Object.getOwnPropertyNames(payload).some((k) => UNSAFE_PAYLOAD_KEYS.has(k));
}

/** Reason an assessment approval cannot proceed (invalid scoring or ineligible parent), else null. */
export function assessmentApprovalBlockReason(a: Rec | undefined, risk: Rec | undefined, now: number = Date.now()): string | null {
  const v = verifyAssessmentScoring(a);
  if (!v.ok) return v.reason;
  if (!risk) return 'The parent risk no longer exists; the assessment cannot be approved.';
  if (a!.riskId !== risk.id) return 'The assessment does not belong to the parent risk it is being applied to.';
  if (NON_PROJECTABLE_RISK_STATUSES.includes(String(risk.status))) {
    return `The parent risk is ${String(risk.status)}; its scores cannot be changed by a new assessment.`;
  }
  if (!isIsoDate(a!.assessmentDate)) return 'The assessment date is missing or not a valid YYYY-MM-DD date, so its ordering cannot be determined.';
  if ((a!.assessmentDate as string) > latestAllowedDate(now)) return `The assessment date ${String(a!.assessmentDate)} is in the future; a future-dated assessment would displace every later assessment, so approval is refused.`;
  for (const d of ['inherent', 'residual'] as const) {
    if (risk[`${d}Origin`] === 'APPROVED_ASSESSMENT' && !isIsoDate(risk[`${d}SourceAssessmentDate`])) {
      return `The parent risk's ${d} source date is missing or malformed; the projection order cannot be determined.`;
    }
  }
  return null;
}

export type ProjectionPlan =
  | { project: true; patch: Rec }
  | { project: false; reason: string };

export type Dimension = 'inherent' | 'residual';

/**
 * Pure plan for one dimension's Risk patch, applied atomically with the approval. Inherent and residual
 * are planned independently (own provenance, own supersession check); the residual rules are applied to
 * inherent as an explicit, separately documented prototype convention, not an inherited one.
 * Call only after assessmentApprovalBlockReason is null.
 */
export function planProjection(dim: Dimension, a: Rec, risk: Rec): ProjectionPlan {
  const v = verifyAssessmentScoring(a);
  if (!v.ok) return { project: false, reason: v.reason };
  if (!isIsoDate(a.assessmentDate)) return { project: false, reason: 'Assessment date is not a valid YYYY-MM-DD date.' };
  const currentDate = risk[`${dim}Origin`] === 'APPROVED_ASSESSMENT' ? String(risk[`${dim}SourceAssessmentDate`] ?? '') : '';
  if (currentDate && !isIsoDate(currentDate)) return { project: false, reason: `Current ${dim} source date is malformed.` };
  if (currentDate && String(a.assessmentDate) < currentDate) {
    return {
      project: false,
      reason: `Approved but ${dim} not projected: it is dated ${String(a.assessmentDate)}, earlier than the current ${dim} source ${String(risk[`${dim}SourceAssessmentCode`])} (${currentDate}).`,
    };
  }
  return {
    project: true,
    patch: {
      [`${dim}Likelihood`]: a[`${dim}Likelihood`],
      [`${dim}Impact`]: a[`${dim}Impact`],
      [`${dim}Score`]: a[`${dim}Score`],
      [`${dim}Origin`]: 'APPROVED_ASSESSMENT',
      [`${dim}SourceAssessmentId`]: a.id,
      [`${dim}SourceAssessmentCode`]: a.code,
      [`${dim}SourceAssessmentDate`]: a.assessmentDate,
      [`${dim}SourceMatrixId`]: a.scoringMatrixId,
      [`${dim}SourceMatrixVersion`]: a.scoringMatrixVersion,
      [`${dim}SourceLikelihood`]: a[`${dim}Likelihood`],
      [`${dim}SourceImpact`]: a[`${dim}Impact`],
    },
  };
}

export function planResidualProjection(a: Rec, risk: Rec): ProjectionPlan {
  const p = planProjection('residual', a, risk);
  if (!p.project) return p;
  // lastAssessedDate never moves backwards (a direct-entry value may already be later than this assessment).
  const prior = risk.lastAssessedDate;
  const last = isIsoDate(prior) && prior > String(a.assessmentDate) ? prior : a.assessmentDate;
  return { project: true, patch: { ...p.patch, lastAssessedDate: last } };
}
export const planInherentProjection = (a: Rec, risk: Rec): ProjectionPlan => planProjection('inherent', a, risk);

/** Consistency check: a projected score must equal its source assessment's. Direct entry (no origin) has no source to check. */
export function projectedConsistent(dim: Dimension, risk: Rec, a: Rec | undefined): boolean {
  if (risk[`${dim}Origin`] !== 'APPROVED_ASSESSMENT') return true;
  return !!a && a.id === risk[`${dim}SourceAssessmentId`] && a.status === 'APPROVED'
    && risk[`${dim}Likelihood`] === a[`${dim}Likelihood`] && risk[`${dim}Impact`] === a[`${dim}Impact`]
    && risk[`${dim}Score`] === a[`${dim}Score`]
    && risk[`${dim}SourceMatrixId`] === a.scoringMatrixId && risk[`${dim}SourceMatrixVersion`] === a.scoringMatrixVersion;
}
export const projectedResidualConsistent = (risk: Rec, a: Rec | undefined) => projectedConsistent('residual', risk, a);
export const projectedInherentConsistent = (risk: Rec, a: Rec | undefined) => projectedConsistent('inherent', risk, a);

export type ApprovalGate =
  | { ok: false; reason: string }
  | { ok: true; inherentPlan: ProjectionPlan | null; residualPlan: ProjectionPlan | null };

/**
 * Everything that can refuse an APPROVE, evaluated before any write (the ledger calls this and returns
 * on `ok:false` before it mutates). Reject and return are never gated here: scoring problems must not
 * stop a checker from rejecting or returning a record.
 */
export function approvalGate(
  decision: 'approve' | 'reject' | 'return',
  collection: string,
  payload: Rec | undefined,
  target: Rec | undefined,
  parentRisk: Rec | undefined,
  now: number = Date.now(),
): ApprovalGate {
  if (decision !== 'approve') return { ok: true, inherentPlan: null, residualPlan: null };
  if (payloadHasUnsafeKey(payload)) return { ok: false, reason: 'The approval payload contains a protected key; approval refused.' };
  if (collection !== 'riskAssessments') return { ok: true, inherentPlan: null, residualPlan: null };
  const block = assessmentApprovalBlockReason(target, parentRisk, now);
  if (block) return { ok: false, reason: block };
  if (payloadTouchesAssessmentScoring(payload)) return { ok: false, reason: 'The approval payload would alter the verified scoring record of the assessment; approval refused.' };
  return { ok: true, inherentPlan: planInherentProjection(target!, parentRisk!), residualPlan: planResidualProjection(target!, parentRisk!) };
}
