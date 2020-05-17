import fs from 'fs'

;(async () => {
  const contents = await fs.promises.readFile('./file', { encoding: 'utf8' })
  console.log(contents)
})()
