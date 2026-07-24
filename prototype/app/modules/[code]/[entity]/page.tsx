'use client';

import { useParams } from 'next/navigation';
import { getEntityConfig } from '@/src/modules';
import { ListScreen } from '@/src/screens/ListScreen';
import { EmptyState } from '@/src/components/common/EmptyState';

export default function EntityListPage() {
  const params = useParams<{ code: string; entity: string }>();
  const cfg = getEntityConfig(String(params.code), String(params.entity));
  if (!cfg) return <EmptyState title="Unknown screen" description="This module does not define that entity." />;
  return <ListScreen cfg={cfg} />;
}
