import type { Paginated } from '../common/paginated.dto'
import type { UserSchema } from './user.schema.dto'

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const findUsers = async (q: string): Promise<Paginated<typeof UserSchema>> => {
  return {
    count: 1,
    results: [
      {
        name: 'mito_shogi',
        rank: 0,
        avatar: '_'
      }
    ]
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
