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
| Governed policy authoring, versioning, review/re-attestation, employee acknowledgement, and exception-management capability — the document-authoring counterpart to `COMPLIANCE`'s obligation-tracking counterpart | Annexures to Master Circular for Mutual Funds (March 31, 2023) §2.6.2.1(i) a–q (seventeen mandatory policy domains, re-cited from `11-compliance`, not re-extracted); Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs (SEBI/HO/IMD/DF2/CIR/P/2019/12), cited at scope level (re-cited from `12-controls`/`09-security`) | [`23-policy/01-policy-management.md`](../23-policy/01-policy-management.md) |
| Governed incident intake/investigation, enterprise issue-escalation register, and structured corrective/preventive action capability (action plans, tracking, closure verification, effectiveness review) and escalation management — the shared remediation capability every prior GRC module deferred to | Annexures to Master Circular for Mutual Funds (March 31, 2023), System Audit Program Checklist §5 (Incident Management, re-cited from `12-controls`); §1.3.4.1.1(ii)(d)–(f) (Non-Compliance Rate / Rectification Index, re-cited from `13-audit`); Cyber Security and Cyber Resilience Framework for Mutual Funds AMCs (SEBI/HO/IMD/DF2/CIR/P/2019/12), cited at scope level (re-cited from `12-controls`/`09-security`) | [`24-incident-issue-capa/01-incident-issue-capa-management.md`](../24-incident-issue-capa/01-incident-issue-capa-management.md) |
| Governed vendor/third-party lifecycle management — onboarding through offboarding, classification/criticality, due diligence, inherent/residual vendor-risk assessment, security and compliance assessment, contract and SLA tracking, ongoing monitoring, and periodic reassessment — satisfying the ongoing fiduciary obligation the Annexures place on outsourcing relationships | Annexures to Master Circular for Mutual Funds (March 31, 2023) §2.9 (Outsourcing Risk — mandatory pre-/post-outsourcing due diligence, Board-approved Outsourcing Policy elements, dedicated vendor ownership, structured SLA benchmarking, documented and monitored remediation), §2.10 (Sales and Distribution Risk, re-cited at scope level), Annexure 8 (vendor/third-party IT-system audit scope, re-cited from `13-audit`) | [`25-third-party-risk/01-third-party-risk-management.md`](../25-third-party-risk/01-third-party-risk-management.md) |
| Governed business continuity management — critical business service identification, Business Impact Analysis, RTO/RPO targets, dependency mapping, continuity strategy selection, a governed BCP/DR plan lifecycle, crisis/DR activation recording, continuity exercises and testing, and corrective action tracking — satisfying the mandatory DR/BCP practice `10-risk` deferred at its own founding | SEBI *Risk Management System for Mutual Funds* circular (MFD/CIR/15/19133/2002), Appendix A Part 1 item 1 (Disaster Recovery and Business Contingency Plans, mandatory, Day-1 critical-function coverage); Annexures to Master Circular for Mutual Funds (March 31, 2023), System Audit Program Checklist item 8, sub-items 8a–8f (BCP Organization, Methodology and Plan, BIA/RA, testing, communication/training, DR Plan); §2.9.3.1(iv)(4)/(v)(f) (vendor's own tested DR/BCP, re-cited from `25-third-party-risk`) | [`26-business-continuity/01-business-continuity-management.md`](../26-business-continuity/01-business-continuity-management.md) |
| Governed reporting capability — report/dashboard catalogue with field-level provenance to its owning source module, on-demand report generation producing immutable, evidence-ready instances, approval-before-submission governance for regulator/board-facing reports, and distribution record-keeping — consolidating the reporting obligation every one of the nine prior business-domain modules already deferred to it | None newly cited — operationalizes the recurring Board/Trustee/SEBI reporting and filing cadences already carried by `10-risk`, `11-compliance` (§2.6.2.1(iv)(a)–(b)), `13-audit` (Annexure 8 clause 55), `26-business-continuity` (Annexure 8 item 8b), and `25-third-party-risk` (§2.9) | [`14-reporting/01-reporting-management.md`](../14-reporting/01-reporting-management.md) |

## Capability ↔ PRSMTD Matrix

| ERM Capability | PRSMTD Mechanism Reused | New Capability Required |
|---|---|---|
| Enterprise Risk Management (`RISK` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None confirmed at MVP. Candidate gap: platform-level regulatory-profile-parameterized module seeding (see spec's Assumption 3 / Future Extension Points) — deferred, not currently blocking. |
| Controls Management (`CONTROLS` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | **Confirmed gap**: platform document/object storage capability (evidence binary storage — spec Assumption 4). **Flagged, not blocking**: reconciliation with `system.md §18` Product Framework doctrine, which designates `module.code = ERM` as the constitutional Product Framework for the risk domain — neither `RISK` nor `CONTROLS` currently adopt it (spec Assumption 6). |
| Enterprise Domain Model (cross-context bounded context map) | Module framework and ownership guards (`system.md §9, §5a–§5c`, OWN-03/04/07/08/09); governance ledger (`§3, §7`, GOV-07); RBAC (`§8`); audit trail (`§10`); authentication (`§21`). Reviewed in full: Product Framework Doctrine (`§18`). | None newly introduced — restates/generalizes the gaps already flagged by `10-risk`/`12-controls`. Reframes the `§18` reconciliation as a packaging question distinct from the bounded-context boundary (see spec Assumption 6). **Session 7**: amended additively to add `SECURITY` as a tenth bounded context (closing the gap `09-security` Assumption 1 discovered) and to correct stale "(reserved)" status labels for `COMPLIANCE`/`AUDIT`, both authored in intervening sessions but never reflected back into this document until now — a consistency-review fix, not a redesign; see this document's own Amendment Log. |
| Compliance Management (`COMPLIANCE` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap already confirmed by `12-controls` Assumption 4 (spec Assumption 5). Proposed, and as of 2026-07-20 **applied**, two additive extensions: a `Risk.source = COMPLIANCE_OBLIGATION` enum value on `10-risk`, and a `POST /controls/{id}/obligation-links` endpoint on `12-controls` (spec Assumption 6–7, Integration sections; see both target specs' own Amendment logs). |
| Audit Management (`AUDIT` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1` — direct substrate for the module's `SYSTEM_TRACE_EXTRACT` evidence type); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap already confirmed by `12-controls` Assumption 4. At original authoring (Session 5), no additive change was proposed to any frozen spec — `Risk.source = AUDIT_FINDING` and `Control.source = AUDIT_FINDING` were already live (spec Assumption 6). **Session 7**: this module's own manifest and data model were amended additively (`dependencies: [..., SECURITY]`; `AuditEvidence.evidence_source = SECURITY_EVIDENCE_REFERENCE`; `Finding.linked_security_finding_id`) to activate `09-security`'s own proposed integration — see that document's Amendment log and `13-audit`'s own Amendment log. |
| Security Management (`SECURITY` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); Module Security Model (`§5c`); multi-tenant RLS (`§7`); encryption key registry (`§7`); Production Credential Policy / external secrets store requirement (`§11`); Wildcard TLS Architecture (`§11` ADR-TR-010); Realm Factory / per-realm service accounts (`§11` ADR-TR-007); Runtime Validator Harness Doctrine (`§17`); observability trace contract (`§4.1`); audit trail (`§10`); authentication and auth surface ownership (`§6, §21`); observability canonical access (`§22`) | None newly introduced for this module's own tenant-plane register — inherits, not duplicates, the platform document/object storage gap. **New gaps named at authoring (Session 6), still open**: a SIEM/security-event-correlation capability (notification/alerting was attempted platform-wide and explicitly retired, PR-RESET-02); an ABAC policy-decision mechanism (reserved as future extensibility only, not designed). **Session 7 — all three proposed additive changes applied**: `Risk.source = SECURITY_FINDING` (`10-risk`), `AuditEvidence.evidence_source = SECURITY_EVIDENCE_REFERENCE` + `Finding.linked_security_finding_id` (`13-audit`), and a tenth `SECURITY` context row added to `04-domain-model`'s bounded context map (Strategic Classification, Bounded Context Map, Ownership Responsibilities, Canonical Business Glossary, Dependency Rules) — see each target document's own Amendment log. |
| Policy Management (`POLICY` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap. **Two of three inbound integrations activated with zero additive change** to their frozen source spec: `11-compliance`'s `module_compliance_obligation_policy_link`/`POST /obligations/{id}/policy-links` and `09-security`'s `GET /policy-domains` were already built exactly as needed. **Session 15 — both remaining items applied**: the `module_controls_control_policy_link`/`POST /controls/{id}/policy-links` extension to `12-controls`, and the `04-domain-model` `POLICY (reserved)` → `POLICY (authored)` status-label amendment — see each target document's own Amendment log. No integration remains proposed. |
| Incident / Issue / CAPA Management (`INCIDENT` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap. Resolves `04-domain-model`'s open module-code naming question (`INCIDENT`). **Two of five inbound integrations need no schema change**: `13-audit`'s `FollowUpAction.capa_ref_id` and `09-security`'s `SecurityFinding.capa_ref_id` are both already reserved — only a proposed, not-applied initiating endpoint is needed for each. `Risk.source = INCIDENT` (already live since `10-risk`'s own authoring) required **zero** additive change — the first module-relationship in this repository never requiring one at any point. **Session 15 — all remaining items applied**: `capa_ref_id` plus initiating endpoint on `12-controls`' `ControlException`, `11-compliance`'s `ComplianceException`, and `23-policy`'s `PolicyException`; a `TPR`-citation column (`Incident.vendor_ref_id`, deliberately not resolved by this module itself since `TPR` already depends on it — see Dependency Rule 6); `GET /incidents/{id}/reference`; and the `04-domain-model` `INCIDENT`/`ISSUE`/`CAPA` `(reserved)` → `(authored)` status-label amendment — see each target document's own Amendment log. No integration remains proposed. |
| Third-Party Risk Management (`TPR` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap. Resolves `04-domain-model`'s own open `VendorCategory`/`RiskCategory` question (a Vendor-sourced Risk uses `RISK`'s already-seeded "Other Business Risks → Third-Party Risks" sub-category, no new taxonomy). **Largest dependency declaration of any module to date** (`dependencies: [CONTROLS, COMPLIANCE, POLICY, SECURITY, INCIDENT]`), reflecting that it is the ninth module authored, built atop nearly the entire existing integration surface. **Confirmed zero-additive-change activations**: both of `23-policy`'s `PolicyReferenceLink` directions (the first confirmation that its polymorphic design serves a third citing module as designed); `09-security`'s `GET /policy-domains` tag resolution and its already-reserved `SecurityFinding.finding_type = THIRD_PARTY_RISK` value; `24-incident-issue-capa`'s `POST /capa-requests` (this module builds `VendorException.capa_ref_id` directly rather than merely proposing it, being the first module authored after `INCIDENT` already existed); the resolution (read) direction of `12-controls`' `GET /controls/{id}/reference` and `11-compliance`'s `GET /obligations/{id}/reference`. **Session 15 — all six additive changes plus the status-label amendment applied**:
`Risk.source = THIRD_PARTY` (`10-risk`); `Control.source = THIRD_PARTY_RISK` plus `POST /controls/{id}/vendor-links` (`12-controls`); the `COMPLIANCE` obligation mirror-registration generalization (`11-compliance`, resolved by widening the existing endpoint/table, not a dedicated second one); `SecurityFinding.linked_vendor_id` (`09-security`, deliberately not resolved by `SECURITY` itself — see Dependency Rule 6); `AuditUniverseEntry.related_vendor_ref_id` (`13-audit`); `Incident.vendor_ref_id` (`24-incident-issue-capa`, deliberately not resolved by `INCIDENT` itself, same cycle-avoidance reasoning); and the `04-domain-model` `THIRD-PARTY RISK` `(reserved)` → `(authored)` status-label amendment — see each target document's own Amendment log. No integration remains proposed. |
| Business Continuity Management (`BCP` module) | Governance ledger / maker-checker (`system.md §3, §9`, GOV-07); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`); audit trail (`§10`); authentication (`§21`) | None newly introduced — inherits, not duplicates, the platform document/object storage gap. Resolves `04-domain-model`'s own `BUSINESS CONTINUITY (reserved)` anticipated-entities sketch (RTO/RPO/MTPD as columns on the critical-service aggregate root, not a standalone `RecoveryObjective` entity) and its own plan-vs-`CONTROLS`-test-boundary recommendation (adopted as the decision, not merely restated). **Largest dependency declaration of any module to date** (`dependencies: [CONTROLS, COMPLIANCE, POLICY, SECURITY, INCIDENT, TPR]`), reflecting that it is the tenth module authored. **First module to build two integrations directly rather than merely propose either** — `INCIDENT`'s `POST /capa-requests` and `TPR`'s `GET /vendors/{id}/reference`, both zero additive change — plus `POLICY`'s `PolicyReferenceLink` (both directions) and `SECURITY`'s `GET /policy-domains` tag resolution (its already-seeded "Business Continuity and Disaster Recovery" domain), and the resolution (read) direction of `12-controls`' `GET /controls/{id}/reference` and `11-compliance`'s `GET /obligations/{id}/reference`, all zero additive change. **Session 15 — all six additive changes plus the status-label amendment applied**:
`Risk.source = BUSINESS_CONTINUITY` (`10-risk`); `Control.source = BUSINESS_CONTINUITY` plus `POST /controls/{id}/continuity-links` (`12-controls`); a new "Technology & Operational Resilience" `ObligationCategory` (`11-compliance`) and matching `PolicyCategory` (`23-policy`) — the first module to discover neither existing taxonomy had a category fitting its own primary regulatory driver; `AuditUniverseEntry.related_critical_service_ref_id` (`13-audit`); `GET /incidents/{id}/reference` (`24-incident-issue-capa`) — the first proposal for a *missing* reference-resolution endpoint, not a missing column on an existing one; and the `04-domain-model` `BUSINESS CONTINUITY` `(reserved)` → `(authored)` status-label amendment — see each target document's own Amendment log. No integration remains proposed. |
| Reporting Management (`REPORTING` module) | Governance ledger / per-module `module_actions` maker-checker (`system.md §3`); RBAC + module role model (`§8`); module framework and ownership guards (`§9, §5a–§5c`, OWN-03/04/07/08/09); multi-tenant RLS (`§7`); observability trace contract (`§4.1`, direct substrate for this module's own evidence-ready-export framing); audit trail (`§10`); authentication (`§21`) | None newly introduced beyond the already-flagged document/object storage gap, from which this module's own core function is deliberately decoupled (spec Assumption 7). **Two new gaps named for the first time**: a scheduled-job/batch-execution mechanism (spec Assumption 8) and a generic PDF/CSV export-rendering mechanism (spec Assumption 9), confirmed absent this session, neither blocking MVP scope. **Largest dependency declaration of any module to date** (`dependencies: [RISK, CONTROLS, COMPLIANCE, AUDIT, SECURITY, POLICY, INCIDENT, TPR, BCP]`, all nine other business-domain modules), reflecting its designated Conformist/sink role over the entire GRC domain — no module ever depends on it in return. **Session 15 — both additive changes plus the status-label amendment applied**: a `GET /risks/{id}/reference` endpoint on `10-risk` (the first module to discover `RISK` exposed no point-citation endpoint for its own entities) and `GET /findings/{id}/reference`/`GET /engagements/{id}/reference` endpoints on `13-audit` (the first module to need a point-citation endpoint from `AUDIT` itself); and the `04-domain-model` `REPORTING (reserved)` → `REPORTING (authored)` status-label amendment — the last of the five, and of the ten bounded contexts that document's map now labels consistently. See each target document's own Amendment log. No integration remains proposed. |

## Requirement ↔ Spec Matrix (gap register)

| Requirement | Spec | Status |
|---|---|---|
| Enterprise risk register, scoring, treatment, acceptance, escalation, KRIs (SEBI AMC profile) | [`10-risk/01-enterprise-risk-management.md`](../10-risk/01-enterprise-risk-management.md) | Authored |
| Control library, taxonomy, ownership, lifecycle, effectiveness, testing, evidence, exceptions (SEBI AMC profile) | [`12-controls/01-controls-management.md`](../12-controls/01-controls-management.md) | Authored |
| Disaster Recovery / Business Contingency Plan — plan side (SEBI-mandated) | [`26-business-continuity/01-business-continuity-management.md`](../26-business-continuity/01-business-continuity-management.md) | **Closed (2026-07-21, Session 13)** — activates the `BUSINESS CONTINUITY` bounded context `04-domain-model` reserved; BIA, RTO/RPO, dependency mapping, continuity strategy, governed Plan lifecycle, exercises/testing, and exceptions are all specified. The platform-level DR/BCP posture (for the ERM platform itself, distinct from this tenant-facing plan capability) remains `18-deployment`'s own, not-yet-authored, scope — see that gap row below, unchanged. |
| Platform-level DR/BCP posture (environment topology, RTO/RPO for the ERM platform itself) | `18-deployment/` | **Gap** — not yet authored; explicitly distinct from `26-business-continuity`'s tenant-facing plan capability, per that document's own Scope section and Master Execution Plan Phase 14. |
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
| Naming of the future Incident/Issue/CAPA module code | `24-incident-issue-capa/01-*` | **Closed (2026-07-21, Session 11)** — resolved as `INCIDENT`, a single combined module for Incident, Issue, and CAPA (spec Assumption 1). |
| Whether Reporting/Analytics is a tenant module or a platform-level surface | `14-reporting/01-*`, `04-domain-model/01-*` | **Closed (2026-07-21, Session 14)** — resolved as tenant-plane, superseded by the row below; see that row for the full citation. |
| `CONTROLS`-side endpoint to populate `module_controls_control_obligation_link` (e.g. `POST /controls/{id}/obligation-links`) | `12-controls/01-controls-management.md` | **Closed (2026-07-20)** — proposed by `11-compliance/01-*` Integration with Controls; applied additively to `12-controls/01-*` (see its Amendment log) — no schema change, `module_controls_control_obligation_link` already carried this shape. |
| Additive `Risk.source = COMPLIANCE_OBLIGATION` enum value | `10-risk/01-enterprise-risk-management.md` | **Closed (2026-07-20)** — proposed by `11-compliance/01-*` Integration with Risk; applied additively to `10-risk/01-*` (see its Amendment log) — one-line, non-breaking enum addition, mirroring how `12-controls` exercised `CONTROL_TEST`. |
| General-purpose Records Retention Schedule (statutory retention period per record type, cross-module) | No owning section identified yet | **Gap** — `10-risk`/`12-controls` each deferred retention-period specification to `11-compliance`; `11-compliance/01-*` Assumption 10 confirms its own tables are retention-agnostic by design but explicitly does not design this cross-module capability. |
| Policy authoring, versioning, governed review/approval/publication, periodic re-attestation, employee acknowledgement, and exception management (SEBI AMC profile) | [`23-policy/01-policy-management.md`](../23-policy/01-policy-management.md) | **Authored** — activates the `POLICY` bounded context `04-domain-model` reserved; activates `11-compliance`'s already-built `module_compliance_obligation_policy_link`/`POST /obligations/{id}/policy-links` reservation and `09-security`'s already-built `GET /policy-domains` taxonomy tag, both with **zero** additive change required. |
| `CONTROLS`-side endpoint to populate `module_controls_control_policy_link` (`POST /controls/{id}/policy-links`) | `12-controls/01-controls-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `23-policy/01-*` Integration with Controls; applied additively to `12-controls/01-*` (see its Amendment log). |
| `04-domain-model` status-label amendment: `POLICY (reserved)` → `POLICY (authored)` (Bounded Context Map, Ownership Responsibilities, Cross-Context APIs) | `04-domain-model/01-enterprise-domain-model.md` | **Closed (2026-07-22, Session 15)** — proposed by `23-policy/01-*` Dependencies/Future Extension Points; applied alongside the other four status-label amendments below (see `04-domain-model/01-*`'s own Amendment log). |
| Incident intake/investigation, RCA, enterprise Issue-escalation register, governed CAPA (action plan, action tracking, closure verification, effectiveness review), and Escalation management (SEBI AMC profile) | [`24-incident-issue-capa/01-incident-issue-capa-management.md`](../24-incident-issue-capa/01-incident-issue-capa-management.md) | **Authored** — activates the `INCIDENT`/`ISSUE`/`CAPA` bounded context `04-domain-model` reserved; activates `13-audit`'s and `09-security`'s already-reserved `capa_ref_id` columns with zero schema change; resolves the module-code naming question as `INCIDENT`; states explicitly that this module complements, not replaces, `ControlException`/`ComplianceException`/`Finding`/`SecurityFinding`/`PolicyException` (spec Assumption 2). |
| `capa_ref_id` column plus initiating endpoint on `ControlException` (`12-controls`), `ComplianceException` (`11-compliance`), and `PolicyException` (`23-policy`) | `12-controls/01-controls-management.md`, `11-compliance/01-compliance-management.md`, `23-policy/01-policy-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `24-incident-issue-capa/01-*`; applied additively to all three (see each target document's own Amendment log). |
| Initiating endpoint (schema already reserved) on `FollowUpAction.capa_ref_id` (`13-audit`) and `SecurityFinding.capa_ref_id` (`09-security`) | `13-audit/01-audit-management.md`, `09-security/01-security-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `24-incident-issue-capa/01-*`; applied additively to both (see each target document's own Amendment log). |
| `04-domain-model` status-label amendment: `INCIDENT`/`ISSUE`/`CAPA` `(reserved)` → `(authored)` (Bounded Context Map, Ownership Responsibilities, Cross-Context APIs) | `04-domain-model/01-enterprise-domain-model.md` | **Closed (2026-07-22, Session 15)** — proposed by `24-incident-issue-capa/01-*` Dependencies/Future Extension Points; applied alongside the other four status-label amendments (see `04-domain-model/01-*`'s own Amendment log). |
| Vendor/third-party lifecycle management — onboarding through offboarding, classification/criticality, due diligence, inherent/residual vendor-risk assessment, security and compliance assessment, contract and SLA tracking, ongoing monitoring, and periodic reassessment (SEBI AMC profile) | [`25-third-party-risk/01-third-party-risk-management.md`](../25-third-party-risk/01-third-party-risk-management.md) | **Authored** — activates the `THIRD-PARTY RISK` bounded context `04-domain-model` reserved; resolves that document's own open `VendorCategory`/`RiskCategory` question (spec Assumption 5); confirms `23-policy`'s `PolicyReferenceLink` design works for a third citing module and activates `09-security`'s already-reserved `finding_type = THIRD_PARTY_RISK` value and `24-incident-issue-capa`'s `POST /capa-requests`, all with zero additive change. |
| `Risk.source = THIRD_PARTY` enum value | `10-risk/01-enterprise-risk-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*`; applied additively (see `10-risk/01-*`'s Amendment log). |
| `Control.source = THIRD_PARTY_RISK`, `module_controls_control_vendor_link`, and `POST /controls/{id}/vendor-links` | `12-controls/01-controls-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*`; applied additively (see `12-controls/01-*`'s Amendment log). |
| `COMPLIANCE`-side generalization of the obligation mirror-registration endpoint | `11-compliance/01-compliance-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*` Assumption 8; resolved by generalizing `POST /obligations/{id}/references`/`module_compliance_obligation_control_link` to a polymorphic shape (column renamed `source_entity_ref_id`), not a dedicated second table — see `11-compliance/01-*`'s Amendment log. |
| `SecurityFinding.linked_vendor_id` opaque column | `09-security/01-security-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*`; column added, but **deliberately not resolved by `SECURITY` itself** — `TPR` already depends on `SECURITY`, so a reciprocal dependency would cycle (`04-domain-model` Dependency Rule 6); resolved on demand by a third module (e.g. `14-reporting`) instead — see `09-security/01-*`'s Amendment log. |
| `AuditUniverseEntry.related_vendor_ref_id` opaque column | `13-audit/01-audit-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*`; applied additively, activating the already-live `entry_type = VENDOR` value — see `13-audit/01-*`'s Amendment log. |
| `Incident.vendor_ref_id` opaque column | `24-incident-issue-capa/01-incident-issue-capa-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*`; column added, but **deliberately not resolved by `INCIDENT` itself** — `TPR` already depends on `INCIDENT`, so a reciprocal dependency would cycle; resolved on demand by a third module instead — see `24-incident-issue-capa/01-*`'s Amendment log. |
| `04-domain-model` status-label amendment: `THIRD-PARTY RISK` `(reserved)` → `(authored)` (Bounded Context Map, Ownership Responsibilities, Cross-Context APIs) plus a closing note on the `VendorCategory`/`RiskCategory` question | `04-domain-model/01-enterprise-domain-model.md` | **Closed (2026-07-22, Session 15)** — proposed by `25-third-party-risk/01-*` Dependencies/Future Extension Points; applied alongside the other four status-label amendments (see `04-domain-model/01-*`'s own Amendment log). |
| Critical business service register, Business Impact Analysis, RTO/RPO, dependency mapping, continuity strategy, governed BCP/DR plan lifecycle, crisis/DR activation recording, continuity exercises and testing, and corrective-action tracking (SEBI AMC profile) | [`26-business-continuity/01-business-continuity-management.md`](../26-business-continuity/01-business-continuity-management.md) | **Authored** — activates the `BUSINESS CONTINUITY` bounded context `04-domain-model` reserved; resolves that document's own anticipated-entities sketch and plan-vs-`CONTROLS`-test-boundary recommendation; activates `24-incident-issue-capa`'s `POST /capa-requests` and `25-third-party-risk`'s `GET /vendors/{id}/reference` directly (built, not merely proposed) and `23-policy`'s/`09-security`'s reference/tag resolution, all with zero additive change. |
| `Risk.source = BUSINESS_CONTINUITY` enum value | `10-risk/01-enterprise-risk-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*`; applied additively (see `10-risk/01-*`'s Amendment log). |
| `Control.source = BUSINESS_CONTINUITY`, `module_controls_control_continuity_link`, and `POST /controls/{id}/continuity-links` | `12-controls/01-controls-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*`; applied additively (see `12-controls/01-*`'s Amendment log). |
| "Technology & Operational Resilience" `ObligationCategory` (no existing category fits the DR/BCP mandate) | `11-compliance/01-compliance-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*`; seeded (see `11-compliance/01-*`'s Amendment log). |
| Matching "Technology & Operational Resilience" `PolicyCategory` | `23-policy/01-policy-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*`; seeded (see `23-policy/01-*`'s Amendment log). |
| `AuditUniverseEntry.related_critical_service_ref_id` opaque column | `13-audit/01-audit-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*`; applied additively, activating the already-live `entry_type = PROCESS` value — see `13-audit/01-*`'s Amendment log. |
| `GET /incidents/{id}/reference` cross-module resolution endpoint (previously missing — only full-detail `GET /incidents/{id}` existed) | `24-incident-issue-capa/01-incident-issue-capa-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*`, the first gap in this repository naming a *missing* reference-resolution endpoint rather than a missing column on an existing one; built (see `24-incident-issue-capa/01-*`'s Amendment log). |
| `04-domain-model` status-label amendment: `BUSINESS CONTINUITY` `(reserved)` → `(authored)` (Bounded Context Map, Ownership Responsibilities, Cross-Context APIs) | `04-domain-model/01-enterprise-domain-model.md` | **Closed (2026-07-22, Session 15)** — proposed by `26-business-continuity/01-*` Dependencies/Future Extension Points; applied alongside the other four status-label amendments (see `04-domain-model/01-*`'s own Amendment log). |
| Report/dashboard catalogue with field-level provenance, on-demand report generation, approval-before-submission governance for regulator/board-facing reports, distribution record-keeping, and evidence-ready export construction, consolidating every source module's own deferred reporting obligation (SEBI AMC profile) | [`14-reporting/01-reporting-management.md`](../14-reporting/01-reporting-management.md) | **Authored** — activates the `REPORTING` bounded context `04-domain-model` reserved (the tenth and final one that document's map names); consumes all nine other authored business-domain modules' own `/reports/*` and `.../{id}/reference` endpoints with zero additive change for seven of nine, per the Report Catalogue's own field-level provenance mapping. |
| Whether Reporting/Analytics is a tenant module or a platform-level surface | `14-reporting/01-reporting-management.md` | **Closed (2026-07-21, Session 14)** — resolved as tenant-plane, like every other module (spec Assumption 1), superseding the open question row this matrix previously carried under `05-modules/` (future). |
| `GET /risks/{id}/reference` cross-module resolution endpoint (previously missing on `RISK` — the first module to need a point-citation endpoint from `RISK` itself) | `10-risk/01-enterprise-risk-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `14-reporting/01-*`; built (see `10-risk/01-*`'s Amendment log). |
| `GET /findings/{id}/reference` and `GET /engagements/{id}/reference` cross-module resolution endpoints (previously missing on `AUDIT` — the first module to need a point-citation endpoint from `AUDIT` itself) | `13-audit/01-audit-management.md` | **Closed (2026-07-22, Session 15)** — proposed by `14-reporting/01-*`; built (see `13-audit/01-*`'s Amendment log). |
| `04-domain-model` status-label amendment: `REPORTING` `(reserved)` → `(authored)` (Bounded Context Map, Ownership Responsibilities, Cross-Context APIs) | `04-domain-model/01-enterprise-domain-model.md` | **Closed (2026-07-22, Session 15)** — proposed by `14-reporting/01-*` Dependencies/Future Extension Points — the last of the five status-label amendments this repository carried; applied together this session (see `04-domain-model/01-*`'s own Amendment log). Every one of the ten bounded contexts that document's map names is now labeled "(authored)." |
| Generic PDF/CSV/export-rendering mechanism | No owning section identified yet | **Gap** — named for the first time by `14-reporting/01-*` (spec Assumption 9); confirmed absent this session; the unresolved `system.md §18` PF-CT-3/PF-CW-8 evidence-pack contract is the closest conceptual analog. |
| Scheduled-job/cron/batch-execution mechanism for periodic report generation | No owning section identified yet | **Gap** — named for the first time by `14-reporting/01-*` (spec Assumption 8); confirmed absent this session; `ReportSchedule` tracks due dates only, does not execute generation. |

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

**Session 10 (2026-07-21)** authored the repository's **seventh authoritative specification**,
[`23-policy/01-policy-management.md`](../23-policy/01-policy-management.md) (module code
`POLICY`) — the enterprise source of truth for Policies, Standards, Procedures, and
Guidelines, their governed draft → review → approve → publish → retire lifecycle, versioning,
periodic re-attestation, employee acknowledgement, and exception management. Closes three
long-standing forward references simultaneously: `11-compliance`'s
`module_compliance_obligation_policy_link`/`POST /obligations/{id}/policy-links` and
`09-security`'s `GET /policy-domains` were both already built and required **zero** additive
change to activate; `12-controls` had no reserved policy link at all, so this session's spec
**proposes, but does not apply**, a `module_controls_control_policy_link`/`POST
/controls/{id}/policy-links` extension, and separately proposes, but does not apply, the
`04-domain-model` `POLICY (reserved)` → `POLICY (authored)` status-label amendment — both
follow the propose-in-the-new-spec/apply-in-a-later-approved-session pattern this repository
has now used six times. No frozen spec (`04-domain-model`, `10-risk`, `12-controls`,
`11-compliance`, `13-audit`, `09-security`) was modified this session.

**Session 11 (2026-07-21)** authored the repository's **eighth authoritative specification**,
[`24-incident-issue-capa/01-incident-issue-capa-management.md`](../24-incident-issue-capa/01-incident-issue-capa-management.md)
(module code `INCIDENT`, resolving `04-domain-model`'s open naming question) — Incident
intake/investigation, Root Cause Analysis, an enterprise Issue-escalation register, the
governed CAPA lifecycle (action plan, action tracking, closure verification, effectiveness
review), and Escalation management. This is the most cross-referenced context this repository
had left reserved: five of the six previously frozen specs and `23-policy` each named it.
**Made explicit, with a stated reason, the single highest-risk design decision this phase's
own Master Execution Plan entry flagged**: this module *complements*, not replaces, the five
existing Finding/Exception entities (`ControlException`, `ComplianceException`, `Finding`,
`SecurityFinding`, `PolicyException`) — none of the six frozen specs plus `23-policy` was
redesigned. Closed the `Risk.source = INCIDENT` integration with **zero** additive change
(already live since `10-risk`'s own Session 1 authoring). `13-audit` and `09-security` needed
**no** schema change — both already reserve a `capa_ref_id` column; only a proposed,
not-applied initiating endpoint is needed for each. `12-controls`, `11-compliance`, and
`23-policy` each gain a **proposed, not applied**, additive `capa_ref_id` column plus
initiating endpoint, and `04-domain-model` gains a **proposed, not applied**,
`INCIDENT`/`ISSUE`/`CAPA` `(reserved)` → `(authored)` status-label amendment — following the
same propose-then-apply-later pattern this repository has now used eight times. No frozen
spec was modified this session.

**Session 12 (2026-07-21)** authored the repository's **ninth authoritative specification**,
[`25-third-party-risk/01-third-party-risk-management.md`](../25-third-party-risk/01-third-party-risk-management.md)
(module code `TPR`) — vendor/third-party lifecycle management (onboarding through
offboarding), classification and criticality, due diligence, inherent/residual vendor-risk
assessment, security and compliance assessment, contract and SLA tracking, ongoing
monitoring, and periodic reassessment, grounded in the Annexures' dedicated §2.9 Outsourcing
Risk section (not previously mined by any frozen spec). Activates the `THIRD-PARTY RISK`
bounded context `04-domain-model` reserved since Session 3, and resolves that document's own
open question about `VendorCategory`'s relationship to `RISK`'s taxonomy (a Vendor-sourced
Risk uses `RISK`'s already-seeded "Other Business Risks → Third-Party Risks" sub-category, no
new taxonomy required). Being the ninth module authored, it declares the largest
`dependencies:` list of any module to date (`[CONTROLS, COMPLIANCE, POLICY, SECURITY,
INCIDENT]`) and activates six integrations with **zero** additive change to any frozen spec —
both directions of `23-policy`'s `PolicyReferenceLink` (confirming its polymorphic design
serves a third citing module as intended), `09-security`'s `GET /policy-domains` and its
already-reserved `SecurityFinding.finding_type = THIRD_PARTY_RISK` value, `24-incident-issue-capa`'s
`POST /capa-requests` (built directly rather than merely proposed, being the first module
authored after `INCIDENT` already existed), and the read-only resolution directions of
`12-controls`' and `11-compliance`'s existing reference APIs. **Six additive changes proposed,
not applied**: `Risk.source = THIRD_PARTY` (`10-risk`); `Control.source = THIRD_PARTY_RISK`
plus `POST /controls/{id}/vendor-links` (`12-controls`); a mirror-registration extension
(`11-compliance` — its existing `POST /obligations/{id}/references` is documented as shaped
specifically for `CONTROLS`, so unlike `POLICY`'s confirmed-polymorphic design this spec does
not assume it is reusable without verification); `SecurityFinding.linked_vendor_id`
(`09-security`); `AuditUniverseEntry.related_vendor_ref_id` (`13-audit`);
`Incident.vendor_ref_id` (`24-incident-issue-capa`); plus the `04-domain-model`
`THIRD-PARTY RISK` `(reserved)` → `(authored)` status-label amendment. No frozen spec was
modified this session.

**Session 13 (2026-07-21)** authored the repository's **tenth authoritative specification**,
[`26-business-continuity/01-business-continuity-management.md`](../26-business-continuity/01-business-continuity-management.md)
(module code `BCP`) — critical business service identification, Business Impact Analysis
(BIA), RTO/RPO determination, dependency mapping, continuity strategy selection, a governed
Continuity Plan lifecycle unifying BCP and DR Plan content under one `plan_type`
discriminator, crisis/DR plan-activation recording, continuity exercises and testing, and
corrective-action (exception) tracking, grounded in two regulatory sources mined at
clause-level precision for the first time in this repository: the SEBI Risk Mgmt circular's
own Appendix A Part 1 item 1 mandate (previously cited only by section heading, at `10-risk`'s
own founding session) and the Annexures' System Audit Program Checklist item 8 (BCP & DR,
sub-items 8a–8f — previously cited only by existence, as the source of `12-controls`' own
seeded control family). Activates the `BUSINESS CONTINUITY` bounded context `04-domain-model`
reserved since Session 3, resolves that document's own anticipated-entities sketch (RTO/RPO/
MTPD modeled as columns on the critical-service aggregate root, updated by a governed BIA,
rather than a standalone `RecoveryObjective` entity), and resolves — rather than merely
restates — that document's own plan-vs-`12-controls`-test-boundary recommendation: `CONTROLS`
continues to own the effectiveness pass/fail decision on its seeded "Business Continuity &
Disaster Recovery" control family, while this module owns the Plan, the RTO/RPO targets, and
each exercise's operational specifics, corroborating the Control by opaque reference. Being
the tenth module authored, and the first authored after both `INCIDENT` and `TPR` already
existed, it declares the largest `dependencies:` list of any module to date (`[CONTROLS,
COMPLIANCE, POLICY, SECURITY, INCIDENT, TPR]`) and is the first module to build **two**
integrations directly rather than merely propose either (`INCIDENT`'s `POST /capa-requests`
and `TPR`'s `GET /vendors/{id}/reference`), plus activates `POLICY`'s and `SECURITY`'s
reference/tag resolution with zero additive change. **Six additive changes proposed, not
applied**: `Risk.source = BUSINESS_CONTINUITY` (`10-risk`); `Control.source =
BUSINESS_CONTINUITY` plus `POST /controls/{id}/continuity-links` (`12-controls`); a new
"Technology & Operational Resilience" `ObligationCategory` (`11-compliance`) and matching
`PolicyCategory` (`23-policy`) — the first module to discover neither existing taxonomy has a
category fitting its own primary regulatory driver; `AuditUniverseEntry.related_critical_service_ref_id`
(`13-audit`); a `GET /incidents/{id}/reference` addition (`24-incident-issue-capa`) — the
first proposal in this repository for a *missing* reference-resolution endpoint pattern,
rather than a missing column on an existing one; plus the `04-domain-model`
`BUSINESS CONTINUITY` `(reserved)` → `(authored)` status-label amendment. No frozen spec was
modified this session.

**Session 14 (2026-07-21)** authored the repository's **eleventh authoritative specification**,
[`14-reporting/01-reporting-management.md`](../14-reporting/01-reporting-management.md) (module
code `REPORTING`) — the tenth and final bounded context `04-domain-model` reserves, per this
session's explicit instruction to proceed directly to Master Execution Plan Phase 11 rather than
the seventeen-additive-change consolidation `docs/roadmap.md`'s own prior recommendation had
named first (see that file's own Session 14 entry). Consolidates every one of the nine prior
business-domain modules' own deferred Reporting Requirements section into a 69-row seed Report
Catalogue (63 rows restating what each source module already named, six new cross-module
reports this module itself originates), plus field-level provenance
(`ReportFieldMapping`/`ReportCitation`), on-demand report generation with opt-in
approval-before-submission governance (`ReportInstance.status`, gated by
`ReportDefinition.approval_required`), and distribution record-keeping. Only `15-analytics`
(KPI/metric catalog, dashboard visualization composition) this session's scope excludes —
deferred per that section's own README boundary and this spec's own Assumption 16. Consumes
seven of the nine source modules' existing `GET .../{id}/reference` endpoints with **zero**
additive change; discovers and proposes, but does not apply, two genuinely new point-citation
gaps — `GET /risks/{id}/reference` on `10-risk` and `GET /findings/{id}/reference`/
`GET /engagements/{id}/reference` on `13-audit` — the first module to need either, since every
prior integration with `RISK` only wrote a `Risk.source` value and `AUDIT` was designed as this
repository's own consumer/graph-sink. Relies on, but does not duplicate,
`26-business-continuity`'s own already-open `GET /incidents/{id}/reference` proposal. Names two
genuinely new PRSMTD capability gaps confirmed absent this session (a scheduled-job/batch-
execution mechanism; a generic PDF/CSV export-rendering mechanism), neither blocking this
module's own MVP scope — deliberately designed so this module's core function does not depend on
the still-open document/object-storage gap either (spec Assumption 7), unlike every prior
evidence-bearing module. Proposes, but does not apply, the `REPORTING (reserved)` →
`REPORTING (authored)` status-label amendment on `04-domain-model` — the last of the ten such
amendments this repository now carries, alongside the four already open for `POLICY`/`INCIDENT`/
`THIRD-PARTY RISK`/`BUSINESS CONTINUITY`. **No frozen spec was modified this session.**

**Session 15 (2026-07-22) — Additive Change Consolidation.** Applied all nineteen additive
changes and all five `04-domain-model` status-label amendments this repository had carried as
proposed-not-applied since Sessions 10–14, closing every open gap row in the register above.
Reviewed every proposal against the current state of its target document before applying —
none had been invalidated by a later spec, and all remained architecturally correct as
originally scoped. Touched, additively only, seven frozen specs (`10-risk`, `12-controls`,
`11-compliance`, `13-audit`, `09-security`, `23-policy`, `24-incident-issue-capa`) plus
`04-domain-model` itself, and updated the four proposing specs
(`23-policy`/`24-incident-issue-capa`/`25-third-party-risk`/`26-business-continuity`) and
`14-reporting` to reflect their own now-activated integrations. Corrected several genuine
pre-existing staleness issues found during this session's own consistency review, independent
of the additive-change backlog: `12-controls`' `module_controls_control_obligation_link` and
FR-13 still read "inert"/"future" despite that link having been activated since Session 6;
`11-compliance`'s `module_compliance_obligation_policy_link` and FR-13 still read "inert"
despite `POST /obligations/{id}/policy-links` having been live since `23-policy`'s own Session
10 authoring; `09-security`'s "Integration with Future Policy Management" section still
described `GET /policy-domains` as "inert until that module ships" despite it having been live
since Session 6; `23-policy`'s `module_policy_reference_link.source_module_code`/
`source_entity_type` enum documentation still listed only `CONTROLS, COMPLIANCE` despite `TPR`
and `BCP` having already activated it at their own Session 12/13 authoring; and `04-domain-model`
itself had not been revisited since Session 7 — its Strategic Classification, both mermaid
diagrams, five contexts' own subsections, Canonical Business Glossary, Cross-Context APIs,
Ownership Responsibilities, and Dependency Rules all still described `POLICY`/`INCIDENT`/
`THIRD-PARTY RISK`/`BUSINESS CONTINUITY`/`REPORTING` as reserved despite all five having been
authored across Sessions 10–14. **Discovered and corrected, before it was ever recorded as
fact anywhere, a genuine cycle risk this session's own proposed changes would have introduced**:
`SecurityFinding.linked_vendor_id` and `Incident.vendor_ref_id` were each initially drafted with
a reciprocal manifest dependency (`SECURITY → TPR`, `INCIDENT → TPR`) that would have violated
OWN-08's acyclic requirement, since `TPR` already declares a dependency on both `SECURITY` and
`INCIDENT`. Resolved by leaving both references opaque and unresolved by their owning module,
consistent with the Common Domain Patterns' own "a reference does not require a dependency edge"
principle — resolved instead by a third module with no conflicting edge (`14-reporting`). No
entity, aggregate, DDD relationship type, or ownership assignment was redesigned anywhere in this
session — every change was additive, a correction of stale prose describing an already-decided
state, or a cycle-avoidance refinement of how (not whether) an already-proposed reference
resolves.
