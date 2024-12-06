import { Server } from 'socket.io';
import EnvVars from '@/constants/env';
import { NodeEnvs } from '@/constants/misc';
import server from '@/server';
import logger from 'jet-logger';
import socketRoutes from '@/routes/socket';

const io = new Server(server, {
  cors: { origin: EnvVars.NodeEnv !== NodeEnvs.Production },
});
io.on('connection', (socket) => {
  logger.info('connect');
  socket.join(socket.data.id);
  socketRoutes(socket);
});

export default io;
