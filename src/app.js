const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const pinoHttp = require("pino-http");
const logger = require("./tools/logger");
const config = require("./config/config");

// Configure HTTP server
const app = express();

// Register Node.js/Express middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For hot-reload purposes we should close all the connection immediately, else `server.close`
// takes much more time (2m by default for keep-alive connections)
if (!config.app.keepAliveConnection) {
  app.use((req, res, next) => {
    res.set("Connection", "close");
    next();
  });
}

// to enable garbage collector API run node with `--expose-gc` option. Use it only if you
// are looking for memory leaks, never use on prod
if ("gc" in global) {
  app.use((req, res, next) => {
    let stats = app.get("stats");
    if (!stats) {
      stats = [];
      app.set("stats", stats);
    }
    global.gc();
    stats.push((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(3));
    next();
  });
}

app.use(
  pinoHttp({
    logger
  })
);

app.use("/", require("./api/hello"));

app.get("/*", (req, res) => res.sendStatus(404));
app.use(require("./middlewares/errorHandler"));

module.exports = app;
