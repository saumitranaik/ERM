/**
 * Core prototype types. Entity shapes mirror the aggregates and entities named in
 * docs/04-domain-model/01-enterprise-domain-model.md; module-specific fields are
 * carried permissively so the generic screen framework can render any entity.
 */

export interface EntityBase {
  id: string;
  code?: string;
  name?: string;
  title?: string;
  status: string;
  description?: string;
  ownerId?: string;
  departmentId?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Department {
  id: string;
  name: string;
  head: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  departmentId: string;
}

export interface Persona {
  id: string;
  userId: string;
  label: string;
  summary: string;
  roles: string[];
}

export type PendingActionStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export interface PendingAction {
  id: string;
  module: string;
  actionType: string;
  collection: string;
  entityId: string;
  entityCode: string;
  entityLabel: string;
  entityHref: string;
  description: string;
  justification: string;
  payload?: Record<string, unknown>;
  targetStatus: string;
  rejectedStatus: string;
  createdBy: string;
  createdAt: string;
  status: PendingActionStatus;
  decidedBy?: string;
  decidedAt?: string;
  decisionComment?: string;
}

export interface HistoryEvent {
  id: string;
  module: string;
  collection: string;
  entityId: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  actorId: string;
  at: string;
  comment?: string;
}

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  at: string;
  recipientPersonaId?: string;
  audience?: 'all' | 'checkers';
  module: string;
  title: string;
  body: string;
  href: string;
  severity: NotificationSeverity;
  read: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  module: string;
  dueDate: string;
  assigneePersonaId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  href: string;
}

export interface EvidenceItem {
  id: string;
  collection: string;
  entityId: string;
  title: string;
  fileName: string;
  fileType: string;
  sizeKb: number;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

export type Db = {
  departments: Department[];
  users: User[];
  pendingActions: PendingAction[];
  history: HistoryEvent[];
  notifications: AppNotification[];
  tasks: TaskItem[];
  evidence: EvidenceItem[];
} & Record<string, EntityBase[] | unknown[]>;
