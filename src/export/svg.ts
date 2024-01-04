import {render} from "../browser";

import type {Exporter} from "../browser";
import {Format} from "../index";


export default async function exportSvg(exporter: Exporter, input: string, pageIndex: number, transparency: boolean = true): Promise<string> {
	const {scale} = await render(exporter.page, input, pageIndex, Format.SVG);

	const svg: string = await exporter.page.evaluate(
		async ([scale, transparency]) => {
			debugger;
			// @ts-ignore
			return await exportSvg(window.graph, window.editorUi, scale, transparency);
		},
		[scale, transparency] as [number, boolean]
	);

	await exporter.browser.close();
	clearTimeout(exporter.timeout);

	return svg;
}
