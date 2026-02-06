const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

const requests = new Map<string, number[]>()

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const timestamps = (requests.get(ip) ?? []).filter(t => t > cutoff)
  timestamps.push(now)
  requests.set(ip, timestamps)
  return timestamps.length > MAX_REQUESTS
}
