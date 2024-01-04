"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const index_1 = require("../index");
async function exportPdf(exporter, input, pageIndex) {
    await (0, browser_1.render)(exporter.page, input, pageIndex, index_1.Format.PDF);
    const pdf = await exporter.page.pdf({
        format: "A4",
        printBackground: true,
    });
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return pdf;
}
exports.default = exportPdf;
//# sourceMappingURL=pdf.js.map