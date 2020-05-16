import { nodeRun, denoRun, transpile } from './test.utils'

const files = [
  "first"
]
for(const file of files) {
  test(`stdout: ${file}.mjs and it's transpiled form are equal`, async () => {
    await transpile(file)
    expect((await nodeRun(file)).stdout).toBe((await denoRun(file)).stdout)
  })
}
