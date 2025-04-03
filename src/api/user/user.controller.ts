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
    tags: ['ユーザー'],
    summary: '検索',
    description: 'キーワードからユーザーを検索します',
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
        description: 'ユーザー一覧'
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
    tags: ['ユーザー'],
    summary: '取得',
    description: 'ユーザーIDを指定してユーザー情報を取得します',
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
        description: 'ユーザー詳細'
      },
      404: {
        content: {},
        description: 'エラー'
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
    tags: ['棋譜'],
    summary: '一覧',
    description: 'ユーザーIDから棋譜一覧を取得します',
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
        description: '棋譜一覧'
      },
      404: {
        content: {},
        description: 'エラー'
      }
    }
  }),
  async (c) => {
    const { user_id } = c.req.valid<'param'>('param')
    return c.json(await getUserGames(c, user_id))
  }
)

export default user
