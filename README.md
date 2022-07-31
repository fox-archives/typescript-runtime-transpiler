# babel-deno

## Summary

Includes a Babel preset that transpiles a subset of Node APIs to Deno APIs. This is an experiment and it won't work for most programs.

## Example

```js
// input
import fs from 'fs'

fs.existsSync(path)
```

```js
// output
import * as denoFs from 'https://deno.land/x/std@0.53.0/fs/mod.ts'

denoFs.existsSync(path)
```

## Progress

Right now working on transpiling `fs` and `process` stuff
