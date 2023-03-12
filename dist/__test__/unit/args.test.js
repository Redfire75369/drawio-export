"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const argSpec = {
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
        const values = (0, src_1.parseArgs)(argSpec, { argv });
        expect(values).toStrictEqual({
            foo: "foo",
            bar: 42,
        });
    });
    it("throws on missing args", () => {
        const argv = ["-f", "foo"];
        expect(() => {
            (0, src_1.parseArgs)(argSpec, { argv });
        }).toThrow("Missing required option: --bar");
    });
});
describe("generateHelp", () => {
    it("generates help for all arguments", () => {
        const help = (0, src_1.generateHelp)(argSpec);
        expect(help).toMatch(/-f, --foo <foo \(String\)> +Foo/);
        expect(help).toMatch(/-b, --bar <bar \(Number\)> +Bar/);
    });
});
//# sourceMappingURL=args.test.js.map