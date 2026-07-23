# 22.02 — Compliance Coverage Assessment

## Purpose

Answers two independent questions, kept explicitly separate throughout this document and
never merged:

1. **If an organization deployed the current PRSMTD platform today** (no ERM module
   implemented), which controls exist, which regulations could be partially supported, and
   what is missing?
2. **If every currently-authored ERM specification were implemented into PRSMTD**, which
   additional controls would become available, which regulations would become supported, and
   what would still remain before full platform capability exists?

This is a **derived, regulation-facing read** over
[`01-master-traceability-matrix.md`](01-master-traceability-matrix.md) (the authoritative
per-spec traceability register) and the current PRSMTD `system.md` state, not a replacement
for it. It does not certify legal or regulatory compliance — see
[Final Statement](#final-statement).

## Scope and Method

- **PRSMTD verification**: every claim about what PRSMTD "already implements" in this
  document was verified this session against `PRSMTD/docs/authoritative/system.md` (full
  section-heading scan, plus targeted reads of §3 Governance model, §4.1 Observability & Trace
  Contract, §7 Data model & RLS, §8 RBAC model, §9 Module framework, §10 Audit and compliance)
  and `PRSMTD/modules/` (directory listing: only `contacts` and `module-template` exist).
  Nothing here is assumed from a prior session's memory without this session's re-check.
- **ERM verification**: every claim about what the ERM specifications provide is drawn from
  the twelve currently authored, frozen documents — `04-domain-model/01-*`, `10-risk/01-*`,
  `12-controls/01-*`, `11-compliance/01-*`, `13-audit/01-*`, `09-security/01-*`,
  `23-policy/01-*`, `24-incident-issue-capa/01-*`, `25-third-party-risk/01-*`,
  `26-business-continuity/01-*`, `14-reporting/01-*`, `15-analytics/01-*` — and their
  Traceability blocks as aggregated in `01-master-traceability-matrix.md`. `15-analytics/01-*`
  (Session 16) closes the KPI/metric-catalog and dashboard-visualization gap this document
  previously treated as not specified.
- **Ratings are never merged across the "already built" / "specified but unbuilt" / "not
  specified" axis anywhere in this document**, per the explicit instruction this assessment
  was commissioned under.
- This document is a snapshot as of **2026-07-21**, incrementally updated in Session 6 to
  reflect the two additive changes applied to `10-risk`/`12-controls` and the newly authored
  `09-security/01-security-management.md`, again in Session 7 to reflect the three
  additive changes `09-security` had proposed (now applied to `10-risk`/`13-audit`/
  `04-domain-model`) and a consistency-review correction to `04-domain-model`'s own stale
  `COMPLIANCE`/`AUDIT` status labels, again in Session 10 (2026-07-21) to reflect the
  newly authored `23-policy/01-policy-management.md`, again in Session 11 (2026-07-21) to
  reflect the newly authored
  `24-incident-issue-capa/01-incident-issue-capa-management.md`, again in Session 12
  (2026-07-21) to reflect the newly authored
  `25-third-party-risk/01-third-party-risk-management.md`, again in Session 13
  (2026-07-21) to reflect the newly authored
  `26-business-continuity/01-business-continuity-management.md`, and again in Session 14
  (2026-07-21) to reflect the newly authored
  `14-reporting/01-reporting-management.md`, and again in Session 16 (2026-07-22) to reflect
  the newly authored `15-analytics/01-analytics-management.md` — **only the sections those
  changes affect were updated**; all other analysis is preserved unchanged from prior
  sessions. Both PRSMTD and the ERM specification set will keep changing — see
  `docs/roadmap.md` Risks register for the staleness risk this snapshot carries, and
  re-verify before relying on any rating below at a later date.

## Executive Summary

| Dimension | Assessment |
|---|---|
| **Current PRSMTD maturity** | Mature, well-documented **generic multi-tenant governance platform substrate** (identity/tenancy, maker-checker governance ledger, RBAC, module framework with strict ownership guards, audit/observability trace contract, authentication). **Zero GRC-domain business capability** — no risk, control, compliance, or audit module exists in PRSMTD today; only a `contacts` reference module and a scaffolding template. |
| **Current ERM specification maturity** | Twelve authoritative ERM specifications now exist: `RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, `SECURITY`, `POLICY`, `INCIDENT`, `TPR`, `BCP`, `REPORTING`, `ANALYTICS`, plus the cross-cutting `04-domain-model` that ties them together. **Session 16 authored the twelfth**, [`15-analytics/01-analytics-management.md`](../15-analytics/01-analytics-management.md) (module code `ANALYTICS`) — a 48-row seed KPI/Metric Catalogue, threshold/banding measurement, and a dashboard visualization-composition layer (`MetricView`) that activates `14-reporting`'s already-reserved `DashboardWidget.widget_type = METRIC_REFERENCE` slot with **zero** additive change to that module's schema. It proposes, but does not apply, an eleventh-bounded-context amendment to `04-domain-model` (adding `ANALYTICS` alongside `REPORTING` within the existing "Reporting and Analytics" Supporting Subdomain) — the same one-session lag every prior module's own status-label proposal has left. `04-domain-model`'s own Bounded Context Map, however, still labels five contexts "authored" (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, `SECURITY`) — `POLICY`'s, `INCIDENT`'s, `TPR`'s, `BCP`'s, and now `REPORTING`'s status-label amendments are all proposed, not yet applied (the same lag `SECURITY` itself had between Sessions 6 and 7), so [Percentage Completion](#percentage-completion) deliberately keeps counting 5/10 until those amendments land. **Session 6 authored the sixth authoritative spec**, [`09-security/01-security-management.md`](../09-security/01-security-management.md) (module code `SECURITY`); **Session 7 closed that gap**. **Session 10 authored the seventh authoritative spec**, [`23-policy/01-policy-management.md`](../23-policy/01-policy-management.md) (module code `POLICY`). **Session 11 authored the eighth authoritative spec**, [`24-incident-issue-capa/01-incident-issue-capa-management.md`](../24-incident-issue-capa/01-incident-issue-capa-management.md) (module code `INCIDENT`). **Session 12 authored the ninth authoritative spec**, [`25-third-party-risk/01-third-party-risk-management.md`](../25-third-party-risk/01-third-party-risk-management.md) (module code `TPR`). **Session 13 authored the tenth authoritative spec**, [`26-business-continuity/01-business-continuity-management.md`](../26-business-continuity/01-business-continuity-management.md) (module code `BCP`). **Session 14 authored the eleventh and final authoritative spec named in `04-domain-model`'s own Bounded Context Map**, [`14-reporting/01-reporting-management.md`](../14-reporting/01-reporting-management.md) (module code `REPORTING`) — a report/dashboard catalogue (69 seeded reports: 63 consolidating every source module's own deferred Reporting Requirements section, 6 genuinely new cross-module reports), field-level provenance mapping, on-demand report generation with opt-in approval-before-submission governance, and distribution record-keeping. Unlike every prior module, `REPORTING` originates no business fact of its own — a pure Conformist/read-model layer over all nine other business-domain modules — and is the first module whose manifest depends on all nine of them at once while no module depends on it in return. `15-analytics` (KPI/metric catalog, dashboard visualization composition) remains explicitly deferred to a future phase. |
| **Combined platform maturity** | If the eleven authored GRC/reporting specs were implemented today, an AMC would have a genuinely governed risk register, control library, compliance obligation register, internal/system audit capability, cybersecurity governance capability, a governed policy management capability, a governed incident/issue/CAPA capability, a governed third-party risk capability, a governed business continuity capability, a reporting capability that consolidates every one of those nine modules' own deferred reporting obligation into a seeded catalogue with field-level provenance and evidence-ready export construction, **and now an analytics capability** — a KPI/metric catalogue, threshold/banding measurement, and a dashboard visualization-composition layer turning every one of those modules' raw data into heat maps, trend lines, and drill-downs — but still no binary evidence storage, no scheduled-job/batch report or metric-refresh execution, no generic export-rendering pipeline or formula-execution/BI-computation engine, and no SIEM/automated threat-detection capability. See [Percentage Completion](#percentage-completion). |
| **Regulatory readiness** | **Partially ready** for the SEBI Mutual Fund regulatory profile specifically (Risk Management System circular — including its own mandatory DR/BCP practice — Master Circular Annexures operational/financial/IT/cyber/compliance-risk/audit/outsourcing-risk/BCP-DR sections, the Cyber Security and Cyber Resilience Framework's governance layer via `SECURITY`, formal policy authorship/acknowledgement via `POLICY`, structured incident/CAPA remediation via `INCIDENT`, governed vendor/outsourcing oversight via `TPR`, governed business continuity via `BCP`, and now — for the first time — a concrete mechanism, `REPORTING`, for actually producing and evidencing the quarterly/half-yearly Board/Trustee/SEBI filings every one of those modules only ever named as an obligation) if the ten specs were implemented. **Not ready** for DPDP Act, CERT-In Directions, Companies Act, or Income Tax — none is addressed by any current spec. **Early-stage, architecturally-compatible-only** for ISO 27001/27701/31000, COBIT, and NIST CSF. **ISO 22301** remains Partially Mapped via `BCP`; see [Regulatory Readiness Matrix](#regulatory-readiness-matrix). |
| **Compliance readiness** | Same as regulatory readiness — this document does not distinguish the two terms further; see [Regulatory Readiness Matrix](#regulatory-readiness-matrix). |
| **Architecture maturity** | High for what exists: every authored spec follows one shared-kernel modeling pattern (`04-domain-model`'s taxonomy shape, governed-lifecycle shape, opaque-reference shape, code-sequence shape). `REPORTING` activated seven of its nine source-module integrations with **zero** additive change — consuming, not extending, the shared kernel — and is the first module to discover that `RISK` itself (this repository's very first module) has never needed to expose a point-citation endpoint for its own entities, and that `AUDIT` (designed from its own authoring as a pure consumer/sink) has never needed to either. Both are precisely-scoped, low-effort gaps, the same class of finding `26-business-continuity` made for its own taxonomy gap, not evidence of a structural flaw. |
| **Implementation readiness** | Each of the eleven authored specs is implementation-ready on its own terms (concrete tables, states, APIs, role/permission names) but **none has been implemented in PRSMTD** — this repository is specification-only by design (`CLAUDE.md`). **Session 15 (Additive Change Consolidation) applied all nineteen additive changes and all five `04-domain-model` status-label amendments this repository had carried since Sessions 10–14** — none remain proposed. Two genuine cycle risks discovered during application (`SecurityFinding.linked_vendor_id`, `Incident.vendor_ref_id`, each of which would have paired with an already-existing reciprocal dependency) were resolved by leaving the reference opaque and unresolved by its owning module rather than accepting a cycle — see `04-domain-model/01-*`'s own Dependency Rule 8. |
| **Highest strength** | The governance-ledger/maker-checker substrate (PRSMTD, Built) plus the immediate-raise/governed-closure exception pattern (ERM, Specified across nine business-domain modules) together give every governed GRC decision the same real, auditable, SoD-enforced approval mechanism with zero bespoke code per module — and `REPORTING` now gives every one of those decisions, once generated into a Report Instance, a fully reconstructable, field-level provenance trail (`ReportCitation`) independent of whether the platform's still-open document/object-storage gap is ever closed. |
| **Highest risk** | The platform document/object storage capability gap, first flagged at `12-controls` and now inherited by `COMPLIANCE`, `AUDIT`, `POLICY`, `INCIDENT`, `TPR`, and `BCP` unchanged: every evidence-bearing record in this repository's design can be fully governed and metadata-tracked, but **cannot yet retain the actual binary evidence/content** an auditor or regulator would expect to retrieve — except `AUDIT`'s system-trace-extract evidence path and, as of Session 14, `REPORTING`'s own `content_summary`-based instances, both of which deliberately do not depend on this gap. |
| **Recommended next module** | Session 15 closed every outstanding additive-change and status-label gap this repository carried; Session 16 authored `15-analytics/01-analytics-management.md` — **Specification Completion remains at 10/10 = 100%** of `04-domain-model`'s own bounded-context count (unaffected — `ANALYTICS`'s eleventh-context amendment is proposed, not applied, per this document's own counting convention; see [Percentage Completion](#percentage-completion)). See `docs/roadmap.md`'s updated status for the current recommendation — the persona-to-module-role/`system.md §18` ADR consolidation (Phase 5), Phase 12 (`16-ai` AI Governance), or beginning the repository-wide certification tier (Phases 26–29). |

## Question 1 — PRSMTD Platform As-Is

If an organization deployed the **current PRSMTD platform today**, with no ERM module
implemented:

**Controls already implemented** (verified this session, see [Scope and Method](#scope-and-method)):

| Capability | Evidence | Notes |
|---|---|---|
| Multi-tenant data isolation (RLS) | system.md §7, RLS Policy Summary | Enforced at the database level via `TenantAwareDataSource` and GUC binding; mandatory for both tenant and platform planes. |
| Maker-checker governance | system.md §3, GOV-07; `pending_action` table | Single-pending-action-per-target dedup, `approved_by <> created_by` platform constraint — the SoD mechanism every ERM spec relies on rather than building its own. |
| RBAC (platform, tenant, module) | system.md §8 | Three-tier RBAC with a closed module role-type set (`MAKER`/`CHECKER`/`VIEWER`); permission catalog is a closed set. |
| Module framework | system.md §9, §5a–§5c | Manifest-driven registration, versioning, schema ownership (`module_<code>_*` prefix), route/API namespace ownership, dependency rules (OWN-08), service-boundary enforcement (OWN-09) — a real, guard-enforced mechanism, not just documentation. |
| Audit trail | system.md §10, §7 (`audit_log`, `platform_audit_log`) | Append-only, canonical `action_type` values, no aliasing permitted. §10 explicitly scopes to audit-log *naming/registry* rules — it is not a GRC "compliance" capability in the business sense this repository uses the term. |
| Observability / deterministic trace contract | system.md §4.1 | T1–T7 trace invariants, closed event taxonomy, correlation IDs — the direct substrate `13-audit`'s new system-trace-extract evidence type relies on. |
| Authentication | system.md §21 (JWT, issuer/audience invariants) | Reused unmodified by every ERM spec; out of scope for ERM to redesign. |

**Business-domain modules that actually exist**: `contacts` (a reference implementation) and
`module-template` (scaffolding). **Zero** GRC-domain modules (risk, controls, compliance,
audit, or any other) exist in PRSMTD as shipped code.

**Capabilities confirmed absent** (verified by targeted search this session, not assumed):

| Capability | Verification method | Result |
|---|---|---|
| Document/object storage | Grepped system.md for "object storage", "document storage", "blob storage", "s3" | No platform mechanism found — confirmed absent, same finding `12-controls` Assumption 4 first made. |
| Notification/alerting | Grepped system.md for "notification" | A `BILLING`/`NOTIFICATIONS`/`ADMIN` structural expansion was attempted (v1) and then **explicitly RETIRED** (system.md, PR-RESET-02): the handlers "returned `NOT_IMPLEMENTED`; no governance flow... was ever wired through them," and the modules were deleted. Confirmed **not built**, with an unusual history — it was tried and rolled back, not merely deferred. |
| Generic workflow/BPMN engine | Grepped system.md for "workflow engine", "BPMN" | No dedicated workflow engine beyond the governance ledger — every ERM spec's maker-checker flow uses `pending_action` directly, which has proven sufficient; not a gap any current spec has flagged. |
| DPDP Act / CERT-In / privacy-law support | Grepped system.md for "DPDP", "CERT-IN", "GDPR", "data protection" | No mentions found — PRSMTD is a generic platform substrate with no India-privacy-law-specific or cyber-incident-reporting-specific capability. |

**Which regulations could already be partially supported by PRSMTD alone**: none, in the
business sense the SEBI circulars require (an independent risk management function, a control
library, a compliance obligation register, an internal audit function). PRSMTD's generic
substrate is a *necessary foundation* every one of those requires, but on its own satisfies
zero SEBI Mutual Fund regulatory requirements — there is no risk register, no control record,
no obligation record, and no audit engagement record to point a regulator at.

**Which capabilities are missing**: every GRC-domain business capability named in `CLAUDE.md`'s
long-term vision. See [Platform Capability Matrix](#platform-capability-matrix) for the full
enumeration.

## Question 2 — Combined PRSMTD + Current ERM Specifications

If every currently-authored ERM specification (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`,
`SECURITY`, `POLICY`, `INCIDENT`, `TPR`, `BCP`, `REPORTING`, `04-domain-model`) were implemented
into PRSMTD:

