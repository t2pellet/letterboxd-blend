import { Socket } from 'socket.io';
import socketHandlers from '@/handlers/socket';

export default function handleRoutes(socket: Socket) {
  socket.on('join', socketHandlers.onRoomJoin);
  socket.on('vote', socketHandlers.onRoomRate);
  socket.on('leave', socketHandlers.onRoomLeave);
  socket.on('disconnect', () => socketHandlers.onRoomLeave(socket));
  socket.on('error', () => socketHandlers.onRoomLeave(socket));
  socket.on('start', socketHandlers.onRoomStart);
}
