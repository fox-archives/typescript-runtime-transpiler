import { callExpressionFactoryAst, ApiCall } from 'babel-helper-deno-general'
import type {
  Expression,
  SpreadElement,
  JSXNamespacedName,
  ArgumentPlaceholder,
} from 'bt'
import { debug } from './util/debug'

export function callExpressionVisitor(path: any) {
  const { node } = path

  // ex. could be ArrowFunctionExpression etc. Ensure it's not
  if (node.callee.type !== 'MemberExpression') return

  const apiCall = new ApiCall(node)

  if (apiCall.is('fs.promises.readFile')) {
    // TODO: remove this duplicated type
    const args: Array<
      Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
    > = []
    if (!apiCall.argNumHasType(1, String)) {
      throw new Error('first param has to be string')
    }
    args.push(apiCall.getAstOfArgNumber(1))

    if (apiCall.hasKeyInObjectArg('encoding')) {
      path.replaceWith(callExpressionFactoryAst('Deno.readTextFile', args))
    } else {
      path.replaceWith(callExpressionFactoryAst('Deno.readFile', args))
    }
  } else if (apiCall.is('fs.promises.chmod')) {
    const args = apiCall.getAstOfAllArgs()
    path.replaceWith(callExpressionFactoryAst('Deno.chmod', args))
  } else if (apiCall.is('fs.promises.chown')) {
    const args = apiCall.getAstOfAllArgs()
    path.replaceWith(callExpressionFactoryAst('Deno.chown', args))
  } else if (apiCall.is('fs.promises.copyFile')) {
    const src = apiCall.getAstOfArgNumber(1)
    const dest = apiCall.getAstOfArgNumber(2)
    const modeOptional = apiCall.getAstOfArgNumber(3)

    if (modeOptional) {
      debug('mode option for fs.promises.copyFile not supported')
    }

    path.replaceWith(callExpressionFactoryAst('Deno.copyFile', [src, dest]))
  } else if (apiCall.is('fs.promises.mkdir')) {
    const args = apiCall.getAstOfAllArgs()
    path.replaceWith(callExpressionFactoryAst('Deno.mkdir', args))
  }
}
