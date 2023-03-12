import {render} from "../browser";
import {debugMessage} from "../utilities";

import type {Exporter} from "../browser";
import {Format} from "../index";


export default async function exportSvg(exporter: Exporter, input: string, pageIndex: number, debug: boolean = false): Promise<string> {
	const {scale} = await render(exporter.page, debug, input, pageIndex, Format.SVG);

	const svg: string = await exporter.page.evaluate(
		(args) => {
			// @ts-ignore
			return exportSvg(window.graph, ...args);
		},
		[scale]
	);

	debugMessage(debug, "Closing Browser");
	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return svg;
}
