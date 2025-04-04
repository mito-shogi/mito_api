import { z } from '@hono/zod-openapi'

export const StatusSchema = z
  .object({
    games: z.number().int().min(0).openapi({
      description: '対局数',
      example: 100
    }),
    users: z.number().int().min(0).openapi({
      description: 'ユーザ数',
      example: 100
    })
  })
  .openapi('StatusSchema', {})

export type StatusSchema = z.infer<typeof StatusSchema>
