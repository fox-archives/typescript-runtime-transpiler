import { callExpressionFactoryAst, ApiCall } from 'babel-helper-deno-general';
import type {
  Expression, Node, SpreadElement, JSXNamespacedName, ArgumentPlaceholder,
} from 'bt';

export function callExpressionVisitor(path) {
  const { node } = path;

  // ex. could be ArrowFunctionExpression etc. Ensure it's not
  if (node.callee.type !== 'MemberExpression') return;

  const apiCall = new ApiCall(node);

  if (apiCall.matches('fs.promises.readFile')) {
    const args: Array<Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder> = [];
    if (!apiCall.argNumHasType(1, String)) {
      throw new Error('first param has to be string');
    }
    args.push(apiCall.getArgNumAst(1));

    if (apiCall.objParamHasKey('encoding')) {
      path.replaceWith(
        callExpressionFactoryAst('Deno.readTextFile', args),
      );
    } else {
      path.replaceWith(
        callExpressionFactoryAst('Deno.readFile', args),
      );
    }
  } else if (apiCall.matches('fs.promises.chmod')) {
    const args = apiCall.getArgsAst();
    path.replaceWith(
      callExpressionFactoryAst('Deno.chmod', args),
    );
  } else if (apiCall.matches('fs.promises.chown')) {
    const args = apiCall.getArgsAst();
    path.replaceWith(
      callExpressionFactoryAst('Deno.chown', args),
    );
  } else if (apiCall.matches('fs.promises.copyFile')) {
    const src = apiCall.getArgNumAst(1);
    const dest = apiCall.getArgNumAst(2);
    const modeOptional = apiCall.getArgNumAst(3);

    if (modeOptional) {
      console.warn('mode option for fs.promises.copyFile not supported');
    }

    path.replaceWith(
      callExpressionFactoryAst('Deno.copyFile', [src, dest]),
    );
  } else if (apiCall.matches('fs.promises.mkdir')) {
    const args = apiCall.getArgsAst();
    path.replaceWith(
      callExpressionFactoryAst('Deno.mkdir', args),
    );
  }
}
