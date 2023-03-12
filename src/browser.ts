import path from "path";
import puppeteer from "puppeteer";
import {debugMessage} from "./utilities";

import type {Browser, Page} from "puppeteer";

export interface LaunchOptions {
	timeout?: number,
	callback?: (browser: Browser) => () => Promise<void>,
	debug?: boolean,
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
	if (typeof options.debug !== "boolean") {
		options.debug = false;
	}

	debugMessage(options.debug, "Launching Browser via Puppeteer");

	const browser = await puppeteer.launch({
		headless: true,
		args: [
			"--disable-gpu",
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--hide-scrollbars",
		],
	});

	debugMessage(options.debug, "Preparing a New Page");
	const page = await browser.newPage();
	page.on("console", (message) => console.debug("Browser:", message.text()));

	debugMessage(options.debug, "Navigating to the Exporter");
	await page.goto(exportUrl, {
		waitUntil: "networkidle0",
	});

	debugMessage(options.debug, `Setting Up Browser Timeout in ${options.timeout} ms`);
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

export async function render(page: Page, debug: boolean = false, ...args: any[]): Promise<{bounds: Bounds, scale: number}> {
	debugMessage(debug, "Rendering Diagram");
	await page.evaluate((args) => {
		// @ts-ignore
		window.graph = render(...args);
	}, args);

	debugMessage(debug, "Awaiting Render Result Information");
	const resultInfo = await page.waitForSelector(resultInfoSelector);

	// @ts-ignore
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
	debugMessage(debug, `Result Info (Bounds: ${bounds}, Scale: ${scale}`);

	return {bounds, scale};
}

function closeBrowser(browser: Browser) {
	return async () => {
		console.warn("Closing browser from timeout");
		await browser.close();
	};
}
