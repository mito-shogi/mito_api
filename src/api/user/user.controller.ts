import { createRoute } from '@hono/zod-openapi'
import { UserParams, UserSchema, UserSeachQuery } from './user.schema.dto'

import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { Paginated } from '../common/paginated.dto'
import { findUsers, getUser } from './user.service'
const user = new Hono<{ Bindings: Bindings }>()

user.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Users'],
    summary: 'Search users',
    request: {
      query: UserSeachQuery
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: Paginated(UserSchema)
          }
        },
        description: 'Find users'
      }
    }
  }),
  async (c) => {
    const { q } = c.req.valid<'query'>('query')
    return c.json(await findUsers(q))
  }
)

user.openapi(
  createRoute({
    method: 'get',
    path: ':user_id',
    tags: ['Users'],
    summary: 'Retrieve a user',
    request: {
      params: UserParams
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserSchema
          }
        },
        description: 'Retrieve the user'
      }
    }
  }),
  async (c) => {
    const { user_id } = c.req.valid<'param'>('param')
    return c.json(await getUser(user_id))
  }
)

export default user
