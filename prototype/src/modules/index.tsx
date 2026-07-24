'use client';

import { riskEntities } from './risk';
import { controlsEntities } from './controls';
import { complianceEntities } from './compliance';
import { auditEntities } from './audit';
import { securityEntities } from './security';
import { policyEntities } from './policy';
import { incidentEntities } from './incident';
import { tprEntities } from './tpr';
import { bcpEntities } from './bcp';
import { reportingEntities } from './reporting';
import { analyticsEntities } from './analytics';
import type { EntityConfig } from '../lib/registry';
import { moduleByCode } from '../lib/moduleCatalog';
import { EmptyState } from '../components/common/EmptyState';

import { RiskDashboard } from '../features/risk/RiskDashboard';
import { ControlsDashboard } from '../features/controls/ControlsDashboard';
import { ComplianceDashboard } from '../features/compliance/ComplianceDashboard';
import { AuditDashboard } from '../features/audit/AuditDashboard';
import { SecurityDashboard } from '../features/security/SecurityDashboard';
import { PolicyDashboard } from '../features/policy/PolicyDashboard';
import { IncidentDashboard } from '../features/incident/IncidentDashboard';
import { TprDashboard } from '../features/tpr/TprDashboard';
import { BcpDashboard } from '../features/bcp/BcpDashboard';
import { ReportingDashboard } from '../features/reporting/ReportingDashboard';
import { AnalyticsDashboard } from '../features/analytics/AnalyticsDashboard';

/** All entity configs across every module, keyed for the generic screen framework. */
export const allEntities: EntityConfig[] = [
  ...riskEntities,
  ...controlsEntities,
  ...complianceEntities,
  ...auditEntities,
  ...securityEntities,
  ...policyEntities,
  ...incidentEntities,
  ...tprEntities,
  ...bcpEntities,
  ...reportingEntities,
  ...analyticsEntities,
];

export function getEntityConfig(code: string, slug: string): EntityConfig | undefined {
  const upper = code.toUpperCase();
  return allEntities.find((e) => e.module === upper && e.slug === slug);
}

export function entitiesForModule(code: string): EntityConfig[] {
  const upper = code.toUpperCase();
  return allEntities.filter((e) => e.module === upper);
}

const dashboards: Record<string, React.ComponentType> = {
  RISK: RiskDashboard,
  CONTROLS: ControlsDashboard,
  COMPLIANCE: ComplianceDashboard,
  AUDIT: AuditDashboard,
  SECURITY: SecurityDashboard,
  POLICY: PolicyDashboard,
  INCIDENT: IncidentDashboard,
  TPR: TprDashboard,
  BCP: BcpDashboard,
  REPORTING: ReportingDashboard,
  ANALYTICS: AnalyticsDashboard,
};

export function ModuleDashboard({ code }: { code: string }) {
  const mod = moduleByCode(code);
  const Dashboard = dashboards[code.toUpperCase()];
  if (!mod || !Dashboard) {
    return <EmptyState title="Unknown module" description={`No module is registered for code "${code}".`} />;
  }
  return <Dashboard />;
}
