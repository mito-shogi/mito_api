import { PreGameListSchema, PreUserSchema } from '@/utils/preprocess'
import { request } from '@/utils/request_type'
import type { Context } from 'hono'
import { z } from 'zod'
import type { Paginated } from '../common/paginated.dto'
import { GameSchema } from '../game/game.schema.dto'
import { GameListQuery, UserSearchQuery } from './user.request'
import { UserSchema } from './user.schema.dto'

export const findUsers = async (c: Context, q: string): Promise<Paginated<typeof UserSchema>> => {
  const users = await request(c, new UserSearchQuery(c, q), z.preprocess(PreUserSchema, z.array(UserSchema)))
  await c.env.prisma.create_users(users)
  return {
    count: users.length,
    results: users
  }
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const getUser = async (c: Context, user_id: string): Promise<UserSchema> => {
  // const user = await request(c, new UserInfoQuery(user_id), z.preprocess(PreUserSchema, z.array(UserSchema)))
  return {
    user_id: 'mito_shogi',
    rank: 0,
    avatar: '_'
  }
}

export const getUserGames = async (c: Context, user_id: string): Promise<Paginated<typeof GameSchema>> => {
  const games = await request(
    c,
    new GameListQuery(user_id, 'normal', 'rank', 'sb'),
    z.preprocess(PreGameListSchema, z.array(GameSchema))
  )
  const users: UserSchema[] = games.flatMap((game) => [game.black, game.white])
  await c.env.prisma.create_users(users)
  return {
    count: games.length,
    results: games
  }
}
