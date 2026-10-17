# PRSMTD Architecture Grounding — Research Artifact for Documentary Script

**Purpose:** Source-cited reference material for a 14–16 minute silent (subtitles-as-narration) architecture/security documentary about PRSMTD, for board/regulator/CISO/architect audiences. Every claim below is cited to a real repository artifact. PRSMTD was read-only throughout this research; nothing in `C:\development\projects\PRSMTD` was modified.

**Primary source:** `PRSMTD/docs/authoritative/system.md` (8,220 lines, 23 sections, `<!-- CONSOLIDATED_BUILD_V1 -->`) — the sole authoritative, rebuild-critical specification (system.md §1: "Wins over all non-system.md documentation"). Citations of the form `(system.md §N)` refer to this file. Citations of the form `(file: path, line ~N)` refer to actual source under `PRSMTD/`.

---

## Real names to use verbatim

**Runtime pipeline components (Java classes, `com.prsbnjs.security.context` / `com.prsbnjs.security.auth` / `com.prsbnjs.persistence.rls`):**
`JwtActorAuthenticationConverter`, `ActorIdResolver`, `ExecutionContextEstablishmentFilter`, `ExecutionContextEstablishmentService`, `RequestExecutionContext`, `ExecutionContext`, `ExecutionContextInterceptor`, `ExecutionContextHolder`, `ExecutionPhaseHolder`, `ExecutionPhase`, `TenantAwareDataSource`, `TenantResolver`, `TenantRealmRegistry`, `BootstrapExecutor`, `ObservabilityTraceMdcFilter`, `ObservabilityEnforcementFilter`, `ObservabilityRequestEnforcement`.

**PostgreSQL session GUCs (RLS anchors):** `app.plane`, `app.user_id`, `app.tenant_id`. Wrapper functions: `current_tenant_uuid()`, `current_user_uuid()` (system.md §7, "GUC Wrapper Functions").

**Governance/schema tables (real table names, `db/liquibase/changes/v1000-canonical-baseline.yaml`):** `tenants`, `app_user`, `tenant_membership`, `tenant_roles`, `tenant_role_permissions`, `audit_log`, `pending_action`, `actions`, `consents`, `modules`, `tenant_module`, `module_roles`, `module_role_assignment`, `module_actions`, `module_action_audit`, `module_contacts_contacts`, `module_contacts_contact_action_audit`, `permissions`, `role_permission_map`, `platform_role_assignment`, `platform_audit_log`, `platform_audit_event_type`, `encryption_keys`, `encryption_key_versions`, `service_principals`, `service_principal_audit`, `system_bootstrap_state`, `identity_binding`, `tenant_identity_provider`, `tenant_branding`, `tenant_branding_audit`, `governance_action_mutex_group`.

**Governance roles (closed sets, verbatim strings, uppercase):** Platform — `PLATFORM_ADMIN`, `PLATFORM_ADMIN_MAKER`, `PLATFORM_ADMIN_CHECKER`. Tenant — `ADMIN`, `MAKER`, `CHECKER`, `USER`, `VIEWER`. Module — `MAKER`, `CHECKER`, `VIEWER` (module role *types*; module-specific role names e.g. `CONTACTS_MAKER`).

**`pending_action.action_type` canonical closed set (19 values, current v1000 baseline DDL):** `TENANT_CREATE`, `TENANT_ACTIVATE`, `TENANT_DEACTIVATE`, `TENANT_SUSPEND`, `TENANT_RECOVER`, `TENANT_ARCHIVE`, `TENANT_BRANDING_UPDATE`, `USER_RETIRE`, `USER_REACTIVATE`, `USER_CREATE`, `USER_ACTIVATE`, `USER_SUSPEND`, `USER_MEMBERSHIP_REMOVE`, `USER_ROLE_CHANGE`, `MODULE_ENABLE`, `MODULE_DISABLE`, `MODULE_ROLE_ASSIGN`, `DATA_DELETE`, `CONSENT_REVOKE` (file: `db/liquibase/changes/v1000-canonical-baseline.yaml`, `CONSTRAINT ck_pending_action_action_type`, line ~256). Note: `system.md` §7 prose lists these plus `SERVICE_PRINCIPAL_CREATE/_ROTATE/_REVOKE`, which live in a v1300-0001 changeset layered on the baseline.

**`pending_action.status` closed set:** `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED` (system.md §7).

**Permission catalog (closed set, 14 ids):** `dashboard:view`, `actions:create`, `actions:view`, `actions:approve`, `users:view`, `users:manage`, `roles:view`, `roles:manage`, `consent:view`, `consent:manage`, `audit:view`, `audit:export`, `archived:view`, `tenants:view` (system.md §7, §8).

**Module code:** `CONTACTS` — the only live, non-scaffold module (`modules/contacts/module.yaml`; `moduleId: 88888888-8888-4888-8888-888888888888`). `modules/module-template/` exists as scaffold only and is explicitly excluded from the architecture graph (architecture_graph_spec.md §3.1.7).

**GOV-07 rule name:** "Single Pending Governance Action Per Target" (system.md §3).

**RLS policy names (verbatim, from `v1000-canonical-baseline.yaml`):** `rls_tenant_isolation`, `platform_role_assignment_platform_only`, `role_permission_map_platform_only`, `rls_platform_plane_select`/`rls_platform_plane_insert`, `tenant_roles_tenant_plane_only`, `tenant_role_permissions_tenant_plane_only`, `rls_encryption_keys_tenant_isolation`, `rls_encryption_key_versions_via_parent`, `rls_identity_binding_access`, `service_principals_platform_admin`, `service_principals_tenant_visibility`, `service_principal_audit_platform_only`.

**Governance triggers (verbatim):** `audit_log_no_update`, `audit_log_no_delete`, `trg_enforce_no_direct_tenant_writes_post_bootstrap`, `trg_enforce_pending_action_approval_roles`, `trg_apply_platform_tenant_lifecycle_on_approval`, `trg_enforce_no_direct_app_user_status_update`, `trg_enforce_no_direct_tenant_membership_status_update`, `trg_apply_user_lifecycle_on_approval`, `trg_emit_audit_on_pending_action_decision`, `trg_enforce_module_actions_maker_checker`, `trg_module_action_audit_*`, `trg_module_contacts_*`, `trg_enforce_identity_projection`, `trg_apply_tenant_branding_on_approval`, `trg_apply_service_principal_lifecycle`, `trg_enforce_service_principal_approval_roles` (system.md §7, "Governance Triggers" table).

