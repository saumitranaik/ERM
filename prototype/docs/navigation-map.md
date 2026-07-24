# Navigation Map

## Global shell

```
Header (sticky)
  Tenant name + status  |  Environment badge  |  Notification bell  |  Persona switcher (+ theme toggle, reset data, logout)

Sidebar (left, desktop persistent / mobile drawer)
  Home
  Approvals            (badge: pending-for-me count)
  Notifications         (badge: unread count)
  Global Search
  ── Modules ── (derived entirely from the module catalog + persona's *_VIEW permissions)
  Risk Management
  Controls Management
  Compliance Management
  Audit Management
  Security Management
  Policy Management
  Incident, Issue & CAPA
  Third-Party Risk
  Business Continuity
  Reporting
  Analytics

Footer
  Platform label  |  "Specification blueprint for PRSMTD" attribution
```

The sidebar's module section is **not hardcoded** — it iterates
`moduleCatalog` (`src/lib/moduleCatalog.ts`) and shows only modules the
current persona holds a `_VIEW` permission for. Adding a twelfth module means
adding one manifest entry and one set of entity configs; the shell code does
not change. This mirrors PRSMTD's Frontend Hardcoding Guard.

## Breadcrumb pattern

Every screen below the top level carries breadcrumbs:

```
{Module Display Name} > {Entity Plural Label} > {Record code or title}
```

e.g. `Risk Management > Risk Register > RSK-2026-0003`. The module and entity
segments are links back up the hierarchy; the last segment is the current
page (non-interactive).

## Cross-module navigation

The Relationships tab on every detail screen links to related records **in
their own module's screens** — e.g. a Risk's Relationships tab links to
Controls-module control detail pages, Compliance-module obligation pages,
etc. There is no separate "cross-module viewer" — navigating a relationship
link takes you to that entity's normal detail screen in its owning module,
exactly as a real implementation would.

Global Search (`/protected/search`) is the other cross-module entry point: it
searches every entity's code/title/description across every module the
persona can view, and links directly to each match's detail screen.

## Persona-driven visibility

Every nav item, module tile, and action button is gated by the current
persona's resolved permissions (`useSession().has(permission)`), computed
from `moduleCatalog.permissionsForRoles`. Switching persona via the header
menu instantly re-renders the sidebar, dashboards and action buttons for the
new permission set — there is no page reload.

## URL structure

```
/login                                        Mock login
/protected                                    Home dashboard
/protected/approvals                          Cross-module approvals
/protected/notifications                      Notification center
/protected/search                             Global search
/modules/{CODE}                               Module dashboard
/modules/{CODE}/{entity-slug}                 Entity list
/modules/{CODE}/{entity-slug}/new             Entity create
/modules/{CODE}/{entity-slug}/{id}            Entity detail
/modules/{CODE}/{entity-slug}/{id}/edit       Entity edit
```

`{CODE}` is one of `RISK, CONTROLS, COMPLIANCE, AUDIT, SECURITY, POLICY,
INCIDENT, TPR, BCP, REPORTING, ANALYTICS` — matching the PRSMTD module code
convention (`CLAUDE.md` Naming Standards: `UPPERCASE` module codes).
