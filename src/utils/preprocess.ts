import selectAll, { selectOne } from 'css-select'
import dayjs from 'dayjs'
import { HTTPException } from 'hono/http-exception'
import { DomUtils, parseDocument } from 'htmlparser2'
import { type Move, Position, Record, RecordMetadataKey, exportJKF, parseCSAMove } from 'tsshogi'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const PreUserSchema = (input: any): any => {
  if (input === null || input === undefined) {
    return input
  }
  const match: RegExpMatchArray | null = input
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\\//g, '/')
    .match(/<ul[^>]*>(.*?)<\/ul>/s)
  if (match === null) {
    throw new HTTPException(400, { message: 'HTML parse failed' })
  }
  return selectAll('li span', parseDocument(match[1])).map((element) => {
    // @ts-ignore
    const user_id: string = element.children[0].data
    // @ts-ignore
    const rank: string = element.next?.data.trim()
    // @ts-ignore
    const avatar: string = element.prev?.prev.attribs.src.match(/\/avatar\/(.+?)-l.png/)[1]

    return {
      user_id: user_id,
      rank: rank.includes('Kyu')
        ? (Number.parseInt(rank.replace('Kyu', '').trim(), 10) - 1) * -1
        : Number.parseInt(rank.replace('Dan', '').trim()),
      avatar: avatar
    }
  })
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const PreGameSchema = (input: any): any => {
  if (input === null || input === undefined) {
    return input
  }
  if (input.status === false) {
    throw new HTTPException(404, { message: 'Not Found' })
  }
  const play_time_match: RegExpMatchArray | null = input.game_id.match(/(\d{8}_\d{6})/)
  if (play_time_match === null) {
    throw new HTTPException(400, { message: 'PlayTime Parse Error' })
  }
  const play_time: string = dayjs.tz(play_time_match[1], 'YYYYMMDD_HHmmss', 'Asia/Tokyo').format()
  const game_type: string = (() => {
    switch (input.opponent_type) {
      case 0:
        return 'rank'
      case 1:
        return 'friend'
      case 2:
        return 'coach'
      case 3:
        return 'event'
      case 4:
        return 'learning'
      default:
        throw new HTTPException(400, { message: 'Invalid Game Type' })
    }
  })()
  const game_mode: string = (() => {
    if (input.init_sfen_position === 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1') {
      return 'normal'
    }
    return 'sprint'
  })()
  const game_rule: string = (() => {
    switch (input.game_type) {
      case '':
        return '600+0+0'
      case 'sb':
        return '180+0+0'
      case 's1':
        return '0+10+0'
      default:
        throw new HTTPException(400, { message: 'Invalid Game Rule' })
    }
  })()
  const init_time: number = (() => {
    switch (input.game_type) {
      case '':
        return 600
      case 'sb':
        return 180
      case 's1':
        return 0
      default:
        throw new HTTPException(400, { message: 'Invalid Game Type' })
    }
  })()
  let black_time: number = init_time
  let white_time: number = init_time
  const moves: { csa: string; time: number }[] = input.kif.split('|').map((entry: string, index: number) => {
    const [move, timeStr] = entry.split(',')
    const time: number = Number.parseInt(timeStr, 10)
    // 消費時間
    const consumed_time: number = (() => {
      if (init_time === 0) {
        return time
      }
      return (index & 1 ? black_time : white_time) - time
    })()
    if (index & 1) {
      black_time = time
    } else {
      white_time = time
    }
    return {
      csa: move,
      time: consumed_time
    }
  })
  const position: Position | null = Position.newBySFEN(input.init_sfen_position)
  if (position === null) {
    throw new HTTPException(400, { message: 'Invalid SFEN' })
  }
  const record: Record = new Record(position)
  const black = input.user_info[0]
  const white = input.user_info[1]
  if (game_type !== 'coach') {
    record.metadata.setStandardMetadata(RecordMetadataKey.BLACK_NAME, black.name)
    record.metadata.setStandardMetadata(RecordMetadataKey.BLACK_SHORT_NAME, black.name)
    record.metadata.setStandardMetadata(RecordMetadataKey.WHITE_NAME, white.name)
    record.metadata.setStandardMetadata(RecordMetadataKey.WHITE_SHORT_NAME, white.name)
  }
  record.metadata.setStandardMetadata(RecordMetadataKey.START_DATETIME, play_time)
  record.metadata.setStandardMetadata(RecordMetadataKey.TIME_LIMIT, game_rule)
  record.metadata.setStandardMetadata(RecordMetadataKey.JISHOGI, '27')
  for (const move of moves) {
    const _move: Move | Error = parseCSAMove(record.position, move.csa)
    if (_move instanceof Error) {
      throw new HTTPException(400, { message: 'Invalid Move' })
    }
    record.append(_move)
    record.current.setElapsedMs(move.time * 1000)
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const user_info: { name: string; rank: number; avatar: string }[] = input.user_info.map((user: any) => ({
    ...user,
    rank: user.dan
  }))

  return {
    ...input,
    play_time: play_time,
    game_rule: game_rule,
    game_mode: game_mode,
    game_type: game_type,
    position: input.init_sfen_position,
    black: user_info[0],
    white: user_info[1],
    kif: exportJKF(record),
    tags: []
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const PreGameListSchema = (input: any): any => {
  if (input === null || input === undefined) {
    return input
  }
  // @ts-ignore
  const document = parseDocument(DomUtils.getInnerHTML(parseDocument(input)))
  const contents = selectAll('div.game_list_contents', document)

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return contents.map((content: any) => {
    const game_id: string | null = new URL(
      selectOne('div.caption_right_side .analytics_link a', content).attribs.href
    ).searchParams.get('wars_game_id')
    if (game_id === null) {
      throw new HTTPException(400, { message: 'GameId Parse Error' })
    }
    const is_win: boolean = content.attribs.class === 'game_list_contents winner_bg'
    const is_draw: boolean = content.attribs.class === 'game_list_contents flat_bg'
    const is_playing: boolean = selectOne(
      'div.game_players .left_right_players .left_player img.win_lose_img',
      content
    ).attribs.src.includes('playing')
    const game_mode: string = selectOne('div.game_category .init_pos_type_text', content)
      .children[0].data.trim()
      .toLocaleLowerCase()
    const time: string = selectOne('div.game_category .time_mode_text', content)
      .children[0].data.trim()
      .toLocaleLowerCase()
    const game_rule: string = (() => {
      switch (time) {
        case '10 min':
          return '600+0+0'
        case '3 min':
          return '180+0+0'
        case '10 sec':
          return '0+10+0'
        default:
          throw new HTTPException(400, { message: 'Invalid Game Rule' })
      }
    })()
    const black = (() => {
      const avatar = selectOne('.left_player_avatar', content).attribs.src.match(/\/avatar\/(.+?)-l.png/)[1]
      const name = selectOne('.player_name_text_left', content).children[0].data.trim()
      const rank = selectOne('.player_dan_text_left', content).children[0].data.trim()
      return {
        name: name,
        rank: Number.parseInt(rank.match(/(\d+) (Dan|Kyu)/)[1], 10) * (rank.includes('Dan') ? 1 : -1),
        avatar: avatar
      }
    })()
    const white = (() => {
      const avatar = selectOne('.right_player_avatar', content).attribs.src.match(/\/avatar\/(.+?)-r.png/)[1]
      const name = selectOne('.player_name_text_right', content).children[0].data.trim()
      const rank = selectOne('.player_dan_text_right', content).children[0].data.trim()
      return {
        name: name,
        rank: Number.parseInt(rank.match(/(\d+) (Dan|Kyu)/)[1], 10) * (rank.includes('Dan') ? 1 : -1),
        avatar: avatar
      }
    })()
    const tags = selectAll('div.game_footer .game_badges span a', content)
      .map(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (tag: any) => Number.parseInt(tag.attribs.href.match(/trophy\/(\d+)/)[1], 10)
      )
      .sort((a: number, b: number) => (a - b ? -1 : 1))
    const play_time_match: RegExpMatchArray | null = game_id.match(/(\d{8}_\d{6})/)
    if (play_time_match === null) {
      throw new HTTPException(400, { message: 'PlayTime Parse Error' })
    }
    const play_time: string = dayjs.tz(play_time_match[1], 'YYYYMMDD_HHmmss', 'Asia/Tokyo').format()
    return {
      game_id: game_id,
      play_time: play_time,
      black: black,
      white: white,
      game_type: 'rank',
      game_mode: game_mode,
      game_rule: game_rule,
      result: is_playing ? undefined : is_draw ? 'DRAW' : is_win ? 'WIN' : 'LOSE',
      tags: tags
    }
  })
}
