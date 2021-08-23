import * as type from './types';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import pinoHttp from 'pino-http';
import config from 'config';
import logger from './tools/logger';
import hello from './api/hello';
import {errorHandler} from './middlewares/errorHandler';

// Configure HTTP server
const server = express();

// Register Node.js/Express middleware
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(pinoHttp({logger}));

server.use('/', hello);

const pageNotFoundCallback = (req: type.IClientRequest, res: type.IServerResponse): type.IServerResponse => {
    return res.sendStatus(404);
}

server.get('/*', pageNotFoundCallback);
// @ts-ignore
server.use(errorHandler);

const port = config.get('app.port');
server.listen(port, () => {
    logger.info(`The server is running at http://localhost:${port}/`);
});

export default server;
