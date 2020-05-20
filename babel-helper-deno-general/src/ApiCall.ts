import {
  SpreadElement,
  JSXNamespacedName,
  ArgumentPlaceholder,
  Expression,
  ObjectExpression,
  CallExpression,
} from 'bt';
import { debug } from './util/debug';

/**
 *
 * @desc this flattens the 'likeMemberExpressionChain' i.e. the nested
 * MemberExpressions (nested in the first parameter) including the Identifier at the
 * end of the chain
 * @params {MemberExpression}
 */
function createCalleeNice(
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

/**
 * An ApiCall is essentially a CallExpression, with the calle being nested
 * MemberExpressions up to an Identifier
 */
type primitive = string | number | object | bigint | boolean;
export class ApiCall {
  /**
   * Nice (easy to handle) representation of a CallExpression's callee. This is limited
   * to nested MemberExpressions (and Identifier) though, we can't handle any CallExpression's
   * within the nest
   */
  #calleeNice: ReadonlyArray<string>;

  /**
   * This isn't 'argumentsNice' like 'calleeNice' is because the
   * CallExpression.arguments structure isn't nested and it's easier
   * to deal with
   */
  #arguments: CallExpression['arguments'];

  constructor(node: CallExpression) {
    this.#calleeNice = createCalleeNice(node.callee);
    this.#arguments = node.arguments;
  }

  /**
   * @desc returns true if two api calls have the same callee
   * on their CallExpression
   */
  public matches(comparison: string): boolean {
    const doesMatch = this.#calleeNice.join('.') === comparison;
    return doesMatch;
  }

  /**
   * @desc converts the babel ast to actual params we can read and do tests on
   */
  public argNumHasType(argNumber: callExpressionNumbers, argType: argTypeOptions): boolean {
    const node = this.#arguments[argNumber - 1];
    if (node.type === 'StringLiteral' && argType === String) return true;
    else if (node.type === 'NumericLiteral' && argType === Number) return true;
    else if (node.type === 'BooleanLiteral' && argType === Boolean) return true;
    else {
      throw new Error('could not decipher this');
    }
  }

  public hasTrailingObjectArg() {
    return typeof this.#arguments[this.#arguments.length - 1] === 'object';
  }

  public getArgNumAst(argNumber: callExpressionNumbers): Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder {
    return this.#arguments[argNumber - 1];
  }

  public getArgsAst(): Array<Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder> {
    return this.#arguments;
  }

  // todo: rename callExpressionNumbers type to something else
  public hasNumParameter(argNumber: callExpressionNumbers): boolean {
    // both .length and argNumber start from 1
    return this.#arguments.length >= argNumber;
  }

  public objParamHasKey(keyname: string): boolean {
    if (!this.hasTrailingObjectArg()) return false;

    const objectExpression = this.#arguments[this.#arguments.length - 1] as ObjectExpression;
    for (const likeObjectProperty of objectExpression.properties) {
      // SpreadElement doesn't contain property key
      if (likeObjectProperty.type === 'SpreadElement') continue;

      if (likeObjectProperty.key.name === keyname) return true;
    }
    return false;
  }
}

type argTypeOptions = StringConstructor | NumberConstructor | BooleanConstructor;
type callExpressionNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
