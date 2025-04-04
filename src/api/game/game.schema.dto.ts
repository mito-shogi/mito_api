import { z } from '@hono/zod-openapi'
import { UserSchema } from '../user/user.schema.dto'

export const GameSearchParam = z.object({
  game_id: z.string().openapi({
    description: 'ゲームID',
    example: 'mito_shogi-mito_shogi-20250101_000000'
  })
})

export const GameSchema = z
  .object({
    game_id: z.string().openapi({
      description: 'ゲームID',
      example: 'mito_shogi-mito_shogi-20250101_000000'
    }),
    play_time: z.string().openapi({
      description: '対局開始時間(JST)',
      example: '2025-01-01T00:00:00+09:000'
    }),
    game_rule: z.enum(['600+0+0', '180+0+0', '0+10+0']).openapi({
      description: 'ゲーム種別',
      example: '180+0+0'
    }),
    game_type: z.enum(['RANKED', 'FRIEND', 'COACH', 'EVENT', 'LEARNING']).openapi({
      description: 'ルール',
      example: 'RANKED'
    }),
    game_mode: z.enum(['NORMAL', 'SPRINT']).openapi({
      description: '対局モード',
      example: 'NORMAL'
    }),
    black: UserSchema,
    white: UserSchema,
    result: z.enum(['WIN', 'LOSE', 'DRAW']).optional().openapi({
      description: '対局結果',
      example: 'WIN'
    }),
    tags: z.array(z.number().int()).openapi({
      description: 'タグ',
      example: [100, 200]
    }),
    kif: z.any().optional().openapi({
      description: 'JKF形式の棋譜',
      example: {}
    }),
    position: z.string().optional().openapi({
      description: '初期配置',
      example: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1'
    }),
    reason: z.enum(['TIMEOUT', 'CHECKMATE', 'TORYO']).optional().openapi({
      description: '対局終了理由',
      example: 'TIMEOUT'
    })
  })
  .openapi('GameSchema', {})

export type GameSearchParam = z.infer<typeof GameSearchParam>
export type GameSchema = z.infer<typeof GameSchema>