**Additional controls that would become available**:
- A governed risk register with inherent/residual scoring, risk appetite thresholds, KRI
  monitoring, treatment planning, formal risk acceptance, and threshold escalation (`RISK`).
- A governed control library with design/operating effectiveness testing, evidence
  (metadata-level), and exception management, covering both operational/financial controls
  and the SEBI System Audit Program Checklist's IT/cyber control domains (`CONTROLS`).
- A governed regulatory obligation register (17 mandatory SEBI policy domains seeded),
  compliance assessment, regulatory change management, compliance calendar, exceptions, and
  attestations (`COMPLIANCE`).
- A governed internal/system audit function — audit universe, risk-based planning, engagement
  lifecycle, working papers, findings, follow-up, and the Annexures-mandated Non-Compliance
  Rate / Rectification Index metrics (`AUDIT`).
- Cross-context integration already designed and consistent: Compliance obligations can
  generate risks and reference controls; audit findings can generate risks, new controls, and
  corroborate existing control/compliance exceptions — all via the opaque-reference,
  API-mediated pattern `04-domain-model` established, none of it requiring direct table access
  across modules.
- A governed cybersecurity capability (`SECURITY`) — a security policy domain taxonomy,
  tenant-adopted security baselines, privileged access grants with automatic expiry, a
  secrets/key/certificate governance register (ownership and rotation/expiry tracking, never
  credential material itself), and a security finding register (vulnerabilities,
  misconfigurations, policy violations, access anomalies) that can corroborate existing
  Control/Compliance exceptions via the same opaque-reference pattern.
- A governed policy management capability (`POLICY`) — a policy category taxonomy; the
  `Policy`/`PolicyVersion`/`PolicyReview`/`PolicyAcknowledgement`/`PolicyException` domain
  model covering Policies, Standards, Procedures, and Guidelines under one governed lifecycle
  (draft → review → approve → publish → retire, with periodic re-attestation as its own
  governed sub-flow); individual employee acknowledgement tracking; and policy exceptions.
  Two of its three cross-context integrations (to `COMPLIANCE`, to `SECURITY`) activate with
  **zero** additive change to either frozen spec; the third (to `CONTROLS`) requires a
  proposed, not-yet-applied additive extension.
- A governed incident/issue/CAPA capability (`INCIDENT`) — incident intake and investigation;
  Root Cause Analysis; an enterprise `Issue` register that may aggregate symptoms reported by
  Control/Compliance/Audit/Security/Policy exceptions and findings without replacing any of
  their own registers; and a structured CAPA lifecycle (action plan approval, action-item
  tracking, independent closure verification, and later effectiveness review). Activates
  `Risk.source = INCIDENT` with **zero** additive change (already live); activates `13-audit`'s
  and `09-security`'s already-reserved `capa_ref_id` columns with only a proposed initiating
  endpoint each; requires a proposed, not-yet-applied `capa_ref_id` extension to `12-controls`,
  `11-compliance`, and `23-policy`.
- A governed third-party risk capability (`TPR`) — vendor/third-party master data and lifecycle
  (prospective through terminated); mandatory pre-outsourcing due diligence gating vendor
  activation; independent inherent/residual vendor-risk rating; security and compliance
  assessment of vendors; contract tracking (SLA terms, tenure, right-to-audit, sub-delegation
  restriction, insurance, exit strategy); threshold-banded SLA monitoring mirroring `RISK`'s
  own KRI shape; and governed vendor exceptions. Activates six integrations with **zero**
  additive change (both directions of `POLICY`'s `PolicyReferenceLink`; `SECURITY`'s
  policy-domain tag and already-reserved `finding_type = THIRD_PARTY_RISK` value; `INCIDENT`'s
  `POST /capa-requests`; the resolution directions of `CONTROLS`' and `COMPLIANCE`'s reference
  APIs); requires six proposed, not-yet-applied additive changes across `10-risk`,
  `12-controls`, `11-compliance`, `09-security`, `13-audit`, and `24-incident-issue-capa`.
- A governed business continuity management capability (`BCP`) — critical business service
  identification and criticality classification; Business Impact Analysis with RTO/RPO/MTPD
  determination, updating the service's current recovery targets on approval; dependency
  mapping (upstream process, technology, vendor, personnel, facility); governed continuity
  strategy selection; a governed Continuity Plan lifecycle unifying BCP and DR Plan content
  under one `plan_type` discriminator; crisis/DR plan-activation recording; continuity
  exercises (table-top review, simulation, DR drill, alternate-site recovery test, system
  recovery test) recording RTO/RPO achievement and corroborating (not duplicating) `CONTROLS`'
  own effectiveness test on its seeded "Business Continuity & Disaster Recovery" control
  family; and governed continuity exceptions. Activates two integrations directly with
  **zero** additive change — the first module to do so for two integrations in one spec —
  (`INCIDENT`'s `POST /capa-requests`; `TPR`'s `GET /vendors/{id}/reference`), plus `POLICY`'s
  `PolicyReferenceLink` and `SECURITY`'s already-seeded "Business Continuity and Disaster
  Recovery" policy-domain tag, and the resolution directions of `CONTROLS`'/`COMPLIANCE`'s
  reference APIs; requires six proposed, not-yet-applied additive changes across `10-risk`,
  `12-controls`, `11-compliance`, `23-policy`, `13-audit`, and `24-incident-issue-capa`.
