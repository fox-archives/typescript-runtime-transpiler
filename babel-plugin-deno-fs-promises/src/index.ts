type param = string | number | boolean | object

/**
 * @desc this flattens the 'likeMemberExpressionChain' i.e. the nested
 * MemberExpressions (nested in the first parameter) including the Identifier at the
 * end of the chain
 * @params {MemberExpression}
 */
function flattenLikeMemberExpressionChain(parentMemberExpression): Array<string> {
  // this really is an array of 'properties' of those memberExpression
  const memberExpressionArray: Array<string> = []

  const walkUp = (currentParentMemberExpression) => {
    if (currentParentMemberExpression.property.type !== 'Identifier') {
      console.log("we can't deal with non identifiers. found", currentParentMemberExpression.property.type)
      throw new Error(`non identifier detected. found ${currentParentMemberExpression.property.type}`)
    }

    // yes, this adds them in reverse order. we reverse the whole array at the end
    memberExpressionArray.push(currentParentMemberExpression.property.name)

    if (currentParentMemberExpression.object.type !== 'MemberExpression' && currentParentMemberExpression.object.type !== 'Identifier') {
      console.log("only member expressions and identifiers must exist down the chain. found: ", currentParentMemberExpression.object.type)
      throw new Error(`non member expression found while walking up (down) the chain. found ${currentParentMemberExpression.object.type}`)
    }

    // if we've reached an identifier, we know we are at the end of the chain
    // stop the walk
    if (currentParentMemberExpression.object.type === 'Identifier') {
      memberExpressionArray.push(currentParentMemberExpression.object.name)
      memberExpressionArray.reverse()
      return
    }

    walkUp(currentParentMemberExpression.object)
  }

  walkUp(parentMemberExpression)

  return memberExpressionArray
}

export default function declare(api, options) {
  api.assertVersion(7)

  const { types: t } = api

  return {
    name: 'babel-plugin-deno-fs',
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path
        const { source } = node

        if (new Set(['fs']).has(source?.value)) {
          path.remove()
        }
      },
      /**
       * Get all the apis that are being called
       */
      CallExpression(path) {
        const { node } = path

        // redundant explicit check
        if (node.type !== 'CallExpression') return
        // ex. could be ArrowFunctionExpression etc. Ensure it's not
        if (node.callee.type !== 'MemberExpression') return

        const likeMemberExpressionChain = flattenLikeMemberExpressionChain(node.callee)

        if (likeMemberExpressionChain.join('.') === 'fs.promises.readFile') {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier('Deno'), t.identifier('readTextFile')),
              node.arguments
            )
          )
          return
        }
        if (likeMemberExpressionChain.join('.') === 'fs.promises.chmod') {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier('Deno'), t.identifier('chmod')),
              node.arguments
            )
          )
          return
        }
        if (likeMemberExpressionChain.join('.') === 'fs.promises.chown') {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier('Deno'), t.identifier('copyFile')),
              node.arguments
            )
          )
          return
        }
      }
    }
  }
}
