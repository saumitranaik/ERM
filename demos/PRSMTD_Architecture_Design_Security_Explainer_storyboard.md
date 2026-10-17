# Storyboard — PRSMTD Architecture, Design & Security Explainer

Per-chapter visual design specification. This is the implementation brief for
`assets/project/render_pipeline.py`'s diagram ("plate") functions — one function per `diagram`
tag named in `assets/project/content.py`. Every node/edge label below is copied verbatim from
[`prsmtd-architecture-grounding.md`](prsmtd-architecture-grounding.md)'s "Real names to use
verbatim" section or its cited chapters; no label here is invented. Cue-level timing for when
each beat below should be on screen is in
[`PRSMTD_Architecture_Design_Security_Explainer_scene_list.md`](PRSMTD_Architecture_Design_Security_Explainer_scene_list.md).

## Visual system (fixed across all ten diagrams)

Reused directly from `demos/video-01-risk-assessment-approval/project/render_pipeline.py`'s
already-validated visual language (video-production-framework.md Sec 3: "one system, not a
patchwork") — same constants, new diagrams:

- **Canvas**: 1920×1080, vertical gradient background `COL_BG_DARK (10,14,26)` →
  `COL_BG_DARK_2 (17,24,42)`.
- **Accent**: `COL_ACCENT (56,130,246)` / `COL_ACCENT_SOFT (96,165,250)` for active/highlighted
  elements, arrows, and the left accent bar on chapter cards.
- **Semantic colors**: `COL_GOOD (34,197,94)` for enforced/approved/pass states, `COL_WARN
  (234,179,8)` for disclosed-risk/pending states, `COL_BAD (239,68,68)` for forbidden/rejected/
  crossed-out states, `COL_MUTED (148,163,184)` for inactive/ghosted elements.
- **Typography**: Segoe UI family (`segoeui.ttf` regular, `segoeuib.ttf` bold, `seguisb.ttf`
  semibold, `segoeuil.ttf` light) — titles 44-64pt semibold, labels 18-26pt, captions/subtitles
  handled separately by the burned-in SRT track, not drawn per-diagram.
- **Shapes**: rounded rectangles (`radius` 10-16px) for every node/box; straight arrows with a
  simple triangular head for every edge/flow; a small vector lock icon for governance-gated
  states, a check icon for approved/enforced states — all drawn with primitives (no emoji/
  Dingbat glyphs, matching Video 01's own font-coverage finding).
- **Animation grammar**: every diagram builds progressively as its chapter's cues advance —
  elements fade/scale in (ease-in-out, ~0.4-0.6s) as the cue that introduces them starts, not
  all at once on chapter-card entry. Chapter cards cross-fade in (0.4s); hard cuts only where a
  diagram fundamentally changes state (e.g., a request moving to the next pipeline stage).
  Diagrams hold their fully-built state through their chapter's closing cues, then cross-fade
  to the next chapter card.

---

## Chapter 1 — `platform_identity`

1. **Identity strip** (top third): "PRSMTD" wordmark, then a horizontal tech-stack strip of
   four rounded boxes: `Spring Boot · Java 21` → `Next.js · TypeScript` → `PostgreSQL` →
   `Liquibase`, connected by thin arrows, fading in left-to-right as cues 1-2 read.
2. **Authority badge** (center, cue 3): a single document icon labeled `system.md`, with a
   badge below reading `"Sole authoritative, rebuild-critical specification"` and a small
   `"wins on conflict"` tag — drawn larger/more prominent than the stack strip above it, to
   visually establish it outranks everything else on screen.
3. **Module strip** (lower third, cues 4-5): a row of module chips. `CONTACTS` in solid
   `COL_GOOD` outline with a check icon (labeled "live — reference implementation" beneath).
   To its right, three ghosted `COL_MUTED` chips with a `COL_BAD` strike-through: `BILLING`,
   `NOTIFICATIONS`, `ADMIN`, with a small caption "retired via PR-RESET-02" fading in beneath
   them on cue 5 — do not remove them from frame; showing the strike-through, not an empty
   space, is the point (the platform's own governance ledger records the reversal, it doesn't
   erase it).
4. **Closing beat** (cue 6): everything but the `system.md` badge and a thin outline of the
   whole assembly dims by ~60%, leaving the authority badge as the visual takeaway before the
   Chapter 2 card.

## Chapter 2 — `constitution_flow`

1. **Flow spine** (cues 1-2): four stacked boxes, top to bottom, connected by downward arrows:
   `Constitution (system.md)` → `Governance (Program Board)` → `Platform` → `Modules`, each
   labeled "derived authority" except the top box, labeled "authoritative." This visualizes
   the grounding doc's system.md §16.1 authority statement directly.
2. **Invariant cards I1–I6** (cues 3-7): six small cards arranged in a 2×3 grid, appearing one
   at a time as each cue names it, each with its short label: `I1 Closed-world routing`, `I2
   Maker-checker`, `I3 Plane separation`, `I4 Tenant isolation (DB-enforced)`, `I5
   Deterministic rebuild`, `I6 Action-type closed set`. Each card pulses once (scale 1.0→1.05→
   1.0) as its cue starts.
3. **Baseline lock** (cue 8): a padlock icon over a `Liquibase baseline` box, with `release-1.0`
   tagged beneath it and a small "additive only" arrow looping back into the box (not out of
   it) — visualizing immutability, not a dead end.
4. **Six-phase stepper** (cue 9): a horizontal stepper — `Charter → Schema → Runtime → Graph →
   Validator → Capstone` — each step a small rounded box connected by arrows, lighting up
   left-to-right in sequence as the cue reads, with a `COL_BAD` "×" motif briefly flashed over
   a skipped-ahead arrow (Schema→Runtime with Charter dimmed) to visualize "out-of-order
   forbidden," then corrected back to the in-order sequence.
5. **Constitutional trio** (cue 10): three boxes converging with arrows into one labeled
   "constitutional control surface": `Row-Level Security`, `ExecutionContext binding`,
   `Runtime Validator Harness` — equal visual weight, no hierarchy between them.

## Chapter 3 — `layers_modules`

1. **Layer stack** (cues 1-2): three horizontal bands, top to bottom: `api`, `service`,
   `persistence`, with one-directional downward arrows only (api→service, service→persistence)
   — no upward arrows drawn at all, visualizing the ArchUnit rule. A fourth band, `controller`,
   appears fully crossed out in `COL_BAD` beside the stack with the label "package must not
   exist," then fades out (it is absent from the running system, not merely discouraged).
2. **Module canonical flow** (cues 3-4): the exact seven-step chain from the grounding doc as a
   vertical flow of small boxes with downward arrows: `module.yaml manifest` →
   `ModuleCatalogRegistrar` → `modules catalog table` → `pending_action ledger` →
   `projection trigger (status=APPROVED)` → `tenant_module (projection)` →
   `runtime reads (read-only)`.
3. **CONTACTS manifest card** (cue 5): a code-card mockup (not a real screenshot — a styled
   text block matching the visual system, not a terminal/IDE skin) showing:
   `code: CONTACTS`, `roles: [CONTACTS_MAKER, CONTACTS_CHECKER, CONTACTS_VIEWER]`,
   `roleTypes: MAKER / CHECKER / VIEWER`, `workflows.CONTACTS_SUBMIT.requiresApproval: true`.
4. **Ownership guard** (cue 6): two module boxes side by side (`CONTACTS`, a second greyed
   "Module B" placeholder) with a `COL_BAD` blocked-arrow between them labeled "cannot modify
   tables it doesn't own," and a small lock+label "destructive change requires explicit
   approval marker."
5. **Dynamic navigation** (cue 7): a browser-chrome-free UI-shell silhouette on the left,
   arrow labeled `GET /api/v1/modules` pointing right into it, with nav items appearing in the
   shell only as the response arrives — visualizing "asks the platform, builds its own nav."
6. **Runtime pipeline chain** (cue 8): the exact 8-node horizontal chain from the grounding
   doc, small boxes left to right: `ObservabilityTraceMdcFilter` → `JwtActorAuthenticationConverter`
   → `ActorIdResolver` → `ExecutionContextEstablishmentFilter` → `ObservabilityEnforcementFilter`
   → `RequestExecutionContext` → `ExecutionContextInterceptor` → `TenantAwareDataSource`. This
   exact chain recurs, animated node-by-node, in Chapter 9 — reuse the same node layout
   function so viewers recognize it.
7. **Anti-pattern strike** (cue 9): a small "migration-driven lifecycle" box with a `COL_BAD`
   cross through it, beside the canonical flow from beat 2, captioned "forbidden."

## Chapter 4 — `tenant_isolation`

1. **ExecutionContext card** (cue 1): a class-card visual (rounded box styled like a UML class
   box, not a real IDE screenshot) titled `ExecutionContext`, fields `actorId`, `plane`,
   `tenantId`, `actorType`, with a small annotated rule beneath: `PLATFORM → tenantId must be
   null` / `TENANT → tenantId required` — the two rules animate in as opposing branches from
   the `plane` field, each ending in a check or cross depending on which value is shown.
2. **Tenant resolution chain** (cue 2): `JWT.iss` → `tenant_identity_provider` (lookup) →
   `tenant_id` → `ExecutionContext`, left-to-right arrow chain, each box appearing as the
   cue's clauses read.
3. **TenantAwareDataSource sequence** (cue 3): a vertical timeline for one connection borrow:
   `RESET app.plane / app.user_id / app.tenant_id` → `set_config(...)  [transaction-local]` →
   `handed to JPA/JDBC`. Draw the "transaction-local" scope as a dashed boundary box around
   just this one request, explicitly not extending to a "next request" ghost box beside it
   (visualizing no leakage across pooled reuse).
4. **Forbidden direct access** (cue 4): a small `COL_BAD` blocked arrow from a generic
   "application code" box straight at the GUC layer, captioned "forbidden — must go through
   TenantAwareDataSource," redirected instead through the sequence from beat 3.
5. **Realm isolation** (cue 5): two realm boxes side by side, `Platform Realm` (containing a
   small "admin" icon) and `Tenant Realm` (containing a "member" icon) — no icon or arrow
   crosses between them; a `COL_BAD` blocked path is briefly shown from admin into the tenant
   realm box, then removed.
6. **Tenant lifecycle FSM** (cue 6): a state diagram — `PENDING` → `ACTIVE` ⇄ `SUSPENDED`
   (bidirectional arrow), `ACTIVE`/`SUSPENDED` → `ARCHIVED` (terminal, drawn with no outgoing
   arrow at all, boxed in `COL_MUTED` to read as a dead end).

## Chapter 5 — `security_layers`

1. **Three RBAC domains** (cue 1): three parallel vertical lanes, non-touching, each with its
   own small table icon: `Platform RBAC` (`platform_role_assignment`, `role_permission_map`),
   `Tenant RBAC` (`tenant_roles`, `tenant_role_permissions`), `Module RBAC`
   (`MAKER`/`CHECKER`/`VIEWER`). A `COL_BAD` blocked arrow is briefly shown attempting to cross
   from one lane to another, then dissolves — "cross-domain authorization is forbidden."
2. **DB-enforced maker≠checker** (cue 2): a literal SQL-styled card:
   `CHECK (approved_by IS NULL OR approved_by <> created_by)`, with two actor icons ("maker,"
   "checker") on either side connected by a crossed-out equals sign between them.
3. **pending_action constraint card** (cue 3): a compact schema card for `pending_action`
   showing `action_type` with a "19 closed values" badge (not all 19 listed on screen — a
   count badge, since the real list is long) and a `FORCE ROW LEVEL SECURITY` badge in
   `COL_GOOD`.
4. **Threat model dashboard** (cue 4): four counter tiles appearing in sequence:
   `12 trust boundaries`, `7 security domains`, `17 STRIDE threats`, each with a small icon,
   styled like the audience-value plate pattern from Video 01's compositor (rows of label +
   value, not free-floating numbers).
5. **Disclosed risk card** (cue 5): a `COL_WARN` (not `COL_BAD`) bordered card: "2 platform
   tables: RLS enabled, not FORCE'd" with a sub-line "assessed low-exploitability — logged as a
   hardening item," visually distinct from the crossed-out/forbidden styling used elsewhere —
   this must read as *disclosed*, not *broken*.
6. **Retired script beat** (cue 6): a small file icon `tenant_context_guard.py` fading to
   `COL_MUTED` with a "retired" stamp, while two arrows from `Row-Level Security` and
   `TenantAwareDataSource` (already on screen conceptually from Ch.4, redrawn small here)
   point at the same invariant it used to guard, visualizing "already covered elsewhere."
7. **Closing principle** (cue 7): three words appearing in sequence, large, centered: "Find it.
   Disclose it. Only then remove it." — a deliberate departure from diagram-only chapters, used
   once, for emphasis on the chapter's thesis.

## Chapter 6 — `identity_flow`

1. **Token validation sequence** (cue 1): three checks appearing left to right, each a small
   badge turning from `COL_MUTED` to `COL_GOOD` in sequence: `Signature` → `Issuer (exact
   match)` → `Audience (exact match)`, with a `COL_BAD` "no fallback issuer" tag beneath.
2. **Identity binding lookup** (cue 2): `JWT.sub (external id)` → crossed arrow labeled "never
   bound directly" → redirected down into `identity_binding` table → `app_user.id (internal)`.
3. **Cross-realm rejection** (cue 3): a token icon labeled "Tenant A" attempting to enter a
   "Tenant B endpoint" box; the rejection happens at a gate drawn *before* a "decode" icon
   inside the box, with the gate labeled `isRegisteredIssuer()` — the visual point is the
   rejection point is structurally earlier than content inspection.
4. **Service-principal path** (cue 4): a separate, parallel small diagram: a service-credential
   token icon carrying visible claim tags (`actor_type=service`, `allowed_scopes`,
   `allowed_tenants`) flowing directly to "authorized" without passing through a database icon
   at all — a dashed "no DB read" annotation on the skipped step.
5. **Per-tenant service accounts** (cue 5): a row of tenant realm boxes, each with its own
   small key icon beneath it (not one shared key icon above all of them) — visualizing "no
   master-realm admin credential."

## Chapter 7 — `data_audit`

1. **RLS policy table** (cue 1): reproduce (a legible, on-screen-sized excerpt of) the real
   policy summary table from the grounding doc — at minimum the `audit_log` row: table name,
   policy name `rls_tenant_isolation`, and the actor-scoped write predicate simplified to
   `tenant_id = current_tenant_uuid() AND actor_id = current_user_uuid()` — styled as a real
   two-column table, not prose.
2. **Append-only trigger pair** (cue 2): six small table icons (`audit_log`, `pending_action`,
   `platform_audit_log`, `module_action_audit`, `module_contacts_contact_action_audit`,
   `service_principal_audit`) each with a small padlock, and two `COL_BAD` blocked-arrow icons
   labeled `UPDATE` / `DELETE` bouncing off all six simultaneously.
3. **GOV-07 dedup** (cue 3): two attempted `pending_action` submissions for the same target
   appear; the second is blocked with a `COL_WARN` "already pending" tag rather than a hard
   `COL_BAD` reject (it is a validation rule, not a security violation).
4. **Bootstrap exception** (cue 4): a single narrow doorway icon labeled "tenant's first
   membership only," with a small audit-log icon lighting up beside it labeled
   `TENANT_BOOTSTRAP_MEMBERSHIP` — visualizing "the one exception is itself audited."
5. **Projection-only tables** (cue 5): `module_role_assignment` / `tenant_module` boxes with
   all inbound arrows originating only from a trigger icon (never from an "application code"
   box), captioned "trigger-populated only."
6. **Trace contract** (cue 6): a horizontal event chain (`http.request.begin` → `auth.jwt.
   validated` → `tenant.selection` → `db.guc.bind` → `dao.*.query` → `http.request.end`) with a
   `COL_BAD` strike through small "JWT," "PII," "claims" tags floating above it — visualizing
   what is deliberately excluded from the trace.

## Chapter 8 — `governance_pipeline`

1. **Nine-bucket lifecycle** (cue 1): a horizontal stepper, `PROPOSED → CHARTER_REQUIRED →
   CHARTERED → SCHEDULED → IN_PROGRESS → LANDED → VERIFIED → CLOSED`, with a `DEFERRED` branch
   dropping off below the `IN_PROGRESS`/`LANDED` region, and a small padlock appearing over
   `VERIFIED`/`CLOSED` once the stepper reaches them (immutable once there).
2. **Three insertion paths** (cue 2): three separate arrows entering the stepper from beat 1 at
   different points, labeled `CHARTER_INSERTION`, `PROMOTION_INSERTION`, `OPERATOR_INSERTION`
   — the `OPERATOR_INSERTION` arrow is shown attempting to enter at the `STRUCTURE` lane
   (drawn as a separate small lane tag) and is blocked there in `COL_BAD`.
3. **Append-only ledger stream** (cue 3): a vertical scrolling-log visual (a few real operation
   names from the grounding doc: `INSERTED`, `CHARTERED`, `LANDED`, `VERIFIED`) each appearing
   and staying fixed (never removed/edited) — plus a small "board authority" box with a short
   forbidden-uses list beneath it: "cannot weaken an invariant," "cannot bypass compliance
   gate."
4. **Six validators grid** (cue 4): a 2×3 grid of small badges `V01`–`V06`, each turning
   `COL_GOOD` in sequence, with a `tier: smoke — CI-blocking` tag above the grid and a faded
   `V07…V11 — extended, non-blocking` row beneath it, visually secondary.
5. **Hash-pinned graph** (cue 5): `system.md` → (arrow labeled `sha256`) → `source_system_
   sha256` → `platform_architecture_graph.yaml`, with a small "CI FAIL" `COL_BAD` stamp shown
   briefly on a broken/dashed version of the arrow, then replaced by the solid, `COL_GOOD`
   version — visualizing "if they drift, the build fails."

## Chapter 9 — `request_lifecycle`

The centerpiece diagram — the vertical flow the original brief explicitly requested, now built
from the real components already established visually in earlier chapters (reuse the same node
styling/colors as Chapter 3's runtime-pipeline beat and Chapter 4's ExecutionContext card, so
this reads as "the same system, traced end to end," not a new invented diagram).

Vertical spine, one node lighting up per cue, previous nodes staying lit (dimmed slightly) so
the full traversed path is visible by the chapter's end:

1. `User / Request` (cue 1)
2. `ObservabilityTraceMdcFilter — trace assigned` (cue 2)
3. `Issuer pre-validation (TenantRealmRegistry) → JWT decode + validate` (cue 3)
4. `JwtActorAuthenticationConverter → identity_binding → app_user.id` (cue 4)
5. `ExecutionContextEstablishmentFilter — plane determined from route` (cue 5)
6. `ExecutionContext constructed (plane/tenant validated)` (cue 6)
7. `TenantAwareDataSource — GUCs reset + bound` (cue 7)
8. `Module handler — RBAC + workflow check → pending_action` (cue 8)
9. `Checker decision — approved_by ≠ created_by enforced` (cue 9)
10. `Trigger → audit_log / platform_audit_log written → projection updated → Response` (cue 10)

A thin connecting line runs down the full spine, drawing itself only up to the currently-lit
node (a growing progress line, not a pre-drawn full line) — this is the one diagram allowed a
continuous camera drift downward (slow vertical pan, ~40px over the chapter) since it is the
longest single diagram in the film and a static frame for 90+ seconds would be inert.

## Chapter 10 — `synthesis`

1. **Four takeaway cards** (cues 1-4): four cards appearing one at a time, each pairing a short
   label with the mechanism it rests on — not restating Chapter 1-9 diagrams, just naming them:
   `Spec ↔ Graph` (hash-pinned), `Tenant Isolation ×4` (four independent layers, small icon
   row: app code / connection / database / CI), `Governance Debt` (tracked, not hidden — small
   ledger icon), `Prunes, Not Just Accretes` (small BILLING/NOTIFICATIONS/ADMIN ghost chips
   from Chapter 1, reappearing smaller, still crossed out).
2. **Closing line** (cue 5): all four cards dim to ~25% opacity; centered, larger type, the
   fixed closing line appears line-by-line: "PRSMTD is not merely a software platform. It is a
   governed enterprise operating architecture where security, compliance, and platform
   evolution are enforced as constitutional properties of the system." Hold through the
   closing card (per `scene_list.md`'s outro timing) before fade to black.

---

## Traceability

- **Business Requirement**: Provide the diagram-implementation brief for the PRSMTD
  Architecture, Design & Security Explainer's `render_pipeline.py`.
- **Regulatory Requirement**: None directly.
- **PRSMTD Capability**: None modified — every node/edge label above is drawn from
  `prsmtd-architecture-grounding.md`'s citations of existing PRSMTD architecture (system.md,
  real source files, real config); read-only research applied to visual design.
- **ERM Capability**: N/A (demonstration collateral, not a module spec).
- **Dependencies**: `prsmtd-architecture-grounding.md`, `content.py`,
  `PRSMTD_Architecture_Design_Security_Explainer_scene_list.md`, Video 01's
  `render_pipeline.py` (visual-language precedent, read-only reference).
- **Future Work**: If real narration audio is ever recorded, re-time diagram beats against the
  real track rather than the word-count estimate this storyboard's cue references are based on.
