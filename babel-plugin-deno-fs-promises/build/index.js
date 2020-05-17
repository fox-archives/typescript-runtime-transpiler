"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const babel_helper_deno_general_1 = require("babel-helper-deno-general");
function declare(api, options) {
    api.assertVersion(7);
    const { types: t } = api;
    return {
        name: 'babel-plugin-deno-fs-promises',
        visitor: {
            ImportDeclaration(path, state) {
                const { node } = path;
                const { source } = node;
                if (new Set(['fs']).has(source === null || source === void 0 ? void 0 : source.value)) {
                    path.remove();
                }
            },
            /**
             * Get all the apis that are being called
             */
            CallExpression(path) {
                const { node } = path;
                // redundant explicit check
                if (node.type !== 'CallExpression')
                    return;
                // ex. could be ArrowFunctionExpression etc. Ensure it's not
                if (node.callee.type !== 'MemberExpression')
                    return;
                const apiCall = new babel_helper_deno_general_1.ApiCall(node);
                if (apiCall.matches('fs.promises.readFile')) {
                    path.replaceWith(babel_helper_deno_general_1.callExpressionFactory('Deno.readTextFile', [], {
                        encoding: 'utf8'
                    }));
                }
                else if (apiCall.matches('fs.promises.chmod')) {
                    const args = node.arguments;
                    path.replaceWith(babel_helper_deno_general_1.callExpressionFactory('Deno.chmod', [], {}));
                }
                else if (apiCall.matches('fs.promises.chown')) {
                    path.replaceWith(babel_helper_deno_general_1.callExpressionFactory('Deno.chown', [], {}));
                }
                else if (apiCall.matches('fs.promises.copyFile')) {
                    path.replaceWith(babel_helper_deno_general_1.callExpressionFactory('fs.copyFile', [], {}));
                }
                else if (apiCall.matches('fs.promises.mkdir')) {
                    path.replaceWith(babel_helper_deno_general_1.callExpressionFactory('Deno.mkdir', [], {}));
                }
            }
        }
    };
}
exports.default = declare;
//# sourceMappingURL=index.js.map