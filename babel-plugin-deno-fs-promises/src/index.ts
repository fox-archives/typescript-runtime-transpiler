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
      CallExpression(path) {
        const { node } = path


        if (!isPromisesReadFile(node.callee)) return

        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier('Deno'), t.identifier('readTextFile')),
            node.arguments
          )

        )
        // path.replaceWith(
        //   t.expressionStatement(
        //     t.callExpression(
        //       t.memberExpression(node.left, t.identifier('pipe')),
        //       [node.right]
        //     )
        //   )
        // )
      }
    }
  }
}
