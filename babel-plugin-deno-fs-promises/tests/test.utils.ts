import path from 'path'
import fs from 'fs'

export const readNodeFile = async (fileName: string): Promise<string> => {
  if(!module?.parent?.filename) throw new Error('module.parent.filename not what we think it is')

  const input = await fs.promises.readFile(
    path.join(path.dirname(module.parent.filename), 'fixtures', `${fileName}.mjs`), { encoding: 'utf8' })
  return input
}

export const writeDenoFile = async (fileName: string, outputContent: string): Promise<void> => {
    if(!module?.parent?.filename) throw new Error('module.parent.filename not what we think it is')

    const outputPath = path.join(
    path.join(path.dirname(module.parent.filename), 'fixtures', `${fileName}.deno.js`))

    await fs.promises.writeFile(outputPath, outputContent)
}
