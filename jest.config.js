module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  setupFilesAfterEnv: [require.resolve("./jest.setup.js")],
  verbose: false,
  coverageDirectory: "coverage",
};
