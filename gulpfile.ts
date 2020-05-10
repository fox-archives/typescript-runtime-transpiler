import { src, dest } from 'gulp'
import rename from 'gulp-rename'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'

import plugin from './babel-plugin-deno-fs-promises/src'

export default async function transpile() {
  await src('./tests/fs-promises/fixtures/*')
    .pipe(plumber())
    .pipe(babel({
      // @ts-ignore
      plugins: [ plugin ]
    }))
    .pipe(rename('./first.deno.js'))
    .pipe(dest('./tests/fs-promises/fixtures'))
}
