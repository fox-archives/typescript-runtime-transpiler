import { callExpressionFactory, ApiCall } from 'babel-helper-deno-general';
import type { Expression, Node } from '../../@types/babel-types/index.d';

export function callExpressionVisitor(path) {
  const { node } = path;

  // ex. could be ArrowFunctionExpression etc. Ensure it's not
  if (node.callee.type !== 'MemberExpression') return;

  const apiCall = new ApiCall(node);

  if (apiCall.matches('fs.promises.readFile')) {
    // todo: make Node => Expression
    const newArgs: Array<Node> = [];
    if (!apiCall.argIsOfType(1, String)) {
      throw new Error('first param has to be string');
    }
    newArgs.push(apiCall.getAstParam(1));

    if (apiCall.hasObjectParamKey('encoding')) {
      path.replaceWith(
        callExpressionFactory('Deno.readTextFile', []),
      );
    } else {
      path.replaceWith(
        callExpressionFactory('Deno.readFile', []),
      );
    }
  } // else if (apiCall.matches('fs.promises.chmod')) {
  //   const args = node.arguments;
  //   path.replaceWith(
  //     callExpressionFactory('Deno.chmod', [{

  //     }]),
  //   );
  // } else if (apiCall.matches('fs.promises.chown')) {
  //   path.replaceWith(
  //     callExpressionFactory('Deno.chown', []),
  //   );
  // } else if (apiCall.matches('fs.promises.copyFile')) {
  //   path.replaceWith(
  //     callExpressionFactory('fs.copyFile', []),
  //   );
  // } else if (apiCall.matches('fs.promises.mkdir')) {
  //   path.replaceWith(
  //     callExpressionFactory('Deno.mkdir', []),
  //   );
  // }
}
