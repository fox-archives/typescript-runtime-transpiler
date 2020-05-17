(async () => {
  const contents = await Deno.readTextFile({
    encoding: "utf8"
  });
  console.log(contents);
})();
