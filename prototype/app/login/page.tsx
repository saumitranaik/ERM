'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Hydrated } from '@/src/components/common/Hydrated';
import { useDb } from '@/src/lib/store';
import { setPersonaId } from '@/src/lib/session';
import type { Persona } from '@/src/types/core';

function LoginCard() {
  const db = useDb();
  const router = useRouter();
  const personas = db.personas as unknown as Persona[];

  const choose = (id: string) => {
    setPersonaId(id);
    router.push('/protected');
  };

  return (
    <div className="w-full max-w-xl bg-card border border-border rounded-lg shadow-sm">
      <div className="p-8 border-b border-border text-center">
        <div className="mx-auto w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-medium">Meridian Asset Management Ltd.</h1>
        <p className="text-sm text-muted-foreground mt-1">Enterprise Risk Management &amp; GRC Platform</p>
        <p className="text-xs text-muted-foreground mt-3">
          UX Reference Prototype — sign in as a persona to explore. No real authentication;
          all data is fictional.
        </p>
      </div>
      <ul className="divide-y divide-border max-h-[50vh] overflow-y-auto" role="list">
        {personas.map((p) => {
          const user = db.users.find((u) => u.id === p.userId);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => choose(p.id)}
                className="w-full flex items-center justify-between gap-4 px-6 py-3 text-left hover:bg-accent transition-colors"
              >
                <span>
                  <span className="block text-sm font-medium">{user?.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.label} — {p.summary}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="px-6 py-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Environment: <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded uppercase">Prototype</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Hydrated>
        <LoginCard />
      </Hydrated>
    </main>
  );
}
