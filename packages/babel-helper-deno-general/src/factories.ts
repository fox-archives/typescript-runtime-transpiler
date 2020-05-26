import { types as t } from '@babel/core'
import {
  Identifier,
  MemberExpression,
  SpreadElement,
  JSXNamespacedName,
  ArgumentPlaceholder,
  Expression,
  ObjectProperty,
  ObjectExpression,
} from 'bt'
import {
  astFromPrimitive,
  toAstCallExpressionArguments,
  isLastParameterObject,
} from './util'
import { debug } from './util/debug'

type primitive = string | number | object | bigint | boolean | undefined | null

/**
 *
 */
export function callExpressionFactory(
  methodChainString: string,
  callParameters: Array<primitive>
) {
  debug('callExpressionFactoryArgs: %c, %O', methodChainString, callParameters)
  const methodChainArray = methodChainString.split('.')

  // create the nestedMemberExpression
  // ex. identifier.MemberExpression.MemberExpression(param1, param2, myObject)
  let nestedMemberExpression: Identifier | MemberExpression = t.identifier(
    methodChainArray.shift()
  )
  for (const identifier of methodChainArray) {
    nestedMemberExpression = t.memberExpression(
      nestedMemberExpression,
      t.identifier(identifier)
    )
  }

  if (!isLastParameterObject(callParameters)) {
    const astCallParameters = toAstCallExpressionArguments(callParameters)
    return t.callExpression(nestedMemberExpression, astCallParameters)
  } else {
    const methodOptions = callParameters.pop() as object

    const astCallParameters = toAstCallExpressionArguments(callParameters)

    // if passed object is empty, then we create the call expression with the empty
    if (Object.keys(methodOptions).length === 0) {
      return t.callExpression(nestedMemberExpression, [
        ...astCallParameters,
        t.objectExpression([]),
      ])
    }

    const astObjectLiteral = toAstObjectLiteral(methodOptions)
    return t.callExpression(nestedMemberExpression, [
      ...astCallParameters,
      astObjectLiteral,
    ])
  }
}

/**
 * @desc convert method chain 'thing.two()' to ast representation
 */
export function callExpressionFactoryAst(
  methodChainString: string,
  callParameters?: Array<
    Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >
) {
  const methodChainArray = methodChainString.split('.')

  // create the nestedMemberExpression
  // ex. identifier.MemberExpression.MemberExpression(param1, param2, myObject)
  let nestedMemberExpression: Identifier | MemberExpression = t.identifier(
    methodChainArray.shift()
  )
  for (const identifier of methodChainArray) {
    nestedMemberExpression = t.memberExpression(
      nestedMemberExpression,
      t.identifier(identifier)
    )
  }
  if (callParameters) {
    return t.callExpression(nestedMemberExpression, callParameters)
  } else {
    return t.callExpression(nestedMemberExpression, [])
  }
}

/**
 * @description converts an object {a: 'b', c: 'd'} to ast representation
 */
function toAstObjectLiteral(objectLiteral: object): ObjectExpression {
  const objectExpressionProperties: Array<ObjectProperty> = []
  for (const key in objectLiteral) {
    const rawValue = objectLiteral[key]
    objectExpressionProperties.push(
      t.objectProperty(t.identifier(key), astFromPrimitive(rawValue))
    )
  }
  return t.objectExpression(objectExpressionProperties)
}
