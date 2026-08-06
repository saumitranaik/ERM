# Narration Script — Demonstration Video 01: Risk Assessment Approval

Master voice-over script. Every cue is numbered, chapter-grouped, and timed. Timing method:
professional-narrator pace of **150 words/minute (2.5 words/second)**, the standard estimation
rate for corporate voice-over, rounded to the nearest second. Running timestamps are
cumulative and assume cues play back-to-back with no gap; `timeline.md` adds the short
chapter-card pauses between chapters on top of this track. Grounding for every factual claim
is listed in `source-workflow.md` and is not repeated inline here.

**Tone direction**: experienced enterprise product trainer — warm, unhurried, confident. Not a
list-reader. Slow down noticeably on the two governance beats (Chapter 7's opening cues and
Chapter 8's approval-click cue). Total narration runtime (cue timestamps below, chapter cards
excluded): **16:20**. With chapter cards and transition pauses added (`timeline.md`), total
video runtime is **≈17:00** — see `timeline.md` for the authoritative, reconciled timing.

Voice casting note: no synthetic or recorded voice was generated for this package (see
`asset-inventory.md`). This script is the recording brief for whoever performs it.

---

## Chapter 1 — Introduction

**[00:00–00:20]** *(title card: "ERM — Enterprise Risk Management / GRC Platform" / "Demonstration 01: Risk Assessment Approval")*

> Welcome to the ERM platform demonstration series. Over the next several minutes, you'll
> watch a real risk move through governed approval — from a Risk Manager's first submission to
> a Chief Risk Officer's final sign-off. This is the pattern that governs every risk, control,
> incident, and audit finding across this platform.

---

## Chapter 2 — Enterprise Risk Management Overview

**[00:20–00:46]**

> Every regulated financial institution carries risk it cannot fully eliminate: credit risk,
> operational risk, technology risk, third-party risk. What separates a well-governed
> institution isn't the absence of risk — it's whether that risk is identified, scored, owned,
> and reviewed on a disciplined cycle, and whether every change to that picture can be
> defended to a board, a regulator, or an auditor after the fact.

**[00:46–01:05]**

> That discipline starts with a risk register — a single, structured system of record where
> every identified risk has an owner, a category, a documented likelihood and impact score,
> and a scheduled review date. Today you'll see that register inside a real, working
> application — not a slide.

**[01:05–01:34]**

> But a register on its own isn't governance — anyone could edit a score and walk away. Real
> governance requires separation of duties: the person who proposes a change to a risk's
> rating, the "maker", can never be the same person who approves it, the "checker". This
> maker-checker control is a cornerstone requirement for regulated entities — including
> SEBI-regulated Mutual Fund Asset Management Companies, the primary market this platform is
> built for today.

**[01:34–02:04]**

> This platform is built on two layers. PRSMTD is the underlying governance substrate:
> multi-tenancy, role-based access, and — critically — an append-only governance ledger that
> enforces maker-checker wherever it's needed and records every decision permanently for
> audit. ERM is the specification and module layer built on top of it: Risk, Controls,
> Compliance, Audit, Policy, Incident and CAPA, Third-Party Risk, and more — each one reusing
> that same governance engine rather than inventing its own.

**[02:04–02:38]**

> In this first demonstration, you'll watch the canonical example of that pattern end to end:
> a Risk Manager submits a periodic re-assessment on an active risk, and a Chief Risk Officer —
> a different person, holding a different role — reviews and decides it. Watch for three
> things: how separation of duties is enforced automatically, how the risk's status changes at
> each step, and how a complete, timestamped decision trail is left behind for anyone who
> later needs to answer: who approved this, and why.

*(Chapter 1+2 combined runtime: 2:38. Slightly beyond the suggested 90–120s band because the
brief's own required-content list for this section — ERM, risk registers, governance,
maker-checker, auditability, the PRSMTD/ERM relationship, and a preview of the workflow — does
not compress further without cutting one of those seven required beats. See `observations.md`.)*

---

## Chapter 3 — Meet the Personas

*(Screen: `00-login-persona-picker.png`)*

**[02:38–03:08]**

> The platform you're about to see is populated with a fictional but realistic tenant:
> Meridian Asset Management Limited, a SEBI-regulated mutual fund AMC. Every persona, risk,
> and record you'll see belongs to this one illustrative organization.

**[03:08–03:38]** *(persona card: Arjun Mehta — Risk Manager — Risk Management dept — Maker)*

> Two people carry this workflow. Arjun Mehta is Meridian's Risk Manager, sitting in the Risk
> Management department. His job is to keep the risk register current — identifying risks,
> running periodic re-assessments, and proposing changes to a risk's likelihood, impact, or
> status. He is today's maker: the person who proposes the change.

**[03:38–04:08]** *(persona card: Priya Raghunathan — Chief Risk Officer — Risk Management dept, head — Checker)*

