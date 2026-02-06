import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const WINDOW_SECONDS = 60
const MAX_REQUESTS = 5

// Lazily initialised - null when Upstash env vars are absent (e.g. local dev).
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
 *
 * - Production: blocks when Upstash is unconfigured (deployment error) or IP is missing.
 * - Development: allows requests through when unconfigured.
 * - Runtime Redis failures always fail open (transient - don't break the form for everyone).
 */
export async function isRateLimited(ip: string | undefined): Promise<boolean> {
  const rl = getRatelimit()

  if (!rl) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Rate limiting not configured in production - blocking request')
      return true
    }
    return false
  }

  if (!ip) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Missing client IP in production - blocking request')
      return true
    }
    return false
  }

  try {
    const { success } = await rl.limit(ip)
    return !success
  } catch (err) {
    console.error('Rate limit check failed:', err)
    return false
  }
}
