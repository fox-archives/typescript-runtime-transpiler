import fs from 'fs'

fs.mkdirSync(path, options)
fs.mkdirSync('path', {
  recursive: true
})
fs.mkdirSync('path2', {
  mode: 'string'
})
fs.mkdirSync('path3', {
  recursive: true,
  mode: 0o755
})
