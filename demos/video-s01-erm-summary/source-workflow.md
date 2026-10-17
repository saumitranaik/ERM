# Source and Grounding — ERM Summary Video (S01)

This is an overview video, not a catalogue workflow (framework §2 rule 7 scopes "one workflow, one package" to workflows). It has no `L#-##` identifier. Every claim in its captions is grounded below; nothing was captured except by opening existing screens of the unmodified prototype.

## Scope

An honest, high-level introduction: what ERM is, the risk register and scoring, two-person approval, the breadth of modules, and the prototype's limits. It does **not** demonstrate a workflow end to end (Video 01 onward do) and does **not** show risk logging in detail (that is S02, not started).

## Claim → source

| Caption claim | Source |
|---|---|
| ERM is a prototype of an Enterprise Risk Management / GRC platform; designed first for a SEBI-regulated mutual fund AMC | `CLAUDE.md` ("What this repository is"); `prototype/package.json` description ("UX Reference Prototype — specification validation only, not production code") |
| Fictional company Meridian Asset Management Ltd.; sample data in the browser; not production | Login screen text (`prototype/app/login/page.tsx`: "all data is fictional"); footer "Mock data only — not production"; state in `localStorage` (`prototype/src/lib/store.ts`, defects doc "Prototype-only limitations") |
| Sign in by choosing a sample person; no real authentication; roles decide access | `prototype/src/lib/session.ts` (mock session); login page text |
| Risk dashboard KPIs, heat map, "no AMC-approved matrix configured" | Screenshot `02`; on-screen legend text; `prototype/docs/defects-and-observations.md` item D |
| Register columns | Screenshot `03`; `prototype/src/modules/risk.ts` |
| Owner, inherent/residual scores, provenance (assessment + matrix version) | Screenshot `04`; `prototype/src/lib/riskProjection.ts` |
| Assessment keeps a scoring snapshot and matrix version | Screenshot `05`; `riskProjection.ts` `snapshotAssessment` |
| New risks logged as drafts; logging is not approval | Screenshot `06` (page text: "Logging is not approval: it stays editable…"); `prototype/tests/e2e/risk-logging.e2e.mjs` |
| Re-assessment, acceptance, retirement are proposed, not applied directly | Screenshot `04` action buttons (Submit Re-assessment, Propose Risk Acceptance, Propose Retirement) |
| Checker sees justification; approve / reject / return | Screenshot `07`; `prototype/src/lib/governance.ts` |
| Maker cannot decide own request; risk owner cannot approve/reject; decisions in history | `prototype/src/lib/decisionPolicy.ts`; `governance.ts` history events; E2E checks |
| Rules run in the browser only; a production platform would enforce on a server | `defects-and-observations.md` ("nothing client-side is a trusted security boundary") |
| Eleven modules | `prototype/src/lib/moduleCatalog.ts` (RISK, CONTROLS, COMPLIANCE, AUDIT, SECURITY, POLICY, INCIDENT, TPR, BCP, REPORTING, ANALYTICS) |
| Controls / Compliance / Audit / Incident / Analytics dashboard contents | Screenshots `08`–`12` |
| Scoring values are illustrative, not AMC-approved | `riskMatrix.ts` (`ILLUSTRATIVE`); defects doc item D |

## Deliberate omissions

No claim of server-side enforcement, database transactions, production security, regulatory compliance, or AMC-approved scoring. No spoken narration or music.

## Traceability
- **Business Requirement**: Give stakeholders a short, honest overview of the ERM prototype before the per-workflow videos.
- **Regulatory Requirement**: none.
- **PRSMTD Capability**: none directly; the prototype mocks maker-checker (PRSMTD `system.md` governance), described only as a browser-side mock.
- **ERM Capability**: ERM Summary Video (S01) — see [`../ERM_Video_Catalogue_and_Descriptions.md`](../ERM_Video_Catalogue_and_Descriptions.md).
- **Dependencies**: running `prototype/`, `docs/10-risk/01-enterprise-risk-management.md`.
- **Future Work**: spoken narration; S02 risk-logging video.
