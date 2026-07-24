import org from './org.json';
import riskData from './risk.json';
import controlsData from './controls.json';
import complianceData from './compliance.json';
import auditData from './audit.json';
import securityData from './security.json';
import policyData from './policy.json';
import incidentData from './incident.json';
import tprData from './tpr.json';
import bcpData from './bcp.json';
import reportingData from './reporting.json';
import analyticsData from './analytics.json';
import type { Db, PendingAction, HistoryEvent, AppNotification, TaskItem, EvidenceItem } from '../types/core';

/**
 * Seed pending actions: hand-authored to match records already seeded in a
 * pending workflow status (e.g. riskAssessments status SUBMITTED), so the
 * approvals queue and entity Approvals tabs are populated and internally
 * consistent from first load, not just after a demo user submits something.
 */
interface SeedAction {
  module: string;
  collection: string;
  entityId: string;
  entityCode: string;
  entityLabel: string;
  entitySlug: string;
  actionType: string;
  description: string;
  justification: string;
  targetStatus: string;
  rejectedStatus: string;
  createdBy: string;
  createdAt: string;
  decidedBy?: string;
  decidedAt?: string;
  decisionComment?: string;
  outcome: 'pending' | 'approved' | 'rejected';
}

const seedActions: SeedAction[] = [
  // ---- RISK ----
  { module: 'RISK', collection: 'riskAssessments', entityId: 'ra-004', entityCode: 'RAS-2026-0004', entityLabel: 'Initial assessment — fraudulent redemption via account takeover', entitySlug: 'assessments', actionType: 'RISK_ASSESSMENT_APPROVAL', description: 'Risk assessment approval', justification: 'Initial scoring based on industry incident data and current MFA coverage; requesting CRO sign-off to activate the risk.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-riskmgr', createdAt: '2026-07-18T10:15:00+05:30', outcome: 'pending' },
  { module: 'RISK', collection: 'riskAcceptances', entityId: 'rac-003', entityCode: 'ACC-2026-0003', entityLabel: 'Interim acceptance pending cross-training completion', entitySlug: 'acceptances', actionType: 'RISK_ACCEPTANCE_APPROVAL', description: 'Risk acceptance approval', justification: 'Requesting time-bound acceptance while the model documentation and cross-training treatment plan completes by September.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-riskmgr', createdAt: '2026-07-20T09:00:00+05:30', outcome: 'pending' },
  { module: 'RISK', collection: 'escalations', entityId: 'esc-001', entityCode: 'ESC-2026-0001', entityLabel: 'Appetite breach — debt scheme liquidity residual 15 vs threshold 12', entitySlug: 'escalations', actionType: 'RISK_ESCALATION_ACK', description: 'Escalation acknowledgement', justification: 'Automatic escalation on appetite breach; requires CRO acknowledgement.', targetStatus: 'ACKNOWLEDGED', rejectedStatus: 'PENDING_ACK', createdBy: 'p-riskmgr', createdAt: '2026-07-01T16:30:00+05:30', outcome: 'pending' },
  { module: 'RISK', collection: 'riskAssessments', entityId: 'ra-001', entityCode: 'RAS-2026-0001', entityLabel: 'H1 2026 reassessment — NAV computation error', entitySlug: 'assessments', actionType: 'RISK_ASSESSMENT_APPROVAL', description: 'Risk assessment approval', justification: 'Price-feed tolerance checks and four-eyes sign-off operated without exception through H1.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-riskmgr', createdAt: '2026-06-10T11:00:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-06-11T14:20:00+05:30', decisionComment: 'Approved — residual trend is favorable.', outcome: 'approved' },
  { module: 'RISK', collection: 'riskAssessments', entityId: 'ra-003', entityCode: 'RAS-2026-0003', entityLabel: 'Post-penetration-test reassessment — ransomware exposure', entitySlug: 'assessments', actionType: 'RISK_ASSESSMENT_APPROVAL', description: 'Risk assessment approval', justification: 'External penetration test confirmed exploitable paths; residual breaches appetite.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-riskmgr', createdAt: '2026-07-05T09:30:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-07-06T10:00:00+05:30', decisionComment: 'Approved. Escalation raised automatically for appetite breach.', outcome: 'approved' },
  { module: 'RISK', collection: 'escalations', entityId: 'esc-002', entityCode: 'ESC-2026-0002', entityLabel: 'Appetite breach — ransomware residual 15 vs threshold 12', entitySlug: 'escalations', actionType: 'RISK_ESCALATION_ACK', description: 'Escalation acknowledgement', justification: 'Automatic escalation on appetite breach.', targetStatus: 'ACKNOWLEDGED', rejectedStatus: 'PENDING_ACK', createdBy: 'p-riskmgr', createdAt: '2026-07-05T09:35:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-07-06T10:05:00+05:30', decisionComment: 'Acknowledged; EDR completion tracked weekly.', outcome: 'approved' },
  { module: 'RISK', collection: 'riskAcceptances', entityId: 'rac-001', entityCode: 'ACC-2026-0001', entityLabel: 'Acceptance of residual mis-selling risk after distributor controls', entitySlug: 'acceptances', actionType: 'RISK_ACCEPTANCE_APPROVAL', description: 'Risk acceptance approval', justification: 'Residual within appetite; distributor controls operating effectively.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-riskmgr', createdAt: '2026-05-10T10:00:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-05-12T09:00:00+05:30', decisionComment: 'Approved.', outcome: 'approved' },

  // ---- CONTROLS ----
  { module: 'CONTROLS', collection: 'controls', entityId: 'c-020', entityCode: 'CTL-2026-0020', entityLabel: 'Trade surveillance for front-running patterns', entitySlug: 'controls', actionType: 'CONTROLS_DESIGN_TEST_APPROVAL', description: 'Control design test approval', justification: 'Design covers equity dealing only; requesting activation with a scope-expansion follow-up planned.', targetStatus: 'ACTIVE', rejectedStatus: 'DRAFT', createdBy: 'p-controlowner', createdAt: '2026-07-11T09:00:00+05:30', outcome: 'pending' },
  { module: 'CONTROLS', collection: 'controlTests', entityId: 'ct-005', entityCode: 'CTT-2026-0005', entityLabel: 'Design assessment — trade surveillance', entitySlug: 'tests', actionType: 'CONTROLS_TEST_APPROVAL', description: 'Control test approval', justification: 'Design assessment complete; partial coverage noted for debt/derivatives order flow.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-controlowner', createdAt: '2026-07-10T15:00:00+05:30', outcome: 'pending' },
  { module: 'CONTROLS', collection: 'controlExceptions', entityId: 'ce-002', entityCode: 'CEX-2026-0002', entityLabel: 'Missing second-source evidence for illiquid debt valuations', entitySlug: 'exceptions', actionType: 'CONTROLS_CLOSURE_APPROVAL', description: 'Exception closure approval', justification: 'Valuation workflow hard-blocked without dual evidence; retraining completed.', targetStatus: 'CLOSED', rejectedStatus: 'REMEDIATION_IN_PROGRESS', createdBy: 'p-controlowner', createdAt: '2026-07-15T11:00:00+05:30', outcome: 'pending' },
  { module: 'CONTROLS', collection: 'controlTests', entityId: 'ct-001', entityCode: 'CTT-2026-0001', entityLabel: 'H1 operating effectiveness test — NAV sign-off', entitySlug: 'tests', actionType: 'CONTROLS_TEST_APPROVAL', description: 'Control test approval', justification: '45 NAV publication days sampled; sign-off evidence complete in all samples.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-controlowner', createdAt: '2026-06-05T14:00:00+05:30', decidedBy: 'p-hoc', decidedAt: '2026-06-06T09:00:00+05:30', decisionComment: 'Approved.', outcome: 'approved' },
  { module: 'CONTROLS', collection: 'controlTests', entityId: 'ct-003', entityCode: 'CTT-2026-0003', entityLabel: 'June patch SLA operating test', entitySlug: 'tests', actionType: 'CONTROLS_TEST_APPROVAL', description: 'Control test approval', justification: 'Six critical/high vulnerabilities exceeded SLA without approved exceptions.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-controlowner', createdAt: '2026-06-30T16:00:00+05:30', decidedBy: 'p-hoc', decidedAt: '2026-07-01T10:00:00+05:30', decisionComment: 'Approved. Exception CEX-2026-0001 raised.', outcome: 'approved' },

  // ---- COMPLIANCE ----
  { module: 'COMPLIANCE', collection: 'obligations', entityId: 'ob-014', entityCode: 'OBL-2026-0014', entityLabel: 'Digital personal data protection readiness', entitySlug: 'obligations', actionType: 'COMPLIANCE_ASSESSMENT_APPROVAL', description: 'Compliance assessment approval', justification: 'Gap assessment complete; non-compliant pending remediation programme approval.', targetStatus: 'ACTIVE', rejectedStatus: 'DRAFT', createdBy: 'p-compliance', createdAt: '2026-07-18T12:00:00+05:30', outcome: 'pending' },
  { module: 'COMPLIANCE', collection: 'complianceAssessments', entityId: 'ca-004', entityCode: 'CAS-2026-0004', entityLabel: 'DPDP readiness gap assessment', entitySlug: 'assessments', actionType: 'COMPLIANCE_ASSESSMENT_APPROVAL', description: 'Compliance assessment approval', justification: 'No consent tooling, breach notification runbook or rights workflow exists; remediation programme proposed.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-compliance', createdAt: '2026-07-18T12:05:00+05:30', outcome: 'pending' },
  { module: 'COMPLIANCE', collection: 'complianceExceptions', entityId: 'cx-003', entityCode: 'CPX-2026-0003', entityLabel: 'Advertising code disclosure omission in June digital campaign', entitySlug: 'exceptions', actionType: 'COMPLIANCE_CLOSURE_APPROVAL', description: 'Exception closure approval', justification: 'Creative templates locked with embedded disclosures; pre-approval checklist extended.', targetStatus: 'CLOSED', rejectedStatus: 'REMEDIATION_IN_PROGRESS', createdBy: 'p-compliance', createdAt: '2026-07-20T10:00:00+05:30', outcome: 'pending' },
  { module: 'COMPLIANCE', collection: 'complianceAssessments', entityId: 'ca-001', entityCode: 'CAS-2026-0001', entityLabel: 'Q2 cyber framework compliance assessment', entitySlug: 'assessments', actionType: 'COMPLIANCE_ASSESSMENT_APPROVAL', description: 'Compliance assessment approval', justification: 'VAPT completed; patch SLA breaches and MFA gaps prevent full compliance rating.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-compliance', createdAt: '2026-07-05T11:00:00+05:30', decidedBy: 'p-hoc', decidedAt: '2026-07-06T09:30:00+05:30', decisionComment: 'Approved as partially compliant.', outcome: 'approved' },

  // ---- AUDIT ----
  { module: 'AUDIT', collection: 'auditPlans', entityId: 'aup-01', entityCode: 'AUP-2026-0001', entityLabel: 'FY 2026-27 Risk-Based Internal Audit Plan', entitySlug: 'plans', actionType: 'AUDIT_PLAN_APPROVAL', description: 'Audit plan approval', justification: 'Annual plan covering seven auditable entities prioritized by risk rating.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-auditor', createdAt: '2026-03-10T10:00:00+05:30', decidedBy: 'p-audithead', decidedAt: '2026-03-15T09:00:00+05:30', decisionComment: 'Approved by the Audit Committee.', outcome: 'approved' },

  // ---- SECURITY ----
  { module: 'SECURITY', collection: 'accessGrants', entityId: 'ag-03', entityCode: 'SAG-2026-0003', entityLabel: 'DR exercise failover operator access', entitySlug: 'access-grants', actionType: 'SECURITY_GRANT_APPROVAL', description: 'Privileged access grant approval', justification: 'DR site infrastructure console access needed for November failover exercise preparation.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-secanalyst', createdAt: '2026-07-19T14:00:00+05:30', outcome: 'pending' },
  { module: 'SECURITY', collection: 'securityFindings', entityId: 'sf-03', entityCode: 'SEF-2026-0003', entityLabel: 'Shared administrator account on backup console', entitySlug: 'findings', actionType: 'SECURITY_CLOSURE_APPROVAL', description: 'Security finding closure approval', justification: 'Individual named accounts created; shared account disabled after migration.', targetStatus: 'CLOSED', rejectedStatus: 'REMEDIATION_IN_PROGRESS', createdBy: 'p-secanalyst', createdAt: '2026-07-20T11:00:00+05:30', outcome: 'pending' },
  { module: 'SECURITY', collection: 'accessGrants', entityId: 'ag-02', entityCode: 'SAG-2026-0002', entityLabel: 'Quarterly patching window — server estate', entitySlug: 'access-grants', actionType: 'SECURITY_GRANT_APPROVAL', description: 'Privileged access grant approval', justification: 'July patch cycle execution window.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-secanalyst', createdAt: '2026-07-11T09:00:00+05:30', decidedBy: 'p-ciso', decidedAt: '2026-07-11T15:00:00+05:30', decisionComment: 'Approved for the standard patch window.', outcome: 'approved' },
  { module: 'SECURITY', collection: 'accessGrants', entityId: 'ag-04', entityCode: 'SAG-2026-0004', entityLabel: 'Vendor support session — fund accounting upgrade', entitySlug: 'access-grants', actionType: 'SECURITY_GRANT_APPROVAL', description: 'Privileged access grant approval', justification: 'Screen-shared vendor session with temporary application admin for upgrade dry run.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-secanalyst', createdAt: '2026-07-08T10:00:00+05:30', decidedBy: 'p-ciso', decidedAt: '2026-07-09T09:00:00+05:30', decisionComment: 'Rejected — request a scoped, time-boxed grant with session recording instead.', outcome: 'rejected' },

  // ---- POLICY ----
  { module: 'POLICY', collection: 'policyVersions', entityId: 'pv-004', entityCode: 'PVR-2026-0004', entityLabel: 'Data Privacy Policy v1.0 (draft)', entitySlug: 'versions', actionType: 'POLICY_VERSION_PUBLICATION_APPROVAL', description: 'Policy version publication approval', justification: 'Initial DPDP-aligned privacy policy ready for governance review.', targetStatus: 'PUBLISHED', rejectedStatus: 'DRAFT', createdBy: 'p-policyowner', createdAt: '2026-07-19T10:00:00+05:30', outcome: 'pending' },
  { module: 'POLICY', collection: 'policyReviews', entityId: 'pr-002', entityCode: 'PRV-2026-0002', entityLabel: 'Annual review — Outsourcing Policy', entitySlug: 'reviews', actionType: 'POLICY_REVIEW_APPROVAL', description: 'Policy review approval', justification: 'Policy reaffirmed without change; exit-management annexure to be revisited later.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-policyowner', createdAt: '2026-07-10T10:00:00+05:30', outcome: 'pending' },
  { module: 'POLICY', collection: 'policyVersions', entityId: 'pv-001', entityCode: 'PVR-2026-0001', entityLabel: 'Valuation Policy v5.0', entitySlug: 'versions', actionType: 'POLICY_VERSION_PUBLICATION_APPROVAL', description: 'Policy version publication approval', justification: 'Added dual-source verification hard-block for illiquid debt.', targetStatus: 'PUBLISHED', rejectedStatus: 'DRAFT', createdBy: 'p-policyowner', createdAt: '2026-05-28T10:00:00+05:30', decidedBy: 'p-hoc', decidedAt: '2026-06-01T09:00:00+05:30', decisionComment: 'Approved and published.', outcome: 'approved' },
  { module: 'POLICY', collection: 'policyReviews', entityId: 'pr-001', entityCode: 'PRV-2026-0001', entityLabel: 'Annual review — Risk Appetite Statement', entitySlug: 'reviews', actionType: 'POLICY_REVIEW_APPROVAL', description: 'Policy review approval', justification: 'Appetite thresholds recalibrated for Fund Management category.', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', createdBy: 'p-policyowner', createdAt: '2026-03-18T10:00:00+05:30', decidedBy: 'p-hoc', decidedAt: '2026-03-20T09:00:00+05:30', decisionComment: 'Approved.', outcome: 'approved' },

  // ---- INCIDENT ----
  { module: 'INCIDENT', collection: 'rootCauseAnalyses', entityId: 'rca-02', entityCode: 'RCA-2026-0002', entityLabel: 'DMZ lateral movement path root cause', entitySlug: 'rca', actionType: 'INCIDENT_RCA_APPROVAL', description: 'Root cause analysis approval', justification: 'Unpatched middleware combined with flat network segmentation allowed lateral movement.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-incidentmgr', createdAt: '2026-07-08T14:00:00+05:30', outcome: 'pending' },
  { module: 'INCIDENT', collection: 'capas', entityId: 'capa-03', entityCode: 'CPA-2026-0003', entityLabel: 'Vendor contract schema-change notification clause', entitySlug: 'capas', actionType: 'INCIDENT_CAPA_PLAN_APPROVAL', description: 'CAPA action plan approval', justification: 'Add mandatory 30-day advance notice clause for price-feed schema changes.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-incidentmgr', createdAt: '2026-07-21T10:00:00+05:30', outcome: 'pending' },
  { module: 'INCIDENT', collection: 'incidentEscalations', entityId: 'iesc-02', entityCode: 'IES-2026-0002', entityLabel: 'Segmentation CAPA nearing due date escalation', entitySlug: 'escalations', actionType: 'INCIDENT_ESCALATION_ACK', description: 'Escalation acknowledgement', justification: 'System-raised: CAPA target completion within 14 days with two open action items.', targetStatus: 'ACKNOWLEDGED', rejectedStatus: 'RAISED', createdBy: 'p-incidentmgr', createdAt: '2026-07-20T08:00:00+05:30', outcome: 'pending' },
  { module: 'INCIDENT', collection: 'rootCauseAnalyses', entityId: 'rca-01', entityCode: 'RCA-2026-0001', entityLabel: 'NAV recomputation root cause', entitySlug: 'rca', actionType: 'INCIDENT_RCA_APPROVAL', description: 'Root cause analysis approval', justification: 'Vendor changed the price file delimiter without notice.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-incidentmgr', createdAt: '2026-05-02T10:00:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-05-04T09:00:00+05:30', decisionComment: 'Approved.', outcome: 'approved' },
  { module: 'INCIDENT', collection: 'incidentEscalations', entityId: 'iesc-01', entityCode: 'IES-2026-0001', entityLabel: 'Critical penetration test finding escalation', entitySlug: 'escalations', actionType: 'INCIDENT_ESCALATION_ACK', description: 'Escalation acknowledgement', justification: 'Critical severity DMZ lateral movement path requires joint acknowledgement.', targetStatus: 'ACKNOWLEDGED', rejectedStatus: 'RAISED', createdBy: 'p-incidentmgr', createdAt: '2026-07-04T15:00:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-07-04T17:00:00+05:30', decisionComment: 'Acknowledged; treating as critical priority.', outcome: 'approved' },
  { module: 'INCIDENT', collection: 'capas', entityId: 'capa-02', entityCode: 'CPA-2026-0002', entityLabel: 'Enforce network segmentation baseline on interface subnet', entitySlug: 'capas', actionType: 'INCIDENT_CAPA_PLAN_APPROVAL', description: 'CAPA action plan approval', justification: 'Apply and verify the network segmentation baseline on all RTA/interface subnets.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-incidentmgr', createdAt: '2026-07-08T16:00:00+05:30', decidedBy: 'p-cro', decidedAt: '2026-07-09T10:00:00+05:30', decisionComment: 'Approved — critical priority.', outcome: 'approved' },

  // ---- TPR ----
  { module: 'TPR', collection: 'vendors', entityId: 'v-05', entityCode: 'VEN-2026-0005', entityLabel: 'Northgate Market Data Services', entitySlug: 'vendors', actionType: 'TPR_REASSESSMENT_APPROVAL', description: 'Vendor reassessment approval', justification: 'Repeated undocumented price-file format changes require a risk reassessment before renewal.', targetStatus: 'ACTIVE', rejectedStatus: 'ACTIVE', createdBy: 'p-vendormgr', createdAt: '2026-07-15T10:00:00+05:30', outcome: 'pending' },
  { module: 'TPR', collection: 'vendorAssessments', entityId: 'va-02', entityCode: 'VAS-2026-0002', entityLabel: 'Risk reassessment — market data quality incidents', entitySlug: 'assessments', actionType: 'TPR_ASSESSMENT_APPROVAL', description: 'Vendor assessment approval', justification: 'Conditional pass pending contractual notice clause.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-vendormgr', createdAt: '2026-07-15T10:05:00+05:30', outcome: 'pending' },
  { module: 'TPR', collection: 'vendorAssessments', entityId: 'va-01', entityCode: 'VAS-2026-0001', entityLabel: 'Annual due diligence — RTA renewal', entitySlug: 'assessments', actionType: 'TPR_ASSESSMENT_APPROVAL', description: 'Vendor assessment approval', justification: 'Financial stability, BCP capability and data protection controls reviewed with no material concerns.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-vendormgr', createdAt: '2026-03-15T10:00:00+05:30', decidedBy: 'p-coo', decidedAt: '2026-03-18T09:00:00+05:30', decisionComment: 'Approved.', outcome: 'approved' },

  // ---- BCP ----
  { module: 'BCP', collection: 'criticalServices', entityId: 'cbs-06', entityCode: 'CBS-2026-0006', entityLabel: 'Payroll & Statutory Payments', entitySlug: 'critical-services', actionType: 'BCP_BIA_APPROVAL', description: 'Business impact analysis approval', justification: 'Initial BIA proposes 48h RTO / 24h RPO given limited external visibility.', targetStatus: 'ACTIVE', rejectedStatus: 'IDENTIFIED', createdBy: 'p-bcm', createdAt: '2026-07-20T09:00:00+05:30', outcome: 'pending' },
  { module: 'BCP', collection: 'businessImpactAnalyses', entityId: 'bia-03', entityCode: 'BIA-2026-0003', entityLabel: 'Initial BIA — Payroll & Statutory Payments', entitySlug: 'bia', actionType: 'BCP_BIA_APPROVAL', description: 'Business impact analysis approval', justification: 'Limited external visibility; internal morale and statutory penalty risk if delayed.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-bcm', createdAt: '2026-07-20T09:05:00+05:30', outcome: 'pending' },
  { module: 'BCP', collection: 'continuityPlanVersions', entityId: 'cpv-01', entityCode: 'CPV-2026-0001', entityLabel: 'IT DR Plan v3.3', entitySlug: 'plan-versions', actionType: 'BCP_PLAN_VERSION_PUBLICATION_APPROVAL', description: 'Continuity plan version approval', justification: 'Updated DNS failover automation and revised RTO evidence procedure after the May exercise shortfall.', targetStatus: 'PUBLISHED', rejectedStatus: 'DRAFT', createdBy: 'p-bcm', createdAt: '2026-07-21T11:00:00+05:30', outcome: 'pending' },
  { module: 'BCP', collection: 'businessImpactAnalyses', entityId: 'bia-01', entityCode: 'BIA-2026-0001', entityLabel: 'Annual BIA — NAV Computation & Publication', entitySlug: 'bia', actionType: 'BCP_BIA_APPROVAL', description: 'Business impact analysis approval', justification: 'Severe impact rating; recommends 4h RTO / 1h RPO.', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', createdBy: 'p-bcm', createdAt: '2026-06-01T10:00:00+05:30', decidedBy: 'p-coo', decidedAt: '2026-06-03T09:00:00+05:30', decisionComment: 'Approved.', outcome: 'approved' },
  { module: 'BCP', collection: 'continuityPlanVersions', entityId: 'cpv-02', entityCode: 'CPV-2026-0002', entityLabel: 'Fund Ops BCP/DR Plan v4.0', entitySlug: 'plan-versions', actionType: 'BCP_PLAN_VERSION_PUBLICATION_APPROVAL', description: 'Continuity plan version approval', justification: 'Incorporated the hot-standby dealing desk strategy and updated activation contact tree.', targetStatus: 'PUBLISHED', rejectedStatus: 'DRAFT', createdBy: 'p-bcm', createdAt: '2026-06-20T10:00:00+05:30', decidedBy: 'p-coo', decidedAt: '2026-06-22T09:00:00+05:30', decisionComment: 'Approved and published.', outcome: 'approved' },
];

function buildLedger() {
  const pendingActions: PendingAction[] = [];
  const history: HistoryEvent[] = [];
  const notifications: AppNotification[] = [];

  seedActions.forEach((a, i) => {
    const href = `/modules/${a.module}/${a.entitySlug}/${a.entityId}`;
    const status = a.outcome === 'pending' ? 'pending' : a.outcome === 'approved' ? 'approved' : 'rejected';

    pendingActions.push({
      id: `seed-pa-${i + 1}`,
      module: a.module,
      actionType: a.actionType,
      collection: a.collection,
      entityId: a.entityId,
      entityCode: a.entityCode,
      entityLabel: a.entityLabel,
      entityHref: href,
      description: a.description,
      justification: a.justification,
      targetStatus: a.targetStatus,
      rejectedStatus: a.rejectedStatus,
      createdBy: a.createdBy,
      createdAt: a.createdAt,
      status,
      decidedBy: a.decidedBy,
      decidedAt: a.decidedAt,
      decisionComment: a.decisionComment,
    });

    history.push({
      id: `seed-h-${i + 1}-created`,
      module: a.module,
      collection: a.collection,
      entityId: a.entityId,
      action: 'ACTION_CREATED',
      toStatus: status === 'pending' ? a.targetStatus : a.targetStatus,
      actorId: a.createdBy,
      at: a.createdAt,
      comment: a.justification,
    });

    if (a.outcome !== 'pending' && a.decidedBy && a.decidedAt) {
      history.push({
        id: `seed-h-${i + 1}-decided`,
        module: a.module,
        collection: a.collection,
        entityId: a.entityId,
        action: a.outcome === 'approved' ? 'ACTION_APPROVED' : 'ACTION_REJECTED',
        toStatus: a.outcome === 'approved' ? a.targetStatus : a.rejectedStatus,
        actorId: a.decidedBy,
        at: a.decidedAt,
        comment: a.decisionComment,
      });
    }

    if (status === 'pending') {
      notifications.push({
        id: `seed-n-${i + 1}`,
        at: a.createdAt,
        audience: 'checkers',
        module: a.module,
        title: `Approval requested: ${a.description}`,
        body: `${a.entityLabel} submitted for approval.`,
        href: '/protected/approvals',
        severity: 'info',
        read: false,
      });
    } else if (a.decidedAt) {
      notifications.push({
        id: `seed-n-${i + 1}`,
        at: a.decidedAt,
        recipientPersonaId: a.createdBy,
        module: a.module,
        title: a.outcome === 'approved' ? `Approved: ${a.description}` : `Rejected: ${a.description}`,
        body: `"${a.entityLabel}" was ${a.outcome}${a.decisionComment ? ` — ${a.decisionComment}` : ''}.`,
        href,
        severity: a.outcome === 'approved' ? 'success' : 'error',
        read: true,
      });
    }
  });

  return { pendingActions, history, notifications };
}

const tasks: TaskItem[] = [
  { id: 'task-01', title: 'Complete DPDP consent management design review', module: 'COMPLIANCE', dueDate: '2026-08-10', assigneePersonaId: 'p-secanalyst', status: 'IN_PROGRESS', href: '/modules/COMPLIANCE/exceptions/cx-002' },
  { id: 'task-02', title: 'Prepare Q2 Board Risk Report pack', module: 'RISK', dueDate: '2026-08-01', assigneePersonaId: 'p-analyst', status: 'OPEN', href: '/modules/REPORTING/instances/ri-01' },
  { id: 'task-03', title: 'Complete EDR deployment wave 3', module: 'SECURITY', dueDate: '2026-08-25', assigneePersonaId: 'p-secanalyst', status: 'IN_PROGRESS', href: '/modules/RISK/treatment-plans/tp-001' },
  { id: 'task-04', title: 'Draft RTA portability migration runbook', module: 'TPR', dueDate: '2026-10-15', assigneePersonaId: 'p-vendormgr', status: 'OPEN', href: '/modules/RISK/treatment-plans/tp-005' },
  { id: 'task-05', title: 'Schedule November DR failover re-test', module: 'BCP', dueDate: '2026-09-01', assigneePersonaId: 'p-bcm', status: 'OPEN', href: '/modules/BCP/exercises/cex1-03' },
  { id: 'task-06', title: 'Verify passive breach workflow operating for Q2', module: 'AUDIT', dueDate: '2026-08-31', assigneePersonaId: 'p-auditor', status: 'OPEN', href: '/modules/AUDIT/follow-ups/fua-02' },
  { id: 'task-07', title: 'Publish social media guideline v1.1', module: 'POLICY', dueDate: '2026-09-30', assigneePersonaId: 'p-policyowner', status: 'OPEN', href: '/modules/POLICY/versions/pv-005' },
];

const evidence: EvidenceItem[] = [
  { id: 'ev-01', collection: 'risks', entityId: 'r-007', title: 'External penetration test report — Q3 2026', fileName: 'pentest-report-q3-2026.pdf', fileType: 'pdf', sizeKb: 3420, uploadedBy: 'p-secanalyst', uploadedAt: '2026-07-05T10:00:00+05:30', description: 'Full findings and remediation recommendations from the external penetration test.' },
  { id: 'ev-02', collection: 'controls', entityId: 'c-001', title: 'NAV sign-off evidence sample — June 2026', fileName: 'nav-signoff-sample-jun2026.xlsx', fileType: 'xlsx', sizeKb: 812, uploadedBy: 'p-controlowner', uploadedAt: '2026-06-05T14:30:00+05:30', description: '45-day sample of daily NAV four-eyes sign-off records.' },
  { id: 'ev-03', collection: 'obligations', entityId: 'ob-010', title: 'VAPT certificate — cyber framework compliance', fileName: 'vapt-certificate-2026.pdf', fileType: 'pdf', sizeKb: 540, uploadedBy: 'p-compliance', uploadedAt: '2026-07-05T09:00:00+05:30' },
  { id: 'ev-04', collection: 'auditEngagements', entityId: 'eng-01', title: 'IT General Controls audit working paper index', fileName: 'itgc-audit-index-2026.pdf', fileType: 'pdf', sizeKb: 210, uploadedBy: 'p-auditor', uploadedAt: '2026-07-20T11:00:00+05:30' },
  { id: 'ev-05', collection: 'continuityExercises', entityId: 'cex1-01', title: 'H1 DR failover exercise report', fileName: 'dr-failover-report-may2026.pdf', fileType: 'pdf', sizeKb: 1180, uploadedBy: 'p-bcm', uploadedAt: '2026-05-19T09:00:00+05:30', description: 'Includes the DNS cutover delay analysis and remediation recommendations.' },
];

export function buildSeedDb(): Db {
  const { pendingActions, history, notifications } = buildLedger();

  return {
    departments: org.departments,
    users: org.users,
    personas: org.personas,
    pendingActions,
    history: history.sort((a, b) => b.at.localeCompare(a.at)),
    notifications: notifications.sort((a, b) => b.at.localeCompare(a.at)),
    tasks,
    evidence,

    ...riskData,
    ...controlsData,
    ...complianceData,
    ...auditData,
    ...securityData,
    ...policyData,
    ...incidentData,
    ...tprData,
    ...bcpData,
    ...reportingData,
    ...analyticsData,
  } as unknown as Db;
}
