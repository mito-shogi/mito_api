import type { Context } from 'hono'
import type { StatusSchema } from './status.schema.dto'

export const getStatus = async (c: Context): Promise<StatusSchema> => {
  const [users, games] = await Promise.all([c.env.prisma.users_count(), c.env.prisma.games_count()])
  return {
    users: users,
    games: games
  }
}
