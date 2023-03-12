import {readFile, writeFile} from "fs/promises";
import "console-inject";
import {generateHelp, parseArgs, RECOVERABLE_ERRORS} from "./args";
import {exportDiagram, launchExporter} from "../index";

import type {Spec} from "./args";

// Options are modelled after the Draw.io Desktop CLI; ideally we should be a 1:1 substitute.
const argSpec: Spec = {
	input: {
		long: "--export",
		short: "-x",
		type: String,
		description: "Input filename",
	},
	pageIndex: {
		long: "--page-index",
		short: "-p",
		type: Number,
		description: "Page index (from 0); defaults to 0",
	},
	output: {
		long: "--output",
		short: "-o",
		type: String,
		description: "Output filename",
	},
	format: {
		long: "--format",
		short: "-f",
		type: String,
		description: 'Diagram format; defaults to "pdf"',
	},
};

try {
	const {input, pageIndex, output, format} = parseArgs(argSpec);

	const exporter = launchExporter();
	const file = readFile(input, "utf-8");

	Promise.all([exporter, file])
		.then(([exporter, file]) => exportDiagram(exporter, file, pageIndex, format))
		.then((result) => writeFile(output, result));
} catch (e: any) {
	// @ts-ignore
	if (RECOVERABLE_ERRORS.includes(e.code)) {
		console.error(e.message);
		process.stderr.write(generateHelp(argSpec));
		process.exit(1);
	} else {
		throw e;
	}
}
