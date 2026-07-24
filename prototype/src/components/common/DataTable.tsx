'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { StatusBadge, SeverityBadge, ScoreChip } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { Badge, type BadgeTone } from '../ui/badge';
import { formatDate, formatDateTime, humanize } from '../../lib/format';
import { useDb } from '../../lib/store';
import type { ColumnDef, FilterDef, CellType } from '../../lib/registry';
import type { EntityBase } from '../../types/core';

const PAGE_SIZE = 12;

export function CellValue({
  cell,
  value,
  tone,
}: {
  cell?: CellType;
  value: unknown;
  tone?: BadgeTone;
}) {
  const db = useDb();
  if (value === null || value === undefined || value === '') return <span className="text-muted-foreground">—</span>;
  switch (cell) {
    case 'status':
      return <StatusBadge status={String(value)} />;
    case 'severity':
      return <SeverityBadge value={String(value)} />;
    case 'score':
      return <ScoreChip score={Number(value)} />;
    case 'badge':
      return <Badge variant={tone ?? 'secondary'}>{humanize(String(value))}</Badge>;
    case 'user': {
      const u = db.users.find((x) => x.id === value);
      return <span>{u?.name ?? String(value)}</span>;
    }
    case 'department': {
      const d = db.departments.find((x) => x.id === value);
      return <span>{d?.name ?? String(value)}</span>;
    }
    case 'date':
      return <span className="whitespace-nowrap">{formatDate(String(value))}</span>;
    case 'datetime':
      return <span className="whitespace-nowrap">{formatDateTime(String(value))}</span>;
    case 'code':
      return <span className="font-mono text-xs whitespace-nowrap">{String(value)}</span>;
    case 'number':
      return <span className="tabular-nums">{String(value)}</span>;
    default:
      return <span>{String(value)}</span>;
  }
}

export function DataTable({
  rows,
  columns,
  filters = [],
  searchKeys,
  rowHref,
  emptyTitle = 'No records found',
  emptyDescription,
  toolbarExtra,
}: {
  rows: EntityBase[];
  columns: ColumnDef[];
  filters?: FilterDef[];
  searchKeys: string[];
  rowHref?: (row: EntityBase) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbarExtra?: React.ReactNode;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const filterOptions = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const f of filters) {
      out[f.key] = f.options ?? Array.from(new Set(rows.map((r) => String(r[f.key] ?? '')).filter(Boolean))).sort();
    }
    return out;
  }, [filters, rows]);

  const filtered = useMemo(() => {
    let out = rows;
    const q = search.trim().toLowerCase();
    if (q) {
      out = out.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
    }
    for (const [k, v] of Object.entries(filterValues)) {
      if (v && v !== '__all') out = out.filter((r) => String(r[k] ?? '') === v);
    }
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp =
          typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av ?? '').localeCompare(String(bv ?? ''));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return out;
  }, [rows, search, searchKeys, filterValues, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(clampedPage * PAGE_SIZE, (clampedPage + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Toolbar: search + filters */}
      <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search…"
            className="pl-8"
            aria-label="Search records"
          />
        </div>
        {filters.map((f) => (
          <Select
            key={f.key}
            value={filterValues[f.key] ?? '__all'}
            onValueChange={(v) => {
              setFilterValues((s) => ({ ...s, [f.key]: v }));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-auto min-w-[150px]" aria-label={`Filter by ${f.label}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All {f.label}</SelectItem>
              {filterOptions[f.key]?.map((o) => (
                <SelectItem key={o} value={o}>
                  {humanize(o)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {toolbarExtra}
        <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} of {rows.length} records
        </span>
      </div>

      {pageRows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription ?? 'Try adjusting your search or filters.'} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((c) => (
                <TableHead key={c.key}>
                  {c.sortable === false ? (
                    c.label
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="flex items-center gap-1 hover:text-foreground uppercase"
                    >
                      {c.label}
                      {sortKey === c.key &&
                        (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </button>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((r) => (
              <TableRow
                key={r.id}
                onClick={() => rowHref && router.push(rowHref(r))}
                className={rowHref ? 'cursor-pointer' : ''}
              >
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    <CellValue cell={c.cell} value={r[c.key]} tone={c.tone} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {pageCount > 1 && (
        <div className="p-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {clampedPage + 1} of {pageCount}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={clampedPage === 0} onClick={() => setPage(clampedPage - 1)}>
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={clampedPage >= pageCount - 1}
              onClick={() => setPage(clampedPage + 1)}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
