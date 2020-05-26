import { addNamed } from '@babel/helper-module-imports'
import { types as t, template } from '@babel/core'
import { expressionStatement } from '@babel/types'

export class Mod {
  node: any

  constructor(node) {
    this.node = node
  }

  /**
   *
   */
  public ensureStdImport(
    denoImports: object,
    moduleName: string,
    pathName: string
  ): void {
    // @ts-ignore
    denoImports.add({
      moduleName,
      pathName,
    })
  }
}
