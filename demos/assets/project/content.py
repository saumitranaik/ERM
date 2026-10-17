"""
content.py -- Single source of truth for the PRSMTD Architecture, Design & Security
Explainer (silent documentary, subtitles-as-narration).

Every cue below is grounded in ../../prsmtd-architecture-grounding.md (which cites every
claim back to PRSMTD's system.md / real source files / real config). This file adds no new
architectural claims -- it only sequences and paces what the grounding doc already verified.

This is the ONE place cue text and diagram direction are authored. `generate_docs.py` reads
this file to emit the script, subtitles, and scene list with consistent, word-count-weighted
timing -- no hand-typed timestamp can drift from another document, because none exist outside
this file and what is computed from it. `render_pipeline.py` also imports this file directly
for its cue text (burned-in subtitles) and per-chapter timing.

Reading pace: this is a SILENT video. There is no voice-over -- subtitles ARE the narration
the brief calls for ("Subtitles must function as the narration"). 150 wpm (2.5 wps) is a
spoken-narration rate (video-production-framework.md Sec 4); it is too fast for a viewer who
must also read on-screen diagram labels and watch the animation itself. WPS below is
deliberately slower than that framework's own spoken-narration default.
"""

WPS = 2.05  # words/second effective on-screen reading pace (~123 wpm-equivalent)
CARD_SECONDS = 3.0  # chapter title-card hold, matches Video 01/02 precedent exactly
INTRO_SECONDS = 10.0
OUTRO_HOLD_SECONDS = 6.0  # closing-line card hold, after its own cue finishes reading

TITLE = "PRSMTD"
SUBTITLE = "Architecture, Design & Security"

INTRO_CARD_TITLE = "PRSMTD"
INTRO_CARD_SUBTITLE = "Architecture, Design & Security — An Evidence-Based Overview"

CLOSING_CARD_TITLE = "PRSMTD"
CLOSING_CARD_SUBTITLE = "A Governed Enterprise Operating Architecture"

# ---------------------------------------------------------------------------
# Chapters: id, title, subtitle (for the chapter card), diagram tag (which
# render_pipeline.py plate function draws this chapter's visuals), and cues
# (each cue is one on-screen subtitle block -- short, documentary, no filler).
# ---------------------------------------------------------------------------