> Priya Raghunathan is Meridian's Chief Risk Officer. She owns the independent risk management
> function and holds the checker role for the Risk module — meaning any governed change Arjun
> proposes must pass across her desk before it takes effect. She is today's checker: the
> person who decides.

**[04:08–04:26]**

> Notice that Arjun and Priya sit in the same department but hold different roles. That's
> deliberate — separation of duties is about role, not department, and the platform enforces
> it structurally, not just as a formality.

---

## Chapter 4 — Reviewing Existing Risks

*(Screens: `01-risk-register-list.png`, `02-risk-detail-active.png`)*

**[04:26–04:56]**

> Arjun signs in and lands on the Risk Register — the enterprise-wide list of every identified
> risk at Meridian, spanning fund management, operations, customer service, and more. This is
> the single source of truth the rest of the organization works from: risk owners, department
> heads, and the CRO all read from this same list rather than separate spreadsheets.

**[04:56–05:36]**

> Each row shows a risk code, its title, category, current status, and its inherent and
> residual score — the two numbers that drive prioritization. Arjun opens RSK-2026-0004:
> "Credit default of a portfolio issuer below investment grade" — a credit risk owned by the
> Investment Management function, currently Active, with an inherent score of ten and a
> residual score of eight after existing controls are taken into account.

**[05:36–06:06]**

> Notice the detail screen's action bar: Submit Re-assessment, Escalate, Propose Risk
> Acceptance, Propose Retirement. These are the governed actions available to Arjun in this
> risk's current status — and only because no other action is already pending against this
> record. That constraint matters, and you'll see why in a moment.

---

## Chapter 5 — Updating the Risk Assessment

*(Screen: `03-reassessment-justification-dialog.png`)*

**[06:06–06:36]**

> This risk's last assessment was in June, with its next review due in September. Rather than
> wait, Arjun has fresh information — a rating agency has revised its outlook on the issuer —
> and he's initiating a periodic re-assessment now.

**[06:36–07:06]**

> He clicks Submit Re-assessment. This is a governed action: the button itself tells him so,
> warning that once submitted, no further changes are allowed until a checker decides. A
> justification is mandatory — free text won't do; this is the evidentiary record an auditor
> will read later.

**[07:06–07:36]**

> Arjun writes his rationale: credit spreads have widened following a one-notch outlook
> revision, but the segregated-portfolio trigger has not been breached, and existing controls
> and heightened monitoring continue to operate effectively. He confirms the residual
> likelihood and impact are unchanged. This is the maker's case — the reasoning a checker will
> independently evaluate, not simply rubber-stamp.

---

## Chapter 6 — Submitting for Approval

*(Screen: `04-risk-under-review-pending.png`)*

**[07:36–07:54]**

> Arjun clicks "Submit for approval." Watch the status badge: Active becomes Under Review, and
> a second badge appears — Awaiting checker.

**[07:54–08:34]**

> This is the governance ledger at work. Behind the scenes, the platform has created a pending
> action record, linked to this risk, and — critically — it will allow exactly one pending
> action per record at a time. This is a rule the platform calls GOV-07, and you can see its
> effect immediately: every action button that was available a moment ago has disappeared.
> Arjun cannot submit anything further against this risk, and he cannot approve his own
> submission. The system tells him so directly: separation of duties requires a different
> checker to decide it.

**[08:34–08:48]**

> The risk is now frozen in a governed, in-flight state until someone with the right authority
> makes a decision.

---

## Chapter 7 — Governance Review

*(Screen: `05-checker-queue-pending-item.png`. Pacing note: this is the video's primary
governance beat — slow the narration noticeably through Cues 7.1–7.3.)*

**[08:48–09:00]**

> This is the moment worth pausing on, because it's the heart of enterprise governance:
> maker-checker control.

**[09:00–09:48]**

> Why does separation of duties exist at all? Because a single person acting alone — however
> well-intentioned — is a single point of failure. Errors go uncaught. Pressure to hit a
> number, close a quarter, or avoid an uncomfortable conversation can quietly bias a
> self-approved decision. Regulators require independent review of risk management activity
> precisely because self-review cannot be trusted to catch what an independent reviewer will.
> The platform enforces this structurally: the same rule that blocked Arjun from deciding his
> own submission a moment ago would block anyone, on any record, in any module built on this
> governance ledger.

**[09:48–10:18]** *(persona re-entry card: Priya Raghunathan — Chief Risk Officer — now acting as checker)*

> We now switch personas to Priya Raghunathan, Meridian's Chief Risk Officer — the checker you
> met earlier. Because she holds the checker role and did not create this submission, the
> platform grants her exactly the authority Arjun didn't have a moment ago: the ability to
> decide it.

**[10:18–11:00]**

> Priya opens Approvals — a single, cross-module queue that surfaces every pending action
> waiting on a role she holds, regardless of which module it came from. Her queue already
> carries several other pending items; Arjun's new submission has landed at the top. This is
> what auditors value most about this design: every governed decision, across every module,
> flows through one traceable queue and one ledger — nothing is approved by side channel,
> email, or verbal sign-off.

