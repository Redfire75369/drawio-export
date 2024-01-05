import {join, normalize} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import {type Browser, firefox, type Page} from "playwright-firefox";

export enum Format {
	JPEG = "jpeg",
	PDF = "pdf",
	PNG = "png",
	SVG = "svg",
}

export interface LaunchOptions {
	timeout?: number,
	callback?: (browser: Browser) => () => Promise<void>,
}

export interface Bounds {
	x: number,
	y: number,
	width: number,
	height: number,
}

export interface RenderResult {
	bounds: Bounds,
	scale: number
}

const DEFAULT_BROWSER_TIMEOUT = 30000;
const EXPORT_URL = pathToFileURL(normalize(join(fileURLToPath(import.meta.url), "../export/index.html"))).toString();
const RESULT_INFO_SELECTOR = "#result-info";
const BORDER = 2;

export default class Exporter {
	constructor(public browser: Browser, public page: Page, public timeout: ReturnType<typeof setTimeout> | null) {
	}

	static async launch(opt: LaunchOptions = {}) {
		const options = Object.assign({
			timeout: DEFAULT_BROWSER_TIMEOUT,
			callback: closeBrowser,
		}, opt);

		const browser = await firefox.launch();

		const page = await browser.newPage();
		page.on("console", (message) => console.debug("Browser:", message.text()));

		await page.goto(EXPORT_URL);

		const timeout = setTimeout(
			() => options.callback(browser),
			options.timeout
		);

		return new Exporter(browser, page, timeout);
	}

	public async render(input: string, pageIndex: number, format: Format): Promise<RenderResult> {
		await this.page.evaluate(
			([input, pageIndex, format]) => {
				debugger;
				// @ts-ignore
				window.graph = render(input, pageIndex, format);
			},
			[input, pageIndex, format] as [string, number, Format]
		);

		const locator = this.page.locator(RESULT_INFO_SELECTOR);
		await locator.waitFor({
			state: "attached",
		});

		const bounds: Bounds = {
			x: parseInt(await locator.getAttribute("data-bounds-x") ?? "0"),
			y: parseInt(await locator.getAttribute("data-bounds-y") ?? "0"),
			width: parseInt(await locator.getAttribute("data-bounds-width") ?? "0"),
			height: parseInt(await locator.getAttribute("data-bounds-height") ?? "0"),
		};
		const scale = parseInt(await locator.getAttribute("data-scale") ?? "0");

		return {bounds, scale};
	}

	public async close() {
		await this.browser.close();
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}

	public async exportDiagram(input: string, pageIndex: number, format: Format): Promise<string | Buffer> {
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

	public async exportImage(input: string, pageIndex: number = 0, format: Format.JPEG | Format.PNG = Format.PNG): Promise<Buffer> {
		const {bounds, scale} = await this.render(input, pageIndex, format);

		const viewport = {
			width: Math.ceil(bounds.width * scale) + BORDER,
			height: Math.ceil(bounds.height * scale) + BORDER,
		};
		await this.page.setViewportSize(viewport);

		const screenshotOptions = {type: format, ...viewport};
		return await this.page.screenshot(screenshotOptions);
	}

	public async exportJpeg(input: string, pageIndex: number = 0): Promise<Buffer> {
		return await this.exportImage(input, pageIndex, Format.JPEG);
	}

	public async exportPdf(input: string, pageIndex: number = 0): Promise<Buffer> {
		await this.render(input, pageIndex, Format.PDF);

		return await this.page.pdf({
			format: "A4",
			printBackground: true,
		});
	}

	public async exportPng(input: string, pageIndex: number = 0): Promise<Buffer> {
		return await this.exportImage(input, pageIndex, Format.PNG);
	}

	public async exportSvg(input: string, pageIndex: number = 0, transparency: boolean = true): Promise<string> {
		const {scale} = await this.render(input, pageIndex, Format.SVG);

		return await this.page.evaluate(
			async ([scale, transparency]) => {
				debugger;
				// @ts-ignore
				return await exportSvg(window.graph, window.editorUi, scale, transparency);
			},
			[scale, transparency] as [number, boolean]
		);
	}
}

function closeBrowser(browser: Browser) {
	return async () => {
		console.warn("Closing browser from timeout");
		await browser.close();
	};
}
