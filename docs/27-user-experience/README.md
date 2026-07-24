# 27 — User Experience

## Purpose

The presentation layer for every business-domain section (`09-security` through `13-audit`,
`23-policy` through `26-business-continuity`, and any future domain module): screens,
navigation, dashboards-as-UI, forms, validation-rule presentation, notifications,
maker-checker approval UI, accessibility, and responsive behavior. Approved as a new top-level
section (Session 9, 2026-07-21) resolving the Master Execution Plan's Phase 1 second question
— see [`../roadmap.md`](../roadmap.md#phase-1--repository-structure-extension-decision).

## Boundary (binding)

This section owns **presentation only**. It must not redefine or own business rules,
workflows, domain models, APIs, or data ownership — those remain owned exclusively by each
domain section. Every screen, form, or dashboard specified here must trace to a named
entity, state transition, or role already defined in its owning domain section's spec; this
section never invents data or a transition a domain spec doesn't already define.

## Reuse-before-redesign (binding)

Every specification in this section must reuse PRSMTD's existing frontend architecture rather
than design a competing one — see the **Frontend/UI shell** row of the PRSMTD capability
inventory in [`../../CLAUDE.md`](../../CLAUDE.md#prsmtd-capability-inventory):

- The Next.js App Router shell (`frontend/app`, `frontend/src`)
- Dynamic module navigation built from `GET /api/v1/modules` — module codes are never
  hardcoded (Frontend Hardcoding Guard, `system.md` §5b15)
- The shared component library (`src/components/{ui,common,module}`)
- Existing feature-area conventions already present in `frontend/src/features/` — notably
  `approvals` (the existing maker-checker UI surface) and `dashboard` — as the starting
  pattern for this section's own maker-checker and dashboard specs, not a from-scratch design
- Closed-world UI/BFF route enumeration (`system.md` §4.1, T4/T5)

A new UI pattern is introduced here only where no PRSMTD equivalent exists, and must be
explicitly identified and justified as a new capability requirement in that document's own
Assumptions section, per `CLAUDE.md`'s Traceability Rules — the same discipline every domain
module spec already applies to backend capability gaps.

## What belongs here

- **UX Foundational Framework** (Master Execution Plan Phase 15): screen taxonomy
  (list/detail/form/dashboard/approval-queue as recurring shapes), the single cross-module
  navigation model, the generic maker-checker approval UI pattern (specified once, referenced
  by every domain module rather than redesigned per module), persona-to-screen-set mapping,
  accessibility standards, and responsive-behavior conventions — all specified once as a
  shared kernel, mirroring the discipline `04-domain-model` established for the domain layer
- **Screen, Navigation & Dashboard Specifications** (Phase 16): per-module screen inventories
  and dashboard compositions applying the Foundational Framework; dashboards consume (cross-
  reference, never duplicate) `15-analytics`' KPI/metric catalog
- **Forms, Validation Rules & Maker-Checker UX** (Phase 17): field-level validation rules
  (each traceable to a constraint already named in the owning module's Data Model — no new
  business rule invented here), error-state messaging conventions, and the concrete
  per-entity maker-checker approval screen behavior
- **Notifications** (Phase 18): the trigger catalog (one row per governed-lifecycle
  transition or SLA breach across all modules), channel model, and an explicit split between
  what's implementable today (in-UI, poll-based) versus what requires a genuine new PRSMTD
  notification capability (PRSMTD's platform-wide notification/alerting attempt was retired —
  `system.md` PR-RESET-02, re-verify before relying on this finding)

## Cross-references

- [`../02-business-architecture/`](../02-business-architecture/) — the persona catalog every
  screen's role mapping cites
- [`../04-domain-model/`](../04-domain-model/) — the shared-kernel discipline this section
  mirrors for the UX layer
- [`../09-security/`](../09-security/) through [`../13-audit/`](../13-audit/),
  [`../23-policy/`](../23-policy/) through [`../26-business-continuity/`](../26-business-continuity/)
  — every domain section this section's specs render, and the sole owners of the underlying
  business rules, workflows, domain models, and APIs
- [`../15-analytics/`](../15-analytics/) — KPI/metric catalog consumed by dashboard specs here,
  not duplicated
- `PRSMTD/frontend/` (`app/`, `src/components/`, `src/features/`) — the frontend this section's
  specs must be directly buildable against, per the Reuse-before-redesign rule above

## Reference prototype (Session 18, 2026-07-24)

A high-fidelity, interactive **UX Reference Prototype** now exists at
[`../../prototype/`](../../prototype/) — a locally-runnable Next.js
application implementing every completed specification's screens, dashboards,
forms, and maker-checker workflows against mock data, built to demonstrate
(not replace) the Foundational Framework, Screen/Navigation/Dashboard specs,
Forms/Validation/Maker-Checker UX, and Notifications work this section still
owes (Master Execution Plan Phases 15–18). See
[`../../prototype/docs/README.md`](../../prototype/docs/README.md) for its
purpose, architecture and limitations, and
[`../../prototype/docs/screen-inventory.md`](../../prototype/docs/screen-inventory.md)
for the full screen list.

The prototype is a concrete, stakeholder-validated input to the four phases
below — it is not a substitute for authoring them. Once Phases 15–18 are
written, each should cross-reference the corresponding prototype screens as
worked examples, and note any place where stakeholder feedback on the
prototype changed a decision from what was first built.

## Status

Phases 15–18 (the formal specifications) are **not yet authored**. The
reference prototype above is available as their input.
