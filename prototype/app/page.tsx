'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPersonaId } from '@/src/lib/session';

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getPersonaId() ? '/protected' : '/login');
  }, [router]);
  return null;
}
