import { type Browser, type Page } from "playwright-firefox";
export declare enum Format {
    JPEG = "jpeg",
    PDF = "pdf",
    PNG = "png",
    SVG = "svg"
}
export interface LaunchOptions {
    timeout?: number;
    callback?: (browser: Browser) => () => Promise<void>;
}
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface RenderResult {
    bounds: Bounds;
    scale: number;
}
export default class Exporter {
    browser: Browser;
    page: Page;
    timeout: ReturnType<typeof setTimeout> | null;
    constructor(browser: Browser, page: Page, timeout: ReturnType<typeof setTimeout> | null);
    static launch(opt?: LaunchOptions): Promise<Exporter>;
    render(input: string, pageIndex: number, format: Format): Promise<RenderResult>;
    close(): Promise<void>;
    exportDiagram(input: string, pageIndex: number, format: Format): Promise<string | Buffer>;
    exportImage(input: string, pageIndex?: number, format?: Format.JPEG | Format.PNG): Promise<Buffer>;
    exportJpeg(input: string, pageIndex?: number): Promise<Buffer>;
    exportPdf(input: string, pageIndex?: number): Promise<Buffer>;
    exportPng(input: string, pageIndex?: number): Promise<Buffer>;
    exportSvg(input: string, pageIndex?: number, transparency?: boolean, foreignObjectFallback?: boolean): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map