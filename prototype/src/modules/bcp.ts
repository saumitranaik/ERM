/**
 * BCP (Business Continuity) module entity configuration — grounded in
 * docs/26-business-continuity/01-business-continuity-management.md (critical
 * service lifecycle, BIA governance, continuity plan versioning, exercises,
 * immediate-raise/governed-closure exceptions).
 */
import type { EntityConfig } from '../lib/registry';

export const bcpEntities: EntityConfig[] = [
  {
    module: 'BCP',
    slug: 'critical-services',
    labelSingular: 'Critical Business Service',
    labelPlural: 'Critical Business Services',
    collection: 'criticalServices',
    codePrefix: 'CBS',
    titleField: 'name',
    description: 'Business services tiered by criticality, carrying current recovery time/point objectives from the latest approved BIA.',
    initialStatus: 'IDENTIFIED',
    editableStatuses: ['IDENTIFIED'],
    statusTones: { UNDER_ASSESSMENT: 'warning' },
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'name', label: 'Service' },
      { key: 'criticalityTier', label: 'Tier', cell: 'badge', tone: 'secondary' },
      { key: 'currentRtoHours', label: 'RTO (hrs)', cell: 'number' },
      { key: 'currentRpoHours', label: 'RPO (hrs)', cell: 'number' },
      { key: 'nextBiaDueDate', label: 'Next BIA', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'criticalityTier', label: 'Tiers', options: ['TIER_1_MISSION_CRITICAL', 'TIER_2_ESSENTIAL', 'TIER_3_SUPPORTING'] },
    ],
    formFields: [
      { key: 'name', label: 'Service Name', type: 'text', required: true, full: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'criticalityTier', label: 'Criticality Tier', type: 'select', required: true, options: ['TIER_1_MISSION_CRITICAL', 'TIER_2_ESSENTIAL', 'TIER_3_SUPPORTING'] },
      { key: 'ownerId', label: 'Service Owner', type: 'user', required: true },
    ],
    detailSections: [
      {
        title: 'Service',
        fields: [
          { key: 'criticalityTier', label: 'Tier', cell: 'badge' },
          { key: 'ownerId', label: 'Owner', cell: 'user' },
        ],
      },
      {
        title: 'Recovery Objectives',
        fields: [
          { key: 'currentRtoHours', label: 'Current RTO (hrs)', cell: 'number' },
          { key: 'currentRpoHours', label: 'Current RPO (hrs)', cell: 'number' },
          { key: 'currentMtpdHours', label: 'Current MTPD (hrs)', cell: 'number' },
          { key: 'lastBiaDate', label: 'Last BIA', cell: 'date' },
          { key: 'nextBiaDueDate', label: 'Next BIA Due', cell: 'date' },
        ],
      },
    ],
    workflowActions: [
      { id: 'BIA_APPROVAL', label: 'Submit Initial BIA', fromStatuses: ['IDENTIFIED', 'UNDER_ASSESSMENT'], governed: true, pendingStatus: 'UNDER_ASSESSMENT', targetStatus: 'ACTIVE', rejectedStatus: 'IDENTIFIED', permission: 'CREATE', description: 'Business impact analysis approval' },
      { id: 'REVIEW_BIA', label: 'Submit Periodic/Material-Change BIA', fromStatuses: ['ACTIVE'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'ACTIVE', rejectedStatus: 'ACTIVE', permission: 'CREATE', description: 'BIA re-approval' },
      { id: 'RETIREMENT_APPROVAL', label: 'Propose Retirement', fromStatuses: ['ACTIVE'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'RETIRED', rejectedStatus: 'ACTIVE', permission: 'CREATE', tone: 'outline', description: 'Critical service retirement approval' },
    ],
    relations: [
      {
        label: 'Business Impact Analyses', collection: 'businessImpactAnalyses', module: 'BCP', entitySlug: 'bia', foreignKey: 'criticalServiceId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'BIA' },
          { key: 'impactRating', label: 'Impact', cell: 'severity' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Continuity Strategies', collection: 'continuityStrategies', module: 'BCP', entitySlug: 'strategies', foreignKey: 'criticalServiceId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'strategyType', label: 'Strategy', cell: 'badge' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Continuity Plans Covering This Service', collection: 'continuityPlans', module: 'BCP', entitySlug: 'plans', localKey: 'coveredServiceIds',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Plan' },
          { key: 'planType', label: 'Type', cell: 'badge' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
    ],
    hasEvidence: true,
  },
  {
    module: 'BCP',
    slug: 'bia',
    labelSingular: 'Business Impact Analysis',
    labelPlural: 'Business Impact Analyses',
    collection: 'businessImpactAnalyses',
    codePrefix: 'BIA',
    titleField: 'title',
    description: 'Point-in-time impact assessments driving each critical service’s recovery objectives.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'BIA' },
      { key: 'trigger', label: 'Trigger', cell: 'badge', tone: 'secondary' },
      { key: 'impactRating', label: 'Impact', cell: 'severity' },
      { key: 'biaDate', label: 'Date', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'impactRating', label: 'Impact Ratings', options: ['LOW', 'MEDIUM', 'HIGH', 'SEVERE'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'criticalServiceId', label: 'Critical Service', type: 'reference', refCollection: 'criticalServices', refModule: 'BCP', refEntity: 'critical-services', required: true },
      { key: 'trigger', label: 'Trigger', type: 'select', required: true, options: ['INITIAL', 'PERIODIC', 'MATERIAL_CHANGE'] },
      { key: 'biaDate', label: 'BIA Date', type: 'date', required: true },
      { key: 'assessorId', label: 'Assessor', type: 'user', required: true },
      { key: 'impactRating', label: 'Impact Rating', type: 'select', required: true, options: ['LOW', 'MEDIUM', 'HIGH', 'SEVERE'] },
      { key: 'financialImpactEstimate', label: 'Financial Impact Estimate (₹)', type: 'number', min: 0 },
      { key: 'recommendedRtoHours', label: 'Recommended RTO (hrs)', type: 'number', min: 0, required: true },
      { key: 'recommendedRpoHours', label: 'Recommended RPO (hrs)', type: 'number', min: 0, required: true },
      { key: 'reputationalImpactNotes', label: 'Reputational Impact Notes', type: 'textarea', full: true },
    ],
    detailSections: [
      {
        title: 'Assessment',
        fields: [
          { key: 'trigger', label: 'Trigger', cell: 'badge' },
          { key: 'biaDate', label: 'Date', cell: 'date' },
          { key: 'assessorId', label: 'Assessor', cell: 'user' },
          { key: 'impactRating', label: 'Impact Rating', cell: 'severity' },
        ],
      },
      {
        title: 'Impact & Objectives',
        fields: [
          { key: 'financialImpactEstimate', label: 'Financial Impact (₹)', cell: 'number' },
          { key: 'recommendedRtoHours', label: 'Recommended RTO (hrs)', cell: 'number' },
          { key: 'recommendedRpoHours', label: 'Recommended RPO (hrs)', cell: 'number' },
          { key: 'reputationalImpactNotes', label: 'Reputational Notes' },
        ],
      },
    ],
    workflowActions: [
      { id: 'BIA_APPROVAL', label: 'Submit for Approval', fromStatuses: ['DRAFT'], governed: true, pendingStatus: 'SUBMITTED', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Business impact analysis approval' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'BCP',
    slug: 'plans',
    labelSingular: 'Continuity Plan',
    labelPlural: 'Continuity Plans',
    collection: 'continuityPlans',
    codePrefix: 'CPL',
    titleField: 'title',
    description: 'Versioned BCP/DR/Combined continuity plans; a version becomes current only once approved and published.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Plan' },
      { key: 'planType', label: 'Type', cell: 'badge', tone: 'secondary' },
      { key: 'currentVersionNumber', label: 'Version' },
      { key: 'nextReviewDueDate', label: 'Next Review', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'planType', label: 'Types', options: ['BCP', 'DR_PLAN', 'COMBINED'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'planType', label: 'Plan Type', type: 'select', required: true, options: ['BCP', 'DR_PLAN', 'COMBINED'] },
      { key: 'ownerId', label: 'Plan Owner', type: 'user', required: true },
      { key: 'nextReviewDueDate', label: 'Next Review Due', type: 'date' },
    ],
    detailSections: [
      {
        title: 'Plan',
        fields: [
          { key: 'planType', label: 'Type', cell: 'badge' },
          { key: 'ownerId', label: 'Owner', cell: 'user' },
          { key: 'currentVersionNumber', label: 'Current Version' },
          { key: 'nextReviewDueDate', label: 'Next Review Due', cell: 'date' },
        ],
      },
    ],
    workflowActions: [
      { id: 'RETIREMENT_APPROVAL', label: 'Propose Retirement', fromStatuses: ['ACTIVE'], governed: true, pendingStatus: 'ACTIVE', targetStatus: 'RETIRED', rejectedStatus: 'ACTIVE', permission: 'CREATE', tone: 'outline', description: 'Continuity plan retirement approval' },
    ],
    relations: [
      {
        label: 'Versions', collection: 'continuityPlanVersions', module: 'BCP', entitySlug: 'plan-versions', foreignKey: 'planId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'versionNumber', label: 'Version' },
          { key: 'authorId', label: 'Author', cell: 'user' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Exercises', collection: 'continuityExercises', module: 'BCP', entitySlug: 'exercises', foreignKey: 'planId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Exercise' },
          { key: 'exerciseDate', label: 'Date', cell: 'date' }, { key: 'outcome', label: 'Outcome', cell: 'status' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
    ],
    hasEvidence: true,
  },
  {
    module: 'BCP',
    slug: 'plan-versions',
    labelSingular: 'Plan Version',
    labelPlural: 'Continuity Plan Versions',
    collection: 'continuityPlanVersions',
    codePrefix: 'CPV',
    titleField: 'changeSummary',
    description: 'Version history of continuity plan content, requiring maker-checker approval before becoming current.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'versionNumber', label: 'Version' },
      { key: 'authorId', label: 'Author', cell: 'user' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [{ key: 'status', label: 'Statuses' }],
    formFields: [
      { key: 'planId', label: 'Continuity Plan', type: 'reference', refCollection: 'continuityPlans', refModule: 'BCP', refEntity: 'plans', required: true },
      { key: 'versionNumber', label: 'Version Number', type: 'text', required: true },
      { key: 'authorId', label: 'Author', type: 'user', required: true },
      { key: 'changeSummary', label: 'Change Summary', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      { title: 'Version', fields: [{ key: 'versionNumber', label: 'Number' }, { key: 'authorId', label: 'Author', cell: 'user' }, { key: 'changeSummary', label: 'Change Summary' }] },
    ],
    workflowActions: [
      { id: 'PUBLICATION_APPROVAL', label: 'Submit for Approval', fromStatuses: ['DRAFT'], governed: true, pendingStatus: 'SUBMITTED', targetStatus: 'PUBLISHED', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Continuity plan version approval' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'BCP',
    slug: 'exercises',
    labelSingular: 'Continuity Exercise',
    labelPlural: 'Continuity Exercises',
    collection: 'continuityExercises',
    codePrefix: 'CEX1',
    titleField: 'title',
    description: 'Tabletop, walkthrough or full-failover exercises validating continuity plans against recovery objectives.',
    initialStatus: 'PLANNED',
    editableStatuses: ['PLANNED'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Exercise' },
      { key: 'exerciseType', label: 'Type', cell: 'badge', tone: 'secondary' },
      { key: 'exerciseDate', label: 'Date', cell: 'date' },
      { key: 'outcome', label: 'Outcome', cell: 'status' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'exerciseType', label: 'Types', options: ['TABLETOP', 'WALKTHROUGH', 'FULL_FAILOVER'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'planId', label: 'Continuity Plan', type: 'reference', refCollection: 'continuityPlans', refModule: 'BCP', refEntity: 'plans', required: true },
      { key: 'exerciseType', label: 'Type', type: 'select', required: true, options: ['TABLETOP', 'WALKTHROUGH', 'FULL_FAILOVER'] },
      { key: 'exerciseDate', label: 'Exercise Date', type: 'date', required: true },
      { key: 'facilitatorId', label: 'Facilitator', type: 'user', required: true },
      { key: 'targetRtoHours', label: 'Target RTO (hrs)', type: 'number', min: 0 },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    detailSections: [
      {
        title: 'Exercise',
        fields: [
          { key: 'exerciseType', label: 'Type', cell: 'badge' },
          { key: 'exerciseDate', label: 'Date', cell: 'date' },
          { key: 'facilitatorId', label: 'Facilitator', cell: 'user' },
        ],
      },
      {
        title: 'Result',
        fields: [
          { key: 'targetRtoHours', label: 'Target RTO (hrs)', cell: 'number' },
          { key: 'actualRtoHours', label: 'Actual RTO (hrs)', cell: 'number' },
          { key: 'outcome', label: 'Outcome', cell: 'status' },
          { key: 'notes', label: 'Notes' },
        ],
      },
    ],
    workflowActions: [
      { id: 'COMPLETE_PASS', label: 'Record Completion — Passed', fromStatuses: ['PLANNED'], governed: false, targetStatus: 'COMPLETED', permission: 'CREATE', set: { outcome: 'PASSED' }, description: 'Exercise completed within target' },
      { id: 'COMPLETE_PARTIAL', label: 'Record Completion — Partial', fromStatuses: ['PLANNED'], governed: false, targetStatus: 'COMPLETED', permission: 'CREATE', tone: 'outline', set: { outcome: 'PARTIAL' }, description: 'Exercise completed with gaps' },
      { id: 'COMPLETE_FAILED', label: 'Record Completion — Failed', fromStatuses: ['PLANNED'], governed: false, targetStatus: 'COMPLETED', permission: 'CREATE', tone: 'destructive', set: { outcome: 'FAILED' }, description: 'Exercise failed to meet objectives (auto-creates exception)' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'BCP',
    slug: 'exceptions',
    labelSingular: 'Continuity Exception',
    labelPlural: 'Continuity Exceptions',
    collection: 'continuityExceptions',
    codePrefix: 'CXC',
    titleField: 'title',
    description: 'Raised immediately (including auto-creation from a FAILED exercise); closure and risk-acceptance are governed.',
    initialStatus: 'OPEN',
    editableStatuses: ['OPEN'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Exception' },
      { key: 'category', label: 'Category', cell: 'badge', tone: 'secondary' },
      { key: 'severity', label: 'Severity', cell: 'severity' },
      { key: 'targetCloseDate', label: 'Target Close', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'severity', label: 'Severities', options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'planId', label: 'Continuity Plan', type: 'reference', refCollection: 'continuityPlans', refModule: 'BCP', refEntity: 'plans', required: true },
      { key: 'category', label: 'Category', type: 'select', required: true, options: ['TEST_FAILURE', 'PLAN_GAP', 'RESOURCE_GAP', 'OTHER'] },
      { key: 'severity', label: 'Severity', type: 'select', required: true, options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
      { key: 'raisedDate', label: 'Raised Date', type: 'date', required: true },
      { key: 'ownerId', label: 'Owner', type: 'user', required: true },
      { key: 'targetCloseDate', label: 'Target Close Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'remediationPlan', label: 'Remediation Plan', type: 'textarea', full: true },
    ],
    detailSections: [
      {
        title: 'Exception',
        fields: [
          { key: 'category', label: 'Category', cell: 'badge' },
          { key: 'severity', label: 'Severity', cell: 'severity' },
          { key: 'raisedDate', label: 'Raised', cell: 'date' },
          { key: 'ownerId', label: 'Owner', cell: 'user' },
          { key: 'targetCloseDate', label: 'Target Close', cell: 'date' },
          { key: 'remediationPlan', label: 'Remediation Plan' },
        ],
      },
    ],
    workflowActions: [
      { id: 'START_REMEDIATION', label: 'Start Remediation', fromStatuses: ['OPEN'], governed: false, targetStatus: 'REMEDIATION_IN_PROGRESS', permission: 'CREATE', tone: 'outline', description: 'Remediation plan actioned' },
      { id: 'SUBMIT_VERIFICATION', label: 'Submit for Verification', fromStatuses: ['REMEDIATION_IN_PROGRESS'], governed: false, targetStatus: 'PENDING_VERIFICATION', permission: 'CREATE', tone: 'outline', description: 'Remediation complete, awaiting sign-off' },
      { id: 'CLOSURE_APPROVAL', label: 'Propose Closure', fromStatuses: ['PENDING_VERIFICATION'], governed: true, pendingStatus: 'PENDING_VERIFICATION', targetStatus: 'CLOSED', rejectedStatus: 'REMEDIATION_IN_PROGRESS', permission: 'CREATE', description: 'Exception closure approval' },
      { id: 'RISK_ACCEPTANCE', label: 'Propose Risk Acceptance', fromStatuses: ['OPEN', 'PENDING_VERIFICATION'], governed: true, pendingStatus: 'PENDING_VERIFICATION', targetStatus: 'RISK_ACCEPTED', rejectedStatus: 'OPEN', permission: 'CREATE', tone: 'outline', description: 'Exception risk-acceptance disposition approval' },
    ],
    relations: [],
    hasEvidence: true,
  },
];
