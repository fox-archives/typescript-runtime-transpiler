/**
 * doesn't contain symbol
 */
export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | undefined
  | null
  | RegExp

/**
 * includes object
 */
export type PrimitiveLike =
  | Primitive
  | object
