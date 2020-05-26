import { types as t } from '@babel/core'
import type { Expression } from 'bt'
import type { Primitive, PrimitiveLike } from 't'
import { error } from './log'
import { debug } from './util/debug'
import generate from "@babel/generator"

/**
 * all these functions convert babel ast to more primitive values
 * or visa versa. similar to 'factories', but more lower level
 */

/**
 * input primitive value (except)
 */
export function astFromPrimitive(rawValue: Primitive) {
  let value
  if (typeof rawValue === 'string') value = t.stringLiteral(rawValue)
  else if (typeof rawValue === 'bigint') {
    value = t.bigIntLiteral(rawValue.toString())
  } else if (typeof rawValue === 'boolean') value = t.booleanLiteral(rawValue)
  else if (typeof rawValue === 'undefined') {
    value = t.unaryExpression('void', t.numericLiteral(0), true)
  } else if (rawValue === null) value = t.nullLiteral()
  else if (typeof rawValue === 'number') value = t.numericLiteral(rawValue)
  else if ((rawValue as object) instanceof RegExp) {
    value = t.regExpLiteral(rawValue.toString())
  } else {
    throw new Error(`getAstFromPrimitive: unexpected rawValue: ${rawValue}`)
  }
  return value
}

export function primitiveFromAst(ast: any): Primitive {
  let value
  if (
    t.isStringLiteral(ast) ||
    t.isNumericLiteral(ast) ||
    t.isBigIntLiteral(ast) ||
    t.isBooleanLiteral(ast)
  ) {
    return ast.value
  } else if (t.isNullLiteral(ast)) {
    return null
  } else if (t.isObjectExpression(ast)) {
    const objectExpressionString = generate(ast)
    return JSON.parse(objectExpressionString)
  } else if (t.isRegExpLiteral(ast)) {
    return ast.pattern
  } else if (
    t.isUnaryExpression(ast) &&
    ast.operator === 'void' &&
    t.isNumericLiteral(ast.argument) &&
    ast.argument.value === 0
  ) {
    return undefined
  } else if (t.isIdentifier(ast)) {
    return ast.name
  }

  const log = 'unexpected value in primitiveFromAst'
  console.error('unexpected value in primitveFromAst: %O', ast)
  error(log, debug)
  throw new Error(log)
}

/**
 * @description converts an array [1, 4, 9] to ast representation, used most directly for
 * callExpression 'arguments' option
 */
export function toAstCallExpressionArguments(
  args: Array<PrimitiveLike>
): Array<Expression> {
  const astCallParameters: Array<Expression> = []
  for (const callParameter in args) {
    astCallParameters.push(astFromPrimitive(callParameter))
  }
  return astCallParameters
}
