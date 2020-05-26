Deno.chownSync(path, mode);
Deno.chownSync('string', mode); // fs.chownSync(Buffer.from(), mode)
// fs.chownSync(new URL(), mode)
// fs.chownSync('string2', 'modeString')

Deno.chownSync('string3', 0o755);