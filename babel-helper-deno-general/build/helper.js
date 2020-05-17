"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.astFromPrimitive = void 0;
const core_1 = require("@babel/core");
function astFromPrimitive(rawValue) {
    let value;
    if (typeof rawValue === 'string')
        value = core_1.types.stringLiteral(rawValue);
    else if (typeof rawValue === 'bigint')
        value = core_1.types.bigIntLiteral(rawValue.toString());
    else if (typeof rawValue === 'boolean')
        value = core_1.types.booleanLiteral(rawValue);
    else if (typeof rawValue === 'undefined')
        value = core_1.types.unaryExpression("void", core_1.types.numericLiteral(0), true);
    else if (rawValue === null)
        value = core_1.types.nullLiteral();
    else if (typeof rawValue === 'number')
        value = core_1.types.numericLiteral(rawValue);
    else if (rawValue instanceof RegExp)
        value = core_1.types.regExpLiteral(rawValue.toString());
    else
        throw new Error(`getAstFromPrimitive: unexpected rawValue: ${rawValue}`);
    return value;
}
exports.astFromPrimitive = astFromPrimitive;
//# sourceMappingURL=helper.js.map