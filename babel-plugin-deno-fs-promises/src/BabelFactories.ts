import { types as t } from "@babel/core"
import type { ObjectExpression, ObjectProperty } from "babel-types"

export function callExpressionFactory(methodChainWithDots: string, methodOptions: {
  [key: string]: 'bigint' | 'boolean' | 'RegExp' | 'number' | 'string'
}) {
  const methodChainArray = methodChainWithDots.split('.')

  // TODO: types
  let nestedMemberExpression: any = t.identifier(methodChainArray.shift())
  for(const identifier of methodChainArray) {
    nestedMemberExpression = t.memberExpression(nestedMemberExpression, t.identifier(identifier))
  }

  const objectExpressionProperties: ObjectProperty[] = []
  for (const key in methodOptions) {
    const rawValue = methodOptions[key]
    let value
    if (typeof rawValue === 'string') value = t.stringLiteral(rawValue)
    else if (typeof rawValue === 'bigint') value = t.bigIntLiteral(rawValue)
    else if (typeof rawValue === 'boolean') value = t.bigIntLiteral(rawValue)
    else if (typeof rawValue === 'undefined') value = t.unaryExpression("void", t.numericLiteral(0), true)
    else if (rawValue === null) value = t.nullLiteral()
    else if (typeof rawValue === 'number') value = t.numericLiteral(rawValue)
    else if (rawValue as object instanceof RegExp) value = t.regExpLiteral(rawValue)
    else throw new Error('unexpected RawValue')

    console.log(key, value, 'thingy')
    // @ts-ignore
    objectExpressionProperties.push(t.objectProperty(t.identifier(key), value))
  }

  const objectExpression = t.objectExpression(objectExpressionProperties as any)
  console.log(nestedMemberExpression, objectExpressionProperties)
  // @ts-ignore
  return t.callExpression(nestedMemberExpression, [objectExpression])
}
