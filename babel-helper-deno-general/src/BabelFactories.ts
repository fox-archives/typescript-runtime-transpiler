import { types as t } from '@babel/core';
// import type { MemberExpression, Identifier } from 'babel-types';
import type { MemberExpression, Identifier } from '../../@types/babel-types/index.d';

// import type { Identifier } from '../../@types/babel-types.d';
import { astFromPrimitive } from './helper';

export function callExpressionFactory(
  methodChainWithDots: string,
  parameters: string[],
  methodOptions: object,
) {
  const methodChainArray = methodChainWithDots.split('.');

  let nestedMemberExpression: Identifier | MemberExpression = t.identifier(
    methodChainArray.shift(),
  );

  for (const identifier of methodChainArray) {
    nestedMemberExpression = t.memberExpression(
      nestedMemberExpression, t.identifier(identifier),
    );
  }

  const objectExpressionProperties: any[] = [];
  for (const key in methodOptions) {
    const rawValue = methodOptions[key];

    objectExpressionProperties.push(
      t.objectProperty(t.identifier(key), astFromPrimitive(rawValue)),
    );
  }

  const objectExpression = t.objectExpression(objectExpressionProperties as any);

  // @ts-ignore
  return t.callExpression(nestedMemberExpression, [...parameters, objectExpression]);
}
