// @ts-ignore
import { callExpressionFactory, ApiCall } from 'babel-helper-deno-general';

export default function declare(api, options) {
  api.assertVersion(7);

  const { types: t } = api;

  return {
    name: 'babel-plugin-deno-process',
    visitor: {
      Identifier(path, state) {
        const { node } = path;
        const { source } = node;

        console.log(node);
      },
    },
  };
}
