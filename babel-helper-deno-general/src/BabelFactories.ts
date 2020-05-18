import { types as t } from '@babel/core';
import type { Identifier, Expression, MemberExpression } from 'babel-types';
import { astFromPrimitive } from './helper';

export function callExpressionFactory(methodChainWithDots: string, parameters: string[], methodOptions: object) {
  const methodChainArray = methodChainWithDots.split('.');

  let nestedMemberExpression: Identifier | MemberExpression = t.identifier(methodChainArray.shift()) as unknown as Identifier;
  for (const identifier of methodChainArray) {
    // @ts-ignore
    nestedMemberExpression = t.memberExpression(nestedMemberExpression as unknown as Expression, t.identifier(identifier)) as unknown as MemberExpression;
  }

  const objectExpressionProperties: any[] = [];
  for (const key in methodOptions) {
    const rawValue = methodOptions[key];

    objectExpressionProperties.push(t.objectProperty(t.identifier(key), astFromPrimitive(rawValue)));
  }

  const objectExpression = t.objectExpression(objectExpressionProperties as any);

  // @ts-ignore
  return t.callExpression(nestedMemberExpression, [...parameters, objectExpression]);
}
