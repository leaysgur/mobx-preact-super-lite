module.exports = {
  rollup(config) {
    return {
      ...config,
      output: {
        ...config.output,
        globals: {
          preact: "preact",
          "preact/hooks": "preactHooks",
          mobx: "mobx",
        },
      },
    };
  },
};
