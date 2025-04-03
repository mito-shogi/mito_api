import selectAll from 'css-select'
import dayjs from 'dayjs'
import { HTTPException } from 'hono/http-exception'
import { parseDocument } from 'htmlparser2'
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
    const name: string = element.children[0].data
    // @ts-ignore
    const rank: string = element.next?.data.trim()
    // @ts-ignore
    const avatar: string = element.prev?.prev.attribs.src.match(/\/avatar\/(.+?)-l.png/)[1]

    return {
      name: name,
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
  const play_time_match: RegExpMatchArray | null = input.game_id.match(/(\d{8}_\d{6})/)
  if (play_time_match === null) {
    throw new HTTPException(400, { message: 'play time parse error' })
  }
  const play_time: string = dayjs(play_time_match[1], 'YYYYMMDD_HHmmss').tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm:ss')
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
        throw new HTTPException(400, { message: 'Invalid game type' })
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
        throw new HTTPException(400, { message: 'Invalid game rule' })
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
        throw new HTTPException(400, { message: 'Invalid game rule' })
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
      throw new HTTPException(400, { message: 'move parse error' })
    }
    record.append(_move)
    record.current.setElapsedMs(move.time * 1000)
  }

  return {
    ...input,
    game_rule: game_rule,
    game_mode: game_mode,
    game_type: game_type,
    position: input.init_sfen_position,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    user_info: input.user_info.map((user: any) => ({
      ...user,
      rank: user.dan
    })),
    kif: exportJKF(record),
    tags: []
  }
}
