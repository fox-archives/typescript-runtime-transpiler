import fs from 'fs'

fs.mkdtempSync(prefix, options)
fs.mkdtempSync('prefix', {})
fs.mkdtempSync('prefix', {
  encoding: 'utf8'
})
