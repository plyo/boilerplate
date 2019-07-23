# Plyo Boilerplate
Boilerplate for node.js based micro service.

## Configuration

We use [config.js](https://github.com/lorenwest/node-config). Follow its documentation to understand configs approach.

## Features
It includes:
- configured eslint
- precommit hook checking all modified js files with eslint and fixing code style with prettier
- simple express application with example of API endpoint
- Docker build for production
- docker-compose for development
- [db notification listen mechanism](#db-notifications-listening)
- hot reload
- CircleCI config
- Logger with support to pipe logs into elasticsearch

### DB notifications listening

To register an event handler few steps should be completed:
 - add event type entry in [types](https://github.com/plyo/boilerplate/tree/master/src/events/types.js) definition
 - add event handler folder to [handlers registry](https://github.com/plyo/boilerplate/tree/master/src/events/handlers) following several rules:
   - event handler folder name ***must have same name as event type***
   - handler folder must contain `index.js` file with exported handler function, having following semantics:
      ```js
          // EventType should be replaced with event name
          module.exports = function handleEventTypeEvent(payload) {}
      ```


