import path from 'path'
import fs from 'fs'
import util from 'util'
import child_process from 'child_process'
import plugin from '../src/index'
import * as babel from '@babel/core'
import type { BabelFileResult } from "babel__core"

const exec = util.promisify(child_process.exec)

export async function readNodeFile(fileName: string): Promise<string> {
  const fileNamePath = path.join(__dirname, 'fixtures', `${fileName}.mjs`)
  const input = await fs.promises.readFile(fileNamePath, { encoding: 'utf8', })
  return input
}

export async function transpile(fileContents: string): Promise<BabelFileResult | null> {
  // @ts-ignore
  return await babel.transformAsync(fileContents, {
    plugins: [plugin],
    ast: false,
  });
}

export async function writeDenoFile (
  fileName: string,
  outputContent: string,
): Promise<void> {
  if (!module?.parent?.filename) {
    throw new Error("module.parent.filename not what we think it is");
  }
  const outputPath = path.join(
    path.join(
      path.dirname(module.parent.filename),
      "fixtures",
      `${fileName}.deno.js`,
    ),
  );
  await fs.promises.writeFile(outputPath, outputContent);
};

export async function readTranspileAndWrite(fileName: string): Promise<{
  nodeFile: string,
  denoResult: BabelFileResult;
}> {
  const nodeFileContents = await readNodeFile(fileName)
  const denoResult = await transpile(nodeFileContents)
  if (!denoResult?.code) throw new Error("somehow, there was problem transpiling and no code was returned")
  await writeDenoFile(fileName, denoResult.code)
  return {
    nodeFile: nodeFileContents,
    denoResult
  }
}

export async function nodeRun(fileName): Promise<{
  stdout: string
  stderr: string
}> {
  const scriptPath = path.join(__dirname, 'fixtures', `${fileName}.mjs`)
  const { stdout, stderr } = await exec(`node ${scriptPath}`, {
    cwd: path.join(__dirname, 'fixtures'),
    windowsHide: true
  })
  return { stdout, stderr }
}

export async function denoRun(fileName: string): Promise<{
  stdout: string,
  stderr: string
}> {
  const scriptPath = path.join(__dirname, 'fixtures', `${fileName}.deno.js`)
  const { stdout, stderr } = await exec(`deno run -A ${scriptPath}`, {
    cwd: path.join(__dirname, 'fixtures'),
    windowsHide: true
  })
  return { stdout, stderr }
}

/**
 * @desc gets all files ending in .mjs and returns their fileNames (
 * without the prefix)
 */
export function getNodeFiles() {
  const fixtureFolder = path.join(__dirname, 'fixtures')
  const fixtureFiles = fs.readdirSync(fixtureFolder, { withFileTypes: true })
  return fixtureFiles
    .filter(dirent => dirent.isDirectory)
    .filter(dirent => dirent.name.includes(".mjs"))
    .map(dirent => dirent.name.slice(0, -4))
}
