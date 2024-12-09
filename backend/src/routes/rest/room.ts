import express from "express";
import { param } from "express-validator";
import validate from "@/middlewares/validate";
import roomHandlers from "@/handlers/room";

const router = express.Router();
const TOKEN_LENGTH = 8;

router.post("/", roomHandlers.createRoomHandler);
router.get(
  "/:id",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.getRoomHandler,
);
router.post(
  "/:id/start",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.startRoomHandler,
);
router.delete(
  "/:id",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.deleteRoomHandler,
);

export default router;
