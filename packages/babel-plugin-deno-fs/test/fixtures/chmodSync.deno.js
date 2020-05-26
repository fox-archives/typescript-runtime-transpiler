// invalid
Deno.chmodSync(438)
Deno.chmodSync(path, 438) // correct

Deno.chmodSync(path, 438)
Deno.chmodSync('string', 438) // fs.chmodSync(Buffer.from(), mode)
// fs.chmodSync(new URL(), mode)
// fs.chmodSync('string2', 'modeString')

Deno.chmodSync('string3', 438)
