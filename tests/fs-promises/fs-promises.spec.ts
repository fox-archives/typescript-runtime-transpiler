import util from 'util'
import child_process from 'child_process'

const exec = util.promisify(child_process.exec)


;(async (): Promise<void> => {
  const { stdout, stderr } = await exec('node ./fixtures/first.mjs')
  // console.log(stdout)

  const { stdout: stdout2, stderr: stderr2 } = await exec('deno run --allow-read ./fixtures/first.deno.js')
  // console.log(stdout2)

  console.log(stdout, stdout2)
})()
