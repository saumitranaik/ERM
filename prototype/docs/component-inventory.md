# Component Inventory

## UI primitives (`src/components/ui/`)

shadcn/ui-style components on Radix primitives, matching PRSMTD's component
library conventions (same primitive set, same class-variance-authority
pattern, same Tailwind token usage):

`button`, `badge`, `card`, `input`, `textarea`, `label`, `table`, `dialog`,
`select`, `tabs`, `progress`, `separator`, `dropdown-menu`, `skeleton`,
`tooltip`, `checkbox`, `switch`, `breadcrumb`, `utils` (the `cn()` class-merge
helper).

## Common components (`src/components/common/`)

| Component | Purpose |
|---|---|
| `PageHeader` | Title, description, breadcrumbs, action buttons — used on every screen |
| `StatusBadge` / `SeverityBadge` / `ScoreChip` | Status-to-tone mapping shared across all modules |
| `DataTable` | Generic list table: search, per-column filters, sortable columns, pagination, empty state |
| `Timeline` | Activity history feed (ACTION_CREATED/APPROVED/REJECTED/RETURNED, RECORD_CREATED/UPDATED) |
| `EvidencePanel` | Mock evidence/attachment upload + list |
| `EmptyState` | Consistent "nothing here" pattern with icon/title/description/action |
| `ErrorBanner` | Inline dismissible error banner for governance/validation failures |
| `PersonaSwitcher` | Header menu: switch persona, toggle dark theme, reset demo data, logout |
| `NotificationBell` | Header bell with unread count and dropdown preview |
| `ThemeToggle` | Dark/light theme toggle (persisted to localStorage) |
| `Hydrated` | Defers rendering until client mount to avoid SSR/localStorage hydration mismatches |
| `moduleIcons` | Lucide icon resolver for module manifests |

## Module / workflow components (`src/components/module/`)

| Component | Purpose |
|---|---|
| `WorkflowActionBar` | Renders available workflow verbs for an entity in its current status + persona; opens a justification dialog for governed actions |
| `ApprovalDecision` | Checker decision UI (approve/reject/return) with separation-of-duties and role enforcement |
| `DecidedActionCard` | Read-only card summarizing a completed governance decision |

## Chart abstraction layer (`src/components/charts/`)

| Component | Purpose |
|---|---|
| `types.ts` | The stable `ChartDatum`/`SeriesPoint`/prop interfaces every renderer implements |
| `BarChart` | Horizontal bar chart (native CSS) |
| `DonutChart` | Donut/pie chart (native SVG) |
| `TrendLine` / `Sparkline` | Line/area trend charts and compact sparklines (native SVG) |
| `RiskHeatmap` | 5×5 likelihood × impact heat-map grid (native HTML/CSS, no chart library) |
| `MetricTile` / `StatCard` | KPI stat tiles with threshold banding and trend indicators |

**This layer is deliberately swappable.** No dashboard or feature component
calls an SVG path or CSS grid directly — they all consume the typed props in
`types.ts`. Adopting an official charting library later means rewriting these
six files; every dashboard composition, every drill-down `href`, and every
KPI/threshold specification stays untouched.

## Generic screens (`src/screens/`)

| Component | Purpose |
|---|---|
| `ListScreen` | Renders any entity's list page from its `EntityConfig` |
| `DetailScreen` | Renders any entity's detail page (tabs, workflow actions, approvals) |
| `FormScreen` | Renders any entity's create/edit form |

## Configuration model (`src/lib/registry.ts`)

`EntityConfig` is the single source of truth each module's `src/modules/<code>.ts`
file populates: columns, filters, form fields, detail sections, workflow
actions (governed vs. direct, with permission/status-transition rules), and
relations to other collections/modules. Adding a new screen for an existing
module (or a new module) means adding a config object, not new screen code.

## Mock service layer (`src/lib/`)

| File | Purpose |
|---|---|
| `store.ts` | localStorage-backed in-memory database + `useDb()` reactive hook |
| `session.ts` | Persona-based mock session + `useSession()` reactive hook |
| `governance.ts` | Maker-checker ledger: submit/decide/direct-transition/create/update |
| `moduleCatalog.ts` | Mock `GET /api/v1/modules` equivalent — manifests, roles, permission resolution |
| `registry.ts` | `EntityConfig` type + helpers (`entityHref`, `entityTitle`, `rowsFor`) |
| `search.ts` | Cross-module search over every registered entity |
| `format.ts` | Date/time/humanize formatting helpers |
| `id.ts` | ID generation + sequential business-code generation (`RSK-2026-0041` pattern) |
