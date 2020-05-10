import path from 'path'
import fs from 'fs'
import * as babel from '@babel/core'

import plugin from '../../babel-plugin-deno-fs-promises/src/index'

test('first test', async () => {
  const input = await fs.promises.readFile(
    path.join(__dirname, './fixtures/first.mjs'), { encoding: 'utf8' }
  )

  // @ts-ignore
  const { code, ast } = await babel.transformAsync(input, {
    plugins: [ plugin ],
    ast: true
  })
  expect(code).toMatchSnapshot()
  expect(ast).toMatchSnapshot()
})
