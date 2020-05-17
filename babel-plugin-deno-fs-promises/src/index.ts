import { ApiCall } from "./apiCall"
import { callExpressionFactory } from './BabelFactories';

type param = string | number | boolean | object



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

        const apiCall = new ApiCall(node)

        if (apiCall.matches('fs.promises.readFile')) {
          path.replaceWith(
            // t.callExpression(
            //   t.memberExpression(t.identifier('Deno'), t.identifier('readTextFile')),
            //   node.arguments
            // )
            callExpressionFactory('Deno.readTextFifle', {
              encoding: 'utf8'
            })
          )
        } else if (apiCall.matches('fs.promises.chmod')) {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier('Deno'), t.identifier('chmod')),
              node.arguments
            )
          )
        } else if (apiCall.matches('fs.promises.chown')) {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier('Deno'), t.identifier('chown')),
              node.arguments
            )
          )
        } else if (apiCall.matches('fs.promises.copyFile')) {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier("Deno"), t.identifier("copyFile")),
              node.arguments,
            ),
          );
        } else if (apiCall.matches('fs.promises.mkdir')) {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(t.identifier("Deno"), t.identifier("mkdir")),
              node.arguments,
            ),
          );
        }
      }
    }
  }
}
