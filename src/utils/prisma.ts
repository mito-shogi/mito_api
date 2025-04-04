import type { GameSchema } from '@/api/game/game.schema.dto'
import type { UserSchema } from '@/api/user/user.schema.dto'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { Bindings } from './bindings'

class Prisma {
  private prisma: PrismaClient

  constructor(env: Bindings) {
    const adapter = new PrismaD1(env.DB)
    this.prisma = new PrismaClient({ adapter })
  }

  users_count = async (): Promise<number> => {
    return await this.prisma.user.count()
  }

  games_count = async (): Promise<number> => {
    return await this.prisma.game.count()
  }

  find_users = async (user_id: string): Promise<UserSchema[]> => {
    // @ts-ignore
    return await this.prisma.user.findMany({
      where: {
        userId: {
          in: [user_id]
        }
      }
    })
  }

  create_users = async (users: UserSchema[]): Promise<void> => {
    await Promise.all(users.map((user) => this.upsert_user(user)))
  }

  private upsert_user = async (user: UserSchema): Promise<void> => {
    await this.prisma.user.upsert({
      where: {
        userId: user.user_id
      },
      update: {
        rank: user.rank,
        avatar: user.avatar
      },
      create: {
        userId: user.user_id,
        rank: user.rank,
        avatar: user.avatar
      }
    })
  }

  create_games = async (games: GameSchema[]): Promise<void> => {
    await Promise.all(games.map((game) => this.upsert_game(game)))
  }

  private upsert_game = async (game: GameSchema): Promise<void> => {
    await this.prisma.game.upsert({
      where: {
        gameId: game.game_id
      },
      update: {
        kif: game.kif,
        position: game.position,
        playTime: game.play_time
      },
      create: {
        gameId: game.game_id,
        // @ts-ignore
        mode: game.game_mode,
        // @ts-ignore
        rule: 'MIN3',
        // @ts-ignore
        type: game.game_type,
        black: {
          connectOrCreate: {
            where: {
              userId: game.black.user_id
            },
            create: {
              userId: game.black.user_id,
              rank: game.black.rank,
              avatar: game.black.avatar
            }
          }
        },
        white: {
          connectOrCreate: {
            where: {
              userId: game.black.user_id
            },
            create: {
              userId: game.black.user_id,
              rank: game.black.rank,
              avatar: game.black.avatar
            }
          }
        },
        playTime: game.play_time,
        // @ts-ignore
        result: game.result
      }
    })
  }
}

export default Prisma
