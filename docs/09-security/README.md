# 09 — Security

## Purpose

Defines Security as the shared enterprise security capability: the ERM-specific content that
sits on top of PRSMTD's authentication/RBAC mechanism (roles, permissions, threat models, and
Zero Trust / Privacy-by-Design application), plus — as of the authored spec below — a genuine
sixth authoritative module (`SECURITY`) governing security policy taxonomy, security
baselines, privileged access, secrets/key/certificate lifecycle, and security findings
(vulnerabilities, misconfigurations, policy violations).

## What belongs here

- Role catalog (Risk Owner, Compliance Officer, Internal Auditor, CISO, Board Risk
  Committee, Regulator-read, etc.) and permission sets per module, expressed as PRSMTD
  `roleMappings` — consolidated canonically in `01-security-management.md`
- Threat models per module/data class (especially for cyber governance and privacy modules)
- Data classification and privacy-by-design requirements (PII, sensitive risk data) — see the
  canonical Data Classification Scheme in `01-security-management.md`
- Segregation-of-duties rules (e.g., a Risk Owner cannot also be the Checker on their own
  risk acceptance) enforced via PRSMTD's maker-checker roles
- The `SECURITY` module's own domain model: security policy domains, security baselines,
  privileged access grants, secrets/key/certificate governance, and security findings
  (vulnerability/misconfiguration/policy-violation management)

## Cross-references

- [`../02-business-architecture/`](../02-business-architecture/) — personas this formalizes into roles
- [`../05-modules/`](../05-modules/) — module-scoped role/permission definitions
- [`../04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md)
  — bounded context map; now names `SECURITY` as a tenth, authored context (added Session 7,
  closing the gap `01-security-management.md` Assumption 1 originally discovered)
- `PRSMTD/docs/authoritative/system.md §6, §7, §8, §9, §11, §17, §21, §22` — security model,
  RLS, RBAC, module framework, network/secrets/TLS invariants, runtime validator harness
  doctrine, auth surface ownership, observability canonical access

## Status

Authored — [`01-security-management.md`](01-security-management.md) (Session 6, 2026-07-20).
Sixth authoritative, implementation-ready specification in this repository.