**Architecture graph (`docs/required/platform_architecture_graph.yaml`, `graph_version: 2`, `source_system_sha256` pinned):** 7 node categories at Schema v1 — `governance`, `runtime_components`, `runtime_anchors`, `schema_entities`, `governance_entities`, `projection_entities`, `modules`. 21 closed edge types (6 of them — rows 16–21, `module_renders_page`, `module_declares_workflow`, `module_declares_permission`, `module_declares_approval_chain`, `module_publishes_dashboard`, `module_emits_notification` — are "metamodel-precursor," admitted to the closed set but emitting 0 edges today; architecture_graph_spec.md §5). Sample real edges: `pending_action --governance_projects_to--> tenant_module`, `TenantAwareDataSource --runtime_binds_guc--> app_tenant_id_guc`, `app_tenant_id_guc --runtime_guc_gates--> rls_isolation`, `CONTACTS --module_governs_via--> pending_action`.

**Runtime validator harness (constitutional smoke set, `validator/validation/validators/smoke_anchor.json` + `validators.json`):** `V01`–`V06` are `tier: smoke` (PR-blocking, CI-constitutional); `V07`–`V11`+ are `tier: extended` (non-blocking). Real V01–V06 descriptions are quoted in Chapter 8 below.

**ArchUnit test class:** `com.prsbnjs.architecture.ArchitectureTest` (file: `backend/src/test/java/com/prsbnjs/architecture/ArchitectureTest.java`).

**Governance Program Board artifacts:** `docs/governance/board/program_board.yaml`, `governance_ledger.jsonl`, `debt_ledger.jsonl`, `insertion_registry.jsonl`, `program_board.schema.json` (system.md §16.1).

**ADR IDs:** `ADR-TR-001` through `ADR-TR-011` (Tenant-Realm program; all APPROVED and archived to `docs/archive/decisions/` after Release 0.7 certification 2026-06-13 — system.md §20).

---

## Chapter 1 — What PRSMTD Is

- PRSMTD is a multi-tenant governance/administration platform with a Spring Boot/Java 21 backend, Next.js/TypeScript frontend, PostgreSQL + Liquibase data layer, and Docker Compose + `platformctl` orchestration (system.md capability inventory; confirmed structurally by `release_1_0_readiness_assessment_and_certification.md` §2: "a single Java/Spring Boot (`backend/`) + Next.js (`frontend/`) + Postgres/Liquibase (`db/`) + Python orchestration (`tools/platformctl/`) monorepo").
- The authoritative specification is a single file, `system.md`, explicitly marked as winning over all other documentation on any conflict (system.md §1, "Authority" banner: "This file is the sole authoritative, rebuild-critical architecture specification for PRSMTD... On any conflict, this document wins").
- The platform currently ships exactly one live business module, `CONTACTS` — "a governed contact entry workflow with maker–checker approval" (`modules/contacts/module.yaml`), described in system.md §9 as "the reference implementation module for the platform." A second directory, `modules/module-template/`, is scaffolding only and is explicitly excluded from the architecture graph (architecture_graph_spec.md §3.1.7).
- A prior structural expansion that added three additional modules (BILLING, NOTIFICATIONS, ADMIN) was later "surgically de-expanded" and retired via `PR-RESET-02` (system.md §15 heading: "v1 Structural Expansion Charter (RETIRED — DEFERRED via PR-RESET-02)"; `program_board.yaml` items `BD-S-001`–`BD-S-006`). This is an honest, citable fact worth using in the film: the platform demonstrably prunes speculative surface rather than accumulate unused scaffolding.
- **Thin spot:** there is no separate "product vision" document in PRSMTD analogous to ERM's `01-vision`; the platform's purpose is inferred from system.md's Overview (§1) and the module/governance machinery itself, not from marketing prose.

---

## Chapter 2 — Architectural Philosophy (constitutional design, invariants, immutable baseline, validator-enforced governance)

- The repository explicitly uses constitutional language: system.md is called "AUTHORITATIVE and rebuild-critical" throughout (repeated "Authority statement" blocks at the head of §4, §5, §6, §7, §8, §9, §11), and later sections (§16–§17) formalize a "Compliance Gate" (`.project/agent/compliance_guard.md`) and a "Governance Program Board" as *derived, not authoritative* control layers (system.md §16.1: "The board's authority is strictly derived from this document... If the board ever conflicts with this document, this document wins").
- **Six global system invariants (I1–I6), closed set (system.md §11):**
  1. **I1 — Closed-world routing:** "Any route not explicitly enumerated... is forbidden."
  2. **I2 — Maker–checker governance (banking-grade):** no direct lifecycle mutation, maker ≠ checker, role presence required at decision time.
  3. **I3 — Plane separation:** hard boundary between PLATFORM (control-plane) and TENANT (data-plane).
  4. **I4 — Tenant isolation (database-enforced):** FORCED RLS anchored on GUCs `app.plane`/`app.user_id`/`app.tenant_id`.
  5. **I5 — Deterministic rebuild (Docker-only; byte-sensitive):** pinned image tags, sealed snapshot hashes, LF-only inputs; scoped to dev/CI, with a distinct Production Credential Policy for prod (system.md §11).
  6. **I6 — Action Type Canonical Consistency:** the `pending_action.action_type` set is closed and exhaustive; "no additional values may be introduced anywhere in the system."
- **Liquibase baseline immutability (system.md §7, "Baseline immutability lock"):** "Liquibase baseline is immutable starting from Git tag: `release-1.0`." At the time system.md was written, `release-1.0` did not yet exist (repository at `release-0.35`), so the lock is described as *not yet in effect* — a documented pre-lock phase, not a violation. Enforcement mechanism named explicitly: `scripts/ci/enforce_baseline_immutability.sh`.
- **Governance Program Board universal phase law (system.md §16.3):** every structural change must pass through six ordered phases — **Charter → Schema → Runtime → Graph → Validator → Capstone** — with each phase's required output and compliance class specified in a table, and "out-of-order" transitions explicitly forbidden ("Phase Schema before Phase Charter → forbidden," etc.). "Multi-phase merging... is forbidden unless explicitly authorized."
- **Runtime Validator Harness is called a "constitutional control surface"** on par with RLS, ExecutionContext binding, and the Compliance Gate (system.md §17.1: "belongs to the platform's enforcement layer in the same class as RLS, the ExecutionContext binding, and the Compliance Gate").
- **Two distinct validator surfaces, not to be conflated (system.md §17.2):** the *runtime validator* (`validator/`, live HTTP requests against a running stack) vs. the *architecture validator* (static graph baselines, WARN→ERROR rule promotion over `docs/required/platform_architecture_graph.yaml`). "Treating runtime tier promotion as architecture-validator promotion... is a doctrinal violation and MUST be REJECTED."
- This is a genuinely unusual amount of self-governance machinery for a platform of this scope — worth foregrounding in the film as "the architecture governs its own evolution," not just runtime behavior.

