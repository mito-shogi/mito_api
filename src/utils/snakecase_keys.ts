import { isArray, isDate, isObject, reduce, snakeCase } from 'lodash'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const snakeCaseKeys = (obj: any): object => {
  if (!isObject(obj)) {
    return obj
  }
  if (isArray(obj)) {
    return obj.map((v) => snakeCaseKeys(v))
  }
  if (isDate(obj)) {
    return obj
  }
  return reduce(
    obj,
    (r, v, k) => {
      return {
        ...r,
        [snakeCase(k)]: snakeCaseKeys(v)
      }
    },
    {}
  )
}
