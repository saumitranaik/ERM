'use client';

import { useEffect, useState } from 'react';

/**
 * Defers rendering until after client mount so localStorage-backed state
 * (mock DB, session) never causes a server/client hydration mismatch.
 */
export function Hydrated({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback ?? null}</>;
  return <>{children}</>;
}
