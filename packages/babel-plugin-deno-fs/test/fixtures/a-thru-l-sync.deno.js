import * as denoFs from 'https://deno.land/x/std@0.53.0/fs/mod.ts'
Deno.chmodSync(path, 438)
denoFs.existsSync(path)
