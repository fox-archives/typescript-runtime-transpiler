import fs from 'fs'

(async () => {
  await fs.promises.chmod(path, mode)

  await fs.promises.chown(path, uid, gid)

  await fs.promises.copyFile(src, dest, mode)
  await fs.promises.copyFile(src, dest)

  await fs.promises.mkdir(path)
  await fs.promises.mkdir({
    recursive: false,
    mode: 0o777
  })

  await fs.promises.mkdtemp(prefix)
  await fs.promises.mkdtemp(prefix, {
    encoding: 'utf8'
  })

  await fs.promises.open(path, flags)


})()