- A reporting capability (`REPORTING`) — a 69-row seed Report Catalogue consolidating every one
  of the nine other modules' own deferred Reporting Requirements section (63 rows) plus six new
  cross-module/enterprise reports this module itself originates (a Board & Executive GRC
  Summary, an Enterprise Exception & Aging Register, an Evidence Completeness Rollup, a
  Regulatory Filing & Review Calendar, a Rectification Index & CAPA Effectiveness Rollup, and a
  Cross-Module CAPA & Remediation Tracker); field-level provenance mapping from every report to
  its owning source module (`ReportFieldMapping`, prescriptive) and a per-instance citation
  manifest recording exactly what was resolved at generation time (`ReportCitation`,
  descriptive — the mechanism making a generated report "evidence-ready" without depending on
  the platform's still-open object-storage gap); on-demand report generation with opt-in
  approval-before-submission governance (gated by a boolean flag per report definition, not a
  fixed per-entity-type rule); and distribution record-keeping. Activates seven of nine
  source-module integrations with **zero** additive change; discovers two new point-citation
  gaps neither named before (`RISK` and `AUDIT` each lack a `GET .../{id}/reference` endpoint
  for their own entities) and two new PRSMTD capability gaps (a scheduled-job/batch-execution
  mechanism; a generic PDF/CSV export-rendering mechanism), neither blocking this module's own
  MVP scope.
- An analytics capability (`ANALYTICS`, added Session 16) — a 48-row seed KPI/Metric Catalogue
  (42 rows consolidating measurable facts already present in the nine authored business-domain
  modules' own data models, 6 new cross-module composite metrics such as a Governance Health
  Index and an Enterprise Exception Aging Rollup); field-level provenance
  (`MetricFieldMapping`); threshold/banding measurement (`MetricValue`, mirroring `KRI`'s and
  `VendorSLA`'s own green/amber/red shape without duplicating either); and a dashboard
  visualization-composition layer (`MetricView` — heat maps, trend lines, drill-downs) that
  activates `REPORTING`'s already-reserved `DashboardWidget.widget_type = METRIC_REFERENCE`
  slot with **zero** additive change to that module's schema. Defines **zero** governed
  `module_actions` types — the smallest governance footprint of any module in this repository.
  Names one new PRSMTD capability gap (a generic formula-execution/BI-computation engine) and
  one new ERM content gap (a roster-of-required-acknowledgers capability, surfaced by its own
  Policy Acknowledgement Completion Rate metric). Proposes, but does not apply, an
  eleventh-bounded-context amendment to `04-domain-model` and a small `dependencies:`/
  `DashboardDefinition.audience` addition to `14-reporting`.

**Which regulations would become supported** (see
[Regulatory Readiness Matrix](#regulatory-readiness-matrix) for the full rating and rationale
per regulation): **Mostly Ready** for the SEBI *Risk Management System* circular (including,
as of Session 13, its own mandatory DR/BCP practice) and the Annexures' Operational Risk /
Financial Reporting Risk / Compliance Risk / Outsourcing Risk / BCP-DR / three-lines-of-
defense (Internal Audit) sections. **Partially Ready** for the Cyber Security and Cyber
Resilience Framework for Mutual Funds AMCs (its own PDF remains scanned/image-only in this
environment — `12-controls` Assumption 5 — so citation precision is scope-level, not
clause-level). **Not Ready** for DPDP Act, CERT-In Directions, Companies Act, or Income Tax.
**Early Stage** for every international standard/framework listed in this document's scope
except ISO 22301 (ISO 27001/27701/31000, COBIT, NIST CSF) — architecturally compatible, not
explicitly mapped. **ISO 22301 moves to Partially Mapped** — `BCP`'s BIA/RTO/RPO/continuity-
plan/exercise vocabulary is the closest structural match to an international standard any ERM
spec has produced, though no explicit clause-level Annex crosswalk exists.

**Which roadmap items would still remain before full platform capability exists**: a platform
document/object storage capability, a general-purpose Records Retention Schedule capability,
the `system.md §18` Product Framework reconciliation, a SIEM/security-event-correlation
capability, an ABAC policy-decision mechanism, a scheduled-job/batch-execution mechanism, a
generic PDF/CSV export-rendering mechanism, a generic formula-execution/BI-computation engine
(newly named by `15-analytics/01-*`), and a roster-of-required-acknowledgers capability (newly
named by `15-analytics/01-*`).
**Resolved (Session 15)**: all nineteen additive changes `23-policy/01-*`,
`24-incident-issue-capa/01-*`, `25-third-party-risk/01-*`, `26-business-continuity/01-*`, and
`14-reporting/01-*` had proposed, and all five `04-domain-model` status-label amendments, are
now applied — none remain outstanding. **Resolved (Session 16)**: `15-analytics`, the last
piece of `CLAUDE.md`'s original "REPORTING & ANALYTICS" vision, is now authored — see
[Platform Capability Matrix](#platform-capability-matrix). Still remaining, and newly surfaced
by this assessment, not previously named on `docs/roadmap.md`: explicit DPDP Act / CERT-In
obligation content and an explicit international-standard crosswalk. See [Roadmap
Validation](#roadmap-validation).

## Platform Capability Matrix

| Capability | PRSMTD Status | ERM Specification | Final Status |
|---|---|---|---|
| Identity & Tenancy | Built | Reused | Complete |
| Multi-Tenancy (RLS) | Built | Reused | Complete |
| Governance Ledger / Maker-Checker | Built | Reused | Complete |
| RBAC (platform/tenant/module) | Built | Reused | Complete |
| Module Framework (manifest, ownership guards) | Built | Reused | Complete |
| Audit Trail & Observability (trace contract) | Built | Reused (+ Extended by `AUDIT`'s system-trace evidence type) | Complete |
| Authentication (JWT) | Built | Reused | Complete |
| Risk Register / Enterprise Risk Management | Not Built | Specified (`RISK`) | Planned |
| Control Library | Not Built | Specified (`CONTROLS`) | Planned |
| Compliance / Regulatory Obligations | Not Built | Specified (`COMPLIANCE`) | Planned |
| Audit Management | Not Built | Specified (`AUDIT`) | Planned |
| Cybersecurity Governance (findings/vulnerability management, security baselines, security policy taxonomy) | Not Built | Specified (`SECURITY`) | Planned |
| Privileged Access Management | Not Built (PRSMTD has per-realm least-privilege service accounts — adjacent, not equivalent) | Specified (`SECURITY` — `SecurityAccessGrant`) | Planned |
| Secrets/Key/Certificate Governance (ownership, rotation, expiry tracking) | Partially Built (PRSMTD: `encryption_keys`/`encryption_key_versions`, Production Credential Policy, Wildcard TLS Architecture — see `system.md` §7, §11) | Specified (`SECURITY` — `SecurityAsset`, governance layer only, does not hold credential material) | Planned |
| Policy Management (authoring, versioning, review, acknowledgement, exceptions) | Not Built | Specified (`POLICY`) | Planned |
| Incident / Issue / CAPA (intake, RCA, issue tracking, CAPA lifecycle, escalation) | Not Built | Specified (`INCIDENT`) | Planned |
| Third-Party Risk (vendor lifecycle, due diligence, risk/security/compliance assessment, contract/SLA tracking, ongoing monitoring, reassessment) | Not Built | Specified (`TPR`) | Planned |
| Business Continuity (critical service register, BIA, RTO/RPO, dependency mapping, continuity strategy, BCP/DR plan lifecycle, crisis activation, exercises/testing, exceptions) | Not Built | Specified (`BCP`) | Planned |
| Reporting (report/dashboard catalogue, field-level provenance, generation, distribution) | Not Built | Specified (`REPORTING`, added Session 14) | Planned |
| Analytics (KPI/metric catalog, threshold/banding measurement, dashboard visualization composition) | Not Built | Specified (`ANALYTICS`, added Session 16) | Planned |
| Document / Object Storage (evidence binaries) | Not Built (confirmed absent) | Not Specified — flagged as a required new PRSMTD capability by three specs | Not Started |
| Records Retention Schedule (cross-module) | Not Built | Not Specified — named explicitly as a real gap by `11-compliance`/`13-audit` | Not Started |
| Notification / Alerting | Not Built (attempted, then retired) | Not Specified | Not Started |
| SIEM / Automated Threat Detection / Security Event Correlation | Not Built | Not Specified — named for the first time by `09-security/01-*`; `SecurityFinding.source = SIEM_ALERT` reserves the slot only | Not Started |
| ABAC (attribute-based access control) | Not Built (RBAC only, three closed domains — system.md §8) | Not Specified — named as future extensibility only by `09-security/01-*` | Not Started |
| Scheduled-Job / Batch-Execution Mechanism | Not Built (confirmed absent) | Not Specified — named for the first time by `14-reporting/01-*` Assumption 8; `ReportSchedule` tracks due dates only | Not Started |
| Generic PDF/CSV Export-Rendering Pipeline | Not Built (confirmed absent) | Not Specified — named for the first time by `14-reporting/01-*` Assumption 9; the unresolved `system.md §18` PF-CT-3/PF-CW-8 evidence-pack contract is the closest conceptual analog | Not Started |
| Privacy Management (DPDP Act) | Not Built | Not Specified | Not Started |

## Compliance Coverage Matrix

| Regulation / Standard | Clause / Control | Current PRSMTD | ERM Specification | Build Status | Compliance Coverage | Covered By | Remaining Roadmap Work |
|---|---|---|---|---|---|---|---|
| SEBI *Risk Management System* circular (MFD/CIR/15/19133/2002) | Independent risk management function; risk taxonomy; Board/Trustee reporting cadence | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | PRSMTD governance ledger/RBAC (`system.md §3,§8`) + ERM `RISK` module | Implement `RISK` module in PRSMTD |
| SEBI *Risk Management System* circular, Appendix A Part 1 item 1 | Disaster Recovery and Business Contingency Plans — mandatory off-site backup, tested/evaluated plan, Day-1 critical-function coverage (NAV, redemption, settlement) | Not Implemented | Specified (added Session 13) | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `BCP` module | Implement `BCP` module in PRSMTD |
| Annexures to Master Circular §1.3.4.1 | Three lines of defense; dedicated internal auditor; non-compliance rate; Rectification Index | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `AUDIT` module | Implement `AUDIT` module in PRSMTD |
| Annexures §2.5 / §2.11 | Operational Risk controls; Financial Reporting Risk / ICFR, segregation of duties | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `CONTROLS` module | Implement `CONTROLS` module in PRSMTD |
| Annexures §2.6 | Compliance Risk — 17 mandatory policy domains, filing responsibilities, AML/CFT program, quarterly/half-yearly alert reporting | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `COMPLIANCE` module | Implement `COMPLIANCE` module in PRSMTD |
| Annexures §2.9 | Outsourcing Risk — mandatory pre-/post-outsourcing due diligence, Board-approved Outsourcing Policy elements, dedicated vendor ownership, structured SLA benchmarking, documented and monitored remediation | Not Implemented | Specified (added Session 12) | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `TPR` module | Implement `TPR` module in PRSMTD |
| Annexures, System Audit Program Checklist §§1–8 | IT Governance, Information Security, Access Management, Change Management, Incident Management, Backup & Recovery, Job Processing, BCP/DR | Not Implemented | Specified (control taxonomy in `CONTROLS`; audit scope in `AUDIT`; Incident Management domain now in `INCIDENT`, added Session 11; BCP/DR item 8's plan/BIA/RTO-RPO/testing side now in `BCP`, added Session 13) | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `CONTROLS` + `AUDIT` + `INCIDENT` + `BCP` | Implement all four modules |
| Annexure 8, clause 55 (SEBI/HO/IMD/DF2/CIR/P/2019/57) | Semi-annual System Audit by CISA/CISM/CERT-IN-empanelled auditor; SEBI filing within 3 months of FY end | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `AUDIT` module (`engagement_type = SYSTEM_AUDIT`) | Implement `AUDIT` module; wire actual SEBI filing/export mechanism (not designed — see `13-audit` Future Extension Points) |
| Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs (2019) | Cyber security policy, technical/organizational controls | Not Implemented | Partial — scope-level citation only (source PDF is scanned/image-only in this environment) | 🔵 Partially Built (specified at scope level, not clause level) | Partially Supported | ERM `CONTROLS` (`Cyber Security` control family) + ERM `SECURITY` (Security Policy Domain taxonomy, security findings/vulnerability management, privileged access, secrets/key/certificate governance — added Session 6) + ERM `POLICY` (the versioned, governed Information Security Policy *document* itself, tagged to the relevant Security Policy Domain — added Session 10, same scope-level precision) | Manually re-verify clause-level content against the source document before implementation; `12-controls` Assumption 5, inherited by `09-security/01-*` and `23-policy/01-*` |
| DPDP Act, 2023 | Personal data processing, consent, breach notification for investor PII | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | New: author DPDP-specific obligation content in `COMPLIANCE` (architecture can host it — `Obligation`/`ObligationCategory` — content does not exist) or a dedicated Privacy Management module per `CLAUDE.md`'s long-term vision |
| CERT-In Directions (cyber incident reporting) | Mandatory 6-hour incident reporting to CERT-In | Not Implemented | Partial — `INCIDENT` (Session 11) supplies the incident timeline (`detected_date`, escalation timestamps) a filing obligation would cite; the filing obligation content/deadline logic itself is not specified | 🔵 Partially Built (timeline substrate only) | Partially Supported (substrate only) | ERM `INCIDENT` (timeline/escalation substrate) | New: author CERT-In-specific filing-obligation content in `COMPLIANCE`, referencing `INCIDENT`'s existing timeline data |
| Companies Act, 2013 | Board governance, related-party transactions, statutory audit | Not Implemented | Not Specified (tangential ICFR overlap only, via SEBI-sourced §2.11, not a Companies Act citation) | ❌ Not Yet Specified | Not Supported | None | Not currently on `docs/roadmap.md`; flagged by this assessment, not previously named |
| Income Tax Act requirements | Tax compliance obligations applicable to AMC/schemes | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | Not currently on `docs/roadmap.md`; flagged by this assessment, not previously named |
| ISO/IEC 27001 | Information security management system | Not Implemented | Not Specified (no explicit citation or crosswalk in any spec) | ❌ Not Yet Specified | Early Stage (architecturally compatible: `CONTROLS`' taxonomy-driven, testable, evidenced control library structurally resembles an ISMS control set; `POLICY`, added Session 10, now gives Annex A.5 a concrete owning module — see Control-Level Matrix — narrowing, not closing, this gap) | None (structural resemblance only; no explicit Annex A crosswalk) | New: author an explicit ISO 27001 Annex A crosswalk once a real implementation exists to map against |
| ISO/IEC 27701 | Privacy information management (ISO 27001 extension) | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | Same as DPDP row — no privacy-specific ERM content exists yet |
| ISO 22301 | Business continuity management | Not Implemented | Specified (`BCP`, added Session 13 — BIA, RTO/RPO, dependency mapping, continuity strategy, plan lifecycle, exercises/testing, exceptions) | 🟡 Specified – Yet to Build | Partially Supported (structurally close, no explicit Annex crosswalk) | ERM `BCP` module | Implement `BCP` module; author an explicit ISO 22301 crosswalk if international positioning is pursued |
| ISO 31000 | Risk management principles and process | Not Implemented | Not Specified (no explicit citation; `RISK`'s identify/score/treat/monitor structure is process-analogous) | ❌ Not Yet Specified | Early Stage (architecturally compatible, not explicitly mapped) | None (structural resemblance only) | New: author an explicit ISO 31000 process crosswalk if pursued as a stated compliance claim |
| COBIT | IT governance and management objectives | Not Implemented | Not Specified | ❌ Not Yet Specified | Early Stage (architecturally compatible via `CONTROLS`' IT/cyber control families, not explicitly mapped) | None (structural resemblance only) | New: author an explicit COBIT crosswalk if pursued |
| NIST Cybersecurity Framework | Identify/Protect/Detect/Respond/Recover | Not Implemented | Not Specified | ❌ Not Yet Specified | Early Stage (Identify≈`RISK`, Protect/Detect≈`CONTROLS`, Respond partially≈`AUDIT` findings, Recover≈reserved `BUSINESS CONTINUITY`, structurally not explicitly mapped) | None (structural resemblance only) | New: author an explicit NIST CSF crosswalk if pursued |

## Control-Level Matrix

A representative sample of individual controls, not an exhaustive enumeration — see each
module spec's own Functional Requirements table for the complete, authoritative list.

| Regulation | Control | Already Built | Specified | Yet to Build | Future Module | PRSMTD Capability | ERM Module |
|---|---|---|---|---|---|---|---|
| RMS circular Appendix A Pt.1 §1 | Independent risk management function (organizationally separate role) | No | Yes | Yes | — | RBAC module-role model (`system.md §8`) | `RISK` (`RISK_CHECKER`) |
| RMS circular §III | Risk appetite thresholds trigger governed escalation | No | Yes | Yes | — | Governance ledger (`system.md §3`) | `RISK` |
| Annexures §2.11.2.1(ii) | Segregation of duties in fund-accounting function | No | Yes | Yes | — | `approved_by <> created_by` constraint | `CONTROLS` |
| Annexures §2.11.2.1(iii) | Documented, regularly tested internal controls over financial reporting | No | Yes | Yes | — | Governance ledger + audit trail | `CONTROLS` (`ControlTest`) |
| System Audit Program Checklist §3 (Access Management) | Access grant/revocation logged with SoD | No | Yes | Yes | — | Governance ledger, audit trail | `CONTROLS` |
| Annexures §2.6.2.1(i) a–q | 17 mandatory compliance policy domains tracked as governed obligations | No | Yes | Yes | — | Governance ledger, RBAC | `COMPLIANCE` |
| Annexures §2.6.2.1(iv) a–b | Quarterly/half-yearly alert reporting to Trustees/SEBI | No | Yes | Yes | — | — (export/filing mechanism not designed) | `COMPLIANCE` |
| Annexures §1.3.4.1.1(ii)(a)–(c) | Dedicated internal auditor examines scheme- and AMC-level risk and policy compliance | No | Yes | Yes | — | Governance ledger, RBAC | `AUDIT` |
| Annexures §1.3.4.1.1(ii)(d)–(f) | Non-Compliance Rate computed and compared as a Rectification Index across audits | No | Yes | Yes | — | — | `AUDIT` |
| Annexure 8, clause 55 | Semi-annual System Audit by CISA/CISM/CERT-IN-empanelled auditor | No | Yes | Yes | — | RBAC (external-agency role assignment accommodation) | `AUDIT` |
| Cyber Security and Cyber Resilience Framework (scope-level) | Time-bound, governed privileged access grants (PAM) | No | Yes | Yes | — | Governance ledger (`system.md §3`); PRSMTD per-realm least-privilege service accounts (adjacent, not equivalent) | `SECURITY` (`SecurityAccessGrant`) |
| Cyber Security and Cyber Resilience Framework (scope-level) | Technical vulnerability detection and governed remediation | No | Yes | Yes | — | — (scanning tooling itself remains unbuilt) | `SECURITY` (`SecurityFinding`) |
| Annexures §2.6.2.1(i)(g)/(iii) a–d | Employee Code of Conduct / AML-CFT awareness acknowledgement | No | Yes | Yes | — | Governance ledger for publication; ungoverned individual record for the acknowledgement itself | `POLICY` (`PolicyVersion`, `PolicyAcknowledgement`) |
| System Audit Program Checklist §5 | Incident intake, investigation, and closure | No | Yes | Yes | — | Governance ledger, RBAC | `INCIDENT` (`Incident`, `RootCauseAnalysis`) |
| Annexures §1.3.4.1.1(ii)(d)–(f) | Structured corrective/preventive action with independent closure verification and later effectiveness review, feeding the Rectification Index pattern at the individual-remediation level | No | Yes | Yes | — | Governance ledger, RBAC | `INCIDENT` (`CAPA`, `CAPAClosureVerification`, `CAPAEffectivenessReview`) |
| Annexures §2.9.3.1(ii)–(iv) | Mandatory pre-outsourcing due diligence gating vendor activation, with a dedicated accountable vendor owner | No | Yes (Session 12) | Yes | — | Governance ledger, RBAC | `TPR` (`Vendor`, `VendorAssessment`) |
| Annexures §2.9.3.1(v)(c)–(d) | Structured SLA benchmarking tool with documented, monitored remediation | No | Yes (Session 12) | Yes | — | Governance ledger, RBAC | `TPR` (`VendorSLA`, `VendorSLAMeasurement`, `VendorException`) |
| RMS circular Appendix A Pt.1 §1; Annexure 8 item 8c | Business Impact Analysis identifying critical processes, dependencies, RTO/RPO, approved by business/technology/risk teams | No | Yes (Session 13) | Yes | — | Governance ledger, RBAC | `BCP` (`CriticalBusinessService`, `BusinessImpactAnalysis`) |
| Annexure 8 item 8d | BCP/DR plan tested via table-top review, simulation, DR drill, alternate-site recovery test, system recovery test, with documented, monitored results | No | Yes (Session 13) | Yes | — | Governance ledger, RBAC | `BCP` (`ContinuityExercise`, `ContinuityException`), corroborating `CONTROLS`' own effectiveness test on its seeded "Business Continuity & Disaster Recovery" control family |
| DPDP Act | Consent management, breach notification for investor PII | No | No | Yes | Privacy Management (unscoped) | Document/object storage would also be needed for consent records | None yet |
| CERT-In Directions | 6-hour cyber incident reporting | No | Partial (`INCIDENT`'s timeline/escalation substrate only, Session 11) | Yes | `COMPLIANCE` (filing obligation content) | — | `INCIDENT` (`Incident.detected_date`, `Escalation`) |
| Companies Act / statutory audit | Board governance, related-party transaction controls | No | No | Yes | Unscoped — out of this repository's current SEBI-AMC profile | — | None yet |
| ISO 27001 Annex A (representative: A.5 policies) | Formal, versioned information security policy | No | Yes (Session 10 — `POLICY`'s governed `Policy`/`PolicyVersion` lifecycle, tagged to a `SecurityPolicyDomain`) | Yes | `POLICY` (authored) | — | Implement `POLICY` module; author an explicit Annex A crosswalk if ISO 27001 positioning is pursued |
| ISO 22301 | RTO/RPO-defined, tested continuity plan | No | Yes (Session 13 — `BCP`'s governed `CriticalBusinessService`/`BusinessImpactAnalysis`/`ContinuityPlan`/`ContinuityExercise` model) | Yes | `BCP` (authored) | `CONTROLS`' BCP/DR control family tests the plan (`ContinuityExercise.control_ref_id` corroborates it) | Implement `BCP` module; author an explicit ISO 22301 crosswalk if pursued |

## Enterprise Capability Matrix

| Enterprise Capability | Current PRSMTD | ERM Specified | Build Status | Future Module |
|---|---|---|---|---|
| Risk Register | Not Built | Specified | Planned | `RISK` (authored) |
| Control Library | Not Built | Specified | Planned | `CONTROLS` (authored) |
| Compliance Obligations | Not Built | Specified | Planned | `COMPLIANCE` (authored) |
| Audit Management | Not Built | Specified | Planned | `AUDIT` (authored) |
| Cybersecurity Governance | Not Built | Specified | Planned | `SECURITY` (authored, Session 6) |
| Policy Management | Not Built | Specified | Planned | `POLICY` (authored, Session 10) |
| Incident Management (intake, RCA, issue tracking, CAPA, escalation) | Not Built | Specified | Planned | `INCIDENT` (authored, Session 11) |
| Third-Party Risk (vendor lifecycle, due diligence, risk/security/compliance assessment, contract/SLA tracking, ongoing monitoring, reassessment) | Not Built | Specified | Planned | `TPR` (authored, Session 12) |
| Business Continuity (critical service register, BIA, RTO/RPO, dependency mapping, continuity strategy, BCP/DR plan lifecycle, crisis activation, exercises/testing, exceptions) | Not Built | Specified | Planned | `BCP` (authored, Session 13) |
| Executive Reporting | Not Built | Specified (`REPORTING` — Board & Executive GRC Summary, Report Catalogue's `EXECUTIVE`-category rows, `DashboardDefinition`) | Planned | `14-reporting` (authored, Session 14) |
| Regulatory Reporting | Not Built | Specified (`REPORTING` — approval-before-submission governance, distribution record-keeping, evidence-ready export construction via `ReportCitation`) | Planned | `14-reporting` (authored, Session 14) |
| Interactive Analytics / KPI Dashboards | Not Built | Specified (`ANALYTICS` — 48-row KPI/Metric Catalogue, `MetricValue` threshold/banding, `MetricView` heat-map/trend/drill-down composition, activates `REPORTING`'s `DashboardWidget.widget_type = METRIC_REFERENCE` slot with zero additive change) | Planned | `15-analytics` (authored, Session 16) |
| Privacy Management | Not Built | Not Specified | Not Started | Unscoped — named in `CLAUDE.md`'s long-term vision only |
| AI-Assisted Risk Analytics | Not Built | Not Specified | Not Started | `16-ai` (README scaffold only) |

## Regulatory Readiness Matrix

| Regulation / Framework | Current Platform Readiness | Future Platform Readiness (after current ERM specs implemented) | Explanation |
|---|---|---|---|
| SEBI *Risk Management System* circular | Not Started | Mostly Ready | `RISK` is fully specified against this circular's own text; only implementation remains. |
| SEBI Master Circular Annexures §1.3.4.1 / §2.5 / §2.11 / §2.6 / §2.9 / System Audit §§1–8 | Not Started | Mostly Ready | Each clause has a directly-cited, implementation-ready spec (`CONTROLS`, `COMPLIANCE`, `AUDIT`, `TPR` for §2.9 Outsourcing Risk (Session 12), and now `BCP` for System Audit item 8 BCP/DR (Session 13)); not "Ready" because none is implemented and the export/filing mechanisms to SEBI/Board/Trustees are named as source views, not built. |
| SEBI *Risk Management System* circular, Appendix A Part 1 item 1 (DR/BCP) | Not Started | Mostly Ready | `BCP` is fully specified against this clause's own mandatory text (off-site backup, tested plan, Day-1 critical-function coverage), mined at clause level for the first time in Session 13; only implementation remains. |
| SEBI Cyber Security and Cyber Resilience Framework (2019) | Not Started | Partially Ready | Cited at scope level only in `CONTROLS` and, as of Session 6, `SECURITY`; source PDF's clause-level text could not be extracted in this environment — manual verification required before implementation, per `12-controls` Assumption 5 (inherited by `09-security/01-*`). `SECURITY` adds the governance layer (findings, PAM, secrets/key/cert governance) at the same scope-level precision, not clause-level. |
| DPDP Act, 2023 | Not Started | Not Started | No spec addresses personal-data processing, consent, or breach notification for investor PII at all. |
| CERT-In Directions | Not Started | Early Stage | `INCIDENT` (Session 11) now supplies the incident-timeline/escalation substrate a 6-hour filing obligation would cite; the filing-obligation content and deadline logic itself remains an unscoped `COMPLIANCE` extension. |
| Companies Act, 2013 | Not Started | Not Started | Out of this repository's current SEBI-AMC-profile scope; only tangential ICFR overlap exists via a SEBI-sourced citation, not a Companies Act citation. |
| Income Tax requirements | Not Started | Not Started | Not addressed by any spec. |
| ISO/IEC 27001 | Not Started | Early Stage | `CONTROLS`' structure (taxonomy, testable, evidenced) is generically ISMS-shaped, and `POLICY` (Session 10) now gives Annex A.5 (policy) a concrete, governed, versioned owning module — but no explicit Annex A crosswalk exists for either. |
| ISO/IEC 27701 | Not Started | Not Started | No privacy-specific content exists to extend an ISMS toward. |
| ISO 22301 | Not Started | Partially Ready | `BCP` (Session 13) specifies BIA, RTO/RPO, dependency mapping, continuity strategy, a governed plan lifecycle, and exercise testing — structurally the closest match to an international standard's own vocabulary any ERM spec has produced — but no explicit clause-level Annex crosswalk exists. |
| ISO 31000 | Not Started | Early Stage | `RISK`'s process is structurally analogous (identify/score/treat/monitor) but not explicitly mapped to ISO 31000's own process model. |
| COBIT | Not Started | Early Stage | `CONTROLS`' IT/cyber control families are structurally similar to COBIT governance/management objectives; no explicit mapping exists. |
| NIST Cybersecurity Framework | Not Started | Early Stage | Identify/Protect/Detect functions have plausible ERM-module analogues (`RISK`, `CONTROLS`); Respond is partially covered (`AUDIT` findings, `INCIDENT`); Recover now has a direct analogue in `BCP` (Session 13). No explicit mapping exists. |

## Gap Assessment

| Category | Gap | Future Module | Roadmap Milestone | Dependency | Priority |
|---|---|---|---|---|---|
| Technical | Platform document/object storage capability | New PRSMTD capability (not an ERM module) | Not on `docs/roadmap.md` as a named milestone; tracked as a recurring Assumption/gap across `12-controls`, `11-compliance`, `13-audit` | None — can be built independently of any ERM module | High — blocks retrievable evidence for every module already specified |
| Business | Two additive changes proposed by `11-compliance` | — | **Closed (Session 6)** — `docs/roadmap.md` Next Milestone, item 1 | None — one-line enum value, one endpoint | Resolved — applied to `10-risk`/`12-controls`; see each document's Amendment log |
| Business | Three additive changes proposed by `09-security/01-*` (`Risk.source = SECURITY_FINDING`; `AuditEvidence`/`Finding` extension on `13-audit`; tenth-context row on `04-domain-model`) | — | **Closed (Session 7)** — `docs/roadmap.md` Next Milestone, item 1 | None — one-line enum value, one enum value + one column, one bounded-context-map row | Resolved — applied to `10-risk`/`13-audit`/`04-domain-model`; see each document's Amendment log |
| Regulatory | DPDP Act content absent | Unscoped (extend `COMPLIANCE`, or a dedicated Privacy Management module) | **Not currently on `docs/roadmap.md`** — new finding, see [Roadmap Validation](#roadmap-validation) | `COMPLIANCE` (architecture ready; content is not) | Medium-High — real statutory exposure for any AMC handling investor PII |
| Regulatory | CERT-In 6-hour incident reporting content absent | `COMPLIANCE` (filing obligation) + `INCIDENT` (reserved, timeline tracking) | **Not currently on `docs/roadmap.md`** — new finding | `INCIDENT`/`ISSUE`/`CAPA` context (not yet specified) | Medium — depends on a context not yet scoped |
| Governance | `system.md §18` Product Framework reconciliation still open | — (ADR, not a module) | `docs/roadmap.md` Open Decisions | None | Low urgency — doesn't block current MVP scope |
| Architecture | Persona-to-module-role mapping convention confirmed 5 times but never formalized as an ADR | — | `docs/roadmap.md` Open Decisions | None | Low urgency, low effort |
| Operational | Records Retention Schedule (cross-module statutory retention periods) unspecified | Cross-module capability, not one ERM module | `docs/roadmap.md` Assumption 14/17 (carried), Future Extension Points across `11-compliance`/`13-audit` | Depends on which record types are in scope across all modules | Medium — grows more urgent as more modules ship real data |
| Reporting | No Reporting module authored; aggregation layer over the nine business-domain modules not designed — **Closed (Session 14)**, see `14-reporting/01-reporting-management.md` | `REPORTING` (authored) | `docs/roadmap.md` Master Execution Plan Phase 11 | All nine authored business-domain modules (Conformist, read-only) | Resolved |
| Analytics | `15-analytics` (KPI/metric catalog, threshold/banding measurement, dashboard visualization composition) — **Closed (Session 16)**, see `15-analytics/01-analytics-management.md` | `15-analytics` (authored) | `docs/roadmap.md` Master Execution Plan Phase 11 (second document) | `14-reporting` (authored; `DashboardWidget.widget_type = METRIC_REFERENCE` slot activated with zero additive change) | Resolved |
| Technical | Generic formula-execution/BI-computation engine | New PRSMTD capability (not an ERM module) | **Not currently on `docs/roadmap.md`** — new finding, named by `15-analytics/01-*` | None — can be built independently of any ERM module | Medium — `MetricDefinition.formula_description` reserves the metadata slot but has no execution engine to run against |
| Operational | Roster-of-required-acknowledgers capability (needed to compute a true Policy Acknowledgement Completion rate) | Cross-module capability, not one ERM module | **Not currently on `docs/roadmap.md`** — new finding, named by `15-analytics/01-*` (`MTR-POL-001`) | `23-policy` (already states it does not design this) | Low-Medium — the numerator is already computable; only the denominator is missing |
| Architecture | `04-domain-model`'s Bounded Context Map does not yet name `ANALYTICS` as an eleventh bounded context | `04-domain-model/01-enterprise-domain-model.md` | **Proposed, not applied (Session 16)** — proposed by `15-analytics/01-*` Assumption 3 | None — additive row, does not change any existing row | Resolved in the new spec's own text; awaiting a later session's explicit application, same pattern as every prior status-label proposal |
| Business | Two additive changes proposed by `14-reporting/01-*` (`GET /risks/{id}/reference` on `10-risk`; `GET /findings/{id}/reference` and `GET /engagements/{id}/reference` on `13-audit`) — **Closed (Session 15)** | — | `docs/roadmap.md` Session 15 entry | Resolved | Resolved — see `10-risk/01-*` and `13-audit/01-*`'s own Amendment logs |
| Architecture | `04-domain-model`'s Bounded Context Map labeled `REPORTING` "(reserved)" — **Closed (Session 15)**, the fifth and last such amendment applied | `04-domain-model/01-enterprise-domain-model.md` | `docs/roadmap.md` Session 15 entry | Resolved | Resolved — all ten bounded contexts now labeled "(authored)" |
| Technical | Scheduled-job/cron/batch-execution mechanism for periodic report generation | New PRSMTD capability (not an ERM module) | **Not currently on `docs/roadmap.md`** — new finding, named by `14-reporting/01-*` | None — can be built independently of any ERM module | Medium — `ReportSchedule` reserves the due-date-tracking slot but has no execution mechanism to trigger from |
| Technical | Generic PDF/CSV/export-rendering pipeline | New PRSMTD capability (not an ERM module), possibly reconciled with the unresolved `system.md §18` PF-CT-3/PF-CW-8 evidence-pack contract | **Not currently on `docs/roadmap.md`** — new finding, named by `14-reporting/01-*` | None | Medium — `ReportDefinition.output_formats`/`ReportInstance.output_format` reserve the metadata slot but have no rendering engine to produce an artifact |
| Functional | `BUSINESS CONTINUITY` context reserved but not authored — SEBI DR/BCP mandate (flagged since `10-risk`) remains unspecified for the *plan* side — **Closed (Session 13)**, see `26-business-continuity/01-business-continuity-management.md` | `BCP` (authored) | `docs/roadmap.md` Master Execution Plan Phase 9 | `RISK`, `CONTROLS` (both authored) | Resolved |
| Functional | `THIRD-PARTY RISK` reserved but unspecified — **Closed (Session 12)**, see `25-third-party-risk/01-third-party-risk-management.md` | `TPR` (authored) | `docs/roadmap.md` Master Execution Plan Phase 8 | See `04-domain-model` Dependency Rules | Resolved |
| Business | Six additive changes proposed by `26-business-continuity/01-*` — **Closed (Session 15)**: `Risk.source = BUSINESS_CONTINUITY` (`10-risk`); `Control.source = BUSINESS_CONTINUITY` plus a continuity-link endpoint (`12-controls`); "Technology & Operational Resilience" `ObligationCategory`/`PolicyCategory` (`11-compliance`/`23-policy`); `AuditUniverseEntry.related_critical_service_ref_id` (`13-audit`); `GET /incidents/{id}/reference` (`24-incident-issue-capa`) | — | `docs/roadmap.md` Session 15 entry | Resolved | Resolved — see each target document's own Amendment log |
| Architecture | `04-domain-model`'s Bounded Context Map labeled `BUSINESS CONTINUITY` "(reserved)" — **Closed (Session 15)** | `04-domain-model/01-enterprise-domain-model.md` | `docs/roadmap.md` Session 15 entry | Resolved | Resolved |
| Business | Six additive changes proposed by `25-third-party-risk/01-*` — **Closed (Session 15)**: `Risk.source = THIRD_PARTY` (`10-risk`); `Control.source = THIRD_PARTY_RISK` plus a vendor-link endpoint (`12-controls`); an obligation mirror-registration generalization (`11-compliance`); `SecurityFinding.linked_vendor_id` (`09-security`, deliberately not resolved by `SECURITY` itself — cycle avoidance); `AuditUniverseEntry.related_vendor_ref_id` (`13-audit`); `Incident.vendor_ref_id` (`24-incident-issue-capa`, same cycle-avoidance reasoning) | — | `docs/roadmap.md` Session 15 entry | Resolved | Resolved — see each target document's own Amendment log |
| Architecture | `04-domain-model`'s Bounded Context Map labeled `THIRD-PARTY RISK` "(reserved)" — **Closed (Session 15)**, plus a closing note on the `VendorCategory`/`RiskCategory` question | `04-domain-model/01-enterprise-domain-model.md` | `docs/roadmap.md` Session 15 entry | Resolved | Resolved |
| Business | `CONTROLS`-side endpoint to populate `module_controls_control_policy_link` (`POST /controls/{id}/policy-links`) — **Closed (Session 15)** | — | `docs/roadmap.md` Session 15 entry | Resolved | Resolved — see `12-controls/01-*`'s own Amendment log |
| Architecture | `04-domain-model`'s Bounded Context Map labeled `POLICY` "(reserved)" — **Closed (Session 15)** | `04-domain-model/01-enterprise-domain-model.md` | `docs/roadmap.md` Session 15 entry | Resolved | Resolved |
| Business | `capa_ref_id` column plus initiating endpoint on `ControlException` (`12-controls`), `ComplianceException` (`11-compliance`), and `PolicyException` (`23-policy`) — **Closed (Session 15)** | — | `docs/roadmap.md` Session 15 entry | Resolved | Resolved — see each target document's own Amendment log |
| Business | Initiating endpoint on `FollowUpAction` (`13-audit`) and `SecurityFinding` (`09-security`) — **Closed (Session 15)** | — | `docs/roadmap.md` Session 15 entry | Resolved | Resolved |
| Architecture | `04-domain-model`'s Bounded Context Map labeled `INCIDENT`/`ISSUE`/`CAPA` "(reserved)" — **Closed (Session 15)** | `04-domain-model/01-enterprise-domain-model.md` | `docs/roadmap.md` Session 15 entry | Resolved | Resolved |
| Security | No dedicated `09-security/` cross-cutting spec exists despite five specs each independently committing to the same security model | — (consolidation, not a new module) | **Closed (Session 6)** — `docs/roadmap.md` Next Milestone, item 2 | All five prior authored specs | Resolved — `09-security/01-security-management.md` authored; consolidates identity/authN/RBAC/SoD/data-classification content and adds the `SECURITY` module (findings, PAM, secrets/key/cert governance) |
| Technical | No explicit crosswalk to ISO 27001/27701/22301/31000, COBIT, or NIST CSF exists in any spec | — (crosswalk document, not a new module) | **Not currently on `docs/roadmap.md`** — new finding | Depends on which specs are stable enough to map against | Low-Medium — only relevant if international-market positioning is pursued (per `CLAUDE.md`'s stated long-term multi-vertical vision); `09-security/01-*`'s `framework_tag` field is designed to host this mapping when pursued |
| Technical | No SIEM / automated threat-detection / security-event-correlation capability exists in PRSMTD; general notification/alerting was attempted platform-wide and explicitly retired (PR-RESET-02) | New PRSMTD capability (not an ERM module) | **Not currently on `docs/roadmap.md`** — new finding, named by `09-security/01-*` | None — can be built independently of any ERM module | Medium — `SecurityFinding.source = SIEM_ALERT` reserves the slot but has no tooling to feed it |
| Governance | ABAC (attribute-based access control) unimplemented — PRSMTD provides RBAC only (three closed domains, system.md §8) | New PRSMTD capability (not an ERM module) | **Not currently on `docs/roadmap.md`** — new finding, named by `09-security/01-*` as future extensibility only | None | Low urgency — no concrete regulatory or tenant requirement currently demands attribute-conditioned access |
| Architecture | `04-domain-model`'s Bounded Context Map did not reserve a `SECURITY` context, despite `CLAUDE.md`'s long-term vision naming Cybersecurity Governance as its own GRC capability | `04-domain-model/01-enterprise-domain-model.md` | **Closed (Session 7)** — proposed by `09-security/01-*` Assumption 1; applied as a tenth bounded-context row (see `04-domain-model/01-*`'s own Amendment Log) | None — additive row, does not change any existing row | Resolved — `04-domain-model` now names ten contexts total (five authored, five reserved) |
| Architecture | `04-domain-model` had never been revisited after `COMPLIANCE` (Session 4) and `AUDIT` (Session 5) were authored — its Bounded Context Map, Cross-Context APIs table, and Evidence-as-a-Cross-Cutting-Concept section still labeled both "(reserved)" with dashed/unactivated edges, and `10-risk`'s own Integration Points table still listed its long-activated `CONTROLS`/`AUDIT` rows as "Reserved" | `04-domain-model/01-enterprise-domain-model.md`, `10-risk/01-enterprise-risk-management.md` | **Closed (Session 7)** — found and corrected during this session's Phase 2 architecture consistency review, not previously named on `docs/roadmap.md` | None — status-label and cross-reference corrections only | Resolved — no entity, aggregate, or relationship type changed, only stale prose describing an already-superseded state |

## Roadmap Validation

Comparing this assessment's gaps against `docs/roadmap.md`'s current Next Milestone and Open
Decisions sections (both updated earlier this session):

| Gap identified by this assessment | Already on `docs/roadmap.md`? |
|---|---|
| Two additive changes to `10-risk`/`12-controls` | **Yes** — Next Milestone item 1 — **closed (Session 6)** |
| `09-security/` consolidation | **Yes** — Next Milestone item 2 — **closed (Session 6)**, see `09-security/01-security-management.md` |
| Three additive changes proposed by `09-security/01-*` (`Risk.source = SECURITY_FINDING`; `13-audit` evidence extension; `04-domain-model` tenth-context row) | **Yes** — Next Milestone item 1 — **closed (Session 7)** |
| SIEM/security-event-correlation capability; ABAC | **Yes** — named in Next Milestone as still-open capability gaps, neither urgent nor blocking (see `docs/roadmap.md` Assumption 22) |
| `POLICY` module | **Yes** — Master Execution Plan Phase 6 — **closed (Session 10)**, see `23-policy/01-policy-management.md` |
| `INCIDENT`/`ISSUE`/`CAPA` module | **Yes** — Master Execution Plan Phase 7 — **closed (Session 11)**, see `24-incident-issue-capa/01-incident-issue-capa-management.md` |
| `CONTROLS`-side policy-link endpoint; `04-domain-model` `POLICY` status-label amendment | **Yes** — proposed by `23-policy/01-*` (Session 10); **closed (Session 15)**, see `12-controls/01-*` and `04-domain-model/01-*`'s own Amendment logs |
| `capa_ref_id` extensions to `12-controls`/`11-compliance`/`23-policy`; initiating endpoints on `13-audit`/`09-security`; `04-domain-model` `INCIDENT` status-label amendment | **Yes** — proposed by `24-incident-issue-capa/01-*` (Session 11); **closed (Session 15)**, see each target document's own Amendment log |
| `THIRD-PARTY RISK` module | **Yes** — Master Execution Plan Phase 8 — **closed (Session 12)**, see `25-third-party-risk/01-third-party-risk-management.md` |
| `Risk.source = THIRD_PARTY`; `Control.source = THIRD_PARTY_RISK` plus vendor-link endpoint; obligation mirror-registration generalization; `SecurityFinding.linked_vendor_id`; `AuditUniverseEntry.related_vendor_ref_id`; `Incident.vendor_ref_id`; `04-domain-model` `THIRD-PARTY RISK` status-label amendment | **Yes** — proposed by `25-third-party-risk/01-*` (Session 12); **closed (Session 15)**, see each target document's own Amendment log |
| `BUSINESS CONTINUITY` module | **Yes** — Master Execution Plan Phase 9 — **closed (Session 13)**, see `26-business-continuity/01-business-continuity-management.md` |
| `Risk.source = BUSINESS_CONTINUITY`; `Control.source = BUSINESS_CONTINUITY` plus continuity-link endpoint; "Technology & Operational Resilience" `ObligationCategory`/`PolicyCategory`; `AuditUniverseEntry.related_critical_service_ref_id`; `GET /incidents/{id}/reference` endpoint; `04-domain-model` `BUSINESS CONTINUITY` status-label amendment | **Yes** — proposed by `26-business-continuity/01-*` (Session 13); **closed (Session 15)**, see each target document's own Amendment log |
| `system.md §18` reconciliation | **Yes** — Open Decisions |
| Persona-to-module-role ADR | **Yes** — Open Decisions |
| Records Retention Schedule | **Yes** — carried Assumption across sessions, named explicitly by `11-compliance`/`13-audit` |
| Platform document/object storage | **Yes** — carried Assumption/Risk across sessions |
| `REPORTING` module | **Yes** — Master Execution Plan Phase 11 — **closed (Session 14)**, see `14-reporting/01-reporting-management.md` |
| `GET /risks/{id}/reference` on `10-risk`; `GET /findings/{id}/reference`/`GET /engagements/{id}/reference` on `13-audit`; `04-domain-model` `REPORTING` status-label amendment | **Yes** — proposed by `14-reporting/01-*` (Session 14); **closed (Session 15)**, see each target document's own Amendment log — the last of the nineteen additive changes and five status-label amendments this repository carried |
| Scheduled-job/batch-execution mechanism; generic PDF/CSV export-rendering pipeline | **No** — named for the first time by `14-reporting/01-*` (Session 14), not yet on `docs/roadmap.md` as a scoped capability build — genuine new PRSMTD platform capabilities, not additive spec changes, so unaffected by Session 15's consolidation |
| `15-analytics` (KPI/metric catalog, dashboard visualization layer) | Partially — named as a future section with an explicit dependency shape (`DashboardWidget.widget_type = METRIC_REFERENCE`), not yet a scoped candidate module with its own milestone number |
| **DPDP Act obligation content** | **No** — not named anywhere on `docs/roadmap.md` before this assessment |
| **CERT-In Directions obligation content** | **No** — not named anywhere on `docs/roadmap.md` before this assessment |
| **International standard crosswalk (ISO/COBIT/NIST)** | **No** — not named anywhere on `docs/roadmap.md` before this assessment |
| **Companies Act / Income Tax scope decision** | **No** — not named anywhere on `docs/roadmap.md` before this assessment (may be a deliberate, permanent out-of-scope decision rather than a gap — see `13-audit` Scope) |

**Recommendation** (not automatically applied to `docs/roadmap.md`, per this assessment's own
instructions): add DPDP Act and CERT-In Directions obligation content as a named future
candidate — likely scoped as an extension to `COMPLIANCE`'s existing, already-profile-
configurable `Obligation`/`ObligationCategory` taxonomy rather than a new module, since the
architecture to host this content already exists and only the seed content and regulatory
citation work is missing. Add the international-standard crosswalk as a lower-priority
candidate, explicitly contingent on whether multi-vertical/international positioning (per
`CLAUDE.md`'s long-term vision) becomes an active near-term goal rather than a standing
aspiration. **Session 6 update**: `docs/roadmap.md`'s Next Milestone was updated to add
`09-security/01-*`'s three proposed additive changes and its two named capability gaps
(SIEM/security-event correlation; ABAC) — unlike DPDP/CERT-In/crosswalk above, these were
tracked as an actionable roadmap item rather than left as a recommendation only, since they
follow the identical low-effort, precisely-scoped pattern the then-just-closed `11-compliance`
additive changes had already set precedent for. **Session 7 update**: all three of those
additive changes are now applied (see the Gap Assessment and Roadmap Validation rows above);
the SIEM and ABAC capability gaps remain open, correctly, since both are genuine new PRSMTD
platform capabilities, not additive spec changes — neither is urgent nor blocks any authored
module's MVP scope. **Session 10 update**: `docs/roadmap.md` Master Execution Plan Phase 6
(`POLICY`) is closed — `23-policy/01-policy-management.md` is authored. Two additive changes
this new spec itself proposed (a `CONTROLS`-side policy-link endpoint; the `04-domain-model`
`POLICY` status-label amendment) are **not** yet applied and are not yet named as their own
scheduled `docs/roadmap.md` phase — recommended for the same low-effort, precisely-scoped
treatment `11-compliance`'s and `09-security`'s own proposed additive changes already received
in a prior session, whenever a future session is explicitly authorized to apply them.
**Session 11 update**: `docs/roadmap.md` Master Execution Plan Phase 7 (`INCIDENT`/`ISSUE`/
`CAPA`) is closed — `24-incident-issue-capa/01-incident-issue-capa-management.md` is authored,
resolving the module-code naming question (`INCIDENT`) and making explicit, with a stated
reason, the complement-vs-replace decision that phase's own entry flagged as the highest-risk
design choice remaining in the repository. Five additive changes this new spec itself proposed
(`capa_ref_id` extensions to `12-controls`/`11-compliance`/`23-policy`; initiating-endpoint-only
proposals to `13-audit`/`09-security`; the `04-domain-model` `INCIDENT` status-label amendment)
are **not** yet applied and are not yet named as their own scheduled `docs/roadmap.md`
phases — recommended for consolidation into one future low-effort session alongside `23-policy`'s
own two still-unapplied proposals, whenever a future session is explicitly authorized to apply
them.
**Session 12 update**: `docs/roadmap.md` Master Execution Plan Phase 8 (`THIRD-PARTY RISK`) is
closed — `25-third-party-risk/01-third-party-risk-management.md` is authored (module code
`TPR`), grounded in the Annexures' dedicated §2.9 Outsourcing Risk section (not previously
mined by any frozen spec). Six additive changes this new spec itself proposed
(`Risk.source = THIRD_PARTY`; `Control.source = THIRD_PARTY_RISK` plus a vendor-link endpoint;
an obligation mirror-registration extension; `SecurityFinding.linked_vendor_id`;
`AuditUniverseEntry.related_vendor_ref_id`; `Incident.vendor_ref_id`; plus the `04-domain-model`
`THIRD-PARTY RISK` status-label amendment) are **not** yet applied — recommended for the same
future consolidation session as `23-policy`'s and `24-incident-issue-capa`'s own still-unapplied
proposals, bringing the total to eleven additive changes plus three `04-domain-model`
status-label amendments awaiting one explicitly-authorized session.
**Session 13 update**: `docs/roadmap.md` Master Execution Plan Phase 9 (`BUSINESS CONTINUITY`)
is closed — `26-business-continuity/01-business-continuity-management.md` is authored (module
code `BCP`), grounded in two regulatory sources mined at clause level for the first time: the
SEBI Risk Mgmt circular's own Appendix A Part 1 item 1 mandate and the Annexures' System Audit
Program Checklist item 8 (BCP & DR, sub-items 8a–8f). This closes the last remaining reserved
business-domain bounded context named in `04-domain-model`'s map (`REPORTING` is the only
context left reserved). Six additive changes this new spec itself proposed
(`Risk.source = BUSINESS_CONTINUITY`; `Control.source = BUSINESS_CONTINUITY` plus a
continuity-link endpoint; a new "Technology & Operational Resilience" `ObligationCategory` and
matching `PolicyCategory`; `AuditUniverseEntry.related_critical_service_ref_id`; a
`GET /incidents/{id}/reference` endpoint; plus the `04-domain-model` `BUSINESS CONTINUITY`
status-label amendment) are **not** yet applied — recommended for the same future consolidation
session as the eleven changes `23-policy`/`24-incident-issue-capa`/`25-third-party-risk` already
proposed, bringing the total to seventeen additive changes plus four `04-domain-model`
status-label amendments awaiting one explicitly-authorized session.
**Session 14 update**: `docs/roadmap.md` Master Execution Plan Phase 11 (`REPORTING`) is
closed — `14-reporting/01-reporting-management.md` is authored (module code `REPORTING`), per
this session's explicit instruction to proceed directly to Phase 11 rather than the
seventeen-additive-change consolidation this document's own prior recommendation had named
first. This closes the last remaining reserved business-domain bounded context named in
`04-domain-model`'s map — all ten are now authored as ERM specifications, though that document's
own status labels still lag for five of them. Two additive changes this new spec itself proposed
(`GET /risks/{id}/reference` on `10-risk`; `GET /findings/{id}/reference`/
`GET /engagements/{id}/reference` on `13-audit`) plus the `04-domain-model` `REPORTING`
status-label amendment are **not** yet applied — recommended for the same future consolidation
session as the seventeen changes `23-policy`/`24-incident-issue-capa`/`25-third-party-risk`/
`26-business-continuity` already proposed, bringing the total to nineteen additive changes plus
five `04-domain-model` status-label amendments awaiting one explicitly-authorized session. Two
genuinely new PRSMTD capability gaps (a scheduled-job/batch-execution mechanism; a generic
PDF/CSV export-rendering pipeline) are named for the first time, neither blocking this module's
own MVP scope. `15-analytics` (KPI/metric catalog, dashboard visualization composition) remains
the one piece of `CLAUDE.md`'s original "REPORTING & ANALYTICS" combined vision not yet
authored — explicitly deferred, not silently dropped.
**Session 15 update**: the Additive Change Consolidation phase applied all nineteen additive
changes and all five `04-domain-model` status-label amendments named above — none remain
proposed-not-applied. See the Session 15 entries in `docs/roadmap.md` and
`01-master-traceability-matrix.md` for the full per-document breakdown.
**Session 16 update**: `docs/roadmap.md` Master Execution Plan Phase 11 is now **fully**
closed — `15-analytics/01-analytics-management.md` is authored (module code `ANALYTICS`),
closing the one piece of `CLAUDE.md`'s original "REPORTING & ANALYTICS" vision the paragraph
above still named as outstanding. A 48-row seed KPI/Metric Catalogue activates `14-reporting`'s
already-reserved `DashboardWidget.widget_type = METRIC_REFERENCE` slot with **zero** additive
change to that module's schema. This new spec proposes, but does not apply, an
eleventh-bounded-context amendment to `04-domain-model` and two small additive changes to
`14-reporting` (`dependencies:`; `DashboardDefinition.audience = REGULATORY`) — recommended for
a future session, small enough to bundle with other low-effort consolidation work rather than
requiring its own dedicated session. One genuinely new PRSMTD capability gap (a generic
formula-execution/BI-computation engine) and one genuinely new ERM content gap (a
roster-of-required-acknowledgers capability) are named for the first time, neither blocking
this module's own MVP scope.

## Specification Progress Matrix

| Planned Module | Specification Status | Implementation Status | Roadmap Milestone |
|---|---|---|---|
| Enterprise Domain Model (`04-domain-model`) | Complete | Not Started (structural spec, not itself implementable) | Complete — Session 3 |
| `RISK` | Complete | Not Started | Complete — Session 1 |
| `CONTROLS` | Complete | Not Started | Complete — Session 2 |
| `COMPLIANCE` | Complete | Not Started | Complete — Session 4 |
| `AUDIT` | Complete | Not Started | Complete — Session 5 |
| `26-business-continuity/` (`BCP` module) | **Complete — Session 13** | Not Started | Master Execution Plan Phase 9; now authored ([`01-business-continuity-management.md`](../26-business-continuity/01-business-continuity-management.md)) — activates the `BUSINESS CONTINUITY` bounded context `04-domain-model` reserved, resolving its own anticipated-entities sketch and plan-vs-`CONTROLS`-test-boundary recommendation. Two integrations (`INCIDENT`'s `POST /capa-requests`, `TPR`'s `GET /vendors/{id}/reference`) activate directly with zero additive change, plus `POLICY`'s and `SECURITY`'s reference/tag resolution and `CONTROLS`'/`COMPLIANCE`'s read directions; six additive changes (`10-risk`, `12-controls`, `11-compliance`, `23-policy`, `13-audit`, `24-incident-issue-capa`) and the `04-domain-model` status-label amendment remain proposed, not applied. |
| `14-reporting/` (`REPORTING` module) | **Complete — Session 14** | Not Started | Master Execution Plan Phase 11; now authored ([`01-reporting-management.md`](../14-reporting/01-reporting-management.md)) — activates the `REPORTING` bounded context `04-domain-model` reserved (the tenth and final one), a 69-row seed Report Catalogue, field-level provenance, on-demand generation with opt-in approval governance, and distribution record-keeping. Seven of nine source-module integrations activate with zero additive change; two new point-citation endpoints (`10-risk`, `13-audit`) and the `04-domain-model` status-label amendment remain proposed, not applied. |
| `15-analytics/` (`ANALYTICS` module) | **Complete — Session 16** | Not Started | Master Execution Plan Phase 11 (second document); now authored ([`01-analytics-management.md`](../15-analytics/01-analytics-management.md)) — a 48-row seed KPI/Metric Catalogue, threshold/banding measurement, and a `MetricView` visualization-composition layer that activates `14-reporting`'s already-reserved `DashboardWidget.widget_type = METRIC_REFERENCE` slot with zero additive change to that module's schema. Proposes, but does not apply, an eleventh-bounded-context amendment to `04-domain-model` and a small `dependencies:`/`DashboardDefinition.audience` addition to `14-reporting`. |
| `09-security/` (`SECURITY` module) | **Complete — Session 6** | Not Started | Was Next Milestone item 2; now authored ([`01-security-management.md`](../09-security/01-security-management.md)) — a cross-cutting consolidation plus a genuine sixth module. Originally outside `04-domain-model`'s 9-context map (see that spec's Assumption 1); **folded in as a tenth context in Session 7**, closing that gap. |
| `23-policy/` (`POLICY` module) | **Complete — Session 10** | Not Started | Master Execution Plan Phase 6; now authored ([`01-policy-management.md`](../23-policy/01-policy-management.md)) — activates the `POLICY` bounded context `04-domain-model` reserved. Two of three inbound integrations (`COMPLIANCE`, `SECURITY`) required zero additive change; the `CONTROLS` integration and the `04-domain-model` status-label amendment remain proposed, not applied. |
| `24-incident-issue-capa/` (`INCIDENT` module) | **Complete — Session 11** | Not Started | Master Execution Plan Phase 7; now authored ([`01-incident-issue-capa-management.md`](../24-incident-issue-capa/01-incident-issue-capa-management.md)) — activates the `INCIDENT`/`ISSUE`/`CAPA` bounded context `04-domain-model` reserved, resolving its open module-code naming question. `Risk.source = INCIDENT` required zero additive change; `13-audit`/`09-security`'s already-reserved `capa_ref_id` columns need only a proposed endpoint each; `12-controls`/`11-compliance`/`23-policy` and the `04-domain-model` status-label amendment remain proposed, not applied. |
| `25-third-party-risk/` (`TPR` module) | **Complete — Session 12** | Not Started | Master Execution Plan Phase 8; now authored ([`01-third-party-risk-management.md`](../25-third-party-risk/01-third-party-risk-management.md)) — activates the `THIRD-PARTY RISK` bounded context `04-domain-model` reserved, resolving its open `VendorCategory`/`RiskCategory` question. Six integrations (`POLICY` ×2, `SECURITY` ×2, `INCIDENT`, and the resolution directions of `CONTROLS`/`COMPLIANCE`) activate with zero additive change; six additive changes (`10-risk`, `12-controls`, `11-compliance`, `09-security`, `13-audit`, `24-incident-issue-capa`) and the `04-domain-model` status-label amendment remain proposed, not applied. |

## Repository Maturity

| Dimension | Rating | Explanation |
|---|---|---|
| PRSMTD Platform Maturity | High (for a generic substrate) | Governance ledger, RBAC, module framework, RLS, audit/observability, and authentication are all documented as binding, guard-enforced invariants with real enforcement mechanisms (ArchUnit-style guards named throughout §5a–§5c) — not aspirational. Zero business-domain (GRC) capability, which is by design at this layer. |
| ERM Specification Maturity | High, and internally consistent | Twelve documents authored, each meeting `CLAUDE.md`'s full Documentation Standards checklist, each building on a shared modeling kernel that has now held across twelve consecutive modules without structural rework. **All ten bounded contexts named in `04-domain-model`'s map are authored as ERM specifications AND labeled "(authored)" in that document's own map** (Session 15 applied the five remaining status-label amendments together); `ANALYTICS` is an eleventh, proposed-not-applied addition to that same map (Session 16, `15-analytics/01-*` Assumption 3) — a small, precisely-scoped, open additive-change backlog (three items) remains, tracked in `docs/roadmap.md`. |
| Combined Platform Maturity | Low-Medium | Nothing is implemented; the combined maturity of a *deployed* platform is necessarily Low today. The combined maturity of the *design* (were it implemented) is Medium-High for all eleven covered business-domain/reporting modules, and now for `ANALYTICS` as well. |
| Regulatory Mapping Maturity | Medium for SEBI Mutual Fund regulation, Low for everything else | Every authored spec carries a precise regulatory citation for its primary SEBI source (clause-level for `RISK`/`CONTROLS`/`COMPLIANCE`/`AUDIT`/`INCIDENT`/`TPR`/`BCP`; scope-level for `SECURITY`, per its inherited Cyber Security Framework PDF-extraction limitation; `14-reporting/01-*` and `15-analytics/01-*` cite no new regulatory text of their own, only operationalizing what the other nine already cite). No spec cites DPDP, CERT-In (beyond `INCIDENT`'s timeline substrate), Companies Act, Income Tax, or any international standard, though `BCP`'s own vocabulary is the structurally closest match to ISO 22301 any spec has produced. |
| Traceability Maturity | High | Every substantive spec carries the mandated Traceability block; `01-master-traceability-matrix.md` aggregates all twelve with zero gaps between what each spec's Traceability block claims and what the matrix records — updated Session 16 to add `ANALYTICS`'s own row and its small proposed-not-applied backlog. |
| Overall Readiness | Early-to-Mid specification phase | Consistent with `docs/roadmap.md`'s own "Current Status" framing — this is not a claim of production readiness at any layer. |

## Percentage Completion

### Specification Completion

**Numerator**: 10 authored bounded-context module specs whose status `04-domain-model`'s own
Bounded Context Map now reflects as authored (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`,
`SECURITY`, `POLICY`, `INCIDENT`, `THIRD-PARTY RISK`, `BUSINESS CONTINUITY`, `REPORTING`).

**Denominator**: 10 total bounded contexts in `04-domain-model`'s bounded context map.

**Specification Completion reached its ceiling at Session 15: 10/10 = 100%.** All five
outstanding status-label amendments (`POLICY` — Session 10; `INCIDENT`/`ISSUE`/`CAPA` —
Session 11; `THIRD-PARTY RISK` — Session 12; `BUSINESS CONTINUITY` — Session 13; `REPORTING` —
Session 14) were applied together at Session 15, per the precedent Session 6→7 set
for `SECURITY` — a module authored elsewhere does not move this fraction until
`04-domain-model`'s own status-label amendment is actually applied. **Session 16 (`ANALYTICS`)
does not change this fraction**, for the identical reason: `15-analytics/01-*` proposes, but
does not apply, its own eleventh-bounded-context amendment (spec Assumption 3) — this metric
stays keyed to the ten contexts `04-domain-model`'s own map currently enumerates until that
amendment is applied in a later session, the same discipline this metric has held every prior
time a new module's own status-label proposal went unapplied. This metric measures
*specification* completeness only — it says nothing about *implementation* (see [Platform
Capability Completion](#platform-capability-completion) below, which remains far from its own
ceiling).

This figure **excludes** `04-domain-model` itself (a foundational cross-cutting document, not
a bounded context, so it does not belong in either the numerator or denominator) and excludes
the standalone `05-modules/`, `06-data-model/`, `07-workflows/`, `08-api/` section READMEs,
which remain "Not yet authored" as separate documents but whose content is currently satisfied
**inline within each module spec** by deliberate, established convention — not counted as a
gap in this percentage, per that convention.

### Platform Capability Completion

**Method**: a capability-count heuristic across the (now) 28-row list in
[Platform Capability Matrix](#platform-capability-matrix) — 7 substrate rows + 14 GRC-domain
rows + 7 cross-cutting-gap rows. **Session 16's 28-row denominator supersedes Session 14's
27-row count**: `Analytics` moves from `Remaining` to `Specified but Pending` (following
`15-analytics/01-analytics-management.md`), and one new gap row this session's spec names for
the first time (a generic formula-execution/BI-computation engine) is added — the
roster-of-required-acknowledgers gap this session also names is folded into the existing
`Policy Management` row rather than counted as a fourteenth GRC-domain row, since it is a
missing *input* to an already-specified capability, not a new capability of its own. This is an
auditable count, not an effort-weighted estimate — a single "Built" substrate capability (e.g.
RBAC) and a single "Not Started" cross-cutting gap (e.g. Records Retention Schedule) are
counted as equally-weighted rows, which likely **understates** the substrate's true
implementation effort relative to a not-yet-scoped future module. Treat this percentage as
directional, not precise.

| Status | Count | Rows |
|---|---|---|
| **Already Built** | 7 | Identity & Tenancy, Multi-Tenancy RLS, Governance Ledger, RBAC, Module Framework, Audit Trail & Observability, Authentication |
| **Specified but Pending** | 13 | Risk Register, Control Library, Compliance/Regulatory Obligations, Audit Management, Cybersecurity Governance, Privileged Access Management, Secrets/Key/Certificate Governance, Policy Management, Incident/Issue/CAPA, Third-Party Risk, Business Continuity, Reporting, Analytics |
| **Remaining (Not Started/Not Specified)** | 8 | Document/Object Storage, Records Retention Schedule, Notification/Alerting, SIEM/Automated Threat Detection, ABAC, Scheduled-Job/Batch-Execution Mechanism, Generic PDF/CSV Export-Rendering Pipeline, Generic Formula-Execution/BI-Computation Engine |

**Already Built % = 7/28 = 25%. Specified but Pending % = 13/28 ≈ 46%. Remaining % =
8/28 ≈ 29%.** (The underlying substrate rows and their "Built" status are unchanged this
session — only the `Analytics` row's move and the one new gap row change the denominator and
the Pending/Remaining counts, per `15-analytics/01-*`.) Only [Specification
Completion](#specification-completion) above (a distinct metric) stays fixed at its Session 15
ceiling; this metric moves because `ANALYTICS` is a newly *specified* capability, independent
of whether `04-domain-model`'s own bounded-context count has yet been amended to match.

## Final Statement

This assessment distinguishes between capabilities that are already implemented in PRSMTD,
capabilities that have been fully specified in the ERM repository but are not yet
implemented, and capabilities that remain outside the current specification. It evaluates how
the combined platform would support organizational compliance if the specified ERM modules
were implemented. **It does not certify legal or regulatory compliance.** Actual compliance
will always depend on implementation quality, configuration, governance, operational
processes, regulatory interpretation, and organizational adoption. In particular: the
"Mostly Ready"/"Partially Ready" ratings above describe **specification coverage of cited
regulatory text**, not verified legal sufficiency — SEBI, DPDP, CERT-In, and every other
regulator's actual expectations should be independently confirmed by qualified counsel and
compliance professionals before any of this repository's specifications are relied upon as a
compliance program in their own right.

## Traceability

- **Business Requirement**: Give stakeholders a single, honest, regularly-evolved view of
  what this platform (PRSMTD substrate plus ERM specifications) would and would not support
  today versus if fully implemented — distinct from, and derived from, the per-spec
  traceability register.
- **Regulatory Requirement**: None directly — this is an assessment artifact, not itself a
  regulatory-driven specification. It aggregates the regulatory requirements already carried
  by `10-risk`, `12-controls`, `11-compliance`, `13-audit`, and `09-security`, and additionally
  surfaces two regulatory requirements (DPDP Act, CERT-In Directions) no current spec
  addresses.
- **PRSMTD Capability**: This document verifies, rather than reuses, PRSMTD capability claims
  — see [Scope and Method](#scope-and-method) for what was checked this session and how.
- **ERM Capability**: Compliance Coverage Assessment — a derived, regulation-facing view over
  `01-master-traceability-matrix.md`; not a bounded context, not a module, carries no
  `Final Status` of its own beyond what it reports about the twelve authored specs.
- **Dependencies**: [`01-master-traceability-matrix.md`](01-master-traceability-matrix.md);
  all twelve authored specs; `PRSMTD/docs/authoritative/system.md` (re-verified Session 6);
  `PRSMTD/modules/` directory listing (re-verified Session 6).
- **Future Work**: Re-verify and update (never recreate) this document whenever a new
  authoritative ERM spec is added or PRSMTD's `system.md` changes materially — see
  `docs/roadmap.md` Risks register for the staleness risk this snapshot carries. Consider the
  new findings in [Roadmap Validation](#roadmap-validation) (DPDP, CERT-In, international
  crosswalk) for a future `docs/roadmap.md` update, subject to user decision, not applied
  automatically here.
- **Session 6 update (2026-07-20)**: incrementally updated — not regenerated — to reflect the
  two `11-compliance`-proposed additive changes now applied to `10-risk`/`12-controls`, and
  the newly authored `09-security/01-security-management.md`. Every matrix in this document
  now explicitly distinguishes Already Built in PRSMTD / Fully Specified in ERM but Yet to
  Build / Not Yet Specified for the affected rows. Unlike the DPDP/CERT-In/crosswalk findings
  above, the three new additive-change proposals and two new capability gaps `09-security/01-*`
  names **were** applied to `docs/roadmap.md`'s Next Milestone this same session (see that
  file's own Session 6 entry).
- **Session 7 update (2026-07-20)**: incrementally updated — not regenerated — to reflect that
  all three of `09-security/01-*`'s proposed additive changes are now applied (`Risk.source =
  SECURITY_FINDING` on `10-risk`; the `AuditEvidence`/`Finding` extension on `13-audit`; the
  `SECURITY` tenth-context row on `04-domain-model`), and that this session's Phase 2
  architecture consistency review found and corrected staleness in `04-domain-model` (stale
  `COMPLIANCE`/`AUDIT` "(reserved)" labels never updated after Sessions 4–5) and `10-risk`
  (a stale Integration Points table). The Specification Completion fraction changes from
  4/9 ≈ 44% to 5/10 = 50% as a direct, mechanical consequence of `04-domain-model`'s own map
  gaining a tenth context — see [Percentage Completion](#percentage-completion). The SIEM and
  ABAC capability gaps `09-security/01-*` named remain open and are not affected by this
  session's changes.
- **Session 10 update (2026-07-21)**: incrementally updated — not regenerated — to reflect
  the newly authored `23-policy/01-policy-management.md` (module code `POLICY`). Updated:
  Executive Summary, Scope and Method, Question 2, Platform Capability Matrix (`Policy
  Management` row), Compliance Coverage Matrix and Regulatory Readiness Matrix (Cyber
  Security Framework and ISO 27001 rows), Control-Level Matrix (`+1` row; ISO 27001 Annex A.5
  row updated), Enterprise Capability Matrix (`Policy Management` row), Gap Assessment
  (`POLICY` scoping gap closed; two new proposed-not-applied additive-change gap rows added),
  Roadmap Validation, Specification Progress Matrix (`+1` row), Repository Maturity, and
  Percentage Completion. **Specification Completion deliberately stays at 5/10 = 50%**, not
  6/10, this session — `04-domain-model`'s own Bounded Context Map has not yet been amended to
  relabel `POLICY` "(authored)," mirroring exactly how `SECURITY`'s own authored-but-not-yet-
  reflected status was handled between Sessions 6 and 7. Platform Capability Completion moves
  from 7/7/10 (Built/Pending/Remaining out of 24) to 7/8/9, since `Policy Management` is the
  only row whose status changed.
- **Session 11 update (2026-07-21)**: incrementally updated — not regenerated — to reflect
  the newly authored `24-incident-issue-capa/01-incident-issue-capa-management.md` (module
  code `INCIDENT`, resolving `04-domain-model`'s open naming question). Updated: Executive
  Summary, Scope and Method, Question 2, Platform Capability Matrix (`Incident / Issue / CAPA`
  row), Compliance Coverage Matrix (System Audit Checklist §§1–8 and CERT-In rows),
  Control-Level Matrix (`+2` rows), Enterprise Capability Matrix (`Incident Management` row),
  Regulatory Readiness Matrix (CERT-In row), Gap Assessment (`INCIDENT`/`ISSUE`/`CAPA` gap row
  closed; four new proposed-not-applied additive-change gap rows added), Roadmap Validation,
  Specification Progress Matrix (`+1` row), Repository Maturity (also corrected a stray
  multi-line table-row defect introduced in Session 10's own edit, no content change beyond
  that formatting fix), and Percentage Completion. **Specification Completion stays at
  5/10 = 50%** — neither `POLICY`'s nor `INCIDENT`'s `04-domain-model` status-label amendment
  is applied yet; the document now explicitly notes it becomes 7/10 = 70% once both land.
  Platform Capability Completion moves from 7/8/9 to 7/9/8 (out of 24), since
  `Incident / Issue / CAPA` is the only row whose status changed this session.
- **Session 12 update (2026-07-21)**: incrementally updated — not regenerated — to reflect
  the newly authored `25-third-party-risk/01-third-party-risk-management.md` (module code
  `TPR`), grounded in the Annexures' dedicated §2.9 Outsourcing Risk section. Updated:
  Executive Summary, Scope and Method, Question 2, Platform Capability Matrix
  (`Third-Party Risk` row), Compliance Coverage Matrix (new §2.9 row), Control-Level Matrix
  (`+2` rows), Enterprise Capability Matrix (`Third-Party Risk` row), Regulatory Readiness
  Matrix (SEBI Annexures row), Gap Assessment (`THIRD-PARTY RISK` gap row closed; two new
  proposed-not-applied gap rows added, one bundling this spec's six additive changes), Roadmap
  Validation, Specification Progress Matrix (`+1` row), Repository Maturity, and Percentage
  Completion. **Specification Completion stays at 5/10 = 50%** — none of `POLICY`'s,
  `INCIDENT`'s, or `TPR`'s `04-domain-model` status-label amendments is applied yet; the
  document now explicitly notes it becomes 8/10 = 80% once all three land. Platform Capability
  Completion moves from 7/9/8 to 7/10/7 (out of 24), since `Third-Party Risk` is the only row
  whose status changed this session.
- **Session 13 update (2026-07-21)**: incrementally updated — not regenerated — to reflect
  the newly authored `26-business-continuity/01-business-continuity-management.md` (module
  code `BCP`), grounded in the SEBI Risk Mgmt circular's own Appendix A Part 1 item 1 mandate
  and the Annexures' System Audit Program Checklist item 8 (BCP & DR), both mined at clause
  level for the first time. Updated: Executive Summary, Scope and Method, Question 2, Platform
  Capability Matrix (`Business Continuity` row), Compliance Coverage Matrix (new RMS-circular
  DR/BCP row; System Audit Checklist §§1–8 row; ISO 22301 row), Control-Level Matrix (`+2`
  rows; ISO 22301 row updated), Enterprise Capability Matrix (`Business Continuity` row),
  Regulatory Readiness Matrix (SEBI Annexures/RMS-circular rows; ISO 22301 row; NIST CSF
  Recover note), Gap Assessment (`BUSINESS CONTINUITY` gap row closed; two new
  proposed-not-applied gap rows added, one bundling this spec's six additive changes), Roadmap
  Validation, Specification Progress Matrix (`+1` row), Repository Maturity, and Percentage
  Completion. **Specification Completion stays at 5/10 = 50%** — none of `POLICY`'s,
  `INCIDENT`'s, `TPR`'s, or `BCP`'s `04-domain-model` status-label amendments is applied yet;
  the document now explicitly notes it becomes 9/10 = 90% once all four land — the only
  remaining reserved context at that point being `REPORTING`. Platform Capability Completion
  moves from 7/10/7 to 7/11/6 (out of 24), since `Business Continuity` is the only row
  whose status changed this session.
- **Session 14 update (2026-07-21)**: incrementally updated — not regenerated — to reflect
  the newly authored `14-reporting/01-reporting-management.md` (module code `REPORTING`), per
  this session's explicit instruction to proceed directly to Master Execution Plan Phase 11
  rather than the seventeen-additive-change consolidation this document's own prior
  recommendation had named first. Updated: Executive Summary, Scope and Method, Question 2,
  Platform Capability Matrix (`Reporting & Analytics` row split into `Reporting`/`Analytics`;
  two new gap rows for a scheduled-job/batch-execution mechanism and a generic PDF/CSV
  export-rendering pipeline), Enterprise Capability Matrix (`Executive Reporting`/`Regulatory
  Reporting` rows; new `Interactive Analytics/KPI Dashboards` row), Gap Assessment (`Reporting`
  gap row closed; `Analytics` gap row added; two new proposed-not-applied gap rows added; a
  `04-domain-model` status-label amendment row added; two new PRSMTD-capability gap rows added),
  Roadmap Validation, Specification Progress Matrix (`+1` row for `14-reporting/`, `+1` row for
  `15-analytics/`), Repository Maturity, and Percentage Completion. **Specification Completion
  stays at 5/10 = 50%** — none of `POLICY`'s, `INCIDENT`'s, `TPR`'s, `BCP`'s, or `REPORTING`'s
  `04-domain-model` status-label amendments is applied yet; the document now explicitly notes it
  becomes 10/10 = 100% once all five land — `REPORTING` is the last of the ten contexts that
  document's map enumerates, so this is also the ceiling for this metric. **Platform Capability
  Completion's denominator itself grows this session, from 24 to 27** — the single "Reporting &
  Analytics" row splits into "Reporting" (now Specified) and "Analytics" (still Not Started),
  and two new gap rows are added — moving the count from 7/11/6 to 7/12/8 (out of 27), the same
  kind of denominator growth Session 6 itself applied to Session 5's 19-row count.
- **Session 15 update (2026-07-22) — Additive Change Consolidation**: incrementally updated —
  not regenerated — to reflect that all nineteen additive changes and all five
  `04-domain-model` status-label amendments this repository had carried as proposed-not-applied
  since Sessions 10–14 are now applied. Updated: Executive Summary (Implementation readiness,
  Architecture maturity, Recommended next module rows), Gap Assessment (closed every "Not yet on
  `docs/roadmap.md` as a scheduled phase" row tied to the nineteen changes and five amendments —
  the two genuine PRSMTD capability gaps `14-reporting/01-*` named, scheduled-job/batch-execution
  and generic export-rendering, remain correctly open, since neither is an additive spec change),
  Roadmap Validation (all corresponding rows flipped from "No" to "Yes"), and Percentage
  Completion. **Specification Completion reaches its ceiling: 10/10 = 100%** — every bounded
  context `04-domain-model`'s own map enumerates is now labeled "(authored)." **Platform
  Capability Completion is unchanged** (7/12/8 out of 27) — this session applied cross-references
  within already-"Specified but Pending" modules; it specified no new capability, so this
  distinct, implementation-facing metric does not move. Also verified, before applying anything,
  that every one of the nineteen proposals remained architecturally correct and had not been
  invalidated by a later spec — none had; and discovered, while applying two of them
  (`SecurityFinding.linked_vendor_id`, `Incident.vendor_ref_id`), a genuine cycle risk neither
  proposing session had surfaced: each would have paired with an already-existing reciprocal
  manifest dependency (`TPR → SECURITY`, `TPR → INCIDENT`), violating OWN-08's acyclic
  requirement. Resolved by leaving both references opaque and unresolved by their owning module
  — see `04-domain-model/01-*`'s own Dependency Rule 8 and Amendment log for the full reasoning.
