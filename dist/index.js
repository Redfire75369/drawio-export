"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
const path_1 = require("path");
const playwright_1 = require("playwright");
var Format;
(function (Format) {
    Format["JPEG"] = "jpeg";
    Format["PDF"] = "pdf";
    Format["PNG"] = "png";
    Format["SVG"] = "svg";
})(Format = exports.Format || (exports.Format = {}));
const DEFAULT_BROWSER_TIMEOUT = 30000;
const EXPORT_URL = `file://${(0, path_1.normalize)((0, path_1.join)(__dirname, "./export/index.html"))}`;
const RESULT_INFO_SELECTOR = "#result-info";
const BORDER = 2;
class Exporter {
    browser;
    timeout;
    page = null;
    constructor(browser, timeout) {
        this.browser = browser;
        this.timeout = timeout;
    }
    static async launch(opt = {}) {
        const options = Object.assign({
            timeout: DEFAULT_BROWSER_TIMEOUT,
            callback: closeBrowser,
        }, opt);
        const browser = await playwright_1.chromium.launch({
            headless: false,
            args: [
                "--disable-gpu",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--hide-scrollbars",
            ],
        });
        const exporter = new Exporter(browser, null);
        await exporter.init();
        exporter.timeout = setTimeout(() => options.callback(browser), options.timeout);
        return exporter;
    }
    async render(input, pageIndex, format) {
        if (!this.page) {
            throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
        }
        await this.page.evaluate(([input, pageIndex, format]) => {
            // @ts-ignore
            const { graph, editorUi } = render(input, pageIndex, format);
            // @ts-ignore
            window.graph = graph;
            // @ts-ignore
            window.editorUi = editorUi;
        }, [input, pageIndex, format]);
        const resultInfo = await this.page.waitForSelector(RESULT_INFO_SELECTOR, {
            state: "attached",
        });
        const { bounds, scale } = await resultInfo.evaluate((el) => {
            return {
                bounds: {
                    x: parseInt(el.getAttribute("data-bounds-x") ?? "0"),
                    y: parseInt(el.getAttribute("data-bounds-y") ?? "0"),
                    width: parseInt(el.getAttribute("data-bounds-width") ?? "0"),
                    height: parseInt(el.getAttribute("data-bounds-height") ?? "0"),
                },
                scale: parseInt(el.getAttribute("data-scale") ?? "0"),
            };
        });
        return { bounds, scale };
    }
    async init() {
        this.page = await this.browser.newPage();
        this.page.on("console", (message) => console.debug("Browser:", message.text()));
        await this.page.goto(EXPORT_URL, {
            waitUntil: "networkidle",
        });
    }
    async close() {
        await this.browser.close();
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    async exportDiagram(input, pageIndex, format) {
        switch (format) {
            case Format.JPEG:
                return await this.exportImage(input, pageIndex, Format.JPEG);
            case Format.PDF:
                return await this.exportPdf(input, pageIndex);
            case Format.PNG:
                return await this.exportImage(input, pageIndex, Format.PNG);
            case Format.SVG:
                return await this.exportSvg(input, pageIndex);
        }
    }
    async exportImage(input, pageIndex = 0, format = Format.PNG) {
        if (!this.page) {
            throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
        }
        const { bounds, scale } = await this.render(input, pageIndex, format);
        const viewport = {
            width: Math.ceil(bounds.width * scale) + BORDER,
            height: Math.ceil(bounds.height * scale) + BORDER,
        };
        await this.page.setViewportSize(viewport);
        const screenshotOptions = { type: format, ...viewport };
        return await this.page.screenshot(screenshotOptions);
    }
    async exportPdf(input, pageIndex = 0) {
        if (!this.page) {
            throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
        }
        await this.render(input, pageIndex, Format.PDF);
        return await this.page.pdf({
            format: "A4",
            printBackground: true,
        });
    }
    async exportSvg(input, pageIndex = 0, transparency = true) {
        if (!this.page) {
            throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
        }
        const { scale } = await this.render(input, pageIndex, Format.SVG);
        return await this.page.evaluate(async ([scale, transparency]) => {
            debugger;
            // @ts-ignore
            return await exportSvg(window.graph, window.editorUi, scale, transparency);
        }, [scale, transparency]);
    }
}
exports.default = Exporter;
function closeBrowser(browser) {
    return async () => {
        console.warn("Closing browser from timeout");
        await browser.close();
    };
}
//# sourceMappingURL=index.js.map