import { HTTPEncoding } from '@/constant/encoding'
import { HTTPMethod } from '@/constant/method'
import type { Bindings } from '@/utils/bindings'
import type { HTTPHeaders, RequestType } from '@/utils/request_type'
import type { Context } from 'hono'

/**
 * @description
 */
export class GameListQuery implements RequestType {
  method = HTTPMethod.GET
  path = 'games/history'
  headers?: HTTPHeaders | undefined
  parameters?: Record<string, string | number | boolean> | undefined
  encoding?: HTTPEncoding | undefined = HTTPEncoding.QUERY

  /**
   *
   * @param user_id
   * @param mode
   * 0: NORMAL
   * 1: SPRINT
   * @param rule
   * 0: RANKED
   * 1: FRIENDS
   * 2: COACH
   * 3: EVENT
   * 4: LEARNING
   * @param time
   * 0: 600+0+0 (十分)
   * 1: 180+0+0 (三分)
   * 2: 0+10+0  (十秒)
   */
  constructor(
    user_id: string,
    mode: 0 | 1,
    rule: 0 | 1 | 2 | 3,
    type: 0 | 1 | 2
    // month: string,
    // is_latest: boolean
  ) {
    const game_rules: Record<number, string> = {
      0: 'NORMAL',
      1: 'FRIENDS',
      2: 'EVENT',
      3: 'COACH',
      4: 'LEARNING'
    }
    const game_modes: Record<number, string> = {
      0: 'NORMAL',
      1: 'SPRINT'
    }
    const game_types: Record<number, string> = {
      0: '',
      1: 'sb',
      2: 's1'
    }
    this.parameters = {
      opponent_type: game_modes[mode],
      init_pos_type: game_rules[rule],
      // month: month,
      // is_latest: is_latest,
      gtype: game_types[type],
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
