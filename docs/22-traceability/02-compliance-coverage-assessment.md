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
  the seven currently authored, frozen documents — `04-domain-model/01-*`, `10-risk/01-*`,
  `12-controls/01-*`, `11-compliance/01-*`, `13-audit/01-*`, `09-security/01-*`,
  `23-policy/01-*` — and their Traceability blocks as aggregated in
  `01-master-traceability-matrix.md`. Reserved-but-unauthored bounded contexts
  (`INCIDENT`/`ISSUE`/`CAPA`, `THIRD-PARTY RISK`, `BUSINESS CONTINUITY`, `REPORTING`) are
  treated as **not specified** — a boundary and relationship type being reserved in
  `04-domain-model` is not the same as a functional/data-model specification existing.
- **Ratings are never merged across the "already built" / "specified but unbuilt" / "not
  specified" axis anywhere in this document**, per the explicit instruction this assessment
  was commissioned under.
- This document is a snapshot as of **2026-07-20**, incrementally updated in Session 6 to
  reflect the two additive changes applied to `10-risk`/`12-controls` and the newly authored
  `09-security/01-security-management.md`, again in Session 7 to reflect the three
  additive changes `09-security` had proposed (now applied to `10-risk`/`13-audit`/
  `04-domain-model`) and a consistency-review correction to `04-domain-model`'s own stale
  `COMPLIANCE`/`AUDIT` status labels, and again in Session 10 (2026-07-21) to reflect the
  newly authored `23-policy/01-policy-management.md` — **only the sections those changes
  affect were updated**; all other analysis is preserved unchanged from prior sessions. Both
  PRSMTD and the ERM specification set will keep changing — see `docs/roadmap.md` Risks
  register for the staleness risk this snapshot carries, and re-verify before relying on any
  rating below at a later date.

## Executive Summary

