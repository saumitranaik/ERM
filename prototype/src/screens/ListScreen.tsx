'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/ui/button';
import { useDb } from '../lib/store';
import { useSession } from '../lib/session';
import { moduleByCode } from '../lib/moduleCatalog';
import { entityHref, rowsFor, type EntityConfig } from '../lib/registry';

export function ListScreen({ cfg }: { cfg: EntityConfig }) {
  const db = useDb();
  const session = useSession();
  const mod = moduleByCode(cfg.module);
  const rows = rowsFor(db, cfg.collection);
  const canCreate = !cfg.noCreate && session?.has(`${cfg.module}_CREATE`);

  return (
    <div>
      <PageHeader
        title={cfg.labelPlural}
        description={cfg.description}
        crumbs={[
          { label: mod?.displayName ?? cfg.module, href: `/modules/${cfg.module}` },
          { label: cfg.labelPlural },
        ]}
        actions={
          canCreate ? (
            <Button asChild size="sm">
              <Link href={`${entityHref(cfg)}/new`}>
                <Plus /> New {cfg.labelSingular}
              </Link>
            </Button>
          ) : undefined
        }
      />
      <DataTable
        rows={rows}
        columns={cfg.columns}
        filters={cfg.filters}
        searchKeys={['code', cfg.titleField, 'description']}
        rowHref={(r) => entityHref(cfg, r.id)}
        emptyTitle={`No ${cfg.labelPlural.toLowerCase()} found`}
      />
    </div>
  );
}
