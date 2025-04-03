import { z } from '@hono/zod-openapi'

export const UserSearchQuery = z
  .object({
    q: z.string().openapi({
      description: 'ユーザ名',
      example: 'mito_shogi'
    })
  })
  .openapi('UserSeachParam', {
    description: 'ユーザ名を指定するパラメータ'
  })

export const UserParams = z.object({
  user_id: z.string().openapi({
    description: 'ユーザID',
    example: 'mito_shogi'
  })
})

export const UserSchema = z
  .object({
    name: z.string().openapi({
      description: 'ユーザ名',
      example: 'mito_shogi'
    }),
    rank: z.number().min(-99999).max(10).openapi({
      description: '段級位',
      example: 0
    }),
    avatar: z.string().openapi({
      description: 'アバター画像ID',
      example: '_'
    })
  })
  .openapi('UserSchema', {})

export type UserSchema = z.infer<typeof UserSchema>
export type UserSeachQuery = z.infer<typeof UserSeachQuery>
export type UserParams = z.infer<typeof UserParams>
