import * as babel from '@babel/core'

import { readTranspileAndWrite } from './test.utils'

test('first test', async () => {
  const {
    denoResult
  } = await readTranspileAndWrite('first')


  expect(denoResult.code).toMatchSnapshot()
  expect(denoResult.ast).toMatchSnapshot()
})
