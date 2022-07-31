import * as ts from 'typescript'

const source = "let x: string  = 'string'"

let result = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ESNext },
})

console.log(JSON.stringify(result))
