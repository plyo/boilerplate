/**
 * @fileOverview
 *
 * @see https://github.com/vitaly-t/pg-promise/wiki/Robust-Listeners
 */
const config = require('config');
const logger = require('../../tools/logger');
const Promise = require('bluebird');
const pgPromise = require('pg-promise');

const pgp = pgPromise();
const db = pgp(config.get('db'));

async function reconnect({ delay = 1000, maxAttempts = 1, onLost }) {
  const retryAttemptsLeft = maxAttempts - 1;

  try {
    const connection = await db.connect({ direct: true, onLost });

    return connection;
  } catch (error) {
    if (retryAttemptsLeft <= 0) {
      logger.error(
        error,
        'Failed to re-establish db connection, exceeded retry attempts, aborting...',
      );
      throw error;
    }

    return Promise.delay(delay).then(() =>
      reconnect({ delay, maxAttempts: retryAttemptsLeft, onLost }),
    );
  }
}

async function setListeners({ connection, eventHandlers }) {
  connection.client.on('notification', (data) => {
    logger.debug(data, 'Notification received');
    try {
      const payload = JSON.parse(data.payload);
      const handler = eventHandlers[data.channel];

      if (!handler) {
        logger.warn(`No handler associated with event: ${data.channel}. Skipping...`);

        return;
      }

      handler(payload);
    } catch (e) {
      logger.error(e, 'Cannot parse notification payload');
    }
  });

  return Promise.map(Object.keys(eventHandlers), (eventType) =>
    connection.none('LISTEN $1~', eventType),
  );
}

async function onConnectionLost({ error, connection, eventHandlers }) {
  try {
    logger.error(error, 'Connectivity problem');
    connection.client.removeAllListeners('notification');
    const onLost = (e, c) => onConnectionLost({ error: e, connection: c, eventHandlers });
    const reestablishedConnection = await reconnect({ delay: 5000, maxAttempts: 5, onLost });
    await setListeners({ connection: reestablishedConnection, eventHandlers });

    logger.info('Connection successfully re-established');
  } catch (e) {
    logger.error(e);

    // let docker to restart the service
    process.exit(1);
  }
}

async function listenDbNotifications(eventHandlers) {
  const onLost = (error, c) => onConnectionLost({ error, connection: c, eventHandlers });

  const connection = await reconnect({ onLost });
  await setListeners({ connection, eventHandlers });
  logger.info('DB notification listeners successfully registered');

  return connection;
}

module.exports = listenDbNotifications;
