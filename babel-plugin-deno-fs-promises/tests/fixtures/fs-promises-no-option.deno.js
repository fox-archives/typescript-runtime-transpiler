(async () => {
  await Deno.chmod({});
  await Deno.chown({});
  await fs.copyFile({});
  await fs.copyFile({});
  await Deno.mkdir({});
  await Deno.mkdir({});
  await fs.promises.mkdtemp("mkdirtemp");
  await fs.promises.mkdtemp("mkdirtemp2", {
    encoding: 'utf8'
  });
  await fs.promises.open(path, flags);
})();