(async () => {
  const contents = await Deno.readTextFifle({
    encoding: "utf8"
  });
  console.log(contents);
})();