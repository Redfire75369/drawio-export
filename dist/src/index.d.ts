/// <reference types="node" />
export * from "./bin/args";
export { launchExporter } from "./browser";
import type { Exporter } from "./browser";
export declare enum Format {
    JPEG = "jpeg",
    PDF = "pdf",
    PNG = "png",
    SVG = "svg"
}
export declare function exportDiagram(exporter: Exporter, input: string, pageIndex: number, format: Format, debug?: boolean): Promise<string | Buffer>;
//# sourceMappingURL=index.d.ts.map