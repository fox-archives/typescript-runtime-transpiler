import fs from 'fs'

(async () => {
  const contents = await fs.promises.readFile('./file')
  console.log(contents)
})()
