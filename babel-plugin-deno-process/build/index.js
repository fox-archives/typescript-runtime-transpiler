"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function declare(api, options) {
    api.assertVersion(7);
    const { types: t } = api;
    return {
        name: 'babel-plugin-deno-process',
        visitor: {
            Identifier(path, state) {
                const { node } = path;
                const { source } = node;
                console.log(node);
            },
        },
    };
}
exports.default = declare;
//# sourceMappingURL=index.js.map