"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.launchExporter = void 0;
const path_1 = __importDefault(require("path"));
const playwright_1 = require("playwright");
const defaultBrowserTimeout = 30000;
const exportUrl = `file://${path_1.default.normalize(path_1.default.join(__dirname, "/../export.html"))}`;
const resultInfoSelector = "#result-info";
async function launchExporter(options = {}) {
    if (typeof options.timeout !== "number") {
        options.timeout = defaultBrowserTimeout;
    }
    if (typeof options.callback !== "function") {
        options.callback = closeBrowser;
    }
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
    const page = await browser.newPage();
    page.on("console", (message) => console.debug("Browser:", message.text()));
    await page.goto(exportUrl, {
        waitUntil: "networkidle",
    });
    const timeout = setTimeout(options.callback.bind(null, browser), options.timeout);
    return {
        browser,
        timeout,
        page
    };
}
exports.launchExporter = launchExporter;
async function render(page, input, pageIndex, format) {
    await page.evaluate(([input, pageIndex, format]) => {
        // @ts-ignore
        const { graph, editorUi } = render(input, pageIndex, format);
        // @ts-ignore
        window.graph = graph;
        // @ts-ignore
        window.editorUi = editorUi;
    }, [input, pageIndex, format]);
    const resultInfo = await page.waitForSelector(resultInfoSelector, {
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
exports.render = render;
function closeBrowser(browser) {
    return async () => {
        console.warn("Closing browser from timeout");
        await browser.close();
    };
}
//# sourceMappingURL=browser.js.map