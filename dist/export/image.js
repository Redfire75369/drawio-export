"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("../browser");
const index_1 = require("../index");
const utilities_1 = require("../utilities");
const border = 2;
async function exportImage(exporter, input, pageIndex, format = index_1.Format.PNG, debug = false) {
    const { bounds, scale } = await (0, browser_1.render)(exporter.page, debug, input, pageIndex, format);
    const viewport = await setScaledViewport(exporter.page, bounds, scale, debug);
    const screenshotOptions = { type: format, ...viewport };
    (0, utilities_1.debugMessage)(debug, "Screenshotting the Result with Options:", screenshotOptions);
    const data = await exporter.page.screenshot(screenshotOptions);
    (0, utilities_1.debugMessage)(debug, "Closing Browser");
    await exporter.browser.close();
    clearTimeout(exporter.timeout);
    return data;
}
exports.default = exportImage;
async function setScaledViewport(page, bounds, scale, debug = false) {
    const viewport = {
        width: Math.ceil(bounds.width * scale) + border,
        height: Math.ceil(bounds.height * scale) + border,
    };
    (0, utilities_1.debugMessage)(debug, "Using Viewport", viewport);
    await page.setViewport(viewport);
    return viewport;
}
//# sourceMappingURL=image.js.map