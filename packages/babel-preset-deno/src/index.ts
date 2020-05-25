import { declare } from '@babel/helper-plugin-utils'
import denoFsPromises from 'babel-plugin-deno-fs-promises'
import presetFlow from '@babel/preset-flow'

export default declare((api, opts) => {
  api.assertVersion(7)

  return {
    presets: [presetFlow],
    plugins: [denoFsPromises],
  }
})
