export {launchExporter} from "./browser";

import exportImage from "./export/image";
import exportPdf from "./export/pdf";
import exportSvg from "./export/svg";

import type {Exporter} from "./browser";

export enum Format {
	JPEG = "jpeg",
	PDF = "pdf",
	PNG = "png",
	SVG = "svg",
}

export async function exportDiagram(exporter: Exporter, input: string, pageIndex: number, format: Format): Promise<string | Buffer> {
	switch (format) {
		case Format.JPEG:
			return await exportImage(exporter, input, pageIndex, Format.JPEG);
		case Format.PDF:
			return await exportPdf(exporter, input, pageIndex);
		case Format.PNG:
			return await exportImage(exporter, input, pageIndex, Format.PNG);
		case Format.SVG:
			return await exportSvg(exporter, input, pageIndex);
	}
}

export {
	exportImage,
	exportSvg,
	exportPdf,
	type Exporter,
}
