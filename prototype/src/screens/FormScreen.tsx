'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { useDb } from '../lib/store';
import { useSession } from '../lib/session';
import { createRecord, updateRecord } from '../lib/governance';
import { moduleByCode } from '../lib/moduleCatalog';
import { entityHref, rowsFor, entityTitle, type EntityConfig, type FieldDef } from '../lib/registry';
import { newId, nextCode } from '../lib/id';
import { humanize } from '../lib/format';
import type { EntityBase } from '../types/core';

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const db = useDb();
  const strVal = value === undefined || value === null ? '' : String(value);

  switch (field.type) {
    case 'textarea':
      return <Textarea id={`f-${field.key}`} value={strVal} onChange={(e) => onChange(e.target.value)} rows={3} />;
    case 'number':
      return (
        <Input
          id={`f-${field.key}`}
          type="number"
          value={strVal}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        />
      );
    case 'date':
      return (
        <Input
          id={`f-${field.key}`}
          type="date"
          value={strVal ? strVal.slice(0, 10) : ''}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
      );
    case 'select':
      return (
        <Select value={strVal || undefined} onValueChange={(v) => onChange(v)}>
          <SelectTrigger id={`f-${field.key}`}><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((o) => (
              <SelectItem key={o} value={o}>{humanize(o)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'user':
      return (
        <Select value={strVal || undefined} onValueChange={(v) => onChange(v)}>
          <SelectTrigger id={`f-${field.key}`}><SelectValue placeholder="Select user…" /></SelectTrigger>
          <SelectContent>
            {db.users.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name} — {u.jobTitle}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'department':
      return (
        <Select value={strVal || undefined} onValueChange={(v) => onChange(v)}>
          <SelectTrigger id={`f-${field.key}`}><SelectValue placeholder="Select department…" /></SelectTrigger>
          <SelectContent>
            {db.departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'reference': {
      const rows = field.refCollection ? rowsFor(db, field.refCollection) : [];
      return (
        <Select value={strVal || undefined} onValueChange={(v) => onChange(v)}>
          <SelectTrigger id={`f-${field.key}`}><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            {rows.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.code ? `${r.code} — ` : ''}{String(r.title ?? r.name ?? r.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case 'readonly':
      return <Input id={`f-${field.key}`} value={strVal} readOnly disabled />;
    default:
      return <Input id={`f-${field.key}`} value={strVal} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function FormScreen({ cfg, id }: { cfg: EntityConfig; id?: string }) {
  const db = useDb();
  const session = useSession();
  const router = useRouter();
  const mod = moduleByCode(cfg.module);
  const editing = !!id;
  const existing = editing ? rowsFor(db, cfg.collection).find((e) => e.id === id) : undefined;

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    if (existing) return { ...existing };
    const init: Record<string, unknown> = {};
    for (const f of cfg.formFields) init[f.key] = undefined;
    return init;
  });
  const [error, setError] = useState('');

  const missingRequired = useMemo(
    () =>
      cfg.formFields
        .filter((f) => f.required && (values[f.key] === undefined || values[f.key] === '' || values[f.key] === null))
        .map((f) => f.label),
    [cfg.formFields, values],
  );

  if (!session?.has(`${cfg.module}_CREATE`)) {
    return (
      <EmptyState
        title="Access denied"
        description={`Creating or editing ${cfg.labelPlural.toLowerCase()} requires the ${cfg.module}_MAKER role. Switch persona to continue.`}
      />
    );
  }
  if (editing && !existing) {
    return <EmptyState title={`${cfg.labelSingular} not found`} />;
  }
  if (editing && existing && !cfg.editableStatuses.includes(existing.status)) {
    return (
      <EmptyState
        title="Record is not editable"
        description={`A ${cfg.labelSingular.toLowerCase()} in status ${humanize(existing.status)} cannot be edited. Governed records are locked while awaiting approval.`}
      />
    );
  }

  const save = () => {
    if (missingRequired.length > 0) {
      setError(`Please complete required fields: ${missingRequired.join(', ')}`);
      return;
    }
    if (editing && existing) {
      const set: Record<string, unknown> = {};
      for (const f of cfg.formFields) {
        if (f.type !== 'readonly') set[f.key] = values[f.key];
      }
      updateRecord({ module: cfg.module, collection: cfg.collection, entityId: existing.id, set });
      router.push(entityHref(cfg, existing.id));
    } else {
      const record: EntityBase = {
        id: newId(),
        code: nextCode(rowsFor(db, cfg.collection), cfg.codePrefix),
        status: cfg.initialStatus,
        ...values,
      } as EntityBase;
      createRecord({ module: cfg.module, collection: cfg.collection, record });
      router.push(entityHref(cfg, record.id));
    }
  };

  return (
    <div>
      <PageHeader
        title={editing ? `Edit ${cfg.labelSingular}` : `New ${cfg.labelSingular}`}
        description={
          editing
            ? `Update the ${cfg.labelSingular.toLowerCase()} details. Changes are recorded in the activity history.`
            : `Create a draft ${cfg.labelSingular.toLowerCase()}. It can be edited until submitted for approval.`
        }
        crumbs={[
          { label: mod?.displayName ?? cfg.module, href: `/modules/${cfg.module}` },
          { label: cfg.labelPlural, href: entityHref(cfg) },
          { label: editing && existing ? entityTitle(cfg, existing) : `New ${cfg.labelSingular}` },
        ]}
      />

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <Card className="max-w-4xl">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {editing && existing?.code ? (
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input value={String(existing.code)} readOnly disabled className="font-mono" />
              </div>
            ) : null}
            {cfg.formFields.map((f) => (
              <div key={f.key} className={`space-y-1.5 ${f.full ? 'md:col-span-2' : ''}`}>
                <Label htmlFor={`f-${f.key}`}>
                  {f.label}
                  {f.required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                <FieldInput field={f} value={values[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save changes' : `Create ${cfg.labelSingular}`}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
