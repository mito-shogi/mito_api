import { WorkersKVStore } from '@hono-rate-limiter/cloudflare'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { Context, Next } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { cache } from 'hono/cache'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { ZodError } from 'zod'
import game from './api/game/game.controller'
import user from './api/user/user.controller'
import { scheduled } from './handler/scheduled'
import type { Bindings } from './utils/bindings'
import { reference, specification } from './utils/docs'

const app = new Hono<{ Bindings: Bindings }>()

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  in: 'header',
  description: 'Bearer Token'
})

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Asia/Tokyo')

app.use('*', timeout(5000))
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://dev.mito-shogi.com', 'https://mito-shogi.com'],
    credentials: true,
    maxAge: 86400
  })
)
app.use(logger(), compress({ encoding: 'deflate' }), csrf())
app.use('*', (c, next) => {
  if (new URL(c.req.url).hostname !== 'localhost') {
    cache({ cacheName: 'mito_shogi_api', cacheControl: 'public, max-age=3600' })
  }
  return next()
})
if (!process.env.DEV) {
  app.doc31('openapi.json', specification)
  app.get('/docs', apiReference(reference))
  app.notFound((c) => c.redirect('/docs'))
}
if (process.env.DEV) {
  app.use((c: Context, next: Next) =>
    rateLimiter<{ Bindings: Bindings }>({
      windowMs: 5 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      keyGenerator: (c) =>
        c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || c.req.header('x-real-ip') || 'unknown',
      store: new WorkersKVStore({ namespace: c.env.CACHE })
    })(c, next)
  )
}
app.onError(async (error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status)
  }
  if (error instanceof ZodError) {
    return c.json({ message: JSON.parse(error.message), description: error.cause }, 400)
  }
  return c.json({ message: error.message }, 500)
})
app.route('/users', user)
app.route('/games', game)

export default {
  fetch: app.fetch,
  scheduled: scheduled
}
