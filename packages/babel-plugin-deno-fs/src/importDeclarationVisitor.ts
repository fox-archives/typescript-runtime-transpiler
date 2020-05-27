export function importDeclarationVisitor(path: any) {
  const { node } = path
  const { source } = node

  if (new Set(['fs']).has(source?.value)) {
    path.remove()
  }
}
