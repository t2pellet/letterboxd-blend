import { RequestHandler } from "express";
import getData from "@/utils/data";
import RoomService from "@/services/room";
import getBlendedList from "@/utils/blend";

type CreateRoomParams = { id: string };
const createRoomHandler: RequestHandler = async (req, res) => {
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const movies = await getBlendedList({ names: [user] });
  const ids = movies.map((m) => m.id);
  const result = await service.createRoom(ids);
  // TODO : uh oh wuh oh im gonna be stuck with just one user's movies
  res.status(200).send(result);
};

const getRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<CreateRoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const result = await service.getRoom(id);
  res.status(200).send(result);
};

const deleteRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<CreateRoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const result = await service.deleteRoom(id);
  res.status(200).send(result);
};

export default {
  createRoomHandler,
  getRoomHandler,
  deleteRoomHandler,
};
