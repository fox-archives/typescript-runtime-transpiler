import { declare } from "@babel/helper-plugin-utils";
// @ts-ignore
import denoFsPromises from "babel-plugin-deno-fs-promises"

export default declare((api, opts) => {
  api.assertVersion(7)

  return {
    plugins: [
      denoFsPromises
    ].filter(Boolean)
  }
})
