import { declare } from '@babel/helper-plugin-utils'
import { importDeclarationVisitor } from './importDeclarationVisitor'
import { callExpressionVisitor } from './callExpressionVisitor'
import { programExitVisitor } from './programExitVisitor'

export default declare((api, options) => {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-deno-fs-promises',
    pre(state) {
      // TODO: remove need for ts ignores
      // @ts-ignore
      this.denoImports = new Set()
    },
    visitor: {
      Program: {
        exit(path) {
          return programExitVisitor.call(this, path)
        },
      },
      ImportDeclaration(path) {
        return importDeclarationVisitor.call(this, path)
      },
      CallExpression(path) {
        return callExpressionVisitor.call(this, path)
      },
    },
  }
})
