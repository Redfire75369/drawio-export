"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugMessage = exports.handleRejection = void 0;
function handleRejection(action) {
    return function (e) {
        console.error(`${action} failed with`, e);
    };
}
exports.handleRejection = handleRejection;
function debugMessage(debug, ...messages) {
    if (debug) {
        console.debug(...messages);
    }
}
exports.debugMessage = debugMessage;
//# sourceMappingURL=utilities.js.map