# Observations — Demonstration Video 02: Risk Treatment Plan Approval

Recorded during production of this package, 2026-08-07. Per repository constraints, **nothing
below was fixed as a side effect of video production** — this is an observation log only,
covering the prototype/specification and this package's own production process (framework §22).

## Prototype defects

**None encountered.** `RSK-2026-0004`'s Relationships tab correctly moved from "Treatment
Plans — 0" to "Treatment Plans — 1" after the governed action was approved; `TRT-2026-0009`
transitioned `PROPOSED → PROPOSED (Awaiting checker) → APPROVED` exactly as
`prototype/src/modules/risk.ts`'s `TREATMENT_APPROVAL` workflow action specifies; GOV-07
correctly withdrew the Edit / Submit for Approval / Cancel action bar the instant the plan was
submitted; separation of duties was enforced structurally (Arjun could not see an Approve
option on his own submission, and it only became decidable after switching to Priya); the
maker-checker decision record rendered completely and correctly on the treatment plan's own
Approvals tab, and the linked-risk record picked up the new Treatment Plan on its own
Relationships tab without any manual refresh or re-navigation.

## Inconsistencies

**None encountered** between the running prototype's behavior and
`docs/10-risk/01-enterprise-risk-management.md`'s FR-06 / FR-08 / `RISK_TREATMENT_APPROVAL`
definitions.

## Specification gaps

**None discovered specific to this workflow.**

## Production choices flagged for the manifest's own validation pass

Per `demos/video-production-manifest.md` §21's own note that "the first video produced after
this manifest is a validation pass on the manifest's own mechanics" — this section records
where this session made a judgment call the framework did not fully pre-specify:

1. **The Governance Review chapter (framework §13 item 4) was condensed, not full-length**,
   unlike Video 01's own centerpiece treatment of the same chapter. The framework's chapter
   formula explicitly shortens the Domain/Module Overview chapter for a returning module
   (§13 item 2) but does not say the same about Governance Review, which is listed as
   "included once per video" without a shortening clause. This session's judgment: the required
   explanatory beat (why separation of duties exists) was kept, but written more concisely,
   reasoning that an audience the catalogue's own dependency matrix already assumes has seen
   Video 01 (L1-02 "builds on" L1-01) does not need the full philosophical treatment repeated
   verbatim. Flagged here as a deliberate, disclosed choice rather than a silent deviation, per
   `narration-script.md`'s own tone-direction note — a future session or the manifest's own
   Amendment Log should confirm or correct this interpretation before Video 03 repeats it.
2. **Two screenshots (`00`, `01`) were reused verbatim from Video 01 rather than recaptured**,
   per the framework's own cross-video reuse mechanism (§20, §26) and the manifest's own §26
   suggestion to reuse `RSK-2026-0004`. This is the first time that mechanism has actually been
   exercised in the series (Video 01 had no prior video to reuse from) — confirmed working as
   the framework describes it, with the reuse explicitly cited in `source-workflow.md` and
   `timeline.md` rather than silently re-typed.
3. **The persona-switcher dropdown (Scene 12) was again synthesized, not separately
   screenshotted**, following Video 01 Scene 22's own precedent exactly (an honest UI-detail
   adaptation anchored at the real user-menu coordinates, not a fabricated screen). This is a
   repeat of Video 01's own flagged item, not a new gap — noted here so a future session
   considers whether a dedicated persona-switcher screenshot is worth capturing once, for reuse
   across the rest of the series, rather than re-synthesizing it in every video (a candidate for
   `demos/_shared/` once that directory is actually created, per framework §19).
4. **Subtitle timing is a disciplined estimate, not a measurement**, using the identical
   word-count-weighted proportional method Video 01 established (framework §5) — 108 cues
   generated programmatically from `narration-script.md`'s cue text and `timeline.md`'s video
   windows, snapped to each cue's known end second. Necessarily approximate until a real
   narrator's recorded track exists to re-time against.
5. **This video's own narration runtime (6:12) and total runtime (6:47) land inside the
   framework's 6–10 minute L1 (Simple) band without exceeding it**, unlike Video 01's 16:55 —
   confirming the manifest's own §26 prediction that a second video in an already-introduced
   module family would trend toward the nominal band once the one-time platform-orientation
   content is framework-mandated to shorten (framework §20, Video 01 Lessons Learned item 5).
   This is the series' first data point for that prediction; useful evidence for §17's still-
   unestimated per-video effort/runtime model once 2–3 more videos exist.

## Traceability

- **Workflow executed**: L1-02, `docs/19-roadmap/01-demonstration-workflow-catalogue.md` §4.1.
- **Journey followed**: No `prototype/docs/user-journeys.md` entry exists for this workflow;
  grounded directly against `docs/10-risk/01-enterprise-risk-management.md` and the running
  prototype's own `treatment-plans` entity configuration instead — see `source-workflow.md`.
- **Specification exercised**: `docs/10-risk/01-enterprise-risk-management.md` (governed
  `RISK_TREATMENT_APPROVAL` action, FR-06, FR-08).
- **Prototype build exercised**: `prototype/` as of 2026-08-07, unmodified.
- **Prior deliverable cross-checked**: `demos/video-01-risk-assessment-approval/` (screenshot
  reuse source and production-method precedent).
