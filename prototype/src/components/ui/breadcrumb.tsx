import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from './utils';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}>
      {items.map((c, i) => (
        <React.Fragment key={`${c.label}-${i}`}>
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="hover:text-foreground transition-colors truncate max-w-[200px]">
              {c.label}
            </Link>
          ) : (
            <span aria-current={i === items.length - 1 ? 'page' : undefined} className="text-foreground truncate max-w-[240px]">
              {c.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