CHAPTERS = [
    dict(
        id=1,
        title="What PRSMTD Is",
        subtitle="A Governance Platform, Not a CRUD Application",
        diagram="platform_identity",
        cues=[
            "PRSMTD is a multi-tenant governance platform — not a conventional "
            "line-of-business application.",
            "Spring Boot and Java 21 on the backend. Next.js and TypeScript on the "
            "frontend. PostgreSQL under Liquibase for data.",
            "One document governs everything: system.md. It is declared the sole "
            "authoritative, rebuild-critical specification. On any conflict, it wins.",
            "The platform ships one live business module today: Contacts — a governed "
            "maker-checker workflow, the reference implementation every future module "
            "will follow.",
            "An earlier expansion added three more modules — Billing, Notifications, "
            "Admin. It was later reversed, deliberately, when it didn't meet the "
            "platform's own bar. That reversal is recorded permanently, not erased.",
            "This is a platform built to govern its own change, before it governs "
            "anything else.",
        ],
    ),
    dict(
        id=2,
        title="Architectural Philosophy",
        subtitle="Constitutional Design and Six Invariants",
        diagram="constitution_flow",
        cues=[
            "PRSMTD describes itself in constitutional terms. system.md is "
            "“authoritative and rebuild-critical” — every governance process "
            "built on top of it holds derived authority, never equal authority.",
            "Six invariants sit above every other rule in the system — a closed set, "
            "numbered I1 through I6.",
            "I1: closed-world routing. Any route not explicitly enumerated is forbidden.",
            "I2: maker-checker governance. No direct lifecycle mutation. A maker can "
            "never be their own checker.",
            "I3: plane separation — a hard boundary between the platform control plane "
            "and the tenant data plane.",
            "I4: tenant isolation, enforced by the database itself through row-level "
            "security, anchored on session variables the application never sets directly.",
            "I5: deterministic rebuild — pinned images, sealed snapshot hashes, "
            "byte-sensitive inputs. I6: one closed, exhaustive set of governed action "
            "types, system-wide.",
            "The Liquibase schema baseline locks immutable from a fixed release tag. "
            "New change is additive only — never a rewrite of history.",
            "Every structural change moves through six ordered phases: Charter, Schema, "
            "Runtime, Graph, Validator, Capstone. Skipping ahead is explicitly forbidden.",
            "The Runtime Validator Harness is named, explicitly, a constitutional "
            "control surface — the same enforcement class as row-level security and the "
            "ExecutionContext binding itself.",
        ],
    ),
    dict(
        id=3,
        title="Platform Architecture",
        subtitle="Layering, Modules, and the Request Pipeline",
        diagram="layers_modules",
        cues=[
            "The backend enforces its own layering — not by convention, but by an "
            "ArchUnit test that fails the build on violation.",
            "API depends on service. Service depends on persistence. Persistence "
            "depends on nothing above it. A controller package is not permitted to "
            "exist at all.",
            "Every business capability is a module: a manifest file declaring its code, "
            "its roles, its permissions, its workflows.",
            "A module's lifecycle runs through one canonical flow: manifest, to "
            "startup scanner, to a modules catalog table, to the governance ledger, to "
            "a projection trigger, to the tenant's own module state — read-only from "
            "there on.",
            "Contacts, the platform's one live module, declares three roles — Maker, "
            "Checker, Viewer — and one workflow requiring approval before it takes "
            "effect.",
            "Modules cannot modify tables they don't own. A destructive schema change "
            "requires an explicit, named approval marker before it can even merge.",
            "The frontend never hardcodes which modules exist. It asks the platform, "
            "at runtime, and builds its own navigation from the answer.",
            "Every request crosses the same eight-component pipeline, in the same "
            "fixed order — from trace initialization, through identity resolution, to "
            "the moment a database connection is finally handed to business logic.",
            "Modules are forbidden from seeding their own catalog rows through a "
            "migration. They register themselves, at runtime, or not at all.",
        ],
    ),
    dict(
        id=4,
        title="Multi-Tenant Architecture",
        subtitle="ExecutionContext, TenantAwareDataSource, and Realm Isolation",
        diagram="tenant_isolation",
        cues=[
            "At the center of tenant isolation sits one small Java class: "
            "ExecutionContext. Its constructor is where the rule is enforced — not "
            "documented, enforced. A platform-plane context must carry no tenant id. A "
            "tenant-plane context must carry one.",
            "Tenant identity is never taken from the token directly. It's derived: the "
            "token's issuer is looked up against a registered identity provider, and "
            "only then resolved to a tenant id.",
            "One component alone may set the database session variables row-level "
            "security depends on: TenantAwareDataSource. Every borrowed connection "
            "resets those variables first, then binds them fresh, scoped to the "
            "current transaction only.",
            "Application code is explicitly forbidden from setting these variables "
            "itself.",
            "Isolation extends past the database. Each tenant is provisioned its own "
            "Keycloak realm. A platform administrator's account exists only in the "
            "platform realm — never in a tenant's.",
            "A tenant's lifecycle is a closed state machine: pending, to active, to "
            "suspended and back, or to archived — a terminal state with no path back.",
        ],
    ),
    dict(
        id=5,
        title="Security Architecture",
        subtitle="RBAC, Defense in Depth, and Disclosed Risk",
        diagram="security_layers",
        cues=[
            "Authorization is split into three domains that are never allowed to "
            "cross: platform RBAC, tenant RBAC, and module RBAC. Each has its own role "
            "table, its own permission table, its own audience.",
            "Maker-checker isn't only an application rule. It's a database constraint: "
            "the account that approves an action cannot be the account that proposed "
            "it. The database itself rejects the alternative.",
            "Every governed action is a row in one table — pending_action — "
            "constrained to a closed, exhaustive set of nineteen action types, and "
            "protected by forced row-level security at the database engine.",
            "The platform maintains its own threat model: twelve trust boundaries, "
            "seven security domains, seventeen STRIDE-classified threat scenarios, "
            "each with a named mitigation and a documented residual risk.",
            "One of those residual risks is disclosed, not hidden: two platform tables "
            "carry row-level security policies but not the strongest enforcement mode. "
            "The exposure was assessed as low, and logged as a hardening item — not a "
            "passed inspection.",
            "An old enforcement script was found orphaned, never wired into the "
            "pipeline it was meant to guard, unable to even complete a run. It was "
            "retired — because the invariant it targeted was already enforced, "
            "independently, by row-level security and the centralized session-"
            "variable boundary.",
            "That is the standard this platform holds itself to: find the gap, "
            "disclose it, and only remove a control once something else already "
            "covers it.",
        ],
    ),
    dict(
        id=6,
        title="Identity Architecture",
        subtitle="Keycloak Realms, Token Validation, Identity Binding",
        diagram="identity_flow",
        cues=[
            "Every request carries a signed token. Its signature is verified. Its "
            "issuer must match a registered value exactly. Its audience must match "
            "too. No fallback issuer, and no exceptions.",
            "The token's subject is an external identity — a Keycloak-assigned id. It "
            "is never used directly to bind data. It's looked up, through an "
            "identity-binding table, to the platform's own internal user id.",
            "A token issued by one tenant's realm is rejected before it's even "
            "decoded, the moment its issuer fails to match a registered tenant. "
            "Cross-realm access isn't caught after the fact — it's structurally "
            "impossible to reach that far.",
            "Machine-to-machine calls authenticate differently: a service credential "
            "token carries its own permissions as signed claims, so the hot path never "
            "has to query a permissions table at all.",
            "Provisioning follows the same discipline: every tenant realm gets its own "
            "dedicated service account. One shared administrator credential across "
            "every tenant realm is explicitly forbidden.",
        ],
    ),
    dict(
        id=7,
        title="Data & Audit Architecture",
        subtitle="Row-Level Security and Append-Only Evidence",
        diagram="data_audit",
        cues=[
            "Row-level security policies are not generic. The policy on the audit log "
            "doesn't just check the tenant id — it checks that the account writing the "
            "row is the same account the row claims performed the action.",
            "Six audit tables are append-only, by database trigger, unconditionally. "
            "An update or a delete against any of them raises an exception and stops "
            "the transaction.",
            "One rule closes the loop on duplicate approvals: for any governed target, "
            "the system will not allow more than one pending action of the same type "
            "at the same time.",
            "There is exactly one documented exception to routing changes through "
            "governance at all — bootstrapping a tenant's very first membership — and "
            "even that exception is itself logged to a permanent audit event, every "
            "time it fires.",
            "Some tables are not written by application code at all. They exist only "
            "as projections — populated exclusively when a trigger observes a "
            "governed action move to approved.",
            "The trace record kept for every request is deliberately incomplete by "
            "design: no raw tokens, no claims, no personal data. Only opaque "
            "identifiers — enough to reconstruct what happened, never enough to "
            "expose who or what was in it.",
        ],
    ),
    dict(
        id=8,
        title="Governance Architecture",
        subtitle="The Program Board, Validators, and the Architecture Graph",
        diagram="governance_pipeline",
        cues=[
            "Structural change moves through a nine-stage lifecycle: proposed, "
            "chartered, scheduled, in progress, landed, verified, closed — or "
            "deferred. Once an item is verified or closed, it is not edited. A "
            "correction is a new entry, never a rewrite.",
            "Three paths can insert work into that lifecycle, and they don't overlap. "
            "Structural change requires a chartered specification amendment first — it "
            "cannot enter through the lighter, operational path.",
            "Every decision the governance board makes is recorded to an append-only "
            "ledger. The board's own authority is explicitly bounded: it cannot "
            "weaken an invariant, bypass a compliance gate, or schedule schema work "
            "without an approved specification change behind it.",
            "A separate, six-validator constitutional smoke set runs against a live, "
            "running system in continuous integration — checking things like "
            "cross-tenant leakage between two live tenants. The set required to run "
            "is itself fixed and drift-checked.",
            "The architecture graph itself is generated from system.md, and "
            "cryptographically pinned to the exact bytes of that document. If the "
            "specification changes and the graph doesn't follow, the build fails.",
        ],
    ),
    dict(
        id=9,
        title="End-to-End Request Lifecycle",
        subtitle="One Request, Traced Through Every Layer",
        diagram="request_lifecycle",
        cues=[
            "Follow one request from the moment it arrives.",
            "First, a trace identifier is assigned — before authentication even "
            "begins.",
            "The bearer token is checked against a registered issuer before it's "
            "decoded at all. An unrecognized issuer is rejected immediately, without "
            "ever reaching the effort of validation.",
            "Identity is resolved: token subject, to an identity-binding record, to an "
            "internal user id — never the raw external identity itself.",
            "The execution plane is determined from the route itself — never inferred "
            "from what memberships happen to exist.",
            "An ExecutionContext is constructed. Immutable. Its plane and tenant id "
            "are validated for consistency the moment it's built.",
            "Only now does a database connection get involved — and only through the "
            "one component permitted to bind its session variables.",
            "The module layer checks role, checks whether the action requires "
            "approval, and either executes directly or opens a new pending action.",
            "A second request, later, from a different account, makes the decision. "
            "The database itself refuses to let that account be the same one that "
            "proposed it.",
            "On approval, a trigger fires. The audit record is written. The "
            "projection updates. And the response returns — through the same "
            "context-clearing path, whether the request succeeded or failed.",
        ],
    ),
    dict(
        id=10,
        title="Why This Architecture Matters",
        subtitle="Evidence, Not Assertion",
        diagram="synthesis",
        cues=[
            "The documentation cannot silently drift from what governs the build — "
            "the architecture graph is generated from the specification and "
            "cryptographically tied to it.",
            "Tenant isolation is not enforced in one place. It's enforced four times, "
            "independently — in application code, in the connection layer, in the "
            "database engine, and verified again, live, in continuous integration.",
            "Governance debt is tracked, not hidden. Gaps get disclosed, "
            "dispositioned, and logged — not quietly patched over and forgotten.",
            "And the platform has already proven it will reverse its own work — "
            "retiring three modules it had already built — rather than keep "
            "scaffolding that didn't meet its own bar.",
            "PRSMTD is not merely a software platform. It is a governed enterprise "
            "operating architecture where security, compliance, and platform "
            "evolution are enforced as constitutional properties of the system.",
        ],
    ),
]

TOTAL_CHAPTERS = len(CHAPTERS)
