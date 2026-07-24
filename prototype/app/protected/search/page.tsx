'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { PageHeader } from '@/src/components/common/PageHeader';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Input } from '@/src/components/ui/input';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { Badge } from '@/src/components/ui/badge';
import { useDb } from '@/src/lib/store';
import { useSession } from '@/src/lib/session';
import { searchAll } from '@/src/lib/search';
import { moduleByCode } from '@/src/lib/moduleCatalog';

export default function GlobalSearchPage() {
  const db = useDb();
  const session = useSession();
  const [query, setQuery] = useState('');
  if (!session) return null;

  const results = searchAll(db, query, session);

  return (
    <div>
      <PageHeader title="Global Search" description="Search risks, controls, obligations, findings, policies, vendors, plans and every other governed record across all modules." />

      <div className="relative max-w-xl mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, code or description…"
          className="pl-9 h-11"
        />
      </div>

      {query.trim() === '' ? (
        <EmptyState icon={SearchIcon} title="Start typing to search" description="Search spans every module you have view access to." />
      ) : results.length === 0 ? (
        <EmptyState title="No matches" description={`Nothing found for "${query}".`} />
      ) : (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground mb-2">{results.length} result{results.length === 1 ? '' : 's'}</p>
          {results.map((r) => {
            const mod = moduleByCode(r.module);
            return (
              <Link
                key={`${r.collection}-${r.id}`}
                href={r.href}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Badge variant="secondary" className="shrink-0">{mod?.displayName ?? r.module}</Badge>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">
                    {r.code && <span className="font-mono text-xs text-muted-foreground mr-2">{r.code}</span>}
                    {r.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">{r.entitySingular}</span>
                </span>
                <StatusBadge status={r.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
