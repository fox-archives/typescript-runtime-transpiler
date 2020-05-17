"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _likeMemberExpressionChain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCall = void 0;
/**
 * @desc this flattens the 'likeMemberExpressionChain' i.e. the nested
 * MemberExpressions (nested in the first parameter) including the Identifier at the
 * end of the chain
 * @params {MemberExpression}
 */
function flattenLikeMemberExpressionChain(parentMemberExpression) {
    // this really is an array of 'properties' of those memberExpression
    const memberExpressionArray = [];
    const walkUp = (currentParentMemberExpression) => {
        if (currentParentMemberExpression.property.type !== "Identifier") {
            console.log("we can't deal with non identifiers. found", currentParentMemberExpression.property.type);
            throw new Error(`non identifier detected. found ${currentParentMemberExpression.property.type}`);
        }
        // yes, this adds them in reverse order. we reverse the whole array at the end
        memberExpressionArray.push(currentParentMemberExpression.property.name);
        if (currentParentMemberExpression.object.type !== "MemberExpression" &&
            currentParentMemberExpression.object.type !== "Identifier") {
            console.log("only member expressions and identifiers must exist down the chain. found: ", currentParentMemberExpression.object.type);
            throw new Error(`non member expression found while walking up (down) the chain. found ${currentParentMemberExpression.object.type}`);
        }
        // if we've reached an identifier, we know we are at the end of the chain
        // stop the walk
        if (currentParentMemberExpression.object.type === "Identifier") {
            memberExpressionArray.push(currentParentMemberExpression.object.name);
            memberExpressionArray.reverse();
            return;
        }
        walkUp(currentParentMemberExpression.object);
    };
    walkUp(parentMemberExpression);
    return memberExpressionArray;
}
class ApiCall {
    /**
     * right now 'node' is assumed to be a CallExpression
     */
    constructor(node) {
        _likeMemberExpressionChain.set(this, void 0);
        __classPrivateFieldSet(this, _likeMemberExpressionChain, flattenLikeMemberExpressionChain(node.callee));
    }
    /**
     * @desc tests to see if two api calls are roughly similar.
     */
    matches(comparison) {
        return __classPrivateFieldGet(this, _likeMemberExpressionChain).join('.') === comparison;
    }
    /**
     * @desc converts the babel ast
     */
    getOpts() {
        return {};
    }
}
exports.ApiCall = ApiCall;
_likeMemberExpressionChain = new WeakMap();
//# sourceMappingURL=ApiCall.js.map