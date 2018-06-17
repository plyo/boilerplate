const pino = require("pino");
const config = require("../config/config");

const logger = pino(config.logger);

let id = 0;
const timers = {};

logger.startTimer = () => {
  const profiler = {
    timerId: `timer${id}`,
    done(meta) {
      const start = timers[profiler.timerId];
      if (!start) {
        return;
      }
      const duration = new Date() - start;
      logger.info({
        ...meta,
        duration
      });
      delete timers[profiler.timerId];
    },
    getDuration() {
      return new Date() - timers[profiler.timerId];
    }
  };
  id += 1;
  timers[profiler.timerId] = new Date();
  return profiler;
};

module.exports = logger;
