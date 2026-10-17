# Narration / Caption Script — ERM Summary Video (S01)

Silent Version 1: captions function as the narration (no voice talent or licensed music is available — framework §17). Times are computed from `project/content.py` by `project/generate_docs.py`, never hand-typed. Reading pace 2.2 words/second. **Total runtime: 4:42 (281.6s).** Every claim is grounded in [`source-workflow.md`](source-workflow.md).

## Intro
**[0:00]** *(title card: “ERM” / “Enterprise Risk Management — A Prototype Overview”)* — no caption.

## Chapter 1 — What ERM Is
*Chapter card: “What ERM Is” / “A prototype built from written specifications”*

**[0:10–0:17]**

> ERM is a prototype of an Enterprise Risk Management and governance, risk and compliance platform.

**[0:17–0:28]**

> It is designed first for a SEBI-regulated mutual fund management company in India. Here it runs on a fictional company: Meridian Asset Management Ltd.

**[0:29–0:38]**

> Everything you will see is sample data held in a web browser. This is a demonstration prototype, not a production system.

**[0:40–0:46]**

> You sign in by choosing a sample person. There is no real authentication.

**[0:46–0:56]**

> Each person has a role, such as Risk Manager or Chief Risk Officer, and that role decides what they can do.

## Chapter 2 — The Risk Register
*Chapter card: “The Risk Register” / “Scoring, ownership and traceability”*

**[1:00–1:09]**

> Risk Management is the core module. Its dashboard shows open risks, escalations, indicators in red and overdue reviews.

**[1:09–1:14]**

> The heat map places each risk by likelihood and impact.

**[1:14–1:22]**

> The scoring matrix is illustrative. The screen itself states that no AMC-approved matrix is configured in this prototype.

**[1:24–1:32]**

> The register lists every risk with its category, owner, inherent and residual scores, review date and status.

**[1:33–1:41]**

> Each risk has a named owner, an inherent score before controls, and a residual score after controls.

**[1:42–1:52]**

> When a score comes from an approved assessment, the risk shows which assessment, and which version of the scoring matrix, produced it.

**[1:53–2:03]**

> An assessment is a dated scoring event. It keeps a snapshot of the scores and the matrix version that produced them.

**[2:05–2:12]**

> New risks are logged as drafts through a form. Logging a risk does not approve it.

**[2:12–2:20]**

> Approval is a separate step, and later videos in this series cover each workflow in detail.

## Chapter 3 — Two-Person Approval
*Chapter card: “Two-Person Approval” / “Maker and checker”*

**[2:24–2:31]**

> Significant changes, such as re-assessment, risk acceptance or retirement, are proposed rather than applied directly.

**[2:33–2:40]**

> A second person, here the Chief Risk Officer, sees each pending request with the submitter's justification.

**[2:41–2:46]**

> They can approve it, reject it, or return it for rework.

**[2:46–2:59]**

> The person who submitted a request cannot decide it, and a risk's owner cannot approve or reject changes to that risk. Decisions are recorded in the record's history.

**[2:59–3:08]**

> In this prototype those rules run in the browser only. A production platform would enforce them on a server.

## Chapter 4 — The Wider Platform
*Chapter card: “The Wider Platform” / “Eleven modules, one shared pattern”*

**[3:13–3:23]**

> Risk is one of eleven modules: risk, controls, compliance, audit, security, policy, incidents and corrective actions, third-party risk, business continuity, reporting and analytics.

**[3:25–3:31]**

> Controls tracks the library of safeguards, how well they operate, and open exceptions.

**[3:32–3:38]**

> Compliance tracks obligations, a compliance calendar, and the pipeline of regulatory changes.

**[3:40–3:43]**

> Audit follows engagements and open findings.

**[3:45–3:50]**

> Incident management records incidents by severity, alongside issues and corrective actions.

**[3:52–3:56]**

> Analytics brings key indicators together, with thresholds and trends.

**[3:56–4:03]**

> Every module follows the same pattern: dashboards, registers, record pages and the shared approval queue.

## Chapter 5 — Maturity and Limits
*Chapter card: “Maturity and Limits” / “What to take away”*

**[4:08–4:15]**

> To be clear about maturity: this is a reference prototype for checking specifications and screens.

**[4:15–4:26]**

> Its data is fictional and kept in the browser, its scoring matrix is illustrative, and its approval rules are not enforced by a server.

**[4:26–4:35]**

> It is not a production system, and no scoring rule shown here has been approved by any AMC.

## Closing
**[4:36]** *(closing card: “ERM Summary” / “A reference prototype on sample data — not a production system”)* — no caption.

## Traceability
- **Business Requirement**: Give stakeholders a short, honest overview of what the ERM prototype is and shows, before the per-workflow videos.
- **Regulatory Requirement**: none — an overview video; no regulatory claim is made beyond the SEBI-regulated AMC target context in `CLAUDE.md`.
- **PRSMTD Capability**: none directly — the video shows the reference prototype (`../../prototype/`); platform mechanisms are referenced only as "would be enforced on a server in production".
- **ERM Capability**: ERM Summary Video (S01), see [`../ERM_Video_Catalogue_and_Descriptions.md`](../ERM_Video_Catalogue_and_Descriptions.md).
- **Dependencies**: [`source-workflow.md`](source-workflow.md), [`project/content.py`](project/content.py), the running prototype.
- **Future Work**: spoken narration and music (not available); the risk-logging video (S02) follows once this video is accepted.
