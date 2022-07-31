import * as ts from 'typescript'


const myTransform: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    const visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
      // If it is a expression statement,
      if (ts.isExpressionStatement(node)) {
        // Return it twice.
        // Effectively duplicating the statement
        return [node, node];
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor);
  };
};

const source = `
console.log('test')
`

const compilerOptions = { target: ts.ScriptTarget.ESNext }
const entryModule = 'someName'

const compilerHost = ts.createCompilerHost(compilerOptions)
const program = ts.createProgram([entryModule], compilerOptions, compilerHost)
const msgs = {}
const emitResult = program.emit(undefined, undefined, undefined, undefined, {
  before: [
    myTransform
  ]
})
console.log(emitResult)

// function myTransformerPlugin(program: ts.Program) {
// 	return {
// 		before(ctx: ts.TransformationContext) {
// 			return (sourceFile: ts.SourceFile) => {
// 				function visitor(node: ts.Node): ts.Node {
// 					if (
// 						ts.isCallExpression(node) &&
// 						node.expression.getText() === 'safely'
// 					) {
// 						const target = node.arguments[0]
// 						if (ts.isPropertyAccessExpression(target)) {
// 							return ts.createBinary(
// 								target.expression,
// 								ts.SyntaxKind.AmpersandAmpersandToken,
// 								target
// 							)
// 						}
// 					}
// 					return ts.visitEachChild(node, visitor, ctx)
// 				}
// 				return ts.visitEachChild(sourceFile, visitor, ctx)
// 			}
// 		},
// 	}
}
