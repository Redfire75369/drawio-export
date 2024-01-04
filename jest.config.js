/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	reporters: ["default"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
