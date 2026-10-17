import type { FieldDef } from './registry';

/** Resolve a date field's `maxDate` to an ISO YYYY-MM-DD string ('TODAY' is the caller's local calendar day), or undefined if unbounded. */
export function resolveMaxDate(field: Pick<FieldDef, 'maxDate'>, now: Date = new Date()): string | undefined {
  if (!field.maxDate) return undefined;
  if (field.maxDate !== 'TODAY') return field.maxDate;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/** Per-field form validation: required, whole-number range for bounded number fields, and `maxDate` for date fields. */
export function validateFields(fields: FieldDef[], values: Record<string, unknown>, now: Date = new Date()): Record<string, string> {
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
    if (f.type === 'date' && f.maxDate) {
      const max = resolveMaxDate(f, now)!;
      if (String(v).slice(0, 10) > max) errs[f.key] = `${f.label} cannot be after ${max}.`;
    }
  }
  return errs;
}
