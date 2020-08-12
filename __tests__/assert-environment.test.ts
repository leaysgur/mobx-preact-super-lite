afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

it("throws if preact is not installed", () => {
  jest.mock("preact", () => ({}));
  expect(() => require("../src/assert-environment.ts")).toThrowError();
});

it("throws if mobx is not installed", () => {
  jest.mock("preact/hooks", () => ({ useState: true }));
  jest.mock("mobx", () => ({}));
  expect(() => require("../src/assert-environment.ts")).toThrowError();
});
