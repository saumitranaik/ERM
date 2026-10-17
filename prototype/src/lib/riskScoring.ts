import { ACTIVE_MATRIX_REF, activeMatrix, matrixForRef, scoreFor, type MatrixRef } from './riskMatrix.ts';

/**
 * FR-03: score = likelihood × impact, bounds-checked against the active matrix (undefined when an
 * input is missing, fractional or outside the matrix grid — never a guessed score). Band labels are
 * resolved separately by riskMatrix.ts. The Risk's residual is a direct entry until an approved
 * assessment is projected onto it (riskProjection.ts).
 */
export function deriveRiskScores(v: Record<string, unknown>): Record<string, unknown> {
  const m = activeMatrix();
  const score = (l: unknown, i: unknown) => scoreFor(l, i, m) ?? undefined;
  return {
    inherentScore: score(v.inherentLikelihood, v.inherentImpact),
    residualScore: score(v.residualLikelihood, v.residualImpact),
  };
}

/**
 * Risk form derivation: scores plus the matrix reference they were produced with. Once inherent and/or
 * residual has been projected from an approved assessment (`<dim>Origin`) that dimension is owned by the
 * assessment, so edits to its inputs on the Risk form are discarded and its projected score is kept.
 */
export function deriveRiskFields(v: Record<string, unknown>): Record<string, unknown> {
  const inputs: Record<string, unknown> = {};
  const kept: Record<string, unknown> = {};
  for (const d of ['inherent', 'residual']) {
    if (v[`${d}Origin`] === 'APPROVED_ASSESSMENT') {
      inputs[`${d}Likelihood`] = v[`${d}SourceLikelihood`];
      inputs[`${d}Impact`] = v[`${d}SourceImpact`];
      kept[`${d}Score`] = v[`${d}Score`];
    }
  }
  return {
    ...inputs,
    ...deriveRiskScores({ ...v, ...inputs }),
    // Direct-entry scores are stamped with the active matrix; a projected score keeps its own source ref.
    scoringMatrixId: ACTIVE_MATRIX_REF.matrixId,
    scoringMatrixVersion: ACTIVE_MATRIX_REF.matrixVersion,
    ...kept,
  };
}

function directRef(risk: Record<string, unknown>): Partial<MatrixRef> {
  return { matrixId: risk.scoringMatrixId as string | undefined, matrixVersion: risk.scoringMatrixVersion as string | undefined };
}

/** Matrix reference governing a Risk's inherent score: the projected source's, else the direct-entry stamp (absent => legacy, see matrixForRef). */
export function inherentRef(risk: Record<string, unknown>): Partial<MatrixRef> {
  return risk.inherentOrigin === 'APPROVED_ASSESSMENT'
    ? { matrixId: risk.inherentSourceMatrixId as string | undefined, matrixVersion: risk.inherentSourceMatrixVersion as string | undefined }
    : directRef(risk);
}

/** Matrix reference governing a Risk's residual score: the projected source's, else the direct-entry stamp. */
export function residualRef(risk: Record<string, unknown>): Partial<MatrixRef> {
  return risk.residualOrigin === 'APPROVED_ASSESSMENT'
    ? { matrixId: risk.residualSourceMatrixId as string | undefined, matrixVersion: risk.residualSourceMatrixVersion as string | undefined }
    : directRef(risk);
}

export { matrixForRef };

/** Matrix reference for a score column of a row (null row => legacy/unreferenced). */
export function scoreRefFor(key: string, row?: Record<string, unknown>): Partial<MatrixRef> | undefined {
  if (!row) return undefined;
  return key.startsWith('residual') ? residualRef(row) : inherentRef(row);
}
