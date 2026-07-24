'use client';

import { useParams } from 'next/navigation';
import { getEntityConfig } from '@/src/modules';
import { FormScreen } from '@/src/screens/FormScreen';
import { EmptyState } from '@/src/components/common/EmptyState';

export default function EntityCreatePage() {
  const params = useParams<{ code: string; entity: string }>();
  const cfg = getEntityConfig(String(params.code), String(params.entity));
  if (!cfg) return <EmptyState title="Unknown screen" description="This module does not define that entity." />;
  return <FormScreen cfg={cfg} />;
}
