import {render} from "../browser";
import {Format} from "../index";

import type {Page} from "playwright";
import type {Bounds, Exporter} from "../browser";

const border = 2;

export default async function exportImage(exporter: Exporter, input: string, pageIndex: number, format: Format.JPEG | Format.PNG = Format.PNG): Promise<Buffer> {
	const {bounds, scale} = await render(exporter.page, input, pageIndex, format);
	const viewport = await setScaledViewport(exporter.page, bounds, scale);

	const screenshotOptions = {type: format, ...viewport};
	const data = await exporter.page.screenshot(screenshotOptions);

	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return data;
}

async function setScaledViewport(page: Page, bounds: Bounds, scale: number) {
	const viewport = {
		width: Math.ceil(bounds.width * scale) + border,
		height: Math.ceil(bounds.height * scale) + border,
	};

	await page.setViewportSize(viewport);

	return viewport;
}
