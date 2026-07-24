import type { Db, EntityBase } from '../types/core';
import { allEntities } from '../modules';

export interface SearchResult {
  id: string;
  module: string;
  collection: string;
  label: string;
  code?: string;
  status: string;
  href: string;
  entitySingular: string;
}

export function searchAll(db: Db, query: string, session: { has: (p: string) => boolean }): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  for (const cfg of allEntities) {
    if (!session.has(`${cfg.module}_VIEW`)) continue;
    const rows = (db[cfg.collection] as EntityBase[]) ?? [];
    for (const r of rows) {
      const label = String(r[cfg.titleField] ?? r.name ?? r.title ?? r.id);
      const haystack = `${r.code ?? ''} ${label} ${r.description ?? ''}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: r.id,
          module: cfg.module,
          collection: cfg.collection,
          label,
          code: r.code as string | undefined,
          status: r.status,
          href: `/modules/${cfg.module}/${cfg.slug}/${r.id}`,
          entitySingular: cfg.labelSingular,
        });
      }
    }
  }
  return results.slice(0, 100);
}
