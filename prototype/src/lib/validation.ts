import type { FieldDef } from './registry';

/** Per-field form validation: required, and whole-number range for bounded number fields. */
export function validateFields(fields: FieldDef[], values: Record<string, unknown>): Record<string, string> {
  const errs: Record<string, string> = {};
  for (const f of fields) {
    const v = values[f.key];
    const empty = v === undefined || v === '' || v === null;
    if (empty) {
      if (f.required) errs[f.key] = `${f.label} is required.`;
      continue;
    }
    if (f.type === 'number' && (f.min !== undefined || f.max !== undefined)) {
      const n = Number(v);
      if (!Number.isInteger(n) || (f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max)) {
        errs[f.key] = `Enter a whole number from ${f.min ?? '…'} to ${f.max ?? '…'}.`;
      }
    }
  }
  return errs;
}
