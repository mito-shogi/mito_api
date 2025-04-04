import { GameSchema } from '@/api/game/game.schema.dto'
import { GameListQuery } from '@/api/user/user.request'
import type { Bindings } from '@/utils/bindings'
import { PreGameListSchema } from '@/utils/preprocess'
import Prisma from '@/utils/prisma'
import { request } from '@/utils/request_type'
import { z } from '@hono/zod-openapi'

export const scheduled = async (event: ScheduledController, env: Bindings, ctx: ExecutionContext): Promise<void> => {
  switch (event.cron) {
    case '0 0 * * *':
      break
    case '*/5 * * * *':
      ctx.waitUntil(fetch_games(env))
      break
    default:
      ctx.waitUntil(fetch_games(env))
      break
  }
}

const fetch_games = async (env: Bindings): Promise<void> => {
  const prisma = new Prisma(env)
  const users = await prisma.get_users({ take: 10 })
  console.log('USERS:', users.length)
  console.log('USERS:', users)
  for (const user of users) {
    const games: GameSchema[] = (
      await Promise.all([
        request(
          env.WARS_WEB_SESSION,
          new GameListQuery(user.user_id, 0, 0, 0),
          z.preprocess(PreGameListSchema, z.array(GameSchema))
        ),
        request(
          env.WARS_WEB_SESSION,
          new GameListQuery(user.user_id, 0, 0, 1),
          z.preprocess(PreGameListSchema, z.array(GameSchema))
        ),
        request(
          env.WARS_WEB_SESSION,
          new GameListQuery(user.user_id, 0, 0, 2),
          z.preprocess(PreGameListSchema, z.array(GameSchema))
        ),
        request(
          env.WARS_WEB_SESSION,
          new GameListQuery(user.user_id, 1, 0, 1),
          z.preprocess(PreGameListSchema, z.array(GameSchema))
        )
      ])
    ).flat()
    console.log('GAMES:', user.user_id, games.length)
    await Promise.all([prisma.create_games(games)])
  }
}
