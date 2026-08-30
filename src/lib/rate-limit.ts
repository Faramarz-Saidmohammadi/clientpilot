type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
const MAX_ENTRIES = 10_000;

function removeExpiredEntries(now: number) {
  if (store.size < MAX_ENTRIES) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
  while (store.size >= MAX_ENTRIES) {
    const oldestKey = store.keys().next().value as string | undefined;
    if (!oldestKey) break;
    store.delete(oldestKey);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  removeExpiredEntries(now);
  const hit = store.get(key);
  if (!hit || hit.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (hit.count >= limit) return { ok: false, remaining: 0 };
  hit.count += 1;
  store.set(key, hit);
  return { ok: true, remaining: limit - hit.count };
}
