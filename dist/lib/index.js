import { join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { firefox } from "playwright-firefox";
export var Format;
(function (Format) {
    Format["JPEG"] = "jpeg";
    Format["PDF"] = "pdf";
    Format["PNG"] = "png";
    Format["SVG"] = "svg";
})(Format || (Format = {}));
const DEFAULT_BROWSER_TIMEOUT = 30000;
const EXPORT_URL = pathToFileURL(normalize(join(fileURLToPath(import.meta.url), "../export/index.html"))).toString();
const RESULT_INFO_SELECTOR = "#result-info";
const BORDER = 2;
export default class Exporter {
    browser;
    page;
    timeout;
    constructor(browser, page, timeout) {
        this.browser = browser;
        this.page = page;
        this.timeout = timeout;
    }
    static async launch(opt = {}) {
        const options = Object.assign({
            timeout: DEFAULT_BROWSER_TIMEOUT,
            callback: closeBrowser,
        }, opt);
        const browser = await firefox.launch();
        const page = await browser.newPage();
        page.on("console", (message) => console.debug("Browser:", message.text()));
        await page.goto(EXPORT_URL);
        const timeout = setTimeout(() => options.callback(browser), options.timeout);
        return new Exporter(browser, page, timeout);
    }
    async render(input, pageIndex, format) {
        await this.page.evaluate(([input, pageIndex, format]) => {
            debugger;
            // @ts-ignore
            window.graph = render(input, pageIndex, format);
        }, [input, pageIndex, format]);
        const locator = this.page.locator(RESULT_INFO_SELECTOR);
        await locator.waitFor({
            state: "attached",
        });
        const bounds = {
            x: parseInt(await locator.getAttribute("data-bounds-x") ?? "0"),
            y: parseInt(await locator.getAttribute("data-bounds-y") ?? "0"),
            width: parseInt(await locator.getAttribute("data-bounds-width") ?? "0"),
            height: parseInt(await locator.getAttribute("data-bounds-height") ?? "0"),
        };
        const scale = parseInt(await locator.getAttribute("data-scale") ?? "0");
        return { bounds, scale };
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
                return await this.exportJpeg(input, pageIndex);
            case Format.PDF:
                return await this.exportPdf(input, pageIndex);
            case Format.PNG:
                return await this.exportPng(input, pageIndex);
            case Format.SVG:
                return await this.exportSvg(input, pageIndex);
        }
    }
    async exportImage(input, pageIndex = 0, format = Format.PNG) {
        const { bounds, scale } = await this.render(input, pageIndex, format);
        const viewport = {
            width: Math.ceil(bounds.width * scale) + BORDER,
            height: Math.ceil(bounds.height * scale) + BORDER,
        };
        await this.page.setViewportSize(viewport);
        const screenshotOptions = { type: format, ...viewport };
        return await this.page.screenshot(screenshotOptions);
    }
    async exportJpeg(input, pageIndex = 0) {
        return await this.exportImage(input, pageIndex, Format.JPEG);
    }
    async exportPdf(input, pageIndex = 0) {
        await this.render(input, pageIndex, Format.PDF);
        return await this.page.pdf({
            format: "A4",
            printBackground: true,
        });
    }
    async exportPng(input, pageIndex = 0) {
        return await this.exportImage(input, pageIndex, Format.PNG);
    }
    async exportSvg(input, pageIndex = 0, transparency = true) {
        const { scale } = await this.render(input, pageIndex, Format.SVG);
        return await this.page.evaluate(async ([scale, transparency]) => {
            debugger;
            // @ts-ignore
            return await exportSvg(window.graph, window.editorUi, scale, transparency);
        }, [scale, transparency]);
    }
}
function closeBrowser(browser) {
    return async () => {
        console.warn("Closing browser from timeout");
        await browser.close();
    };
}
//# sourceMappingURL=index.js.map