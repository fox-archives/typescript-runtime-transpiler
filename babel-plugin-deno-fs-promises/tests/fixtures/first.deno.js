(async () => {
  const contents = await Deno.readTextFile('./file', {
    encoding: 'utf8'
  });
  console.log(contents);
})();