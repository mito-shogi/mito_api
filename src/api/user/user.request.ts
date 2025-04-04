import { HTTPEncoding } from '@/constant/encoding'
import { HTTPMethod } from '@/constant/method'
import type { Bindings } from '@/utils/bindings'
import type { HTTPHeaders, RequestType } from '@/utils/request_type'
import type { Context } from 'hono'

export class GameListQuery implements RequestType {
  method = HTTPMethod.GET
  path = 'games/history'
  headers?: HTTPHeaders | undefined
  parameters?: Record<string, string | number | boolean> | undefined
  encoding?: HTTPEncoding | undefined = HTTPEncoding.QUERY

  constructor(
    user_id: string,
    mode: 'normal' | 'sprint',
    rule: 'rank',
    time: '' | 'sb' | 's1'
    // month: string,
    // is_latest: boolean
  ) {
    this.parameters = {
      opponent_type: mode,
      init_pos_type: rule,
      // month: month,
      // is_latest: is_latest,
      gtype: time,
      locale: 'en',
      user_id: user_id,
      version: 'webapp_10.0.0_standard'
    }
  }
}

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
