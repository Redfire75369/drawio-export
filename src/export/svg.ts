import {render} from "../browser";
import {debugMessage} from "../utilities";

import type {Exporter} from "../browser";
import {Format} from "../index";


export default async function exportSvg(exporter: Exporter, input: string, pageIndex: number, transparency: boolean = true, debug: boolean = false): Promise<string> {
	const {scale} = await render(exporter.page, debug, input, pageIndex, Format.SVG);

	const svg: string = await exporter.page.evaluate(
		async (args) => {
			debugger;
			// @ts-ignore
			return await exportSvg(window.graph, window.editorUi, ...args);
		},
		[scale, transparency]
	);

	debugMessage(debug, "Closing Browser");
	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return svg;
}
