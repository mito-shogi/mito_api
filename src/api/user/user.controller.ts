import { createRoute } from '@hono/zod-openapi'
import { UserParams, UserSchema, UserSearchQuery } from './user.schema.dto'

import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { Paginated } from '../common/paginated.dto'
import { GameInfoSchema } from '../game/game.schema.dto'
import { findUsers, getUser, getUserGames } from './user.service'
const user = new Hono<{ Bindings: Bindings }>()

user.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Users'],
    summary: 'Search users',
    request: {
      query: UserSearchQuery
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
    return c.json(await findUsers(c, q))
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
    return c.json(await getUser(c, user_id))
  }
)

user.openapi(
  createRoute({
    method: 'get',
    path: ':user_id/games',
    tags: ['Games'],
    summary: 'List all games of a user',
    request: {
      params: UserParams
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: Paginated(GameInfoSchema)
          }
        },
        description: 'List all games of a user'
      }
    }
  }),
  async (c) => {
    const { user_id } = c.req.valid<'param'>('param')
    return c.json(await getUserGames(c, user_id))
  }
)

export default user
