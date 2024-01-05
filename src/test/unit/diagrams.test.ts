import {vi} from "vitest";
import Exporter, {Format} from "../../index";

vi.mock("playwright-firefox", async () => {
	const playwright = {...await vi.importActual("playwright-firefox")};

	playwright.Browser = vi.fn(() => {
		return {
			close: vi.fn(),
			newPage: vi.fn(() => {
				// @ts-ignore
				return Promise.resolve(new playwright.Page());
			}),
		};
	});

	playwright.Page = vi.fn(() => {
		return {
			evaluate: vi.fn(),
			goto: vi.fn(),
			locator: vi.fn(() => {
				// @ts-ignore
				return new playwright.Locator();
			}),
			on: vi.fn(),
			screenshot: vi.fn(),
			setViewportSize: vi.fn(),
		};
	});

	playwright.Locator = vi.fn(() => {
		return {
			waitFor: vi.fn(() => Promise.resolve()),
			getAttribute: vi.fn((attribute) => {
				switch (attribute) {
					case "data-bounds-x": return Promise.resolve(0);
					case "data-bounds-y": return Promise.resolve(0);
					case "data-bounds-width": return Promise.resolve(640);
					case "data-bounds-height": return Promise.resolve(480);
					case "data-scale": return Promise.resolve(1);
					default: return Promise.resolve(2);
				}
			}),
		};
	});

	// @ts-ignore
	playwright.firefox.launch = vi.fn(() => {
		// @ts-ignore
		return Promise.resolve(new playwright.Browser());
	});

	return playwright;
});

describe("launchExporter", () => {
	it("forwards browser console messages", async () => {
		expect.assertions(2);

		const exporter = await Exporter.launch();
		if (!exporter.page) {
			expect(exporter.page).not.toEqual(null);
			return;
		}

		expect(exporter.page.on).toHaveBeenCalledTimes(1);
		expect(exporter.page.on).toHaveBeenCalledWith("console", expect.any(Function));
	});

	it("sets up a timeout to close the browser after a timeout", async () => {
		vi.useFakeTimers();
		vi.spyOn(global, "setTimeout");
		expect.assertions(4);

		const callback = vi.fn();

		await Exporter.launch({
			timeout: 500,
			callback,
		});
		vi.runAllTimers();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describe("render", () => {
	it("calls render and retrieves result information from the DOM", async () => {
		expect.assertions(2);

		const args: [string, number, Format] = ["", 0, Format.PNG];
		const exporter = await Exporter.launch();
		if (!exporter.page) {
			expect(exporter.page).not.toEqual(null);
			return;
		}

		await exporter.render(...args);

		expect(exporter.page.evaluate).toHaveBeenCalledTimes(1);
		expect(exporter.page.evaluate).toHaveBeenCalledWith(expect.any(Function), args);
	});
});

describe("exportImage", () => {
	it("scales the viewport according to the bounds", async () => {
		expect.assertions(2);

		const exporter = await Exporter.launch();
		if (!exporter.page) {
			expect(exporter.page).not.toEqual(null);
			return;
		}
		await exporter.exportImage("", 0, Format.PNG);

		expect(exporter.page.setViewportSize).toHaveBeenCalledTimes(1);
		expect(exporter.page.setViewportSize).toHaveBeenCalledWith({
			width: 642,
			height: 482,
		});
	});

	it("takes a screenshot with the appropriate options", async () => {
		expect.assertions(2);

		const exporter = await Exporter.launch();
		if (!exporter.page) {
			expect(exporter.page).not.toEqual(null);
			return;
		}
		await exporter.exportImage("", 0, Format.PNG);

		expect(exporter.page.screenshot).toHaveBeenCalledTimes(1);
		expect(exporter.page.screenshot).toHaveBeenCalledWith({
			type: "png",
			width: 642,
			height: 482,
		});
	});

	it("closes the browser without invoking the timeout callback", async () => {
		vi.useFakeTimers();
		vi.spyOn(global, "clearTimeout");
		expect.assertions(3);

		const callback = vi.fn();

		const exporter = await Exporter.launch();
		if (!exporter.page) {
			expect(exporter.page).not.toEqual(null);
			return;
		}
		await exporter.exportImage("", 0, Format.PNG);
		await exporter.close();

		expect(exporter.browser.close).toHaveBeenCalledTimes(1);
		expect(clearTimeout).toHaveBeenCalledWith(exporter.timeout);
		expect(callback).toHaveBeenCalledTimes(0);
	});
});
