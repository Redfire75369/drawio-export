import {render} from "../browser";
import {Format} from "../index";
import {debugMessage} from "../utilities";

import type {Exporter} from "../browser";

export default async function exportPdf(exporter: Exporter, input: string, pageIndex: number, debug: boolean = false) {
	await render(exporter.page, debug, input, pageIndex, Format.PDF);

	const pdf = await exporter.page.pdf({
		format: "A4",
		printBackground: true,
	});

	debugMessage(debug, "Closing Browser");
	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return pdf;
}
