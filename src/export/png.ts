import exportImage from "./image";
import {Format} from "../index";

import type {Exporter} from "../browser";

export default async function exportPng(exporter: Exporter, input: string, pageIndex: number, debug: boolean = false) {
	return await exportImage(exporter, input, pageIndex, Format.PNG, debug)
}
