'use client';

/**
 * Mock session — replaces PRSMTD's JWT/OIDC session with a locally selected
 * persona. The persona switcher lets a stakeholder act as maker and checker
 * in the same demo without an authentication server.
 */
import { useSyncExternalStore } from 'react';
import { permissionsForRoles } from './moduleCatalog';
import { getDb, useDb } from './store';
import type { Persona, User } from '../types/core';

const SESSION_KEY = 'erm-prototype-session-v1';
let currentPersonaId: string | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    currentPersonaId = localStorage.getItem(SESSION_KEY);
  } catch {
    currentPersonaId = null;
  }
}

export function getPersonaId(): string | null {
  if (typeof window === 'undefined') return null;
  load();
  return currentPersonaId;
}

export function setPersonaId(id: string | null) {
  currentPersonaId = id;
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export interface SessionInfo {
  persona: Persona;
  user: User;
  permissions: Set<string>;
  has: (perm: string) => boolean;
}

export function useSession(): SessionInfo | null {
  const id = useSyncExternalStore(subscribe, getPersonaId, () => null);
  const db = useDb();
  if (!id) return null;
  const persona = (db.personas as unknown as Persona[]).find((p) => p.id === id);
  if (!persona) return null;
  const user = db.users.find((u) => u.id === persona.userId);
  if (!user) return null;
  const permissions = permissionsForRoles(persona.roles);
  return { persona, user, permissions, has: (perm) => permissions.has(perm) };
}

export function getSession(): SessionInfo | null {
  const id = getPersonaId();
  if (!id) return null;
  const db = getDb();
  const persona = (db.personas as unknown as Persona[]).find((p) => p.id === id);
  if (!persona) return null;
  const user = db.users.find((u) => u.id === persona.userId);
  if (!user) return null;
  const permissions = permissionsForRoles(persona.roles);
  return { persona, user, permissions, has: (perm) => permissions.has(perm) };
}