| Dimension | Assessment |
|---|---|
| **Current PRSMTD maturity** | Mature, well-documented **generic multi-tenant governance platform substrate** (identity/tenancy, maker-checker governance ledger, RBAC, module framework with strict ownership guards, audit/observability trace contract, authentication). **Zero GRC-domain business capability** — no risk, control, compliance, or audit module exists in PRSMTD today; only a `contacts` reference module and a scaffolding template. |
| **Current ERM specification maturity** | Seven authoritative ERM specifications now exist: `RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, `SECURITY`, `POLICY`, plus the cross-cutting `04-domain-model` that ties them together. `04-domain-model`'s own Bounded Context Map, however, still labels five contexts "authored" (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, `SECURITY`) — `POLICY`'s status-label amendment is proposed, not yet applied (the same lag `SECURITY` itself had between Sessions 6 and 7), so [Percentage Completion](#percentage-completion) deliberately keeps counting 5/10 until that amendment lands. **Session 6 authored the sixth authoritative spec**, [`09-security/01-security-management.md`](../09-security/01-security-management.md) (module code `SECURITY`), originally outside the domain model's own nine-context map; **Session 7 closed that gap**. **Session 10 authored the seventh authoritative spec**, [`23-policy/01-policy-management.md`](../23-policy/01-policy-management.md) (module code `POLICY`) — the enterprise source of truth for Policies, Standards, Procedures, and Guidelines, their governed lifecycle, versioning, re-attestation, employee acknowledgement, and exceptions. Two of its three inbound integrations (`COMPLIANCE`, `SECURITY`) activated with **zero** additive change to either frozen spec; the third (`CONTROLS`) required a proposed, not-yet-applied additive extension. |
| **Combined platform maturity** | If the six authored GRC specs were implemented today, an AMC would have a genuinely governed risk register, control library, compliance obligation register, internal/system audit capability, cybersecurity governance capability (security findings/vulnerability management, privileged access grants, secrets/key/certificate governance), and a governed policy management capability (authoring, versioning, review, acknowledgement, exceptions for Policies/Standards/Procedures/Guidelines) — but no incident/issue/CAPA, no third-party risk, no business continuity plan register, no reporting/analytics layer, no binary evidence storage, and no SIEM/automated threat-detection capability. See [Percentage Completion](#percentage-completion). |
| **Regulatory readiness** | **Partially ready** for the SEBI Mutual Fund regulatory profile specifically (Risk Management System circular, Master Circular Annexures operational/financial/IT/cyber/compliance-risk/audit sections, the Cyber Security and Cyber Resilience Framework's governance layer via `SECURITY`, and now formal policy authorship/acknowledgement via `POLICY`) if the six specs were implemented. **Not ready** for DPDP Act, CERT-In Directions, Companies Act, or Income Tax — none is addressed by any current spec. **Early-stage, architecturally-compatible-only** for ISO 27001/27701/22301/31000, COBIT, and NIST CSF — no ERM spec explicitly cites or maps to any of these; `POLICY`'s existence directly narrows (but does not close) the ISO 27001 Annex A.5 (policy) gap named in prior sessions, since a versioned, governed information-security-policy record now has a concrete owning module. |
| **Compliance readiness** | Same as regulatory readiness — this document does not distinguish the two terms further; see [Regulatory Readiness Matrix](#regulatory-readiness-matrix). |
| **Architecture maturity** | High for what exists: every authored spec follows one shared-kernel modeling pattern (`04-domain-model`'s taxonomy shape, governed-lifecycle shape, opaque-reference shape, code-sequence shape), and `13-audit` and (for two of its three integrations) `23-policy` each activate their primary cross-context integrations with **zero** additive changes required to any frozen prior spec — a leading indicator that the shared kernel is working as intended. |
| **Implementation readiness** | Each of the seven authored specs is implementation-ready on its own terms (concrete tables, states, APIs, role/permission names) but **none has been implemented in PRSMTD** — this repository is specification-only by design (`CLAUDE.md`). The two small, precisely-scoped additive changes `11-compliance` proposed are applied (Session 6); the three `09-security/01-*` proposed are applied (Session 7). **Two additive changes remain proposed, not applied, as of this session**: `23-policy/01-*`'s `module_controls_control_policy_link`/`POST /controls/{id}/policy-links` extension to `12-controls`, and its `04-domain-model` `POLICY` status-label amendment. |
| **Highest strength** | The governance-ledger/maker-checker substrate (PRSMTD, Built) plus the immediate-raise/governed-closure exception pattern (ERM, Specified across five modules now, including `POLICY`'s own `PolicyException`) together give every governed GRC decision — risk acceptance, control sign-off, compliance exception closure, audit finding closure, policy exception closure — the same real, auditable, SoD-enforced approval mechanism with zero bespoke code per module. |
| **Highest risk** | The platform document/object storage capability gap, first flagged at `12-controls` and now inherited by `COMPLIANCE`, `AUDIT`, and `POLICY` unchanged: every evidence-bearing control, obligation, audit finding, and published policy version in this repository's design can be fully governed and metadata-tracked, but **cannot yet retain the actual binary evidence/content** an auditor or regulator would expect to retrieve, except for `AUDIT`'s system-trace-extract evidence path (system.md §4.1), which covers only evidence that is itself a platform-trace citation. |
| **Recommended next module** | Session 10 completed the `POLICY` module (`docs/roadmap.md` Master Execution Plan Phase 6). See `docs/roadmap.md`'s updated Next Milestone / Master Execution Plan for the current recommendation — Phase 7 (`INCIDENT`/`ISSUE`/`CAPA`), Phase 8 (`THIRD-PARTY RISK`), Phase 9 (`BUSINESS CONTINUITY`), applying `23-policy/01-*`'s two proposed additive changes, or the persona-to-module-role/`system.md §18` ADR consolidation. |

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
`SECURITY`, `POLICY`, `04-domain-model`) were implemented into PRSMTD:

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

**Which regulations would become supported** (see
[Regulatory Readiness Matrix](#regulatory-readiness-matrix) for the full rating and rationale
per regulation): **Mostly Ready** for the SEBI *Risk Management System* circular and the
Annexures' Operational Risk / Financial Reporting Risk / Compliance Risk / three-lines-of-
defense (Internal Audit) sections. **Partially Ready** for the Cyber Security and Cyber
Resilience Framework for Mutual Funds AMCs (its own PDF remains scanned/image-only in this
environment — `12-controls` Assumption 5 — so citation precision is scope-level, not
clause-level). **Not Ready** for DPDP Act, CERT-In Directions, Companies Act, or Income Tax.
**Early Stage** for every international standard/framework listed in this document's scope
(ISO 27001/27701/22301/31000, COBIT, NIST CSF) — architecturally compatible, not explicitly
mapped.

**Which roadmap items would still remain before full platform capability exists**: four
reserved bounded contexts (`INCIDENT`/`ISSUE`/`CAPA`, `THIRD-PARTY RISK`,
`BUSINESS CONTINUITY`, `REPORTING`), a platform document/object storage capability, a
general-purpose Records Retention Schedule capability, the `system.md §18` Product Framework
reconciliation, a SIEM/security-event-correlation capability, an ABAC policy-decision
mechanism, two additive changes `23-policy/01-*` proposed but did not apply (a `CONTROLS`-side
policy-link endpoint; the `04-domain-model` `POLICY` status-label amendment), and — newly
surfaced by this assessment, not previously named on `docs/roadmap.md` — explicit DPDP Act /
CERT-In obligation content and an explicit international-standard crosswalk. See
[Roadmap Validation](#roadmap-validation).

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
| Incident / Issue / CAPA | Not Built | Not Specified (reserved boundary only) | Not Started |
| Third-Party Risk | Not Built | Not Specified (reserved boundary only) | Not Started |
| Business Continuity | Not Built | Not Specified (reserved boundary only) | Not Started |
| Reporting & Analytics | Not Built | Not Specified (Conformist relationship reserved; no module spec) | Not Started |
| Document / Object Storage (evidence binaries) | Not Built (confirmed absent) | Not Specified — flagged as a required new PRSMTD capability by three specs | Not Started |
| Records Retention Schedule (cross-module) | Not Built | Not Specified — named explicitly as a real gap by `11-compliance`/`13-audit` | Not Started |
| Notification / Alerting | Not Built (attempted, then retired) | Not Specified | Not Started |
| SIEM / Automated Threat Detection / Security Event Correlation | Not Built | Not Specified — named for the first time by `09-security/01-*`; `SecurityFinding.source = SIEM_ALERT` reserves the slot only | Not Started |
| ABAC (attribute-based access control) | Not Built (RBAC only, three closed domains — system.md §8) | Not Specified — named as future extensibility only by `09-security/01-*` | Not Started |
| Privacy Management (DPDP Act) | Not Built | Not Specified | Not Started |

## Compliance Coverage Matrix

| Regulation / Standard | Clause / Control | Current PRSMTD | ERM Specification | Build Status | Compliance Coverage | Covered By | Remaining Roadmap Work |
|---|---|---|---|---|---|---|---|
| SEBI *Risk Management System* circular (MFD/CIR/15/19133/2002) | Independent risk management function; risk taxonomy; Board/Trustee reporting cadence | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | PRSMTD governance ledger/RBAC (`system.md §3,§8`) + ERM `RISK` module | Implement `RISK` module in PRSMTD |
| Annexures to Master Circular §1.3.4.1 | Three lines of defense; dedicated internal auditor; non-compliance rate; Rectification Index | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `AUDIT` module | Implement `AUDIT` module in PRSMTD |
| Annexures §2.5 / §2.11 | Operational Risk controls; Financial Reporting Risk / ICFR, segregation of duties | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `CONTROLS` module | Implement `CONTROLS` module in PRSMTD |
| Annexures §2.6 | Compliance Risk — 17 mandatory policy domains, filing responsibilities, AML/CFT program, quarterly/half-yearly alert reporting | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `COMPLIANCE` module | Implement `COMPLIANCE` module in PRSMTD |
| Annexures, System Audit Program Checklist §§1–8 | IT Governance, Information Security, Access Management, Change Management, Incident Management, Backup & Recovery, Job Processing, BCP/DR | Not Implemented | Specified (control taxonomy in `CONTROLS`; audit scope in `AUDIT`) | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `CONTROLS` + `AUDIT` | Implement both modules; `BUSINESS CONTINUITY` module still needed for the plan/RTO-RPO side, not just the testing-control side |
| Annexure 8, clause 55 (SEBI/HO/IMD/DF2/CIR/P/2019/57) | Semi-annual System Audit by CISA/CISM/CERT-IN-empanelled auditor; SEBI filing within 3 months of FY end | Not Implemented | Specified | 🟡 Specified – Yet to Build | Mostly Supported (once implemented) | ERM `AUDIT` module (`engagement_type = SYSTEM_AUDIT`) | Implement `AUDIT` module; wire actual SEBI filing/export mechanism (not designed — see `13-audit` Future Extension Points) |
| Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs (2019) | Cyber security policy, technical/organizational controls | Not Implemented | Partial — scope-level citation only (source PDF is scanned/image-only in this environment) | 🔵 Partially Built (specified at scope level, not clause level) | Partially Supported | ERM `CONTROLS` (`Cyber Security` control family) + ERM `SECURITY` (Security Policy Domain taxonomy, security findings/vulnerability management, privileged access, secrets/key/certificate governance — added Session 6) + ERM `POLICY` (the versioned, governed Information Security Policy *document* itself, tagged to the relevant Security Policy Domain — added Session 10, same scope-level precision) | Manually re-verify clause-level content against the source document before implementation; `12-controls` Assumption 5, inherited by `09-security/01-*` and `23-policy/01-*` |
| DPDP Act, 2023 | Personal data processing, consent, breach notification for investor PII | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | New: author DPDP-specific obligation content in `COMPLIANCE` (architecture can host it — `Obligation`/`ObligationCategory` — content does not exist) or a dedicated Privacy Management module per `CLAUDE.md`'s long-term vision |
| CERT-In Directions (cyber incident reporting) | Mandatory 6-hour incident reporting to CERT-In | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | New: author CERT-In-specific obligation/incident-reporting content; depends on both `COMPLIANCE` (obligation) and the reserved `INCIDENT` context (incident timeline tracking) |
| Companies Act, 2013 | Board governance, related-party transactions, statutory audit | Not Implemented | Not Specified (tangential ICFR overlap only, via SEBI-sourced §2.11, not a Companies Act citation) | ❌ Not Yet Specified | Not Supported | None | Not currently on `docs/roadmap.md`; flagged by this assessment, not previously named |
| Income Tax Act requirements | Tax compliance obligations applicable to AMC/schemes | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | Not currently on `docs/roadmap.md`; flagged by this assessment, not previously named |
| ISO/IEC 27001 | Information security management system | Not Implemented | Not Specified (no explicit citation or crosswalk in any spec) | ❌ Not Yet Specified | Early Stage (architecturally compatible: `CONTROLS`' taxonomy-driven, testable, evidenced control library structurally resembles an ISMS control set; `POLICY`, added Session 10, now gives Annex A.5 a concrete owning module — see Control-Level Matrix — narrowing, not closing, this gap) | None (structural resemblance only; no explicit Annex A crosswalk) | New: author an explicit ISO 27001 Annex A crosswalk once a real implementation exists to map against |
| ISO/IEC 27701 | Privacy information management (ISO 27001 extension) | Not Implemented | Not Specified | ❌ Not Yet Specified | Not Supported | None | Same as DPDP row — no privacy-specific ERM content exists yet |
| ISO 22301 | Business continuity management | Not Implemented | Not Specified (reserved `BUSINESS CONTINUITY` boundary only) | ❌ Not Yet Specified | Early Stage (boundary and relationship type reserved in `04-domain-model`, no aggregate/data model) | None | Author `BUSINESS CONTINUITY` module spec |
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
| DPDP Act | Consent management, breach notification for investor PII | No | No | Yes | Privacy Management (unscoped) | Document/object storage would also be needed for consent records | None yet |
| CERT-In Directions | 6-hour cyber incident reporting | No | No | Yes | `INCIDENT` (reserved) + `COMPLIANCE` (filing obligation) | — | None yet |
| Companies Act / statutory audit | Board governance, related-party transaction controls | No | No | Yes | Unscoped — out of this repository's current SEBI-AMC profile | — | None yet |
| ISO 27001 Annex A (representative: A.5 policies) | Formal, versioned information security policy | No | Yes (Session 10 — `POLICY`'s governed `Policy`/`PolicyVersion` lifecycle, tagged to a `SecurityPolicyDomain`) | Yes | `POLICY` (authored) | — | Implement `POLICY` module; author an explicit Annex A crosswalk if ISO 27001 positioning is pursued |
| ISO 22301 | RTO/RPO-defined, tested continuity plan | No | No | Yes | `BUSINESS CONTINUITY` (reserved) | `CONTROLS`' BCP/DR control family tests the plan, once it exists | None yet |

## Enterprise Capability Matrix

| Enterprise Capability | Current PRSMTD | ERM Specified | Build Status | Future Module |
|---|---|---|---|---|
| Risk Register | Not Built | Specified | Planned | `RISK` (authored) |
| Control Library | Not Built | Specified | Planned | `CONTROLS` (authored) |
| Compliance Obligations | Not Built | Specified | Planned | `COMPLIANCE` (authored) |
| Audit Management | Not Built | Specified | Planned | `AUDIT` (authored) |
| Cybersecurity Governance | Not Built | Specified | Planned | `SECURITY` (authored, Session 6) |
| Policy Management | Not Built | Specified | Planned | `POLICY` (authored, Session 10) |
| Incident Management | Not Built | Not Specified | Not Started | `INCIDENT`/`ISSUE`/`CAPA` (reserved) |
| Business Continuity | Not Built | Not Specified | Not Started | `BUSINESS CONTINUITY` (reserved) |
| Third-Party Risk | Not Built | Not Specified | Not Started | `THIRD-PARTY RISK` (reserved) |
| Executive Reporting | Not Built | Not Specified | Not Started | `REPORTING`/`ANALYTICS` (reserved; tenant-vs-platform-level question open) |
| Regulatory Reporting | Not Built | Not Specified (source views named per module, aggregation layer not designed) | Not Started | `14-reporting`/`15-analytics` |
| Privacy Management | Not Built | Not Specified | Not Started | Unscoped — named in `CLAUDE.md`'s long-term vision only |
| AI-Assisted Risk Analytics | Not Built | Not Specified | Not Started | `16-ai` (README scaffold only) |

## Regulatory Readiness Matrix

| Regulation / Framework | Current Platform Readiness | Future Platform Readiness (after current ERM specs implemented) | Explanation |
|---|---|---|---|
| SEBI *Risk Management System* circular | Not Started | Mostly Ready | `RISK` is fully specified against this circular's own text; only implementation remains. |
| SEBI Master Circular Annexures §1.3.4.1 / §2.5 / §2.11 / §2.6 / System Audit | Not Started | Mostly Ready | Each clause has a directly-cited, implementation-ready spec (`CONTROLS`, `COMPLIANCE`, `AUDIT`); not "Ready" because none is implemented and the export/filing mechanisms to SEBI/Board/Trustees are named as source views, not built. |
| SEBI Cyber Security and Cyber Resilience Framework (2019) | Not Started | Partially Ready | Cited at scope level only in `CONTROLS` and, as of Session 6, `SECURITY`; source PDF's clause-level text could not be extracted in this environment — manual verification required before implementation, per `12-controls` Assumption 5 (inherited by `09-security/01-*`). `SECURITY` adds the governance layer (findings, PAM, secrets/key/cert governance) at the same scope-level precision, not clause-level. |
| DPDP Act, 2023 | Not Started | Not Started | No spec addresses personal-data processing, consent, or breach notification for investor PII at all. |
| CERT-In Directions | Not Started | Not Started | No spec addresses the 6-hour cyber-incident-reporting mandate; depends on both an unscoped `COMPLIANCE` extension and the reserved `INCIDENT` context. |
| Companies Act, 2013 | Not Started | Not Started | Out of this repository's current SEBI-AMC-profile scope; only tangential ICFR overlap exists via a SEBI-sourced citation, not a Companies Act citation. |
| Income Tax requirements | Not Started | Not Started | Not addressed by any spec. |
| ISO/IEC 27001 | Not Started | Early Stage | `CONTROLS`' structure (taxonomy, testable, evidenced) is generically ISMS-shaped, and `POLICY` (Session 10) now gives Annex A.5 (policy) a concrete, governed, versioned owning module — but no explicit Annex A crosswalk exists for either. |
| ISO/IEC 27701 | Not Started | Not Started | No privacy-specific content exists to extend an ISMS toward. |
| ISO 22301 | Not Started | Early Stage | Boundary reserved in `04-domain-model`; no aggregate/data model authored yet. |
| ISO 31000 | Not Started | Early Stage | `RISK`'s process is structurally analogous (identify/score/treat/monitor) but not explicitly mapped to ISO 31000's own process model. |
| COBIT | Not Started | Early Stage | `CONTROLS`' IT/cyber control families are structurally similar to COBIT governance/management objectives; no explicit mapping exists. |
| NIST Cybersecurity Framework | Not Started | Early Stage | Identify/Protect/Detect functions have plausible ERM-module analogues (`RISK`, `CONTROLS`); Respond/Recover are only partially covered (`AUDIT` findings; reserved `BUSINESS CONTINUITY`). No explicit mapping exists. |

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
| Reporting | No Reporting/Analytics module authored; aggregation layer over `RISK`/`CONTROLS`/`COMPLIANCE`/`AUDIT`/`SECURITY` source views not designed | `REPORTING`/`ANALYTICS` (reserved) | `docs/roadmap.md` — named as a future candidate, not the current Next Milestone | All five authored modules (Conformist, read-only) | Medium — every module already exposes source views; only the aggregation layer is missing |
| Functional | `BUSINESS CONTINUITY` context reserved but not authored — SEBI DR/BCP mandate (flagged since `10-risk`) remains unspecified for the *plan* side (not the testing-control side, which `CONTROLS` already covers) | `BUSINESS CONTINUITY` (reserved) | `docs/roadmap.md` — named as an alternative candidate, not the current Next Milestone | `RISK`, `CONTROLS` (both authored) | Medium |
| Functional | `INCIDENT`/`ISSUE`/`CAPA`, `THIRD-PARTY RISK` reserved but unspecified — **`POLICY` closed, Session 10** | Each its own future module | `docs/roadmap.md` Master Execution Plan Phases 7–8 | Varies per context — see `04-domain-model` Dependency Rules | Medium |
| Business | `CONTROLS`-side endpoint to populate a proposed `module_controls_control_policy_link` (e.g. `POST /controls/{id}/policy-links`) | — | **Not yet on `docs/roadmap.md` as a scheduled phase** — proposed by `23-policy/01-*` Integration with Controls, Session 10 | None — one-line table shape (already precedented by `module_controls_control_obligation_link`), one endpoint | Low — precisely-scoped, low-effort, mirrors the already-twice-applied `11-compliance`/`09-security` pattern |
| Architecture | `04-domain-model`'s Bounded Context Map still labels `POLICY` "(reserved)" despite `23-policy/01-*` now being authored | `04-domain-model/01-enterprise-domain-model.md` | **Not yet on `docs/roadmap.md` as a scheduled phase** — proposed by `23-policy/01-*`, Session 10, the same amendment shape `09-security` proposed (Session 6) and a later session applied (Session 7) | None — additive status-label and cross-reference correction only | Low — precisely-scoped, low-effort |
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
| `INCIDENT`/`ISSUE`/`CAPA` | **Yes** — Master Execution Plan Phase 7 |
| `CONTROLS`-side policy-link endpoint; `04-domain-model` `POLICY` status-label amendment | **No** — proposed by `23-policy/01-*` (Session 10); not yet a named `docs/roadmap.md` phase of their own, tracked as a Gap Assessment row above pending explicit scheduling, the same treatment `11-compliance`'s and `09-security`'s own proposed additive changes received before a later session applied them |
| `system.md §18` reconciliation | **Yes** — Open Decisions |
| Persona-to-module-role ADR | **Yes** — Open Decisions |
| Records Retention Schedule | **Yes** — carried Assumption across sessions, named explicitly by `11-compliance`/`13-audit` |
| Platform document/object storage | **Yes** — carried Assumption/Risk across sessions |
| `BUSINESS CONTINUITY` module | **Yes** — named as an alternative candidate historically (Session 3–4 Next Milestone discussions), not currently the top-ranked item |
| Reporting/Analytics aggregation layer | Partially — named as a future section, not a scoped candidate module with a milestone |
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

## Specification Progress Matrix

| Planned Module | Specification Status | Implementation Status | Roadmap Milestone |
|---|---|---|---|
| Enterprise Domain Model (`04-domain-model`) | Complete | Not Started (structural spec, not itself implementable) | Complete — Session 3 |
| `RISK` | Complete | Not Started | Complete — Session 1 |
| `CONTROLS` | Complete | Not Started | Complete — Session 2 |
| `COMPLIANCE` | Complete | Not Started | Complete — Session 4 |
| `AUDIT` | Complete | Not Started | Complete — Session 5 |
| `INCIDENT`/`ISSUE`/`CAPA` | Planned (boundary reserved) | Not Started | Master Execution Plan Phase 7 |
| `THIRD-PARTY RISK` | Planned (boundary reserved) | Not Started | Master Execution Plan Phase 8 |
| `BUSINESS CONTINUITY` | Planned (boundary reserved) | Not Started | Master Execution Plan Phase 9 |
| `REPORTING`/`ANALYTICS` | Planned (Conformist relationship reserved) | Not Started | Master Execution Plan Phase 11 |
| `09-security/` (`SECURITY` module) | **Complete — Session 6** | Not Started | Was Next Milestone item 2; now authored ([`01-security-management.md`](../09-security/01-security-management.md)) — a cross-cutting consolidation plus a genuine sixth module. Originally outside `04-domain-model`'s 9-context map (see that spec's Assumption 1); **folded in as a tenth context in Session 7**, closing that gap. |
| `23-policy/` (`POLICY` module) | **Complete — Session 10** | Not Started | Master Execution Plan Phase 6; now authored ([`01-policy-management.md`](../23-policy/01-policy-management.md)) — activates the `POLICY` bounded context `04-domain-model` reserved. Two of three inbound integrations (`COMPLIANCE`, `SECURITY`) required zero additive change; the `CONTROLS` integration and the `04-domain-model` status-label amendment remain proposed, not applied. |

## Repository Maturity

| Dimension | Rating | Explanation |
|---|---|---|
| PRSMTD Platform Maturity | High (for a generic substrate) | Governance ledger, RBAC, module framework, RLS, audit/observability, and authentication are all documented as binding, guard-enforced invariants with real enforcement mechanisms (ArchUnit-style guards named throughout §5a–§5c) — not aspirational. Zero business-domain (GRC) capability, which is by design at this layer. |
| ERM Specification Maturity | Medium-High, growing | Seven documents authored, each meeting `CLAUDE.md`'s full Documentation Standards checklist, each building on a shared modeling kernel that has now held across seven consecutive modules without structural rework (`13-audit` needed zero additive changes to any frozen spec at its own authoring; `09-security/01-*` proposed three additive changes, all applied — Session 7; `23-policy/01-*` needed zero additive change for two of its three integrations, and proposes — not yet applied — one `CONTROLS`-side extension and one `04-domain-model` status-label amendment — Session 10, the same non-invasive discipline every prior activation used). Four of ten bounded contexts named in `04-domain-model`'s map remain unauthored:
`INCIDENT`/`ISSUE`/`CAPA`, `THIRD-PARTY RISK`, `BUSINESS CONTINUITY`, `REPORTING`. `POLICY` is
now authored as an ERM specification (Session 10) but `04-domain-model`'s own map still labels
it "(reserved)," pending a future session applying the amendment `23-policy/01-*` proposes —
see [Percentage Completion](#percentage-completion). |
| Combined Platform Maturity | Low-Medium | Nothing is implemented; the combined maturity of a *deployed* platform is necessarily Low today. The combined maturity of the *design* (were it implemented) is Medium-High for the five covered domains, Not Started for the other five. |
| Regulatory Mapping Maturity | Medium for SEBI Mutual Fund regulation, Low for everything else | Every authored spec carries a precise regulatory citation for its primary SEBI source (clause-level for `RISK`/`CONTROLS`/`COMPLIANCE`/`AUDIT`; scope-level for `SECURITY`, per its inherited Cyber Security Framework PDF-extraction limitation). No spec cites DPDP, CERT-In, Companies Act, Income Tax, or any international standard. |
| Traceability Maturity | High | Every substantive spec carries the mandated Traceability block; `01-master-traceability-matrix.md` aggregates all seven with zero gaps between what each spec's Traceability block claims and what the matrix records — updated this session (Session 10) with `23-policy/01-*`'s entries, including its two proposed-not-applied additive changes recorded as open gap rows rather than silently omitted. |
| Overall Readiness | Early-to-Mid specification phase | Consistent with `docs/roadmap.md`'s own "Current Status" framing — this is not a claim of production readiness at any layer. |

## Percentage Completion

### Specification Completion

**Numerator**: 5 authored bounded-context module specs whose status `04-domain-model`'s own
Bounded Context Map currently reflects as authored (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`,
`SECURITY`).

