const { writeFile: writeFileAsync } = require("fs");
const { promisify } = require("util");
const logger = require("./tools/logger");
const config = require("./config/config");

const writeFile = promisify(writeFileAsync);

let app;
let server;
let reload = Promise.resolve();

// Launch Node.js server
function launch(callback) {
  app = require("./app"); // eslint-disable-line global-require
  app.set("port", config.app.port);
  server = app.listen(app.get("port"), () => {
    logger.info(
      `The server is running at http://localhost:${app.get("port")}/`
    );
    if (callback) callback();
  });
}

// Shutdown Node.js server and database clients
async function shutDown() {
  const stats = app.get("stats");
  if (stats) {
    await writeFile("stats.txt", stats.join("\n"), "utf8");
  }

  if (server) {
    await new Promise(resolve =>
      server.close(() => {
        resolve();
      })
    );
  }
}

function handleError(err) {
  logger.error(err.stack);
}

// Graceful shutdown
process.once("SIGTERM", () => shutDown().then(() => process.exit()));

// In development mode the app is launched with an IPC channel
if (process.channel) {
  // Prevent exiting the process in development mode
  process.on("uncaughtException", handleError);
  // Restart the server on code changes (see scripts/run.js)
  process.on("message", message => {
    if (message === "reload") {
      reload = reload.then(() => shutDown()).then(() => {
        Object.keys(require.cache).forEach(key => {
          if (key.indexOf("node_modules") === -1) delete require.cache[key];
        });
        return new Promise(resolve => launch(resolve)).catch(handleError);
      });
    }
  });
  process.on("disconnect", () => process.emit("SIGTERM"));
}

process.on("unhandledRejection", handleError);

launch();
