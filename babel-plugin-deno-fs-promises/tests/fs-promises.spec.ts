import path from 'path'
import util from 'util'
import child_process, { ChildProcess } from 'child_process'
import * as babel from '@babel/core'

import { readNodeFile, writeDenoFile } from './test.utils'
import plugin from '../src/index'

const exec = util.promisify(child_process.exec)

async function transpile() {
  const fileContents = await readNodeFile('first')
  // @ts-ignore
  const { code } = await babel.transformAsync(fileContents, {
    plugins: [ plugin ],
    ast: false
  })
  await writeDenoFile('first', code)
}


async function nodeRun(file): Promise<{
  stdout: string
  stderr: string
}> {
  const scriptPath = path.join(__dirname, 'fixtures', `${file}.mjs`)
  const { stdout, stderr } = await exec(`node ${scriptPath}`, {
    cwd: path.join(__dirname, 'fixtures'),
    windowsHide: true
  })
  return { stdout, stderr }
}

async function denoRun(file: string): Promise<{
  stdout: string,
  stderr: string
}> {
  const scriptPath = path.join(__dirname, 'fixtures', `${file}.deno.js`)
  const { stdout, stderr } = await exec(`deno run --allow-read ${scriptPath}`, {
    cwd: path.join(__dirname, 'fixtures'),
    windowsHide: true
  })
  return { stdout, stderr }
}

test('outputs are equal', async () => {
  // expect((await nodeRun('first')).stdout).toBe((await denoRun('first')).stdout)
  await transpile()

  expect(false).toBe(true)
})
