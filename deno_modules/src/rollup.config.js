import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import babelPresetDeno from 'babel-preset-deno'

export const inputOptions = {
  input: 'packages/dotenv/lib/main.js',
  external: ['path', 'fs', 'assert'],
  plugins: [
    commonjs(),
    babel({
      presets: [babelPresetDeno],
      babelHelpers: 'bundled',
    }),
  ],
}

export const outputOptions = {
  dir: 'build/dotenv',
  format: 'es',
  sourcemap: true,
}
