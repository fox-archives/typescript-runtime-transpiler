import { types as t } from '@babel/core';
import { astFromPrimitive } from './helper';
import {
  Identifier, MemberExpression, SpreadElement,
  JSXNamespacedName, ArgumentPlaceholder, Expression, ObjectProperty, ObjectExpression,
} from 'bt';


type primitive = string | number | object | bigint | boolean;
/**
 *
 */
export function callExpressionFactory(
  methodChainString: string,
  callParameters: Array<primitive>,
) {
  const methodChainArray = methodChainString.split('.');

  // create the nestedMemberExpression
  // ex. identifier.MemberExpression.MemberExpression(param1, param2, myObject)
  let nestedMemberExpression: Identifier | MemberExpression = t.identifier(
    methodChainArray.shift(),
  );
  for (const identifier of methodChainArray) {
    nestedMemberExpression = t.memberExpression(
      nestedMemberExpression,
      t.identifier(identifier),
    );
  }

  if (!isLastParameterIsObject(callParameters)) {
    const astCallParameters = toAstCallExpressionArguments(callParameters);
    return t.callExpression(nestedMemberExpression, astCallParameters);
  } else {
    const methodOptions = callParameters.pop() as object;

    const astCallParameters = toAstCallExpressionArguments(callParameters);

    // if passed object is empty, then we create the call expression with the empty
    if (Object.keys(methodOptions).length === 0) {
      return t.callExpression(nestedMemberExpression,
        [...astCallParameters, t.objectExpression([])]);
    }

    const astObjectLiteral = toAstObjectLiteral(methodOptions);
    return t.callExpression(nestedMemberExpression, [...astCallParameters, astObjectLiteral]);
  }
}

/**
 *
 */
export function callExpressionFactoryAst(
  methodChainString: string,
  callParameters: Array<Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder>,
) {
  const methodChainArray = methodChainString.split('.');

  // create the nestedMemberExpression
  // ex. identifier.MemberExpression.MemberExpression(param1, param2, myObject)
  let nestedMemberExpression: Identifier | MemberExpression = t.identifier(
    methodChainArray.shift(),
  );
  for (const identifier of methodChainArray) {
    nestedMemberExpression = t.memberExpression(
      nestedMemberExpression,
      t.identifier(identifier),
    );
  }
  return t.callExpression(nestedMemberExpression, callParameters);
}

/**
   * @description converts an object {a: 'b', c: 'd'} to ast representation
   */
function toAstObjectLiteral(objectLiteral: object): ObjectExpression {
  const objectExpressionProperties: Array<ObjectProperty> = [];
  for (const key in objectLiteral) {
    const rawValue = objectLiteral[key];
    objectExpressionProperties.push(t.objectProperty(
      t.identifier(key), astFromPrimitive(rawValue),
    ));
  }
  return t.objectExpression(objectExpressionProperties);
}

/**
   * @description converts an array [1, 4, 9] to ast representation, used most directly for
   * callExpression 'arguments' option
   */
function toAstCallExpressionArguments(args: Array<primitive>): Array<Expression> {
  const astCallParameters: Array<Expression> = [];
  for (const callParameter in args) {
    astCallParameters.push(astFromPrimitive(callParameter));
  }
  return astCallParameters;
}

function isLastParameterIsObject(args: Array<primitive>) {
  const lastParam = args[args.length - 1];
  return typeof lastParam === 'object' && !Array.isArray(lastParam);
}
