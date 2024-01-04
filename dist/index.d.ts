/// <reference types="node" />
export { launchExporter } from "./browser";
import exportImage from "./export/image";
import exportPdf from "./export/pdf";
import exportSvg from "./export/svg";
import type { Exporter } from "./browser";
export declare enum Format {
    JPEG = "jpeg",
    PDF = "pdf",
    PNG = "png",
    SVG = "svg"
}
export declare function exportDiagram(exporter: Exporter, input: string, pageIndex: number, format: Format): Promise<string | Buffer>;
export { exportImage, exportSvg, exportPdf, type Exporter, };
//# sourceMappingURL=index.d.ts.map