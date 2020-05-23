#!/bin/sh

export PATH="./node_modules/.bin/:$PATH"

# babel ./packages/is/source \
#   --config-file ./babel.config.js --source-maps true \
#   --extensions .mjs,.js,.ts \
#   --out-dir ./build/is


babel ./packages/is/source \
  --no-babelrc \
  --source-maps true \
  --extensions .mjs,.js,.ts \
  --out-dir ./build/is \
  --plugins @babel/plugin-transform-modules-commonjs \
  --plugins babel-plugin-const-enum \
  --presets @babel/preset-typescript

