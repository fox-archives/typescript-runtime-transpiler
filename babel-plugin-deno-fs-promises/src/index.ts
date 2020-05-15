type param = string | number | boolean | object

/**
 * @desc converts babel ast nested MemberExpressions to flat array
 * @params {MemberExpression}
 */
function unnestMemberExpressions(parentMemberExpression): Array<string> {
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

/**
 * does the mested MemberExpression equivalent
 * (ex. 'fs.promises.readFile')
 */
function matchesApiCall(referenceApiCall: Array<string>, apiCall: string): boolean {
  const apiCallRepresentation: Array<string> = apiCall.split('.')

  if (referenceApiCall.length !== apiCallRepresentation.length) return false

  let doesMatch = true
  ensuringApiCallsAreTheSame: for(let i = 0; i < referenceApiCall.length; ++i) {
    const referenceLikeIdentifier = referenceApiCall[i]
    const userInputIdentifier = apiCallRepresentation[i]

    if (referenceLikeIdentifier !== userInputIdentifier) {
      doesMatch = false
      break ensuringApiCallsAreTheSame
    }
  }

  return doesMatch
}

function getApiCall(node: any) {
  if (node.type !== 'CallExpression') return

  const apiCallArray = unnestMemberExpressions(node.callee)
  const doesMatch = matchesApiCall(apiCallArray, 'fs.promises.readFile')
}

function isPromisesReadFile(callee) {
  if (callee.type !== 'MemberExpression') return false

  if(callee.object.property?.name === 'Deno') return false

  if (callee.property?.name === 'readFile' &&
    callee.object.property?.name === 'promises' &&
    callee.object.object?.name === 'fs'
  ) return true
  return false
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


        // if (!isPromisesReadFile(node.callee)) return

        const likeMemberExpressionChain = unnestMemberExpressions(node.callee)

        if (matchesApiCall(likeMemberExpressionChain, 'fs.promises.readFile')) {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier('Deno'), t.identifier('readTextFile')),
              node.arguments
            )
          )
        }
      }
    }
  }
}
