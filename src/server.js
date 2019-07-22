const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { postgraphile } = require('postgraphile');
const pinoHttp = require('pino-http');
const config = require('config');
const logger = require('./tools/logger');

const listenDbNotifications = require('./db/notifications');

listenDbNotifications().catch((err) => {
  logger.error(`Error occurred setting up db notifications listeners: `, err);
  process.exit(1);
});

// Configure HTTP server
const server = express();

// Register Node.js/Express middleware
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(pinoHttp({ logger }));

server.use('/', require('./api/hello'));

server.get('/*', (req, res) => res.sendStatus(404));
server.use(require('./middlewares/errorHandler'));

// for development purposes we run graphiql on /graphiql
if (config.get('postgraphile.graphiql')) {
  server.use(postgraphile(config.get('db'), config.get('db.schema'), config.get('postgraphile')));
}

const port = config.get('app.port');
server.listen(port, () => {
  logger.info(`The server is running at http://localhost:${port}/`);
});

module.exports = server;
