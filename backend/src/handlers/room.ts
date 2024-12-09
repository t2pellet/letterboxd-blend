import { RequestHandler } from "express";
import getData from "@/utils/data";
import RoomService from "@/services/room";
import getBlendedList from "@/utils/blend";
import TMDB from "@/services/tmdb";
import { RouteError } from "@/types";
import { HttpStatusCodes } from "@/constants/http";

type RoomParams = { id: string };
const createRoomHandler: RequestHandler = async (req, res) => {
  const user = req.header("X-Letterboxd-User") as string;
  // Create Room
  const service = new RoomService(user);
  const result = await service.createRoom();
  res.status(200).send(result);
};

const getRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const result = await service.getRoom(id);
  let ids = result.movies;

  const movies = await Promise.all(
    ids.map((id) =>
      TMDB.movie
        .getDetails({ pathParameters: { movie_id: id } })
        .then((r) => r.data),
    ),
  );
  res.status(200).send({ ...result, movies });
};

const deleteRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  const result = await service.deleteRoom(id);
  res.status(200).send(result);
};

const startRoomHandler: RequestHandler = async (req, res) => {
  const { id } = getData<RoomParams>(req);
  const user = req.header("X-Letterboxd-User") as string;
  const service = new RoomService(user);
  // Get blended movies, add to room
  const room = await service.getRoom(id);
  if (!room.users.length) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "Cannot start empty room",
    );
  }
  const movies = await getBlendedList({ names: room.users });
  if (!movies.length) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, "Empty blend");
  }
  const ids = movies.map((m) => m.id);
  await service.updateRoom(id, ids);
  // Start room
  await service.startRoom(id);
};

export default {
  createRoomHandler,
  getRoomHandler,
  deleteRoomHandler,
  startRoomHandler,
};
