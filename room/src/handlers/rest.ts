import { RequestHandler } from 'express';
import RoomsService from '@/services/rooms';

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
  const movies = req.body.movies;
  const user = req.header('X-Letterboxd-User') as string;
  const room = roomsService.createRoom(user, movies);
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

export default {
  onGetRoom,
  onPostRoom,
  onDeleteRoom,
};
