import { z } from '@hono/zod-openapi'
import { UserSchema } from '../user/user.schema.dto'

export const GameSearchParam = z.object({
  game_id: z.string().openapi({
    description: 'Game ID',
    example: 'mito_shogi-mito_shogi-20250101_000000'
  })
})

export const GameSchema = z
  .object({
    game_id: z.string().openapi({
      description: 'Game ID',
      example: 'mito_shogi-mito_shogi-20250101_000000'
    }),
    game_type: z.enum(['sb', 's1', '']).openapi({
      description: 'ゲーム種別',
      example: 'sb'
    }),
    game_mode: z.enum(['normal', 'sprint']).openapi({
      description: '対局モード',
      example: 'normal'
    }),
    user_info: z.array(UserSchema).openapi({
      description: '対局者情報',
      example: [
        {
          name: 'mito_shogi',
          rank: 0,
          avatar: '_'
        },
        {
          name: 'mito_shogi',
          rank: 0,
          avatar: '_'
        }
      ]
    }),
    position: z.string().openapi({
      description: '初期配置',
      example: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1'
    }),
    result: z.enum(['GOTE_WIN_TIMEOUT', 'SENTE_WIN_TIMEOUT', 'GOTE_WIN_TORYO', 'SENTE_WIN_TORYO']),
    handicap: z.number().min(0).max(9).openapi({
      description: '駒落ち',
      example: 0
    })
  })
  .openapi('GameSchema', {
    description: '対局情報'
  })

export type GameSearchParam = z.infer<typeof GameSearchParam>
export type GameSchema = z.infer<typeof GameSchema>
