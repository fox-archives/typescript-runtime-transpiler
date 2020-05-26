Deno.mkdirSync(path, options)
Deno.mkdirSync('path', {
  recursive: true,
})
Deno.mkdirSync('path2', {
  mode: 'string',
})
Deno.mkdirSync('path3', {
  recursive: true,
  mode: 0o755,
})
