# Narration / Subtitle Script — PRSMTD Architecture, Design & Security Explainer

Master script for a **silent** documentary (Version 1, per the repository's own video-production-framework.md Sec 2 rule 3 / Sec 17 standing disclosure protocol: no professional voice-over talent, no TTS meeting the framework's quality bar, and no licensed music are available in this environment). There is no voice cast. **Subtitles function as the narration** — every cue below is burned into the video as an on-screen caption, timed to the diagram animation it accompanies.

**Timing method**: word-count-weighted, at a fixed on-screen reading pace of **2.05 words/second** (122 words/minute-equivalent) — deliberately slower than this repository's own spoken-narration default of 150 wpm (video-production-framework.md Sec 4), because a silent film's viewer must read the caption *and* watch the diagram animate, not just listen. Every timestamp below is computed by `generate_docs.py` from `content.py` — none is hand-typed, so none can drift from `subtitles.srt` or `scene_list.md`, which are generated from the same source.

**Grounding**: every factual claim in every cue is cited in [`prsmtd-architecture-grounding.md`](prsmtd-architecture-grounding.md) and is not re-cited inline here, matching this repository's own established convention (video-production-framework.md, narration-script.md precedent: "grounding for every factual claim is listed in `source-workflow.md` and is not repeated inline here").

**Total computed runtime**: 15:38 (938.1s).

---

## Intro

**[0:00–0:10]** *(title card: “PRSMTD” / “Architecture, Design & Security — An Evidence-Based Overview”)* — no cue text; title card only.

---

## Chapter 1 — What PRSMTD Is

**[0:10–0:13]** *(chapter card: “What PRSMTD Is” / “A Governance Platform, Not a CRUD Application”)*

**[0:13–0:19]**

> PRSMTD is a multi-tenant governance platform — not a conventional line-of-business application.

**[0:19–0:29]**

> Spring Boot and Java 21 on the backend. Next.js and TypeScript on the frontend. PostgreSQL under Liquibase for data.

**[0:29–0:38]**

> One document governs everything: system.md. It is declared the sole authoritative, rebuild-critical specification. On any conflict, it wins.

**[0:38–0:49]**

> The platform ships one live business module today: Contacts — a governed maker-checker workflow, the reference implementation every future module will follow.

**[0:49–1:05]**

> An earlier expansion added three more modules — Billing, Notifications, Admin. It was later reversed, deliberately, when it didn't meet the platform's own bar. That reversal is recorded permanently, not erased.

**[1:05–1:13]**

> This is a platform built to govern its own change, before it governs anything else.

---

## Chapter 2 — Architectural Philosophy

**[1:13–1:16]** *(chapter card: “Architectural Philosophy” / “Constitutional Design and Six Invariants”)*

**[1:16–1:29]**

> PRSMTD describes itself in constitutional terms. system.md is “authoritative and rebuild-critical” — every governance process built on top of it holds derived authority, never equal authority.

**[1:29–1:37]**

> Six invariants sit above every other rule in the system — a closed set, numbered I1 through I6.

**[1:38–1:43]**

> I1: closed-world routing. Any route not explicitly enumerated is forbidden.

**[1:43–1:51]**

> I2: maker-checker governance. No direct lifecycle mutation. A maker can never be their own checker.

**[1:51–1:59]**

> I3: plane separation — a hard boundary between the platform control plane and the tenant data plane.

**[1:59–2:09]**

> I4: tenant isolation, enforced by the database itself through row-level security, anchored on session variables the application never sets directly.

**[2:09–2:20]**

> I5: deterministic rebuild — pinned images, sealed snapshot hashes, byte-sensitive inputs. I6: one closed, exhaustive set of governed action types, system-wide.

**[2:20–2:31]**

> The Liquibase schema baseline locks immutable from a fixed release tag. New change is additive only — never a rewrite of history.

**[2:31–2:42]**

> Every structural change moves through six ordered phases: Charter, Schema, Runtime, Graph, Validator, Capstone. Skipping ahead is explicitly forbidden.

**[2:42–2:53]**

> The Runtime Validator Harness is named, explicitly, a constitutional control surface — the same enforcement class as row-level security and the ExecutionContext binding itself.

---

## Chapter 3 — Platform Architecture

**[2:54–2:57]** *(chapter card: “Platform Architecture” / “Layering, Modules, and the Request Pipeline”)*

**[2:57–3:07]**

> The backend enforces its own layering — not by convention, but by an ArchUnit test that fails the build on violation.

**[3:07–3:19]**

> API depends on service. Service depends on persistence. Persistence depends on nothing above it. A controller package is not permitted to exist at all.

**[3:19–3:28]**

> Every business capability is a module: a manifest file declaring its code, its roles, its permissions, its workflows.

**[3:29–3:46]**

> A module's lifecycle runs through one canonical flow: manifest, to startup scanner, to a modules catalog table, to the governance ledger, to a projection trigger, to the tenant's own module state — read-only from there on.

**[3:47–3:57]**

> Contacts, the platform's one live module, declares three roles — Maker, Checker, Viewer — and one workflow requiring approval before it takes effect.

**[3:57–4:09]**

