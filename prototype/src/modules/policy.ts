/**
 * POLICY module entity configuration — grounded in
 * docs/23-policy/01-policy-management.md (Policy/Standard/Procedure/Guideline
 * discriminated lifecycle, versioned publication, periodic review,
 * acknowledgement campaigns, immediate-raise/governed-closure exceptions).
 */
import type { EntityConfig } from '../lib/registry';

export const POLICY_TYPES = ['POLICY', 'STANDARD', 'PROCEDURE', 'GUIDELINE'];

export const policyEntities: EntityConfig[] = [
  {
    module: 'POLICY',
    slug: 'policies',
    labelSingular: 'Policy',
    labelPlural: 'Policies',
    collection: 'policies',
    codePrefix: 'POL',
    titleField: 'title',
    description: 'Governed policy documents — Policy, Standard, Procedure or Guideline — with versioned publication and acknowledgement tracking.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Title' },
      { key: 'policyType', label: 'Type', cell: 'badge', tone: 'secondary' },
      { key: 'currentVersion', label: 'Version' },
      { key: 'acknowledgementRate', label: 'Ack. Rate %', cell: 'number' },
      { key: 'nextReviewDue', label: 'Next Review', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'status', label: 'Statuses' },
      { key: 'policyType', label: 'Types', options: POLICY_TYPES },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'policyType', label: 'Type', type: 'select', required: true, options: POLICY_TYPES },
      { key: 'ownerId', label: 'Policy Owner', type: 'user', required: true },
      { key: 'departmentId', label: 'Department', type: 'department', required: true },
      { key: 'nextReviewDue', label: 'Next Review Due', type: 'date' },
    ],
    detailSections: [
      {
        title: 'Policy',
        fields: [
          { key: 'policyType', label: 'Type', cell: 'badge' },
          { key: 'ownerId', label: 'Owner', cell: 'user' },
          { key: 'departmentId', label: 'Department', cell: 'department' },
          { key: 'currentVersion', label: 'Current Version' },
        ],
      },
      {
        title: 'Lifecycle',
        fields: [
          { key: 'effectiveDate', label: 'Effective Date', cell: 'date' },
          { key: 'nextReviewDue', label: 'Next Review Due', cell: 'date' },
          { key: 'acknowledgementRate', label: 'Acknowledgement Rate (%)', cell: 'number' },
        ],
      },
    ],
    workflowActions: [
      { id: 'VERSION_PUBLICATION_APPROVAL', label: 'Submit Version for Publication', fromStatuses: ['DRAFT'], governed: true, pendingStatus: 'DRAFT', targetStatus: 'ACTIVE', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Policy version publication approval' },
      { id: 'RETIREMENT_APPROVAL', label: 'Propose Retirement', fromStatuses: ['ACTIVE'], governed: true, pendingStatus: 'ACTIVE', targetStatus: 'RETIRED', rejectedStatus: 'ACTIVE', permission: 'CREATE', tone: 'outline', description: 'Policy retirement approval' },
    ],
    relations: [
      {
        label: 'Versions', collection: 'policyVersions', module: 'POLICY', entitySlug: 'versions', foreignKey: 'policyId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'versionNumber', label: 'Version' },
          { key: 'authorId', label: 'Author', cell: 'user' }, { key: 'publishedDate', label: 'Published', cell: 'date' },
          { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Reviews', collection: 'policyReviews', module: 'POLICY', entitySlug: 'reviews', foreignKey: 'policyId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'reviewDate', label: 'Date', cell: 'date' },
          { key: 'outcome', label: 'Outcome', cell: 'badge' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Acknowledgement Campaigns', collection: 'policyAcknowledgements', module: 'POLICY', entitySlug: 'acknowledgements', foreignKey: 'policyId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Campaign' },
          { key: 'completionRate', label: 'Completion %', cell: 'number' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
      {
        label: 'Exceptions', collection: 'policyExceptions', module: 'POLICY', entitySlug: 'exceptions', foreignKey: 'policyId',
        columns: [
          { key: 'code', label: 'Code', cell: 'code' }, { key: 'title', label: 'Exception' },
          { key: 'severity', label: 'Severity', cell: 'severity' }, { key: 'status', label: 'Status', cell: 'status' },
        ],
      },
    ],
    hasEvidence: true,
  },
  {
    module: 'POLICY',
    slug: 'versions',
    labelSingular: 'Policy Version',
    labelPlural: 'Policy Versions',
    collection: 'policyVersions',
    codePrefix: 'PVR',
    titleField: 'title',
    description: 'Version history of policy content — published versions become the policy’s current, active version.',
    initialStatus: 'DRAFT',
    editableStatuses: ['DRAFT'],
    statusTones: { PV_APPROVED_PUBLISHED: 'success', PUBLISHED: 'success' },
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Version' },
      { key: 'versionNumber', label: 'Number' },
      { key: 'authorId', label: 'Author', cell: 'user' },
      { key: 'publishedDate', label: 'Published', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [{ key: 'status', label: 'Statuses' }],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'policyId', label: 'Policy', type: 'reference', refCollection: 'policies', refModule: 'POLICY', refEntity: 'policies', required: true },
      { key: 'versionNumber', label: 'Version Number', type: 'text', required: true },
      { key: 'authorId', label: 'Author', type: 'user', required: true },
      { key: 'changeSummary', label: 'Change Summary', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      {
        title: 'Version',
        fields: [
          { key: 'versionNumber', label: 'Number' },
          { key: 'authorId', label: 'Author', cell: 'user' },
          { key: 'publishedDate', label: 'Published', cell: 'date' },
          { key: 'changeSummary', label: 'Change Summary' },
        ],
      },
    ],
    workflowActions: [
      { id: 'PUBLICATION_APPROVAL', label: 'Submit for Publication', fromStatuses: ['DRAFT'], governed: true, pendingStatus: 'SUBMITTED', targetStatus: 'PUBLISHED', rejectedStatus: 'DRAFT', permission: 'CREATE', description: 'Policy version publication approval' },
    ],
    relations: [],
    hasEvidence: true,
  },
  {
    module: 'POLICY',
    slug: 'reviews',
    labelSingular: 'Policy Review',
    labelPlural: 'Policy Reviews',
    collection: 'policyReviews',
    codePrefix: 'PRV',
    titleField: 'title',
    description: 'Periodic reviews confirming a policy is reaffirmed, revised, or retired.',
    initialStatus: 'SUBMITTED',
    editableStatuses: ['SUBMITTED'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Review' },
      { key: 'reviewerId', label: 'Reviewer', cell: 'user' },
      { key: 'reviewDate', label: 'Date', cell: 'date' },
      { key: 'outcome', label: 'Outcome', cell: 'badge' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [{ key: 'outcome', label: 'Outcomes', options: ['REAFFIRMED', 'REVISED', 'RETIRE_RECOMMENDED'] }],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'policyId', label: 'Policy', type: 'reference', refCollection: 'policies', refModule: 'POLICY', refEntity: 'policies', required: true },
      { key: 'reviewerId', label: 'Reviewer', type: 'user', required: true },
      { key: 'reviewDate', label: 'Review Date', type: 'date', required: true },
      { key: 'outcome', label: 'Outcome', type: 'select', required: true, options: ['REAFFIRMED', 'REVISED', 'RETIRE_RECOMMENDED'] },
      { key: 'notes', label: 'Notes', type: 'textarea', required: true, full: true },
    ],
    detailSections: [
      {
        title: 'Review',
        fields: [
          { key: 'reviewerId', label: 'Reviewer', cell: 'user' },
          { key: 'reviewDate', label: 'Date', cell: 'date' },
          { key: 'outcome', label: 'Outcome', cell: 'badge' },
          { key: 'notes', label: 'Notes' },
        ],
      },
    ],
    workflowActions: [
      { id: 'REVIEW_APPROVAL', label: 'Submit for Approval', fromStatuses: ['SUBMITTED'], governed: true, pendingStatus: 'SUBMITTED', targetStatus: 'APPROVED', rejectedStatus: 'REJECTED', permission: 'CREATE', description: 'Policy review approval' },
    ],
    relations: [],
    hasEvidence: false,
  },
  {
    module: 'POLICY',
    slug: 'acknowledgements',
    labelSingular: 'Acknowledgement Campaign',
    labelPlural: 'Acknowledgement Campaigns',
    collection: 'policyAcknowledgements',
    codePrefix: 'PAK',
    titleField: 'title',
    description: 'Tenant-wide or targeted-audience read-and-acknowledge campaigns for a published policy version.',
    initialStatus: 'IN_PROGRESS',
    editableStatuses: ['IN_PROGRESS'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'title', label: 'Campaign' },
      { key: 'targetAudience', label: 'Audience' },
      { key: 'completionRate', label: 'Completion %', cell: 'number' },
      { key: 'campaignEnd', label: 'Ends', cell: 'date' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [{ key: 'status', label: 'Statuses' }],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'policyId', label: 'Policy', type: 'reference', refCollection: 'policies', refModule: 'POLICY', refEntity: 'policies', required: true },
      { key: 'targetAudience', label: 'Target Audience', type: 'text', required: true },
      { key: 'campaignStart', label: 'Campaign Start', type: 'date', required: true },
      { key: 'campaignEnd', label: 'Campaign End', type: 'date', required: true },
    ],
    detailSections: [
      {
        title: 'Campaign',
        fields: [
          { key: 'targetAudience', label: 'Audience' },
          { key: 'campaignStart', label: 'Start', cell: 'date' },
          { key: 'campaignEnd', label: 'End', cell: 'date' },
          { key: 'completionRate', label: 'Completion Rate (%)', cell: 'number' },
        ],
      },
    ],
    workflowActions: [
      { id: 'COMPLETE', label: 'Mark Completed', fromStatuses: ['IN_PROGRESS'], governed: false, targetStatus: 'COMPLETED', permission: 'CREATE', description: 'Acknowledgement campaign completed' },
    ],
    relations: [],
    hasEvidence: false,
  },
  {
    module: 'POLICY',
    slug: 'exceptions',
    labelSingular: 'Policy Exception',
    labelPlural: 'Policy Exceptions',
    collection: 'policyExceptions',
    codePrefix: 'PEX',
    titleField: 'title',
    description: 'Deviations from policy raised immediately; closure and risk-acceptance dispositions are governed.',
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
      { key: 'policyId', label: 'Policy', type: 'reference', refCollection: 'policies', refModule: 'POLICY', refEntity: 'policies', required: true },
      { key: 'category', label: 'Category', type: 'select', required: true, options: ['TEST_FAILURE', 'CONTROL_OVERRIDE', 'POLICY_GAP', 'OTHER'] },
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