---

## Chapter 3 — Platform Architecture (layering, modules, governance services, runtime pipeline, module registry, handler architecture)

- **Strict layering, ArchUnit-enforced, real test file** `com.prsbnjs.architecture.ArchitectureTest` (file: `backend/src/test/java/com/prsbnjs/architecture/ArchitectureTest.java`, lines 14–102):
  - Doc comment: "Enforce strict package boundaries for ASVS L3, multi-tenant RLS, and auditability. Rules are written to support the target structure: `api -> service -> persistence`. controllers package must not exist; API is the only HTTP layer." (line ~15–18)
  - `api_must_not_access_persistence_or_jdbc()` — `noClasses().that().resideInAnyPackage("com.prsbnjs.api..").should().dependOnClassesThat().resideInAnyPackage("..persistence..", "org.springframework.jdbc..")` (line ~27–32).
  - `api_layer_allowed_dependencies_only()` — API may only depend on `api`, `service`, `security`, `domain`, `observability`, and framework/stdlib packages (line ~35–52).
  - `service_layer_allowed_dependencies_only()` — service may depend on `service`, `persistence`, `security`, `domain`, `audit`, `observability` (line ~55–74).
  - `security_must_be_isolated_from_api_service_persistence()` — security package must not depend on `com.prsbnjs.api..` (line ~77–82).
  - `persistence_must_not_depend_on_higher_layers()` — persistence must not depend on `service` or `api` (line ~85–93).
  - `controller_package_must_not_exist()` — literally asserts a `..controller..` package is empty (line ~96–102), matching system.md's repeated "no controller package" doctrine (system.md §16.10, §17.6).
- **Module framework (system.md §9) — canonical governance flow, quoted verbatim:**
  ```
  module manifest (modules/{code}/module.yaml)
        ↓
  startup module scanner (ModuleCatalogRegistrar)
        ↓
  modules catalog table (INSERT ON CONFLICT DO NOTHING)
        ↓
  platform governance (pending_action ledger)
        ↓
  projection trigger (on pending_action.status = APPROVED)
        ↓
  tenant_module (projection state)
        ↓
  runtime reads (read-only for application)
  ```
  (system.md §9, "Canonical flow (authoritative)")
- **Module Lifecycle phases (table, system.md §9):** Module discovery → Module registration → Module governance bootstrap (`ensure_module_governance(tenant_id, module_id)`, idempotent) → Module enablement (via `pending_action`, `action_type = MODULE_ENABLE`) → Module execution → Module disablement → Module upgrade.
- **Real module manifest** (`modules/contacts/module.yaml`, full file read) — key excerpt:
  ```yaml
  module:
    moduleId: "88888888-8888-4888-8888-888888888888"
    code: CONTACTS
    version: "1.0.0"
  permissions: [CONTACTS_CREATE, CONTACTS_APPROVE, CONTACTS_VIEW]
  roles: [CONTACTS_MAKER, CONTACTS_CHECKER, CONTACTS_VIEWER]
  roleTypes:
    CONTACTS_MAKER: MAKER
    CONTACTS_CHECKER: CHECKER
    CONTACTS_VIEWER: VIEWER
  routes: [/modules/CONTACTS]
  tables: [module_contacts_contacts, module_contacts_contact_action_audit]
  workflows:
    CONTACTS_SUBMIT: {requiresApproval: true, makerRole: CONTACTS_MAKER, checkerRole: CONTACTS_CHECKER}
  ```
