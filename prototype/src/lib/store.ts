'use client';

/**
 * Mock persistence layer: an in-memory database hydrated from the JSON seed
 * datasets, mirrored to localStorage so workflow actions survive a refresh.
 * "Reset demo data" restores the pristine seeds. This stands in for the
 * PostgreSQL + service layer PRSMTD would provide in production.
 */
import { useSyncExternalStore } from 'react';
import type { Db } from '../types/core';
import { buildSeedDb } from '../data/seed';

const STORAGE_KEY = 'erm-prototype-db-v1';

let db: Db | null = null;
let version = 0;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage full or unavailable — in-memory copy still works */
  }
}

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

export function getDb(): Db {
  if (db) return db;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        db = JSON.parse(raw) as Db;
        return db;
      }
    } catch {
      /* corrupted storage — fall through to seeds */
    }
  }
  db = buildSeedDb();
  return db;
}

export function mutate(fn: (db: Db) => void) {
  const d = getDb();
  fn(d);
  persist();
  emit();
}

export function resetDb() {
  db = buildSeedDb();
  persist();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Re-renders the caller whenever any store mutation happens. */
export function useDb(): Db {
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
  return getDb();
}
