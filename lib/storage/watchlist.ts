"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ListEntry, ListStatus } from "@/types";

const STORAGE_KEY = "shakchiverse.watchlist.v1";
const LEGACY_STORAGE_KEY = "versehub.watchlist.v1";
const EVENT_NAME = "shakchiverse-watchlist-change";

function readRaw(): string {
  if (typeof window === "undefined") return "[]";
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) return current;
  const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) window.localStorage.setItem(STORAGE_KEY, legacy);
  return legacy ?? "[]";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(EVENT_NAME, callback); };
}

function write(entries: ListEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useWatchlist(): ListEntry[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => {
    try { return JSON.parse(raw) as ListEntry[]; }
    catch { return []; }
  }, [raw]);
}

export function updateListEntry(titleId: string, changes: Partial<Omit<ListEntry, "titleId" | "updatedAt">>) {
  const entries = JSON.parse(readRaw()) as ListEntry[];
  const current = entries.find((entry) => entry.titleId === titleId) ?? { titleId, status: "want-to-watch" as ListStatus, favorite: false, episode: 0, updatedAt: "" };
  const next = { ...current, ...changes, updatedAt: new Date().toISOString() };
  write([...entries.filter((entry) => entry.titleId !== titleId), next]);
}

export function removeListEntry(titleId: string) {
  const entries = JSON.parse(readRaw()) as ListEntry[];
  write(entries.filter((entry) => entry.titleId !== titleId));
}
