module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "stackoverflow",
    },
    binary: {
      version: "4.0.3",
      skipMD5: true,
    },
    autoStart: false,
  },
};
