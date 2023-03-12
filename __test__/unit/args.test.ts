import {generateHelp, parseArgs} from "../../src";

import type {Spec} from "../../src";

const argSpec: Spec = {
	foo: {
		long: "--foo",
		short: "-f",
		type: String,
		description: "Foo",
	},
	bar: {
		long: "--bar",
		short: "-b",
		type: Number,
		description: "Bar",
	},
};

describe("parseArgs", () => {
	it("returns argument values when all are present", () => {
		const argv = ["-f", "foo", "--bar", "42"];
		const values = parseArgs(argSpec, {argv});

		expect(values).toStrictEqual({
			foo: "foo",
			bar: 42,
		});
	});

	it("throws on missing args", () => {
		const argv = ["-f", "foo"];

		expect(() => {
			parseArgs(argSpec, {argv});
		}).toThrow("Missing required option: --bar");
	});
});

describe("generateHelp", () => {
	it("generates help for all arguments", () => {
		const help = generateHelp(argSpec);

		expect(help).toMatch(/-f, --foo <foo \(String\)> +Foo/);
		expect(help).toMatch(/-b, --bar <bar \(Number\)> +Bar/);
	});
});
