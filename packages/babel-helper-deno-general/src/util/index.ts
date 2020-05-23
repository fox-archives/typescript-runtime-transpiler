import { types as t } from '@babel/core';
import {
  Expression,
} from 'bt';

type primitive = string | number | object | bigint | boolean | undefined | null;
export function astFromPrimitive(rawValue: primitive) {
  let value;
  if (typeof rawValue === 'string') value = t.stringLiteral(rawValue);
  else if (typeof rawValue === 'bigint') {
    value = t.bigIntLiteral(rawValue.toString());
  } else if (typeof rawValue === 'boolean') value = t.booleanLiteral(rawValue);
  else if (typeof rawValue === 'undefined') {
    value = t.unaryExpression('void', t.numericLiteral(0), true);
  } else if (rawValue === null) value = t.nullLiteral();
  else if (typeof rawValue === 'number') value = t.numericLiteral(rawValue);
  else if (rawValue as object instanceof RegExp) {
    value = t.regExpLiteral(rawValue.toString());
  } else {
    throw new Error(`getAstFromPrimitive: unexpected rawValue: ${rawValue}`);
  }
  return value;
}

/**
   * @description converts an array [1, 4, 9] to ast representation, used most directly for
   * callExpression 'arguments' option
   */
export function toAstCallExpressionArguments(
  args: Array<primitive>,
): Array<Expression> {
  const astCallParameters: Array<Expression> = [];
  for (const callParameter in args) {
    astCallParameters.push(astFromPrimitive(callParameter));
  }
  return astCallParameters;
}

export function isLastParameterObject(args: Array<primitive>) {
  const lastParam = args[args.length - 1];
  return typeof lastParam === 'object' && !Array.isArray(lastParam);
}
