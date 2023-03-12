/// <reference types="node" />
import { Format } from "../index";
import type { Exporter } from "../browser";
export default function exportImage(exporter: Exporter, input: string, pageIndex: number, format?: Format.JPEG | Format.PNG, debug?: boolean): Promise<string | Buffer>;
//# sourceMappingURL=image.d.ts.map