- **Module ownership rules (OWN-03, OWN-04, system.md §7):** "Modules cannot modify tables owned by other modules... Module migrations must remain compatible with platform upgrades. Destructive operations... require `-- migration-breaking-change-approved`." Enforced by `scripts/verify/module_schema_boundary_guard.py` and `scripts/verify/module_migration_compatibility_guard.py`.
- **Frontend module discovery is dynamic, not hardcoded:** "Frontend navigation is built dynamically from `GET /api/v1/modules` and `GET /api/v1/modules/{id}/execution-context`" (system.md §9, principle 2) — this matches ERM's own CLAUDE.md capability-inventory note about the "Frontend Hardcoding Guard."
- **Runtime request pipeline (exact ordered chain, both from system.md §5 prose and the architecture graph's `runtime_pipeline` edge set, architecture_graph_spec.md §5.4):**
  ```
  ObservabilityTraceMdcFilter (pre-auth)
    → JwtActorAuthenticationConverter
    → ActorIdResolver
    → ExecutionContextEstablishmentFilter
    → ObservabilityEnforcementFilter (post-establishment)
    → RequestExecutionContext
    → ExecutionContext
    → ExecutionContextInterceptor
    → TenantAwareDataSource
  ```
  (system.md §4.1 "Observability filter chain" + §5 "Request lifecycle"; graph edges confirm this exact 8-node chain, `platform_architecture_graph.yaml` lines 818–842).
- **Anti-pattern explicitly forbidden (system.md §9):** "migration-driven lifecycle" — Liquibase changesets that insert `modules` catalog rows, or "platform seed" inserts for `tenant_module`/`module_roles`/`module_role_assignment`. Modules must register themselves at runtime, not via seed data.

---

## Chapter 4 — Multi-Tenant Architecture (tenant isolation, realm isolation, ExecutionContext, TenantAwareDataSource, context propagation)

- **`ExecutionContext` — real Java final class** (file: `backend/src/main/java/com/prsbnjs/security/context/ExecutionContext.java`, full file read, 55 lines):
  ```java
  public final class ExecutionContext {
      private final UUID actorId;
      private final ExecutionPlane plane;
      private final UUID tenantId;
      private final ActorType actorType;

      public ExecutionContext(UUID actorId, ExecutionPlane plane, UUID tenantId, ActorType actorType) {
          ...
          if (plane == ExecutionPlane.PLATFORM) {
              if (tenantId != null) throw new IllegalArgumentException("PLATFORM plane requires tenantId to be null");
          } else if (plane == ExecutionPlane.TENANT) {
              if (tenantId == null) throw new IllegalArgumentException("TENANT plane requires tenantId");
          }
      }
  }
  ```
  This is the literal enforcement point of plane/tenant coupling at construction time — not just documentation (file: `ExecutionContext.java`, lines 6–32).
- **Binding contract JSON shape (system.md §5):** `{"actor_id": "uuid", "actor_type": "USER | SERVICE", "plane": "PLATFORM | TENANT", "tenant_id": "null | uuid"}`.
- **`TenantAwareDataSource` — real class** (file: `backend/src/main/java/com/prsbnjs/persistence/rls/TenantAwareDataSource.java`, doc comment lines 37–49): "Ensures PostgreSQL session GUC `app.tenant_id` is set on the SAME JDBC connection used by downstream JPA/JDBC operations, with RESET-first semantics to prevent leakage across pooled connection reuse... RLS policies are anchored on `NULLIF(current_setting('app.tenant_id', true), '')::uuid`."
  - Real GUC-binding SQL confirmed in the same file: `RESET app.plane` / `RESET app.user_id` / `RESET app.tenant_id` on every connection borrow (line ~137–147), then `SELECT set_config('app.plane', ?, true)`, `SELECT set_config('app.tenant_id', ?, true)`, `SELECT set_config('app.user_id', ?, true)` (lines 210, 226, 237) — i.e. transaction-local (`true` = local), not session-global, so bindings cannot leak to the next pooled use.
  - system.md §5 states application code "MUST NOT issue `SET` / `set_config` / `RESET` directly" — `TenantAwareDataSource` is "the only component permitted to bind PostgreSQL GUCs."
- **Tenant resolution is derived from the JWT issuer, not embedded in the token (system.md §5, "JWT Issuer Derivation Path"):**
  ```
  JWT.iss → tenant_identity_provider.issuer_uri (lookup) → tenant_id → ExecutionContext
  ```
  Runtime derivation chain: `TenantRealmRegistry.isRegisteredIssuer(issuer)` pre-validation → per-issuer cached `NimbusJwtDecoder` → full JWT validation (signature, expiry, audience, strict `iss` equality) → `JWT.iss → tenant_identity_provider.issuer_uri → tenant_id` (O(1) DB lookup) → `JWT.sub → identity_binding(tenant_id, external_user_id) → app_user_id` → `ExecutionContext{actor_id, plane, tenant_id}`.
- **Identity key formalized as a composite (ADR-TR-005, system.md §5):** `Identity = (tenant_id, subject)` where `subject` is the Keycloak-assigned UUID, "stable within realm; not reused."
- **Real `identity_binding` lookup SQL quoted in system.md §5:** `SELECT ab.app_user_id FROM identity_binding ab WHERE ab.tenant_id = <derived_tenant_id> AND ab.external_user_id = <Jwt.sub UUID>` — "the only permitted database access when no request execution context exists."
- **`ExecutionPhase` model, closed 4-state set (system.md §5 table):** `INITIAL_BOOTSTRAP` → `IDENTITY_RESOLUTION` → `REQUEST_CONTEXT_ACTIVE` (transaction required) → `BUSINESS_EXECUTION` (transaction required). A `PHASE_CONTEXT_COHERENCE_VIOLATION` fail-fast `IllegalStateException` fires if an `ExecutionContext` exists but the phase holder is unexpectedly `null` (system.md §5, "Phase-context coherence invariant").
- **Realm-per-tenant isolation (ADR-TR-001/002/004/006/007/010, system.md §6/§11):** One dedicated platform Keycloak realm plus one realm per tenant. "A platform administrator's Keycloak account exists only in the platform realm. No platform admin account exists in any tenant realm." Cross-realm token rejection is pre-validation, before decoding: `TenantRealmRegistry.isRegisteredIssuer(issuer)` throws `InvalidBearerTokenException("Unrecognized issuer")` for unregistered issuers, and this specifically blocks decoder-lookup / resource-exhaustion attacks (system.md §5, "Pre-validation security requirement").
- **Wildcard DNS/TLS model (ADR-TR-010, system.md §11):** `*.prsmtd.com` A record covers all tenant subdomains with no per-tenant DNS/TLS provisioning; `platform.prsmtd.com` is the dedicated platform admin entry point.
- **Realm Factory provisioning sequence, 8 ordered steps (system.md §11):** TENANT_CREATE approval → branding record → IdP record (`is_enabled=false`) → Realm Factory provisions Keycloak realm + OIDC clients + service account → IdP enabled (`is_enabled=true`, `TenantRealmRegistry` now trusts the issuer) → admin provisioning → MODULE_ENABLE governance → TENANT_ACTIVATE governance.
- **Tenant lifecycle FSM, closed set (ADR-TR-007, system.md §7):** `PENDING →[TENANT_ACTIVATE]→ ACTIVE →[TENANT_SUSPEND]→ SUSPENDED →[TENANT_RECOVER]→ ACTIVE`; `ACTIVE`/`SUSPENDED` →[`TENANT_ARCHIVE`]→ `ARCHIVED` (terminal, no recovery path).

---

## Chapter 5 — Security Architecture (defense in depth, authN/authZ, RBAC, permission model, runtime enforcement, security middleware)

- **Three hard-separated RBAC domains, closed set (system.md §8):** Platform RBAC, Tenant RBAC, Module RBAC. "Cross-domain authorization is forbidden except where explicitly declared."
  - Platform: `platform_role_assignment` + `role_permission_map` + global `permissions` catalog. "`role_permission_map` MUST NOT be used for tenant authorization" (repeated as a hard rule in §6, §7, §8 — a genuinely triple-enforced invariant worth calling out).
  - Tenant: `tenant_roles` + `tenant_role_permissions` + `tenant_membership.role`.
  - Module: closed role-type set `MAKER` | `CHECKER` | `VIEWER` only.
- **Governance decision symmetry (system.md §7):** Proposal requires `ADMIN + MAKER`; decision (approve *or* reject) requires `ADMIN + CHECKER`. Separation of duties enforced at the database level: `CONSTRAINT ck_pending_action_maker_checker_distinct CHECK (approved_by IS NULL OR approved_by <> created_by)` (file: `db/liquibase/changes/v1000-canonical-baseline.yaml`, `pending_action` DDL, line ~254). This is a DB constraint, not merely application logic — worth showing on screen as literal SQL.
- **Real `pending_action` DDL (file: `v1000-canonical-baseline.yaml`, lines 241–267)** — full closed-set CHECK constraint and `FORCE ROW LEVEL SECURITY`:
  ```sql
  CREATE TABLE public.pending_action (
      id uuid NOT NULL, tenant_id uuid,
      plane text DEFAULT 'TENANT' NOT NULL,
      action_type text NOT NULL, payload jsonb NOT NULL,
      created_by uuid NOT NULL, approved_by uuid, status text NOT NULL,
      ...
      CONSTRAINT ck_pending_action_action_type CHECK (action_type = ANY (ARRAY[19 literal values])),
      CONSTRAINT ck_pending_action_maker_checker_distinct CHECK (approved_by IS NULL OR approved_by <> created_by),
      CONSTRAINT ck_pending_action_plane_tenant_invariant CHECK (
          (plane='PLATFORM' AND tenant_id IS NULL) OR (plane='TENANT' AND tenant_id IS NOT NULL)),
      CONSTRAINT ck_pending_action_status CHECK (status = ANY (ARRAY['PENDING','APPROVED','REJECTED','EXPIRED']))
  );
  ALTER TABLE ONLY public.pending_action FORCE ROW LEVEL SECURITY;
  ```
- **Threat model, real and current (`docs/reports/bd_o_907_platform_threat_model_capstone.md`):** canonical threat model lives at `docs/guides/platform_threat_model.md`, containing **12 trust boundaries (TB1–TB12)**, **7 security domains**, **9 asset classes**, **9 entry points**, **8 attack surfaces**, **9 threat actor profiles**, **17 STRIDE-tagged threat scenarios (T1–T17)**, and a **residual risk register (RR1–RR6)**.
  - **T2** (from the report table): "Forged/blank `app.tenant_id` GUC to impersonate another tenant or the platform plane" — mitigation: "Single centralized GUC setter (`TenantAwareDataSource`); app code forbidden from direct `SET`/`RESET`." Residual: "Concentrated control; mitigated by ArchUnit + RLS fuzz CI."
  - **T6:** "Missing/weak RLS leaks cross-tenant rows" — mitigation: "RLS ENABLED+FORCE on every tenant-plane table; CI RLS fuzz." Residual (**RR1**): "`BYPASSRLS` roles (`prsmtd_discovery`, `prsmtd_reconciliation`) are a concentrated bypass surface."
  - **T11:** "Volumetric requests against unauthenticated `GET /api/v1/realm-discovery`" — finding: "actual implementation is advisory-only" rate-limiting, tracked as new board item `BD-O-908`, residual risk `RR3`.
  - **T13:** "Platform admin attempts tenant-plane data access" — mitigation: "Hard prohibition (system.md §6); platform scope never sets `app.tenant_id`; RLS platform guard." Residual: "None new."
- **RLS coverage gap, honestly disclosed and dispositioned (`release_1_0_readiness_assessment_and_certification.md` §5):** "All 22 tenant/platform-plane tables... that carry a `CREATE POLICY` also carry `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. 20 of those 22 also carry `FORCE ROW LEVEL SECURITY`. Two tables — `platform_role_assignment` and `role_permission_map` — have `ENABLE` + policies but lack `FORCE ROW LEVEL SECURITY`." Assessed as low/no exploitability because the application's normal connection role `prsmtd_app` has `NOINHERIT LOGIN`, no `BYPASSRLS`, and is not the table owner — RLS applies regardless of `FORCE` for that role. Disposition: "flagged as a recommended pre-tag hardening item, not a blocker." This is a strong example for the film of transparent, evidence-based risk disclosure rather than a claimed-clean state.
- **A retired/archived enforcement script, honestly dispositioned (`docs/reports/bd_o_905_tenant_context_guard_disposition_capstone.md`):** `scripts/verify/tenant_context_guard.py` was found to be an orphaned, never-wired-in, ad hoc debugging script (single commit origin) that additionally failed to complete (270+ seconds CPU, zero output) against the current 298-file codebase. Decision: retire/archive, with explicit reasoning that "the invariant it targets is already enforced in depth by RLS... and the centralized GUC boundary, independent of this script — archiving it removes no currently-enforced guarantee." Good evidence that PRSMTD's governance process actively prunes non-functional controls rather than leaving decorative tooling in place.
- **Error response contract, closed set (system.md §4/§10):** `UnauthenticatedException` → 401 `{"error": "<message>"}`; `ForbiddenException` → 403; `IllegalStateException` → 400 (with `timestamp`/`status`/`error`/`message`); generic `Exception` → 500.
- **Production credential policy (system.md §11):** forbidden-value doctrine for `APP_DB_PASSWORD`/`POSTGRES_PASSWORD`/`SPRING_DATASOURCE_PASSWORD`/`KC_ADMIN_PASSWORD` in production (`postgres`, `admin`, `password123!`, empty string all explicitly forbidden); enforced by a `@Profile("prod")` Spring bean `CredentialSafetyValidator` that calls `System.exit(1)` on violation, distinct from the DEV/CI deterministic-fixture requirement (`KC_ADMIN_PASSWORD=admin` is *required* in DEV/CI, *forbidden* in prod — a deliberately environment-scoped rule, not a contradiction).

---

## Chapter 6 — Identity Architecture (Keycloak, tenant realms, role mapping, permission resolution, token/issuer/audience validation)

- **Real `JwtActorAuthenticationConverter`** (file: `backend/src/main/java/com/prsbnjs/security/auth/JwtActorAuthenticationConverter.java`, doc comment lines 27–48): "Authentication converter that resolves the composite identity key (tenant_id, sub) to internal actor id (app_user.id) and stores it as the principal name." Documented derivation chain in the source itself:
  ```
  JWT.iss → TenantRealmRegistry → tenant_id
  (tenant_id, JWT.sub) → identity_binding → app_user_id   [primary path]
  JWT.sub → app_user.external_user_id                     [legacy fallback]
  ```
  Principal name is always `app_user.id` (internal UUID) or the literal string `"unresolved:<sub>"` on failure — never the raw Keycloak `sub`.
- **JWT validation invariants (system.md §5, "JWT Authentication" and "Invariants"):** valid signature, strict issuer equality (`Jwt.iss == PLATFORM_ISSUER_URI` for platform tokens; per-tenant issuer for tenant tokens), audience match against `spring.security.oauth2.resourceserver.jwt.audiences` (e.g. `aud` includes `prsmt-api`). "No fallback or multi-issuer support is permitted" beyond the registered set. `Jwt.sub` is explicitly called "an external identity" that "MUST NOT be used directly for database/RLS binding" (system.md §5).
- **`PLATFORM_ISSUER_URI` vs `OAUTH_ISSUER_URI` (system.md §6):** `PLATFORM_ISSUER_URI` is the authoritative platform-realm issuer env var, eagerly initialized at Spring context startup; `OAUTH_ISSUER_URI` is explicitly deprecated.
- **Cross-realm rejection is structural, not a runtime check on content (system.md §6):** platform tokens presented to tenant endpoints fail `isRegisteredIssuer()` pre-validation (rejected *before* decoding); tenant tokens presented to platform endpoints fail the platform decoder's strict issuer-equality check. "Tokens from an unknown issuer... are rejected by `isRegisteredIssuer()` pre-validation."
- **Service-principal (machine) authentication is claims-based, zero-DB-read on the hot path (system.md §5, "ActorType.SERVICE — Runtime Authentication Path", Program 4 Step 2):** a client-credentials JWT carries hardcoded claims (`actor_type=service`, `service_principal_id`, `allowed_scopes`, `allowed_tenants`, `sp_status`) published onto a dedicated Keycloak confidential client at `SERVICE_PRINCIPAL_CREATE/_ROTATE/_REVOKE` governance approval. The runtime path "MUST NOT query `service_principals`" — authorization is self-contained in the signed token, an explicit, owner-confirmed trade-off (already-issued tokens remain valid until their short TTL expires even after revocation — "an accepted client-credentials revocation trade-off, not a defect").
- **Permission derivation is scope-conditional (system.md §4/§8):** when `context.scope="platform"`, permissions derive from `role_permission_map` for roles in `platform_role_assignment`; when `context.scope="tenant"`, permissions derive from `tenant_role_permissions` for the role in the selected tenant's `tenant_membership.role`. The two paths never merge.
- **Realm Factory idempotency and per-realm service accounts (ADR-TR-007, system.md §11):** "Each tenant realm MUST receive its own dedicated Keycloak service account with minimum required permissions. The master-realm admin credential model (one global admin for all realms) is FORBIDDEN."
- **Thin spot:** no Keycloak realm-export JSON or `bootstrap.sh` content was read in this pass (referenced by path in system.md §11/§13 as `scripts/keycloak/bootstrap.sh` but not opened); the identity chapter is grounded in system.md prose plus two real Java source files, not a live realm config dump.

---

## Chapter 7 — Data & Audit Architecture (Postgres, RLS, append-only audit, governance evidence, pending actions, immutable traceability)

- **RLS Policy Summary — the full authoritative table, system.md §7 (verbatim, reproduced because it is the single best on-screen table for the film):**

  | Table | Policy | Behavior |
  |---|---|---|
  | tenant_membership | rls_tenant_isolation | Self or tenant admin; WITH CHECK false |
  | actions | rls_tenant_isolation | has_active_membership |
  | audit_log | rls_tenant_isolation | app.plane='tenant', has_active_membership |
  | pending_action | rls_tenant_isolation | Branches by plane: TENANT (membership) or PLATFORM (platform roles) |
  | platform_role_assignment | platform_role_assignment_platform_only | app.plane='platform' |
  | service_principals | service_principals_platform_admin / service_principals_tenant_visibility | Platform-admin: full access; tenant-plane: read-only `allowed_tenants` array-containment |

  **Tables without RLS** (explicit closed list, system.md §7): `tenants`, `app_user`, `permissions`, `modules`, `system_bootstrap_state`, `platform_audit_event_type`, `governance_action_mutex_group`.
- **Real `CREATE POLICY` SQL** (file: `db/liquibase/changes/v1000-canonical-baseline.yaml`, lines 666–718), e.g.:
  ```sql
  CREATE POLICY rls_tenant_isolation ON public.audit_log USING (
    (current_setting('app.plane', true) = 'tenant')
    AND (tenant_id = public.current_tenant_uuid())
    AND (public.current_user_uuid() IS NOT NULL)
    AND internal_security.has_active_membership(tenant_id, public.current_user_uuid())
  ) WITH CHECK (... AND actor_id = public.current_user_uuid() ...);
  ```
  This shows the RLS predicate is not just tenant-scoped but actor-scoped on write (`actor_id = current_user_uuid()`), preventing a tenant member from writing an audit row attributed to someone else.
- **Append-only audit tables, closed set (architecture_graph_spec.md §4.3, cross-checked against system.md §7 triggers):** `audit_log`, `pending_action`, `platform_audit_log`, `module_action_audit`, `module_contacts_contact_action_audit`, `service_principal_audit` — enforced by paired `_no_update`/`_no_delete` triggers that unconditionally `RAISE EXCEPTION` (system.md §7, e.g. `trg_service_principal_audit_no_update`/`_no_delete`).
- **`audit_emits` edge set — exactly 6 edges, fixed and closed (architecture_graph_spec.md §5.3):**
  `pending_action→audit_log`, `pending_action→platform_audit_log`, `pending_action→service_principal_audit`, `module_actions→module_action_audit`, `module_contacts_contacts→module_contacts_contact_action_audit`, `actions→audit_log`. "No other `audit_emits` edges are permitted."
- **GOV-07 dedup rule (system.md §3):** "For any logical governance target, the system MUST NOT allow more than one PENDING action of the same type," enforced at the application service layer (not a DB constraint), scoped per-plane so PLATFORM and TENANT actions never conflict.
- **Bootstrap Governance Exception (system.md §7):** the *only* documented, narrowly-scoped bypass of `pending_action` — initial tenant membership provisioning may skip governance, but only when a tenant has zero memberships, only in PLATFORM plane, must be idempotent, and must be audit-logged (`platform_audit_log`, event `TENANT_BOOTSTRAP_MEMBERSHIP`). This is a good "why the exception doesn't break the invariant" beat for the film — the exception is itself audited and singular.
- **`module_role_assignment` and `tenant_module` are projection-only** — populated exclusively by DB trigger on `pending_action.status = APPROVED`; "Application code and repositories MUST NOT INSERT or DELETE" them directly (system.md §7, §9). This is the "Governance Ledger + Projection" pattern referenced in ERM's own CLAUDE.md capability inventory.
- **Deterministic Trace Contract T1–T7 (system.md §4.1)** — a closed, versioned event taxonomy (`schema_version: 1`) for offline-reconstructible request tracing: canonical events include `http.request.begin/end`, `auth.jwt.validated`, `tenant.selection`, `ec.create.attempt/result`, `db.guc.bind`, `db.guc.snapshot`, `dao.<entity>.query.begin/end`, `error.captured`. Explicitly forbids raw JWTs, claims, PII, or raw tenant/user identifiers in trace output — only opaque `sql_id`, booleans, and enums. "5xx sampling bypass": any 5xx response forces full (non-sampled) trace emission.

---

## Chapter 8 — Governance Architecture (governance ledger, validator architecture, promotion model, program board, compliance gates, architecture graph validation)

- **Governance Program Board — six lanes, closed set (system.md §16.5):** `STRUCTURE` (new modules/schema/governance domains — `CHARTER_INSERTION` only), `BEHAVIORAL`, `PROMOTION` (validator WARN→ERROR candidates), `MATURITY`, `OPERATIONAL`, `DEBT`.
- **Nine-bucket lifecycle, strict left-to-right with a `DEFERRED` branch (system.md §16.6):**
  ```
  PROPOSED → CHARTER_REQUIRED → CHARTERED → SCHEDULED → IN_PROGRESS → LANDED → VERIFIED → CLOSED
                                                                          ↳ DEFERRED
  ```
  "`VERIFIED` and `CLOSED` items are immutable in `program_board.yaml` (corrections are new ledger rows, never edits to existing buckets)."
- **Three insertion paths, mutually exclusive per item (system.md §16.4):** `CHARTER_INSERTION` (structural change, requires a landed system.md amendment first), `PROMOTION_INSERTION` (validator rule promotion), `OPERATOR_INSERTION` (behavioral/operational/debt only — "STRUCTURE lane MUST NOT use `OPERATOR_INSERTION`. Any STRUCTURE-lane item inserted via `OPERATOR_INSERTION` is invalid; the Compliance Gate MUST REJECT it.").
- **Append-only ledgers (system.md §16.8):** `governance_ledger.jsonl` (operations: `INSERTED`, `CHARTERED`, `SCHEDULED`, `STARTED`, `LANDED`, `VERIFIED`, `CLOSED`, `DEFERRED`, `AMENDED` — "rows are NEVER updated or deleted. Corrections are themselves new rows.") and `debt_ledger.jsonl` (recognized-but-unclosed governance debt, each row carrying `forbidden_workarounds` — e.g. for `MOD-004`: "forbidden — removing entries from `cfg.platform_scaffolding_entities`... cosmetic promotion without graph expansion").
- **Board is derived, not authoritative — explicit forbidden-uses list (system.md §16.1):** the board must not weaken any I1–I6 invariant, bypass the Compliance Gate, silence a validator rule, admit unapproved governance debt, or schedule schema work without a prior system.md amendment.
- **Live board state (as recorded in `docs/governance/board/README.md`, 2026-08-07):** "84 items, 0 errors, 4 warnings"; "PROGRAM 3 IS COMPLETE" (all 5 exit-gate criteria independently re-verified against live evidence).
- **Architecture graph validator vs runtime validator — kept doctrinally separate (system.md §17.2):** the architecture validator (`scripts/architecture/validate_architecture_graph.py`, `docs/required/validator_config.json` + `validator_promotion_matrix.json`) checks *static graph baselines and rule promotion*; the runtime validator (`validator/`) checks *a live running stack*.
- **Runtime validator constitutional smoke set — exactly 6 validators, paired-artifact contract (system.md §17.4; `validator/validation/validators/smoke_anchor.json` + `validators.json`):**
  - `V01` — "Verify platform admin has PLATFORM_ADMIN role (inferred via GET /api/v1/modules = 200)."
  - `V02` — "Verify tenant selection validation (platform-plane gate, returns 400 on invalid selection) is distinct from tenant-plane authorization (returns 403 when cookie is tampered post-binding). `POST /api/v1/session/tenant` must never return 403."
  - `V03` — "Verify tenant-plane authorization is enforced after context establishment: cookie tampering to access a different tenant's resources must return 403."
  - `V04` — "Verify deterministic consent fixture exists and is status=granted (fail fast if drifted)."
  - `V05` — "Verify tenant-scoped query executes successfully (no transaction guardrail errors)."
  - `V06` — "Detect bidirectional tenant leakage: Tenant1 must see its consent id; Tenant2 must not see Tenant1 consent id."
  - Governing rule: "The set of runtime validators carrying `tier: smoke` MUST equal the set declared in the constitutional smoke-tier anchor artifact... Drift in either direction... MUST fail CI." (system.md §17.4). `V07`–`V11` exist at `tier: extended` (non-blocking) — e.g. `V11`: "A token issued by tenant1's own realm must be rejected... when the session attempts to bind tenant2 scope... proving cross-realm isolation, not just cross-tenant-cookie isolation."
- **Architecture graph as CI-enforced ground truth (architecture_graph_spec.md §6, exact-match thresholds):** e.g. `runtime_binds_guc` count must equal exactly 3; `audit_emits` must equal exactly 6; `foreign_key` count must be ≥ 36 (currently 37); total edges ≥ 100; invariant coverage ≥ 90%. The generator has "exactly two terminal states: SUCCESS... and FAILURE (writes neither, returns non-zero)" — no partial/fallback output is permitted (architecture_graph_spec.md §9).
- **Deterministic, hash-pinned graph artifact:** `platform_architecture_graph.yaml` carries `source_system_sha256` computed from the bytes of `system.md` itself, so the graph is cryptographically tied to the exact spec text it was extracted from (architecture_graph_spec.md §7).

---

## Chapter 9 — End-to-End Request Lifecycle (Identity → ExecutionContext → Authorization → Module → Database → Audit → Governance → Response)

Assembled strictly from the components and orderings cited above (system.md §4.1, §5; `platform_architecture_graph.yaml` `runtime_pipeline` edges; real source files). A concrete tenant-plane write request (e.g., a `CONTACTS` module maker submitting a governed action):

1. **`ObservabilityTraceMdcFilter`** (pre-auth) — clears MDC, sets `trace_id`/`span_id`/`correlation_id` from the Micrometer tracer context (system.md §4.1).
2. **JWT authentication** — Spring Security OAuth2 resource server validates signature, strict issuer equality, and audience (`aud` includes `prsmt-api`) via a per-issuer cached `NimbusJwtDecoder`, selected only after `TenantRealmRegistry.isRegisteredIssuer()` pre-validation rejects unknown issuers before any decoding occurs (system.md §5, §6).
3. **`JwtActorAuthenticationConverter`** — resolves `(tenant_id via JWT.iss, JWT.sub) → identity_binding → app_user.id`; sets the Spring Security principal to the internal UUID, never the raw `sub` (file: `JwtActorAuthenticationConverter.java`).
4. **`ActorIdResolver`** — the `IDENTITY_RESOLUTION` phase's single allowed DB access; runs with no tenant context and no transaction requirement exemption beyond this phase (system.md §5, `ExecutionPhase` table).
5. **`ExecutionContextEstablishmentFilter`** (→ `ExecutionContextEstablishmentService`) — determines plane deterministically from closed-world route classification plus header/cookie tenant-selection agreement; "Plane MUST NOT be inferred from tenant membership presence/absence" (system.md §5).
6. **`ObservabilityEnforcementFilter`** (post-establishment) — bridges `ExecutionContext` into MDC (`plane`, `user_id`, `tenant_id`) and validates trace/plane/tenant-rule consistency (system.md §4.1).
7. **`RequestExecutionContext` → `ExecutionContext`** — the immutable, request-scoped `{actor_id, plane, tenant_id, actor_type}` object is constructed; plane/tenant coupling enforced in the constructor itself (`ExecutionContext.java` lines 22–30).
8. **`ExecutionContextInterceptor`** — pre-controller dispatch gate; `BUSINESS_EXECUTION` phase begins (system.md §5 phase table).
9. **`TenantAwareDataSource`** — on connection borrow: `RESET` all three GUCs, verify `row_security` is enabled (abort otherwise), then transaction-locally `set_config` `app.plane`/`app.user_id`/(`app.tenant_id` if tenant plane) (file: `TenantAwareDataSource.java`, lines 137–237; system.md §5).
10. **Module handler / service layer** (`CONTACTS` `ModuleExecutionHandler`) — checks module RBAC (`MAKER`/`CHECKER`/`VIEWER` via `module_role_assignment`), then `workflows.<action>.requiresApproval` from the manifest to decide direct execution vs. `pending_action` creation (system.md §9, "Operational execution flow").
11. **`pending_action` INSERT** — application-layer GOV-07 dedup check (no existing PENDING row for the same logical target/plane), DB-enforced closed-set `action_type` CHECK, `FORCE ROW LEVEL SECURITY` (file: `v1000-canonical-baseline.yaml` DDL).
12. **Checker approval** (separate request, same pipeline, different actor) — `trg_enforce_pending_action_approval_roles` validates `ADMIN+CHECKER` and `approved_by <> created_by`; on `APPROVED`, `trg_emit_audit_on_pending_action_decision` fires, writing to `audit_log`/`platform_audit_log` (append-only, `audit_emits` edges) and, for module actions, the module's own projection trigger updates `module_role_assignment` or the module's business table (system.md §7, §9).
13. **Observability** — throughout, if trace is enabled, `db.guc.bind`/`db.guc.snapshot`/`dao.<entity>.query.*` events are emitted with `correlation_id`, classifiable into `{AUTH, CONTEXT, GUC, RLS, DAO}` on failure (system.md §4.1).
14. **Response** — structured JSON per the closed error contract (401/403/400/500 shapes) or the endpoint's success payload; `ExecutionContextInterceptor.afterCompletion()` and the establishment filter's `finally` block both independently clear `ExecutionContext`/`ExecutionPhaseHolder` regardless of outcome (system.md §5, "ExecutionContext lifecycle guarantee").

This chapter has strong, literal source backing at every hop — the pipeline ordering is asserted three independent ways (system.md prose, the `runtime_pipeline` graph edges, and the real filter/converter Java source), which is worth stating on screen as a credibility point.

---

## Chapter 10 — Why This Architecture Matters (synthesis; cross-cutting observations grounded in the above)

- **The spec is the code's contract, not marketing:** the architecture graph is generated *from* `system.md` and hash-pinned to it (`source_system_sha256`); CI fails if the graph drifts from the spec text (architecture_graph_spec.md §9, `SourceMismatch`). This is a rare, verifiable claim: the documentation cannot silently diverge from what governs CI.
- **Tenant isolation is enforced in four independent, redundant places, not one:** the `ExecutionContext` constructor (Java, compile-time-adjacent invariant), `TenantAwareDataSource`'s RESET-first GUC binding (connection-pool-safe), PostgreSQL `FORCE ROW LEVEL SECURITY` policies (database-enforced, defense against buggy application code), and the runtime validator `V06` ("Detect bidirectional tenant leakage") which exercises this on a live stack in CI. A single bypass in any one layer does not compromise isolation.
- **Governance debt is tracked, not hidden:** the `debt_ledger.jsonl` mechanism, the RLS `FORCE` gap on two platform tables (disclosed, dispositioned, not silently fixed), and the retired `tenant_context_guard.py` script are all examples of the platform's own audit trail admitting imperfection candidly rather than presenting a falsely clean state — directly useful for a regulator/CISO audience that will distrust a platform claiming zero gaps.
- **The platform actively prunes, not just accretes:** the BILLING/NOTIFICATIONS/ADMIN structural expansion was chartered, built, and then deliberately reversed (`PR-RESET-02`) when it didn't meet the platform's own authenticity bar (GOV-015) — a genuine self-correction event recorded in the append-only governance ledger, not erased.
- **Constitutional language is backed by executable gates, not just prose:** every "MUST"/"forbidden" claim in system.md that this research could trace back to a script, trigger, or ArchUnit rule did resolve to one (layering → `ArchitectureTest.java`; RLS → real `CREATE POLICY` DDL; baseline immutability → `enforce_baseline_immutability.sh`; smoke validators → `smoke_anchor.json`/`validators.json` paired-artifact CI gate). The film can lean on "constitutional" as a literal description, not a metaphor.
- **Caveat for the narration:** a small number of Release-0.7 identity/realm claims (ADR-TR-001 through -011) are described in system.md as "Approved... Implementation deferred to Release 0.7" in some subsections and as already "certified (2026-06-13)" in §20 — the document itself notes this was reconciled ("Release 0.7 has been implemented and certified... all 11 ADRs have been archived"), so treat the multi-realm/Keycloak material as *implemented*, not aspirational, per the later, dated confirmation in §20, not the earlier "deferred" language that predates certification.

---

## Coverage notes for the scriptwriter

- **Strongest chapters (deep, multi-source evidence):** 3 (Platform Architecture), 4 (Multi-Tenant), 5 (Security), 7 (Data & Audit), 8 (Governance), 9 (Request Lifecycle) — each backed by both `system.md` prose and real source files (`.java`, `.yaml` DDL, `.json` validator config).
- **Thinner chapters:** 1 (What PRSMTD Is) has no dedicated "vision" document — grounded only in system.md's Overview and inferred from module/governance scope. 6 (Identity Architecture) is grounded in system.md prose plus two Java files (`JwtActorAuthenticationConverter.java`, referenced `TenantRealmRegistry`) but no live Keycloak realm-export JSON was read in this pass — if the film needs an on-screen realm config artifact, a follow-up read of `scripts/keycloak/bootstrap.sh` and any `docker/keycloak/**` realm JSON is recommended before scripting that segment.
- **Not covered in this pass (out of the requested priority list, flagged for completeness):** `docs/reports/cybersecurity_compliance_*` series and the remaining capstones (`bd_o_901`–`bd_o_910` except 905/907) were not opened individually; their titles (container hardening, dependency scanning/SBOM, Keycloak brute-force, key/credential rotation, security-header confirmation, realm-discovery rate limiting, temp-password visibility, precommit governance gate) suggest additional concrete security hardening evidence exists there if Chapter 5 needs more runtime than currently included.
