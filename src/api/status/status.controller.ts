import { createRoute } from '@hono/zod-openapi'

import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { StatusSchema } from './status.schema.dto'
import { getStatus } from './status.service'
const status = new Hono<{ Bindings: Bindings }>()

status.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['ステータス'],
    summary: '取得',
    description: 'サーバーのステータスを取得します',
    request: {},
    responses: {
      200: {
        content: {
          'application/json': {
            schema: StatusSchema
          }
        },
        description: 'ステータス'
      }
    }
  }),
  async (c) => {
    return c.json(await getStatus(c))
  }
)

export default status
