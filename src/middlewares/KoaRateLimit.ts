import redisClient from 'config/redisClient'
import { Context, Next } from 'koa'
import { RateLimiterRedis } from 'rate-limiter-flexible'

// Rate Limit Request
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
})

async function KoaRateLimit(ctx: Context, next: Next) {
  try {
    await rateLimiter.consume(ctx.ip)
    await next()
  } catch (err) {
    ctx.status = 429
    ctx.body = { code: 429, message: 'Too Many Requests' }
    // Or you can throw an exception
    // ctx.throw(429, 'Too Many Requests')
  }
}

export default KoaRateLimit
