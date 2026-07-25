# ERM Demonstration Workflow Catalogue

*Master planning document — analysis only. No code, decks, screenshots, or specifications were created or modified to produce this report.*

Repository: `c:\development\projects\ERM` · Prepared: 2026-07-25 · Scope: `docs/` (27 sections) + `prototype/` (Next.js demo app)

---

## 1. Executive Summary

The ERM repository contains **12 authored, implementation-ready module specifications** (Domain Model, Risk, Controls, Compliance, Audit, Security, Policy, Incident/Issue/CAPA, Third-Party Risk, Business Continuity, Reporting, Analytics) sitting on top of PRSMTD's maker-checker governance substrate, plus a **working Next.js prototype** ("Meridian Asset Management Ltd.") that implements all 11 business modules with real cross-module data linking, a fully functional maker-checker approval queue, persona switching across 16 named users, and 150+ navigable screen states.

This investigation catalogues **46 realistic, end-to-end demonstration workflows** derivable from that specification + prototype pair, spanning four complexity tiers. Six of the 46 correspond directly to journeys the prototype's own authors already wrote up and validated in `prototype/docs/user-journeys.md` — these are the lowest-risk, highest-confidence starting points.

**Headline numbers**

| Metric | Value |
|---|---|
| Authored module specifications | 12 (of the 27-section scaffold; 14 sections are index-only stubs — see §12; the remaining unauthored section, `22-traceability`, is not a stub — it carries two substantive cross-cutting documents this catalogue itself cites) |
| Business modules implemented in the prototype | 11 |
| Named personas available for role-play (org.json) | 16 |
| Entity types in the prototype | 51 (46+ per the prototype's own docs; verified count 51) |
| Distinct navigable screen states | ~150 generic (list/detail/create/edit) + 11 module dashboards + 5 enterprise screens |
| **Cataloged demonstration workflows** | **46** (31 Level 1 · 10 Level 2 · 4 Level 3 · 1 Level 4) |
| Already-validated prototype journeys | 6 (mapped to workflow IDs in §2 and §5) |
| Estimated raw screenshots across all 46 decks (no reuse) | ~490 |
| Estimated net-new screenshots with recommended reuse strategy | ~300–330 |
| Estimated total effort if every workflow became its own deck | ~45 person-days |
| Estimated effort with recommended module-bundling strategy | ~25–28 person-days |

**Recommended Day-1 deck**: **L1-01, Risk Assessment Approval** (see §10).

This report makes no claims about workflows, screens, or capabilities not directly evidenced in the specs or the prototype. Where the specifications are silent or explicitly mark something unauthored, that is called out in §12 rather than assumed.

---

## 2. Methodology & Source Grounding

Findings are drawn from a full read of:
- All markdown documents under `docs/04-domain-model`, `docs/05-modules`, `docs/07-workflows`, `docs/09-security`, `docs/19-roadmap`, `docs/20-adr`, `docs/22-traceability` (foundational/cross-cutting)
- All markdown documents under `docs/10-risk`, `docs/11-compliance`, `docs/12-controls`, `docs/13-audit` (core GRC domain)
- All markdown documents under `docs/23-policy`, `docs/24-incident-issue-capa`, `docs/25-third-party-risk`, `docs/26-business-continuity`, plus `docs/06-data-model` and `docs/08-api` (extended GRC domain)
- All markdown documents under `docs/14-reporting`, `docs/15-analytics`, `docs/27-user-experience` (reporting/analytics/UX)
- `prototype/docs/README.md`, `screen-inventory.md`, `navigation-map.md`, `user-journeys.md`, `component-inventory.md`, `defects-and-observations.md` (read directly, in full)
- `prototype/src/data/org.json` (personas, roles, departments — read directly, in full)
- `prototype/src/modules/*`, `prototype/src/features/*`, `prototype/app/**` route structure (module/entity/route inventory)

No workflow in this catalogue was invented; each is either (a) a governed or ungoverned lifecycle explicitly state-machined in a module spec, (b) an explicit cross-module reference/chain named in a spec (`Risk.source`, `capa_ref_id`, opaque reference APIs, etc.), or (c) a journey already implemented and documented in the prototype.

---

## 3. How to Read the Catalogue

**Module abbreviations** (table-column shorthand used only in this document for width — not the specs' own `module.code` values; mapped explicitly here so the two are never confused): `RISK` · `CTRLS` → `CONTROLS` · `CMPL` → `COMPLIANCE` · `AUD` → `AUDIT` · `SEC` → `SECURITY` · `POL` → `POLICY` · `INC` → `INCIDENT` (Incident/Issue/CAPA) · `TPR` (Third-Party Risk — matches `module.code`) · `BCP` (Business Continuity — matches `module.code`) · `RPT` → `REPORTING` · `ANA` → `ANALYTICS`.

**Personas** — first name only after first use; full role mapping in §11. Maker/Checker pairs come directly from `prototype/src/data/org.json`.

**Flags column** `MC·Ex·Rp·An` — four Y/N letters in fixed order: Maker-Checker involved · Executive Dashboard involved · Reporting involved · Analytics involved.

**Scr/Act** — approximate distinct screen views / approximate discrete user actions (submits, approvals, navigations) for a live walkthrough.

**Complexity** — Simple / Medium / Complex, per the task's screen-count bands (L1 5–10, L2 10–20, L3 20–40, L4 40+), adjusted for number of governance gates crossed.

**Priority** — Critical / High / Medium / Low, reflecting narrative strength + regulatory salience + how directly the workflow proves the platform's core differentiator (governed, cross-module GRC).

**Value** — dominant audience(s): Executive, Business, Operations, Technical, Regulatory.

All 46 workflows are demo-ready on the existing prototype (Demo=Y). Two (L1-14, L1-31) skew toward technical/security-specialist audiences rather than general business audiences — noted inline, not excluded.

---

## 4. Complete Workflow Catalogue

### 4.1 Level 1 — Quick Demonstrations (5–10 screens)

Single-module workflows. Each proves one governed (or deliberately ungoverned) lifecycle in isolation.

| ID | Name | Objective | Modules | Primary | Secondary | Trigger | Start → End Screen | Scr/Act | MC·Ex·Rp·An | Complexity | Priority · Value | Dur/Slides/Shots |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L1-01 | Risk Assessment Approval *(validated journey 1)* | Show the canonical maker-checker pattern | RISK | Arjun Mehta (Risk Manager) | Priya Raghunathan (CRO) | Maker submits (re)assessment on an ACTIVE risk | Risk Register list → Risk Detail (Decision History) | 7/5 | Y·N·N·N | Simple | Critical · Business/Operations | 8m/8/7 |
| L1-02 | Risk Treatment Plan Approval | Show mitigation planning tied to a risk | RISK | Arjun | Priya | Maker proposes ACCEPT/MITIGATE/TRANSFER/AVOID plan | Risk Detail → Treatment Plan Detail | 7/5 | Y·N·N·N | Simple | High · Business | 8m/8/7 |
| L1-03 | Risk Acceptance | Show formal risk sign-off with expiry | RISK | Arjun | Priya | Maker requests acceptance on ACTIVE/ESCALATED risk | Risk Detail → Acceptance record (Approved/Expired) | 6/4 | Y·N·N·N | Simple | Medium · Regulatory | 6m/7/6 |
| L1-04 | KRI Breach → Escalation Acknowledgement | Show automated indicator monitoring triggering exec escalation | RISK | System (auto) | Priya | KRI measurement lands in RED band | KRI Dashboard → Escalation acknowledged | 7/4 | Y·Y·N·Y | Medium | High · Executive/Operations | 8m/8/7 |
| L1-05 | Control Test Execution & Result Capture | Show design/operating control testing | CTRLS | Sneha Kulkarni (Control Owner) | Deepak Malhotra (Head of Compliance) | Maker submits DESIGN or OPERATING test | Control Detail → Test result recorded | 6/4 | Y·N·N·N | Simple | High · Business | 6m/7/6 |
| L1-06 | Control Exception Lifecycle *(validated journey 2)* | Show OPEN→remediation→governed closure | CTRLS | Sneha | Deepak | Operating test FAILs, exception raised immediately | Exceptions list → Exception Detail (CLOSED) | 7/5 | Y·N·N·N | Simple | Critical · Business/Operations | 8m/8/7 |
| L1-07 | Compliance Assessment Approval | Show obligation assessment with NON_COMPLIANT gating rule | CMPL | Kavitha Subramanian (Compliance Officer) | Deepak | Maker submits assessment against an Obligation | Obligation Detail → Assessment Detail (Approved) | 7/5 | Y·N·N·N | Simple | Critical · Regulatory | 8m/8/7 |
| L1-08 | Regulatory Change → Obligation Update | Show SEBI circular tracked through to obligation update | CMPL | Kavitha | Deepak | Maker logs a new circular/amendment | Regulatory Change list → Obligation updated (SUPERSEDED/ACTIVE) | 8/6 | Y·N·N·N | Medium | High · Regulatory | 10m/9/8 |
| L1-09 | Compliance Exception Disposition | Show exception handling incl. closure-blocking rule | CMPL | Kavitha | Deepak | NON_COMPLIANT assessment raises exception | Exceptions list → Exception Detail (CLOSED/RISK_ACCEPTED) | 7/5 | Y·N·N·N | Medium | High · Regulatory/Business | 8m/8/7 |
| L1-10 | Compliance Attestation | Show periodic obligation/tenant-wide sign-off | CMPL | Kavitha | Deepak | Maker submits attestation | Attestations list → Attestation Detail (ATTESTED) | 6/4 | Y·N·N·N | Simple | Medium · Regulatory | 6m/7/6 |
| L1-11 | Audit Plan Approval | Show risk-based audit plan sign-off | AUD | Vikram Singh (Internal Auditor) | Meera Krishnan (Head of Internal Audit) | Maker submits annual/cyclical audit plan | Audit Plans list → Plan Detail (APPROVED) | 6/4 | Y·Y·N·N | Simple | High · Regulatory/Executive | 7m/7/6 |
| L1-12 | Audit Finding Closure | Show finding raise → management response → governed close | AUD | Vikram | Meera | Finding raised during an engagement | Findings list → Finding Detail (CLOSED) | 7/5 | Y·N·N·N | Simple | Critical · Regulatory/Business | 8m/8/7 |
| L1-13 | Security Finding Remediation & Closure | Show vulnerability/misconfiguration lifecycle | SEC | Imran Shaikh (Security Analyst) | Rohan Nair (CISO) | Maker raises finding (or automated feed) | Findings list → Finding Detail (CLOSED) | 7/5 | Y·N·N·N | Simple | High · Technical/Regulatory | 8m/8/7 |
| L1-14 | Privileged Access Grant Lifecycle *(technical audience)* | Show PAM governance incl. ungoverned emergency revoke | SEC | Imran | Rohan | Maker requests privileged access grant | Access Grants list → Grant ACTIVE/EXPIRED/REVOKED | 6/4 | Y·N·N·N | Simple | Medium · Technical | 6m/7/6 |
| L1-15 | Policy Authoring → Review → Publication | Show governed document lifecycle | POL | Anita Deshpande (Company Secretary & Policy Owner) | Deepak | Maker drafts and submits a Policy Version | Policies list → Policy Detail (ACTIVE) | 7/5 | Y·N·N·N | Simple | High · Business/Regulatory | 8m/8/7 |
| L1-16 | Policy Acknowledgement Campaign | Show org-wide read/understand attestation (ungoverned) | POL | Any employee | Anita | Version reaches PUBLISHED | Policy Detail → Acknowledgement recorded | 5/3 | N·N·N·N | Simple | Medium · Business | 5m/6/5 |
| L1-17 | Policy Periodic Review / Re-Attestation | Show scheduled re-affirmation with 3 outcomes | POL | Anita | Deepak | `next_review_date` reached | Policy Detail → Review Detail (APPROVED) | 6/4 | Y·N·N·N | Simple | Medium · Regulatory | 6m/7/6 |
| L1-18 | Policy Exception → CAPA | Show a policy deviation escalate into a corrective action | POL, INC | Anita | Lakshmi Venkataraman (Incident & CAPA Manager) | Maker raises exception immediately | Exception Detail → CAPA request created (INCIDENT) | 7/5 | Y·N·N·N | Medium | Medium · Business | 8m/8/7 |
| L1-19 | Incident Intake → Investigation → Closure | Show immediate report through governed closure | INC | Lakshmi | Priya | Any user reports an incident (no approval to report) | Incidents list → Incident Detail (CLOSED) | 7/5 | Y·N·N·N | Simple | Critical · Operations | 8m/8/7 |
| L1-20 | Root Cause Analysis Approval | Show structured RCA discipline | INC | Lakshmi | Priya | Maker drafts RCA on Incident or standalone Issue | RCA Detail (Draft) → RCA Detail (APPROVED) | 6/4 | Y·N·N·N | Simple | Medium · Operations/Technical | 6m/7/6 |
| L1-21 | Issue → CAPA Full Lifecycle | Show the richest single-module chain: 3 governed gates | INC | Lakshmi | Priya | Issue opened (standalone, from Incident, or linked) | Issue Detail → CAPA Detail (CLOSED, effectiveness reviewed) | 10/8 | Y·N·N·N | Medium | Critical · Operations/Regulatory | 14m/11/10 |
| L1-22 | SLA/Escalation Acknowledgement | Show automated SLA-breach escalation | INC | System (auto) | Priya | SLA breach detected | Escalation list → Escalation ACKNOWLEDGED | 5/3 | Y·N·N·N | Simple | Medium · Operations | 5m/6/5 |
| L1-23 | Vendor Onboarding Due Diligence *(validated journey 4)* | Show a vendor move PROSPECTIVE→ACTIVE | TPR | Farhan Qureshi (Vendor Risk Manager) | Rajesh Iyer (COO) | Maker creates vendor, submits due-diligence assessment | Vendors list → Vendor Detail (ACTIVE) | 8/6 | Y·N·N·N | Medium | Critical · Business/Regulatory | 10m/9/8 |
| L1-24 | Vendor SLA Breach → Exception → CAPA | Show automated SLA monitoring escalate to remediation | TPR, INC | System (auto) then Farhan | Rajesh | SLA measurement lands in RED band | SLA Detail → Exception Detail → CAPA request | 8/6 | Y·N·N·N | Medium | High · Operations/Business | 10m/9/8 |
| L1-25 | Vendor Offboarding | Show termination gating (no active contracts/open exceptions) | TPR | Farhan | Rajesh | Maker initiates offboarding | Vendor Detail (ACTIVE) → Vendor Detail (TERMINATED) | 6/4 | Y·N·N·N | Simple | Low · Business | 6m/7/6 |
| L1-26 | Critical Service BIA Approval | Show Business Impact Analysis set RTO/RPO/MTPD | BCP | Suresh Menon (BCM Manager) | Rajesh | Maker submits BIA on a Critical Business Service | Critical Services list → Service Detail (ACTIVE, RTO/RPO set) | 7/5 | Y·N·N·N | Simple | High · Regulatory/Business | 8m/8/7 |
| L1-27 | Continuity/DR Plan Authoring → Publication | Show BCP/DR plan version governance | BCP | Suresh | Rajesh | Maker drafts a Continuity Plan Version | Plans list → Plan Detail (ACTIVE) | 7/5 | Y·N·N·N | Simple | Medium · Business | 8m/8/7 |
| L1-28 | Continuity Exercise → Exception → CAPA *(validated journey 5)* | Show a DR drill outcome thread through Security/Incident/BCP | BCP, INC | Suresh | Rajesh, Lakshmi | Exercise APPROVED with FAILED/RTO-miss outcome | Exercise Detail → Exception Detail → CAPA → Action Items | 9/6 | Y·N·N·N | Medium | Critical · Executive/Operations | 12m/10/9 |
| L1-29 | DR/Crisis Plan Activation | Show real-time, ungoverned crisis invocation record | BCP | Suresh | Rajesh | Incident or crisis triggers plan invocation | Plan Detail → Activation record (DEACTIVATED, RTO met?) | 6/4 | N·Y·N·N | Medium | Medium · Executive/Operations | 7m/7/6 |
| L1-30 | Report Instance Generation → Approval → Distribution | Show the one governed reporting action | RPT | Divya Pillai (MIS & Reporting Analyst) | Deepak | Maker generates a report instance (e.g. Board & Executive GRC Summary) | Report Definitions list → Report Instance Detail (APPROVED) | 6/4 | Y·Y·Y·N | Simple | High · Executive | 7m/7/6 |
| L1-31 | KPI/Metric Catalogue & Threshold Banding Walkthrough *(technical audience)* | Show metric definitions, GREEN/AMBER/RED banding, drill-down views | ANA | Divya | Priya | Analyst opens the metric catalogue | Analytics Dashboard → MetricView drill-down | 5/3 | N·Y·N·Y | Simple | Medium · Executive/Technical | 6m/6/5 |

### 4.2 Level 2 — Standard Business Processes (10–20 screens)

Two- or three-module chains. Each proves a named cross-module integration point.

| ID | Name | Objective | Modules | Primary | Secondary | Trigger | Start → End Screen | Scr/Act | MC·Ex·Rp·An | Complexity | Priority · Value | Dur/Slides/Shots |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L2-01 | Control Failure → Risk Register Entry | Show a FAILed operating test escalate into a new enterprise risk | CTRLS, RISK | Sneha | Priya, Deepak | Operating test result = FAIL, `Control.source` chain activates | Control Test Detail → new Risk Detail (`source=CONTROL_TEST`) | 12/9 | Y·N·N·N | Medium | High · Business/Executive | 16m/13/12 |
| L2-02 | Audit Finding → Risk + Control + CAPA Fan-Out | Flagship "audit finding to CAPA" chain, incl. new Control creation | AUD, RISK, CTRLS, INC | Vikram | Meera, Priya, Sneha, Lakshmi | CONTROL_DEFICIENCY finding raised, HIGH/CRITICAL rated | Finding Detail → linked Risk + new Control + Follow-Up CAPA | 15/11 | Y·N·N·N | Complex | Critical · Regulatory/Executive | 20m/16/15 |
| L2-03 | Compliance Breach → Risk → Audit Validation | Show non-compliance travel from exception to audit corroboration | CMPL, RISK, AUD | Kavitha | Deepak, Vikram | Assessment NON_COMPLIANT → HIGH exception | Exception Detail → Risk Detail → Audit Finding (COMPLIANCE_GAP) | 14/10 | Y·N·N·N | Complex | Critical · Regulatory | 18m/15/14 |
| L2-04 | Security Finding → Risk + Incident + CAPA | Show a critical vulnerability escalate to enterprise risk and an operational CAPA thread | SEC, RISK, INC | Imran | Rohan, Priya, Lakshmi | Finding rated HIGH/CRITICAL | Finding Detail → Risk Detail + Issue/CAPA thread | 13/10 | Y·N·N·N | Complex | Critical · Technical/Executive | 17m/14/13 |
| L2-05 | Risk Treatment → Control Mapping Closure | Show a MITIGATE plan resolve into a linked control, closing the loop | RISK, CTRLS | Arjun | Sneha | Treatment plan strategy = MITIGATE, linked to a Control | Treatment Plan Detail → Control Detail (linked) → Risk residual score updated | 11/8 | Y·N·N·N | Medium | High · Business | 15m/12/11 |
| L2-06 | Third-Party Risk Fan-Out | Show vendor risk's unusually wide integration surface | TPR, CTRLS, CMPL, INC | Farhan | Rajesh, Sneha, Kavitha | Vendor risk/security assessment raises findings | Vendor Detail → linked Control + Obligation + Incident | 14/10 | Y·N·N·N | Complex | High · Business/Regulatory | 18m/15/14 |
| L2-07 | Cross-Module Drill-Down & Global Search *(validated journey 3)* | Prove the cross-linked data model is real, not decorative | RISK, CTRLS, SEC, INC | Any persona | — | Open any Risk with linked Controls/Escalation/Treatment | Risk Detail (Relationships tab) → Global Search results | 10/6 | N·N·N·N | Medium | Critical · Technical/Executive | 12m/10/10 |
| L2-08 | Control–Compliance Obligation Mapping | Show one control satisfying multiple regulatory obligations | CTRLS, CMPL | Sneha | Kavitha | Control linked to Obligation(s) | Control Detail (Relationships) → Obligation Detail | 10/6 | Y·N·N·N | Medium | Medium · Regulatory | 12m/10/10 |
| L2-09 | Multi-Source Exception → Unified CAPA | Show Policy/Control/Compliance exceptions all resolve through one CAPA mechanism | POL, CTRLS, CMPL, INC | Varies by source | Lakshmi | Three different exception types each request a CAPA | Three Exception Detail screens → one Issue/CAPA thread each | 13/9 | Y·N·N·N | Complex | High · Operations/Technical | 17m/14/13 |
| L2-10 | Executive/Board Dashboard Review | Pure "sit with the Board and read every dashboard" session — no maker-checker choreography required | RPT, ANA, all modules | Nandini Rao (Board Risk Committee) | — | Board persona opens Home | Enterprise Home → all 11 module dashboards → Board & Executive GRC Summary | 14/5 | N·Y·Y·Y | Medium | Critical · Executive | 15m/12/14 |

### 4.3 Level 3 — Enterprise Workflows (20–40 screens)

Multi-chain narratives combining several Level 2 integrations into one story arc.

| ID | Name | Objective | Modules | Primary | Secondary | Trigger | Start → End Screen | Scr/Act | MC·Ex·Rp·An | Complexity | Priority · Value | Dur/Slides/Shots |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L3-01 | Enterprise Risk-to-Assurance Full Lifecycle | Risk identified → mitigated by a control → independently tested by Audit → reaches the Board | RISK, CTRLS, AUD, RPT | Arjun | Sneha, Vikram, Meera, Priya, Divya | New risk identified from any source | Risk Register → Control Test → Audit Finding/Engagement → Board Report | 28/18 | Y·Y·Y·Y | Complex | Critical · Executive/Regulatory | 35m/22/28 |
| L3-02 | Regulatory Inspection Readiness Journey | Simulate SEBI inspection prep: obligations, evidence, attestations, findings, trustee report | CMPL, AUD, POL, RPT | Kavitha | Deepak, Vikram, Anita, Divya | Simulated inspection notice / internal readiness review | Obligation Register → Evidence/Attestation trail → Audit Findings → Quarterly Compliance Report | 24/15 | Y·Y·Y·N | Complex | High · Regulatory/Executive | 30m/19/24 |
| L3-03 | Incident-to-Board-Reporting Journey | A security incident travels from detection to a board report line item | SEC, INC, RISK, RPT | Imran | Rohan, Lakshmi, Priya, Divya | Security finding escalates to Incident | Finding Detail → Incident/RCA/CAPA → Risk update → Board Report | 22/14 | Y·Y·Y·N | Complex | High · Executive/Operations | 28m/18/22 |
| L3-04 | Third-Party & Business Continuity Resilience Journey | Vendor concentration risk feeds a critical-service BIA, a DR exercise, and its remediation | TPR, BCP, CTRLS, INC, RPT | Farhan | Suresh, Sneha, Lakshmi, Rajesh | Vendor risk rating flags a critical dependency | Vendor Detail → Critical Service/BIA → DR Exercise → Exception/CAPA → Resilience Report | 26/16 | Y·Y·Y·N | Complex | Medium · Executive/Regulatory | 32m/21/26 |

### 4.4 Level 4 — Complete End-to-End Enterprise Journey (40+ screens)

| ID | Name | Objective | Modules | Primary | Secondary | Trigger | Start → End Screen | Scr/Act | MC·Ex·Rp·An | Complexity | Priority · Value | Dur/Slides/Shots |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L4-01 | Complete Governance Approval Journey *(validated journeys 1–6, combined)* | The master demo: every maker-checker pattern, every module dashboard, executive/board views, reporting and analytics, run back-to-back with the persona switcher, exactly as `prototype/docs/user-journeys.md` sequences it, plus a full pass over all 11 module dashboards | All 11 modules | Rotates across all 16 personas | — | Facilitator opens Login screen | Login (persona picker) → all 11 module walkthroughs → Board & Executive GRC Summary → Reset demo data | 55+/35 | Y·Y·Y·Y | Complex | Critical · All audiences | 85m/45/55 |

---

## 5. Workflow Dependency Matrix

**Foundational (no prerequisites)** — safe to demonstrate to a first-time audience in any order:
L1-01, L1-05, L1-07, L1-11, L1-13, L1-15, L1-19, L1-23, L1-26, L1-30, and **L2-07** (Cross-Module Drill-Down — pure navigation, no governance choreography, works as a cold open even before any L1 workflow).

**Builds on** (must be shown, or at minimum rehearsed, before the dependent workflow to establish vocabulary):

| Dependent workflow | Requires prior familiarity with |
|---|---|
| L1-02, L1-03, L1-04 | L1-01 (risk register basics) |
| L1-09 | L1-07 (assessment concept) |
| L1-18 | L1-15 or L1-17 (policy exception concept) + L1-21 (CAPA concept) |
| L1-21 | L1-19 or L1-20 (issue concept) |
| L1-24 | L1-23 (vendor lifecycle) |
| L1-28 | L1-27 (plan concept) |
| L2-01 | L1-05/L1-06 (control testing/exception) + L1-01 (risk register) |
| L2-02 | L1-11/L1-12 (audit vocabulary) + L1-06 (exception pattern) + L1-21 (CAPA pattern) |
| L2-03 | L1-07/L1-09 (compliance vocabulary) + L1-01 (risk) + L1-12 (finding pattern) |
| L2-04 | L1-13 (security finding) + L1-01 (risk) + L1-21 (CAPA) |
| L2-05 | L1-02 (treatment plan) + L1-05 (control) |
| L2-06 | L1-23 (vendor) + L1-05 (control) + L1-07 (obligation) |
| L2-08 | L1-05 + L1-07 |
| L2-09 | L1-06, L1-09, L1-18 (all three exception patterns) |
| L2-10 | none technically, but lands far better after at least one maker-checker workflow (e.g. L1-01) has shown *how* the numbers on the dashboards get there |
| L3-01 | L1-01, L1-05/06, L1-11/12, L1-30 |
| L3-02 | L1-07/08/09/10, L1-11/12, L1-15 |
| L3-03 | L1-13, L1-19/20/21, L1-30 |
| L3-04 | L1-23/24, L1-26/27/28 |
| L4-01 | Effectively all of the above — it is a compilation, not a standalone story |

**Never demonstrate before its prerequisites**: any Level 2 fan-out (L2-01 through L2-06, L2-09) before the single-module workflow(s) it fans out of — an audience that hasn't seen what a "Finding" or "Exception" is will not follow a chain that assumes the term. L4-01 should never be a first meeting; its 85-minute runtime and compressed pacing only land with an audience that already trusts the maker-checker story from an earlier session.

**Screenshot reuse**: every Level 2+ workflow re-enters screens already captured for its prerequisite Level 1 decks (e.g. L2-02's Finding Detail screen is the same screen captured for L1-12; L3-01's Risk Register screen is the same one captured for L1-01). Building decks in dependency order (§7) lets each new deck reuse 30–50% of its screenshots from prior decks rather than recapturing them.

---

## 6. Demonstration Roadmap

| Phase | Timeframe (relative) | Content | Workflows |
|---|---|---|---|
| Phase 0 — Kickoff | Day 1 | Single flagship deck | L1-01 (primary) or L2-10 (executive cold-open alternative) |
| Phase 1 — Module Foundations | Weeks 1–2 | One bundled deck per module, covering that module's Level 1 workflows | All 31 Level 1 workflows, bundled into 10 module decks (see §7) |
| Phase 2 — Integrations | Weeks 3–4 | One deck per cross-module chain, in priority order | All 10 Level 2 workflows |
| Phase 3 — Enterprise Journeys | Weeks 5–6 | One deck per multi-chain narrative | All 4 Level 3 workflows |
| Phase 4 — Capstone | Week 7+ | The complete journey, built last so it can reuse nearly every prior screenshot | L4-01 |

---

## 7. Recommended Deck Creation Order

1. **L1-01** Risk Assessment Approval *(Day 1)*
2. **RISK Foundations** deck (bundles L1-02, L1-03, L1-04)
3. **CONTROLS Foundations** deck (bundles L1-05, L1-06)
4. **COMPLIANCE Foundations** deck (bundles L1-07, L1-08, L1-09, L1-10)
5. **AUDIT Foundations** deck (bundles L1-11, L1-12)
6. **SECURITY Foundations** deck (bundles L1-13, L1-14)
7. **POLICY Foundations** deck (bundles L1-15, L1-16, L1-17, L1-18)
8. **INCIDENT/CAPA Foundations** deck (bundles L1-19, L1-20, L1-21, L1-22)
9. **TPR Foundations** deck (bundles L1-23, L1-24, L1-25)
10. **BCP Foundations** deck (bundles L1-26, L1-27, L1-28, L1-29)
11. **REPORTING & ANALYTICS Foundations** deck (bundles L1-30, L1-31)
12. **L2-07** Cross-Module Drill-Down & Global Search
13. **L2-10** Executive/Board Dashboard Review
14. **L2-02** Audit Finding → Risk + Control + CAPA Fan-Out
15. **L2-03** Compliance Breach → Risk → Audit Validation
16. **L2-04** Security Finding → Risk + Incident + CAPA
17. **L2-01** Control Failure → Risk Register Entry
18. **L2-05** Risk Treatment → Control Mapping Closure
19. **L2-06** Third-Party Risk Fan-Out
20. **L2-09** Multi-Source Exception → Unified CAPA
21. **L2-08** Control–Compliance Obligation Mapping
22. **L3-01** Enterprise Risk-to-Assurance Full Lifecycle
23. **L3-02** Regulatory Inspection Readiness Journey
24. **L3-03** Incident-to-Board-Reporting Journey
25. **L3-04** Third-Party & Business Continuity Resilience Journey
26. **L4-01** Complete Governance Approval Journey *(capstone — built last)*

This produces **26 decks** covering all 46 cataloged workflows (10 of the 26 are bundled multi-workflow module decks; the remaining 16 are 1:1 with a single workflow).

---

## 8. Estimated Effort per Deck

No decks exist yet, so these are estimates from screenshot/slide counts (§4), not measurements.

| Complexity band | Workflows in band | Effort per workflow | Subtotal |
|---|---|---|---|
| Simple | 22 | ~0.5 person-day | 11 person-days |
| Medium | 14 | ~1 person-day | 14 person-days |
| Complex | 10 | ~2 person-days (range 1.5–3) | 20 person-days |
| **Total (1:1, unbundled)** | **46** | — | **~45 person-days** |

Bundling into the 26-deck structure in §7 removes duplicate setup/framing work per module and lets Level 2+ decks reuse Level 1 screenshots (§5), for an estimated **~25–28 person-days** total — roughly 40% lower than building every workflow as its own isolated deck.

---

## 9. Aggregate Totals

- **Total possible demonstration decks**: 46 if built 1:1 with workflows; **26 recommended** if built per §7's bundling strategy.
- **Total estimated screenshots across all decks (no reuse)**: **~490** (Level 1: 209 · Level 2: 126 · Level 3: 100 · Level 4: 55).
- **Total estimated screenshots with the reuse strategy in §5**: **~300–330** net-new captures.

---

## 10. Recommended "Day 1" Deck

**L1-01 — Risk Assessment Approval.**

Reasoning:
1. It is documented as journey #1 in the prototype's own `user-journeys.md` — the prototype's builders already treated it as the canonical starting story.
2. Risk is the domain the platform is named for; leading with it is on-brand for an Enterprise Risk Management pitch.
3. It demonstrates the platform's single most differentiating mechanic — maker-checker governance (PRSMTD `pending_action` ledger, GOV-07 single-pending-action rule, separation of duties) — in the smallest, safest, most rehearsable package (7 screens, 8 minutes, 2 personas).
4. Every other workflow in the catalogue either extends it directly (L1-02/03/04) or assumes the audience already understands the maker-checker pattern it establishes (§5).

**Alternative for a pure-executive first meeting**: open with **L2-10 (Executive/Board Dashboard Review)** as a 15-minute "here's what leadership sees" cold open, then follow immediately with L1-01 to show how the numbers on those dashboards actually get produced. Do not substitute L2-10 for L1-01 outright — a dashboard-only first meeting doesn't prove the governance mechanic that differentiates this platform from a reporting tool.

---

## 11. Recommended Sequence for Producing Remaining Decks

Follow §7 in order. Two sequencing rules matter more than the literal list:

1. **Never skip ahead into a Level 2+ deck whose prerequisite Level 1 module deck hasn't been built.** The dependency matrix in §5 is the authority for prerequisites, not deck number.
2. **Build L2-07 (Cross-Module Drill-Down) and L2-10 (Executive Dashboard) early**, immediately after the 10 module-foundation decks and before the fan-out chains (L2-01 through L2-06, L2-09). Both are cheap (no governance choreography to rehearse) and give outsized "this is one connected platform" payoff before the more intricate fan-out narratives.
3. Build **L4-01 last, always** — it is explicitly a compilation of everything else and its screenshot list is populated almost entirely by reuse from prior decks.

---

## 12. Explicit Gaps — Not Supported by the Specifications

Per the investigation's constraint to state rather than assume, the following are confirmed gaps or gate the catalogue above:

- **`docs/05-modules/`, `docs/07-workflows/`, `docs/19-roadmap/`, `docs/20-adr/` are unauthored index stubs.** Module and workflow content is not missing from the repository — it deliberately lives inline in each module's own `NN-*.md` spec (e.g. `10-risk/01-enterprise-risk-management.md` carries its own state machines). This catalogue's workflow data was sourced from those 12 module specs directly, not from `07-workflows/`. This catalogue is itself the first numbered document in `19-roadmap/`; it is a demonstration-planning artifact, not the phasing/release-plan specification `19-roadmap/README.md` still reserves for future authoring.
- **`docs/27-user-experience/` contains only its section README.** No screen, dashboard, form, or notification specification exists yet under `27-`. The prototype is explicitly named in that README as the stand-in evidence for the not-yet-authored Phases 15–18 — which is why this catalogue leans on the prototype's own `screen-inventory.md`/`user-journeys.md` rather than a UX spec that doesn't exist.
- **`docs/06-data-model/` and `docs/08-api/` are unauthored.** Data model and API surface content lives inline in each module spec instead.
- **No dedicated "board portal."** Board/executive views are the same generic dashboard components rendered under a Board-Risk-Committee persona's permission set — confirmed in both `14-reporting`/`15-analytics` (dashboard `audience` tags: `BOARD`, `EXECUTIVE`, `RISK_COMMITTEE`, `AUDIT_COMMITTEE`) and the prototype (no separate executive UI shell exists).
- **`ANALYTICS` has zero governed actions.** It is explicitly a read-only metric/KPI catalogue with no `pending_action` maker-checker workflow of its own — L1-31 and L2-10 are correctly flagged `MC=N` for this reason, not an oversight.
- **Named platform-level capability gaps** (from `docs/22-traceability/`), none of which block the workflows above but which should not be implied as present: document/object storage for evidence binaries (evidence upload is metadata-only in the prototype), a Records Retention Schedule, SIEM/automated threat-detection, ABAC policy decisioning, a scheduled-job/cron mechanism, a generic PDF/CSV export renderer, a generic BI/formula-computation engine, and platform-level (not tenant-level) DR/BCP posture (`18-deployment`, unauthored).
- **CERT-In's 6-hour cyber-incident-reporting obligation** is flagged in `24-incident-issue-capa` as explicitly out of scope, deferred to future Compliance work — do not build a demo workflow implying it exists.
- **Insurance cover against third-party losses** (SEBI-mandated) is flagged in `10-risk` as a named gap with no owning spec — not represented in any cataloged workflow.
- **Nothing in this repository is implemented outside the prototype.** No ERM module has been built into PRSMTD — `CLAUDE.md`'s PRSMTD capability inventory describes the ERM domain modules as "greenfield," and `docs/22-traceability/01-master-traceability-matrix.md` tracks specification-authorship status (`Authored` / `Closed` / `Gap` / `Not created`), not a PRSMTD build/implementation status field. The prototype is a standalone mock (in-memory + `localStorage`, no backend, no real authentication) built for demonstration purposes only, not a preview of a partially-built production system.
- **The sixth "validated journey"** (`prototype/docs/user-journeys.md` journey 6, "Reset and repeat") is a demo-utility action — the persona switcher's data reset — not a governed business lifecycle of the same kind as journeys 1–5. L4-01's "(validated journeys 1–6, combined)" tag is accurate (its own end state is "Reset demo data"), but should not be read as implying six equally-weighted business workflows.

---

## 13. Traceability

- **Business Requirement**: Enable structured, evidence-grounded customer/stakeholder demonstrations of the ERM platform's specified capabilities ahead of any implementation investment in PRSMTD.
- **Regulatory Requirement**: None directly — this is a planning artifact. Individual cataloged workflows cite the regulatory grounding of their source specs (e.g. L1-11/L1-12 trace to SEBI Master Circular audit provisions; L3-02 traces to SEBI inspection/trustee-reporting obligations referenced in `docs/reference/`).
- **PRSMTD Capability**: None consumed directly — this document analyzes ERM specifications and the ERM prototype only; PRSMTD was not read or modified for this investigation.
- **ERM Capability**: Cross-references `docs/22-traceability/01-master-traceability-matrix.md` (specification completeness) and `docs/22-traceability/02-compliance-coverage-assessment.md` (regulatory coverage); this catalogue is a new planning artifact, not itself an ERM domain capability, and is not added to those matrices.
- **Dependencies**: All 12 authored ERM module specifications; `prototype/docs/*`; `prototype/src/data/org.json`.
- **Future Work**: Produce individual demonstration decks per §7, one session at a time, in the recommended order; revisit this catalogue if new module specs (e.g. `16-ai`, `17-integrations`) are authored, or if `27-user-experience/` gains real screen specifications that supersede the prototype as the UX source of truth.
