"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDiagram = exports.Format = exports.launchExporter = void 0;
__exportStar(require("./bin/args"), exports);
var browser_1 = require("./browser");
Object.defineProperty(exports, "launchExporter", { enumerable: true, get: function () { return browser_1.launchExporter; } });
const jpeg_1 = __importDefault(require("./export/jpeg"));
const pdf_1 = __importDefault(require("./export/pdf"));
const png_1 = __importDefault(require("./export/png"));
const svg_1 = __importDefault(require("./export/svg"));
var Format;
(function (Format) {
    Format["JPEG"] = "jpeg";
    Format["PDF"] = "pdf";
    Format["PNG"] = "png";
    Format["SVG"] = "svg";
})(Format = exports.Format || (exports.Format = {}));
async function exportDiagram(exporter, input, pageIndex, format, debug = false) {
    switch (format) {
        case Format.JPEG:
            return await (0, jpeg_1.default)(exporter, input, pageIndex, debug);
        case Format.PDF:
            return await (0, pdf_1.default)(exporter, input, pageIndex, debug);
        case Format.PNG:
            return await (0, png_1.default)(exporter, input, pageIndex, debug);
        case Format.SVG:
            return await (0, svg_1.default)(exporter, input, pageIndex, debug);
    }
}
exports.exportDiagram = exportDiagram;
//# sourceMappingURL=index.js.map