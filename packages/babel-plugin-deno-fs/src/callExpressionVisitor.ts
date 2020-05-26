import {
  callExpressionFactoryAst,
  callExpressionFactory,
  ApiCall,
  Mod,
  warn,
} from 'babel-helper-deno-general'
import { types as t } from '@babel/core'
import type { CallExpression } from 'bt'
import { debug } from './util/debug'

export function callExpressionVisitor(path) {
  const { node }: { node: CallExpression } = path

  // ex. could be ArrowFunctionExpression etc. Ensure it's not
  if (node.callee.type !== 'MemberExpression') return

  const apiCall = new ApiCall(node)
  const mod = new Mod(node)

  /**
   * fs.chmodSync(path, mode)
   */
  if (apiCall.is('fs.chmodSync')) {
    const pathArg = apiCall.getAstOfArgNumber(1)
    const mode = apiCall.getAstOfArgNumber(2)

    if (mode) {
      const log =
        "fs.chmodSync: 'mode' arg not supported. adding unsafe placeholder"
      warn(log, debug)
    }
    const placeholder = t.numericLiteral(0o666)

    const astArgs: any = []
    if (pathArg) astArgs.push(pathArg)
    if (placeholder) astArgs.push(placeholder)

    path.replaceWith(callExpressionFactoryAst('Deno.chmodSync', astArgs))
  } else if (apiCall.is('fs.chownSync')) {
    /**
     * fs.chownSync(path, uid, gid)
     * doesn't support path being Buffer or URL
     */
    const args = apiCall.getAstOfAllArgs()

    path.replaceWith(callExpressionFactoryAst('Deno.chownSync', args))
  } else if (apiCall.is('fs.closeSync')) {
    /**
     * fs.closeSync(fd)
     */
    const fd = apiCall.getAstOfArgNumber(1)

    if (fd) {
      path.replaceWith(callExpressionFactoryAst('Deno.closeSync', [fd]))
    } else {
      path.replaceWith(callExpressionFactoryAst('Deno.closeSync', []))
    }
  } else if (apiCall.is('fs.copyFileSync')) {
    /**
     * fs.copyFileSync(src, dest[, mode])
     */
    const src = apiCall.getAstOfArgNumber(1)
    const dest = apiCall.getAstOfArgNumber(2)
    const mode = apiCall.getAstOfArgNumber(3)

    if (mode) {
      const log = 'fs.copyFileSync: mode argument not supported.'
      warn(log, debug)
    }

    path.replaceWith(callExpressionFactoryAst('Deno.copyFileSync', [src, dest]))
  } else if (apiCall.is('fs.existsSync')) {
    /**
     * fs.existsSync(path)
     */
    const pathArg = apiCall.getAstOfArgNumber(1)

    // @ts-ignore
    mod.ensureStdImport(this.denoImports, 'denoFs', 'fs')
    path.replaceWith(callExpressionFactoryAst('denoFs.existsSync', [pathArg]))
  } else if (apiCall.is('fs.mkdirSync')) {
    /**
     * fs.mkdirSync(path[, options])
     */
    // arguments and options the same as deno
    const args = apiCall.getAstOfAllArgs()

    path.replaceWith(callExpressionFactoryAst('Deno.mkdirSync', args))
  }
  // } else if (apiCall.is('fs.mkdtempSync')) {
  //   /**
  //    * fs.mkdtempSync(prefix[, options])
  //    */
  //   const prefix = apiCall.getAstOfArgNumber(1)

  //   const objectMethodProperties = []
  //   if (prefix) {
  //     objectMethodProperties.push(
  //       // @ts-ignore
  //       t.objectProperty(t.stringLiteral('prefix'), prefix)
  //     )
  //   }
  //   const denoOpts = t.objectExpression(objectMethodProperties)

  //   if (Object.keys(denoOpts).length === 0) {
  //     path.replaceWith(callExpressionFactoryAst('Deno.makeTempDirSync'))
  //   } else {
  //     path.replaceWith(
  //       callExpressionFactoryAst('Deno.makeTempDirSync', [denoOpts])
  //     )
  //   }
  // }
}
