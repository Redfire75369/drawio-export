"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.launchExporter = void 0;
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const utilities_1 = require("./utilities");
const defaultBrowserTimeout = 30000;
const exportUrl = `file://${path_1.default.normalize(path_1.default.join(__dirname, "/../export.html"))}`;
const resultInfoSelector = "#result-info";
async function launchExporter(options = {}) {
    if (typeof options.timeout !== "number") {
        options.timeout = defaultBrowserTimeout;
    }
    if (typeof options.callback !== "object") {
        options.callback = closeBrowser;
    }
    if (typeof options.debug !== "boolean") {
        options.debug = false;
    }
    (0, utilities_1.debugMessage)(options.debug, "Launching Browser via Puppeteer");
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: [
            "--disable-gpu",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--hide-scrollbars",
        ],
    });
    (0, utilities_1.debugMessage)(options.debug, "Preparing a new page");
    const page = await browser.newPage();
    page.on("console", (message) => console.debug("Browser:", message.text()));
    (0, utilities_1.debugMessage)(options.debug, "Navigating to the exporter");
    await page.goto(exportUrl, {
        waitUntil: "networkidle0",
    });
    (0, utilities_1.debugMessage)(options.debug, `Setting up browser timeout in ${options.timeout} microseconds`);
    const timeout = setTimeout(options.callback.bind(null, browser), options.timeout);
    return {
        browser,
        timeout,
        page
    };
}
exports.launchExporter = launchExporter;
async function render(page, debug = false, ...args) {
    (0, utilities_1.debugMessage)(debug, "Rendering diagram");
    await page.evaluate((args) => {
        // @ts-ignore
        window.graph = render(...args);
    }, args);
    (0, utilities_1.debugMessage)(debug, "Awaiting render result information");
    const resultInfo = await page.waitForSelector(resultInfoSelector);
    // @ts-ignore
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
    (0, utilities_1.debugMessage)(debug, `Result Info (Bounds: ${bounds}, Scale: ${scale}`);
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