---

## Chapter 8 — Checker Approval

*(Screen: `06-approve-decision-dialog.png`)*

**[11:00–11:36]**

> On the pending item, Priya can see exactly what Arjun submitted: his justification, in full,
> with a timestamp. She has three options: Approve, Reject, or Return for rework — this last
> option sends it back to Arjun with feedback rather than forcing an outright rejection, useful
> when the case is close but incomplete.

**[11:36–12:12]**

> Priya clicks Approve. A decision dialog opens, asking for an optional comment — optional
> here because approval doesn't require justification the way a rejection or a return does,
> though a disciplined checker adds one anyway. Priya writes that she reviewed the
> credit-spread data, confirmed the segregated-portfolio trigger has not been breached, and
> confirms the existing control remains effective. She concurs with the re-assessment.

**[12:12–12:46]**

> She clicks "Confirm approve." This is the moment the governance ledger closes the loop: the
> pending action is marked decided, the platform's projection logic updates the underlying
> risk record, and both the maker's justification and the checker's decision comment are
> written permanently to the record's history. Arjun will also receive a notification that his
> submission was decided — closing the loop back to the person who started it.

---

## Chapter 9 — Audit Trail

*(Screen: `07-risk-detail-approved-decision-history.png`)*

**[12:46–13:18]**

> Back on the risk record's Approvals tab, the full decision is now visible as a single,
> permanent entry: Risk Reassessment — Approved. Maker: Arjun Mehta, Risk Manager, with his
> timestamp. Checker: Priya Raghunathan, Chief Risk Officer, with hers. Both the original
> justification and the final decision comment are preserved verbatim, side by side.

**[13:18–13:54]**

> This is what an internal auditor or a SEBI inspection would actually look for: not just that
> a risk score changed, but who proposed the change, why, who independently reviewed it, what
> they said, and exactly when each step happened. Nothing here can be edited after the fact —
> the governance ledger this platform is built on is append-only by design. A new correction is
> a new entry, never a silent overwrite. That immutability is what turns a risk register from a
> spreadsheet anyone could quietly edit into a defensible system of record.

---

## Chapter 10 — Final Business Outcome

*(Screen: `07-risk-detail-approved-decision-history.png`, reused — see `asset-inventory.md`)*

**[13:54–14:26]**

> The risk itself is back to Active — re-assessment doesn't necessarily mean the picture
> changed, and here it didn't: residual likelihood and impact were reconfirmed, not revised.
> What changed is something just as important: the organization now has fresh, independently
> reviewed evidence that this risk is still correctly scored, current as of today rather than a
> stale June assessment, with a documented trail proving the review actually happened.

**[14:26–14:50]**

> That's the real business outcome of a maker-checker workflow. It's not paperwork for its own
> sake — it's the difference between an organization that can say "we manage this risk" and one
> that can prove it, on demand, to a board committee or a regulator, months or years later.

---

## Ending

**[14:50–15:24]**

> You've just watched the platform's most fundamental governance pattern end to end: a maker
> proposes, a checker independently decides, and every step is captured permanently for audit.
> This same pattern — not a different one per module — is what will govern control testing,
> compliance assessments, audit findings, policy publication, incident closure, and every other
> approval across this platform, because it all runs on the same governance ledger you saw
> today.

**[15:24–15:56]**

> For a Board or CRO, this is the assurance that risk data is trustworthy. For a CISO or
> Compliance Officer, this is a control you can point to in an audit. For an implementation
> team, this is one governance engine to build once and reuse everywhere, not a bespoke
> approval flow per module.

**[15:56–16:20]**

> This concludes Demonstration 01. Future demonstrations in this series will walk through
> control exception handling, compliance assessment approval, and audit finding closure — each
> one exercising this same governed pattern in a different part of the platform.

---

## Timing note

The cue timestamps above are computed at a fixed 150 words/minute and are directional —
accurate relative ordering and pacing, not frame-exact — since no audio was actually recorded
against them. A real narrator will run faster or slower than 150 wpm depending on delivery, and
should re-time chapter cards and on-screen callouts (`timeline.md`, `scene-list.md`) against
their own recorded track rather than this estimate. See `asset-inventory.md` for what was and
was not produced in this pass.

## Traceability

- **Business Requirement**: Provide the recording brief for Demonstration Video 01's voice-over.
- **Regulatory Requirement**: None directly — narration content is grounded in
  `source-workflow.md`'s cited specs, not itself a regulatory artifact.
- **PRSMTD Capability**: None — this is a documentation deliverable, not a platform capability.
- **ERM Capability**: N/A (demonstration collateral, not a module spec).
- **Dependencies**: `source-workflow.md`, `scene-list.md`, `timeline.md`, `chapters.md`.
- **Future Work**: Record against this script (see `asset-inventory.md` §Not Produced) once a
  voice-over resource and video assembly tooling are available.
