(async () => {
  const contents = await Deno.readTextFile();
  console.log(contents);
})();