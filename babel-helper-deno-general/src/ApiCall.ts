import type { CallExpression, Node, ObjectExpression } from '../../@types/babel-types/index.d';

/**
 * @desc this flattens the 'likeMemberExpressionChain' i.e. the nested
 * MemberExpressions (nested in the first parameter) including the Identifier at the
 * end of the chain
 * @params {MemberExpression}
 */
function flattenLikeMemberExpressionChain(
  parentMemberExpression,
): Array<string> {
  // this really is an array of 'properties' of those memberExpression
  const memberExpressionArray: Array<string> = [];

  const walkUp = (currentParentMemberExpression) => {
    if (currentParentMemberExpression.property.type !== 'Identifier') {
      console.log(
        "we can't deal with non identifiers. found",
        currentParentMemberExpression.property.type,
      );
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
      console.log(
        'only member expressions and identifiers must exist down the chain. found: ',
        currentParentMemberExpression.object.type,
      );
      console.log(require('util').inspect(currentParentMemberExpression, { showHidden: false, depth: null }));
      throw new Error(
        `non member expression found while walking up (down) the chain. found ${currentParentMemberExpression.object.type}`,
      );
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

/**
 * @note probably the wrong abstraction
 */
// function argumentsAstToPrimitive(callExpressionArgs: CallExpression['arguments']): Array<primitive> {
//   const apiCallArguments: Array<primitive> = [];
//   let callExpressionArg: Node;
//   for (callExpressionArg of callExpressionArgs) {
//     if (callExpressionArg.type === 'StringLiteral') {
//       apiCallArguments.push(callExpressionArg.value);
//     } else if (callExpressionArg.type === '')
//   }
//   console.log('aa', args);
//   return [];
// }

/**
 * An ApiCall is essentially a CallExpression, with the calle being nested
 * MemberExpressions up to an Identifier
 */
type primitive = string | number | object | bigint | boolean;
export class ApiCall {
  #likeMemberExpressionChain: ReadonlyArray<string>;

  #arguments: CallExpression['arguments'];

  /**
   * right now 'node' is assumed to be a CallExpression
   */
  constructor(node: CallExpression) {
    this.#likeMemberExpressionChain = flattenLikeMemberExpressionChain(node.callee);
    this.#arguments = node.arguments;
    // this.#argumentsAsText = argumentsAstToPrimitive(node.arguments);
  }

  /**
   * @desc tests to see if two api calls are roughly similar.
   */
  public matches(comparison: string): boolean {
    return this.#likeMemberExpressionChain.join('.') === comparison;
  }

  /**
   * @desc converts the babel ast to actual params we can read and do tests on
   */
  public argIsOfType(argNumber: callExpressionNumbers, argType: argTypeOptions): boolean {
    const node = this.#arguments[argNumber - 1];
    if (node.type === 'StringLiteral' && argType === String) return true;
    else if (node.type === 'NumericLiteral' && argType === Number) return true;
    else if (node.type === 'BooleanLiteral' && argType === Boolean) return true;
    else {
      console.log(argNumber, argType);
      throw new Error('could not decipher this');
    }
  }

  public hasTrailingObjectArg() {
    return typeof this.#arguments[this.#arguments.length - 1] === 'object';
  }

  public getAstParam(argNumber: callExpressionNumbers): Node {
    return this.#arguments[argNumber - 1];
  }

  public hasObjectParamKey(keyname: string): boolean {
    if (!this.hasTrailingObjectArg()) return false;

    const objectExpression = this.#arguments[this.#arguments.length - 1] as ObjectExpression;
    for (const likeObjectProperty of objectExpression.properties) {
      console.log(likeObjectProperty, keyname);
      // SpreadElement doesn't contain property key
      if (likeObjectProperty.type === 'SpreadElement') continue;

      if (likeObjectProperty.key.name === keyname) return true;
    }
    return false;
  }
}
type argTypeOptions = StringConstructor | NumberConstructor | BooleanConstructor;
type callExpressionNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
