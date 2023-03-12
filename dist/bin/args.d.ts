import type { Handler, Options } from "arg";
export declare const RECOVERABLE_ERRORS: string[];
export interface Spec {
    [key: string]: {
        long: string;
        short: string;
        type: Handler;
        description: string;
    };
}
export declare function parseArgs(argSpec: Spec, options?: Options): {
    [key: string]: any;
};
export declare function generateHelp(argSpec: Spec): string;
//# sourceMappingURL=args.d.ts.map