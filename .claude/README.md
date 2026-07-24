# `.claude/` — Claude Code project configuration

## Purpose

This directory holds project-level configuration for Claude Code (the AI coding assistant)
when working in this repository. It is version-controlled so every contributor who opens this
repository with Claude Code gets the same low-friction, pre-approved command set — instead of
each person accumulating their own local approvals over time.

Today it contains one file, `settings.json`, whose `permissions.allow` list pre-approves the
exact, narrow set of commands needed to install dependencies for and verify the
[`../prototype/`](../prototype/) UX reference application (see `docs/roadmap.md`, Sessions 18
and 20) — the `run` skill, a bare `npm install` (matching `prototype/docs/README.md`'s
documented "How to run" step), a bare `npm ls` for post-install dependency sanity-checking, and
the three Playwright commands used for the browser-based verification pass (resolvability
check, version check, timed Chromium install). Pre-approving these exact commands avoids an
interactive permission prompt for routine, already-reviewed commands every session, without
granting anything broader.

Every entry in the current list is a bare command or an exact, fixed-argument invocation — none
use wildcards (`*`). This is a deliberate outcome of a Session 20 least-privilege review: earlier
wildcard entries (`npm install *`, `npm init *`, `npm ls *`) and two dead entries (a reference to
a `verify.js` script that never existed in the repository, and a `chromium-cli` tool not present
on any contributor's `PATH` or in the documented stack) were removed or narrowed. See the Session
20 roadmap entry for the full rationale.

## What belongs here

- `settings.json` — project-scoped Claude Code settings: permission `allow`/`deny` rules,
  and (if ever added) project-level hook definitions.
- Only entries that are:
  - **project-specific** (relevant to working in *this* repository),
  - **safe to share** with any contributor or CI runner,
  - **free of credentials, tokens, or API keys**,
  - **free of personal information** (no usernames, emails, personal file paths),
  - **free of machine-specific paths** (no absolute paths like `C:\Users\<name>\...`),
  - **free of temporary/session state** (no permission entries referencing scratch files or
    one-off scripts that aren't themselves committed to the repository).

## What must never be stored here

- Secrets, API keys, tokens, or credentials of any kind.
- Personal or machine-specific configuration (`settings.local.json`-style overrides, local
  file paths, per-developer environment variables).
- Broad, unscoped permission wildcards granted "just in case" — every `allow` entry should
  map to an actual, current need in this repository.
- Anything that duplicates or overrides the repository's actual governance rules in the root
  `CLAUDE.md` — `.claude/settings.json` controls *tool permissions*, not repository policy.

Local, per-developer overrides belong in `.claude/settings.local.json` instead, which must stay
untracked (add it to `.gitignore` if you create one).

## Guidance for future contributors

- Before adding a new `allow` entry, prefer the narrowest pattern that covers the actual
  command you need (e.g. a specific script invocation) over an open wildcard
  (e.g. `Bash(some-tool *)`) that would silently approve arguments you haven't reviewed.
- Remove entries once the command or script they reference no longer exists in the
  repository — a dangling permission for a deleted script is dead weight and misleading to
  the next contributor.
- If a command depends on a tool that isn't part of this repository's documented stack
  (Next.js/TypeScript for `prototype/`, per its own `docs/README.md`), confirm it's genuinely
  needed by the shared workflow before committing the permission — otherwise it's a
  personal/local tool that belongs in your own `settings.local.json`, not here.
- This repository is specification-first (see root `CLAUDE.md`); the `prototype/` app is the
  one deliberate exception. Any new `.claude/` permission should trace back to a real, current
  need for working in this repository — not a hypothetical future one.
