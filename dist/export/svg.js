"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const index_1 = require("../index");
async function exportSvg(exporter, input, pageIndex, transparency = true) {
    const { scale } = await (0, browser_1.render)(exporter.page, input, pageIndex, index_1.Format.SVG);
    const svg = await exporter.page.evaluate(async ([scale, transparency]) => {
        debugger;
        // @ts-ignore
        return await exportSvg(window.graph, window.editorUi, scale, transparency);
    }, [scale, transparency]);
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return svg;
}
exports.default = exportSvg;
//# sourceMappingURL=svg.js.map