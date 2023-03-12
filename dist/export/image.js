"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportImage = void 0;
const browser_1 = require("../browser");
const index_1 = require("../index");
const utilities_1 = require("../utilities");
const border = 2;
async function exportImage(exporter, input, pageIndex, format = index_1.Format.PNG, debug = false) {
    const { bounds, scale } = await (0, browser_1.render)(exporter.page, debug, input, pageIndex, format);
    const viewport = await setScaledViewport(exporter.page, bounds, scale);
    const screenshotOptions = { type: format, ...viewport };
    (0, utilities_1.debugMessage)(debug, "Screenshotting the result with options:", screenshotOptions);
    const data = await exporter.page.screenshot(screenshotOptions);
    (0, utilities_1.debugMessage)(debug, "Closing Browser");
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return data;
}
exports.exportImage = exportImage;
async function setScaledViewport(page, bounds, scale) {
    const viewport = {
        width: Math.ceil(bounds.width * scale) + border,
        height: Math.ceil(bounds.height * scale) + border,
    };
    console.debug("Using viewport", viewport);
    await page.setViewport(viewport);
    return viewport;
}
//# sourceMappingURL=image.js.map