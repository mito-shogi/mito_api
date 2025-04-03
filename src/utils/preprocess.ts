import selectAll from 'css-select'
import { HTTPException } from 'hono/http-exception'
import { parseDocument } from 'htmlparser2'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const PreUserSchema = (input: any): any => {
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
