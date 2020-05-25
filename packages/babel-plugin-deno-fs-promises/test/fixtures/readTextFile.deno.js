(async () => {
  const contents = await Deno.readTextFile('./file');
  console.log(contents);
})();