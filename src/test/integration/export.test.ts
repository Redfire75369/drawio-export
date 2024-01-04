import {configureToMatchImageSnapshot} from "jest-image-snapshot";
import {MIME_PNG, read} from "jimp"
import {readFile} from "node:fs/promises";
import {join, normalize} from "node:path";
import {fileURLToPath} from "node:url";
import {vi} from "vitest";
import Exporter, {Format} from "../../index";

const toMatchImageSnapshot = configureToMatchImageSnapshot({
	failureThresholdType: "percent",
	failureThreshold: 0.005,
});
expect.extend({toMatchImageSnapshot});

describe("export", () => {
	const fixtures = normalize(join(fileURLToPath(import.meta.url), "../../fixtures"));

	let input: string;
	let exporter: Exporter;

	vi.setConfig({testTimeout: 30000});

	beforeAll(async () => {
		input = await readFile(join(fixtures, "flowchart.drawio"), "utf-8");
		exporter = await Exporter.launch();
	});
	afterAll(async () => await exporter.close());

	it("exports the first page of the flowchart fixture to JPEG", async () => {
		expect.assertions(1);

		const image = await exporter.exportImage(input, 0, Format.JPEG);
		const converter = await read(image);
		const converted = await converter.getBufferAsync(MIME_PNG);

		expect(converted).toMatchImageSnapshot();
	});

	it("exports the first page of the flowchart fixture to PNG", async () => {
		expect.assertions(1);

		const image = await exporter.exportImage(input, 0, Format.PNG);
		expect(image).toMatchImageSnapshot();
	});

	it("exports the second page of the flowchart fixture to PNG", async () => {
		expect.assertions(1);

		const image = await exporter.exportImage(input, 1, Format.PNG);
		expect(image).toMatchImageSnapshot();
	});

	it("exports the first page of the flowchart fixture to SVG", async () => {
		expect.assertions(1);

		const svg = await exporter.exportSvg(input, 0);

		expect(svg).toMatchSnapshot();
	});
});
