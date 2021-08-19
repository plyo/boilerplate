# Plyo Boilerplate
Boilerplate for node.js based microservice.

## Configuration

We use [config.js](https://github.com/lorenwest/node-config). Follow its documentation to understand configs approach.

## Features
It includes:
- configured eslint
- precommit hook checking all modified js files with eslint and fixing code style with prettier
- simple express application with example of API endpoint
- Docker build for production
- docker-compose for development
- hot reload
- CircleCI config
- Logger with support to pipe logs into elasticsearch

##How to use
- Work in the src directory
- Write your code in TypeScript
- When ready, run "yarn build" - it will transpile ts sources into modern js files
- Run the application by "yarn start"
- Your application will be served from "build" directory
- Whenever you change your ts files and re-run "yarn build" the running application will be automatically restarted