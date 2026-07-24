'use client';

import { useParams } from 'next/navigation';
import { ModuleDashboard } from '@/src/modules';

export default function ModuleDashboardPage() {
  const params = useParams<{ code: string }>();
  return <ModuleDashboard code={String(params.code).toUpperCase()} />;
}
