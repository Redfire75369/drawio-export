import {Format, launchExporter} from "../../src";
import {render} from "../../src/browser";
import exportImage from "../../src/export/image";

jest.mock("puppeteer", () => {
	const puppeteer = {...jest.requireActual("puppeteer")};

	puppeteer.Browser = jest.fn(() => {
		return {
			close: jest.fn(),
			newPage: jest.fn(() => {
				return Promise.resolve(new puppeteer.Page());
			}),
		};
	});

	puppeteer.Page = jest.fn(() => {
		return {
			evaluate: jest.fn(),
			goto: jest.fn(),
			on: jest.fn(),
			screenshot: jest.fn(),
			setViewport: jest.fn(),
			waitForSelector: jest.fn(() => {
				return Promise.resolve(new puppeteer.ElementHandle());
			}),
		};
	});

	puppeteer.ElementHandle = jest.fn(() => {
		return {
			evaluate: jest.fn(() => {
				return Promise.resolve({
					bounds: {
						x: 0,
						y: 0,
						width: 640,
						height: 480,
					},
					scale: 1,
				});
			}),
		};
	});

	puppeteer.launch = jest.fn(() => {
		return Promise.resolve(new puppeteer.Browser());
	});

	return puppeteer;
});

describe("launchExporter", () => {
	it("forwards browser console messages", async () => {
		expect.assertions(2);

		const {page} = await launchExporter();

		expect(page.on).toHaveBeenCalledTimes(1);
		expect(page.on).toHaveBeenCalledWith("console", expect.any(Function));
	});

	it("sets up a timeout to close the browser after a timeout", async () => {
		jest.useFakeTimers();
		jest.spyOn(global, "setTimeout");
		expect.assertions(4);

		const callback = jest.fn();

		await launchExporter({
			timeout: 500,
			callback,
			debug: true
		});
		jest.runAllTimers();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describe("render", () => {
	it("calls render and retrieves result information from the DOM", async () => {
		expect.assertions(2);

		const args = ["", 0, Format.PNG];
		const {page} = await launchExporter({debug: true});
		await render(page, true, ...args);

		expect(page.evaluate).toHaveBeenCalledTimes(1);
		expect(page.evaluate).toHaveBeenCalledWith(expect.any(Function), args);
	});
});

describe("exportImage", () => {
	it("scales the viewport according to the bounds", async () => {
		expect.assertions(2);

		const exporter = await launchExporter({debug: true});
		await exportImage(exporter, "", 0, Format.PNG);

		expect(exporter.page.setViewport).toHaveBeenCalledTimes(1);
		expect(exporter.page.setViewport).toHaveBeenCalledWith({
			width: 642,
			height: 482,
		});
	});

	it("takes a screenshot with the appropriate options", async () => {
		expect.assertions(2);

		const exporter = await launchExporter({debug: true});
		await exportImage(exporter, "", 0, Format.PNG);

		expect(exporter.page.screenshot).toHaveBeenCalledTimes(1);
		expect(exporter.page.screenshot).toHaveBeenCalledWith({
			type: "png",
			width: 642,
			height: 482,
		});
	});

	it("closes the browser without invoking the timeout callback", async () => {
		jest.useFakeTimers();
		jest.spyOn(global, "clearTimeout");
		expect.assertions(3);

		const callback = jest.fn();

		const exporter = await launchExporter({
			timeout: 500,
			callback,
			debug: true
		});
		await exportImage(exporter, "", 0, Format.PNG);

		expect(exporter.browser.close).toHaveBeenCalledTimes(1);
		expect(clearTimeout).toHaveBeenCalledWith(exporter.timeout);
		expect(callback).toHaveBeenCalledTimes(0);
	});
});
