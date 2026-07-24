/**
 * RISK module entity configuration — grounded in
 * docs/10-risk/01-enterprise-risk-management.md (lifecycle states, SEBI_AMC
 * taxonomy, governed action types, permissions).
 */
import type { EntityConfig } from '../lib/registry';

export const RISK_CATEGORIES = [
  'FUND_MANAGEMENT', 'OPERATIONS', 'CUSTOMER_SERVICE', 'MARKETING_DISTRIBUTION', 'OTHER_BUSINESS',
];

const riskColumns = [
  { key: 'code', label: 'Code', cell: 'code' as const },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category', cell: 'badge' as const, tone: 'secondary' as const },
  { key: 'inherentScore', label: 'Inherent', cell: 'score' as const },
  { key: 'residualScore', label: 'Residual', cell: 'score' as const },
  { key: 'ownerId', label: 'Owner', cell: 'user' as const },
  { key: 'nextReviewDate', label: 'Next Review', cell: 'date' as const },
  { key: 'status', label: 'Status', cell: 'status' as const },
];

export const riskEntities: EntityConfig[] = [
  {
    module: 'RISK',
    slug: 'risks',
    labelSingular: 'Risk',
    labelPlural: 'Risk Register',
    collection: 'risks',
    codePrefix: 'RSK',
    titleField: 'title',
    description: 'Identified sources of uncertainty to the AMC’s objectives, with inherent and residual scoring against the SEBI_AMC taxonomy.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: riskColumns,
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'category', label: 'Categories', options: RISK_CATEGORIES },
      { key: 'source', label: 'Sources' },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'category', label: 'Category', type: 'select', required: true, options: RISK_CATEGORIES },
      { key: 'subcategory', label: 'Sub-category', type: 'text' },
      { key: 'ownerId', label: 'Risk Owner', type: 'user', required: true },
      { key: 'departmentId', label: 'Department', type: 'department', required: true },
      { key: 'source', label: 'Source', type: 'select', required: true, options: ['MANUAL', 'AUDIT_FINDING', 'INCIDENT', 'CONTROL_TEST', 'KRI_BREACH', 'COMPLIANCE_OBLIGATION', 'SECURITY_FINDING', 'THIRD_PARTY', 'BUSINESS_CONTINUITY'] },
      { key: 'identifiedDate', label: 'Identified Date', type: 'date', required: true },
      { key: 'inherentLikelihood', label: 'Inherent Likelihood (1–5)', type: 'number', min: 1, max: 5, required: true },
      { key: 'inherentImpact', label: 'Inherent Impact (1–5)', type: 'number', min: 1, max: 5, required: true },
      { key: 'residualLikelihood', label: 'Residual Likelihood (1–5)', type: 'number', min: 1, max: 5 },
      { key: 'residualImpact', label: 'Residual Impact (1–5)', type: 'number', min: 1, max: 5 },
      { key: 'nextReviewDate', label: 'Next Review Date', type: 'date' },
    ],
    detailSections: [
      {
        title: 'Classification',
        fields: [
          { key: 'category', label: 'Category', cell: 'badge' },
          { key: 'subcategory', label: 'Sub-category' },
          { key: 'source', label: 'Source', cell: 'badge' },
          { key: 'ownerId', label: 'Risk Owner', cell: 'user' },
          { key: 'departmentId', label: 'Department', cell: 'department' },
        ],
      },
      {
        title: 'Scoring & Review',
        fields: [
          { key: 'inherentScore', label: 'Inherent Score', cell: 'score' },
          { key: 'residualScore', label: 'Residual Score', cell: 'score' },
          { key: 'identifiedDate', label: 'Identified', cell: 'date' },
          { key: 'lastAssessedDate', label: 'Last Assessed', cell: 'date' },
          { key: 'nextReviewDate', label: 'Next Review Due', cell: 'date' },
        ],
      },
    ],
    workflowActions: [
      { id: 'ASSESSMENT_APPROVAL', label: 'Submit for Assessment Approval', fromStatuses: ['DRAFT', 'SUBMITTED'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'ACTIVE', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Risk assessment approval' },
      { id: 'REASSESSMENT', label: 'Submit Re-assessment', fromStatuses: ['ACTIVE', 'ESCALATED'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'ACTIVE', rejectedStatus: 'ACTIVE', permission: 'CREATE', description: 'Periodic risk re-assessment approval' },
      { id: 'ESCALATE', label: 'Escalate', fromStatuses: ['ACTIVE'], governed: false, targetStatus: 'ESCALATED', permission: 'CREATE', tone: 'outline', description: 'Manual escalation to the independent risk function' },
      { id: 'ESCALATION_ACK', label: 'Acknowledge Escalation', fromStatuses: ['ESCALATED'], governed: false, targetStatus: 'ACTIVE', permission: 'APPROVE', tone: 'outline', description: 'Escalation acknowledged and resolved' },
      { id: 'ACCEPTANCE_APPROVAL', label: 'Propose Risk Acceptance', fromStatuses: ['ACTIVE', 'ESCALATED'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'ACCEPTED', rejectedStatus: 'ACTIVE', permission: 'CREATE', description: 'Formal risk acceptance approval' },
      { id: 'RETIREMENT_APPROVAL', label: 'Propose Retirement', fromStatuses: ['ACTIVE', 'ACCEPTED'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'RETIRED', rejectedStatus: 'ACTIVE', permission: 'CREATE', tone: 'outline', description: 'Risk retirement approval' },
    ],
    relations: [
      {
        label: 'Assessment History', collection: 'riskAssessments', module: 'RISK', entitySlug: 'assessments', foreignKey: 'riskId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'assessmentDate', label: 'Date', cell: 'date' },
          { key: 'assessorId', label: 'Assessor', cell: 'user' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Treatment Plans', collection: 'treatmentPlans', module: 'RISK', entitySlug: 'treatment-plans', foreignKey: 'riskId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Title' },
          { key: 'strategy', label: 'Strategy', cell: 'badge' }, { key: 'dueDate', label: 'Due', cell: 'date' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Risk Acceptances', collection: 'riskAcceptances', module: 'RISK', entitySlug: 'acceptances', foreignKey: 'riskId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'reviewDueDate', label: 'Review Due', cell: 'date' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Escalations', collection: 'escalations', module: 'RISK', entitySlug: 'escalations', foreignKey: 'riskId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'triggerType', label: 'Trigger', cell: 'badge' },
          { key: 'triggeredAt', label: 'Raised', cell: 'date' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Linked Controls', collection: 'controls', module: 'CONTROLS', entitySlug: 'controls', localKey: 'linkedControlIds',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'name', label: 'Control' },
          { key: 'controlNature', label: 'Nature', cell: 'badge' }, { key: 'operatingEffectiveness', label: 'Operating Eff.', cell: 'badge' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Key Risk Indicators', collection: 'kris', module: 'RISK', entitySlug: 'kris', foreignKey: 'linkedRiskId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'name', label: 'KRI' },
          { key: 'currentBand', label: 'Band', cell: 'severity' }, { key: 'measurementFrequency', label: 'Frequency', cell: 'badge' },
        ],
      },
    ],
    hasEvidence: true,
  },
  {
    module: 'RISK',
    slug: 'assessments',
    labelSingular: 'Risk Assessment',
    labelPlural: 'Risk Assessments',
    collection: 'riskAssessments',
    codePrefix: 'RAS',
    titleField: 'title',
    description: 'Point-in-time inherent/residual scoring events, append-only once approved.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Title' },
      { key: 'assessmentDate', label: 'Date', cell: 'date' },
      { key: 'assessorId', label: 'Assessor', cell: 'user' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [{ key: 'status', label: 'Statuses' }],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'riskId', label: 'Risk', type: 'reference', refCollection: 'risks', refModule: 'RISK', refEntity: 'risks', required: true },
      { key: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
      { key: 'assessorId', label: 'Assessor', type: 'user', required: true },
      { key: 'inherentLikelihood', label: 'Inherent Likelihood (1–5)', type: 'number', min: 1, max: 5, required: true },
      { key: 'inherentImpact', label: 'Inherent Impact (1–5)', type: 'number', min: 1, max: 5, required: true },
      { key: 'residualLikelihood', label: 'Residual Likelihood (1–5)', type: 'number', min: 1, max: 5, required: true },
      { key: 'residualImpact', label: 'Residual Impact (1–5)', type: 'number', min: 1, max: 5, required: true },
      { key: 'rationale', label: 'Rationale', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      {
        title: 'Assessment',
        fields: [
          { key: 'assessmentDate', label: 'Date', cell: 'date' },
          { key: 'assessorId', label: 'Assessor', cell: 'user' },
          { key: 'inherentLikelihood', label: 'Inherent Likelihood' },
          { key: 'inherentImpact', label: 'Inherent Impact' },
          { key: 'residualLikelihood', label: 'Residual Likelihood' },
          { key: 'residualImpact', label: 'Residual Impact' },
          { key: 'rationale', label: 'Rationale' },
        ],
      },
    ],
    workflowActions: [
      { id: 'ASSESSMENT_APPROVAL', label: 'Submit for Approval', fromStatuses: ['DRAFT'], governed: true, pendingStatus: 'SUBMITTED', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Risk assessment approval' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'RISK',
    slug: 'treatment-plans',
    labelSingular: 'Treatment Plan',
    labelPlural: 'Treatment Plans',
    collection: 'treatmentPlans',
    codePrefix: 'TRT',
    titleField: 'title',
    description: 'Planned responses to risks — Accept, Mitigate, Transfer or Avoid — subject to governed approval.',
    initialStatus: 'PROPOSED',
    editableStatuses: ['PROPOSED'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Title' },
      { key: 'strategy', label: 'Strategy', cell: 'badge' },
      { key: 'ownerId', label: 'Owner', cell: 'user' },
      { key: 'dueDate', label: 'Due', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'strategy', label: 'Strategies', options: ['ACCEPT', 'MITIGATE', 'TRANSFER', 'AVOID'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'riskId', label: 'Risk', type: 'reference', refCollection: 'risks', refModule: 'RISK', refEntity: 'risks', required: true },
      { key: 'strategy', label: 'Strategy', type: 'select', required: true, options: ['ACCEPT', 'MITIGATE', 'TRANSFER', 'AVOID'] },
      { key: 'ownerId', label: 'Owner', type: 'user', required: true },
      { key: 'targetResidualScore', label: 'Target Residual Score', type: 'number', min: 1, max: 25 },
      { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      {
        title: 'Plan',
        fields: [
          { key: 'strategy', label: 'Strategy', cell: 'badge' },
          { key: 'ownerId', label: 'Owner', cell: 'user' },
          { key: 'targetResidualScore', label: 'Target Residual Score', cell: 'score' },
          { key: 'dueDate', label: 'Due Date', cell: 'date' },
        ],
      },
    ],
    workflowActions: [
      { id: 'TREATMENT_APPROVAL', label: 'Submit for Approval', fromStatuses: ['PROPOSED'], governed: true, pendingStatus: 'PROPOSED', targetStatus: 'APPROVED', rejectedStatus: 'PROPOSED', permission: 'CREATE', description: 'Risk treatment plan approval' },
      { id: 'START', label: 'Start Implementation', fromStatuses: ['APPROVED'], governed: false, targetStatus: 'IN_PROGRESS', permission: 'CREATE', tone: 'outline', description: 'Treatment implementation started' },
      { id: 'COMPLETE', label: 'Mark Completed', fromStatuses: ['IN_PROGRESS'], governed: false, targetStatus: 'COMPLETED', permission: 'CREATE', tone: 'outline', description: 'Treatment implementation completed' },
      { id: 'VERIFY', label: 'Verify Effectiveness', fromStatuses: ['COMPLETED'], governed: false, targetStatus: 'VERIFIED', permission: 'APPROVE', tone: 'outline', description: 'Treatment effectiveness verified by checker' },
      { id: 'CANCEL', label: 'Cancel', fromStatuses: ['PROPOSED', 'APPROVED', 'IN_PROGRESS'], governed: false, targetStatus: 'CANCELLED', permission: 'CREATE', tone: 'destructive', description: 'Treatment plan cancelled' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'RISK',
    slug: 'acceptances',
    labelSingular: 'Risk Acceptance',
    labelPlural: 'Risk Acceptances',
    collection: 'riskAcceptances',
    codePrefix: 'ACC',
    titleField: 'title',
    description: 'Formal, governed records that a risk’s residual level is knowingly accepted, with a mandatory re-review date.',
    initialStatus: 'PENDING',
    editableStatuses: ['PENDING'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Title' },
      { key: 'reviewDueDate', label: 'Review Due', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [{ key: 'status', label: 'Statuses' }],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'riskId', label: 'Risk', type: 'reference', refCollection: 'risks', refModule: 'RISK', refEntity: 'risks', required: true },
      { key: 'reviewDueDate', label: 'Review Due Date', type: 'date', required: true, help: 'Mandatory re-review date — acceptance expires if not re-reviewed.' },
      { key: 'justification', label: 'Justification', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      {
        title: 'Acceptance',
        fields: [
          { key: 'justification', label: 'Justification' },
          { key: 'reviewDueDate', label: 'Review Due', cell: 'date' },
        ],
      },
    ],
    workflowActions: [
      { id: 'ACCEPTANCE_APPROVAL', label: 'Submit for Approval', fromStatuses: ['PENDING'], governed: true, pendingStatus: 'PENDING', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', permission: 'CREATE', description: 'Risk acceptance approval' },
      { id: 'EXPIRE', label: 'Mark Expired', fromStatuses: ['APPROVED'], governed: false, targetStatus: 'EXPIRED', permission: 'APPROVE', tone: 'outline', description: 'Acceptance expired at review due date' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'RISK',
    slug: 'escalations',
    labelSingular: 'Escalation',
    labelPlural: 'Escalations',
    collection: 'escalations',
    codePrefix: 'ESC',
    titleField: 'title',
    description: 'Governed notifications raised on appetite breaches, KRI breaches, or manually — requiring acknowledgement by the independent risk function.',
    initialStatus: 'PENDING_ACK',
    editableStatuses: ['PENDING_ACK'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Title' },
      { key: 'triggerType', label: 'Trigger', cell: 'badge' },
      { key: 'triggeredAt', label: 'Raised', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'triggerType', label: 'Triggers', options: ['APPETITE_BREACH', 'KRI_BREACH', 'MANUAL'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'riskId', label: 'Risk', type: 'reference', refCollection: 'risks', refModule: 'RISK', refEntity: 'risks', required: true },
      { key: 'triggerType', label: 'Trigger Type', type: 'select', required: true, options: ['APPETITE_BREACH', 'KRI_BREACH', 'MANUAL'] },
      { key: 'triggeredAt', label: 'Triggered At', type: 'date', required: true },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    detailSections: [
      {
        title: 'Escalation',
        fields: [
          { key: 'triggerType', label: 'Trigger', cell: 'badge' },
          { key: 'triggeredAt', label: 'Raised', cell: 'date' },
          { key: 'escalatedToRole', label: 'Escalated To' },
          { key: 'notes', label: 'Notes' },
        ],
      },
    ],
    workflowActions: [
      { id: 'ESCALATION_ACK', label: 'Acknowledge', fromStatuses: ['PENDING_ACK'], governed: true, pendingStatus: 'PENDING_ACK', targetStatus: 'ACKNOWLEDGED', rejectedStatus: 'PENDING_ACK', permission: 'APPROVE', description: 'Escalation acknowledgement' },
      { id: 'RESOLVE', label: 'Resolve', fromStatuses: ['ACKNOWLEDGED'], governed: false, targetStatus: 'RESOLVED', permission: 'APPROVE', tone: 'outline', description: 'Escalation resolved' },
    ],
    relations: [],
    hasEvidence: false,
  },
  {
    module: 'RISK',
    slug: 'kris',
    labelSingular: 'KRI',
    labelPlural: 'Key Risk Indicators',
    collection: 'kris',
    codePrefix: 'KRI',
    titleField: 'name',
    description: 'Measurable early-warning metrics with green/amber/red thresholds, tracked as an append-only time series.',
    initialStatus: 'ACTIVE',
    editableStatuses: ['ACTIVE'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'name', label: 'KRI' },
      { key: 'currentBand', label: 'Band', cell: 'severity' },
      { key: 'measurementFrequency', label: 'Frequency', cell: 'badge' },
      { key: 'direction', label: 'Direction', cell: 'badge' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'currentBand', label: 'Bands', options: ['GREEN', 'AMBER', 'RED'] },
      { key: 'measurementFrequency', label: 'Frequencies' },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true, full: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'linkedRiskId', label: 'Linked Risk', type: 'reference', refCollection: 'risks', refModule: 'RISK', refEntity: 'risks' },
      { key: 'category', label: 'Category', type: 'select', options: RISK_CATEGORIES },
      { key: 'unit', label: 'Unit', type: 'text', required: true },
      { key: 'dataSource', label: 'Data Source', type: 'text', required: true },
      { key: 'measurementFrequency', label: 'Frequency', type: 'select', required: true, options: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'] },
      { key: 'direction', label: 'Direction', type: 'select', required: true, options: ['HIGHER_IS_WORSE', 'LOWER_IS_WORSE'] },
      { key: 'thresholdGreen', label: 'Green Threshold', type: 'number', required: true },
      { key: 'thresholdAmber', label: 'Amber Threshold', type: 'number', required: true },
      { key: 'thresholdRed', label: 'Red Threshold', type: 'number', required: true },
    ],
    detailSections: [
      {
        title: 'Definition',
        fields: [
          { key: 'unit', label: 'Unit' },
          { key: 'dataSource', label: 'Data Source' },
          { key: 'measurementFrequency', label: 'Frequency', cell: 'badge' },
          { key: 'direction', label: 'Direction', cell: 'badge' },
        ],
      },
      {
        title: 'Thresholds',
        fields: [
          { key: 'thresholdGreen', label: 'Green', cell: 'number' },
          { key: 'thresholdAmber', label: 'Amber', cell: 'number' },
          { key: 'thresholdRed', label: 'Red', cell: 'number' },
          { key: 'currentBand', label: 'Current Band', cell: 'severity' },
        ],
      },
    ],
    workflowActions: [
      { id: 'RETIRE', label: 'Retire KRI', fromStatuses: ['ACTIVE'], governed: false, targetStatus: 'RETIRED', permission: 'APPROVE', tone: 'outline', description: 'KRI definition retired' },
    ],
    relations: [],
    hasEvidence: false,
  },
];
