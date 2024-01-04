import {join, normalize} from "path";
import {type Browser, chromium, type Page} from "playwright";

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
const EXPORT_URL = `file://${normalize(join(__dirname, "./export/index.html"))}`;
const RESULT_INFO_SELECTOR = "#result-info";
const BORDER = 2;

export default class Exporter {
	public page: Page | null = null;

	constructor(public browser: Browser, public timeout: ReturnType<typeof setTimeout> | null) {
	}

	static async launch(opt: LaunchOptions = {}) {
		const options = Object.assign({
			timeout: DEFAULT_BROWSER_TIMEOUT,
			callback: closeBrowser,
		}, opt);

		const browser = await chromium.launch({
			headless: true,
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

		exporter.timeout = setTimeout(
			() => options.callback(browser),
			options.timeout
		);

		return exporter;
	}

	public async render(input: string, pageIndex: number, format: Format): Promise<RenderResult> {
		if (!this.page) {
			throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
		}

		await this.page.evaluate(
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

		const resultInfo = await this.page.waitForSelector(RESULT_INFO_SELECTOR, {
			state: "attached",
		});

		const {bounds, scale} = await resultInfo.evaluate((el) => {
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
		return {bounds, scale};
	}

	public async init() {
		this.page = await this.browser.newPage();
		this.page.on("console", (message) => console.debug("Browser:", message.text()));

		await this.page.goto(EXPORT_URL, {
			waitUntil: "networkidle",
		});
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
				return await this.exportImage(input, pageIndex, Format.JPEG);
			case Format.PDF:
				return await this.exportPdf(input, pageIndex);
			case Format.PNG:
				return await this.exportImage(input, pageIndex, Format.PNG);
			case Format.SVG:
				return await this.exportSvg(input, pageIndex);
		}
	}

	public async exportImage(input: string, pageIndex: number = 0, format: Format.JPEG | Format.PNG = Format.PNG): Promise<Buffer> {
		if (!this.page) {
			throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
		}

		const {bounds, scale} = await this.render(input, pageIndex, format);

		const viewport = {
			width: Math.ceil(bounds.width * scale) + BORDER,
			height: Math.ceil(bounds.height * scale) + BORDER,
		};
		await this.page.setViewportSize(viewport);

		const screenshotOptions = {type: format, ...viewport};
		return await this.page.screenshot(screenshotOptions);
	}

	public async exportPdf(input: string, pageIndex: number = 0): Promise<Buffer> {
		if (!this.page) {
			throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
		}

		await this.render(input, pageIndex, Format.PDF);

		return await this.page.pdf({
			format: "A4",
			printBackground: true,
		});
	}

	public async exportSvg(input: string, pageIndex: number = 0, transparency: boolean = true): Promise<string> {
		if (!this.page) {
			throw new Error("Browser Page has not been initialised yet. Call Exporter.init()");
		}

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
