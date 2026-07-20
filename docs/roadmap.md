# ERM Roadmap & Progress Tracker

This is the single source of truth for **progress tracking** across work sessions in this
repository — completed work, current status, the next milestone, and the live register of
assumptions, risks, and open decisions. It is updated at the end of every work session.

This document is distinct from [`19-roadmap/`](19-roadmap/), which holds the
**phasing/release-plan specification** (sequencing of capabilities toward the long-term
vision, per `CLAUDE.md`'s documentation hierarchy). `roadmap.md` tracks session-by-session
execution against that plan; `19-roadmap/` defines the plan itself once authored. Read
`CLAUDE.md` first in every session, then this file, before doing new work.

## Current Status

**Phase**: Early specification phase — sixth authoritative spec complete, and its three
proposed additive changes now applied. Session 6 closed the two remaining additive-change gaps
from `11-compliance` (`10-risk`'s `Risk.source` enum gained `COMPLIANCE_OBLIGATION`;
`12-controls` gained `POST /controls/{id}/obligation-links`), and authored
[`09-security/01-security-management.md`](09-security/01-security-management.md) — the
cross-cutting Security capability every prior module already committed to independently, plus
a genuine sixth module (`SECURITY`) covering security policy taxonomy, security baselines,
privileged access management, secrets/key/certificate governance, and security finding
(vulnerability/misconfiguration/policy-violation) management. **Session 7** applied the three
additive changes `09-security` had itself proposed without building (`Risk.source =
SECURITY_FINDING` on `10-risk`; an `AuditEvidence`/`Finding` extension on `13-audit`; a tenth
bounded-context row on `04-domain-model` — `SECURITY` is no longer outside that document's own
map), then performed a full architecture consistency review across all six authoritative specs
and corrected staleness the review found in `04-domain-model` (its Bounded Context Map,
Ownership Responsibilities, and Cross-Context APIs table still labeled `COMPLIANCE`/`AUDIT`
"(reserved)" with unactivated edges, never updated after those two were authored in Sessions
4–5) and in `10-risk` (its Integration Points table still listed long-activated `CONTROLS`/
`AUDIT` rows as "Reserved"). No entity, aggregate, workflow, or ownership assignment was
redesigned by any of these corrections.

**Repository state**: Scaffolding (all 22 `docs/NN-*/README.md` section indexes plus
`docs/reference/`) was already initialized and validated internally consistent against
`CLAUDE.md` prior to Session 1. Six authoritative specs now exist: `RISK`, `CONTROLS`, the
Enterprise Domain Model, `COMPLIANCE`, `AUDIT`, and `SECURITY` — and, as of Session 7, the
Enterprise Domain Model's own Bounded Context Map names all five business-domain modules
(`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, `SECURITY`) plus five still-reserved contexts
(`POLICY`, `INCIDENT`/`ISSUE`/`CAPA`, `THIRD-PARTY RISK`, `BUSINESS CONTINUITY`, `REPORTING`) —
ten total, all cross-references internally consistent. One traceability/assessment artifact
(`22-traceability/02-compliance-coverage-assessment.md`) supplements the master matrix,
incrementally updated (not regenerated) each session.

## Completed Work

### Session 1 — 2026-07-19

- Validated the existing `docs/` scaffolding (all 22 section READMEs, root `README.md`,
  `docs/README.md`) for internal consistency and alignment with `CLAUDE.md`'s repository
  organization, naming standards, and cross-reference rules. No inconsistencies found.
- Studied PRSMTD `docs/authoritative/system.md` (governance ledger/GOV-07, RLS/data model
  conventions, RBAC model, module framework and ownership guards, observability trace
  contract, audit, authentication) to ground capability reuse decisions.
- Studied the SEBI *Risk Management System* circular (MFD/CIR/15/19133/2002) for regulatory
  drivers and the risk taxonomy.
- Authored the repository's **first authoritative specification**:
  [`10-risk/01-enterprise-risk-management.md`](10-risk/01-enterprise-risk-management.md) —
  implementation-ready spec for the Enterprise Risk Management module (`RISK`), covering
  domain model, data model (12 tables, `SEBI_AMC` seed taxonomy), maker-checker workflows,
  security/authorization, audit, reporting, integration points, and API contract.
- Updated [`10-risk/README.md`](10-risk/README.md) status to reflect the authored spec.
- Authored [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  (Business↔Regulatory, Capability↔PRSMTD, Requirement↔Spec matrices), seeded from the Risk
  spec, and updated `22-traceability/README.md` status.
- Created this file (`docs/roadmap.md`) and referenced it from `docs/README.md`.

### Session 2 — 2026-07-19

- Re-read `10-risk/01-enterprise-risk-management.md` as the authoritative baseline (per
  explicit instruction) and confirmed the Controls integration point without modifying it.
- Studied PRSMTD `system.md` further: module manifest field spec, `module.yaml` reference
  implementation (`modules/contacts/module.yaml`), OWN-03/04/07/08/09 schema/API/dependency/
  service-boundary rules. **Discovered `system.md §18` (Product Framework Doctrine)** —
  not reviewed in Session 1 — which designates `module.code = ERM`,
  `productClass: PRODUCT_FRAMEWORK` as the constitutional Product Framework for the
  enterprise risk domain (V1 scope: AMC Operational Risk), a richer manifest contract than
  the generic §9 framework `RISK` and `CONTROLS` both use. Flagged as a discovered
  gap/reconciliation question (see Assumptions and Risks below) rather than acted on, per
  the explicit instruction to integrate with the existing Risk module without redesigning
  it.
- Extracted usable regulatory text from `docs/reference/Annexures to Master Circular for
  Mutual Funds as on March 31, 2023_p.pdf` (text-extractable via `pdftotext`) — found a
  System Audit Program Checklist (IT Governance, Information Security/Cyber Security, Access
  Management/SOD, Change Management, Incident Management, Backup & Recovery, Job Processing,
  BCP/DR) and a Financial Reporting Risk section (ICFR testing, segregation of duties,
  reconciliation) — used to ground the Control Family taxonomy with real citations. Confirmed
  `docs/reference/Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs
  (2019).pdf` is a scanned/image-only PDF with no extractable text layer in this environment
  (`pdftoppm`/OCR unavailable) — cited at scope level only, flagged for manual verification.
- Confirmed PRSMTD provides no document/object storage capability (searched `system.md` for
  "document"/"attachment"/"blob"/"evidence"/"object storage" — none found as a platform
  mechanism) — a genuine new capability requirement for evidence binary storage.
- Authored the repository's **second authoritative specification**:
  [`12-controls/01-controls-management.md`](12-controls/01-controls-management.md) —
  implementation-ready spec for the Controls Management module (`CONTROLS`), covering
  control taxonomy (12-family `SEBI_AMC` seed set), preventive/detective/corrective and
  manual/automated/IT-dependent-manual classification, ownership, lifecycle, design/operating
  effectiveness, testing, evidence management, exceptions, and the full
  security/authorization/audit/reporting/API surface (8 tables). Activates `10-risk`'s opaque
  `RiskTreatmentPlan → Control` link via a cross-module, API-mediated reference (OWN-08/
  OWN-09 compliant) — **no changes made to `10-risk/01-*.md`**.
- Updated [`12-controls/README.md`](12-controls/README.md) status to reflect the authored
  spec.
- Updated [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  with the Controls spec's Business↔Regulatory, Capability↔PRSMTD, and Requirement↔Spec
  entries, including the two new gaps discovered (document/object storage; `system.md §18`
  reconciliation).
- Updated this file with Session 2 progress, refreshed assumptions/risks/open decisions, and
  the next recommended milestone.

### Session 3 — 2026-07-20

- Re-read `10-risk/01-enterprise-risk-management.md` and `12-controls/01-controls-management.md`
  in full as frozen, authoritative inputs (per explicit instruction not to redesign either
  without a genuine architectural inconsistency — none was found; both remain unmodified).
- Studied PRSMTD `system.md` §9 (Module framework, manifest specification), §5b6–§5b7
  (OWN-08 dependency rules, OWN-09 service boundary), §3 (GOV-07 governance model), and
  re-read §18 (Product Framework Doctrine) in full — confirming the `module.code = ERM`
  constitutional designation and its V1 scope ("AMC Operational Risk — risk register, KRI
  monitoring, exception governance, inspection-aligned evidence packs") first discovered in
  Session 2, plus the full binding contract set (PF-CT-1–6, PF-GV-1–5, PF-CW-1–8) not
  previously read section-by-section.
- Read `modules/contacts/module.yaml` and `modules/module-template/module.yaml` to confirm
  PRSMTD ships no business-domain bounded context of its own — both are reference
  implementation/scaffolding for the generic module framework, contributing manifest shape
  only, not ERM vocabulary.
- Read every relevant future-context section README (`11-compliance`, `13-audit`,
  `05-modules`, `20-adr`, `21-standards`, `06-data-model`) to ground each reserved
  bounded-context entry in what those sections already commit to, without inventing scope
  beyond their own READMEs.
- Authored the repository's **third authoritative specification**:
  [`04-domain-model/01-enterprise-domain-model.md`](04-domain-model/01-enterprise-domain-model.md)
  — the cross-context bounded context map (DDD relationship types between `RISK`, `CONTROLS`,
  and nine reserved future contexts), the canonical business glossary superseding both
  modules' inline "authoritative until `04-domain-model/`" glossaries, a shared kernel of five
  cross-context modeling patterns (regulatory-profile-seeded taxonomy, governed lifecycle with
  append-only history, immediate-raise/governed-closure exception, opaque cross-context
  reference with local mirror, human-readable code sequence), the strategic subdomain
  classification (core/supporting/generic), ownership responsibilities, and the OWN-08/OWN-09
  dependency-rule graph. Resolved two internal ambiguities explicitly rather than silently:
  KRI is confirmed as a `RISK`-owned aggregate, not a separate future module; Regulatory
  Management is modeled as part of one `COMPLIANCE` context, not a separate one (flagged for
  confirmation when `11-compliance` is authored). Reframed the `system.md §18` question
  (Session 2's discovered gap) as a PRSMTD **module/manifest packaging** decision distinct
  from the **DDD bounded-context boundary**, which does not change either way the ADR
  resolves — narrowing, not resolving, that open decision.
- Updated [`04-domain-model/README.md`](04-domain-model/README.md) status to reflect the
  authored spec.
- Updated [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  with the Domain Model spec's Business↔Regulatory, Capability↔PRSMTD, and Requirement↔Spec
  entries, closing the "cross-context bounded context map" gap row and adding two new
  precisely-scoped gaps (Compliance/Regulatory Management boundary confirmation; a missing
  `Risk.source` enum value for Compliance-sourced risks).
- Updated this file with Session 3 progress, refreshed assumptions/risks/open decisions, and
  the next recommended milestone.

### Session 4 — 2026-07-20

- Re-read `04-domain-model/01-enterprise-domain-model.md`, `10-risk/01-enterprise-risk-management.md`,
  and `12-controls/01-controls-management.md` in full as frozen, authoritative inputs (per
  explicit instruction not to redesign any of them without a genuine architectural
  inconsistency — none was found; all three remain unmodified).
- Re-verified against current `PRSMTD/docs/authoritative/system.md` (full section listing,
  plus a targeted search for "object storage", "document storage", "blob storage",
  "regulatory profile") that no new platform capability has appeared since `10-risk`
  Assumption 3 and `12-controls` Assumption 4 were written — both gaps remain open exactly as
  those specs describe them.
- Extracted and read Annexures to Master Circular for Mutual Funds (March 31, 2023) §2.6
  "Compliance Risk" via `pdftotext` — not previously cited by `10-risk` (different source
  document) or `12-controls` (cited §2.5/§2.11 of the same document, not §2.6) — providing
  seventeen mandatory policy domains (§2.6.2.1(i) a–q), defined filing responsibilities
  (§2.6.2.1(ii) a–g), AML/CFT program attributes (§2.6.2.1(iii) a–d), and quarterly/
  half-yearly alert-reporting requirements (§2.6.2.1(iv) a–b) as this module's primary,
  directly-grounded regulatory driver.
- Authored the repository's **fourth authoritative specification**:
  [`11-compliance/01-compliance-management.md`](11-compliance/01-compliance-management.md) —
  implementation-ready spec for the Compliance Management module (`COMPLIANCE`), covering
  regulatory framework/profile registries (the first tables in this repository to formally
  own the `regulatory_profile` tag convention `10-risk`/`12-controls` each already use
  informally), an 8-category `SEBI_AMC` seed obligation taxonomy grounded in Annexures §2.6,
  the `Obligation` aggregate root and its governed lifecycle, compliance assessment,
  compliance exceptions (mirroring `ControlException`'s immediate-raise/governed-closure
  shape), compliance attestations, the compliance calendar (deliberately ungoverned at MVP),
  regulatory change management, evidence coordination (metadata-only, reusing
  `ControlEvidence`'s shape by convention rather than duplicating it), and the full
  security/authorization/audit/reporting/API surface (14 tables total: 4 reference, 10 core).
- **Resolved one open domain-model question explicitly**: confirmed `04-domain-model`
  Assumption 4 — Compliance Management and Regulatory Management are one bounded context,
  `COMPLIANCE`, not two — by authoring exactly the single-aggregate-root entity set
  (`Obligation`, `ObligationCategory`, `ComplianceAssessment`, `RegulatoryChange`) that
  document already anticipated, and by explicitly treating "Regulatory Obligation" and
  "Compliance Requirement" as one concept rather than introducing a second aggregate root
  (spec Assumption 4).
- **Activated, by proposal rather than by editing frozen specs, two long-standing forward
  references**: (a) `10-risk`'s `Risk.source` enum gains an additive `COMPLIANCE_OBLIGATION`
  value at implementation time (proposed in this spec's Integration with Risk section,
  mirroring exactly how `12-controls` activated `CONTROL_TEST` without editing `10-risk`);
  (b) `12-controls`' reserved `module_controls_control_obligation_link` table needs a new,
  additive `CONTROLS`-side endpoint (`POST /controls/{id}/obligation-links`) to populate it,
  since its existing `POST /controls/{id}/references` endpoint is hardcoded to the *Risk*
  mirror's column shape — discovered and proposed, not built, mirroring exactly how
  `12-controls` itself proposed but did not build a "bidirectional Risk coverage reporting"
  extension to `10-risk`. **Neither `10-risk/01-*.md` nor `12-controls/01-*.md` was
  modified.**
- Updated [`11-compliance/README.md`](11-compliance/README.md) status to reflect the
  authored spec.
- Updated [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  with the Compliance spec's Business↔Regulatory, Capability↔PRSMTD, and Requirement↔Spec
  entries — closing the Compliance/Regulatory Management boundary gap and the missing-enum
  gap, inheriting (not duplicating) the document/object-storage gap, and adding two new
  precisely-scoped gaps (the proposed `CONTROLS`-side obligation-link endpoint; a
  general-purpose Records Retention Schedule capability, explicitly named rather than
  silently absorbed).
- Updated this file with Session 4 progress, refreshed assumptions/risks/open decisions, and
  the next recommended milestone.

### Session 5 — 2026-07-20

- Surfaced and resolved, with the user, a structural conflict between an in-session task
  prompt and `CLAUDE.md`'s frozen repository rules: the prompt requested
  `docs/compliance/compliance-coverage-assessment.md` and
  `docs/reports/compliance-assessment.md`, both outside the approved `docs/NN-section-name/`
  hierarchy and in tension with `CLAUDE.md`'s "no new top-level docs without explicit
  proposal" rule. Resolved by user decision: the compliance coverage assessment is authored
  as `22-traceability/02-compliance-coverage-assessment.md` instead (fits the existing
  approved Traceability section); sequencing was also confirmed as the Audit module spec
  first, compliance assessment second, both in this session.
- Re-read `04-domain-model/01-enterprise-domain-model.md`, `10-risk/01-*`, `12-controls/01-*`,
  and `11-compliance/01-*` in full as frozen, authoritative inputs (per explicit instruction
  not to redesign any of them without a genuine architectural inconsistency — none was found;
  all four remain unmodified).
- Extracted and read Annexures to Master Circular for Mutual Funds (March 31, 2023) §1.3.4.1
  (Internal Audit as a mandatory line of defense; non-compliance rate; Rectification Index)
  and Annexure 8 clause 55 (semi-annual System Audit by a CISA/CISM-qualified or CERT-IN
  empanelled auditor; three-month SEBI filing deadline) via `pdftotext` — not previously cited
  at this precision by any prior spec (`12-controls` cited the System Audit Program
  Checklist's *content*, not its governing cadence clause).
- Confirmed via `04-domain-model`'s Cross-Context APIs table and a direct read of
  `12-controls`' `Control.source` enum that both `Risk.source = AUDIT_FINDING` and
  `Control.source = AUDIT_FINDING` were already live at authoring time — unlike
  `11-compliance`, this session's spec required **no** proposed additive change to any frozen
  source spec to activate its primary cross-context integrations.
- Authored the repository's **fifth authoritative specification**:
  [`13-audit/01-audit-management.md`](13-audit/01-audit-management.md) — implementation-ready
  spec for the Audit Management module (`AUDIT`), covering the audit universe, risk-based
  audit planning, the engagement lifecycle (internal audit, system audit, concurrent audit,
  thematic review, special investigation), working papers, a four-source evidence model
  (native upload, `CONTROLS`-evidence reference, `COMPLIANCE`-evidence reference, and a new
  system-trace-extract source citing PRSMTD's own Observability & Deterministic Trace
  Contract directly — the first evidentiary path in this repository not dependent on the
  still-open object-storage gap), Finding governance (immediate-raise, governed-closure),
  follow-up actions, and the Annexures-mandated Non-Compliance Rate / Rectification Index
  metrics (9 tables: 1 reference, 8 core). This is the first module whose own manifest
  declares `dependencies: [RISK, CONTROLS, COMPLIANCE]` at authoring time, consistent with
  `04-domain-model`'s designation of `AUDIT` as a Conformist graph sink.
- Updated [`13-audit/README.md`](13-audit/README.md) status to reflect the authored spec.
- Authored
  [`22-traceability/02-compliance-coverage-assessment.md`](22-traceability/02-compliance-coverage-assessment.md)
  — a repository-wide compliance coverage assessment distinguishing (a) what the current
  PRSMTD platform already implements today, from (b) what the current ERM specifications
  (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, the Domain Model) would additionally enable if
  implemented, from (c) what remains unspecified — across SEBI Mutual Fund regulation, DPDP
  Act, CERT-In Directions, and international frameworks (ISO 27001/27701/22301/31000, COBIT,
  NIST CSF) at the precision the current specifications actually support. Explicitly does not
  certify legal/regulatory compliance.
- Updated [`22-traceability/README.md`](22-traceability/README.md) to reference the new
  assessment document.
- Updated [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  with the Audit spec's Business↔Regulatory, Capability↔PRSMTD, and Requirement↔Spec entries
  — closing the "Audit findings as a risk source; control test evidence as audit evidence"
  gap row, and recording that no new gap was introduced by this spec beyond the two already
  flagged (object-storage; `system.md §18` reconciliation).
- Updated this file with Session 5 progress, refreshed assumptions/risks/open decisions, and
  the next recommended milestone.

### Session 6 — 2026-07-20

- Re-read `04-domain-model/01-*`, `10-risk/01-*`, `12-controls/01-*`, `11-compliance/01-*`,
  and `13-audit/01-*` in full as authoritative inputs, per explicit instruction to treat all
  existing specs as frozen unless a genuine architectural inconsistency is discovered (none
  was found in any of the five; all five's own domain/data models remain unmodified — only
  the two pre-approved additive changes below and consequent cross-reference updates were
  applied).
- **Phase 1 — completed both additive Compliance-driven enhancements** `docs/roadmap.md`'s
  own Next Milestone (Session 5) named as item 1, per explicit user approval this session:
  - Added `Risk.source = COMPLIANCE_OBLIGATION` to `10-risk/01-enterprise-risk-management.md`
    (Data Model `module_risk_register.source`; Integration Points table updated to
    Activated) — one-line, additive, non-breaking; recorded in that document's new Amendment
    log.
  - Added `POST /controls/{id}/obligation-links` to
    `12-controls/01-controls-management.md` (new "Activating the Control → Obligation Link"
    section, APIs table, Architecture's future `dependencies: [COMPLIANCE]` note) — additive,
    non-breaking, no schema change (`module_controls_control_obligation_link` already carried
    the required shape); recorded in that document's new Amendment log.
  - Updated `11-compliance/01-compliance-management.md`'s own cross-references (Assumption 6,
    Integration with Risk, Integration with Controls, Dependencies, Future Extension Points)
    from "proposed, not built" to "activated," per its own Amendment log — **no redesign of
    that document's domain model, data model, or workflows**.
  - Closed both corresponding gap rows in
    [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md).
- Studied PRSMTD `system.md` §6 (Security model — plane separation, platform realm
  architecture, multi-issuer authentication), §7 (`encryption_keys`/`encryption_key_versions`
  key registry), §8 (RBAC model, all domains, re-read in full), §5c (Module Security Model),
  §11 (Production Credential Policy — forbidden-credential doctrine, external secrets store
  requirement; Release 0.7 Network Infrastructure Invariants — Wildcard DNS/TLS, Realm
  Factory per-realm service accounts), §17 (Runtime Validator Harness Doctrine — constitutional
  smoke/extended/experimental tier vocabulary), §21 (Authentication Surface Ownership,
  re-read in full), §22 (Observability Canonical Access) — none previously read at this depth
  by any prior session — to ground Phase 2's reuse-before-redesign decisions.
- **Phase 2 — authored the repository's sixth authoritative specification**:
  [`09-security/01-security-management.md`](09-security/01-security-management.md) — the
  shared enterprise Security capability. Two-part design: (a) a **consolidation** of the
  identity/authentication/RBAC/segregation-of-duties/data-classification content every one of
  `RISK`/`CONTROLS`/`COMPLIANCE`/`AUDIT` already independently states inline, named
  canonically once (a full PRSMTD Security Substrate Reuse Matrix maps all ~21 sub-capabilities
  named in this session's brief to Built/Specified/Gap); and (b) a genuine new module,
  module code `SECURITY`, covering `SecurityPolicyDomain` (taxonomy), `SecurityBaseline`
  (reference register — compliance testing deliberately left to `CONTROLS`' existing
  `ControlTest`, not duplicated), `SecurityFinding` (one immediate-raise/governed-closure
  entity for vulnerabilities/misconfigurations/policy-violations/access-anomalies, mirroring
  `13-audit`'s `Finding` design exactly), `SecurityAsset` (one governed inventory register for
  secrets/API keys/encryption keys/TLS certs/signing certs/SSH keys — ownership and
  rotation/expiry tracking only, never credential material), and `SecurityAccessGrant` (a
  time-bound, `pending_action`-governed Privileged Access Management record with immediate,
  ungoverned revocation) — 8 tables total (3 reference, 5 core/evidence).
- **Explicitly surfaced, not silently resolved, a gap in `04-domain-model`**:
  its Bounded Context Map does not reserve a `SECURITY` context, despite `CLAUDE.md`'s
  long-term vision naming Cybersecurity Governance as its own capability. Per this session's
  explicit instruction not to redesign frozen specs absent a genuine inconsistency,
  `09-security/01-*` **proposes, but does not apply,** the additive tenth-context amendment
  `04-domain-model` would need — the same discipline `11-compliance` used for its own two
  proposals before they were approved and applied this session.
- **Proposed, but did not apply, three further additive changes** (all consistent with the
  now-twice-proven "propose in the new spec, apply in a later approved session" pattern):
  `Risk.source = SECURITY_FINDING` on `10-risk`; an `AuditEvidence.evidence_source =
  SECURITY_EVIDENCE_REFERENCE` value plus a `Finding.linked_security_finding_id` column on
  `13-audit`; and the `04-domain-model` tenth-context row above. **No change was made to
  `10-risk/01-*.md` or `13-audit/01-*.md`** by this session beyond what Phase 1 already
  approved.
- **Named two genuinely new PRSMTD capability gaps**, verified absent this session: a
  SIEM/automated-threat-detection/security-event-correlation capability (general
  notification/alerting was attempted platform-wide and explicitly retired per system.md
  PR-RESET-02 — a stronger finding than "never built"); and an ABAC policy-decision mechanism
  (PRSMTD implements RBAC exclusively, three closed domains, system.md §8).
- Updated [`09-security/README.md`](09-security/README.md) status to reflect the authored
  spec.
- Updated [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  with the Security spec's Business↔Regulatory, Capability↔PRSMTD, and Requirement↔Spec
  entries — closing the two Phase 1 gap rows and adding five new precisely-scoped gap rows
  (the `04-domain-model` tenth-context proposal; the `Risk.source = SECURITY_FINDING`
  proposal; the `AuditEvidence`/`Finding` extension proposal; the SIEM gap; the ABAC gap).
- Incrementally updated (never regenerated)
  [`22-traceability/02-compliance-coverage-assessment.md`](22-traceability/02-compliance-coverage-assessment.md)
  — only the sections Session 6's changes affect: Executive Summary, Question 2, Platform
  Capability Matrix (+5 rows), Compliance Coverage Matrix (Cyber Security Framework row),
  Control-Level Matrix (+2 rows), Enterprise Capability Matrix (+1 row), Regulatory Readiness
  Matrix (Cyber Security Framework row), Gap Assessment (2 gaps closed, 4 new gaps added),
  Roadmap Validation, Specification Progress Matrix, Repository Maturity, and Percentage
  Completion (Platform Capability Completion recount to 24 rows; Specification Completion's
  4/9 figure explicitly preserved unchanged, with `SECURITY` noted as outside that fraction's
  scope, not folded in). Every matrix continues to explicitly distinguish Already Built in
  PRSMTD / Fully Specified in ERM but Yet to Build / Not Yet Specified, per this session's
  instruction.
- Updated this file with Session 6 progress, refreshed assumptions/risks/open decisions, and
  the next recommended milestone.

### Session 7 — 2026-07-20

- Re-read all six authoritative specs (`04-domain-model/01-*`, `10-risk/01-*`,
  `12-controls/01-*`, `11-compliance/01-*`, `13-audit/01-*`, `09-security/01-*`) in full,
  together, before making any change, per this session's explicit instruction. Treated all six
  as frozen except for genuinely additive amendments and genuine architectural inconsistencies
  found during review — no entity, aggregate, workflow, API, or ownership assignment was
  redesigned anywhere in this session.
- **Phase 1 — applied the three additive amendments identified during `09-security`'s own
  authoring (Session 6), all explicitly authorized this session**:
  1. Reserved the `SECURITY` bounded context within the Enterprise Domain Model: amended
     `04-domain-model/01-enterprise-domain-model.md`'s Strategic Classification, Bounded
     Context Map (mermaid + narrative subsection), Ownership Responsibilities, Canonical
     Business Glossary, and Dependency Rules (new Rule 7) to add `SECURITY` as a tenth, Core
     Domain, authored context — peer to `CONTROLS`/`COMPLIANCE`, Conformist supplier toward
     `AUDIT` — closing the gap `09-security/01-*` Assumption 1 discovered.
  2. Added `Risk.source = SECURITY_FINDING` to `10-risk/01-enterprise-risk-management.md`'s
     `module_risk_register.source` enum (Data Model) and activated the corresponding
     Integration Points row — a one-line, additive, non-breaking change, the same kind of
     change `11-compliance` and `12-controls` each already made live for their own values.
  3. Extended `13-audit/01-audit-management.md` so Security Findings can participate in the
     audit evidence/finding model: added `AuditEvidence.evidence_source =
     SECURITY_EVIDENCE_REFERENCE` (Data Model, `module_audit_evidence`) and
     `Finding.linked_security_finding_id` (Data Model, `module_audit_finding`), a new
     "Integration with Security" section, and a `SECURITY` entry to `AUDIT`'s own
     `dependencies:` declaration (now `[RISK, CONTROLS, COMPLIANCE, SECURITY]`).
  4. Updated `09-security/01-security-management.md`'s own cross-references (Assumption 1,
     Assumption 14, Relationship to the Enterprise Domain Model, Integration with Risk,
     Integration with Audit, Ownership Boundaries table, Dependencies, Future Extension
     Points, Traceability) from "proposed, not applied" to "activated," and added the one
     net-new, additive endpoint the Audit activation required —
     `GET /findings/{id}/reference` (API Surface) — the same reference-resolution endpoint
     shape every other supplying context in this repository already exposes.
  - Recorded all four amendments in each document's own Amendment Log (new for
    `04-domain-model` and `09-security`; appended for `10-risk` and `13-audit`).
- **Phase 2 — performed a complete architecture consistency review** across bounded context
  ownership, aggregate/entity ownership, shared concepts, terminology, enumerations, lifecycle
  consistency, API consistency, event flows, traceability, cross-references, PRSMTD capability
  reuse, compliance coverage, and roadmap alignment, for all six authoritative specs together.
  Found and corrected three genuine, pre-existing inconsistencies (none introduced by Phase 1;
  all were artifacts of `04-domain-model` never having been revisited after later modules were
  authored) — no speculative redesign, no new authoritative documents created:
  1. `04-domain-model`'s Bounded Context Map, Strategic Classification, Ownership
     Responsibilities, Cross-Context APIs table, and "Evidence as a Cross-Cutting Concept"
     section still labeled `COMPLIANCE` and `AUDIT` "(reserved)" with dashed,
     not-yet-activated edges, despite both having been authored (Sessions 4 and 5
     respectively) with their integrations fully activated. Corrected to "(authored)" with
     solid edges; no relationship type, direction, or ownership assignment changed — only the
     status label and cross-reference prose.
  2. `10-risk`'s own Integration Points table still listed its `CONTROLS` link as "Reserved,
     opaque reference; inert until Controls module ships" (stale since Session 2) and its
     `AUDIT` link as "Not yet specified; `Risk.source = AUDIT_FINDING` reserved" (stale since
     Session 5). Both corrected to Activated, cross-referencing each supplying document's own
     Integration section.
  3. `11-compliance` carried two broken anchor links to `04-domain-model`'s
     `#compliance-reserved` heading, which no longer exists now that the heading reads
     `COMPLIANCE (authored)`. Corrected to `#compliance-authored`.
- Incrementally updated (never regenerated)
  [`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
  — closed the three additive-change gap rows from Session 6, updated the `AUDIT`/`SECURITY`/
  Enterprise-Domain-Model Capability↔PRSMTD rows to reflect Session 7 activation, and added a
  Session 7 paragraph to Status documenting both the Phase 1 activations and the Phase 2
  consistency corrections.
- Incrementally updated (never regenerated)
  [`22-traceability/02-compliance-coverage-assessment.md`](22-traceability/02-compliance-coverage-assessment.md)
  — updated the ERM-verification document count (five → six authored specs) in Scope and
  Method; updated Executive Summary, Gap Assessment (closed three gap rows, added one new
  Session-7-discovered-and-closed row for the `04-domain-model`/`10-risk` staleness), Roadmap
  Validation, Repository Maturity, and Percentage Completion. **Specification Completion
  recalculated from 4/9 ≈ 44% to 5/10 = 50%** — a direct, mechanical consequence of
  `04-domain-model`'s own bounded-context map gaining a tenth (`SECURITY`) context, not a
  redefinition of what the fraction measures. Platform Capability Completion (24-row count)
  is unchanged — no new capability rows were added this session, only cross-references between
  already-counted rows were activated.
- Updated this file with Session 7 progress, refreshed assumptions/risks/open decisions, and
  the next recommended milestone.

## Next Milestone

With `RISK`, `CONTROLS`, the Domain Model, `COMPLIANCE`, `AUDIT`, and `SECURITY` all authored,
and (Session 7) `SECURITY` fully folded into the Domain Model's own bounded-context map with
all three of its proposed additive changes applied, Session 6's Next Milestone item 1 is
**complete** (see Session 7 above). Recommended next candidates, in order:

1. **`20-adr/` entries formalizing the now-repeatedly-confirmed conventions** — the
   persona-to-module-role mapping pattern, confirmed by **five** modules now (`10-risk`
   through `09-security`); the `system.md §18` Product Framework reconciliation. Both are
   consolidation work over what already exists, not a new bounded context — recommended first,
   before starting a seventh bounded context, since no further near-zero-effort additive
   activation remains queued (unlike Sessions 6–7).
2. **`POLICY` (reserved bounded context)** — named as an Open Host Service dependency by
   `12-controls`, `11-compliance`'s "Integration with Future Policy Management", and
   `09-security`'s identical treatment of its own `SecurityPolicyDomain` taxonomy; no section
   README exists for it yet under `CLAUDE.md`'s repository organization (not listed in
   `docs/05-modules/README.md`'s illustrative list either), so authoring it first requires a
   scoping decision (which `docs/NN-*/` section owns it) before a module spec can begin.
3. **`INCIDENT`/`ISSUE`/`CAPA` (reserved bounded context)** — now named as a forward
   reference by **five** modules (`10-risk`, `12-controls`, `11-compliance`, `13-audit`,
   `09-security`), the most-referenced unactivated context in the repository;
   `04-domain-model` already resolved its Customer-Supplier relationship shape, but its own
   module-code naming question (`INCIDENT`? `ISSUE`? a combined code?) remains open.
4. **SIEM/automated-threat-detection capability and ABAC policy-decision mechanism** — both
   named in Session 6 by `09-security/01-*` as genuine PRSMTD capability gaps, neither urgent
   nor currently blocking any module's MVP; tracked explicitly so neither is forgotten (see
   Assumptions below). Unaffected by Session 7's activation work — both remain open.

Current recommendation is **item 1** first (low-effort ADR consolidation over conventions
already confirmed five times), then item 2 or item 3 depending on whether a seventh bounded
context is preferred next — see Open Decisions below for the reasoning trade-off.

## Assumptions (live register)

Carried forward from both authored specs — re-verify if stale:

1. Tenant = one AMC; both `RISK` and `CONTROLS` are entirely tenant-plane.
2. Regulatory profile variation (`SEBI_AMC` now, others later) is achieved via tenant-level
   reference-data customization (`RISK_ADMIN`/`CONTROLS_ADMIN`), not a new PRSMTD platform
   capability — revisit if profile count grows.
3. No platform-level regulatory-profile-parameterized module seeding mechanism was found in
   PRSMTD `system.md` §9 as of Session 1 — treated as a confirmed absence for MVP planning
   purposes, not independently verified against PRSMTD source code.
4. Users referenced by module data (owners, assessors, approvers, testers) are platform/
   tenant identity records, not module-owned data — cross-referencing them by UUID is not an
   OWN-08/OWN-09 boundary violation.
5. Record retention period for risk and control records is unspecified by the source
   circulars read so far; deferred to `11-compliance`.
6. **New (Session 2)**: PRSMTD provides no document/object storage capability as of this
   review — `12-controls`' `ControlEvidence.storage_ref` is an opaque pointer pending this
   gap; flagged as a genuine new PRSMTD capability requirement, not designed in either spec.
7. **New (Session 2)**: the *Cyber Security and Cyber Resilience Framework for Mutual Funds
   AMCs (2019)* PDF is scanned/image-only in this environment — no extractable text layer,
   `pdftoppm` unavailable for page rendering. `12-controls`' citation of it is scope-level
   only and should be manually verified against the source before implementation.
8. **New (Session 2)**: PRSMTD `system.md §18` designates `module.code = ERM` as the
   constitutional Product Framework for the enterprise risk domain — a richer manifest
   contract than the generic §9 framework this repository's `RISK` and `CONTROLS` specs use.
   Not reconciled; does not block current MVP scope (see Risks and Open Decisions).
9. **New (Session 3)**: Regulatory Management is assumed to be part of one `COMPLIANCE`
   bounded context, not a separate context from Compliance Management — based on
   `11-compliance/README.md` scoping both together, over `05-modules/README.md`'s illustrative
   (and looser) module list naming "Regulatory" separately. Flagged for explicit confirmation
   when `11-compliance` is authored, not decided as final.
10. **New (Session 3)**: `10-risk`'s `Risk.source` enum (`MANUAL, AUDIT_FINDING, INCIDENT,
    CONTROL_TEST, KRI_BREACH`) has no value for a Compliance-obligation-driven risk. This is a
    gap the domain model surfaced that neither `10-risk` nor `12-controls` needed to anticipate
    at authoring time; closing it (adding e.g. `COMPLIANCE_OBLIGATION`) is an additive,
    non-breaking change deferred to when `11-compliance` is authored.
11. **Resolved (Session 4)**: Regulatory Management is confirmed as part of one `COMPLIANCE`
    bounded context, not a separate context — Assumption 9 above is no longer an open
    question; `11-compliance/01-*` was authored against exactly the single-aggregate-root
    entity set `04-domain-model` anticipated (`Obligation`, `ObligationCategory`,
    `ComplianceAssessment`, `RegulatoryChange`).
12. **New (Session 4)**: `10-risk`'s `Risk.source` enum gaining `COMPLIANCE_OBLIGATION`
    (Assumption 10 above) and `12-controls` gaining a `POST /controls/{id}/obligation-links`
    endpoint are now both **proposed, precisely-scoped, additive changes** — see
    `11-compliance/01-*`'s Integration with Risk / Integration with Controls sections — but
    neither has been applied to its frozen source spec yet. Treat both as open implementation-
    time TODOs, not as already-live enum values/endpoints.
13. **New (Session 4)**: `module_compliance_profile` is this repository's first formal
    registry of valid `regulatory_profile` tag values. `10-risk`'s `RiskCategory` and
    `12-controls`' `ControlFamily` continue to carry `regulatory_profile` as a plain string
    tag with no FK to this new table (by design — see `11-compliance/01-*` Assumption 2);
    alignment between the tag values and the registry is a tenant-onboarding governance
    discipline, not a database-enforced constraint. Revisit if drift between the two is
    observed in practice.
14. **New (Session 4)**: a general-purpose, cross-module Records Retention Schedule
    capability (mapping record types to statutory retention periods) remains genuinely
    unspecified. `10-risk` Assumption 7 and `12-controls` Assumption 7 each deferred this to
    `11-compliance`; `11-compliance/01-*` Assumption 10 confirms its own tables are
    retention-agnostic by design (append-only/status-transitioned, same as `10-risk`/
    `12-controls`) but explicitly does not design the cross-module capability itself — it
    was not one of this module's thirteen assigned responsibilities. Named as a real future
    enhancement, not silently dropped.
15. **New (Session 5)**: `13-audit/01-*` required **no** additive change to any frozen source
    spec — `Risk.source = AUDIT_FINDING` and `Control.source = AUDIT_FINDING` were both
    already live at authoring time (unlike `11-compliance`'s two still-open proposed changes,
    Assumption 12 above). This is the first module in the repository to activate its primary
    cross-context integrations without proposing any change to an existing frozen document.
16. **New (Session 5)**: `13-audit` is the first module whose own manifest declares
    `dependencies: [RISK, CONTROLS, COMPLIANCE]` at authoring time, rather than a downstream
    consumer's manifest gaining the edge later — consistent with `04-domain-model`'s
    designation of `AUDIT` as a Conformist graph sink (Dependency Rule 5), not a deviation
    from the dependency-rule graph.
17. **New (Session 5)**: `13-audit`'s `SYSTEM_TRACE_EXTRACT` evidence source (citing PRSMTD's
    Observability & Deterministic Trace Contract, system.md §4.1, directly as evidence) is the
    first evidentiary path in this repository not dependent on the still-open document/
    object-storage capability gap (Assumption 6). It does not close that gap for
    natively-uploaded evidence in `10-risk`/`12-controls`/`11-compliance`/`13-audit`'s other
    three evidence sources — those remain exactly as open as before.
18. **New (Session 5)**: an in-session task prompt requested two new top-level documentation
    locations (`docs/compliance/`, `docs/reports/`) outside `CLAUDE.md`'s approved
    `docs/NN-section-name/` hierarchy. Resolved by explicit user decision: the requested
    compliance coverage assessment was authored as
    `22-traceability/02-compliance-coverage-assessment.md` instead, preserving `CLAUDE.md`'s
    structure rule rather than overriding it. If a future session receives a similar
    request, treat this resolution as precedent, not as a one-off exception.
19. **Resolved (Session 6)**: the two additive changes Assumption 12 tracked as open
    (`Risk.source = COMPLIANCE_OBLIGATION`; `12-controls`' obligation-link endpoint) are now
    **applied** — see each target document's own Amendment log and
    `22-traceability/01-master-traceability-matrix.md`'s updated gap register. No longer an
    open item.
20. **New (Session 6)**: `04-domain-model/01-enterprise-domain-model.md`'s Bounded Context Map
    does not reserve a `SECURITY` context, despite `CLAUDE.md`'s long-term vision naming
    Cybersecurity Governance as its own GRC capability. `09-security/01-security-management.md`
    surfaces this explicitly and proposes, but does not apply, an additive tenth-context
    amendment — treated as a genuine, narrow gap in the domain model's own strategic
    classification, not an inconsistency in anything it built. See that document's
    Assumption 1 and Relationship to the Enterprise Domain Model section.
21. **New (Session 6)**: `09-security/01-*` proposes, but does not apply, three further
    additive changes (`Risk.source = SECURITY_FINDING` on `10-risk`;
    `evidence_source = SECURITY_EVIDENCE_REFERENCE` plus `linked_security_finding_id` on
    `13-audit`; the tenth-context row on `04-domain-model` per Assumption 20 above) — all
    tracked as open implementation-time TODOs, the same discipline Assumption 12 applied to
    `11-compliance`'s now-closed proposals before this session approved and applied them.
22. **New (Session 6)**: two genuinely new PRSMTD capability gaps were confirmed absent this
    session by `09-security/01-*`: a SIEM/automated-threat-detection/security-event-
    correlation capability (general notification/alerting was attempted platform-wide and
    explicitly retired, system.md PR-RESET-02 — a stronger finding than "never built"); and
    an ABAC policy-decision mechanism (PRSMTD implements RBAC exclusively — three closed
    domains, system.md §8). Neither blocks `SECURITY`'s own MVP scope; both are named
    explicitly rather than silently absorbed.
23. **New (Session 6)**: `SECURITY`'s own new tables (`SecurityFinding`, `SecurityAsset`,
    `SecurityAccessGrant`, `SecurityEvidence`, plus `SecurityPolicyDomain`/`SecurityBaseline`
    reference data) never store secret, key, or certificate material — `SecurityAsset` is a
    governance/ownership/rotation-tracking register only, pointing at PRSMTD's own
    `encryption_keys` table (via an opaque `platform_key_ref_id`) or an external secrets store
    (via a free-text `external_store_ref`) rather than duplicating either. This is a
    reuse-before-redesign decision, not a gap.
24. **Resolved (Session 7)**: Assumption 20's `04-domain-model` `SECURITY`-context gap and
    Assumption 21's three proposed additive changes are now all applied — `04-domain-model`
    names `SECURITY` as a tenth bounded context; `10-risk`'s `Risk.source` enum carries
    `SECURITY_FINDING`; `13-audit`'s `AuditEvidence.evidence_source` carries
    `SECURITY_EVIDENCE_REFERENCE` and its `Finding` table carries
    `linked_security_finding_id`. See each target document's own Amendment log. No longer
    open items.
25. **New (Session 7)**: a full architecture consistency review across all six authoritative
    specs found three genuine, pre-existing staleness issues in `04-domain-model` and
    `10-risk` — not new inconsistencies introduced by this session's Phase 1 work, but
    artifacts of `04-domain-model` never having been revisited after `COMPLIANCE` (Session 4)
    and `AUDIT` (Session 5) were authored. All three are corrected (see Session 7 entry under
    Completed Work). This establishes a precedent: **a domain-model-level document that names
    other contexts' authored/reserved status must be revisited whenever one of those contexts
    is newly authored**, not left to accumulate drift across sessions — worth a lightweight
    checklist item for future module-authoring sessions, not a new capability gap.
26. **Assumption 22 (Session 6) — SIEM/security-event-correlation capability and ABAC
    policy-decision mechanism — remain open, unaffected by Session 7.** Neither is an
    additive spec change; both are genuine new PRSMTD platform capabilities with no owning
    section, correctly left unresolved.

## Risks

| Risk | Impact if unaddressed | Mitigation |
|---|---|---|
| PRSMTD's actual module manifest/seeding capabilities may have evolved since the `system.md` sections read across sessions | Specs could rely on stale assumptions about what PRSMTD provides | Re-verify against current `PRSMTD/docs/authoritative/system.md` before implementation-time work, not just at spec-authoring time |
| Liquibase changesets are described narratively in specs (per repo rule: specification-first, no changesets authored here) but have not been reviewed by anyone with PRSMTD implementation context | Data models in `10-risk`/`12-controls` could have implementation-time surprises (e.g. sequence-per-tenant pattern for `risk_code`/`control_code` may not match PRSMTD idiom) | Flag for review at the point either spec is handed to a PRSMTD implementation engagement |
| `system.md §18` Product Framework doctrine (module.code=`ERM`) was undiscovered through all of Session 1 and only found in Session 2 | Implementation could start on `RISK`/`CONTROLS` as generic modules only to have `ERM` Product Framework status asserted over them later, forcing rework | `04-domain-model/01-*` (Session 3) narrows the question to a packaging decision distinct from the bounded-context boundary; resolve via ADR before, not after, a PRSMTD implementation engagement begins |
| `12-controls`' evidence model has no real binary storage target | Evidence metadata can be fully specified and governed, but the platform cannot yet actually retain the artifacts auditors will expect to retrieve | Track as an explicit PRSMTD capability gap (Assumption 6); do not let it block spec authoring, but flag loudly before any implementation engagement promises evidence retrieval |
| A future context spec (e.g. `11-compliance`) is authored without following the shared modeling patterns `04-domain-model/01-*` names (taxonomy shape, governed lifecycle shape, opaque-reference shape) | Structural drift reintroduces the per-module reinvention this document was written to prevent, undermining the "minimize future Liquibase churn" objective | Each future module spec's own Dependencies section should cite `04-domain-model/01-*`'s Common Domain Patterns section explicitly, the way this session's specs cite PRSMTD `system.md` sections — **confirmed working**: `11-compliance/01-*` (Session 4) followed this exactly. |
| **Resolved (Session 6)**: the two additive changes `11-compliance` proposed for `10-risk`/`12-controls` | N/A — applied this session | Closed; see Assumption 19 and each target document's Amendment log. |
| `13-audit`'s Non-Compliance Rate / Rectification Index formulas are specified only at the precision the Annexures literally state (a simple sampling ratio and a period-over-period comparison), not a fully worked numeric methodology | An implementation team could under-specify the weighting logic, or two different implementers could compute the metric differently for the same data | `13-audit/01-*` Assumption 9 explicitly scopes this as tenant-configurable business logic beyond the baseline ratio — flag for product/methodology decision before the first real audit cycle, not a spec gap to close retroactively |
| The compliance coverage assessment (`22-traceability/02-*`) is a point-in-time snapshot, incrementally updated (not regenerated) each session against the currently authored specs and the PRSMTD `system.md` state re-read that session | Both PRSMTD and the ERM specification set will keep changing; an unmaintained assessment silently goes stale and could be cited as if current | Re-verify against current `PRSMTD/docs/authoritative/system.md` and the latest authored ERM specs before treating any rating in that document as current — update it, don't recreate it, per its own "evolve, don't recreate" instruction |
| **Resolved (Session 7)**: the three additive changes `09-security/01-*` proposed for `10-risk`/`13-audit`/`04-domain-model` (Assumption 21) | N/A — all three applied this session | Closed; see Assumption 24 and each target document's own Amendment log. |
| **Resolved (Session 7)**: `SECURITY` was the first module whose own bounded context `04-domain-model` did not reserve | N/A — `04-domain-model` now names `SECURITY` as a tenth context, using the exact relationship shape `09-security/01-*` had already proposed (peer to `CONTROLS`/`COMPLIANCE`, Conformist supplier to `AUDIT`) — no substantive mismatch materialized | Closed; see Assumption 24, `04-domain-model/01-*`'s own Amendment Log. |
| A domain-model-level document (`04-domain-model`) can silently drift out of sync with later-authored module specs it names, if nothing prompts a revisit — this is what actually happened to `COMPLIANCE`/`AUDIT`'s status labels between Sessions 4–5 and Session 7 | A future module's own authoring could cite a stale cross-reference (a "(reserved)" label, a dashed edge, a broken anchor) from `04-domain-model` as if it were still accurate, compounding the drift | Assumption 25 (Session 7) names this explicitly as a precedent: treat "does this session's new module require `04-domain-model` to be revisited?" as a standing checklist item for every future module-authoring session, not just when a gap is separately reported |

## Open Decisions

- **Persona-to-module-role mapping convention** (established in `10-risk`'s Authorization
  section, reused identically in `12-controls`, `11-compliance`, `13-audit`, and now
  `09-security`) — now confirmed by a **fifth** module. Formalize as an ADR (`20-adr/`) —
  this is no longer a "wait for confirmation" deferral, the pattern has held five times
  running.
- **Governed `RiskAppetite`/`ControlFamily`-taxonomy/`ComplianceCalendarEntry`/
  `AuditUniverseEntry`/working-paper-review/`SecurityBaseline`-`SecurityPolicyDomain` changes**
  — none is routed through `pending_action` at MVP, across five specs now. Decide once, across
  all five modules, whether/when "governed configuration change" becomes a repository-wide
  pattern (candidate for the same ADR as above, or a separate one).
- **`system.md §18` reconciliation** — should `RISK` and `CONTROLS` eventually become facets
  of one `ERM` Product Framework manifest? `04-domain-model/01-*` (Session 3) clarified this is
  a packaging decision, not a bounded-context redesign — narrowed, still open. Not urgent
  (doesn't block MVP), but should not be deferred indefinitely — candidate `20-adr/` entry,
  timing open.
- **Compliance vs. Regulatory Management** — **resolved (Session 4)**: one bounded context,
  `COMPLIANCE`, confirmed by `11-compliance/01-*`. No longer open.
- **Applying the two additive changes `11-compliance` proposed** — **resolved (Session 6)**:
  applied to `10-risk`/`12-controls` this session. No longer open.
- **Applying `09-security/01-*`'s three proposed additive changes** — **resolved (Session 7)**:
  applied to `10-risk`/`13-audit`/`04-domain-model` (see Assumption 24 and Risks above). No
  longer open.
- **New (Session 6), still open**: **whether/when to build a SIEM/automated-threat-detection
  capability and an ABAC policy-decision mechanism** — both named as genuine PRSMTD capability
  gaps, neither urgent nor currently blocking any module's MVP (Assumption 22, reaffirmed
  Assumption 26). Revisit if a concrete regulatory driver (e.g., CERT-In's incident-reporting
  timeline) or tenant requirement makes either concrete.
- **Order of next specs** — the persona-to-module-role-mapping ADR vs. the `system.md §18`
  ADR vs. scoping `POLICY` vs. starting `INCIDENT`/`ISSUE`/`CAPA`. With Session 7's activation
  work complete, current recommendation is the ADR consolidation first (low effort, no new
  bounded context required), then `POLICY` scoping or `INCIDENT`/`ISSUE`/`CAPA` (see Next
  Milestone); open for reconsideration.
- **New (Session 5)**: **documentation location for cross-cutting assessment artifacts that
  don't fit `docs/NN-section-name/`'s per-spec granularity** — resolved this session for the
  compliance coverage assessment specifically (nested under `22-traceability/` as
  `02-compliance-coverage-assessment.md`), but the general question (does every future
  cross-cutting assessment nest under `22-traceability/`, or does some later assessment
  warrant its own proposed top-level section per `CLAUDE.md`'s explicit-proposal rule) is not
  fully closed — revisit if a second, differently-shaped cross-cutting artifact is requested.
  **Reaffirmed (Session 6)**: `09-security/01-*` was authored directly under its own existing
  `docs/09-security/` section (not a new top-level location), consistent with this
  precedent — no new documentation-location question was raised this session.

## Traceability

This file is a progress-tracking index, not a specification — it carries no Traceability
block of its own per `CLAUDE.md`. See
[`22-traceability/01-master-traceability-matrix.md`](22-traceability/01-master-traceability-matrix.md)
for the aggregated traceability of authored specs.
