const { createPostGraphileSchema, withPostGraphileContext } = require('postgraphile');
const { Pool } = require('pg');
const config = require('config');
const { graphql } = require('graphql');
const _ = require('lodash');

function queryExecutorFactory({
  dbConfig,
  postgraphileConfig,
  pgDefaultRole = postgraphileConfig.pgDefaultRole,
}) {
  const pgPool = new Pool(dbConfig);
  const schemaResolver = _.once(() =>
    createPostGraphileSchema(pgPool, dbConfig.schema, postgraphileConfig),
  );

  return {
    execRaw: async (query) => pgPool.query(query),
    exec: async function execGqlQuery({ query, variables, operationName, failOnError = true }) {
      const result = await withPostGraphileContext(
        {
          pgPool,
          pgDefaultRole,
        },
        async (context) =>
          graphql(await schemaResolver(), query, null, { ...context }, variables, operationName),
      );

      if (result && result.errors && failOnError) {
        throw new Error(result.errors);
      }

      return result;
    },
  };
}

module.exports.default = queryExecutorFactory({
  dbConfig: config.get('db'),
  postgraphileConfig: config.get('postgraphile'),
});
module.exports.factory = queryExecutorFactory;
