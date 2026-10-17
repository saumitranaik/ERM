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
  /** One label per level, lowest first; length must equal the level count. */
  likelihoodLabels: string[];
  impactLabels: string[];
  bands: ScoreBand[];
}

/** Immutable reference to the exact matrix definition a score was produced with. */
export interface MatrixRef {
  matrixId: string;
  matrixVersion: string;
}

const BAND_TONES: BandTone[] = ['green', 'yellow', 'orange', 'red'];

export const ILLUSTRATIVE_MATRIX: ScoringMatrix = {
  id: 'matrix-illustrative-5x5',
  name: 'Illustrative 5×5 (not approved)',
  version: 'illustrative-1',
  status: 'ILLUSTRATIVE',
  likelihoodLevels: 5,
  impactLevels: 5,
  likelihoodLabels: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'],
  impactLabels: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe'],
  bands: [
    { label: 'Low', min: 1, max: 4, tone: 'green' },
    { label: 'Medium', min: 5, max: 9, tone: 'yellow' },
    { label: 'High', min: 10, max: 16, tone: 'orange' },
    { label: 'Critical', min: 17, max: 25, tone: 'red' },
  ],
};

/** Returns consistency errors; an empty list means every score 1..(L×I) resolves to exactly one labelled band. */
export function validateMatrix(m: ScoringMatrix): string[] {
  if (!m || typeof m !== 'object') return ['Matrix configuration is missing or malformed.'];
  const errs: string[] = [];
  const isLevel = (n: unknown) => Number.isInteger(n) && (n as number) >= 1;
  if (!isLevel(m.likelihoodLevels) || !isLevel(m.impactLevels)) {
    return ['Likelihood and impact levels must be whole numbers of at least 1.'];
  }
  const maxScore = m.likelihoodLevels * m.impactLevels;
  const okLabels = (l: unknown, n: number) => Array.isArray(l) && l.length === n && l.every((x) => typeof x === 'string' && x.trim());
  if (!okLabels(m.likelihoodLabels, m.likelihoodLevels) || !okLabels(m.impactLabels, m.impactLevels)) {
    return ['Likelihood and impact need exactly one non-empty label per level.'];
  }
  if (!Array.isArray(m.bands) || !m.bands.length) return ['At least one band is required.'];
  if (m.bands.some((b) => !b || typeof b !== 'object')) return ['Every band must be an object.'];
  const labels = new Set<string>();
  for (const b of m.bands) {
    if (typeof b.label !== 'string' || !b.label.trim()) errs.push('Every band requires a label.');
    else if (labels.has(b.label.trim().toLowerCase())) errs.push(`Duplicate band label "${b.label}".`);
    else labels.add(b.label.trim().toLowerCase());
    if (!BAND_TONES.includes(b.tone)) errs.push(`Band "${b.label}" has an unknown tone.`);
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
  if (validateMatrix(m).length) return null;
  if (typeof score !== 'number' || !Number.isInteger(score)) return null;
  if (score < 1 || score > m.likelihoodLevels * m.impactLevels) return null;
  return m.bands.find((b) => score >= b.min && score <= b.max) ?? null;
}

/** Band for a likelihood/impact pair: both must be whole numbers within the matrix grid, else null (fail closed). */
export function resolveBandFor(likelihood: unknown, impact: unknown, m: ScoringMatrix = ILLUSTRATIVE_MATRIX): ScoreBand | null {
  const inRange = (n: unknown, max: number) => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= max;
  if (validateMatrix(m).length) return null;
  if (!inRange(likelihood, m.likelihoodLevels) || !inRange(impact, m.impactLevels)) return null;
  return resolveBand((likelihood as number) * (impact as number), m);
}

/**
 * Registry of every matrix definition a stored score may reference. Definitions are immutable once
 * listed: a change is a NEW version entry, never an edit, so historical scores stay reproducible.
 * Only the illustrative prototype matrix exists; no AMC-approved version has been supplied.
 */
export const MATRIX_REGISTRY: ScoringMatrix[] = [ILLUSTRATIVE_MATRIX];

/** Rule for new scores: they use this version. Changing it never rescores existing records. */
export const ACTIVE_MATRIX_REF: MatrixRef = { matrixId: ILLUSTRATIVE_MATRIX.id, matrixVersion: ILLUSTRATIVE_MATRIX.version };

export function refOf(m: ScoringMatrix): MatrixRef {
  return { matrixId: m.id, matrixVersion: m.version };
}

/** Exact lookup. Null (fail closed) when the id/version is unknown or the definition is malformed. */
export function lookupMatrix(ref: unknown): ScoringMatrix | null {
  const r = ref as Partial<MatrixRef> | null | undefined;
  if (!r || typeof r.matrixId !== 'string' || typeof r.matrixVersion !== 'string') return null;
  const m = MATRIX_REGISTRY.find((x) => x.id === r.matrixId && x.version === r.matrixVersion);
  return m && validateMatrix(m).length === 0 ? m : null;
}

export function activeMatrix(): ScoringMatrix | null {
  return lookupMatrix(ACTIVE_MATRIX_REF);
}

/** Whole-number level check against the matrix grid. */
export function isLevel(n: unknown, max: number): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= max;
}

/** likelihood × impact, bounds-checked against the matrix; null for any invalid input or matrix. */
export function scoreFor(likelihood: unknown, impact: unknown, m: ScoringMatrix | null): number | null {
  if (!m || validateMatrix(m).length) return null;
  if (!isLevel(likelihood, m.likelihoodLevels) || !isLevel(impact, m.impactLevels)) return null;
  return likelihood * impact;
}

/**
 * Matrix a stored score is displayed against. A record carrying no reference predates matrix
 * versioning (prototype seed data and records saved before this change); it is read against the one
 * matrix that then existed, and is reported as legacy so the UI can say so.
 */
export function matrixForRef(ref: Partial<MatrixRef> | null | undefined): { matrix: ScoringMatrix | null; legacy: boolean } {
  if (!ref || (ref.matrixId == null && ref.matrixVersion == null)) return { matrix: ILLUSTRATIVE_MATRIX, legacy: true };
  return { matrix: lookupMatrix(ref), legacy: false };
}
