import { Socket } from 'socket.io';
import RoomsService from '@/services/rooms';

const roomService = RoomsService.getInstance();

function onRoomJoin(socket: Socket) {
  const { id, user } = socket.data;
  if (!id || !user) {
    return socket.emit('errors', ['Missing socket information']);
  }
  if (!roomService.hasRoom(id)) return socket.emit('errors', ['Room does not exist']);
  roomService.getRoom(id).addUser(user);
  socket.emit('success');
  socket.to(id).emit('join', user);
}

function onRoomLeave(socket: Socket) {
  const { id, user } = socket.data;
  if (!id || !user) {
    return socket.emit('errors', ['Missing socket information']);
  }
  if (!roomService.hasRoom(id)) return socket.emit('errors', ['Room does not exist']);
  roomService.getRoom(id).removeUser(user);
  socket.emit('success');
  socket.to(id).emit('leave', user);
}

function onRoomRate(socket: Socket) {
  const { id, user, movie, vote } = socket.data;
  if (!id || !user || !movie || !vote) {
    return socket.emit('error', ['Missing socket information']);
  }
  if (!roomService.hasRoom(id)) return socket.emit('errors', ['Room does not exist']);
  const room = roomService.getRoom(id);
  room.voteForUser(user, movie, vote);
  socket.emit('success');
  const match = room.match;
  if (match) {
    socket.to(id).emit('match', match);
  }
}

export default { onRoomJoin, onRoomLeave, onRoomRate };