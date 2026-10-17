"""
Single source of truth for the ERM Summary Video (S01): chapters, scenes, captions, highlight boxes.

Everything the generated documents (narration-script.md, chapters.md, timeline.md, scene-list.md,
subtitles.srt) and the renderer show comes from this file, so the documents cannot drift from the
video. Every factual claim is grounded in source-workflow.md. Coordinates are pixels on the
1920x1080 screenshots in ../screenshots/.
"""

READING_WPS = 2.2        # silent film: viewer reads captions while watching (PRSMTD explainer used 2.05)
MIN_CUE_S = 3.6
CUE_GAP_S = 0.5
SCENE_LEAD_S = 0.8       # pause before the first caption of a scene
SCENE_TAIL_S = 0.9
INTRO_S = 6.0
CARD_S = 3.0
OUTRO_S = 6.0

TITLE = ("ERM", "Enterprise Risk Management — A Prototype Overview")
OUTRO = ("ERM Summary", "A reference prototype on sample data — not a production system")

# Each scene: shot, camera start/end (cx, cy, scale), optional highlight box (px), cues.
CHAPTERS = [
    {
        "title": "What ERM Is",
        "subtitle": "A prototype built from written specifications",
        "scenes": [
            {
                "shot": "01-platform-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.5, 0.42, 1.12)),
                "highlight": None,
                "cues": [
                    "ERM is a prototype of an Enterprise Risk Management and governance, risk and compliance platform.",
                    "It is designed first for a SEBI-regulated mutual fund management company in India. Here it runs on a fictional company: Meridian Asset Management Ltd.",
                    "Everything you will see is sample data held in a web browser. This is a demonstration prototype, not a production system.",
                ],
            },
            {
                "shot": "00-login-persona-picker.png", "cam": ((0.5, 0.45, 1.0), (0.5, 0.42, 1.25)),
                "highlight": None,
                "cues": [
                    "You sign in by choosing a sample person. There is no real authentication.",
                    "Each person has a role, such as Risk Manager or Chief Risk Officer, and that role decides what they can do.",
                ],
            },
        ],
    },
    {
        "title": "The Risk Register",
        "subtitle": "Scoring, ownership and traceability",
        "scenes": [
            {
                "shot": "02-risk-dashboard-heatmap.png", "cam": ((0.5, 0.5, 1.0), (0.38, 0.45, 1.3)),
                "highlight": (265, 380, 1071, 786),
                "cues": [
                    "Risk Management is the core module. Its dashboard shows open risks, escalations, indicators in red and overdue reviews.",
                    "The heat map places each risk by likelihood and impact.",
                    "The scoring matrix is illustrative. The screen itself states that no AMC-approved matrix is configured in this prototype.",
                ],
            },
            {
                "shot": "03-risk-register.png", "cam": ((0.5, 0.5, 1.0), (0.55, 0.3, 1.2)),
                "highlight": None,
                "cues": [
                    "The register lists every risk with its category, owner, inherent and residual scores, review date and status.",
                ],
            },
            {
                "shot": "04-risk-detail-scores-and-provenance.png", "cam": ((0.5, 0.5, 1.0), (0.72, 0.38, 1.45)),
                "highlight": (1090, 340, 1896, 698),
                "cues": [
                    "Each risk has a named owner, an inherent score before controls, and a residual score after controls.",
                    "When a score comes from an approved assessment, the risk shows which assessment, and which version of the scoring matrix, produced it.",
                ],
            },
            {
                "shot": "05-assessment-scoring-snapshot.png", "cam": ((0.5, 0.5, 1.0), (0.7, 0.4, 1.4)),
                "highlight": None,
                "cues": [
                    "An assessment is a dated scoring event. It keeps a snapshot of the scores and the matrix version that produced them.",
                ],
            },
            {
                "shot": "06-log-risk-form.png", "cam": ((0.5, 0.5, 1.0), (0.55, 0.45, 1.2)),
                "highlight": None,
                "cues": [
                    "New risks are logged as drafts through a form. Logging a risk does not approve it.",
                    "Approval is a separate step, and later videos in this series cover each workflow in detail.",
                ],
            },
        ],
    },
    {
        "title": "Two-Person Approval",
        "subtitle": "Maker and checker",
        "scenes": [
            {
                "shot": "04-risk-detail-scores-and-provenance.png", "cam": ((0.8, 0.12, 1.5), (0.78, 0.1, 1.7)),
                "highlight": (1291, 118, 1896, 152),
                "cues": [
                    "Significant changes, such as re-assessment, risk acceptance or retirement, are proposed rather than applied directly.",
                ],
            },
            {
                "shot": "07-checker-approvals-queue.png", "cam": ((0.5, 0.5, 1.0), (0.5, 0.3, 1.35)),
                "highlight": (290, 293, 1870, 473),
                "cues": [
                    "A second person, here the Chief Risk Officer, sees each pending request with the submitter's justification.",
                    "They can approve it, reject it, or return it for rework.",
                    "The person who submitted a request cannot decide it, and a risk's owner cannot approve or reject changes to that risk. Decisions are recorded in the record's history.",
                    "In this prototype those rules run in the browser only. A production platform would enforce them on a server.",
                ],
            },
        ],
    },
    {
        "title": "The Wider Platform",
        "subtitle": "Eleven modules, one shared pattern",
        "scenes": [
            {
                "shot": "01-platform-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.55, 0.78, 1.5)),
                "highlight": (265, 675, 1896, 955),
                "cues": [
                    "Risk is one of eleven modules: risk, controls, compliance, audit, security, policy, incidents and corrective actions, third-party risk, business continuity, reporting and analytics.",
                ],
            },
            {
                "shot": "08-controls-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.4, 0.5, 1.2)),
                "highlight": None,
                "cues": ["Controls tracks the library of safeguards, how well they operate, and open exceptions."],
            },
            {
                "shot": "09-compliance-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.55, 0.5, 1.2)),
                "highlight": None,
                "cues": ["Compliance tracks obligations, a compliance calendar, and the pipeline of regulatory changes."],
            },
            {
                "shot": "10-audit-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.55, 0.5, 1.2)),
                "highlight": None,
                "cues": ["Audit follows engagements and open findings."],
            },
            {
                "shot": "11-incident-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.55, 0.5, 1.2)),
                "highlight": None,
                "cues": ["Incident management records incidents by severity, alongside issues and corrective actions."],
            },
            {
                "shot": "12-analytics-dashboard.png", "cam": ((0.5, 0.5, 1.0), (0.5, 0.35, 1.25)),
                "highlight": None,
                "cues": [
                    "Analytics brings key indicators together, with thresholds and trends.",
                    "Every module follows the same pattern: dashboards, registers, record pages and the shared approval queue.",
                ],
            },
        ],
    },
]

# Closing text plate: what this is and is not.
CLOSING_PLATE = {
    "title": "What This Prototype Is — and Is Not",
    "bullets": [
        "A reference prototype for checking specifications and screens",
        "Sample data for a fictional company, stored in the browser",
        "An illustrative scoring matrix — not approved by any AMC",
        "Approval rules enforced in the browser, not on a server",
        "Not a production system",
    ],
    "cues": [
        "To be clear about maturity: this is a reference prototype for checking specifications and screens.",
        "Its data is fictional and kept in the browser, its scoring matrix is illustrative, and its approval rules are not enforced by a server.",
        "It is not a production system, and no scoring rule shown here has been approved by any AMC.",
    ],
}
