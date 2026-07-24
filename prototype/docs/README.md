# ERM UX Reference Prototype

## Purpose

This is a **high-fidelity, interactive UX reference prototype** for the ERM / GRC
platform specified in `docs/` at the repository root. It exists to let business
users, risk/compliance/audit teams, product owners, developers and architects
**validate every completed specification visually and interactively** before any
PRSMTD implementation work begins.

It is **not** production code. There is no backend, no database, no real
authentication. Every entity, workflow, and dashboard is grounded in a specific
authoritative spec under `docs/` (10-risk, 11-compliance, 12-controls, 13-audit,
09-security, 23-policy, 24-incident-issue-capa, 25-third-party-risk,
26-business-continuity, 14-reporting, 15-analytics), and the prototype's own
structure and visual language deliberately mirror PRSMTD's frontend conventions
(`PRSMTD/frontend`) so a PRSMTD user would recognize this as "another native
module" rather than a different product.

## What this is not

- Not a PRSMTD implementation. Nothing here is copied from PRSMTD; components,
  tokens and layout patterns are regenerated to match its conventions.
- Not a persistence layer. All data lives in memory, hydrated from JSON seed
  files, mirrored to `localStorage` so a browser refresh doesn't lose demo
  progress. There is no server, no database, no API.
- Not a security or compliance implementation. Access control, maker-checker
  enforcement and audit trails are simulated in the browser for demonstration
  purposes only — they carry no security guarantee.
- Not a finished UX specification. This prototype is the concrete *input* to
  the still-unauthored `docs/27-user-experience/` specs (Master Execution Plan
  Phases 15–18), not a replacement for them.

## How to run

```bash
cd prototype
npm install
npm run dev
```

Open `http://localhost:3100`. Pick any persona at the login screen — no
credentials are required. Use the persona switcher (top-right, next to the
bell icon) to change who you're acting as at any time, including mid-workflow
to demonstrate maker-checker (submit as a maker persona, switch to a checker
persona, decide the item).

`npm run typecheck` runs `tsc --noEmit`. `npm run build` produces a production
Next.js build if you want to sanity-check the whole app compiles for deployment
to a static host or preview environment.

### Resetting demo data

Open the persona switcher menu → **Reset demo data**. This restores every
module to its pristine seed state, discarding any workflow actions performed
during the session. Useful between stakeholder demo sessions.

## Architecture

- **Next.js 14 App Router**, mirroring PRSMTD's `frontend/app` + `frontend/src`
  structure: `app/` for routes, `src/components/{ui,common,module,charts}` for
  the component library, `src/features/<module>` for per-module dashboard
  composites, `src/lib` for the mock service layer, `src/data` for seed JSON,
  `src/modules` for the per-module entity-screen configuration, `src/screens`
  for the generic list/detail/form screen renderers.
- **One generic screen framework, eleven module configurations.** Every
  module's list, detail, create and edit screens are the *same* three React
  components (`ListScreen`, `DetailScreen`, `FormScreen` in `src/screens/`),
  driven entirely by an `EntityConfig` object per entity (see
  `src/lib/registry.ts`). A module's specificity lives entirely in its
  `src/modules/<code>.ts` configuration file (columns, filters, form fields,
  detail sections, workflow actions, relations) — not in bespoke screen code.
  This guarantees the eleven modules share one consistent UX language, and it
  mirrors how a real PRSMTD module would declare its manifest once and let
  shared frontend infrastructure render from it.
- **Mock governance engine** (`src/lib/governance.ts`) simulates PRSMTD's
  maker-checker mechanism: `submitForApproval` creates a pending action
  (blocking duplicates per the GOV-07 single-pending-action-per-target rule),
  `decidePendingAction` enforces separation of duties (a maker cannot decide
  their own submission) and the checker role, and projects the decision onto
  the entity's status plus an activity-history entry and a notification.
  Non-governed transitions (assign, acknowledge, close, escalate, etc.) go
  through `applyTransition` — same history/notification plumbing, no approval
  gate.
- **Mock persistence** (`src/lib/store.ts`): an in-memory object hydrated once
  from `src/data/seed.ts`, mirrored to `localStorage` on every mutation. A
  `useSyncExternalStore`-based hook (`useDb`) re-renders any component that
  reads from the store whenever a mutation happens anywhere in the app —
  there is no prop drilling or manual refetching.
- **Mock session** (`src/lib/session.ts`): the "logged in" persona is just an
  id in `localStorage`; permissions are resolved from the persona's module
  roles against the mock module catalog (`src/lib/moduleCatalog.ts`), which is
  structurally identical to a PRSMTD `module.yaml` (code, roles, roleTypes,
  roleMappings). The sidebar derives its module links *exclusively* from this
  catalog — no module route is hardcoded in the shell, mirroring PRSMTD's
  Frontend Hardcoding Guard (`system.md` §5b15).
