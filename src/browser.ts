import path from "path";
import {chromium} from "playwright";

import type {Browser, Page} from "playwright";
import type {Format} from "./index";

export interface LaunchOptions {
	timeout?: number,
	callback?: (browser: Browser) => () => Promise<void>,
}

export interface Exporter {
	browser: Browser,
	timeout: ReturnType<typeof setTimeout>,
	page: Page,
}

export interface Bounds {
	x: number,
	y: number
	width: number,
	height: number
}

const defaultBrowserTimeout = 30000;
const exportUrl = `file://${path.normalize(path.join(__dirname, "/../export.html"))}`;
const resultInfoSelector = "#result-info";

export async function launchExporter(options: LaunchOptions = {}): Promise<Exporter> {
	if (typeof options.timeout !== "number") {
		options.timeout = defaultBrowserTimeout;
	}
	if (typeof options.callback !== "function") {
		options.callback = closeBrowser;
	}

	const browser = await chromium.launch({
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

	const timeout = setTimeout(
		options.callback.bind(null, browser),
		options.timeout
	);

	return {
		browser,
		timeout,
		page
	};
}

export async function render(page: Page, input: string, pageIndex: number, format: Format): Promise<{bounds: Bounds, scale: number}> {
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

	const resultInfo = await page.waitForSelector(resultInfoSelector, {
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

function closeBrowser(browser: Browser) {
	return async () => {
		console.warn("Closing browser from timeout");
		await browser.close();
	};
}
