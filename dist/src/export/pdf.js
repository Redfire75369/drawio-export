"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const index_1 = require("../index");
const utilities_1 = require("../utilities");
async function exportPdf(exporter, input, pageIndex, debug = false) {
    await (0, browser_1.render)(exporter.page, debug, input, pageIndex, index_1.Format.PDF);
    const pdf = await exporter.page.pdf({
        format: "A4",
        printBackground: true,
    });
    (0, utilities_1.debugMessage)(debug, "Closing Browser");
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return pdf;
}
exports.default = exportPdf;
//# sourceMappingURL=pdf.js.map