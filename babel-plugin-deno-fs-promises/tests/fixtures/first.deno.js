(async () => {
  const contents = await Deno.re3adTextFile('./file', {
    encoding: 'utf8'
  });
  console.log(contents);
})();