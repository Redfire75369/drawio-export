import {render} from "../browser";
import {Format} from "../index";

import type {Exporter} from "../browser";

export default async function exportPdf(exporter: Exporter, input: string, pageIndex: number) {
	await render(exporter.page, input, pageIndex, Format.PDF);

	const pdf = await exporter.page.pdf({
		format: "A4",
		printBackground: true,
	});

	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return pdf;
}
