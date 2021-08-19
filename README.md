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

## How to use
- Work in the src directory
- Write your code in TypeScript
- Run the application by `yarn start` - it uses ts-node to run locally
- You can use `yarn build` to check production build
- Whenever you change your ts files the running application will be automatically restarted by nodemon
