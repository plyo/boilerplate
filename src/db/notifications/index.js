const eventHandlers = require('../../events');
const listenDbNotifications = require('./listen');

module.exports = function init() {
  return listenDbNotifications(eventHandlers);
};
