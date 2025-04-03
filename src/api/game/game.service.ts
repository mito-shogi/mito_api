import type { GameSchema } from './game.schema.dto'

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const getGame = async (q: string): Promise<GameSchema> => {
  return {
    game_id: 'mito_shogi-mito_shogi-20250101_000000',
    game_type: 'sb',
    game_mode: 'normal',
    user_info: [
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
    ],
    position: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1',
    result: 'GOTE_WIN_TIMEOUT',
    handicap: 0
  }
}
