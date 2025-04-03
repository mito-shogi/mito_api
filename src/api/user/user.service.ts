import { PreUserSchema } from '@/utils/preprocess'
import { request } from '@/utils/request_type'
import type { Context } from 'hono'
import { z } from 'zod'
import type { Paginated } from '../common/paginated.dto'
import { UserSearchQuery } from './user.request'
import { UserSchema } from './user.schema.dto'

export const findUsers = async (c: Context, q: string): Promise<Paginated<typeof UserSchema>> => {
  const users = await request(c, new UserSearchQuery(c, q), z.preprocess(PreUserSchema, z.array(UserSchema)))
  return {
    count: users.length,
    results: users
  }
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const getUser = async (q: string): Promise<UserSchema> => {
  return {
    name: 'mito_shogi',
    rank: 0,
    avatar: '_'
  }
}
