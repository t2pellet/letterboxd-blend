import logger from 'jet-logger';
import socketRoutes from '@/routes/socket';
import io from '@/socket';
import EnvVars from '@/constants/env';
import server from '@/server';

const SERVER_START_MSG = 'Socket.IO server started on port: ' + EnvVars.Port.toString();
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
});
io.on('connection', (socket) => {
  logger.info('Socket.IO connection');
  socketRoutes(socket);
});
