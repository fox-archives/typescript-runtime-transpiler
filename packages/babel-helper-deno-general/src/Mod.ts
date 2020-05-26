export class Mod {
  node: any

  constructor(node) {
    this.node = node
  }

  /**
   * ensure we have an import statement at the top of a file
   * for a deno std lib
   */
  public ensureStdImport(
    denoImports: object,
    moduleName: string,
    pathName: string
  ): void {
    // @ts-ignore
    denoImports.add({
      moduleName,
      pathName,
    })
  }
}
