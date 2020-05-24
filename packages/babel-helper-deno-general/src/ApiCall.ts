import {
  SpreadElement,
  JSXNamespacedName,
  ArgumentPlaceholder,
  Expression,
  ObjectExpression,
  CallExpression,
} from 'bt';
import { createCalleeNice } from './util';

/**
 * An ApiCall is essentially a CallExpression, with the calle being nested
 * MemberExpressions up to an Identifier
 */
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
  public is(comparison: string): boolean {
    const doesMatch = this.#calleeNice.join('.') === comparison;
    return doesMatch;
  }

  /**
   * @desc converts the babel ast to actual params we can read and do tests on
   */
  public argNumHasType(argNumber: argNumbers, argType: argTypeOptions): boolean {
    const node = this.#arguments[argNumber - 1];
    if (node.type === 'StringLiteral' && argType === String) return true;
    else if (node.type === 'NumericLiteral' && argType === Number) return true;
    else if (node.type === 'BooleanLiteral' && argType === Boolean) return true;
    else {
      throw new Error('could not decipher this');
    }
  }


  public hasObjectArg() {
    return typeof this.#arguments[this.#arguments.length - 1] === 'object';
  }

  public getAstOfArgNumber(argNumber: argNumbers): argAst {
    return this.#arguments[argNumber - 1];
  }

  public getAstOfAllArgs(): Array<argAst> {
    return this.#arguments;
  }

  public hasNumberOfArgs(argNumber: argNumbers): boolean {
    // both .length and argNumber start from 1
    return this.#arguments.length >= argNumber;
  }

  public hasKeyInObjectArg(keyname: string): boolean {
    if (!this.hasObjectArg()) return false;

    const objectExpression = this.#arguments[this.#arguments.length - 1] as ObjectExpression;
    for (const likeObjectProperty of objectExpression.properties) {
      // SpreadElement doesn't contain property key
      if (likeObjectProperty.type === 'SpreadElement') continue;

      if (likeObjectProperty.key.name === keyname) return true;
    }
    return false;
  }
}

type argAst = Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder;
type argTypeOptions = StringConstructor | NumberConstructor | BooleanConstructor;
type argNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
