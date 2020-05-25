// import { callExpressionFactoryAst, ApiCall,
// ApiPropertyAccessor } from 'babel-helper-deno-general';
// import type {
//   Expression, SpreadElement, JSXNamespacedName, ArgumentPlaceholder,
// } from 'bt';
// import { debug } from './util/debug';

export function callExpressionVisitor(path) {
  const { node } = path

  //   // ex. could be ArrowFunctionExpression etc. Ensure it's not
  //   if (node.callee.type !== 'MemberExpression') return;

  //   const methodCall = new ApiPropertyAccessor(node)
  //   /**
  //    * right now we don't support assignments
  //    */
  //   if (methodCall.includes('process.env')) {
  //     const args = methodCall.getAstOfAllArgs();

  //     path.replaceWith(
  //       callExpressionFactoryAst('Deno.chmodSync', args),
  //     );
  //   }
}
