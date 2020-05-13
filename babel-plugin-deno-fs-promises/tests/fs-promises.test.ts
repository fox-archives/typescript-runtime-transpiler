import * as babel from '@babel/core'

// import { readNodeFile } from '../test.utils'

import plugin from '../src/index'

test.skip('first test', async () => {
  // const input = await readNodeFile('first')

  // @ts-ignore
  const { code, ast } = await babel.transformAsync(input, {
    plugins: [ plugin ],
    ast: true
  })
  expect(code).toMatchSnapshot()
  expect(ast).toMatchSnapshot()
})
