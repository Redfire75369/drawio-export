import {readFile} from "fs/promises";
import {normalize, join} from "path";
import playwright from "playwright";
import {read, MIME_PNG} from "jimp"
import {Format} from "../../src";

import type {Browser, Page} from "playwright";

describe("export", () => {
	const exportUrl = `file://${normalize(join(__dirname, "/../../export.html"))}`;
	const fixtures = normalize(join(__dirname, "../fixtures"));

	let browser: Browser;
	let page: Page;

	jest.setTimeout(60000);

	beforeAll(async () => {
		browser = await playwright.chromium.launch();
	});
	afterAll(async () => await browser.close());

	beforeEach(async () => {
		page = await browser.newPage();

		await page.goto(exportUrl, {
			waitUntil: "networkidle",
		});
	});
	afterEach(async () => await page.close());

	async function render(inputFileName: string, pageIndex: number, format: Format) {
		const input = await readFile(join(fixtures, inputFileName), "utf-8");

		await page.evaluate(
			([input, pageIndex, format]) => {
				// @ts-ignore
				const {graph, editorUi} = render(input, pageIndex, format);
				// @ts-ignore
				window.graph = graph;
				// @ts-ignore
				window.editorUi = editorUi;
			},
			[input, pageIndex, format] as [string, number, Format]
		);
	}

	it("exports the first page of the flowchart fixture to JPEG", async () => {
		expect.assertions(1);

		await render("flowchart.drawio", 0, Format.JPEG);
		const screenshot = await page.screenshot();
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
			return exportSvg(window.graph, window.editorUi, 1);
		});

		expect(svg).toMatchSnapshot();
	});
});
