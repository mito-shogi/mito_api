import type { Bindings } from '@/utils/bindings'
import type { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'
import { AlgorithmTypes } from 'hono/utils/jwt/jwa'

export const bearerToken = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
  return jwt({
    secret: c.env.APP_JWT_SECRET,
    cookie: {
      key: 'access_token'
    },
    alg: AlgorithmTypes.HS256
  })(c, next)
}
