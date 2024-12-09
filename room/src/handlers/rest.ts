import { RequestHandler } from 'express';
import RoomsService from '@/services/rooms';
import io from '@/socket';

const roomsService = RoomsService.getInstance();

const onGetRoom: RequestHandler = (req, res) => {
  const { id } = req.params;
  const result = roomsService.getRoom(id);
  if (!result) {
    res.status(400).send({ errors: ['Room does not exist'] });
  }
  res.status(200).send(result.toApi());
};

const onPostRoom: RequestHandler = (req, res) => {
  const user = req.header('X-Letterboxd-User') as string;
  const room = roomsService.createRoom(user);
  res.status(200).send(room.toApi());
};

const onDeleteRoom: RequestHandler = (req, res) => {
  const { id } = req.params;
  if (!roomsService.hasRoom(id)) {
    res.status(400).send({ errors: ['Room does not exist'] });
  }
  roomsService.deleteRoom(id);
  res.sendStatus(200);
};

const onPutRoom: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { movies } = req.body;
  if (!roomsService.hasRoom(id)) {
    res.status(400).send({ errors: ['Room does not exist'] });
  }
  const room = roomsService.getRoom(id);
  room.setMovies(movies);
  res.status(200).send(room.toApi());
};

const onStartRoom: RequestHandler = (req, res) => {
  const { id } = req.params;
  const user = req.header('X-Letterboxd-User') as string;
  if (!roomsService.hasRoom(id)) {
    res.status(400).send({ errors: ['Room does not exist'] });
  }
  const room = roomsService.getRoom(id);
  if (room.owner !== user) {
    res.status(400).send({ errors: ['User does not have permissions to start room'] });
  }
  if (room.started) {
    res.status(400).send({ errors: ['Room already started'] });
  }
  room.start();
  io.to(id).emit('start');
};

export default {
  onGetRoom,
  onPostRoom,
  onDeleteRoom,
  onPutRoom,
  onStartRoom,
};
