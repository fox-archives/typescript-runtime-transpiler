"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callExpressionFactory = void 0;
const core_1 = require("@babel/core");
const helper_1 = require("./helper");
function callExpressionFactory(methodChainWithDots, parameters, methodOptions) {
    const methodChainArray = methodChainWithDots.split('.');
    let nestedMemberExpression = core_1.types.identifier(methodChainArray.shift());
    for (const identifier of methodChainArray) {
        // @ts-ignore
        nestedMemberExpression = core_1.types.memberExpression(nestedMemberExpression, core_1.types.identifier(identifier));
    }
    const objectExpressionProperties = [];
    for (const key in methodOptions) {
        const rawValue = methodOptions[key];
        objectExpressionProperties.push(core_1.types.objectProperty(core_1.types.identifier(key), helper_1.astFromPrimitive(rawValue)));
    }
    const objectExpression = core_1.types.objectExpression(objectExpressionProperties);
    // @ts-ignore
    return core_1.types.callExpression(nestedMemberExpression, [...parameters, objectExpression]);
}
exports.callExpressionFactory = callExpressionFactory;
//# sourceMappingURL=BabelFactories.js.map