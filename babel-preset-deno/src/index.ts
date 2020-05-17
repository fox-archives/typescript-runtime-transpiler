import { declare } from "@babel/helper-plugin-utils";
// @ts-ignore
import denoFsPromises from "babel-plugin-deno-fs-promises"
import syntaxFlow from "@babel/plugin-syntax-flow";
import transformModulesCommonjs from "@babel/plugin-transform-modules-commonjs"

export default declare((api, opts) => {
  api.assertVersion(7)

  return {
    plugins: [
      syntaxFlow,
      denoFsPromises
    ].filter(Boolean)
  }
})
