import { z } from '@hono/zod-openapi'
import { UserSchema } from '../user/user.schema.dto'

export const GameSearchParam = z.object({
  game_id: z.string().openapi({
    description: 'ゲームID',
    example: 'mito_shogi-mito_shogi-20250101_000000'
  })
})

export const GameInfoSchema = z
  .object({
    game_id: z.string().openapi({
      description: 'ゲームID',
      example: 'mito_shogi-mito_shogi-20250101_000000'
    }),
    game_rule: z.enum(['600+0+0', '180+0+0', '0+10+0']).openapi({
      description: 'ゲーム種別',
      example: '180+0+0'
    }),
    game_type: z.enum(['rank']).openapi({
      description: 'ルール',
      example: 'rank'
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
    result: z.enum(['WIN', 'LOSE']).openapi({
      description: '対局結果',
      example: 'WIN'
    }),
    tags: z.array(z.number().int()).openapi({
      description: 'タグ',
      example: [100, 200]
    })
  })
  .openapi('GameInfoSchema', {})

export const GameSchema = GameInfoSchema.extend({
  kif: z.object({}).passthrough().openapi({
    description: '棋譜(JKF形式)'
  }),
  position: z.string().openapi({
    description: '初期配置',
    example: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1'
  }),
  handicap: z.number().min(0).max(9).openapi({
    description: '駒落ち',
    example: 0
  }),
  result: z.enum(['SENTE_WIN_TIMEOUT', 'SENTE_WIN_CHECKMATE', 'GOTE_WIN_TIMEOUT', 'GOTE_WIN_CHECKMATE']).openapi({})
}).openapi('GameSchema', {})

export type GameSearchParam = z.infer<typeof GameSearchParam>
export type GameSchema = z.infer<typeof GameSchema>
export type GameInfoSchema = z.infer<typeof GameInfoSchema>
