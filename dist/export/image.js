"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const index_1 = require("../index");
const border = 2;
async function exportImage(exporter, input, pageIndex, format = index_1.Format.PNG) {
    const { bounds, scale } = await (0, browser_1.render)(exporter.page, input, pageIndex, format);
    const viewport = await setScaledViewport(exporter.page, bounds, scale);
    const screenshotOptions = { type: format, ...viewport };
    const data = await exporter.page.screenshot(screenshotOptions);
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return data;
}
exports.default = exportImage;
async function setScaledViewport(page, bounds, scale) {
    const viewport = {
        width: Math.ceil(bounds.width * scale) + border,
        height: Math.ceil(bounds.height * scale) + border,
    };
    await page.setViewportSize(viewport);
    return viewport;
}
//# sourceMappingURL=image.js.map