"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = require("path");
const puppeteer_1 = __importDefault(require("puppeteer"));
const jimp_1 = require("jimp");
const src_1 = require("../../src");
describe("export", () => {
    const exportUrl = `file://${(0, path_1.normalize)((0, path_1.join)(__dirname, "/../../export.html"))}`;
    const fixtures = (0, path_1.normalize)((0, path_1.join)(__dirname, "../fixtures"));
    let browser;
    let page;
    beforeAll(async () => {
        jest.setTimeout(30000);
        browser = await puppeteer_1.default.launch();
    });
    afterAll(async () => await browser.close());
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(exportUrl, {
            waitUntil: "networkidle0",
        });
    });
    afterEach(async () => await page.close());
    async function render(inputFileName, pageIndex, format) {
        const input = await (0, promises_1.readFile)((0, path_1.join)(fixtures, inputFileName));
        await page.evaluate((args) => {
            // The drawio Graph object returned by render() isn't serialisable, so
            // we can't easily transfer it across the browser-Puppeteer boundary for
            // later operations. Store it in the browser's global scope for later.
            // @ts-ignore
            window.testGraph = render(...args);
        }, [input.toString(), pageIndex, format]);
    }
    it("exports the first page of the flowchart fixture to JPEG", async () => {
        expect.assertions(1);
        await render("flowchart.drawio", 0, src_1.Format.JPEG);
        const screenshot = Buffer.from(await page.screenshot());
        const converter = await (0, jimp_1.read)(screenshot);
        const converted = await converter.getBufferAsync(jimp_1.MIME_PNG);
        expect(converted).toMatchImageSnapshot();
    });
    it("exports the first page of the flowchart fixture to PNG", async () => {
        expect.assertions(1);
        await render("flowchart.drawio", 0, src_1.Format.PNG);
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
    it("exports the second page of the flowchart fixture to PNG", async () => {
        expect.assertions(1);
        await render("flowchart.drawio", 1, src_1.Format.PNG);
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
    it("exports the first page of the flowchart fixture to SVG", async () => {
        expect.assertions(1);
        await render("flowchart.drawio", 0, src_1.Format.SVG);
        const svg = await page.evaluate(() => {
            // @ts-ignore
            return exportSvg(window.testGraph, 1);
        });
        expect(svg).toMatchSnapshot();
    });
});
//# sourceMappingURL=export.test.js.map