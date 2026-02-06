const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

const requests = new Map<string, number[]>()

// Prevent unbounded memory growth
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS
  for (const [key, timestamps] of requests) {
    const filtered = timestamps.filter(t => t > cutoff)
    if (filtered.length === 0) requests.delete(key)
    else requests.set(key, filtered)
  }
}, WINDOW_MS).unref()

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const timestamps = (requests.get(ip) ?? []).filter(t => t > cutoff)
  timestamps.push(now)
  requests.set(ip, timestamps)
  return timestamps.length > MAX_REQUESTS
}
