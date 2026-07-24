/**
 * Entity registry — the configuration model that drives the generic screen
 * framework. Each module contributes EntityConfig objects (one per aggregate
 * or entity that gets its own screens); the dynamic routes under
 * app/modules/[code]/[entity]/ render list / detail / create / edit /
 * approval screens entirely from this configuration, guaranteeing every
 * module shares one consistent UX language.
 */
import type { BadgeTone } from '../components/ui/badge';
import type { Db, EntityBase } from '../types/core';

export type FieldType =
  | 'text' | 'textarea' | 'select' | 'number' | 'date'
  | 'user' | 'department' | 'reference' | 'readonly';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];               // for select
  refCollection?: string;           // for reference: target collection
  refModule?: string;               // module owning the referenced entity
  refEntity?: string;               // entity slug for links
  full?: boolean;                   // span both form columns
  help?: string;
  min?: number;
  max?: number;
}

export type CellType = 'code' | 'text' | 'status' | 'severity' | 'score' | 'user' | 'department' | 'date' | 'datetime' | 'number' | 'badge';

export interface ColumnDef {
  key: string;
  label: string;
  cell?: CellType;
  tone?: BadgeTone;                 // for cell 'badge'
  sortable?: boolean;               // default true
}

export interface FilterDef {
  key: string;
  label: string;
  options?: string[];               // omit → derive distinct values from data
}

export interface WorkflowActionDef {
  id: string;                       // SCREAMING_SNAKE_CASE action type suffix
  label: string;
  fromStatuses: string[];
  governed: boolean;                // true → maker-checker via pending action
  pendingStatus?: string;
  targetStatus: string;
  rejectedStatus?: string;          // governed only; default = first fromStatus
  permission: 'CREATE' | 'APPROVE'; // resolved as `${module}_${permission}`
  tone?: 'default' | 'destructive' | 'outline';
  description: string;              // shown on the pending action / dialog
  set?: Record<string, unknown>;    // extra fields applied on completion
}

export interface RelationDef {
  label: string;
  collection: string;
  module: string;
  entitySlug: string;
  /** Field on the related collection that points at this entity's id… */
  foreignKey?: string;
  /** …or field on this entity holding an array of related ids. */
  localKey?: string;
  columns: ColumnDef[];
}

export interface DetailFieldDef {
  key: string;
  label: string;
  cell?: CellType;
}

export interface DetailSectionDef {
  title: string;
  fields: DetailFieldDef[];
}

export interface EntityConfig {
  module: string;
  slug: string;
  labelSingular: string;
  labelPlural: string;
  collection: string;
  codePrefix: string;
  titleField: string;
  description: string;
  statusTones?: Record<string, BadgeTone>;
  initialStatus: string;            // status a newly created record gets
  editableStatuses: string[];       // statuses in which edit is allowed
  columns: ColumnDef[];
  filters: FilterDef[];
  formFields: FieldDef[];
  detailSections: DetailSectionDef[];
  workflowActions: WorkflowActionDef[];
  relations: RelationDef[];
  hasEvidence: boolean;
  /** Hide the "New" button (records created only through other flows). */
  noCreate?: boolean;
}

export function entityHref(cfg: Pick<EntityConfig, 'module' | 'slug'>, id?: string): string {
  const base = `/modules/${cfg.module}/${cfg.slug}`;
  return id ? `${base}/${id}` : base;
}

export function entityTitle(cfg: EntityConfig, e: EntityBase): string {
  return String(e[cfg.titleField] ?? e.name ?? e.title ?? e.id);
}

export function rowsFor(db: Db, collection: string): EntityBase[] {
  return (db[collection] as EntityBase[]) ?? [];
}
