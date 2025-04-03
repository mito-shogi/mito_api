import { PreGameSchema } from '@/utils/preprocess'
import { request } from '@/utils/request_type'
import type { Context } from 'hono'
import { z } from 'zod'
import { GameQuery } from './game.request'
import { GameSchema } from './game.schema.dto'

export const getGame = async (c: Context, game_id: string): Promise<GameSchema> => {
  return await request(c, new GameQuery(c, game_id), z.preprocess(PreGameSchema, GameSchema))
}
