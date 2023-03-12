"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const utilities_1 = require("../utilities");
const index_1 = require("../index");
async function exportSvg(exporter, input, pageIndex, transparency = true, debug = false) {
    const { scale } = await (0, browser_1.render)(exporter.page, debug, input, pageIndex, index_1.Format.SVG);
    const svg = await exporter.page.evaluate(async (args) => {
        debugger;
        // @ts-ignore
        return await exportSvg(window.graph, window.editorUi, ...args);
    }, [scale, transparency]);
    (0, utilities_1.debugMessage)(debug, "Closing Browser");
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return svg;
}
exports.default = exportSvg;
//# sourceMappingURL=svg.js.map