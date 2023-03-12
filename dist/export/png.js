"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("./image");
const index_1 = require("../index");
async function exportPng(exporter, input, pageIndex, debug = false) {
    return await (0, image_1.exportImage)(exporter, input, pageIndex, index_1.Format.PNG, debug);
}
exports.default = exportPng;
//# sourceMappingURL=png.js.map