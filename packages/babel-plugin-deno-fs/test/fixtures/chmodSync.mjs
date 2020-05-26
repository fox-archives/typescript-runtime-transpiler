// invalid
fs.chmodSync()
fs.chmodSync(path)

// correct
fs.chmodSync(path, mode)
fs.chmodSync('string', mode)
// fs.chmodSync(Buffer.from(), mode)
// fs.chmodSync(new URL(), mode)

// fs.chmodSync('string2', 'modeString')
fs.chmodSync('string3', 0o755)
