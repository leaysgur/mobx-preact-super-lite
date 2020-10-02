afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

it("throws if react is not installed", () => {
  jest.mock("preact/hooks", () => ({}));
  expect(() =>
    require("../../src/utils/assert-environment.ts")
  ).toThrowErrorMatchingInlineSnapshot(
    `"mobx-preact-super-lite requires Preact with Hooks support"`
  );
});

it("throws if mobx is not installed", () => {
  jest.mock("preact/hooks", () => ({ useState: true }));
  jest.mock("mobx", () => ({}));
  expect(() =>
    require("../../src/utils/assert-environment.ts")
  ).toThrowErrorMatchingInlineSnapshot(
    `"mobx-preact-super-lite@3 requires MobX at least version 6 to be available"`
  );
});
