import template from '@babel/template'

export function programExitVisitor(path) {
  // @ts-ignore
  for (const denoImport of this.denoImports) {
    const version = '0.53'
    const importAst = template(`
      import { ${denoImport} } from "https://deno.land/std/@${version}/mod.ts"
    `)()

    path.unshiftContainer('body', [importAst])
  }
}
