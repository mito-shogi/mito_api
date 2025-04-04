import type { Bindings } from '@/utils/bindings'
import { PreGameSchema } from '@/utils/preprocess'
import { request } from '@/utils/request_type'
import type { Context } from 'hono'
import { z } from 'zod'
import { GameQuery } from './game.request'
import { GameSchema } from './game.schema.dto'

export const getGame = async (c: Context<{ Bindings: Bindings }>, game_id: string): Promise<GameSchema> => {
  return await request(c.env.WARS_WEB_SESSION, new GameQuery(c, game_id), z.preprocess(PreGameSchema, GameSchema))
}
