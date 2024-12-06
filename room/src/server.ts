import express from 'express';
import routes from '@/routes/rest';
import EnvVars from '@/constants/env';
import logger from 'jet-logger';
import { createServer } from 'node:http';

const app = express();
app.use('/api', express.json());
app.use('/api', routes);

const SERVER_START_MSG = 'Socket.IO server started on port: ' + EnvVars.Port.toString();
const server = createServer(app);
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});

export default server;
