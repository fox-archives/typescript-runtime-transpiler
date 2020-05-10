// TODO types

function isPromisesReadFile(callee: any): boolean {
  if (callee.type !== 'MemberExpression') return false

  if(callee.object.property?.name === 'Deno') return false

  if (callee.property?.name === 'readFile' &&
    callee.object.property?.name === 'promises' &&
    callee.object.object?.name === 'fs'
  ) return true
  return false
}

export default function declare(api: any, options: any) {
  api.assertVersion(7)

  const { types: t } = api

  return {
    name: 'babel-plugin-deno-fs',
    visitor: {
      CallExpression(path: any) {
        const { node } = path


        if (!isPromisesReadFile(node.callee)) return

        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier('Deno'), t.identifier('readFile')),
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
