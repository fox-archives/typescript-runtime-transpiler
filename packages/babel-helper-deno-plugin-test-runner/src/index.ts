import path from 'path'
import { getTestFiles, readTranspileAndWrite } from './test.utils'

export function runner(dirname: string) {
  const fixturesDirPath = path.join(dirname, 'fixtures')
  const pluginFilePath = path.join(dirname, '../src/index.ts')
  const pluginName = path
    .basename(path.join(dirname, '../'))
    .slice('babel-plugin-deno-'.length)

  describe(`integration: plugin-${pluginName}`, () => {
    const testFiles = getTestFiles(fixturesDirPath)
    for (const testFile of testFiles) {
      /* eslint-disable-next-line no-loop-func */
      test(`snapshot: ${testFile}`, async () => {
        const { denoResult } = await readTranspileAndWrite(
          pluginFilePath,
          fixturesDirPath,
          testFile
        )

        expect(denoResult.code).toMatchSnapshot()
      })
    }
  })
}
