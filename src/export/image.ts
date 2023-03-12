import {render} from "../browser";
import {Format} from "../index";
import {debugMessage} from "../utilities";

import type {Page} from "puppeteer";
import type {Bounds, Exporter} from "../browser";

const border = 2;

export default async function exportImage(exporter: Exporter, input: string, pageIndex: number, format: Format.JPEG | Format.PNG = Format.PNG, debug: boolean = false) {
	const {bounds, scale} = await render(exporter.page, debug, input, pageIndex, format);
	const viewport = await setScaledViewport(exporter.page, bounds, scale, debug);

	const screenshotOptions = {type: format, ...viewport};
	debugMessage(debug, "Screenshotting the Result with Options:", screenshotOptions);
	const data = await exporter.page.screenshot(screenshotOptions);

	debugMessage(debug, "Closing Browser");
	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return data;
}

async function setScaledViewport(page: Page, bounds: Bounds, scale: number, debug: boolean = false) {
	const viewport = {
		width: Math.ceil(bounds.width * scale) + border,
		height: Math.ceil(bounds.height * scale) + border,
	};

	debugMessage(debug, "Using Viewport", viewport);
	await page.setViewport(viewport);

	return viewport;
}