**Denominator**: 10 total bounded contexts in `04-domain-model`'s bounded context map.

**Specification Completion remains 5/10 = 50% this session**, unchanged from Session 7,
**despite `23-policy/01-policy-management.md` now being authored** (module code `POLICY`).
This deliberately follows the precedent Session 6→7 already set for `SECURITY`: that module
was authored in Session 6 but the fraction stayed at its pre-`SECURITY` value until Session 7
actually applied `04-domain-model`'s own status-label amendment — the fraction counts what
`04-domain-model`'s map itself currently labels "authored," not what has been authored
elsewhere and merely proposed back to it. `23-policy/01-*` proposes, but this session does not
apply, the identical `POLICY (reserved)` → `POLICY (authored)` amendment (see Gap Assessment).
**Once that amendment is applied, Specification Completion becomes 6/10 = 60%** — flagged here
so a future session does not have to re-derive the arithmetic, the same forward note this
document gave for `SECURITY`'s own pending amendment between Sessions 6 and 7.

This figure **excludes** `04-domain-model` itself (a foundational cross-cutting document, not
a bounded context, so it does not belong in either the numerator or denominator) and excludes
the standalone `05-modules/`, `06-data-model/`, `07-workflows/`, `08-api/` section READMEs,
which remain "Not yet authored" as separate documents but whose content is currently satisfied
**inline within each module spec** by deliberate, established convention — not counted as a
gap in this percentage, per that convention.

