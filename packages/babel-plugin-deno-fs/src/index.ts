import { declare } from '@babel/helper-plugin-utils'
import { importDeclarationVisitor } from './importDeclarationVisitor'
import { callExpressionVisitor } from './callExpressionVisitor'
import { programExitVisitor } from './programExitVisitor'

export default declare((api: any, options: any) => {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-deno-fs-promises',
    pre(state: any) {
      // TODO: remove need for ts ignores
      // @ts-ignore
      this.denoImports = new Set()
    },
    visitor: {
      Program: {
        exit(path: any) {
          return programExitVisitor.call(this, path)
        },
      },
      ImportDeclaration(path: any) {
        return importDeclarationVisitor.call(this, path)
      },
      CallExpression(path: any) {
        return callExpressionVisitor.call(this, path)
      },
    },
  }
})
