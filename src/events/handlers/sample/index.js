const logger = require('../../../tools/logger');

/**
 *  Hint: export handler using named function expression to expose it's name to error stack.
 *  pattern: handle${EventType}Event
 */
module.exports = function handleSampleEvent(payload) {
  logger.log('hey, this is sample event handler', payload);
};
