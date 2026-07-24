'use client';

import { useParams } from 'next/navigation';
import { getEntityConfig } from '@/src/modules';
import { DetailScreen } from '@/src/screens/DetailScreen';
import { EmptyState } from '@/src/components/common/EmptyState';

export default function EntityDetailPage() {
  const params = useParams<{ code: string; entity: string; id: string }>();
  const cfg = getEntityConfig(String(params.code), String(params.entity));
  if (!cfg) return <EmptyState title="Unknown screen" description="This module does not define that entity." />;
  return <DetailScreen cfg={cfg} id={String(params.id)} />;
}
