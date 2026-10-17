/**
 * FR-03: score = likelihood × impact. This is the arithmetic only; band labels are
 * resolved separately by riskMatrix.ts (illustrative matrix). Residual is taken from direct
 * entry, not derived from an approved assessment (see defects-and-observations.md, item C).
 */
export function deriveRiskScores(v: Record<string, unknown>): Record<string, unknown> {
  const score = (l: unknown, i: unknown) => (typeof l === 'number' && typeof i === 'number' ? l * i : undefined);
  return {
    inherentScore: score(v.inherentLikelihood, v.inherentImpact),
    residualScore: score(v.residualLikelihood, v.residualImpact),
  };
}
