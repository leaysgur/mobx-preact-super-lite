module.exports = {
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: [require.resolve("./jest.setup.js")],
};
