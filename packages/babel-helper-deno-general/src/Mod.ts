import { addNamed } from '@babel/helper-module-imports'
import template from '@babel/template'
import { types as t } from '@babel/core'
import { expressionStatement } from '@babel/types'

export class Mod {
  node: any

  constructor(node) {
    this.node = node
  }

  public ensureStdImport(denoImports: object, moduleName: string): void {
    // @ts-ignore
    denoImports.add(moduleName)
  }
}
