"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const utilities_1 = require("../utilities");
const index_1 = require("../index");
async function exportSvg(exporter, input, pageIndex, debug = false) {
    const { scale } = await (0, browser_1.render)(exporter.page, debug, input, pageIndex, index_1.Format.SVG);
    const svg = await exporter.page.evaluate((args) => {
        // @ts-ignore
        return exportSvg(window.graph, ...args);
    }, [scale]);
    (0, utilities_1.debugMessage)(debug, "Closing Browser");
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return svg;
}
exports.default = exportSvg;
//# sourceMappingURL=svg.js.map