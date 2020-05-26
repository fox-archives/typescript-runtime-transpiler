import fs from 'fs'

fs.chownSync(path, mode)
fs.chownSync('string', mode)
// fs.chownSync(Buffer.from(), mode)
// fs.chownSync(new URL(), mode)

// fs.chownSync('string2', 'modeString')
fs.chownSync('string3', 0o755)
