/**
 * ANALYTICS module entity configuration — grounded in
 * docs/15-analytics/01-analytics-management.md (KPI/metric catalogue,
 * threshold/banding, MetricView heat-maps/trends/drill-downs).
 */
import type { EntityConfig } from '../lib/registry';

export const analyticsEntities: EntityConfig[] = [
  {
    module: 'ANALYTICS',
    slug: 'metrics',
    labelSingular: 'Metric',
    labelPlural: 'KPI & Metric Catalogue',
    collection: 'metricDefinitions',
    codePrefix: 'MET',
    titleField: 'name',
    description: 'Enterprise KPI and metric catalogue with threshold banding, distinct from KRIs owned by RISK.',
    initialStatus: 'ACTIVE',
    editableStatuses: ['ACTIVE'],
    columns: [
      { key: 'code', label: 'Code', cell: 'code' },
      { key: 'name', label: 'Metric' },
      { key: 'metricCategory', label: 'Category', cell: 'badge', tone: 'secondary' },
      { key: 'currentValue', label: 'Current', cell: 'number' },
      { key: 'band', label: 'Band', cell: 'severity' },
      { key: 'status', label: 'Status', cell: 'status' },
    ],
    filters: [
      { key: 'metricCategory', label: 'Categories', options: ['RISK', 'CONTROLS', 'COMPLIANCE', 'AUDIT', 'SECURITY', 'POLICY', 'INCIDENT', 'TPR', 'BCP', 'CROSS_MODULE'] },
      { key: 'band', label: 'Bands', options: ['GREEN', 'AMBER', 'RED'] },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true, full: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { key: 'metricCategory', label: 'Category', type: 'select', required: true, options: ['RISK', 'CONTROLS', 'COMPLIANCE', 'AUDIT', 'SECURITY', 'POLICY', 'INCIDENT', 'TPR', 'BCP', 'CROSS_MODULE'] },
      { key: 'unit', label: 'Unit', type: 'text', required: true },
      { key: 'calculationMethod', label: 'Calculation Method', type: 'select', required: true, options: ['SOURCE_AGGREGATE', 'DERIVED'] },
      { key: 'thresholdGreen', label: 'Green Threshold', type: 'number', required: true },
      { key: 'thresholdAmber', label: 'Amber Threshold', type: 'number', required: true },
      { key: 'thresholdRed', label: 'Red Threshold', type: 'number', required: true },
    ],
    detailSections: [
      {
        title: 'Definition',
        fields: [
          { key: 'metricCategory', label: 'Category', cell: 'badge' },
          { key: 'unit', label: 'Unit' },
          { key: 'calculationMethod', label: 'Calculation Method', cell: 'badge' },
        ],
      },
      {
        title: 'Current Reading',
        fields: [
          { key: 'currentValue', label: 'Current Value', cell: 'number' },
          { key: 'band', label: 'Band', cell: 'severity' },
          { key: 'thresholdGreen', label: 'Green Threshold', cell: 'number' },
          { key: 'thresholdAmber', label: 'Amber Threshold', cell: 'number' },
          { key: 'thresholdRed', label: 'Red Threshold', cell: 'number' },
        ],
      },
    ],
    workflowActions: [
      { id: 'RETIRE', label: 'Retire Metric', fromStatuses: ['ACTIVE'], governed: false, targetStatus: 'RETIRED', permission: 'APPROVE', tone: 'outline', description: 'Metric definition retired' },
    ],
    relations: [],
    hasEvidence: false,
  },
];
