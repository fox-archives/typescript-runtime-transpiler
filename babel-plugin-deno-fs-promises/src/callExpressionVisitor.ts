import { callExpressionFactory, ApiCall } from 'babel-helper-deno-general';

export function callExpressionVisitor(path) {
  const { node } = path;

  // ex. could be ArrowFunctionExpression etc. Ensure it's not
  if (node.callee.type !== 'MemberExpression') return;

  const apiCall = new ApiCall(node);

  if (apiCall.matches('fs.promises.readFile')) {
    path.replaceWith(
      callExpressionFactory('Deno.readTextFile', [], {
        encoding: 'utf8',
      }),
    );
  } else if (apiCall.matches('fs.promises.chmod')) {
    const args = node.arguments;
    path.replaceWith(
      callExpressionFactory('Deno.chmod', [], {

      }),
    );
  } else if (apiCall.matches('fs.promises.chown')) {
    path.replaceWith(
      callExpressionFactory('Deno.chown', [], {}),
    );
  } else if (apiCall.matches('fs.promises.copyFile')) {
    path.replaceWith(
      callExpressionFactory('fs.copyFile', [], {}),
    );
  } else if (apiCall.matches('fs.promises.mkdir')) {
    path.replaceWith(
      callExpressionFactory('Deno.mkdir', [], {}),
    );
  }
}
