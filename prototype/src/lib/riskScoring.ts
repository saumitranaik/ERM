/**
 * FR-03: score = likelihood × impact. This is the arithmetic only; band labels
 * (Low/Medium/High/Critical) need the configurable RiskScoringMatrix, which the
 * prototype does not model.
 */
export function deriveRiskScores(v: Record<string, unknown>): Record<string, unknown> {
  const score = (l: unknown, i: unknown) => (typeof l === 'number' && typeof i === 'number' ? l * i : undefined);
  return {
    inherentScore: score(v.inherentLikelihood, v.inherentImpact),
    residualScore: score(v.residualLikelihood, v.residualImpact),
  };
}
