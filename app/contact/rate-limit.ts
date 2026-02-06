import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const WINDOW_SECONDS = 60
const MAX_REQUESTS = 5

// Lazily initialised — null when Upstash env vars are absent (e.g. local dev).
let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null

  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
    prefix: 'contact-rl',
  })
  return ratelimit
}

/**
 * Returns true if the request should be blocked.
 * Fails open: if Redis is unreachable or unconfigured, the request is allowed.
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  const rl = getRatelimit()
  if (!rl) return false

  try {
    const { success } = await rl.limit(ip)
    return !success
  } catch {
    return false
  }
}
