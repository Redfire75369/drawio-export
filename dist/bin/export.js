"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
require("console-inject");
const args_1 = require("./args");
const index_1 = require("../index");
// Options are modelled after the Draw.io Desktop CLI; ideally we should be a 1:1 substitute.
const argSpec = {
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
    const { input, pageIndex, output, format } = (0, args_1.parseArgs)(argSpec);
    const exporter = (0, index_1.launchExporter)();
    const file = (0, promises_1.readFile)(input, "utf-8");
    Promise.all([exporter, file])
        .then(([exporter, file]) => (0, index_1.exportDiagram)(exporter, file, pageIndex, format))
        .then((result) => (0, promises_1.writeFile)(output, result));
}
catch (e) {
    // @ts-ignore
    if (args_1.RECOVERABLE_ERRORS.includes(e.code)) {
        console.error(e.message);
        process.stderr.write((0, args_1.generateHelp)(argSpec));
        process.exit(1);
    }
    else {
        throw e;
    }
}
//# sourceMappingURL=export.js.map