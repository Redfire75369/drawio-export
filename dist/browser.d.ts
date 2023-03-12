import type { Browser, Page } from "puppeteer";
export interface LaunchOptions {
    timeout?: number;
    callback?: (browser: Browser) => () => Promise<void>;
    debug?: boolean;
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
export declare function render(page: Page, debug?: boolean, ...args: any[]): Promise<{
    bounds: Bounds;
    scale: number;
}>;
//# sourceMappingURL=browser.d.ts.map