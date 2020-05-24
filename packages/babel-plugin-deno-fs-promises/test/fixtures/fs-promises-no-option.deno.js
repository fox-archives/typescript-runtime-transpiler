(async () => {
  await Deno.chmod('chmod', mode);
  await Deno.chown('chown', uid, gid);
  await Deno.copyFile('copyFileSrc', 'copyFileDest');
  await Deno.copyFile('copyFileSrc2', 'copyFileDest2');
  await Deno.mkdir('mkdir');
  await Deno.mkdir('mkdir2', {
    recursive: false,
    mode: 0o744
  });
  await fs.promises.mkdtemp('mkdirtemp');
  await fs.promises.mkdtemp('mkdirtemp2', {
    encoding: 'utf8'
  });
  await fs.promises.open(path, flags);
})();