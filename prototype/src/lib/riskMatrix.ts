/**
 * Risk scoring matrix (FR-03: score = likelihood × impact; every score must resolve to a band label).
 *
 * ILLUSTRATIVE ONLY. The ERM spec makes the matrix tenant-editable reference data but does not
 * specify grid size, band names or thresholds, and no AMC-approved matrix exists. The values below
 * are prototype conventions, not approved policy or a regulatory requirement
 * (prototype/docs/defects-and-observations.md, item B).
 */
export type BandTone = 'green' | 'yellow' | 'orange' | 'red';

export interface ScoreBand {
  label: string;
  min: number;
  max: number;
  tone: BandTone;
}

export interface ScoringMatrix {
  id: string;
  name: string;
  /** Version a score would be snapshotted against (target design; the prototype does not persist it). */
  version: string;
  /** ILLUSTRATIVE until an AMC-approved matrix is configured. */
  status: 'ILLUSTRATIVE' | 'APPROVED';
  likelihoodLevels: number;
  impactLevels: number;
  bands: ScoreBand[];
}

export const ILLUSTRATIVE_MATRIX: ScoringMatrix = {
  id: 'matrix-illustrative-5x5',
  name: 'Illustrative 5×5 (not approved)',
  version: 'illustrative-1',
  status: 'ILLUSTRATIVE',
  likelihoodLevels: 5,
  impactLevels: 5,
  bands: [
    { label: 'Low', min: 1, max: 4, tone: 'green' },
    { label: 'Medium', min: 5, max: 9, tone: 'yellow' },
    { label: 'High', min: 10, max: 16, tone: 'orange' },
    { label: 'Critical', min: 17, max: 25, tone: 'red' },
  ],
};

/** Returns consistency errors; an empty list means every score 1..(L×I) resolves to exactly one labelled band. */
export function validateMatrix(m: ScoringMatrix): string[] {
  const errs: string[] = [];
  const isLevel = (n: unknown) => Number.isInteger(n) && (n as number) >= 1;
  if (!isLevel(m.likelihoodLevels) || !isLevel(m.impactLevels)) {
    return ['Likelihood and impact levels must be whole numbers of at least 1.'];
  }
  const maxScore = m.likelihoodLevels * m.impactLevels;
  if (!m.bands?.length) return ['At least one band is required.'];
  const labels = new Set<string>();
  for (const b of m.bands) {
    if (!b.label || !b.label.trim()) errs.push('Every band requires a label.');
    else if (labels.has(b.label.trim().toLowerCase())) errs.push(`Duplicate band label "${b.label}".`);
    else labels.add(b.label.trim().toLowerCase());
    if (!Number.isInteger(b.min) || !Number.isInteger(b.max) || b.min > b.max) {
      errs.push(`Band "${b.label}" has an invalid range ${b.min}–${b.max}.`);
    }
  }
  if (errs.length) return errs;
  const sorted = [...m.bands].sort((a, b) => a.min - b.min);
  if (sorted[0].min !== 1) errs.push(`Bands must start at score 1 (first band starts at ${sorted[0].min}).`);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    if (sorted[i].min <= prev.max) errs.push(`Bands "${prev.label}" and "${sorted[i].label}" overlap.`);
    else if (sorted[i].min !== prev.max + 1) errs.push(`Scores ${prev.max + 1}–${sorted[i].min - 1} resolve to no band.`);
  }
  const last = sorted[sorted.length - 1];
  if (last.max < maxScore) errs.push(`Scores ${last.max + 1}–${maxScore} resolve to no band.`);
  if (last.max > maxScore) errs.push(`Band "${last.label}" extends past the maximum score ${maxScore}.`);
  return errs;
}

/**
 * Resolves a score to its band. Fails closed: returns null for an invalid matrix or a score outside
 * 1..(L×I) rather than guessing a band.
 */
export function resolveBand(score: unknown, m: ScoringMatrix = ILLUSTRATIVE_MATRIX): ScoreBand | null {
  if (typeof score !== 'number' || !Number.isInteger(score)) return null;
  if (score < 1 || score > m.likelihoodLevels * m.impactLevels) return null;
  if (validateMatrix(m).length) return null;
  return m.bands.find((b) => score >= b.min && score <= b.max) ?? null;
}
