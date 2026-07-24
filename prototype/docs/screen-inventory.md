# Screen Inventory

Every screen in the prototype, grouped by area. "Generic" means the screen is
rendered by one of the three shared screen components (`ListScreen`,
`DetailScreen`, `FormScreen` in `src/screens/`) driven by that entity's
`EntityConfig`; "Custom" means it has bespoke code.

## Enterprise screens

| Screen | Route | Type | Notes |
|---|---|---|---|
| Login | `/login` | Custom | Persona picker, no credentials |
| Home / Enterprise Dashboard | `/protected` | Custom | Cross-module KPIs, my tasks, recent activity, module tiles |
| Approvals | `/protected/approvals` | Custom | Checker queue / my submissions / decision history tabs |
| Notifications | `/protected/notifications` | Custom | Full notification feed with mark-as-read |
| Global Search | `/protected/search` | Custom | Cross-module search over every entity the user can view |

## Per-module screens

Each of the 11 modules exposes a dashboard (Custom, in `src/features/<module>/`)
plus, per entity, a generic List / Detail / Create / Edit screen at
`/modules/{CODE}/{entity-slug}` (list), `/{id}` (detail), `/new` (create),
`/{id}/edit` (edit). Detail screens carry Overview / Relationships / Evidence /
History / Approvals tabs (tabs present depend on the entity's config —
`hasEvidence`, `relations.length`).

| Module | Dashboard route | Entities (list/detail/create/edit each) |
|---|---|---|
| Risk Management | `/modules/RISK` | risks, assessments, treatment-plans, acceptances, escalations, kris |
| Controls Management | `/modules/CONTROLS` | controls, tests, exceptions |
| Compliance Management | `/modules/COMPLIANCE` | obligations, regulatory-changes, assessments, attestations, calendar, exceptions |
| Audit Management | `/modules/AUDIT` | universe, plans, engagements, working-papers, findings, follow-ups |
| Security Management | `/modules/SECURITY` | findings, assets, baselines, access-grants |
| Policy Management | `/modules/POLICY` | policies, versions, reviews, acknowledgements, exceptions |
| Incident, Issue & CAPA | `/modules/INCIDENT` | incidents, rca, issues, capas, action-items, escalations |
| Third-Party Risk | `/modules/TPR` | vendors, contracts, assessments, slas, exceptions |
| Business Continuity | `/modules/BCP` | critical-services, bia, plans, plan-versions, exercises, exceptions |
| Reporting | `/modules/REPORTING` | definitions (no create — catalogue is fixed), instances, dashboards |
| Analytics | `/modules/ANALYTICS` | metrics |

Total: 11 dashboards + 46 entity types × up to 4 generic screens each ≈ **150+
distinct screen states**, all sharing one visual language.

## Screen anatomy (what every List/Detail/Create screen includes)

- **List**: breadcrumbs, page header with description, "New" action (if the
  persona holds the module's `_CREATE` permission and the entity allows
  creation), search box, per-column filters, sortable columns, pagination,
  empty state.
- **Detail**: breadcrumbs, status badge (+ "Awaiting checker" badge when a
  pending action exists), edit action (if editable in current status),
  workflow action buttons (governed and direct), tabs: **Overview** (grouped
  field sections), **Relationships** (linked records in other collections/
  modules, each a mini data table with its own search), **Evidence** (mock
  attachment upload/list, only if `hasEvidence`), **History** (activity
  timeline), **Approvals** (pending decision panel + decided-action cards).
- **Create/Edit**: breadcrumbs, form fields per the entity's field config
  (text/textarea/select/number/date/user/department/reference pickers),
  required-field validation, cancel/save actions. Edit is blocked (with an
  explanatory empty state) once a record leaves its editable status or has a
  pending action outstanding.
