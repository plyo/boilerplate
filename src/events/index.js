const _ = require('lodash');

const eventType = require('./types');

function resolveHandler(event) {
  // eslint-disable-next-line
  const handler = require(`./handlers/${event}`);

  if (!_.isFunction(handler)) {
    throw new Error(`Invalid event handler resolved for event ${event}. Expected function`);
  }

  return handler;
}

/**
 *  Sometimes it might be useful to ignore particular events for some reasons(debugging, deprecation and etc.)
 *  Put event name here so no handler would be registered.
 */
const temporaryDisabledTypes = [];
const eventTypes = _.without(_.values(eventType), ...temporaryDisabledTypes);

/**
 *  Dynamically building up event handler descriptor, which has following format
 *  {
 *     [eventType1]: function handleEventType1Event(payload) {...}
 *  }
 */
module.exports = _.zipObject(eventTypes, _.map(eventTypes, (type) => resolveHandler(type)));
