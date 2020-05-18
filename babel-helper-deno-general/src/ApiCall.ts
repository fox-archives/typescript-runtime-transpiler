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
    if (currentParentMemberExpression.property.type !== "Identifier") {
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
      currentParentMemberExpression.object.type !== "MemberExpression" &&
      currentParentMemberExpression.object.type !== "Identifier"
    ) {
      console.log(
        "only member expressions and identifiers must exist down the chain. found: ",
        currentParentMemberExpression.object.type
      );
      console.log(require('util').inspect(currentParentMemberExpression, {showHidden: false, depth: null}))
      throw new Error(
        `non member expression found while walking up (down) the chain. found ${currentParentMemberExpression.object.type}`,
      );
    }

    // if we've reached an identifier, we know we are at the end of the chain
    // stop the walk
    if (currentParentMemberExpression.object.type === "Identifier") {
      memberExpressionArray.push(currentParentMemberExpression.object.name);
      memberExpressionArray.reverse();
      return;
    }

    walkUp(currentParentMemberExpression.object);
  };

  walkUp(parentMemberExpression);

  return memberExpressionArray;
}

export class ApiCall {
  #likeMemberExpressionChain: string[]

  /**
   * right now 'node' is assumed to be a CallExpression
   */
  constructor(node) {
    this.#likeMemberExpressionChain = flattenLikeMemberExpressionChain(node.callee)
  }

  /**
   * @desc tests to see if two api calls are roughly similar.
   */
  public matches(comparison: string): boolean {
    return this.#likeMemberExpressionChain.join('.') === comparison
  }

  /**
   * @desc converts the babel ast
   */
  public getOpts(): object {
    return {}
  }
}
