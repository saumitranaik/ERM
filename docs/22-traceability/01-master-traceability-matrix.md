# 22.01 — Master Traceability Matrix

## Purpose

Aggregates the Traceability block from every substantive spec in this repository, per
[`../../CLAUDE.md`](../../CLAUDE.md#traceability-rules). This is a living aggregation
artifact, updated whenever a new Traceability block is added elsewhere — it is not itself a
functional specification and does not carry its own Traceability block.

## Business ↔ Regulatory Matrix

| Business Requirement | Regulatory Requirement | Spec |
|---|---|---|
| Governed, auditable enterprise risk register and escalation process | SEBI *Risk Management System* circular (MFD/CIR/15/19133/2002) — independent risk management function (mandatory), risk taxonomy, Board/Trustee review cadence | [`10-risk/01-enterprise-risk-management.md`](../10-risk/01-enterprise-risk-management.md) |
| Governed, tested, evidenced control library fulfilling Risk Treatment Plans and IT/cyber/financial-reporting control obligations | Annexures to Master Circular for Mutual Funds (March 31, 2023) §2.5, §2.11, System Audit Program Checklist §§1–8 (SEBI/HO/IMD/DF2/CIR/P/2019/57); Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs (SEBI/HO/IMD/DF2/CIR/P/2019/12) | [`12-controls/01-controls-management.md`](../12-controls/01-controls-management.md) |
| Single, internally consistent cross-context business architecture so future ERM capabilities integrate without duplicating concepts | None directly — structural specification supporting the regulatory requirements already carried by `10-risk`/`12-controls` | [`04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md) |
| Governed regulatory obligation register, compliance assessment, and regulatory change management, replacing narrative-only obligation tracking | Annexures to Master Circular for Mutual Funds (March 31, 2023) §2.6 (Compliance Risk — mandatory policy domains, filing responsibilities, AML/CFT program, quarterly/half-yearly alert reporting); SEBI *Risk Management System* circular (MFD/CIR/15/19133/2002), Board/Trustee reporting cadence (re-cited) | [`11-compliance/01-compliance-management.md`](../11-compliance/01-compliance-management.md) |
| Governed Internal Audit function (audit universe, risk-based planning, engagement lifecycle, findings, follow-up), satisfying the third mandatory line of defense alongside Risk Management and Compliance | Annexures to Master Circular for Mutual Funds (March 31, 2023) §1.3.4.1 (three lines of defense, dedicated internal auditor, non-compliance rate, Rectification Index); Annexure 8 clause 55 (semi-annual System Audit by CISA/CISM-qualified or CERT-IN empanelled auditor, giving effect to SEBI/HO/IMD/DF2/CIR/P/2019/57); SEBI *Risk Management System* circular (MFD/CIR/15/19133/2002) §1.4.2, Board/Trustee reporting cadence (re-cited) | [`13-audit/01-audit-management.md`](../13-audit/01-audit-management.md) |
| Governed enterprise security capability — security policy taxonomy, security baselines, privileged access grants, secrets/key/certificate governance, and vulnerability/security-finding management — consolidating the security model every prior module already independently commits to | SEBI Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs (SEBI/HO/IMD/DF2/CIR/P/2019/12), cited at scope level (source PDF scanned/image-only, inherited from `12-controls` Assumption 5); Annexures System Audit Program Checklist §§1–8 (re-cited, not re-seeded) | [`09-security/01-security-management.md`](../09-security/01-security-management.md) |

## Capability ↔ PRSMTD Matrix

| ERM Capability | PRSMTD Mechanism Reused | New Capability Required |
|---|---|---|
| Enterprise Risk Management (`RISK` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None confirmed at MVP. Candidate gap: platform-level regulatory-profile-parameterized module seeding (see spec's Assumption 3 / Future Extension Points) — deferred, not currently blocking. |
| Controls Management (`CONTROLS` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | **Confirmed gap**: platform document/object storage capability (evidence binary storage — spec Assumption 4). **Flagged, not blocking**: reconciliation with `system.md §18` Product Framework doctrine, which designates `module.code = ERM` as the constitutional Product Framework for the risk domain — neither `RISK` nor `CONTROLS` currently adopt it (spec Assumption 6). |
| Enterprise Domain Model (cross-context bounded context map) | Module framework and ownership guards (`system.md §9, §5a–§5c`, OWN-03/04/07/08/09); governance ledger (`§3, §7`, GOV-07); RBAC (`§8`); audit trail (`§10`); authentication (`§21`). Reviewed in full: Product Framework Doctrine (`§18`). | None newly introduced — restates/generalizes the gaps already flagged by `10-risk`/`12-controls`. Reframes the `§18` reconciliation as a packaging question distinct from the bounded-context boundary (see spec Assumption 6). **Session 7**: amended additively to add `SECURITY` as a tenth bounded context (closing the gap `09-security` Assumption 1 discovered) and to correct stale "(reserved)" status labels for `COMPLIANCE`/`AUDIT`, both authored in intervening sessions but never reflected back into this document until now — a consistency-review fix, not a redesign; see this document's own Amendment Log. |
| Compliance Management (`COMPLIANCE` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap already confirmed by `12-controls` Assumption 4 (spec Assumption 5). Proposed, and as of 2026-07-20 **applied**, two additive extensions: a `Risk.source = COMPLIANCE_OBLIGATION` enum value on `10-risk`, and a `POST /controls/{id}/obligation-links` endpoint on `12-controls` (spec Assumption 6–7, Integration sections; see both target specs' own Amendment logs). |
| Audit Management (`AUDIT` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1` — direct substrate for the module's `SYSTEM_TRACE_EXTRACT` evidence type); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap already confirmed by `12-controls` Assumption 4. At original authoring (Session 5), no additive change was proposed to any frozen spec — `Risk.source = AUDIT_FINDING` and `Control.source = AUDIT_FINDING` were already live (spec Assumption 6). **Session 7**: this module's own manifest and data model were amended additively (`dependencies: [..., SECURITY]`; `AuditEvidence.evidence_source = SECURITY_EVIDENCE_REFERENCE`; `Finding.linked_security_finding_id`) to activate `09-security`'s own proposed integration — see that document's Amendment log and `13-audit`'s own Amendment log. |
| Security Management (`SECURITY` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); Module Security Model (`§5c`); multi-tenant RLS (`§7`); encryption key registry (`§7`); Production Credential Policy / external secrets store requirement (`§11`); Wildcard TLS Architecture (`§11` ADR-TR-010); Realm Factory / per-realm service accounts (`§11` ADR-TR-007); Runtime Validator Harness Doctrine (`§17`); observability trace contract (`§4.1`); audit trail (`§10`); authentication and auth surface ownership (`§6, §21`); observability canonical access (`§22`) | None newly introduced for this module's own tenant-plane register — inherits, not duplicates, the platform document/object storage gap. **New gaps named at authoring (Session 6), still open**: a SIEM/security-event-correlation capability (notification/alerting was attempted platform-wide and explicitly retired, PR-RESET-02); an ABAC policy-decision mechanism (reserved as future extensibility only, not designed). **Session 7 — all three proposed additive changes applied**: `Risk.source = SECURITY_FINDING` (`10-risk`), `AuditEvidence.evidence_source = SECURITY_EVIDENCE_REFERENCE` + `Finding.linked_security_finding_id` (`13-audit`), and a tenth `SECURITY` context row added to `04-domain-model`'s bounded context map (Strategic Classification, Bounded Context Map, Ownership Responsibilities, Canonical Business Glossary, Dependency Rules) — see each target document's own Amendment log. |

## Requirement ↔ Spec Matrix (gap register)

| Requirement | Spec | Status |
|---|---|---|
| Enterprise risk register, scoring, treatment, acceptance, escalation, KRIs (SEBI AMC profile) | [`10-risk/01-enterprise-risk-management.md`](../10-risk/01-enterprise-risk-management.md) | Authored |
| Control library, taxonomy, ownership, lifecycle, effectiveness, testing, evidence, exceptions (SEBI AMC profile) | [`12-controls/01-controls-management.md`](../12-controls/01-controls-management.md) | Authored |
| Disaster Recovery / Business Contingency Plan (SEBI-mandated) | `18-deployment/` | **Gap** — not yet authored; domain model reserves a `BUSINESS CONTINUITY` bounded context (customer of `RISK` and `CONTROLS`) |
| Insurance cover against third-party losses (SEBI-mandated) | No owning section identified yet | **Gap** — flagged in `10-risk/01-*`, not designed anywhere |
| Controls library, control-to-risk mapping | [`12-controls/01-controls-management.md`](../12-controls/01-controls-management.md) | Authored — activates `10-risk`'s opaque `control_ref_id` link via cross-module API (no `10-risk` changes) |
| Platform document/object storage capability (evidence binary storage) | No owning section identified yet | **Gap** — flagged in `12-controls/01-*` Assumption 4, restated in `04-domain-model/01-*` as a cross-cutting Evidence concern for the future `13-audit` context, and inherited (not duplicated) by `11-compliance/01-*` Assumption 5 for `ComplianceEvidence`; not designed anywhere |
| Compliance/regulatory obligation register, regulatory framework/profile registries, compliance assessment, regulatory change management, compliance calendar, exceptions, attestations, reporting | [`11-compliance/01-compliance-management.md`](../11-compliance/01-compliance-management.md) | **Authored** — confirms `04-domain-model/01-*` Assumption 4 (Compliance + Regulatory Management are one bounded context, `COMPLIANCE`); activates `10-risk`'s `Risk.source` slot (`COMPLIANCE_OBLIGATION`, additive, **applied Session 6** to `10-risk/01-*`) and `12-controls`' `module_controls_control_obligation_link` slot (a `CONTROLS`-side `POST /controls/{id}/obligation-links` endpoint, additive, **applied Session 6** to `12-controls/01-*`). |
| Audit universe, risk-based audit planning, engagement lifecycle, working papers, Finding governance, audit findings as a risk/control source, control/compliance evidence as audit evidence | [`13-audit/01-audit-management.md`](../13-audit/01-audit-management.md) | **Authored** — activates the `AUDIT` bounded context `04-domain-model` reserved (Conformist to `RISK`/`CONTROLS`/`COMPLIANCE`), the already-live `Risk.source = AUDIT_FINDING`/`Control.source = AUDIT_FINDING` values (no additive change to either frozen spec), and all three integration points `11-compliance`'s own "Integration with Future Audit" section reserved. |
| System-trace-extract evidence sourced directly from PRSMTD's Observability & Deterministic Trace Contract (system.md §4.1) | [`13-audit/01-audit-management.md`](../13-audit/01-audit-management.md) | **Authored** — `AuditEvidence.evidence_source = SYSTEM_TRACE_EXTRACT`; the first evidentiary path in this repository not dependent on the platform document/object-storage capability gap. Does not close that gap for the other three evidence sources this module and every prior module still depend on. |
| Cross-cutting Security capability — security policy taxonomy, security baselines, privileged access management, secrets/key/certificate governance, vulnerability/security-finding management; consolidation of the identity/authentication/RBAC/SoD/data-classification content every prior module already specifies inline | [`09-security/01-security-management.md`](../09-security/01-security-management.md) | **Authored** — sixth authoritative spec; the first authored directly against `09-security/README.md`'s original scope rather than a `04-domain-model`-reserved boundary (`04-domain-model` originally did not reserve a `SECURITY` context — closed Session 7, see that gap row below). |
| `09-security/` consolidation of the persona-to-module-role mapping convention, data classification tiers, and SoD mechanism every module (`RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`) already independently states inline | [`09-security/01-security-management.md`](../09-security/01-security-management.md) | **Closed** — `docs/roadmap.md`'s Next Milestone item 2; canonical Data Classification Scheme and consolidated Identity/Authentication/Authorization section now supersede (without editing) each prior module's own inline statement, the same non-invasive relationship `04-domain-model`'s glossary has to `10-risk`'s/`12-controls`' inline glossaries. |
| `04-domain-model`'s Bounded Context Map did not reserve a `SECURITY` context, despite `CLAUDE.md`'s long-term vision naming Cybersecurity Governance as its own GRC capability | `04-domain-model/01-enterprise-domain-model.md` | **Closed (2026-07-20, Session 7)** — proposed by `09-security/01-*` Assumption 1 / Relationship to the Enterprise Domain Model; applied additively as a tenth bounded-context row (Core Domain; peer to `CONTROLS`/`COMPLIANCE`; Conformist supplier to `AUDIT`) — see `04-domain-model/01-*`'s own Amendment Log. |
| Additive `Risk.source = SECURITY_FINDING` enum value | `10-risk/01-enterprise-risk-management.md` | **Closed (2026-07-20, Session 7)** — proposed by `09-security/01-*` Integration with Risk; applied additively (see `10-risk/01-*`'s Amendment log) — one-line, non-breaking enum addition, mirroring how `11-compliance` exercised `COMPLIANCE_OBLIGATION`. |
| Additive `AuditEvidence.evidence_source = SECURITY_EVIDENCE_REFERENCE` and `Finding.linked_security_finding_id` column | `13-audit/01-audit-management.md` | **Closed (2026-07-20, Session 7)** — proposed by `09-security/01-*` Integration with Audit; applied additively (see `13-audit/01-*`'s Amendment log), alongside a new `GET /findings/{id}/reference` endpoint added to `09-security/01-*`'s own API Surface and `AUDIT`'s manifest gaining `dependencies: [SECURITY]`. |
| SIEM / automated threat-detection / security-event-correlation capability | No owning section identified yet | **Gap** — named for the first time by `09-security/01-*`; PRSMTD's general notification/alerting capability was attempted platform-wide and explicitly retired (system.md, PR-RESET-02); `SecurityFinding.source = SIEM_ALERT` reserves the slot, not designed. |
| ABAC (attribute-based access control) policy-decision mechanism | No owning section identified yet | **Gap** — named as future extensibility only by `09-security/01-*`; PRSMTD implements RBAC exclusively today (system.md §8); no policy-decision/enforcement-point mechanism exists. |
| Cross-context bounded context map (Risk, Controls, Compliance, Audit, Security, Policy...) | [`04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md) | **Authored** — supersedes the inline bounded-context definitions in `10-risk`/`12-controls` for cross-context vocabulary and integration rules; ten contexts total as of Session 7 (five authored — `RISK`, `CONTROLS`, `COMPLIANCE`, `AUDIT`, `SECURITY` — and five reserved: Policy, Incident/Issue/CAPA, Third-Party Risk, Business Continuity, Reporting). |
| Risk/Controls/Compliance data model as a standalone ER/Liquibase-ready doc | `06-data-model/` | Not created — `10-risk/01-*`, `12-controls/01-*`, and `11-compliance/01-*` are the canonical sources to avoid duplication; cross-link when `06-data-model/` is authored |
| Reconciliation of `system.md §18` Product Framework doctrine (`module.code = ERM`) with this repository's generic-module `RISK`/`CONTROLS` design | `20-adr/` (candidate) | **Gap** — discovered in `12-controls/01-*` Assumption 6; reframed by `04-domain-model/01-*` as a PRSMTD **module/manifest packaging** question distinct from the DDD bounded-context boundary (which does not change either way); not resolved, does not block current MVP scope |
| Naming of the future Incident/Issue/CAPA module code; whether Reporting/Analytics is a tenant module or a platform-level surface | `05-modules/` (future) | **Gap** — open questions raised in `04-domain-model/01-*` Future Enhancements; not blocking |
| `CONTROLS`-side endpoint to populate `module_controls_control_obligation_link` (e.g. `POST /controls/{id}/obligation-links`) | `12-controls/01-controls-management.md` | **Closed (2026-07-20)** — proposed by `11-compliance/01-*` Integration with Controls; applied additively to `12-controls/01-*` (see its Amendment log) — no schema change, `module_controls_control_obligation_link` already carried this shape. |
| Additive `Risk.source = COMPLIANCE_OBLIGATION` enum value | `10-risk/01-enterprise-risk-management.md` | **Closed (2026-07-20)** — proposed by `11-compliance/01-*` Integration with Risk; applied additively to `10-risk/01-*` (see its Amendment log) — one-line, non-breaking enum addition, mirroring how `12-controls` exercised `CONTROL_TEST`. |
| General-purpose Records Retention Schedule (statutory retention period per record type, cross-module) | No owning section identified yet | **Gap** — `10-risk`/`12-controls` each deferred retention-period specification to `11-compliance`; `11-compliance/01-*` Assumption 10 confirms its own tables are retention-agnostic by design but explicitly does not design this cross-module capability. |

## Status

First entries populated from the Enterprise Risk Management spec (2026-07-19). Second entry
set populated from the Controls Management spec (2026-07-19), which also surfaced a new
platform-capability gap (document/object storage) and a new architectural-reconciliation gap
(`system.md §18` Product Framework doctrine vs. this repository's generic-module design).
Third entry set populated from the Enterprise Domain Model spec (2026-07-20), which closes
the cross-context bounded context map gap, reframes the `§18` reconciliation as a packaging
question, and surfaces two new precise gaps (Compliance/Regulatory Management boundary
confirmation; a missing `Risk.source` enum value for Compliance-sourced risks). Fourth entry
set populated from the Compliance Management spec (2026-07-20), which closes the
Compliance/Regulatory Management boundary gap (confirming one `COMPLIANCE` context) and the
missing-enum-value gap (proposing, not yet applying, `COMPLIANCE_OBLIGATION`), inherits
rather than duplicates the document/object-storage gap, and surfaces two new precise gaps
(a `CONTROLS`-side obligation-link endpoint; a general-purpose Records Retention Schedule
capability). Fifth entry set populated from the Audit Management spec (2026-07-20), which
closes the "audit findings as a risk source / control test evidence as audit evidence" gap
row, introduces no new gap beyond the two already flagged (document/object storage; `system.md
§18` reconciliation), and records the first evidentiary path in this repository
(`SYSTEM_TRACE_EXTRACT`) not dependent on the object-storage gap. This matrix is also now
supplemented by
[`02-compliance-coverage-assessment.md`](02-compliance-coverage-assessment.md), a
regulation/framework-facing view over the same five authored specs plus the current PRSMTD
platform state — update both whenever a new Traceability block is added anywhere in the
repository; this file remains the authoritative per-spec traceability register, the
assessment document is a derived, regulation-facing read of it plus PRSMTD's current
capabilities.

**Session 6 (2026-07-20)** closed both remaining additive-change gap rows: `10-risk`'s
`Risk.source` enum gained `COMPLIANCE_OBLIGATION` and `12-controls` gained
`POST /controls/{id}/obligation-links`, both applied additively per `11-compliance`'s own
proposals (see each target document's Amendment log; `11-compliance/01-*` itself updated only
its cross-references, not its domain/data model). This session also authors the repository's
sixth authoritative specification, [`09-security/01-security-management.md`](../09-security/01-security-management.md)
— the cross-cutting Security capability (Security Governance, Identity Security, PAM, Secrets/
Key/Certificate Management, Security Monitoring, Vulnerability Management, Secure SDLC
Governance, API/Network Security, Security Baselines/Policies/Metrics) every prior module
already committed to independently; see that document's own Traceability block for what it
reuses from PRSMTD versus what it newly specifies. This spec is the first authored directly
against a `docs/09-NN/README.md` cross-cutting scope rather than a `04-domain-model`-reserved
bounded context; it surfaces (proposes, does not apply) one new gap in `04-domain-model`
itself (no reserved `SECURITY` context row) alongside two additive-change proposals toward
`10-risk`/`13-audit` and two genuinely new PRSMTD capability gaps (SIEM/security-event
correlation; ABAC) — see the gap register above.

**Session 7 (2026-07-20)** — Phase 1: applied all three additive changes `09-security/01-*`
proposed without building: `Risk.source = SECURITY_FINDING` on `10-risk`;
`AuditEvidence.evidence_source = SECURITY_EVIDENCE_REFERENCE` plus
`Finding.linked_security_finding_id` on `13-audit`; and the `SECURITY` tenth-context row on
`04-domain-model` (Strategic Classification, Bounded Context Map, Ownership Responsibilities,
Canonical Business Glossary, Dependency Rules) — closing all three gap rows above. `09-security`
gained one net-new, additive endpoint of its own (`GET /findings/{id}/reference`), the
reference-resolution endpoint the Audit activation requires. Phase 2: a full architecture
consistency review across all six authoritative specs found and corrected several genuine
staleness issues that were not new inconsistencies introduced this session but artifacts of
`04-domain-model` never having been revisited after `COMPLIANCE` (Session 4) and `AUDIT`
(Session 5) were authored: `04-domain-model`'s Bounded Context Map, Strategic Classification,
Ownership Responsibilities, Cross-Context APIs table, and Evidence-as-a-Cross-Cutting-Concept
section still labeled `COMPLIANCE`/`AUDIT` "(reserved)" with dashed/unactivated edges; `10-risk`'s
own Integration Points table still listed its (long-activated) `CONTROLS` and `AUDIT` rows as
"Reserved"/"Not yet specified"; and `11-compliance` carried two broken anchor links to
`04-domain-model`'s now-renamed `COMPLIANCE (authored)` heading. All are corrected — see each
target document's own Amendment log (`04-domain-model`'s is new this session) for the precise
diffs. No entity, aggregate, workflow, API, or ownership assignment was redesigned by any of
these corrections; only status labels, edge styles, table rows, and cross-reference prose that
described an already-superseded state.