> Modules cannot modify tables they don't own. A destructive schema change requires an explicit, named approval marker before it can even merge.

**[4:09–4:19]**

> The frontend never hardcodes which modules exist. It asks the platform, at runtime, and builds its own navigation from the answer.

**[4:20–4:35]**

> Every request crosses the same eight-component pipeline, in the same fixed order — from trace initialization, through identity resolution, to the moment a database connection is finally handed to business logic.

**[4:35–4:46]**

> Modules are forbidden from seeding their own catalog rows through a migration. They register themselves, at runtime, or not at all.

---

## Chapter 4 — Multi-Tenant Architecture

**[4:46–4:49]** *(chapter card: “Multi-Tenant Architecture” / “ExecutionContext, TenantAwareDataSource, and Realm Isolation”)*

**[4:49–5:08]**

> At the center of tenant isolation sits one small Java class: ExecutionContext. Its constructor is where the rule is enforced — not documented, enforced. A platform-plane context must carry no tenant id. A tenant-plane context must carry one.

**[5:08–5:23]**

> Tenant identity is never taken from the token directly. It's derived: the token's issuer is looked up against a registered identity provider, and only then resolved to a tenant id.

**[5:23–5:40]**

> One component alone may set the database session variables row-level security depends on: TenantAwareDataSource. Every borrowed connection resets those variables first, then binds them fresh, scoped to the current transaction only.

**[5:40–5:45]**

> Application code is explicitly forbidden from setting these variables itself.

**[5:45–5:59]**

> Isolation extends past the database. Each tenant is provisioned its own Keycloak realm. A platform administrator's account exists only in the platform realm — never in a tenant's.

**[5:59–6:12]**

> A tenant's lifecycle is a closed state machine: pending, to active, to suspended and back, or to archived — a terminal state with no path back.

---

## Chapter 5 — Security Architecture

**[6:12–6:15]** *(chapter card: “Security Architecture” / “RBAC, Defense in Depth, and Disclosed Risk”)*

**[6:15–6:31]**

> Authorization is split into three domains that are never allowed to cross: platform RBAC, tenant RBAC, and module RBAC. Each has its own role table, its own permission table, its own audience.

**[6:31–6:46]**

> Maker-checker isn't only an application rule. It's a database constraint: the account that approves an action cannot be the account that proposed it. The database itself rejects the alternative.

**[6:46–7:01]**

> Every governed action is a row in one table — pending_action — constrained to a closed, exhaustive set of nineteen action types, and protected by forced row-level security at the database engine.

**[7:01–7:15]**

> The platform maintains its own threat model: twelve trust boundaries, seven security domains, seventeen STRIDE-classified threat scenarios, each with a named mitigation and a documented residual risk.

**[7:15–7:34]**

> One of those residual risks is disclosed, not hidden: two platform tables carry row-level security policies but not the strongest enforcement mode. The exposure was assessed as low, and logged as a hardening item — not a passed inspection.

**[7:34–7:56]**

> An old enforcement script was found orphaned, never wired into the pipeline it was meant to guard, unable to even complete a run. It was retired — because the invariant it targeted was already enforced, independently, by row-level security and the centralized session-variable boundary.

**[7:56–8:09]**

> That is the standard this platform holds itself to: find the gap, disclose it, and only remove a control once something else already covers it.

---

## Chapter 6 — Identity Architecture

**[8:09–8:12]** *(chapter card: “Identity Architecture” / “Keycloak Realms, Token Validation, Identity Binding”)*

**[8:12–8:27]**

> Every request carries a signed token. Its signature is verified. Its issuer must match a registered value exactly. Its audience must match too. No fallback issuer, and no exceptions.

**[8:27–8:44]**

> The token's subject is an external identity — a Keycloak-assigned id. It is never used directly to bind data. It's looked up, through an identity-binding table, to the platform's own internal user id.

**[8:44–9:03]**

> A token issued by one tenant's realm is rejected before it's even decoded, the moment its issuer fails to match a registered tenant. Cross-realm access isn't caught after the fact — it's structurally impossible to reach that far.

**[9:03–9:17]**

> Machine-to-machine calls authenticate differently: a service credential token carries its own permissions as signed claims, so the hot path never has to query a permissions table at all.

**[9:17–9:29]**

> Provisioning follows the same discipline: every tenant realm gets its own dedicated service account. One shared administrator credential across every tenant realm is explicitly forbidden.

---

## Chapter 7 — Data & Audit Architecture

**[9:30–9:33]** *(chapter card: “Data & Audit Architecture” / “Row-Level Security and Append-Only Evidence”)*

**[9:33–9:51]**

> Row-level security policies are not generic. The policy on the audit log doesn't just check the tenant id — it checks that the account writing the row is the same account the row claims performed the action.

**[9:51–10:03]**

> Six audit tables are append-only, by database trigger, unconditionally. An update or a delete against any of them raises an exception and stops the transaction.

**[10:03–10:18]**

> One rule closes the loop on duplicate approvals: for any governed target, the system will not allow more than one pending action of the same type at the same time.

**[10:19–10:36]**

