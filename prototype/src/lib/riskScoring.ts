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
 * Risk form derivation: scores plus the matrix reference they were produced with. Once a residual
 * has been projected from an approved assessment (residualSource* present) the residual is owned by
 * that assessment, so edits to the residual inputs on the Risk form are discarded.
 */
export function deriveRiskFields(v: Record<string, unknown>): Record<string, unknown> {
  const projected = v.residualOrigin === 'APPROVED_ASSESSMENT';
  const residualInputs = projected
    ? { residualLikelihood: v.residualSourceLikelihood, residualImpact: v.residualSourceImpact }
    : {};
  const scores = deriveRiskScores({ ...v, ...residualInputs });
  return {
    ...residualInputs,
    ...scores,
    // Inherent (and direct-entry residual) scores are stamped with the active matrix; a projected residual keeps its own ref.
    scoringMatrixId: ACTIVE_MATRIX_REF.matrixId,
    scoringMatrixVersion: ACTIVE_MATRIX_REF.matrixVersion,
    ...(projected ? { residualScore: v.residualScore } : {}),
  };
}

/** Matrix reference governing a Risk's inherent score (absent => legacy, see matrixForRef). */
export function inherentRef(risk: Record<string, unknown>): Partial<MatrixRef> {
  return { matrixId: risk.scoringMatrixId as string | undefined, matrixVersion: risk.scoringMatrixVersion as string | undefined };
}

/** Matrix reference governing a Risk's residual score: the projected source's, else the direct-entry stamp. */
export function residualRef(risk: Record<string, unknown>): Partial<MatrixRef> {
  return risk.residualOrigin === 'APPROVED_ASSESSMENT'
    ? { matrixId: risk.residualSourceMatrixId as string | undefined, matrixVersion: risk.residualSourceMatrixVersion as string | undefined }
    : inherentRef(risk);
}

export { matrixForRef };

/** Matrix reference for a score column of a row (null row => legacy/unreferenced). */
export function scoreRefFor(key: string, row?: Record<string, unknown>): Partial<MatrixRef> | undefined {
  if (!row) return undefined;
  return key.startsWith('residual') ? residualRef(row) : inherentRef(row);
}
