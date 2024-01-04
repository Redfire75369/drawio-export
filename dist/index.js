"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPdf = exports.exportSvg = exports.exportImage = exports.exportDiagram = exports.Format = exports.launchExporter = void 0;
var browser_1 = require("./browser");
Object.defineProperty(exports, "launchExporter", { enumerable: true, get: function () { return browser_1.launchExporter; } });
const image_1 = __importDefault(require("./export/image"));
exports.exportImage = image_1.default;
const pdf_1 = __importDefault(require("./export/pdf"));
exports.exportPdf = pdf_1.default;
const svg_1 = __importDefault(require("./export/svg"));
exports.exportSvg = svg_1.default;
var Format;
(function (Format) {
    Format["JPEG"] = "jpeg";
    Format["PDF"] = "pdf";
    Format["PNG"] = "png";
    Format["SVG"] = "svg";
})(Format = exports.Format || (exports.Format = {}));
async function exportDiagram(exporter, input, pageIndex, format) {
    switch (format) {
        case Format.JPEG:
            return await (0, image_1.default)(exporter, input, pageIndex, Format.JPEG);
        case Format.PDF:
            return await (0, pdf_1.default)(exporter, input, pageIndex);
        case Format.PNG:
            return await (0, image_1.default)(exporter, input, pageIndex, Format.PNG);
        case Format.SVG:
            return await (0, svg_1.default)(exporter, input, pageIndex);
    }
}
exports.exportDiagram = exportDiagram;
//# sourceMappingURL=index.js.map