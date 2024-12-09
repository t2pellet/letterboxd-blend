import { Server } from 'socket.io';
import EnvVars from '@/constants/env';
import { NodeEnvs } from '@/constants/misc';
import server from '@/server';

const io = new Server(server, {
  cors: { origin: EnvVars.NodeEnv !== NodeEnvs.Production },
});

export default io;
