# Observations — ERM Summary Video (S01)

Append-only log (framework §22).

## 2026-10-17

1. **Prototype display inconsistency (not changed)**: on the Risk detail page for RSK-2026-0001 the "Scoring Matrix Version" field shows "—" while the inherent and residual matrix versions below it show `illustrative-1`. The risk predates a single combined matrix field; the per-dimension fields are the authoritative ones. The video does not dwell on this field. Candidate for a future prototype fix; not part of this task.
2. **Caption bar opacity**: first render let page controls show through the caption bar (visible behind "Logging" on the log-risk form). Fixed by raising the bar's opacity; re-rendered.
3. **Claims deliberately scoped**: the video says approval rules "run in the browser only", the matrix is "illustrative", and the system is "not a production system". It makes no claim about server enforcement, transactions or AMC-approved policy.
4. **Silent Version 1**: no narration or music, same standing gap as Videos 01–02 (framework §14, §15, §17).
5. **Placement**: the summary sits outside the manifest's 46-workflow list; see the catalogue for how its identifier (S01) was chosen so Videos 01–46 keep their cited identifiers.

## Traceability
- **Business Requirement**: QA record for S01.
- **Regulatory Requirement**: none.
- **PRSMTD Capability**: none.
- **ERM Capability**: ERM Summary Video (S01).
- **Dependencies**: [`source-workflow.md`](source-workflow.md).
- **Future Work**: item 1 (prototype field).