### Platform Capability Completion

**Method**: a capability-count heuristic across the 24-row list in
[Platform Capability Matrix](#platform-capability-matrix), updated this session to move the
`Policy Management` row from "Not Started" to "Specified but Pending" following
`23-policy/01-policy-management.md` — 7 substrate rows + 12 GRC-domain rows + 5
cross-cutting-gap rows, the same 24-row denominator Session 6 established (the row itself
already existed; this session only changes its status). This is an auditable count, not an
effort-weighted estimate — a single "Built" substrate capability (e.g. RBAC) and a single "Not
Started" GRC-domain capability (e.g. Third-Party Risk) are counted as equally-weighted rows,
which likely **understates** the substrate's true implementation effort relative to a
not-yet-scoped future module. Treat this percentage as directional, not precise.

| Status | Count | Rows |
|---|---|---|
| **Already Built** | 7 | Identity & Tenancy, Multi-Tenancy RLS, Governance Ledger, RBAC, Module Framework, Audit Trail & Observability, Authentication |
| **Specified but Pending** | 8 | Risk Register, Control Library, Compliance/Regulatory Obligations, Audit Management, Cybersecurity Governance, Privileged Access Management, Secrets/Key/Certificate Governance, Policy Management |
| **Remaining (Not Started/Not Specified)** | 9 | Incident/Issue/CAPA, Third-Party Risk, Business Continuity, Reporting & Analytics, Document/Object Storage, Records Retention Schedule, Notification/Alerting, SIEM/Automated Threat Detection, ABAC |

**Already Built % = 7/24 ≈ 29%. Specified but Pending % = 8/24 ≈ 33%. Remaining % = 9/24 ≈
38%.** (Session 5's 19-row denominator was superseded by Session 6's 24-row count; the
underlying substrate rows and their "Built" status remain unchanged this session — only
`Policy Management`'s own status moved, per `23-policy/01-*`.)

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
  `Final Status` of its own beyond what it reports about the six authored specs.
- **Dependencies**: [`01-master-traceability-matrix.md`](01-master-traceability-matrix.md);
  all seven authored specs; `PRSMTD/docs/authoritative/system.md` (re-verified Session 6);
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
