/**
 * CONTROLS module entity configuration — grounded in
 * docs/12-controls/01-controls-management.md (control lifecycle, 12-family
 * SEBI_AMC taxonomy, DESIGN/OPERATING testing, immediate-raise/governed-closure
 * exception pattern).
 */
import type { EntityConfig } from '../lib/registry';

export const CONTROL_FAMILIES = [
  'IT Governance', 'Information Security', 'Access Management', 'Change Management',
  'Incident Management', 'Backup & Recovery', 'Job Processing',
  'Business Continuity & Disaster Recovery', 'Financial Reporting & Fund Accounting',
  'Operations & Reconciliation', 'Distribution & Marketing', 'Third-Party/Outsourcing Oversight',
];

const EFFECTIVENESS = ['EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'NOT_ASSESSED'];

export const controlsEntities: EntityConfig[] = [
  {
    module: 'CONTROLS',
    slug: 'controls',
    labelSingular: 'Control',
    labelPlural: 'Control Library',
    collection: 'controls',
    codePrefix: 'CTL',
    titleField: 'name',
    description: 'The internal control library — classified by family, nature and execution type, with design and operating effectiveness from governed testing.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    statusTones: { UNDER_REVIEW: 'warning' },
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'name', label: 'Control' },
      { key: 'family', label: 'Family', cell: 'badge', tone: 'secondary' },
      { key: 'controlNature', label: 'Nature', cell: 'badge' },
      { key: 'operatingEffectiveness', label: 'Operating Eff.', cell: 'badge' },
      { key: 'nextTestDueDate', label: 'Next Test Due', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'family', label: 'Families', options: CONTROL_FAMILIES },
      { key: 'controlNature', label: 'Natures', options: ['PREVENTIVE', 'DETECTIVE', 'CORRECTIVE'] },
      { key: 'operatingEffectiveness', label: 'Effectiveness', options: EFFECTIVENESS },
    ],
    formFields: [
      { key: 'name', label: 'Control Name', type: 'text', required: true, full: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'family', label: 'Control Family', type: 'select', required: true, options: CONTROL_FAMILIES },
      { key: 'subFamily', label: 'Sub-family', type: 'text' },
      { key: 'controlNature', label: 'Nature', type: 'select', required: true, options: ['PREVENTIVE', 'DETECTIVE', 'CORRECTIVE'] },
      { key: 'executionType', label: 'Execution Type', type: 'select', required: true, options: ['MANUAL', 'AUTOMATED', 'IT_DEPENDENT_MANUAL'] },
      { key: 'frequency', label: 'Frequency', type: 'select', required: true, options: ['CONTINUOUS', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'EVENT_DRIVEN'] },
      { key: 'ownerId', label: 'Control Owner', type: 'user', required: true },
      { key: 'departmentId', label: 'Department', type: 'department', required: true },
      { key: 'nextTestDueDate', label: 'Next Test Due', type: 'date' },
    ],
    detailSections: [
      {
        title: 'Classification',
        fields: [
          { key: 'family', label: 'Family', cell: 'badge' },
          { key: 'subFamily', label: 'Sub-family' },
          { key: 'controlNature', label: 'Nature', cell: 'badge' },
          { key: 'executionType', label: 'Execution', cell: 'badge' },
          { key: 'frequency', label: 'Frequency', cell: 'badge' },
          { key: 'ownerId', label: 'Owner', cell: 'user' },
        ],
      },
      {
        title: 'Effectiveness & Testing',
        fields: [
          { key: 'designEffectiveness', label: 'Design Effectiveness', cell: 'badge' },
          { key: 'operatingEffectiveness', label: 'Operating Effectiveness', cell: 'badge' },
          { key: 'lastTestedDate', label: 'Last Tested', cell: 'date' },
          { key: 'nextTestDueDate', label: 'Next Test Due', cell: 'date' },
        ],
      },
    ],
    workflowActions: [
      { id: 'DESIGN_TEST_APPROVAL', label: 'Submit Design Test for Approval', fromStatuses: ['DRAFT', 'SUBMITTED'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'ACTIVE', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Control design test approval (activates the control)' },
      { id: 'REREVIEW', label: 'Submit Re-review', fromStatuses: ['ACTIVE'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'ACTIVE', rejectedStatus: 'ACTIVE', permission: 'CREATE', description: 'Periodic control design re-review approval' },
      { id: 'RETIREMENT_APPROVAL', label: 'Propose Retirement', fromStatuses: ['ACTIVE'], governed: true, pendingStatus: 'UNDER_REVIEW', targetStatus: 'RETIRED', rejectedStatus: 'ACTIVE', permission: 'CREATE', tone: 'outline', description: 'Control retirement approval' },
    ],
    relations: [
      {
        label: 'Control Tests', collection: 'controlTests', module: 'CONTROLS', entitySlug: 'tests', foreignKey: 'controlId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Test' },
          { key: 'testType', label: 'Type', cell: 'badge' }, { key: 'result', label: 'Result', cell: 'status' },
          { key: 'testDate', label: 'Date', cell: 'date' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Exceptions', collection: 'controlExceptions', module: 'CONTROLS', entitySlug: 'exceptions', foreignKey: 'controlId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Exception' },
          { key: 'severity', label: 'Severity', cell: 'severity' }, { key: 'targetCloseDate', label: 'Target Close', cell: 'date' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Mitigated Risks', collection: 'risks', module: 'RISK', entitySlug: 'risks', localKey: 'linkedRiskIds',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Risk' },
          { key: 'residualScore', label: 'Residual', cell: 'score' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Linked Obligations', collection: 'obligations', module: 'COMPLIANCE', entitySlug: 'obligations', localKey: 'linkedObligationIds',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Obligation' },
          { key: 'complianceStatus', label: 'Compliance', cell: 'status' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
    ],
    hasEvidence: true,
  },
  {
    module: 'CONTROLS',
    slug: 'tests',
    labelSingular: 'Control Test',
    labelPlural: 'Control Tests',
    collection: 'controlTests',
    codePrefix: 'CTT',
    titleField: 'title',
    description: 'Design and operating effectiveness tests — append-only once approved, mirroring the risk assessment pattern.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Test' },
      { key: 'testType', label: 'Type', cell: 'badge' },
      { key: 'result', label: 'Result', cell: 'status' },
      { key: 'testerId', label: 'Tester', cell: 'user' },
      { key: 'testDate', label: 'Date', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'testType', label: 'Types', options: ['DESIGN', 'OPERATING'] },
      { key: 'result', label: 'Results', options: ['PASS', 'FAIL', 'PARTIAL'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'controlId', label: 'Control', type: 'reference', refCollection: 'controls', refModule: 'CONTROLS', refEntity: 'controls', required: true },
      { key: 'testType', label: 'Test Type', type: 'select', required: true, options: ['DESIGN', 'OPERATING'] },
      { key: 'testDate', label: 'Test Date', type: 'date', required: true },
      { key: 'testerId', label: 'Tester', type: 'user', required: true },
      { key: 'sampleSize', label: 'Sample Size', type: 'number', min: 0 },
      { key: 'populationSize', label: 'Population Size', type: 'number', min: 0 },
      { key: 'result', label: 'Result', type: 'select', required: true, options: ['PASS', 'FAIL', 'PARTIAL'] },
      { key: 'notes', label: 'Notes', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      {
        title: 'Test Details',
        fields: [
          { key: 'testType', label: 'Type', cell: 'badge' },
          { key: 'testDate', label: 'Date', cell: 'date' },
          { key: 'testerId', label: 'Tester', cell: 'user' },
          { key: 'sampleSize', label: 'Sample Size', cell: 'number' },
          { key: 'populationSize', label: 'Population', cell: 'number' },
          { key: 'result', label: 'Result', cell: 'status' },
          { key: 'notes', label: 'Notes' },
        ],
      },
    ],
    workflowActions: [
      { id: 'TEST_APPROVAL', label: 'Submit for Approval', fromStatuses: ['DRAFT'], governed: true, pendingStatus: 'SUBMITTED', targetStatus: 'APPROVED', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Control test approval' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'CONTROLS',
    slug: 'exceptions',
    labelSingular: 'Control Exception',
    labelPlural: 'Control Exceptions',
    collection: 'controlExceptions',
    codePrefix: 'CEX',
    titleField: 'title',
    description: 'Raised immediately without approval; closure and risk-acceptance dispositions are governed (immediate-raise, governed-closure pattern).',
    initialStatus: 'OPEN',
    editableStatuses: ['OPEN'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Exception' },
      { key: 'category', label: 'Category', cell: 'badge', tone: 'secondary' },
      { key: 'severity', label: 'Severity', cell: 'severity' },
      { key: 'ownerId', label: 'Owner', cell: 'user' },
      { key: 'targetCloseDate', label: 'Target Close', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'severity', label: 'Severities', options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
      { key: 'category', label: 'Categories', options: ['TEST_FAILURE', 'CONTROL_OVERRIDE', 'COMPENSATING_CONTROL_ACTIVATED', 'CONTROL_NOT_OPERATING', 'OTHER'] },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'controlId', label: 'Control', type: 'reference', refCollection: 'controls', refModule: 'CONTROLS', refEntity: 'controls', required: true },
      { key: 'category', label: 'Category', type: 'select', required: true, options: ['TEST_FAILURE', 'CONTROL_OVERRIDE', 'COMPENSATING_CONTROL_ACTIVATED', 'CONTROL_NOT_OPERATING', 'OTHER'] },
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
