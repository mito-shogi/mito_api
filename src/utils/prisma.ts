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

  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  create_games = async (games: GameSchema[]): Promise<void> => {
    // await Promise.all(games.map((game) => this.upsert_game(game)))
  }

  // private upsert_game = async (game: GameSchema): Promise<void> => {
  //   await this.prisma.game.upsert({
  //     where: {
  //       gameId: game.game_id
  //     },
  //     update: {
  //       kif: game.kif,
  //       tags: game.tags,
  //       position: game.position,
  //       playTime: game.play_time,
  //       gameRule: game.game_rule,
  //       gameMode: game.game_mode,
  //       gameType: game.game_type
  //     },
  //     create: {
  //       ...game
  //     }
  //   })
  // }
}

export default Prisma
