# Scene List — ERM Summary Video (S01)

One row per segment. Camera values are (centre-x, centre-y, zoom). Crossfade 0.5 s between segments; a rounded accent outline marks the highlighted region where listed.

| # | Start | Duration | Kind | Screenshot / card | Camera start → end | Highlight (px) |
|---|---|---|---|---|---|---|
| 1 | 0:00 | 6.0s | title | ERM | — | — |
| 2 | 0:06 | 3.0s | card | What ERM Is | — | — |
| 3 | 0:09 | 30.0s | scene | 01-platform-dashboard.png | (0.5, 0.5, 1.0) → (0.5, 0.42, 1.12) | — |
| 4 | 0:39 | 17.7s | scene | 00-login-persona-picker.png | (0.5, 0.45, 1.0) → (0.5, 0.42, 1.25) | — |
| 5 | 0:57 | 3.0s | card | The Risk Register | — | — |
| 6 | 1:00 | 23.6s | scene | 02-risk-dashboard-heatmap.png | (0.5, 0.5, 1.0) → (0.38, 0.45, 1.3) | (265, 380, 1071, 786) |
| 7 | 1:23 | 9.4s | scene | 03-risk-register.png | (0.5, 0.5, 1.0) → (0.55, 0.3, 1.2) | — |
| 8 | 1:33 | 19.9s | scene | 04-risk-detail-scores-and-provenance.png | (0.5, 0.5, 1.0) → (0.72, 0.38, 1.45) | (1090, 340, 1896, 698) |
| 9 | 1:53 | 11.2s | scene | 05-assessment-scoring-snapshot.png | (0.5, 0.5, 1.0) → (0.7, 0.4, 1.4) | — |
| 10 | 2:04 | 16.7s | scene | 06-log-risk-form.png | (0.5, 0.5, 1.0) → (0.55, 0.45, 1.2) | — |
| 11 | 2:21 | 3.0s | card | Two-Person Approval | — | — |
| 12 | 2:24 | 8.5s | scene | 04-risk-detail-scores-and-provenance.png | (0.8, 0.12, 1.5) → (0.78, 0.1, 1.7) | (1291, 118, 1896, 152) |
| 13 | 2:32 | 36.8s | scene | 07-checker-approvals-queue.png | (0.5, 0.5, 1.0) → (0.5, 0.3, 1.35) | (290, 293, 1870, 473) |
| 14 | 3:09 | 3.0s | card | The Wider Platform | — | — |
| 15 | 3:12 | 12.2s | scene | 01-platform-dashboard.png | (0.5, 0.5, 1.0) → (0.55, 0.78, 1.5) | (265, 675, 1896, 955) |
| 16 | 3:24 | 7.6s | scene | 08-controls-dashboard.png | (0.5, 0.5, 1.0) → (0.4, 0.5, 1.2) | — |
| 17 | 3:32 | 7.2s | scene | 09-compliance-dashboard.png | (0.5, 0.5, 1.0) → (0.55, 0.5, 1.2) | — |
| 18 | 3:39 | 5.3s | scene | 10-audit-dashboard.png | (0.5, 0.5, 1.0) → (0.55, 0.5, 1.2) | — |
| 19 | 3:44 | 6.7s | scene | 11-incident-dashboard.png | (0.5, 0.5, 1.0) → (0.55, 0.5, 1.2) | — |
| 20 | 3:51 | 13.1s | scene | 12-analytics-dashboard.png | (0.5, 0.5, 1.0) → (0.5, 0.35, 1.25) | — |
| 21 | 4:04 | 3.0s | card | Maturity and Limits | — | — |
| 22 | 4:07 | 28.6s | plate | What This Prototype Is — and Is Not | — | — |
| 23 | 4:36 | 6.0s | outro | ERM Summary | — | — |

## Traceability
- **Business Requirement**: Give stakeholders a short, honest overview of what the ERM prototype is and shows, before the per-workflow videos.
- **Regulatory Requirement**: none — an overview video; no regulatory claim is made beyond the SEBI-regulated AMC target context in `CLAUDE.md`.
- **PRSMTD Capability**: none directly — the video shows the reference prototype (`../../prototype/`); platform mechanisms are referenced only as "would be enforced on a server in production".
- **ERM Capability**: ERM Summary Video (S01), see [`../ERM_Video_Catalogue_and_Descriptions.md`](../ERM_Video_Catalogue_and_Descriptions.md).
- **Dependencies**: [`source-workflow.md`](source-workflow.md), [`project/content.py`](project/content.py), the running prototype.
- **Future Work**: spoken narration and music (not available); the risk-logging video (S02) follows once this video is accepted.
