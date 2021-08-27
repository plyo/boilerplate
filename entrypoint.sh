#!/bin/sh

# For production-like environments we need to pipe json logs to elasticsearch (to present them in kibana) as well
# as print prettified logs into stdout. Here we create named file descriptor to pipe logs into it with help of `tee`.
# These logs are prettified by pino and goes into stdout because of `cat`
pipe=/tmp/logs_pipe
if [ ! -p "${pipe}" ]; then
  mkfifo ${pipe}
fi

< ${pipe} ./node_modules/.bin/pino &

# tee forks logs into `$pipe` and elasticsearch
node build/server.js | tee ${pipe} | ./node_modules/.bin/pino-elasticsearch --host "${ELASTIC_HOST}"
