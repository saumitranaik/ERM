import type { EntityBase } from '../types/core';

export function newId(): string {
  return 'x' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * Next sequential business code for a collection, e.g. nextCode(risks, 'RSK')
 * → "RSK-2026-0041". Matches the code-sequence shape defined in the
 * enterprise domain model's shared kernel.
 */
export function nextCode(rows: EntityBase[], prefix: string): string {
  const year = new Date().getFullYear();
  let max = 0;
  for (const r of rows) {
    const m = typeof r.code === 'string' && r.code.match(new RegExp(`^${prefix}-(\\d{4})-(\\d+)$`));
    if (m) max = Math.max(max, parseInt(m[2], 10));
  }
  return `${prefix}-${year}-${String(max + 1).padStart(4, '0')}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
