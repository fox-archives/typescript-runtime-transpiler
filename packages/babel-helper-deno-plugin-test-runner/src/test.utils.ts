import path from 'path';
import fs from 'fs';
import * as babel from '@babel/core';
import type { BabelFileResult } from 'babel__core';

export async function readNodeFile(
  fixturesDirPath: string, fileName: string,
): Promise<string> {
  const fileNamePath = path.join(fixturesDirPath, `${fileName}.mjs`);
  const input = await fs.promises.readFile(fileNamePath, { encoding: 'utf8' });
  return input;
}

export function transpile(
  pluginNamePath: string,
  fileContents: string,
): Promise<BabelFileResult | null> {
  /* eslint-disable-next-line */
  const plugin = require(pluginNamePath)
  // @ts-ignore
  return babel.transformAsync(fileContents, {
    plugins: [plugin],
    ast: false,
  });
}

export async function writeDenoFile(
  fixturesDirPath: string,
  fileName: string,
  outputContent: string,
): Promise<void> {
  const outputPath = path.join(fixturesDirPath, `${fileName}.deno.js`);
  await fs.promises.writeFile(outputPath, outputContent);
}

export async function readTranspileAndWrite(
  pluginNamePath: string,
  fixturesDirPath: string,
  testFileName: string,
):
  Promise<{
    nodeFile: string,
    denoResult: BabelFileResult;
  }> {
  const nodeFileContents = await readNodeFile(fixturesDirPath, testFileName);
  const denoResult = await transpile(pluginNamePath, nodeFileContents);
  if (!denoResult?.code) throw new Error('somehow, there was problem transpiling and no code was returned');
  await writeDenoFile(fixturesDirPath, testFileName, denoResult.code);
  return {
    nodeFile: nodeFileContents,
    denoResult,
  };
}

/**
 * @desc gets all files ending in .mjs and returns their fileNames (
 * without the prefix)
 */
export function getTestFiles(fixturesFolder): Array<string> {
  const fixtureFiles = fs.readdirSync(fixturesFolder, { withFileTypes: true });
  return fixtureFiles
    .filter((dirent) => dirent.isDirectory)
    .filter((dirent) => dirent.name.includes('.mjs'))
    .map((dirent) => dirent.name.slice(0, -4));
}
