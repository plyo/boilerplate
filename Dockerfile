FROM node:8.11.3-alpine

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY package.json yarn.lock /usr/src/app/
RUN yarn install --production && rm -rf /usr/local/share/.cache

COPY . /usr/src/app/
CMD entrypoint.sh
