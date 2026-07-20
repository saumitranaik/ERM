# 12 — Controls

## Purpose

Internal Controls and Control Testing capability specifications: the control library,
control-to-risk/obligation mapping, and testing workflows.

## What belongs here

- Control library data model (control type, frequency, owner, design vs. operating
  effectiveness)
- Control-to-risk mapping (links [`../10-risk/`](../10-risk/)) and control-to-obligation
  mapping (links [`../11-compliance/`](../11-compliance/))
- Control testing workflow: sampling, evidence capture, pass/fail, exception/CAPA linkage
- Control framework alignment (e.g., COSO-style categorization) as configurable metadata,
  not hardcoded

## Cross-references

- [`../10-risk/`](../10-risk/), [`../11-compliance/`](../11-compliance/) — what controls treat
- [`../13-audit/`](../13-audit/) — audit's use of control testing evidence
- [`../07-workflows/`](../07-workflows/) — control testing state machine

## Status

- [`01-controls-management.md`](01-controls-management.md) — authored. Covers the control
  library, control taxonomy (SEBI_AMC seed families), preventive/detective/corrective and
  manual/automated/IT-dependent-manual classification, control ownership, lifecycle, design
  and operating effectiveness, control testing, evidence management, control exceptions,
  and the security/authorization/audit/reporting/API surface for the `CONTROLS` module. This
  is the repository's second authoritative specification; it activates `10-risk`'s opaque
  `RiskTreatmentPlan → Control` reference without modifying that document, and is the
  canonical source for the Controls domain and data model until `../04-domain-model/` and
  `../06-data-model/` are authored.
