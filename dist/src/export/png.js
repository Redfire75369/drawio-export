"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("./image"));
const index_1 = require("../index");
async function exportPng(exporter, input, pageIndex, debug = false) {
    return await (0, image_1.default)(exporter, input, pageIndex, index_1.Format.PNG, debug);
}
exports.default = exportPng;
//# sourceMappingURL=png.js.map