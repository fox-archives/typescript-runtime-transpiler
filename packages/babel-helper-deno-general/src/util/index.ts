import { types as t } from '@babel/core'
import { Expression } from 'bt'
import generate from '@babel/generator'
import type { PrimitiveLike } from 't'
import { error } from '../log'
import { debug } from './debug'

// TODO: remove duped primitives
export function astFromPrimitive(rawValue: PrimitiveLike) {
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

// TODO: types
// TODO: actually do this one
// TODO: depreacte actually
export function primitiveFromAst(ast: any): PrimitiveLike {
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

export function isLastParameterObject(args: Array<PrimitiveLike>) {
  const lastParam = args[args.length - 1]
  return typeof lastParam === 'object' && !Array.isArray(lastParam)
}

/**
 *
 * @desc this flattens the 'likeMemberExpressionChain' i.e. the nested
 * MemberExpressions (nested in the first parameter) including the Identifier at the
 * end of the chain
 * @params {MemberExpression}
 */
export function createCalleeNice(parentMemberExpression): Array<string> {
  // this really is an array of 'properties' of those memberExpression
  const memberExpressionArray: Array<string> = []

  const walkUp = (currentParentMemberExpression) => {
    if (currentParentMemberExpression.property.type !== 'Identifier') {
      debug(
        'we cant deal with non identifiers. found %s',
        currentParentMemberExpression.property.type
      )
      throw new Error(
        `non identifier detected. found ${currentParentMemberExpression.property.type}`
      )
    }
    // yes, this adds them in reverse order. we reverse the whole array at the end
    memberExpressionArray.push(currentParentMemberExpression.property.name)

    if (
      currentParentMemberExpression.object.type !== 'MemberExpression' &&
      currentParentMemberExpression.object.type !== 'Identifier'
    ) {
      debug(
        "this isn't an (api (if it is a node api at all)) that we can transform: %O",
        currentParentMemberExpression
      )
      return
    }

    // if we've reached an identifier, we know we are at the end of the chain
    // stop the walk
    if (currentParentMemberExpression.object.type === 'Identifier') {
      memberExpressionArray.push(currentParentMemberExpression.object.name)
      memberExpressionArray.reverse()
      return
    }

    walkUp(currentParentMemberExpression.object)
  }

  walkUp(parentMemberExpression)

  return memberExpressionArray
}
