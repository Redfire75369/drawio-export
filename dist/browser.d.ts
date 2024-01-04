import type { Browser, Page } from "playwright";
import type { Format } from "./index";
export interface LaunchOptions {
    timeout?: number;
    callback?: (browser: Browser) => () => Promise<void>;
}
export interface Exporter {
    browser: Browser;
    timeout: ReturnType<typeof setTimeout>;
    page: Page;
}
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare function launchExporter(options?: LaunchOptions): Promise<Exporter>;
export declare function render(page: Page, input: string, pageIndex: number, format: Format): Promise<{
    bounds: Bounds;
    scale: number;
}>;
//# sourceMappingURL=browser.d.ts.map