> There is exactly one documented exception to routing changes through governance at all — bootstrapping a tenant's very first membership — and even that exception is itself logged to a permanent audit event, every time it fires.

**[10:36–10:50]**

> Some tables are not written by application code at all. They exist only as projections — populated exclusively when a trigger observes a governed action move to approved.

**[10:50–11:09]**

> The trace record kept for every request is deliberately incomplete by design: no raw tokens, no claims, no personal data. Only opaque identifiers — enough to reconstruct what happened, never enough to expose who or what was in it.

---

## Chapter 8 — Governance Architecture

**[11:10–11:13]** *(chapter card: “Governance Architecture” / “The Program Board, Validators, and the Architecture Graph”)*

**[11:13–11:31]**

> Structural change moves through a nine-stage lifecycle: proposed, chartered, scheduled, in progress, landed, verified, closed — or deferred. Once an item is verified or closed, it is not edited. A correction is a new entry, never a rewrite.

**[11:32–11:46]**

> Three paths can insert work into that lifecycle, and they don't overlap. Structural change requires a chartered specification amendment first — it cannot enter through the lighter, operational path.

**[11:46–12:06]**

> Every decision the governance board makes is recorded to an append-only ledger. The board's own authority is explicitly bounded: it cannot weaken an invariant, bypass a compliance gate, or schedule schema work without an approved specification change behind it.

**[12:06–12:23]**

> A separate, six-validator constitutional smoke set runs against a live, running system in continuous integration — checking things like cross-tenant leakage between two live tenants. The set required to run is itself fixed and drift-checked.

**[12:23–12:38]**

> The architecture graph itself is generated from system.md, and cryptographically pinned to the exact bytes of that document. If the specification changes and the graph doesn't follow, the build fails.

---

## Chapter 9 — End-to-End Request Lifecycle

**[12:38–12:41]** *(chapter card: “End-to-End Request Lifecycle” / “One Request, Traced Through Every Layer”)*

**[12:41–12:46]**

> Follow one request from the moment it arrives.

**[12:46–12:51]**

> First, a trace identifier is assigned — before authentication even begins.

**[12:51–13:05]**

> The bearer token is checked against a registered issuer before it's decoded at all. An unrecognized issuer is rejected immediately, without ever reaching the effort of validation.

**[13:05–13:15]**

> Identity is resolved: token subject, to an identity-binding record, to an internal user id — never the raw external identity itself.

**[13:15–13:24]**

> The execution plane is determined from the route itself — never inferred from what memberships happen to exist.

**[13:24–13:34]**

> An ExecutionContext is constructed. Immutable. Its plane and tenant id are validated for consistency the moment it's built.

**[13:34–13:44]**

> Only now does a database connection get involved — and only through the one component permitted to bind its session variables.

**[13:45–13:55]**

> The module layer checks role, checks whether the action requires approval, and either executes directly or opens a new pending action.

**[13:55–14:08]**

> A second request, later, from a different account, makes the decision. The database itself refuses to let that account be the same one that proposed it.

**[14:08–14:23]**

> On approval, a trigger fires. The audit record is written. The projection updates. And the response returns — through the same context-clearing path, whether the request succeeded or failed.

---

## Chapter 10 — Why This Architecture Matters

**[14:23–14:26]** *(chapter card: “Why This Architecture Matters” / “Evidence, Not Assertion”)*

**[14:26–14:38]**

> The documentation cannot silently drift from what governs the build — the architecture graph is generated from the specification and cryptographically tied to it.

**[14:38–14:54]**

> Tenant isolation is not enforced in one place. It's enforced four times, independently — in application code, in the connection layer, in the database engine, and verified again, live, in continuous integration.

**[14:54–15:03]**

> Governance debt is tracked, not hidden. Gaps get disclosed, dispositioned, and logged — not quietly patched over and forgotten.

**[15:03–15:18]**

> And the platform has already proven it will reverse its own work — retiring three modules it had already built — rather than keep scaffolding that didn't meet its own bar.

**[15:18–15:32]**

> PRSMTD is not merely a software platform. It is a governed enterprise operating architecture where security, compliance, and platform evolution are enforced as constitutional properties of the system.

---

## Closing Card

**[15:32–15:38]** *(closing card: “PRSMTD” / “A Governed Enterprise Operating Architecture”)* — holds on Chapter 10's closing line; no new cue text.

## Traceability

- **Business Requirement**: Provide the caption/subtitle brief for the PRSMTD Architecture, Design & Security Explainer (board/regulator/CISO/architect audience).
- **Regulatory Requirement**: None directly — content is technical-architecture exposition, grounded in PRSMTD's own governance/security documentation, not itself a regulatory artifact.
- **PRSMTD Capability**: None modified — read-only research artifact describing existing PRSMTD capabilities (see `prsmtd-architecture-grounding.md` for the full capability citation list).
- **ERM Capability**: N/A (demonstration collateral, not a module spec).
- **Dependencies**: `prsmtd-architecture-grounding.md`, `content.py`, `generate_docs.py`.
- **Future Work**: If a professional voice-over resource becomes available, re-time against the real recorded track rather than this word-count estimate (same disclosed limitation as Video 01/02's own narration-script.md).
