import type { Context } from 'hono'

export const redirect = (c: Context) => {
  return c.redirect('/docs')
}
