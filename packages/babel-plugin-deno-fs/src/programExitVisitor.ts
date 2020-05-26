import template from '@babel/template'

export function programExitVisitor(path) {
  // @ts-ignore
  for (const { moduleName, pathName } of this.denoImports) {
    const version = '0.53.0'
    const importAst = template(`
      import * as ${moduleName} from "https://deno.land/x/std@${version}/${pathName}/mod.ts"
    `)()

    path.unshiftContainer('body', [importAst])
  }
}
