# demos/

Stakeholder demonstration deliverables built from the ERM specifications and the reference
prototype (`../prototype/`). This directory is a deliberate, narrowly-scoped exception to the
specification-first `docs/` tree — the same category of exception `../prototype/` itself is —
established explicitly with the user at Session 22 (see `../docs/roadmap.md`, Assumption 52).
Nothing here is an authoritative ERM specification; every document in this directory carries its
own `CLAUDE.md`-style Traceability block back to the specification(s) and prototype state it
demonstrates.

## Read first

**[`video-production-framework.md`](video-production-framework.md)** — the production
architecture, standards, reusable templates, and governance for every future demonstration
video in this series. Read this before starting any new video deliverable; it exists precisely
so that convention (naming, timing, visual language, honesty about tooling gaps) is not
re-derived from scratch each time.

## Contents

| Deliverable | Type | Workflow | Status |
|---|---|---|---|
| [`deck-01-risk-assessment-approval/`](deck-01-risk-assessment-approval/) | Static slide deck (`.pptx`) | L1-01, Risk Assessment Approval | Complete |
| [`video-01-risk-assessment-approval/`](video-01-risk-assessment-approval/) | Narrated video production package | L1-01, Risk Assessment Approval | Full production package complete; final `.mp4` not rendered (see its own `asset-inventory.md` — no video encoder, TTS, compositing tool, or licensed music available in this environment) |

Both deliverables cover the same catalogue workflow
(`../docs/19-roadmap/01-demonstration-workflow-catalogue.md`, row `L1-01`) in two different
media, produced in two separate sessions (22 and 23) — the deck first, the video second, each an
independent capture pass against the running prototype.

## Workflow source

Every deliverable here traces back to
[`../docs/19-roadmap/01-demonstration-workflow-catalogue.md`](../docs/19-roadmap/01-demonstration-workflow-catalogue.md),
which catalogues 46 candidate demonstration workflows across four complexity tiers (L1–L4) and
recommends a build order. `video-production-framework.md` is what makes that catalogue
producible as a consistent video series rather than 46 independently-improvised efforts.

## Repository constraints that apply here

- `../prototype/` and PRSMTD are read-only from every deliverable in this directory — nothing
  here ever edits either.
- No authoritative `docs/` specification is modified by demo production.
- A published deliverable is not silently edited after the fact; corrections are new, dated
  entries in that deliverable's own observation log.
