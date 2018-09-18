const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pinoHttp = require('pino-http');
const config = require('config');
const logger = require('./tools/logger');

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

const port = config.get('app.port');
server.listen(port, () => {
  logger.info(`The server is running at http://localhost:${port}/`);
});

module.exports = server;
