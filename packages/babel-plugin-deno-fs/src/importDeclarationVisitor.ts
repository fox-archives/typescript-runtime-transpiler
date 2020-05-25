export function importDeclarationVisitor(path) {
  const { node } = path
  const { source } = node

  if (new Set(['fs']).has(source?.value)) {
    path.remove()
  }
}
