import type { PrimitiveLike } from 't'
import type { argAst } from '../ApiCall'

export function isLastParameterObject(args: Array<PrimitiveLike>) {
  const lastParam = args[args.length - 1]
  return typeof lastParam === 'object' && !Array.isArray(lastParam)
}

/**
 * TODO: fix check, this doesn't actually work
 */
export function isLastAstParameterObject(args: Array<argAst>) {
  const lastParam = args[args.length - 1]
  return typeof lastParam === 'object' && !Array.isArray(lastParam)
}
