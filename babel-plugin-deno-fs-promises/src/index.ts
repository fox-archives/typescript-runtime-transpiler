// @ts-ignore
import { callExpressionFactory, ApiCall } from 'babel-helper-deno-general';

type param = string | number | boolean | object;


export default function declare(api, options) {
  api.assertVersion(7);

  const { types: t } = api;
  return {
    name: 'babel-plugin-deno-fs-promises',
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        const { source } = node;

        if (new Set(['fs']).has(source?.value)) {
          path.remove();
        }
      },
      /**
       * Get all the apis that are being called
       */
      CallExpression(path) {
        const { node } = path;

        // redundant explicit check
        if (node.type !== 'CallExpression') return;
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
      },
    },
  };
}
