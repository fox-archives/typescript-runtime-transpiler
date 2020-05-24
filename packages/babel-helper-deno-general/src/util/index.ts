import { types as t } from '@babel/core';
import {
  Expression,
} from 'bt';
import { debug } from './debug';

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

/**
 *
 * @desc this flattens the 'likeMemberExpressionChain' i.e. the nested
 * MemberExpressions (nested in the first parameter) including the Identifier at the
 * end of the chain
 * @params {MemberExpression}
 */
export function createCalleeNice(
  parentMemberExpression,
): Array<string> {
  // this really is an array of 'properties' of those memberExpression
  const memberExpressionArray: Array<string> = [];

  const walkUp = (currentParentMemberExpression) => {
    if (currentParentMemberExpression.property.type !== 'Identifier') {
      debug('we cant deal with non identifiers. found %s', currentParentMemberExpression.property.type);
      throw new Error(
        `non identifier detected. found ${currentParentMemberExpression.property.type}`,
      );
    }
    // yes, this adds them in reverse order. we reverse the whole array at the end
    memberExpressionArray.push(currentParentMemberExpression.property.name);

    if (
      currentParentMemberExpression.object.type !== 'MemberExpression'
      && currentParentMemberExpression.object.type !== 'Identifier'
    ) {
      debug("this isn't an (api (if it is a node api at all)) that we can transform: %O", currentParentMemberExpression);
      return;
    }

    // if we've reached an identifier, we know we are at the end of the chain
    // stop the walk
    if (currentParentMemberExpression.object.type === 'Identifier') {
      memberExpressionArray.push(currentParentMemberExpression.object.name);
      memberExpressionArray.reverse();
      return;
    }

    walkUp(currentParentMemberExpression.object);
  };

  walkUp(parentMemberExpression);

  return memberExpressionArray;
}
