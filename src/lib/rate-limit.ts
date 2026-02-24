type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
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
