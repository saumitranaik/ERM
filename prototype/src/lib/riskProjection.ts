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
 * Projection rule (prototype; spec 10-risk §325 — residual only: inherent is not projected, and the
 * Risk status/appetite advance in that row is out of scope here):
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

/** Reason an assessment approval cannot proceed (invalid scoring or ineligible parent), else null. */
export function assessmentApprovalBlockReason(a: Rec | undefined, risk: Rec | undefined): string | null {
  const v = verifyAssessmentScoring(a);
  if (!v.ok) return v.reason;
  if (!risk) return 'The parent risk no longer exists; the assessment cannot be approved.';
  if (NON_PROJECTABLE_RISK_STATUSES.includes(String(risk.status))) {
    return `The parent risk is ${String(risk.status)}; its residual score cannot be changed by a new assessment.`;
  }
  return null;
}

export type ProjectionPlan =
  | { project: true; patch: Rec }
  | { project: false; reason: string };

/** Pure plan for the Risk patch applied atomically with the approval. Call only after assessmentApprovalBlockReason is null. */
export function planResidualProjection(a: Rec, risk: Rec): ProjectionPlan {
  const v = verifyAssessmentScoring(a);
  if (!v.ok) return { project: false, reason: v.reason };
  const currentDate = risk.residualOrigin === 'APPROVED_ASSESSMENT' ? String(risk.residualSourceAssessmentDate ?? '') : '';
  if (currentDate && String(a.assessmentDate) < currentDate) {
    return {
      project: false,
      reason: `Approved but not projected: it is dated ${String(a.assessmentDate)}, earlier than the current residual source ${String(risk.residualSourceAssessmentCode)} (${currentDate}).`,
    };
  }
  return {
    project: true,
    patch: {
      residualLikelihood: a.residualLikelihood,
      residualImpact: a.residualImpact,
      residualScore: a.residualScore,
      residualOrigin: 'APPROVED_ASSESSMENT',
      residualSourceAssessmentId: a.id,
      residualSourceAssessmentCode: a.code,
      residualSourceAssessmentDate: a.assessmentDate,
      residualSourceMatrixId: a.scoringMatrixId,
      residualSourceMatrixVersion: a.scoringMatrixVersion,
      residualSourceLikelihood: a.residualLikelihood,
      residualSourceImpact: a.residualImpact,
      lastAssessedDate: a.assessmentDate,
    },
  };
}

/** Consistency check: a projected residual must equal its source assessment's residual. */
export function projectedResidualConsistent(risk: Rec, a: Rec | undefined): boolean {
  if (risk.residualOrigin !== 'APPROVED_ASSESSMENT') return true;
  return !!a && a.id === risk.residualSourceAssessmentId && a.status === 'APPROVED'
    && risk.residualLikelihood === a.residualLikelihood && risk.residualImpact === a.residualImpact
    && risk.residualScore === a.residualScore
    && risk.residualSourceMatrixId === a.scoringMatrixId && risk.residualSourceMatrixVersion === a.scoringMatrixVersion;
}
