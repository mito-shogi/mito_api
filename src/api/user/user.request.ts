import { HTTPEncoding } from '@/constant/encoding'
import { HTTPMethod } from '@/constant/method'
import type { Bindings } from '@/utils/bindings'
import type { HTTPHeaders, RequestType } from '@/utils/request_type'
import type { Context } from 'hono'

export class UserSearchQuery implements RequestType {
  method = HTTPMethod.POST
  path = 'friends/search'
  headers?: HTTPHeaders | undefined
  parameters?: Record<string, string | number | boolean> | undefined
  encoding?: HTTPEncoding | undefined = HTTPEncoding.FORM

  constructor(c: Context<{ Bindings: Bindings }>, prefix: string) {
    this.parameters = {
      authenticity_token: c.env.WARS_AUTHENTICITY_TOKEN,
      prefix: prefix,
      user_id: c.env.WARS_USER_ID
    }
  }
}

export class UserInfoQuery implements RequestType {
  method = HTTPMethod.GET
  path: string
  headers?: HTTPHeaders | undefined
  parameters?: Record<string, string | number | boolean> | undefined
  encoding?: HTTPEncoding | undefined = undefined

  constructor(user_id: string) {
    this.path = `users/mypage/${user_id}`
  }
}

export class GameQuery implements RequestType {
  method = HTTPMethod.GET
  path = 'api/app/games/game_analysis_info'
  headers?: HTTPHeaders | undefined
  parameters?: Record<string, string | number | boolean> | undefined
  encoding?: HTTPEncoding | undefined = HTTPEncoding.QUERY

  constructor(c: Context<{ Bindings: Bindings }>, game_id: string) {
    this.parameters = {
      user_id: c.env.WARS_USER_ID,
      secret: c.env.WARS_SECRET,
      game_id: game_id,
      locale: 'en',
      version: 'webapp_10.0.0_standard'
    }
  }
}
