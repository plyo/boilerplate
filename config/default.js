const PostGraphileConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
// const path = require('path');

module.exports = {
  app: {
    port: process.env.PORT || 3000,
    suppressErrorStack: process.env.SUPPRESS_ERROR_STACK || false,
  },
  db: {
    user: 'plyo_boilerplate',
    host: 'localhost',
    database: 'plyo',
    password: 'test',
    port: 5432,
    schema: 'public',
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
  postgraphile: {
    watchPg: false,
    schemaName: 'public',
    pgDefaultRole: '', // TO BE DEFINED
    dynamicJson: true,
    showErrorStack: true,
    graphiql: true,
    ignoreRBAC: false,
    appendPlugins: [PostGraphileConnectionFilterPlugin],

    // uncomment to generate new schema file
    // exportJsonSchemaPath: require('path').resolve(__dirname, '../graphql.schema.json'),
  },
};
