import arg from "arg";
import type {Handler, Options, Result, Spec as ArgSpec} from "arg";

export const RECOVERABLE_ERRORS = ["ARG_UNKNOWN_OPTION", "ARG_MISSING_REQUIRED"];

export interface Spec {
	[key: string]: {
		long: string,
		short: string,
		type: Handler,
		description: string,
	}
}

export function parseArgs(argSpec: Spec, options?: Options): {[key: string]: any} {
	const args: ArgSpec = {};
	Object.values(argSpec).forEach((arg) => {
		args[arg.long] = arg.type;
		args[arg.short] = arg.long;
	});

	const values = arg(args, options);

	const result: {[name: string]: Result<typeof args>} = {};
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

export function generateHelp(argSpec: Spec) {
	const lines = ["exporter [options]", "", "Options:"];

	for (const [name, arg] of Object.entries(argSpec)) {
		lines.push(`  ${arg.short}, ${arg.long} <${name} (${arg.type.name})>    ${arg.description}`);
	}

	return lines.join("\n");
}
