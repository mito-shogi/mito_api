import { createRoute } from '@hono/zod-openapi'

import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { GameSchema, GameSearchParam } from './game.schema.dto'
import { getGame } from './game.service'
const game = new Hono<{ Bindings: Bindings }>()

game.openapi(
  createRoute({
    method: 'get',
    path: ':game_id',
    tags: ['Games'],
    summary: 'Retrieve a game',
    request: {
      params: GameSearchParam
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: GameSchema
          }
        },
        description: 'Retrieve the game'
      }
    }
  }),
  async (c) => {
    const { game_id } = c.req.valid<'param'>('param')
    return c.json(await getGame(game_id))
  }
)

export default game
