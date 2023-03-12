import {readFile} from "fs/promises";
import {normalize, join} from "path";
import puppeteer from "puppeteer";
import {read, MIME_PNG} from "jimp"
import {Format} from "../../src";

import type {Browser, Page} from "puppeteer";

describe("export", () => {
	const exportUrl = `file://${normalize(join(__dirname, "/../../export.html"))}`;
	const fixtures = normalize(join(__dirname, "../fixtures"));

	let browser: Browser;
	let page: Page;

	jest.setTimeout(30000);

	beforeAll(async () => {
		browser = await puppeteer.launch();
	});
	afterAll(async () => await browser.close());

	beforeEach(async () => {
		page = await browser.newPage();

		await page.goto(exportUrl, {
			waitUntil: "networkidle0",
		});
	});
	afterEach(async () => await page.close());

	async function render(inputFileName: string, pageIndex: number, format: Format) {
		const input = await readFile(join(fixtures, inputFileName));

		await page.evaluate(
			(args) => {
				// The drawio Graph object returned by render() isn't serialisable, so
				// we can't easily transfer it across the browser-Puppeteer boundary for
				// later operations. Store it in the browser's global scope for later.
				// @ts-ignore
				window.testGraph = render(...args);
			},
			[input.toString(), pageIndex, format]
		);
	}

	it("exports the first page of the flowchart fixture to JPEG", async () => {
		expect.assertions(1);

		await render("flowchart.drawio", 0, Format.JPEG);
		const screenshot = Buffer.from(await page.screenshot());
		const converter = await read(screenshot);
		const converted = await converter.getBufferAsync(MIME_PNG);

		expect(converted).toMatchImageSnapshot();
	});

	it("exports the first page of the flowchart fixture to PNG", async () => {
		expect.assertions(1);

		await render("flowchart.drawio", 0, Format.PNG);

		expect(await page.screenshot()).toMatchImageSnapshot();
	});

	it("exports the second page of the flowchart fixture to PNG", async () => {
		expect.assertions(1);

		await render("flowchart.drawio", 1, Format.PNG);

		expect(await page.screenshot()).toMatchImageSnapshot();
	});

	it("exports the first page of the flowchart fixture to SVG", async () => {
		expect.assertions(1);

		await render("flowchart.drawio", 0, Format.SVG);
		const svg = await page.evaluate(() => {
			// @ts-ignore
			return exportSvg(window.testGraph, 1);
		});

		expect(svg).toMatchSnapshot();
	});
});
