import debug from 'debug';
import { importDeclarationVisitor } from './importDeclarationVisitor';
import { callExpressionVisitor } from './callExpressionVisitor';

const d = debug('babel-deno:fs-promises');

d('booting %o', 'otherrr');

export default function declare(api, options) {
  api.assertVersion(7);

  return {
    name: 'babel-plugin-deno-fs-promises',
    visitor: {
      ImportDeclaration: (path) => importDeclarationVisitor(path),
      CallExpression: (path) => callExpressionVisitor(path),
    },
  };
}
