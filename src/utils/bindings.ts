import type Prisma from './prisma'

export type Bindings = {
  WARS_WEB_SESSION: string
  WARS_USER_ID: string
  WARS_SECRET: string
  WARS_AUTHENTICITY_TOKEN: string
  DB: D1Database
  prisma: Prisma
  // RATE_LIMITER: RateLimit
}

export type Variables = {
  rateLimit: boolean
}
