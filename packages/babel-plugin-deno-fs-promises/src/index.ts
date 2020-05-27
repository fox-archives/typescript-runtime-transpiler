import { declare } from '@babel/helper-plugin-utils'
import { importDeclarationVisitor } from './importDeclarationVisitor'
import { callExpressionVisitor } from './callExpressionVisitor'

export default declare((api: any, options: any) => {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-deno-fs-promises',
    visitor: {
      ImportDeclaration: (path: any) => importDeclarationVisitor(path),
      CallExpression: (path: any) => callExpressionVisitor(path),
    },
  }
})