- **Chart abstraction layer** (`src/components/charts/`): dashboards never call
  a charting library directly. `BarChart`, `DonutChart`, `TrendLine`,
  `Sparkline`, `RiskHeatmap` and `MetricTile` are native HTML/CSS/SVG
  implementations behind a stable prop interface (`src/components/charts/types.ts`).
  When PRSMTD adopts an official visualization library, only these renderer
  files change — every dashboard, widget composition and drill-down
  interaction they were built against stays exactly the same.

## Mock data structure

`src/data/*.json` holds one file per module's seed dataset (`risk.json`,
`controls.json`, `compliance.json`, `audit.json`, `security.json`,
`policy.json`, `incident.json`, `tpr.json`, `bcp.json`, `reporting.json`,
`analytics.json`), plus `org.json` for the fictional tenant's departments,
users and personas. `src/data/seed.ts` assembles all of these into one `Db`
object, and additionally hand-authors the enterprise-level collections that
cut across every module: `pendingActions` (the maker-checker ledger),
`history` (activity timeline events, auto-derived from the pending-action
list plus a few standalone entries), `notifications`, `tasks` and `evidence`.

The fictional tenant is **Meridian Asset Management Ltd.**, a SEBI-regulated
Mutual Fund AMC, matching the SEBI_AMC regulatory profile every authoritative
spec is grounded in. Every risk, control, obligation, finding, vendor,
continuity plan, etc. cross-references real IDs from other modules'
datasets (e.g. `Risk.linkedControlIds`, `Control.linkedObligationIds`,
`Vendor.linkedControlIds`) so cross-module drill-down (Relationships tabs,
global search, dashboard links) resolves to real, consistent records rather
than dead links.

Every governed entity is seeded across a spread of lifecycle states —
draft, pending approval, active, escalated, rejected, retired — so every
screen state (including the approval dialogs and the checker queue) is
demonstrable without the user having to manufacture it first. `seed.ts`
additionally hand-authors ~35 pending/decided governance-ledger entries
against records whose seeded `status` already matches the corresponding
`pendingStatus`, so the Approvals queue and each entity's History/Approvals
tabs are populated realistically from the very first page load.

## Folder organization

```
prototype/
  app/                          Next.js App Router routes
    login/                      Mock login + persona picker
    protected/                  Enterprise screens (home, approvals, notifications, search)
    modules/[code]/              Dynamic module dashboard + entity list/detail/create/edit routes
  src/
    components/
      ui/                       shadcn/ui-style primitives (button, card, table, dialog, ...)
      common/                   PageHeader, DataTable, Timeline, EvidencePanel, PersonaSwitcher, ...
      module/                   WorkflowActionBar, ApprovalDecision (maker-checker UI)
      charts/                   Chart abstraction layer + native renderers
    features/<module>/          Per-module dashboard composites (RiskDashboard, ControlsDashboard, ...)
    modules/                    Per-module EntityConfig definitions + the module registry index
    screens/                    Generic ListScreen / DetailScreen / FormScreen
    lib/                        store, session, governance, moduleCatalog, format, id, search
    data/                       JSON seed datasets + seed.ts assembly
    types/                      Core entity/session/ledger types
  docs/                         This documentation suite (screen inventory, nav map, etc.)
```

## Limitations

- **No backend, no database, no persistence beyond `localStorage`.** Nothing
  here survives a "Reset demo data" click, a different browser, or a different
  machine.
- **No real authentication or authorization enforcement.** Permission checks
  are UI-level convenience, not a security boundary — anyone with browser
  devtools can bypass them. This is expected and acceptable for a UX
  prototype; do not treat it as a security reference.
- **Chart visuals are intentionally plain.** They demonstrate composition,
  banding and drill-down behavior, not final visual polish — see the Chart
  abstraction layer note above.
- **Evidence/attachment upload is simulated.** Metadata is recorded; no file
  is actually stored anywhere, because PRSMTD has no document/object storage
  capability yet (a gap already flagged in
  `docs/22-traceability/01-master-traceability-matrix.md`).
- **Not every workflow transition in every spec is wired.** The most
  representative and pedagogically useful transitions per module are
  implemented (submit/approve/reject/return, escalate, acknowledge, close,
  retire, etc.); some narrower edge-case transitions from the specs' state
  machines are omitted where they would not add to the UX demonstration.

See [defects-and-observations.md](defects-and-observations.md) for any spec
inconsistencies discovered while building this prototype, and
[user-journeys.md](user-journeys.md) for guided walkthroughs of the maker-checker
flows across all eleven modules.
