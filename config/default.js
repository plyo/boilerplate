module.exports = {
  app: {
    port: process.env.PORT || 3000,
    suppressErrorStack: process.env.SUPPRESS_ERROR_STACK || false,
  },

  logger: {
    name: process.env.ENV_NAME || 'local',
    prettyPrint: process.env.JSON_LOGS
      ? false
      : {
          levelFirst: true,
          forceColor: true,
        },
    level: process.env.LOG_LEVEL || 'debug',
    base: {
      nodeEnv: process.env.NODE_ENV,
    },
  },
};
