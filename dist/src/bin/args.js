"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHelp = exports.parseArgs = exports.RECOVERABLE_ERRORS = void 0;
const arg_1 = __importDefault(require("arg"));
exports.RECOVERABLE_ERRORS = ["ARG_UNKNOWN_OPTION", "ARG_MISSING_REQUIRED"];
function parseArgs(argSpec, options) {
    const args = {};
    Object.values(argSpec).forEach((arg) => {
        args[arg.long] = arg.type;
        args[arg.short] = arg.long;
    });
    const values = (0, arg_1.default)(args, options);
    const result = {};
    for (const [name, arg] of Object.entries(argSpec)) {
        if (!(arg.long in values)) {
            const e = new Error(`Missing required option: ${arg.long}`);
            // @ts-ignore
            e.code = "ARG_MISSING_REQUIRED";
            throw e;
        }
        // @ts-ignore
        result[name] = values[arg.long];
    }
    return result;
}
exports.parseArgs = parseArgs;
function generateHelp(argSpec) {
    const lines = ["exporter [options]", "", "Options:"];
    for (const [name, arg] of Object.entries(argSpec)) {
        lines.push(`  ${arg.short}, ${arg.long} <${name} (${arg.type.name})>    ${arg.description}`);
    }
    return lines.join("\n");
}
exports.generateHelp = generateHelp;
//# sourceMappingURL=args.js.map