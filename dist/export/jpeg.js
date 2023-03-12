"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("./image");
const index_1 = require("../index");
async function exportJpeg(exporter, input, pageIndex, debug = false) {
    return await (0, image_1.exportImage)(exporter, input, pageIndex, index_1.Format.JPEG, debug);
}
exports.default = exportJpeg;
//# sourceMappingURL=jpeg.js.map