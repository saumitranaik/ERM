/**
 * Mock module catalog — stands in for PRSMTD's `GET /api/v1/modules`.
 * The sidebar derives its module navigation exclusively from this catalog
 * (mirroring PRSMTD's Frontend Hardcoding Guard, system.md §5b15); no module
 * route is ever hardcoded in the shell. Manifest shape follows
 * PRSMTD modules/{code}/module.yaml (code, roles, roleTypes, roleMappings).
 */

export type RoleType = 'MAKER' | 'CHECKER' | 'VIEWER';

export interface ModuleManifest {
  code: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  specPath: string;
  icon:
    | 'gauge' | 'shield-check' | 'scale' | 'clipboard-check' | 'lock'
    | 'book-open' | 'siren' | 'handshake' | 'life-buoy' | 'file-bar-chart' | 'bar-chart-3';
  roles: Record<string, { type: RoleType; permissions: string[] }>;
}

function stdRoles(code: string): ModuleManifest['roles'] {
  return {
    [`${code}_MAKER`]: { type: 'MAKER', permissions: [`${code}_CREATE`, `${code}_VIEW`] },
    [`${code}_CHECKER`]: { type: 'CHECKER', permissions: [`${code}_APPROVE`, `${code}_VIEW`] },
    [`${code}_VIEWER`]: { type: 'VIEWER', permissions: [`${code}_VIEW`] },
  };
}

export const moduleCatalog: ModuleManifest[] = [
  {
    code: 'RISK', name: 'Risk', displayName: 'Risk Management', version: '1.0.0',
    description: 'Enterprise and operational risk register, assessments, treatment, acceptance and KRIs',
    specPath: 'docs/10-risk/01-enterprise-risk-management.md', icon: 'gauge', roles: stdRoles('RISK'),
  },
  {
    code: 'CONTROLS', name: 'Controls', displayName: 'Controls Management', version: '1.0.0',
    description: 'Internal control library, control testing, exceptions and control-to-risk/obligation mapping',
    specPath: 'docs/12-controls/01-controls-management.md', icon: 'shield-check', roles: stdRoles('CONTROLS'),
  },
  {
    code: 'COMPLIANCE', name: 'Compliance', displayName: 'Compliance Management', version: '1.0.0',
    description: 'Obligation register, regulatory change management, assessments, attestations and calendar',
    specPath: 'docs/11-compliance/01-compliance-management.md', icon: 'scale', roles: stdRoles('COMPLIANCE'),
  },
  {
    code: 'AUDIT', name: 'Audit', displayName: 'Audit Management', version: '1.0.0',
    description: 'Audit universe, risk-based planning, engagements, working papers, findings and follow-up',
    specPath: 'docs/13-audit/01-audit-management.md', icon: 'clipboard-check', roles: stdRoles('AUDIT'),
  },
  {
    code: 'SECURITY', name: 'Security', displayName: 'Security Management', version: '1.0.0',
    description: 'Security assets, baselines, access governance and security findings',
    specPath: 'docs/09-security/01-security-management.md', icon: 'lock', roles: stdRoles('SECURITY'),
  },
  {
    code: 'POLICY', name: 'Policy', displayName: 'Policy Management', version: '1.0.0',
    description: 'Governed policy lifecycle, versions, reviews, acknowledgements and exceptions',
    specPath: 'docs/23-policy/01-policy-management.md', icon: 'book-open', roles: stdRoles('POLICY'),
  },
  {
    code: 'INCIDENT', name: 'Incident', displayName: 'Incident, Issue & CAPA', version: '1.0.0',
    description: 'Incident intake, root cause analysis, issue register and corrective/preventive action',
    specPath: 'docs/24-incident-issue-capa/01-incident-issue-capa-management.md', icon: 'siren', roles: stdRoles('INCIDENT'),
  },
  {
    code: 'TPR', name: 'Third-Party Risk', displayName: 'Third-Party Risk', version: '1.0.0',
    description: 'Vendor inventory, due diligence assessments, contracts, SLAs and exceptions',
    specPath: 'docs/25-third-party-risk/01-third-party-risk-management.md', icon: 'handshake', roles: stdRoles('TPR'),
  },
  {
    code: 'BCP', name: 'Business Continuity', displayName: 'Business Continuity', version: '1.0.0',
    description: 'Critical services, business impact analysis, continuity plans, exercises and activations',
    specPath: 'docs/26-business-continuity/01-business-continuity-management.md', icon: 'life-buoy', roles: stdRoles('BCP'),
  },
  {
    code: 'REPORTING', name: 'Reporting', displayName: 'Reporting', version: '1.0.0',
    description: 'Regulatory and executive report catalogue, instances, approval-before-submission and distribution',
    specPath: 'docs/14-reporting/01-reporting-management.md', icon: 'file-bar-chart', roles: stdRoles('REPORTING'),
  },
  {
    code: 'ANALYTICS', name: 'Analytics', displayName: 'Analytics', version: '1.0.0',
    description: 'KPI and metric catalogue, thresholds, heat-maps, trends and drill-downs',
    specPath: 'docs/15-analytics/01-analytics-management.md', icon: 'bar-chart-3', roles: stdRoles('ANALYTICS'),
  },
];

export function moduleByCode(code: string): ModuleManifest | undefined {
  return moduleCatalog.find((m) => m.code === code.toUpperCase());
}

/** Permissions granted by a set of role names, resolved against every manifest. */
export function permissionsForRoles(roles: string[]): Set<string> {
  const perms = new Set<string>();
  for (const m of moduleCatalog) {
    for (const [role, def] of Object.entries(m.roles)) {
      if (roles.includes(role)) def.permissions.forEach((p) => perms.add(p));
    }
  }
  return perms;
}
