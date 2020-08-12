module.exports = {
  rollup(config) {
    return {
      ...config,
      output: {
        ...config.output,
        globals: {
          preact: "Preact",
          mobx: "mobx"
        }
      }
    }
  }
}
