import { rollup } from 'rollup'
import { inputOptions, outputOptions } from './rollup.config'

const packages = {
  dotenv: 'lib/main.js',
  'strip-ansi': 'index.js',
  rimraf: 'rimraf.js',
}

async function build() {
  const bundlePromises = []
  for (const packageName in packages) {
    const inputPath = `packages/${packageName}/${packages[packageName]}`
    const outputPath = `build/${packageName}`

    const actualInputOptions = inputOptions
    actualInputOptions.input = inputPath

    const actualOutputOptions = outputOptions
    actualOutputOptions.dir = outputPath

    bundlePromises.push(rollup(inputOptions))
  }

  let bundles
  try {
    bundles = await Promise.all(bundlePromises)
  } catch (err) {
    console.error(err)
    return
  }

  const writePromises = []
  for (const bundle of bundles) {
    writePromises.push(bundle.write(outputOptions))
  }

  try {
    await Promise.all(writePromises)
  } catch (err) {
    console.error(err)
  } finally {
    console.log('done')
  }
}

build()
