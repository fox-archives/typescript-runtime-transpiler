#!/usr/bin/env -S node --experimental-top-level-await
import fs from 'fs'

const version = JSON.parse(
  await fs.promises.readFile('./packages/babel-preset-deno/package.json')
).version

const rootPackageJson = JSON.parse(await fs.promises.readFile('./package.json'))
rootPackageJson.version = version

await fs.promises.writeFile(
  './package.json',
  JSON.stringify(rootPackageJson, null, 2)
)
