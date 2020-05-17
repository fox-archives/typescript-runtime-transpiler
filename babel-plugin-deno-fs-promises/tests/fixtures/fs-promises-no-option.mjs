import fs from 'fs'

(async () => {
  await fs.promises.chmod("chmod", mode)

  await fs.promises.chown("chown", uid, gid)

  await fs.promises.copyFile("copyFileSrc", "copyFileDest", 0o0744)
  await fs.promises.copyFile("copyFileSrc2", "copyFileDest2")

  await fs.promises.mkdir("mkdir")
  await fs.promises.mkdir("mkdir2", {
    recursive: false,
    mode: 0o744
  })

  await fs.promises.mkdtemp("mkdirtemp")
  await fs.promises.mkdtemp("mkdirtemp2", {
    encoding: 'utf8'
  })

  await fs.promises.open(path, flags)
})()
