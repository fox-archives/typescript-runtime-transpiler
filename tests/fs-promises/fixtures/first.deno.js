
(async () => {
  const contents = await Deno.readFile('./fixtures/file');
  console.log(contents);
})();
