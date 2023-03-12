export * from "./bin/args";
export {launchExporter} from "./browser";

import exportJpeg from "./export/jpeg";
import exportPdf from "./export/pdf";
import exportPng from "./export/png";
import exportSvg from "./export/svg";

import type {Exporter} from "./browser";

export enum Format {
	JPEG = "jpeg",
	PDF = "pdf",
	PNG = "png",
	SVG = "svg",
}

export async function exportDiagram(exporter: Exporter, input: string, pageIndex: number, format: Format, debug: boolean = false) {
	switch (format) {
		case Format.JPEG:
			return await exportJpeg(exporter, input, pageIndex, debug);
		case Format.PDF:
			return await exportPdf(exporter, input, pageIndex, debug);
		case Format.PNG:
			return await exportPng(exporter, input, pageIndex, debug);
		case Format.SVG:
			return await exportSvg(exporter, input, pageIndex, debug);
	}
}
