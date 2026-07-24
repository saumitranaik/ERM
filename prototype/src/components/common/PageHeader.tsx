'use client';

import { Breadcrumbs, type Crumb } from '../ui/breadcrumb';

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
  badge,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-6 space-y-2">
      {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-medium flex items-center gap-2 flex-wrap">
            <span className="truncate">{title}</span>
            {badge}
          </h1>
          {description && <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
