import { callExpressionFactoryAst, ApiCall } from 'babel-helper-deno-general';
import type {
  Expression, SpreadElement, JSXNamespacedName, ArgumentPlaceholder,
} from 'bt';
import { debug } from './util/debug';

export function callExpressionVisitor(path) {
  const { node } = path;

  // ex. could be ArrowFunctionExpression etc. Ensure it's not
  if (node.callee.type !== 'MemberExpression') return;

  const apiCall = new ApiCall(node);

  /**
   * fs.chmodSync has two required args
   */
  if (apiCall.is('fs.chmodSync')) {
    const args = apiCall.getAstOfAllArgs();

    path.replaceWith(
      callExpressionFactoryAst('Deno.chmodSync', args),
    );
  } else if (apiCall.is('fs.chownSync')) {
    const args = apiCall.getAstOfAllArgs();

    path.replaceWith(
      callExpressionFactoryAst('Deno.chownSync', args),
    );
  } else if (apiCall.is('fs.copyFileSync')) {
    const src = apiCall.getAstOfArgNumber(1);
    const dest = apiCall.getAstOfArgNumber(2);
    const mode = apiCall.getAstOfArgNumber(3);

    if (mode) {
      debug("we don't support the third argument of copyFileSync");
    }

    path.replaceWith(
      callExpressionFactoryAst('Deno.copyFileSync', [src, dest]),
    );
  }
}
